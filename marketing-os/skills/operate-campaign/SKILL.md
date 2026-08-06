---
name: operate-campaign
description: Review and maintain an existing marketing campaign workspace by reconciling plans, calendars, assets, approvals, deadlines, blockers, and results. Use for daily launch checks, weekly campaign reviews, status updates, approval preparation, next-action planning, or post-campaign improvement.
---

# Operate Campaign

Turn the campaign filesystem into an accurate operating view. Update durable working files and make the next human decision obvious.

Resolve relative paths from this skill directory. The MarketingOS root is `../..`.

## 1. Read campaign state

Require a campaign directory under `../../campaigns/`. Read:

- `brief.md` and `plan.md`;
- `content-calendar.csv` and `asset-manifest.csv`;
- `review-log.md`;
- `command-center.html`;
- relevant files under `sources/`, `assets/`, `exports/`, and `results/`.

Read `../../system/approval-rules.md`, `../../system/channel-rules.md`, and `../../evidence/claims-ledger.md` when they are relevant to open work.

## 2. Reconcile reality

Compare the files rather than trusting a single status label. Check:

- current date against milestones and delivery dates;
- required assets against the manifest and filesystem;
- `Brand` and `Shared` asset references against their canonical paths under `../../brand/assets/` and `../../content-library/`;
- copy and creative state against recorded approvals;
- campaign claims against the evidence ledger;
- calendar entries against approved deliverables;
- results against the campaign objective and named metric.

Treat missing, conflicting, or stale information as an explicit issue. Never infer that work is approved, published, or complete without evidence.

## 3. Prioritize next actions

Identify:

1. blocked work;
2. overdue work;
3. approvals required next;
4. work due before the next review;
5. low-risk preparation that can proceed without external action.

Assign an owner and target date when that information is known. Mark missing assignments as `[NEEDS INPUT]`.

## 4. Update the operating surface

Update the campaign files so they agree:

- refresh statuses and next actions in `plan.md`;
- update calendar and manifest rows only from evidence;
- record review decisions in `review-log.md`;
- update `command-center.html` with current milestones, blockers, approvals, and metrics;
- write dated observations or results under `results/` when performance data exists.

Preserve historical decisions. Do not overwrite prior approvals or alter evidence to make the campaign appear complete.

At campaign close, identify content that might be reusable. Do not promote it automatically. After explicit human approval, copy the reusable master into the appropriate `../../content-library/` media directory and add its canonical record to `../../content-library/content-index.csv` with source campaign, rights, channels, tags, transcript or alt text, and last review date.

## 5. Report the review

Return a concise review with:

- overall state;
- what changed;
- blockers and risks;
- approvals needed;
- the next three actions;
- files updated;
- missing evidence or data.

## 6. Respect action boundaries

Reading connected sources may be allowed when authorized. Sending email, publishing content, changing external calendars or project records, launching media, or spending money requires explicit human approval. Prepare the proposed action and show exactly what will happen before requesting approval.

For scheduled reviews, perform only low-risk reads and local workspace updates unless the schedule explicitly includes a separately approved external action.
