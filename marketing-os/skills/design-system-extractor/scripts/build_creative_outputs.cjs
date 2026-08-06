const fs = require('fs');
const path = require('path');
const { readSpec, safeFileStem } = require('./spec_utils.cjs');

const [specPath, outputDirArg] = process.argv.slice(2);
if (!specPath) {
  console.error('Usage: node build_creative_outputs.cjs <spec.json> [output-dir]');
  process.exit(1);
}

function list(items) {
  return (items || []).map((item) => `- ${item}`).join('\n');
}

function section(title, content) {
  return content ? `## ${title}\n\n${content}\n` : '';
}

function formatPrompt(prompt, index) {
  const ratios = (prompt.aspectRatios || []).join(', ') || 'Choose for final placement';
  const palette = (prompt.palette || []).map((hex) => `#${hex}`).join(', ') || 'Use the design-system palette';
  return [
    `### ${index + 1}. ${prompt.name}`,
    '',
    `- Category: ${prompt.category}`,
    `- Intended use: ${prompt.intendedUse}`,
    `- Aspect ratios: ${ratios}`,
    `- Palette: ${palette}`,
    '',
    '**Prompt**',
    '',
    prompt.prompt,
    '',
    '**Negative prompt**',
    '',
    prompt.negativePrompt || 'No text, letters, numbers, logos, signatures, watermarks, or off-brand colors.',
    ...(prompt.layeringNotes ? ['', '**Layering notes**', '', prompt.layeringNotes] : []),
  ].join('\n');
}

function formatSourceCopy(items) {
  return (items || []).map((item) => [
    `> ${item.text}`,
    '',
    `Source: ${item.sourceUrl}${item.location ? ` — ${item.location}` : ''}${item.intendedUse ? ` — Suggested use: ${item.intendedUse}` : ''}`,
  ].join('\n')).join('\n\n');
}

function formatPillars(items) {
  return (items || []).map((item) => [
    `### ${item.name}`,
    '',
    item.description,
    ...(item.evidence ? ['', `Evidence: ${item.evidence}`] : []),
    ...((item.sourceUrls || []).length ? ['', `Sources: ${(item.sourceUrls || []).join(', ')}`] : []),
  ].join('\n')).join('\n\n');
}

function formatProofPoints(items) {
  return (items || []).map((item) => `- ${item.text} — ${item.sourceUrl}`).join('\n');
}

function formatBodyBlocks(items) {
  return (items || []).map((item) => `### ${item.name}\n\n${item.text}`).join('\n\n');
}

try {
  const spec = readSpec(specPath);
  const outputDir = path.resolve(outputDirArg || path.dirname(specPath));
  const stem = safeFileStem(spec.orgName);
  const promptPath = path.join(outputDir, `${stem}_Asset_Prompts.md`);
  const copyPath = path.join(outputDir, `${stem}_Marketing_Copy.md`);
  fs.mkdirSync(outputDir, { recursive: true });

  const paletteSummary = (spec.palettes || [])
    .flatMap((palette) => palette.colors || [])
    .map((color) => `#${color.hex} (${color.name || color.usage || 'brand color'})`)
    .join(', ');

  const promptDocument = [
    `# ${spec.orgName} Asset Prompts`,
    '',
    'Use these prompts to generate text-free visual layers. Add approved copy, logos, and icons afterward as editable SVG or native design-tool elements.',
    '',
    ...(paletteSummary ? [`Brand palette: ${paletteSummary}`, ''] : []),
    ...(spec.sourceNote ? [`Source note: ${spec.sourceNote}`, ''] : []),
    ...(spec.assetPrompts || []).map(formatPrompt).flatMap((value) => [value, '']),
  ].join('\n').trimEnd() + '\n';

  const copy = spec.marketingCopy || {};
  const derived = copy.derivedCopy || {};
  const copyDocument = [
    `# ${spec.orgName} Marketing Copy Library`,
    '',
    'Observed excerpts are evidence from the supplied website. Derived copy is new draft language and must be reviewed for brand, legal, and factual approval before publication.',
    '',
    section('Voice Traits', list(copy.voiceTraits)),
    section('Audiences', list(copy.audiences)),
    section('Messaging Pillars', formatPillars(copy.messagingPillars)),
    section('Observed Source Copy', formatSourceCopy(copy.sourceCopy)),
    section('Sourced Proof Points', formatProofPoints(copy.proofPoints)),
    section('Derived Headlines', list(derived.headlines)),
    section('Derived Subheads', list(derived.subheads)),
    section('Derived CTAs', list(derived.ctas)),
    section('Derived Social Hooks', list(derived.socialHooks)),
    section('Derived Body Blocks', formatBodyBlocks(derived.bodyBlocks)),
    section('Claims To Verify', list(copy.claimsToVerify)),
    section('Notes', list(copy.notes)),
  ].filter(Boolean).join('\n').trimEnd() + '\n';

  fs.writeFileSync(promptPath, promptDocument);
  fs.writeFileSync(copyPath, copyDocument);
  console.log(JSON.stringify({ promptPath, copyPath }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
