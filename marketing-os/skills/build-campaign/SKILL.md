---
name: build-campaign
description: Build a complete, self-contained marketing campaign workspace from approved business objectives and marketing context. Use when starting a launch, event promotion, newsletter, social campaign, webinar follow-up, or other repeatable campaign that needs a brief, plan, calendar, creative brief, asset tracking, approvals, and a command-center artifact.
---

# Build Campaign

Turn an approved objective into a reviewable campaign workspace. Create durable files instead of leaving important decisions only in chat.

Resolve relative paths from this skill directory. The MarketingOS root is `../..`.

## 1. Establish the campaign contract

Require these inputs before finalizing the brief:

- business objective and desired audience movement;
- the customer or market problem record and its current validation status;
- primary audience;
- offer and call to action;
- launch date or working deadline;
- campaign owner and required approvers.

Read the relevant files under `../../research/`, `../../personas/`, `../../offers/`, `../../evidence/`, `../../brand/`, and `../../system/`. Read `../../../business/objectives/objectives.md` for the business outcome. Use connected sources when authorized. Mark unavailable information as `[NEEDS INPUT]`; do not invent facts, claims, budgets, dates, or approvals.

## 2. Create the workspace

Create `../../campaigns/YYYY-MM-DD-campaign-slug/` and copy the standard files from `../../templates/` using these names:

```text
brief.md
plan.md
creative-brief.md
content-calendar.csv
asset-manifest.csv
command-center.html
review-log.md
```

Also create:

```text
sources/
assets/images/
assets/video/
assets/audio/
assets/copy/
exports/
results/
```

Use lowercase hyphenated names. Keep the entire campaign self-contained.

## 3. Write the strategy

Populate `brief.md` first. Distinguish:

- the business objective, which names the organizational outcome;
- the market problem, which describes the customer's situation and must link to a record under `../../research/problems/`;
- the campaign objective, which names the audience movement;
- the primary metric, which indicates whether that movement occurred.

Do not present a `Hypothesis` problem as an established customer fact. Preserve its status and frame unresolved assumptions carefully. Tie every claim or proof point to `../../evidence/claims-ledger.md`. Record unresolved questions instead of masking them with plausible language.

## 4. Plan execution

Populate `plan.md`, `content-calendar.csv`, and `creative-brief.md` from the approved brief.

- Adapt work to each selected channel using `../../system/channel-rules.md`.
- Search `../../brand/assets/` and `../../content-library/` before requesting or creating a new asset.
- Reference an unchanged shared asset by canonical path and set its manifest scope to `Brand` or `Shared`; do not duplicate it inside the campaign.
- Copy a shared asset into the campaign only when creating a campaign-specific derivative, and record the original source path.
- Make dependencies, owners, due dates, and approval gates explicit.
- Create only deliverables needed to achieve the campaign objective.
- Preserve editable copy and visual layers through production.

## 5. Build the command center

Populate `command-center.html` as the visible campaign working surface. Include the objective, audience, offer, metric, deliverables, dates, status, approvals, blockers, and next actions. Link or name the underlying source files so the artifact remains traceable to the filesystem.

## 6. Validate and hand off

Before declaring the workspace ready:

- verify all required files and directories exist;
- search for unresolved template tokens such as `{{...}}`;
- list every `[NEEDS INPUT]` item;
- confirm every marketing claim has an approved evidence entry;
- verify dates and owners agree across the brief, plan, calendar, and command center;
- confirm the approval path from `../../system/approval-rules.md`.

Do not send, publish, schedule externally, spend money, or modify external systems. Prepare those actions and request human approval.
