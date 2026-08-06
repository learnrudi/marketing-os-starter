const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  LevelFormat,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  PageNumber,
  PageBreak,
  TableLayoutType,
  VerticalAlign,
} = require('docx');
const { ensureOutputPath, readSpec, safeFileStem } = require('./spec_utils.cjs');

const [specPath, outputPathArg] = process.argv.slice(2);
if (!specPath) {
  console.error('Usage: node build_design_system_doc.cjs <spec.json> [output.docx]');
  process.exit(1);
}

const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;
const MARGIN = 1440;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
const TABLE_INDENT = 120;

function heading(text, level, options = {}) {
  return new Paragraph({
    heading: level,
    keepNext: true,
    ...options,
    children: [new TextRun(String(text))],
  });
}

function body(text, options = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    children: [new TextRun({ text: String(text), ...options })],
  });
}

function labeledBody(label, text) {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun(String(text || '')),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 80, line: 300 },
    children: [new TextRun(String(text))],
  });
}

function spacer(after = 180) {
  return new Paragraph({ spacing: { after }, children: [new TextRun('')] });
}

function runningHeader(orgName) {
  return new Header({
    children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: `${orgName} Design System — Reference`, size: 16, color: '888888', font: 'Calibri' })],
    })],
  });
}

function runningFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Page ', size: 16, font: 'Calibri' }), new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Calibri' })],
    })],
  });
}

function addBullets(children, items) {
  (items || []).forEach((item) => children.push(bullet(item)));
}

function makeBorders() {
  const border = { style: BorderStyle.SINGLE, size: 2, color: 'DDDDDD' };
  return { top: border, bottom: border, left: border, right: border };
}

function tableCell(text, width, options = {}) {
  const { bold = false, fill, color, font = 'Calibri' } = options;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: makeBorders(),
    ...(fill ? { shading: { fill, type: ShadingType.CLEAR } } : {}),
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: String(text || ''), bold, color, font })] })],
  });
}

function colorTable(colors, accent) {
  const widths = [1080, 2760, 1560, 3960];
  const header = new TableRow({
    cantSplit: true,
    children: ['', 'Name / Role', 'Hex', 'Used For'].map((label, index) => tableCell(label, widths[index], {
      bold: Boolean(label),
      fill: accent,
      color: 'FFFFFF',
    })),
  });
  const rows = (colors || []).map((color) => new TableRow({
    cantSplit: true,
    children: [
      tableCell('', widths[0], { fill: color.hex }),
      tableCell(color.name, widths[1], { bold: true }),
      tableCell(`#${color.hex}`, widths[2], { font: 'Courier New' }),
      tableCell(color.usage, widths[3]),
    ],
  }));
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    indent: { size: TABLE_INDENT, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    rows: [header, ...rows],
  });
}

function specTable(rows) {
  const widths = [2700, 6660];
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    indent: { size: TABLE_INDENT, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    rows: (rows || []).map((item) => new TableRow({
      cantSplit: true,
      children: [
        tableCell(item.name || item[0], widths[0], { bold: true, fill: 'F2F2F2' }),
        tableCell(item.description || item.spec || item[1], widths[1]),
      ],
    })),
  });
}

function sourceTable(rows) {
  const widths = [2160, 7200];
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    indent: { size: TABLE_INDENT, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: widths,
    rows: (rows || []).map((item) => new TableRow({
      cantSplit: true,
      children: [
        tableCell(item.label || 'Source page', widths[0], { bold: true, fill: 'F2F2F2' }),
        tableCell(`${item.url}${item.capturedAt ? ` — captured ${item.capturedAt}` : ''}`, widths[1]),
      ],
    })),
  });
}

