---
name: design-system-extractor
description: Extract a website's visual system and marketing language into a validated design-system JSON file, rendered HTML and DOCX references, image-generation prompts, and a provenance-aware marketing-copy library. Use when a user supplies a website and wants reusable brand guidance or source material for social, campaign, presentation, or Canva assets.
---

# Design System Extractor

Turn a representative website into five reusable deliverables:

1. `<Brand>_Design_System.json` — canonical structured source.
2. `<Brand>_Design_System.html` — visual, self-contained reference.
3. `<Brand>_Design_System.docx` — editable document reference.
4. `<Brand>_Asset_Prompts.md` — generator-ready prompts for backgrounds, textures, icons, illustration, and related imagery.
5. `<Brand>_Marketing_Copy.md` — observed messaging evidence plus clearly labeled derived copy.

Image generation, SVG/text compositing, Canva import, and publishing are downstream steps. Do not flatten generated text into backgrounds by default: generate text-free imagery, then keep copy, icons, and logos as editable vector or native design-tool layers.

## Included resources

- `scripts/extract_styles.js` — browser-page snippet for computed visual evidence.
- `scripts/extract_content.js` — browser-page snippet for visible messaging evidence.
- `scripts/spec_utils.cjs` — shared schema validation.
- `scripts/build_design_system_html.cjs` — HTML reference builder.
- `scripts/build_design_system_doc.cjs` — DOCX reference builder; requires the `docx` Node package.
- `scripts/build_creative_outputs.cjs` — prompt and marketing-copy Markdown builder.
- `scripts/verify_html_output.cjs` — deterministic HTML content/structure check.
- `references/spec.example.json` — complete fictional example of the canonical schema.

Resolve all relative paths from the directory containing this `SKILL.md`.

## Workflow

### 1. Confirm the source and output location

If no website URL was supplied, ask for it. Use a dedicated output folder and preserve the raw page evidence alongside final artifacts.

Recommended layout:

```text
<output>/
  raw/
    styles-home.json
    content-home.json
    ...
  <Brand>_Design_System.json
  <Brand>_Design_System.html
  <Brand>_Design_System.docx
  <Brand>_Asset_Prompts.md
  <Brand>_Marketing_Copy.md
```

### 2. Select representative pages

Inspect the homepage plus up to four high-signal pages when available:

- product, service, or solutions page;
- about or mission page;
- customer, case-study, or proof page;
- pricing, event, campaign, or editorial page.

Prefer pages from the same organization and current design generation. Record every inspected URL in `sourcePages`. Note major sub-brand or campaign differences instead of averaging incompatible systems together.

Do not bypass authentication, access controls, or site restrictions. If scripted DOM evaluation is unavailable, collect the same evidence through page inspection and screenshots.

### 3. Capture visual evidence

Run `scripts/extract_styles.js` in the page context once per selected page. The file is a browser snippet, not a Node CLI program. Save each returned JSON object under `raw/`.

Also inspect screenshots at desktop and mobile widths when practical. Computed frequency is evidence, not interpretation: verify which colors and styles correspond to backgrounds, text, accents, buttons, tags, and decorative elements.

Capture:

- primary, secondary, neutral, and status colors;
- type families, weights, hierarchy, scale, case, and spacing;
- button, pill, card, border, radius, and shadow patterns;
- logo/lockup behavior and clear-space observations;
- photography, illustration, texture, icon, and layout language;
- differences across pages, campaigns, or sub-brands.

Normalize colors to six-digit uppercase hex without a leading `#` in the JSON spec.

### 4. Capture messaging evidence

Run `scripts/extract_content.js` in the page context for the same pages and save the results under `raw/`. Supplement it with page metadata and visual inspection.

Build a messaging model from repeated themes, not isolated phrases:

- audience and customer identity;
- problem, promise, mechanism, and outcome;
- proof points and trust signals;
- voice traits and recurring language;
- CTA patterns;
- offers, products, events, or editorial franchises.

Keep exact website excerpts short and attach `sourceUrl`, `location`, and `intendedUse`. Do not reproduce whole pages or long blocks. Treat the website as observed evidence unless the user confirms they own and approve the copy.

Separate these classes in `marketingCopy`:

