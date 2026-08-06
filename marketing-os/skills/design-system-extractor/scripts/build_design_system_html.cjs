const fs = require('fs');
const path = require('path');
const {
  ensureOutputPath,
  escapeHtml: esc,
  readSpec,
  safeFileStem,
} = require('./spec_utils.cjs');

const [specPath, outputPathArg] = process.argv.slice(2);
if (!specPath) {
  console.error('Usage: node build_design_system_html.cjs <spec.json> [output.html]');
  process.exit(1);
}

function bulletList(items) {
  return `<ul class="notes">${(items || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

function link(url, label = url) {
  return `<a href="${esc(url)}" target="_blank" rel="noreferrer noopener">${esc(label)}</a>`;
}

function colorGrid(colors) {
  return `<div class="swatch-grid">${(colors || []).map((color) => `
    <article class="swatch">
      <div class="swatch-block" style="background:#${esc(color.hex)}"></div>
      <div class="swatch-meta">
        <strong>${esc(color.name || '')}</strong>
        <code>#${esc(color.hex)}</code>
        <span>${esc(color.usage || '')}</span>
      </div>
    </article>`).join('')}</div>`;
}

function namedCards(items) {
  return `<div class="card-grid">${(items || []).map((item) => `
    <article class="card">
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.description || '')}</p>
    </article>`).join('')}</div>`;
}

function components(items) {
  return `<div class="component-list">${(items || []).map((item) => {
    const preview = item.bg && item.color
      ? `<span class="preview" style="background:#${esc(item.bg)};color:#${esc(item.color)};border-radius:${esc(item.borderRadius || '6px')};padding:${esc(item.padding || '10px 18px')};font-weight:${esc(item.fontWeight || '600')};font-size:${esc(item.fontSize || '16px')};text-transform:${esc(item.textTransform || 'none')};letter-spacing:${esc(item.letterSpacing || 'normal')}">${esc(item.previewLabel || item.name)}</span>`
      : '<span class="muted">No visual preview</span>';
    return `
      <article class="component-row">
        <div class="component-preview">${preview}</div>
        <div><h3>${esc(item.name)}</h3><p>${esc(item.description || '')}</p></div>
      </article>`;
  }).join('')}</div>`;
}

function sourcePages(items) {
  return `<ul class="source-list">${(items || []).map((item) => `
    <li>${link(item.url, item.label || item.url)}${item.capturedAt ? ` <span>Captured ${esc(item.capturedAt)}</span>` : ''}</li>`).join('')}</ul>`;
}

function promptCards(items) {
  return `<div class="prompt-list">${(items || []).map((item, index) => `
    <article class="prompt-card">
      <div class="eyebrow">${esc(item.category)} · Prompt ${index + 1}</div>
      <h3>${esc(item.name)}</h3>
      <dl>
        <div><dt>Use</dt><dd>${esc(item.intendedUse)}</dd></div>
        <div><dt>Ratios</dt><dd>${esc((item.aspectRatios || []).join(', ') || 'Choose for placement')}</dd></div>
        <div><dt>Palette</dt><dd>${esc((item.palette || []).map((hex) => `#${hex}`).join(', ') || 'Design-system palette')}</dd></div>
      </dl>
      <h4>Prompt</h4><pre>${esc(item.prompt)}</pre>
      <h4>Negative prompt</h4><pre>${esc(item.negativePrompt || 'No text, letters, logos, or watermarks.')}</pre>
      ${item.layeringNotes ? `<h4>Layering notes</h4><p>${esc(item.layeringNotes)}</p>` : ''}
    </article>`).join('')}</div>`;
}

function pillars(items) {
  return `<div class="card-grid">${(items || []).map((item) => `
    <article class="card">
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.description)}</p>
      ${item.evidence ? `<p class="evidence"><strong>Evidence:</strong> ${esc(item.evidence)}</p>` : ''}
      ${(item.sourceUrls || []).length ? `<p class="sources">${item.sourceUrls.map((url) => link(url, 'Source')).join(' · ')}</p>` : ''}
    </article>`).join('')}</div>`;
}

function sourceCopy(items) {
  return `<div class="quote-list">${(items || []).map((item) => `
    <figure>
      <blockquote>${esc(item.text)}</blockquote>
      <figcaption>${link(item.sourceUrl, item.location || item.sourceUrl)}${item.intendedUse ? ` · ${esc(item.intendedUse)}` : ''}</figcaption>
    </figure>`).join('')}</div>`;
}

function proofPoints(items) {
  return `<ul class="proof-list">${(items || []).map((item) => `<li>${esc(item.text)} — ${link(item.sourceUrl, 'source')}</li>`).join('')}</ul>`;
}

