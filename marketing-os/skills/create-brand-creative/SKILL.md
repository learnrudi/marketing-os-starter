---
name: create-brand-creative
description: Create brand-aligned campaign creative through a layered, reviewable workflow that separates strategy, editable structure, generated imagery, and production exports. Use when turning an approved campaign and creative brief into SVG, HTML, image prompts, backgrounds, social assets, presentation visuals, or other channel-ready creative.
---

# Create Brand Creative

Build creative in layers so strategy, copy, imagery, and production decisions remain inspectable and editable.

Resolve relative paths from this skill directory. The MarketingOS root is `../..`. Read `references/creative-asset-workflow.md` before generating backgrounds or multi-format creative.

## 1. Verify approved inputs

Require:

- an approved campaign brief and creative brief;
- the relevant files under `../../brand/` and `../../system/`;
- the applicable canonical assets under `../../brand/assets/` and approved reusable content under `../../content-library/`;
- approved message, offer, proof, and call to action;
- required channels, dimensions, delivery formats, and deadline.

Stop and mark `[NEEDS INPUT]` when a missing choice would materially change the creative direction. Do not invent logos, testimonials, product imagery, or performance claims.

## 2. Establish strategy

Write or confirm the problem, audience, offer, objective, single-minded message, proof, and desired response. Keep this stage textual and reviewable. Do not begin visual production before the brief is coherent.

## 3. Build editable structure

Create a two-dimensional structural version first:

- define copy hierarchy, layout, spacing, and text-safe zones;
- use SVG or HTML when appropriate;
- keep headlines, body copy, icons, and logos as editable layers;
- use approved source assets for brand marks.

Save working files in the applicable campaign directory: `assets/images/`, `assets/video/`, `assets/audio/`, or `assets/copy/`. Produce a low-cost preview for review before high-resolution or multi-format production.

## 4. Add imagery

Generate or source visual ingredients only after the structure is approved.

- Generate text-free imagery by default.
- State the intended use, aspect ratio, brand colors, composition, lighting, material, density, and negative space in prompts.
- Include negative instructions excluding text, letters, logos, watermarks, and off-brand colors unless those elements are explicitly requested.
- Add depth, dimensionality, or 3D treatment only after the two-dimensional composition works.

## 5. Produce channel outputs

Compose the approved structure and imagery into each required format. Keep editable masters in the applicable media directory under `assets/` and delivery files under `exports/`. Update `asset-manifest.csv` with scope, type, source path, working path, export path, dimensions, rights, owner, and approval state.

Reference unchanged brand or shared-library assets by canonical path. When creating a derivative, save the derivative inside the campaign and preserve the canonical source path in the manifest.

## 6. Review

Check:

- message and CTA alignment with the campaign brief;
- claim provenance and approval;
- brand colors, typography, logo treatment, and imagery direction;
- legibility, contrast, crop safety, and text-safe zones;
- channel dimensions and export quality;
- editable masters remain available.

Record feedback and decisions in `review-log.md`. Do not publish or deliver final creative without human approval.

## 7. Promote reusable content

Keep new content campaign-specific by default. After campaign review, identify assets that may be useful beyond the campaign. Promote an asset only after a human confirms that it is approved, reusable, and properly licensed.

Copy the approved reusable master into the matching `../../content-library/` media directory, add a stable row to `../../content-library/content-index.csv`, and preserve the originating campaign. Do not place one-off exports, drafts, or temporary renders in the shared library.
