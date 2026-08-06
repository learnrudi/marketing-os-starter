# Creative Asset Workflow

This reference defines the reusable workflow for producing brand-aligned creative assets.

## 1. Extract the design system

Use observed visual evidence and approved brand sources. Capture real hex colors, typography, component behavior, logo use, imagery direction, and messaging patterns. Do not guess visual tokens that can be inspected or confirmed.

## 2. Separate brand modes

Some organizations use distinct visual modes for editorial, product, conference, campaign, or sub-brand work. Define each mode separately. Do not average incompatible palettes or motifs into one ambiguous system.

For each mode, document:

- color roles;
- typography and hierarchy;
- background and surface behavior;
- imagery or illustration language;
- logo treatment;
- allowed campaign variations.

## 3. Choose useful asset categories

Select asset categories the campaign actually needs. Common categories include:

- gradient or color-field backgrounds for titles and section transitions;
- grain or noise textures for quiet text-heavy compositions;
- geometric or brand-motif backgrounds for accents and dividers;
- icon, illustration, photography, or data-visualization ingredients.

Avoid generating a large asset library without a defined use.

## 4. Generate deterministic elements when practical

Use code for gradients, noise, grids, geometric shapes, simple patterns, and exact palette transformations when deterministic output is more reliable than generative imagery. Use image generation for visual ingredients that benefit from illustration, texture, photography, dimensionality, or variation.

## 5. Review cheap previews first

Create a low-resolution preview or contact sheet before producing final-resolution variations. Review the direction, palette, density, and text safety. Carry only approved directions into final production.

## 6. Render required formats

Render only the dimensions named in the creative brief. Typical examples include:

- `1920x1080` for presentation backgrounds;
- `1:1`, `4:5`, and `9:16` for social placements.

Confirm the current platform requirements when dimensions may have changed.

## 7. Protect text-safe zones

Reserve calm, high-contrast areas for editable copy. Restrict busy patterns to corners or edges, or use a controlled gradient band behind text. Test the actual copy rather than assuming the background will remain legible.

## 8. Preserve editable composition

Generate backgrounds without text, letters, logos, or watermarks by default. Add copy, approved logos, and icons as native or SVG layers. Preserve the editable master alongside every exported PNG, JPG, PDF, or presentation file.

## 9. Record the output

Update the campaign asset manifest with:

- asset name and purpose;
- brand mode and source design system;
- dimensions and channel;
- working and delivery paths;
- approval state;
- any generator prompt or procedural parameters needed for reproducibility.