function derivedList(title, items) {
  if (!(items || []).length) return '';
  return `<div class="copy-group"><h3>${esc(title)}</h3>${bulletList(items)}</div>`;
}

function bodyBlocks(items) {
  if (!(items || []).length) return '';
  return `<div class="card-grid">${items.map((item) => `<article class="card"><h3>${esc(item.name)}</h3><p>${esc(item.text)}</p></article>`).join('')}</div>`;
}

try {
  const spec = readSpec(specPath);
  const outputPath = ensureOutputPath(outputPathArg || `${safeFileStem(spec.orgName)}_Design_System.html`);
  const accent = `#${spec.accentColor || '1C403E'}`;
  const fontNames = [...new Set((spec.typography || []).map((item) => item.name).filter(Boolean))];
  const googleFontsHref = fontNames.length
    ? `https://fonts.googleapis.com/css2?${fontNames.map((font) => `family=${encodeURIComponent(font).replace(/%20/g, '+')}:wght@400;600;700`).join('&')}&display=swap`
    : null;
  const sections = [];
  const copy = spec.marketingCopy || {};
  const derived = copy.derivedCopy || {};

  if ((spec.sourcePages || []).length) sections.push(`<section><h2>Sources</h2>${sourcePages(spec.sourcePages)}</section>`);
  if ((spec.overview || []).length) sections.push(`<section><h2>Overview</h2>${spec.overview.map((item) => `<p>${esc(item)}</p>`).join('')}</section>`);
  (spec.palettes || []).forEach((palette) => sections.push(`<section><h2>${esc(palette.title || 'Color Palette')}</h2>${palette.intro ? `<p>${esc(palette.intro)}</p>` : ''}${colorGrid(palette.colors)}</section>`));
  if ((spec.typography || []).length) sections.push(`<section><h2>Typography</h2><div class="type-list">${spec.typography.map((item) => `<article><div class="type-sample" style="font-family:'${esc(item.name)}',sans-serif">Aa Bb Cc — The quick brown fox</div><p><strong>${esc(item.name)}</strong> — ${esc(item.description || '')}</p></article>`).join('')}</div>${(spec.typeScale || []).length ? `<h3>Recommended type scale</h3>${bulletList(spec.typeScale)}` : ''}</section>`);
  if ((spec.logoNotes || []).length) sections.push(`<section><h2>Logo &amp; Lockup</h2>${bulletList(spec.logoNotes)}</section>`);
  if ((spec.imageryNotes || []).length) sections.push(`<section><h2>Imagery &amp; Graphic Style</h2>${bulletList(spec.imageryNotes)}</section>`);
  if ((spec.components || []).length) sections.push(`<section><h2>Components</h2>${components(spec.components)}</section>`);
  if ((spec.templates || []).length) sections.push(`<section><h2>Recommended Templates</h2>${namedCards(spec.templates)}</section>`);
  if ((spec.assetPrompts || []).length) sections.push(`<section><h2>Asset Generation Prompts</h2><p>Generate these as text-free layers, then add copy and marks as editable overlays.</p>${promptCards(spec.assetPrompts)}</section>`);
  if (Object.keys(copy).length) {
    sections.push(`<section><h2>Marketing Copy System</h2><div class="callout">Observed excerpts are sourced evidence. Derived copy is new draft language and requires brand, factual, and legal review.</div>${(copy.voiceTraits || []).length ? `<h3>Voice traits</h3>${bulletList(copy.voiceTraits)}` : ''}${(copy.audiences || []).length ? `<h3>Audiences</h3>${bulletList(copy.audiences)}` : ''}${(copy.messagingPillars || []).length ? `<h3>Messaging pillars</h3>${pillars(copy.messagingPillars)}` : ''}${(copy.sourceCopy || []).length ? `<h3>Observed source copy</h3>${sourceCopy(copy.sourceCopy)}` : ''}${(copy.proofPoints || []).length ? `<h3>Sourced proof points</h3>${proofPoints(copy.proofPoints)}` : ''}<div class="copy-columns">${derivedList('Derived headlines', derived.headlines)}${derivedList('Derived subheads', derived.subheads)}${derivedList('Derived CTAs', derived.ctas)}${derivedList('Derived social hooks', derived.socialHooks)}</div>${(derived.bodyBlocks || []).length ? `<h3>Derived body blocks</h3>${bodyBlocks(derived.bodyBlocks)}` : ''}${(copy.claimsToVerify || []).length ? `<h3>Claims to verify</h3>${bulletList(copy.claimsToVerify)}` : ''}${(copy.notes || []).length ? `<h3>Notes</h3>${bulletList(copy.notes)}` : ''}</section>`);
  }
  if ((spec.consistencyNotes || []).length) sections.push(`<section><h2>${esc(spec.consistencyTitle || 'Consistency Notes')}</h2>${bulletList(spec.consistencyNotes)}</section>`);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(spec.orgName)} — Design System</title>