function addPromptSection(children, prompts) {
  if (!(prompts || []).length) return;
  children.push(heading('Asset Generation Prompts', HeadingLevel.HEADING_1, { pageBreakBefore: true }));
  children.push(body('Generate these as text-free layers. Add approved copy, logos, and icons afterward as editable SVG or native design-tool elements.', { italics: true, color: '666666' }));
  prompts.forEach((prompt, index) => {
    children.push(heading(`${index + 1}. ${prompt.name}`, HeadingLevel.HEADING_2));
    children.push(labeledBody('Category', prompt.category));
    children.push(labeledBody('Intended use', prompt.intendedUse));
    children.push(labeledBody('Aspect ratios', (prompt.aspectRatios || []).join(', ') || 'Choose for placement'));
    children.push(labeledBody('Palette', (prompt.palette || []).map((hex) => `#${hex}`).join(', ') || 'Design-system palette'));
    children.push(labeledBody('Prompt', prompt.prompt));
    children.push(labeledBody('Negative prompt', prompt.negativePrompt || 'No text, letters, logos, or watermarks.'));
    if (prompt.layeringNotes) children.push(labeledBody('Layering notes', prompt.layeringNotes));
  });
}

function addMarketingCopy(children, copy) {
  if (!copy || !Object.keys(copy).length) return;
  const derived = copy.derivedCopy || {};
  children.push(heading('Marketing Copy System', HeadingLevel.HEADING_1, { pageBreakBefore: true }));
  children.push(body('Observed excerpts are sourced evidence. Derived copy is new draft language and requires brand, factual, and legal review.', { italics: true, color: '666666' }));

  if ((copy.voiceTraits || []).length) {
    children.push(heading('Voice Traits', HeadingLevel.HEADING_2));
    addBullets(children, copy.voiceTraits);
  }
  if ((copy.audiences || []).length) {
    children.push(heading('Audiences', HeadingLevel.HEADING_2));
    addBullets(children, copy.audiences);
  }
  if ((copy.messagingPillars || []).length) {
    children.push(heading('Messaging Pillars', HeadingLevel.HEADING_2));
    copy.messagingPillars.forEach((pillar) => {
      children.push(body(pillar.name, { bold: true }));
      children.push(body(pillar.description));
      if (pillar.evidence) children.push(labeledBody('Evidence', pillar.evidence));
      if ((pillar.sourceUrls || []).length) children.push(labeledBody('Sources', pillar.sourceUrls.join(', ')));
    });
  }
  if ((copy.sourceCopy || []).length) {
    children.push(heading('Observed Source Copy', HeadingLevel.HEADING_2));
    copy.sourceCopy.forEach((item) => {
      children.push(body(`“${item.text}”`, { italics: true }));
      children.push(body(`${item.location || 'Website'} — ${item.sourceUrl}${item.intendedUse ? ` — ${item.intendedUse}` : ''}`, { size: 18, color: '666666' }));
    });
  }
  if ((copy.proofPoints || []).length) {
    children.push(heading('Sourced Proof Points', HeadingLevel.HEADING_2));
    copy.proofPoints.forEach((item) => children.push(bullet(`${item.text} — ${item.sourceUrl}`)));
  }

  const listSections = [
    ['Derived Headlines', derived.headlines],
    ['Derived Subheads', derived.subheads],
    ['Derived CTAs', derived.ctas],
    ['Derived Social Hooks', derived.socialHooks],
  ];
  listSections.forEach(([title, items]) => {
    if ((items || []).length) {
      children.push(heading(title, HeadingLevel.HEADING_2));
      addBullets(children, items);
    }
  });

  if ((derived.bodyBlocks || []).length) {
    children.push(heading('Derived Body Blocks', HeadingLevel.HEADING_2));
    derived.bodyBlocks.forEach((item) => {
      children.push(body(item.name, { bold: true }));
      children.push(body(item.text));
    });
  }
  if ((copy.claimsToVerify || []).length) {
    children.push(heading('Claims To Verify', HeadingLevel.HEADING_2));
    addBullets(children, copy.claimsToVerify);
  }
  if ((copy.notes || []).length) {
    children.push(heading('Notes', HeadingLevel.HEADING_2));
    addBullets(children, copy.notes);
  }
}