- `sourceCopy`: short observed excerpts, quoted and sourced;
- `messagingPillars` and `proofPoints`: synthesis grounded in URLs;
- `derivedCopy`: new draft language inspired by the evidence;
- `claimsToVerify`: anything that requires user or legal confirmation.

Never invent customer counts, prices, awards, performance claims, testimonials, or regulated claims.

### 5. Author the canonical JSON spec

Copy `references/spec.example.json` into the output folder and replace the fictional values with evidence from the supplied site. Omit unsupported optional sections instead of filling them with guesses.

Required field:

- `orgName`

Core design fields:

- `subtitle`, `sourceNote`, `sourcePages`, `accentColor`, `overview`;
- `palettes`, `typography`, `typeScale`;
- `logoNotes`, `imageryNotes`, `components`, `templates`;
- `consistencyNotes`, `footerNote`.

Creative fields:

- `assetPrompts`;
- `marketingCopy`.

Use `node scripts/build_creative_outputs.cjs <spec.json> <output-dir>` early. It validates the creative sections and makes gaps easy to see before the document render.

### 6. Create the asset prompt library

Produce 10–16 useful prompts across the categories the site actually supports. Consider:

- background fields and environmental scenes;
- subtle, medium, and expressive textures;
- icon family and UI-symbol direction;
- illustration motifs, patterns, and abstract forms;
- photography art direction and subject framing;
- data-visualization or diagram motifs;
- transitions, motion frames, or video plates;
- campaign-specific compositions and negative space for copy.

Each prompt must include:

- intended use and aspect ratios;
- actual brand hex colors and their visual roles;
- material, lighting, composition, depth, and density;
- where negative space should remain for editable copy;
- a negative prompt that excludes text, letters, logos, watermarks, and off-brand colors unless in-image typography is explicitly requested.

For experimental in-image typography, create a separate prompt labeled `experimental`. Still provide the copy separately because generator text is unreliable and difficult to edit. Prefer post-generation SVG/native text overlays.

### 7. Create the marketing-copy library

At minimum, derive:

- 3–5 messaging pillars;
- 6–10 headlines;
- 3–6 subheads;
- 6–10 CTAs;
- 4–8 social hooks;
- 2–4 short body blocks;
- sourced proof points and a claims-to-verify list.

Match the observed voice without copying distinctive phrasing unnecessarily. Derived copy should be ready to place on the generated backgrounds as editable text layers.

### 8. Build and verify all outputs

Run from the installed skill directory:

```bash
node scripts/build_creative_outputs.cjs <spec.json> <output-dir>
node scripts/build_design_system_html.cjs <spec.json> <output.html>
node scripts/verify_html_output.cjs <spec.json> <output.html>
node scripts/build_design_system_doc.cjs <spec.json> <output.docx>
```

The DOCX builder requires `docx`. Prefer a host-provided or workspace-managed dependency runtime. If unavailable, install it only into a temporary isolated directory; do not modify the user's application package files.

Verification is incomplete until:

- JSON validation passes through a builder;
- the HTML verifier passes;
- the HTML is visually inspected at desktop and narrow widths;
- the DOCX is rendered to pages and every page is inspected for clipping, split rows, blank overflow pages, and unreadable contrast;
- prompt and copy Markdown files are reviewed for unsupported claims, missing provenance, and accidental instructions to generate text or logos inside backgrounds.

If a render fails, fix the spec or builder and rerun the complete affected verification loop.

## Delivery notes

Report:

- inspected URLs and capture date;
- the five artifact paths;
- important inferred versus directly observed choices;
- missing brand fonts, logo files, or claims that still need confirmation;
- the next downstream step, such as generating backgrounds, composing SVG/native text, or importing a flattened preview plus editable overlays into Canva.

## MarketingOS integration

When this skill runs inside this MarketingOS, preserve raw source evidence under `../../research/source-material/` or the applicable campaign `sources/` directory. Use `../../brand/design-system.json` as the canonical structured design-system destination and write approved verbal guidance into `../../brand/` and proof into `../../evidence/`. Put only canonical identity files such as approved logos, fonts, and icons under `../../brand/assets/`. Keep generated working and delivery assets inside the applicable campaign directory; promote them into `../../content-library/` only after reusable-content approval. Treat extracted output as evidence requiring human confirmation before replacing approved company context.
