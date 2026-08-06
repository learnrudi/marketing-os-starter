const fs = require('fs');
const path = require('path');

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function optionalString(value, label) {
  if (value === undefined) return;
  if (typeof value !== 'string') throw new Error(`${label} must be a string`);
}

function requireArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value;
}

function validateStringArray(value, label) {
  if (value === undefined) return;
  requireArray(value, label).forEach((item, index) => {
    requireString(item, `${label}[${index}]`);
  });
}

function normalizeHex(value, label) {
  const hex = requireString(value, label).replace(/^#/, '').toUpperCase();
  if (!/^[0-9A-F]{6}$/.test(hex)) {
    throw new Error(`${label} must be a six-digit hex color`);
  }
  return hex;
}

function validateUrl(value, label) {
  const url = new URL(requireString(value, label));
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`${label} must use http or https`);
  }
}

function validateNamedDescriptions(value, label) {
  if (value === undefined) return;
  requireArray(value, label).forEach((item, index) => {
    if (!isObject(item)) throw new Error(`${label}[${index}] must be an object`);
    requireString(item.name, `${label}[${index}].name`);
    optionalString(item.description, `${label}[${index}].description`);
  });
}

function validateCssValue(value, label) {
  if (value === undefined) return;
  optionalString(value, label);
  if (!/^[A-Za-z0-9 .,%()_+-]+$/.test(value)) {
    throw new Error(`${label} contains unsupported CSS characters`);
  }
}

