const fs = require('fs');
const { escapeHtml, readSpec } = require('./spec_utils.cjs');

const [specPath, htmlPath] = process.argv.slice(2);
if (!specPath || !htmlPath) {
  console.error('Usage: node verify_html_output.cjs <spec.json> <output.html>');
  process.exit(1);
}

try {
  const spec = readSpec(specPath);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const missing = [];

  function check(label, value, options = {}) {
    if (value === undefined || value === null || value === '') return;
    const expected = options.raw ? String(value) : escapeHtml(value);
    if (!html.includes(expected)) missing.push(`${label}: ${value}`);
  }

  check('organization name', spec.orgName);
  check('accent color', spec.accentColor, { raw: true });
  (spec.sourcePages || []).forEach((item, index) => check(`source page ${index + 1}`, item.url));
  (spec.palettes || []).forEach((palette) => (palette.colors || []).forEach((color) => {
    check(`color ${color.name || color.hex}`, color.hex, { raw: true });
  }));
  (spec.typography || []).forEach((item) => check(`font ${item.name}`, item.name));
  (spec.components || []).forEach((item) => {
    check(`component ${item.name}`, item.name);
    check(`component background ${item.name}`, item.bg, { raw: true });
    check(`component text ${item.name}`, item.color, { raw: true });
    check(`component label ${item.name}`, item.previewLabel);
  });
  (spec.assetPrompts || []).forEach((item) => {
    check(`prompt name ${item.name}`, item.name);
    check(`prompt text ${item.name}`, item.prompt);
    check(`negative prompt ${item.name}`, item.negativePrompt);
  });

  const copy = spec.marketingCopy || {};
  (copy.messagingPillars || []).forEach((item) => {
    check(`messaging pillar ${item.name}`, item.name);
    check(`messaging pillar description ${item.name}`, item.description);
  });
  (copy.sourceCopy || []).forEach((item) => {
    check(`source copy ${item.location || item.sourceUrl}`, item.text);
    check(`source copy URL ${item.location || item.sourceUrl}`, item.sourceUrl);
  });
  (copy.proofPoints || []).forEach((item) => check('proof point', item.text));
  Object.values(copy.derivedCopy || {}).forEach((items) => {
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      if (typeof item === 'string') check('derived copy', item);
      else if (item && typeof item === 'object') {
        check('derived copy name', item.name);
        check('derived copy text', item.text);
      }
    });
  });

  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
  const stack = [];
  const tagErrors = [];
  let match;
  while ((match = tagPattern.exec(html))) {
    const [full, rawTag, selfClosing] = match;
    const tag = rawTag.toLowerCase();
    if (voidTags.has(tag) || selfClosing === '/') continue;
    if (full.startsWith('</')) {
      const expected = stack.pop();
      if (expected !== tag) tagErrors.push(`expected </${expected || 'none'}>, got </${tag}>`);
    } else {
      stack.push(tag);
    }
  }
  if (stack.length) tagErrors.push(`unclosed at EOF: ${stack.join(', ')}`);

  if (missing.length || tagErrors.length) {
    if (missing.length) {
      console.error(`FAILED — ${missing.length} spec value(s) not found in output:`);
      missing.forEach((item) => console.error(`  - ${item}`));
    }
    if (tagErrors.length) {
      console.error(`FAILED — ${tagErrors.length} HTML structure issue(s):`);
      tagErrors.forEach((item) => console.error(`  - ${item}`));
    }
    process.exit(1);
  }

  console.log(`PASSED — all checked spec values found and tags balanced (${html.length} bytes).`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