${googleFontsHref ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${esc(googleFontsHref)}" rel="stylesheet">` : ''}
<style>
  :root { --accent: ${accent}; --ink: #121212; --muted: #62666d; --line: #dedede; --paper: #fafafa; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 48px 24px 96px; background: var(--paper); color: var(--ink); font: 16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
  .page { max-width: 960px; margin: 0 auto; }
  h1 { margin: 0 0 8px; color: var(--accent); font-size: clamp(36px, 6vw, 58px); line-height: 1.05; }
  h2 { margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid var(--accent); color: var(--accent); font-size: 25px; }
  h3 { margin: 18px 0 8px; font-size: 17px; }
  h4, dt { margin: 14px 0 6px; font-size: 12px; letter-spacing: .05em; text-transform: uppercase; }
  p { margin: 0 0 14px; }
  a { color: var(--accent); overflow-wrap: anywhere; }
  section { margin-top: 48px; }
  .subtitle { margin: 0 0 4px; color: var(--muted); font-size: 20px; }
  .source-note, .footer-note { color: var(--muted); font-size: 13px; font-style: italic; }
  .source-list, .notes, .proof-list { padding-left: 22px; }
  .source-list span { color: var(--muted); font-size: 12px; }
  .swatch-grid, .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }
  .swatch, .card, .prompt-card, figure { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; background: white; }
  .swatch-block { height: 82px; border-bottom: 1px solid rgba(0,0,0,.08); }
  .swatch-meta { display: grid; gap: 3px; padding: 12px; }
  .swatch-meta code, .swatch-meta span { color: var(--muted); font-size: 12px; }
  .card { padding: 14px 16px; }
  .card h3, .card p { margin-top: 0; }
  .type-list article { padding: 18px 0; border-bottom: 1px solid var(--line); }
  .type-sample { margin-bottom: 6px; font-size: clamp(28px, 5vw, 40px); font-weight: 600; }
  .component-row { display: grid; grid-template-columns: minmax(220px, 1fr) 2fr; align-items: center; gap: 20px; padding: 18px 0; border-bottom: 1px solid var(--line); }
  .component-row h3, .component-row p { margin: 0 0 4px; }
  .preview { display: inline-block; }
  .muted, .evidence, .sources, figcaption { color: var(--muted); font-size: 13px; }
  .prompt-list { display: grid; gap: 18px; }
  .prompt-card { padding: 18px; }
  .prompt-card h3 { margin-top: 4px; font-size: 20px; }
  .eyebrow { color: var(--accent); font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
  dl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  dl div { padding: 10px; border-radius: 8px; background: #f3f4f6; }
  dt { margin: 0; } dd { margin: 2px 0 0; font-size: 13px; }
  pre { margin: 0; padding: 14px; overflow-wrap: anywhere; white-space: pre-wrap; border-radius: 8px; background: #f4f4f4; font: 13px/1.5 "SFMono-Regular", Consolas, monospace; }
  .callout { padding: 14px 16px; border-left: 4px solid var(--accent); background: white; }
  .quote-list { display: grid; gap: 12px; } figure { margin: 0; padding: 16px; }
  blockquote { margin: 0 0 8px; font-size: 19px; }
  .copy-columns { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .copy-group { min-width: 0; }
  .footer-note { margin-top: 48px; }
  @media (max-width: 680px) { body { padding: 30px 16px 64px; } .component-row, .copy-columns, dl { grid-template-columns: 1fr; } }
  @media print { body { padding: 0; background: white; } .prompt-card, .card, .swatch, figure { break-inside: avoid; } a { color: inherit; } }
</style>
</head>
<body><main class="page">
  <header><h1>${esc(spec.orgName)} Design System</h1>${spec.subtitle ? `<p class="subtitle">${esc(spec.subtitle)}</p>` : ''}${spec.sourceNote ? `<p class="source-note">${esc(spec.sourceNote)}</p>` : ''}</header>
  ${sections.join('\n')}
  ${spec.footerNote ? `<p class="footer-note">${esc(spec.footerNote)}</p>` : ''}
</main></body>
</html>\n`;

  fs.writeFileSync(outputPath, html);
  console.log(`Wrote ${path.resolve(outputPath)}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