function validateSpec(spec) {
  if (!isObject(spec)) throw new Error('Spec root must be an object');
  requireString(spec.orgName, 'orgName');
  optionalString(spec.subtitle, 'subtitle');
  optionalString(spec.sourceNote, 'sourceNote');
  optionalString(spec.footerNote, 'footerNote');

  if (spec.accentColor !== undefined) {
    spec.accentColor = normalizeHex(spec.accentColor, 'accentColor');
  }

  validateStringArray(spec.overview, 'overview');
  validateStringArray(spec.typeScale, 'typeScale');
  validateStringArray(spec.logoNotes, 'logoNotes');
  validateStringArray(spec.imageryNotes, 'imageryNotes');
  validateStringArray(spec.consistencyNotes, 'consistencyNotes');

  if (spec.sourcePages !== undefined) {
    requireArray(spec.sourcePages, 'sourcePages').forEach((item, index) => {
      if (!isObject(item)) throw new Error(`sourcePages[${index}] must be an object`);
      validateUrl(item.url, `sourcePages[${index}].url`);
      optionalString(item.label, `sourcePages[${index}].label`);
      optionalString(item.capturedAt, `sourcePages[${index}].capturedAt`);
    });
  }

  if (spec.palettes !== undefined) {
    requireArray(spec.palettes, 'palettes').forEach((palette, paletteIndex) => {
      if (!isObject(palette)) throw new Error(`palettes[${paletteIndex}] must be an object`);
      optionalString(palette.title, `palettes[${paletteIndex}].title`);
      optionalString(palette.intro, `palettes[${paletteIndex}].intro`);
      requireArray(palette.colors, `palettes[${paletteIndex}].colors`).forEach((color, colorIndex) => {
        if (!isObject(color)) throw new Error(`palettes[${paletteIndex}].colors[${colorIndex}] must be an object`);
        color.hex = normalizeHex(color.hex, `palettes[${paletteIndex}].colors[${colorIndex}].hex`);
        optionalString(color.name, `palettes[${paletteIndex}].colors[${colorIndex}].name`);
        optionalString(color.usage, `palettes[${paletteIndex}].colors[${colorIndex}].usage`);
      });
    });
  }

  validateNamedDescriptions(spec.typography, 'typography');
  (spec.typography || []).forEach((item, index) => {
    if (!/^[A-Za-z0-9 ._-]+$/.test(item.name)) {
      throw new Error(`typography[${index}].name contains unsupported font-name characters`);
    }
  });
  validateNamedDescriptions(spec.components, 'components');
  (spec.components || []).forEach((item, index) => {
    if (item.bg !== undefined) item.bg = normalizeHex(item.bg, `components[${index}].bg`);
    if (item.color !== undefined) item.color = normalizeHex(item.color, `components[${index}].color`);
    ['borderRadius', 'padding', 'fontWeight', 'fontSize', 'textTransform', 'letterSpacing'].forEach((key) => {
      validateCssValue(item[key], `components[${index}].${key}`);
    });
    optionalString(item.previewLabel, `components[${index}].previewLabel`);
  });
  validateNamedDescriptions(spec.templates, 'templates');

  if (spec.assetPrompts !== undefined) {
    requireArray(spec.assetPrompts, 'assetPrompts').forEach((item, index) => {
      if (!isObject(item)) throw new Error(`assetPrompts[${index}] must be an object`);
      requireString(item.category, `assetPrompts[${index}].category`);
      requireString(item.name, `assetPrompts[${index}].name`);
      requireString(item.intendedUse, `assetPrompts[${index}].intendedUse`);
      requireString(item.prompt, `assetPrompts[${index}].prompt`);
      optionalString(item.negativePrompt, `assetPrompts[${index}].negativePrompt`);
      optionalString(item.layeringNotes, `assetPrompts[${index}].layeringNotes`);
      validateStringArray(item.aspectRatios, `assetPrompts[${index}].aspectRatios`);
      if (item.palette !== undefined) {
        requireArray(item.palette, `assetPrompts[${index}].palette`).forEach((hex, colorIndex) => {
          item.palette[colorIndex] = normalizeHex(hex, `assetPrompts[${index}].palette[${colorIndex}]`);
        });
      }
    });
  }

  if (spec.marketingCopy !== undefined) {
    const copy = spec.marketingCopy;
    if (!isObject(copy)) throw new Error('marketingCopy must be an object');
    validateStringArray(copy.voiceTraits, 'marketingCopy.voiceTraits');
    validateStringArray(copy.audiences, 'marketingCopy.audiences');
    validateStringArray(copy.claimsToVerify, 'marketingCopy.claimsToVerify');
    validateStringArray(copy.notes, 'marketingCopy.notes');

    if (copy.messagingPillars !== undefined) {
      requireArray(copy.messagingPillars, 'marketingCopy.messagingPillars').forEach((item, index) => {
        if (!isObject(item)) throw new Error(`marketingCopy.messagingPillars[${index}] must be an object`);
        requireString(item.name, `marketingCopy.messagingPillars[${index}].name`);
        requireString(item.description, `marketingCopy.messagingPillars[${index}].description`);
        optionalString(item.evidence, `marketingCopy.messagingPillars[${index}].evidence`);
        if (item.sourceUrls !== undefined) {
          requireArray(item.sourceUrls, `marketingCopy.messagingPillars[${index}].sourceUrls`).forEach((url, urlIndex) => {
            validateUrl(url, `marketingCopy.messagingPillars[${index}].sourceUrls[${urlIndex}]`);
          });
        }
      });
    }

    if (copy.sourceCopy !== undefined) {
      requireArray(copy.sourceCopy, 'marketingCopy.sourceCopy').forEach((item, index) => {
        if (!isObject(item)) throw new Error(`marketingCopy.sourceCopy[${index}] must be an object`);
        requireString(item.text, `marketingCopy.sourceCopy[${index}].text`);
        validateUrl(item.sourceUrl, `marketingCopy.sourceCopy[${index}].sourceUrl`);
        optionalString(item.location, `marketingCopy.sourceCopy[${index}].location`);
        optionalString(item.intendedUse, `marketingCopy.sourceCopy[${index}].intendedUse`);
      });
    }

    if (copy.proofPoints !== undefined) {
      requireArray(copy.proofPoints, 'marketingCopy.proofPoints').forEach((item, index) => {
        if (!isObject(item)) throw new Error(`marketingCopy.proofPoints[${index}] must be an object`);
        requireString(item.text, `marketingCopy.proofPoints[${index}].text`);
        validateUrl(item.sourceUrl, `marketingCopy.proofPoints[${index}].sourceUrl`);
      });
    }

    if (copy.derivedCopy !== undefined) {
      const derived = copy.derivedCopy;
      if (!isObject(derived)) throw new Error('marketingCopy.derivedCopy must be an object');
      ['headlines', 'subheads', 'ctas', 'socialHooks'].forEach((key) => {
        validateStringArray(derived[key], `marketingCopy.derivedCopy.${key}`);
      });
      if (derived.bodyBlocks !== undefined) {
        requireArray(derived.bodyBlocks, 'marketingCopy.derivedCopy.bodyBlocks').forEach((item, index) => {
          if (!isObject(item)) throw new Error(`marketingCopy.derivedCopy.bodyBlocks[${index}] must be an object`);
          requireString(item.name, `marketingCopy.derivedCopy.bodyBlocks[${index}].name`);
          requireString(item.text, `marketingCopy.derivedCopy.bodyBlocks[${index}].text`);
        });
      }
    }
  }

  return spec;
}

function readSpec(specPath) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read spec ${specPath}: ${error.message}`);
  }
  return validateSpec(parsed);
}

function safeFileStem(value) {
  return requireString(value, 'orgName')
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'Design_System';
}

function ensureOutputPath(outputPath) {
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  return outputPath;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

module.exports = {
  ensureOutputPath,
  escapeHtml,
  readSpec,
  safeFileStem,
  validateSpec,
};