async function main() {
  const spec = readSpec(specPath);
  const outputPath = ensureOutputPath(outputPathArg || `${safeFileStem(spec.orgName)}_Design_System.docx`);
  const accent = spec.accentColor || '1C403E';
  const children = [];

  children.push(spacer(1450));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: `${spec.orgName} Design System`, bold: true, size: 60, color: accent, font: 'Calibri' })],
  }));
  if (spec.subtitle) children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: spec.subtitle, size: 30, color: '48505A', font: 'Calibri' })] }));
  if (spec.sourceNote) children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 280 }, children: [new TextRun({ text: spec.sourceNote, size: 20, italics: true, color: '6D7175', font: 'Calibri' })] }));
  else children.push(spacer(280));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  if ((spec.sourcePages || []).length) {
    children.push(heading('Sources', HeadingLevel.HEADING_1));
    children.push(sourceTable(spec.sourcePages));
    children.push(spacer());
  }
  if ((spec.overview || []).length) {
    children.push(heading('Overview', HeadingLevel.HEADING_1));
    spec.overview.forEach((item) => children.push(body(item)));
  }
  (spec.palettes || []).forEach((palette) => {
    children.push(heading(palette.title || 'Color Palette', HeadingLevel.HEADING_1));
    if (palette.intro) children.push(body(palette.intro));
    children.push(colorTable(palette.colors || [], accent));
    children.push(spacer());
  });
  if ((spec.typography || []).length) {
    children.push(heading('Typography', HeadingLevel.HEADING_1));
    children.push(specTable(spec.typography));
    children.push(spacer(100));
  }
  if ((spec.typeScale || []).length) {
    children.push(body('Recommended type scale', { bold: true }));
    addBullets(children, spec.typeScale);
  }
  if ((spec.logoNotes || []).length) {
    children.push(heading('Logo & Lockup', HeadingLevel.HEADING_1));
    addBullets(children, spec.logoNotes);
  }
  if ((spec.imageryNotes || []).length) {
    children.push(heading('Imagery & Graphic Style', HeadingLevel.HEADING_1));
    addBullets(children, spec.imageryNotes);
  }
  if ((spec.components || []).length) {
    children.push(heading('Components', HeadingLevel.HEADING_1));
    children.push(specTable(spec.components));
  }
  if ((spec.templates || []).length) {
    children.push(heading('Recommended Templates', HeadingLevel.HEADING_1));
    children.push(specTable(spec.templates));
  }
  addPromptSection(children, spec.assetPrompts);
  addMarketingCopy(children, spec.marketingCopy);
  if ((spec.consistencyNotes || []).length) {
    children.push(heading(spec.consistencyTitle || 'Consistency Notes', HeadingLevel.HEADING_1));
    addBullets(children, spec.consistencyNotes);
  }
  if (spec.footerNote) {
    children.push(spacer(100));
    children.push(body(spec.footerNote, { italics: true, size: 18, color: '888888' }));
  }

  const doc = new Document({
    numbering: {
      config: [{
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 }, spacing: { after: 80, line: 300 } } },
        }],
      }],
    },
    styles: {
      default: { document: { run: { font: 'Calibri', size: 22 }, paragraph: { spacing: { after: 120, line: 300 } } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, font: 'Calibri', color: accent }, paragraph: { spacing: { before: 360, after: 200, line: 300 }, outlineLevel: 0, keepNext: true } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, font: 'Calibri', color: accent }, paragraph: { spacing: { before: 280, after: 140, line: 300 }, outlineLevel: 1, keepNext: true } },
      ],
    },
    sections: [{
      properties: { page: { size: { width: PAGE_WIDTH, height: PAGE_HEIGHT }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN, header: 708, footer: 708 } } },
      headers: { default: runningHeader(spec.orgName), even: runningHeader(spec.orgName), first: runningHeader(spec.orgName) },
      footers: { default: runningFooter(), even: runningFooter(), first: runningFooter() },
      children,
    }],
  });

  fs.writeFileSync(outputPath, await Packer.toBuffer(doc));
  console.log(`Wrote ${path.resolve(outputPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
