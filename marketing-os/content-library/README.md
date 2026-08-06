# Shared Content Library

This library contains approved content intended for reuse across multiple campaigns.

```text
content-library/
├── content-index.csv
├── images/
├── video/
│   └── transcripts/
├── audio/
│   └── transcripts/
└── copy/
```

## Boundary

- Begin newly created or acquired content inside the campaign that owns it.
- Reference an existing shared asset by its canonical path instead of copying it into a campaign.
- Copy a shared asset into the campaign only when creating a campaign-specific derivative.
- Promote content into this library only after a human confirms it is approved, reusable, and properly licensed.
- Keep official logos, fonts, and canonical identity elements under `../brand/assets/`.

## Promotion workflow

1. Create or collect the asset inside a campaign.
2. Record its source, rights, status, and working path in the campaign's `asset-manifest.csv`.
3. Complete copy, creative, claims, accessibility, and rights review.
4. Obtain explicit human approval to promote it.
5. Place the approved reusable master in the appropriate library directory.
6. Add one row to `content-index.csv` using a stable asset ID and canonical path.
7. Keep the originating campaign recorded for provenance.

For video and audio, add a machine-readable Markdown transcript when speech is present. For images, record useful alt text. Do not place drafts, temporary renders, or one-off campaign exports in this library.
