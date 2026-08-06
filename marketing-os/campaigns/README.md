# Campaign Workspaces

Create one folder per campaign using `YYYY-MM-DD-campaign-slug`.

The `build-campaign` skill should create this structure from the files in `../templates/`:

```text
YYYY-MM-DD-campaign-slug/
├── brief.md
├── plan.md
├── creative-brief.md
├── content-calendar.csv
├── asset-manifest.csv
├── command-center.html
├── review-log.md
├── sources/
├── assets/
│   ├── images/
│   ├── video/
│   ├── audio/
│   └── copy/
├── exports/
└── results/
```

Keep one campaign self-contained. Preserve source provenance, editable working files, approvals, exports, and final results together.

New assets begin inside the campaign. From a campaign folder, reference shared assets under `../../content-library/` and canonical identity assets under `../../brand/assets/` rather than copying them. Promote a campaign asset into the shared library only after it is approved, reusable, and properly licensed.

Use these manifest scopes:

- `Brand` — canonical identity asset referenced from `brand/assets/`.
- `Shared` — approved reusable content referenced from `content-library/`.
- `Campaign` — source, working, or derived content owned by this campaign.
