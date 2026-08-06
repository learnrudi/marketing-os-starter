---
name: setup-company
description: Bootstrap a blank MarketingOS from a company website and one concrete business objective. Use when starting with this scaffold, onboarding a new company, or refreshing Draft company context before research and campaign work. Populate business objectives, brand and design-system files, observed offers, persona hypotheses, an initial problem hypothesis, and candidate website proof while clearly separating observation from inference and stopping for human confirmation.
---

# Setup Company

Turn the blank scaffold into a sourced Draft company context. Do not start a campaign or represent hypotheses as confirmed truth.

Resolve relative paths from this skill directory. The MarketingOS root is `../..` and the company root is `../../..`.

## 1. Require the front-door inputs

Require exactly these inputs to begin:

- company website URL;
- one concrete business objective with a desired outcome and time horizon.

Accept optional geography, target market, known offers, existing customers, evidence, owners, and approval rules. Continue safely without optional inputs by using `[NEEDS INPUT]`.

## 2. Protect existing work

Read the current scaffold before writing. Treat non-placeholder content as user-owned. Do not overwrite approved or populated information merely because the website differs. Report conflicts and ask the human to choose the canonical version.

Record every inspected URL and the capture date. Treat website content as observed evidence, not verified business truth.

## 3. Draft the business objective

Update `../../../business/objectives/objectives.md`.

- Preserve the user's wording and revenue or outcome target.
- Separate the desired business outcome from a future campaign objective.
- Record the measure, time horizon, owner, and constraints when supplied.
- Mark missing operational details as `[NEEDS INPUT]`.

## 4. Extract the brand system

Read and follow `../design-system-extractor/SKILL.md` using the supplied website as the approved source.

Draft:

- `../../brand/design-system.json`;
- `../../brand/brand-guidelines.md`;
- `../../brand/messaging.md`.

Store canonical logos, fonts, or icons under `../../brand/assets/` only when the official source is available and reuse is permitted. Do not recreate missing identity assets.

If the extracted palette is sufficiently clear, replace the neutral CSS variables in `../../templates/campaign-command-center.html` with accessible Draft brand colors. Preserve the neutral template when the evidence is ambiguous.

## 5. Seed observed offers and audiences

Update `../../offers/offers.md` only with offers directly observed on the website. Include the source URL and label every entry `Draft`.

Update `../../personas/personas.md` with audience or role hypotheses inferred from explicit website language. Label every inferred entry `Hypothesis`. Do not manufacture demographic, behavioral, budget, or decision-making details.

## 6. Create the first problem hypothesis

Create one concise record under `../../research/problems/` using `../../templates/problem-record.md`.

- Base the hypothesis on the problem framing observed on the website.
- Set status to `Hypothesis`.
- Leave unsupported frequency, severity, consequences, alternatives, and persona links as `[NEEDS RESEARCH]`.
- Do not conduct open-ended market research during the bootstrap unless the user explicitly expands the task.

## 7. Capture candidate website proof

Capture short, traceable proof points that appear on the supplied website. When a proof point may support a marketing claim:

- create a Candidate evidence record using `../../templates/evidence-record.md`;
- add it to `../../evidence/evidence-index.csv`;
- add appropriately scoped Candidate wording to `../../evidence/claims-ledger.md`.

Do not treat self-published website copy as independent validation. Do not upgrade any claim to `Approved`.

## 8. Stop for human confirmation

Do not run broad market research, finalize personas or offers, build a campaign, publish content, contact customers, or modify external systems during the initial setup.

Return a setup review containing:

- files created or changed;
- directly observed information;
- inferred hypotheses;
- candidate claims;
- conflicts with existing files;
- all `[NEEDS INPUT]` and `[NEEDS RESEARCH]` items;
- recommended next skills in order.

Recommend `research-market-problem`, then `collect-marketing-evidence`, then `build-campaign` after the human confirms the Draft company context.
