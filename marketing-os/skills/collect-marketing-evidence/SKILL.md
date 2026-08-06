---
name: collect-marketing-evidence
description: Find, capture, classify, and document owned, customer, and external evidence that may support or challenge marketing claims. Use when researching service-delivery proof, reviews, testimonials, case-study evidence, ad comments, customer feedback, campaign results, awards, certifications, or third-party validation while preserving provenance, permissions, limitations, and approval status.
---

# Collect Marketing Evidence

Build an auditable evidence base without turning positive signals into unsupported claims.

Resolve relative paths from this skill directory. The MarketingOS root is `../..`.

## 1. Define the evidence question

Require a subject, claim hypothesis, offer, campaign, or service-delivery question. Confirm the allowed source scope and whether authenticated browser or connector access is authorized.

Read `../../evidence/claims-ledger.md`, `../../evidence/evidence-index.csv`, relevant campaign results, and any applicable files under `../../offers/`, `../../research/`, and `../../system/approval-rules.md`.

Do not frame the search only as “find proof that we are good.” Search for supportive, mixed, and contradictory signals so the resulting claims are appropriately scoped.

## 2. Search evidence classes

Search only sources within the authorized scope:

- `Owned` — delivery records, performance data, project outcomes, case studies, support records, and campaign results.
- `Customer` — reviews, testimonials, surveys, interviews, support feedback, social responses, and comments on advertisements or posts.
- `External` — independent research, benchmarks, awards, certifications, analyst coverage, and reputable third-party references.

Use authorized Chrome, browser, file, and connector access when available. Do not bypass authentication or access controls. Do not collect private personal information that is unnecessary for the evidence question.

## 3. Capture provenance

For each distinct evidence item, create `../../evidence/records/<date>-<evidence-slug>.md` using `../../templates/evidence-record.md`, then add a row to `../../evidence/evidence-index.csv`.

Record:

- evidence type and subject;
- exact source URL or local path;
- source and capture dates;
- direct observation and surrounding context;
- potential claim supported;
- limitations or counterevidence;
- confidence;
- permission and attribution status;
- identifiable people or organizations;
- the originating campaign when relevant.

Keep quoted excerpts short and exact. Do not paraphrase a person into a stronger endorsement than they provided.

## 4. Handle comments, reviews, and testimonials

Treat public comments and reviews as customer research by default. Aggregate themes or sentiment when appropriate.

Do not use an identifiable comment as a testimonial merely because it is public. Record whether permission, platform terms, customer consent, legal review, or attribution approval is required. Redact unnecessary personal data from local records.

## 5. Create candidate claims

Add or update a row in `../../evidence/claims-ledger.md` only when the evidence is relevant to a specific claim. Scope the wording to what the evidence actually supports.

Use:

- `Draft` when a claim has been proposed without adequate verification;
- `Candidate` when supporting evidence exists but wording, permissions, or scope need review;
- `Needs review` when the evidence package is ready for an approver;
- `Approved` only after recorded human approval;
- `Expired` or `Rejected` when the claim must not be used.

Never infer approval from silence, prior publication, or the existence of a positive review.

## 6. Validate the evidence package

Before completion:

- confirm every source is traceable;
- distinguish evidence from inference;
- include material counterevidence or limitations;
- verify dates and current relevance;
- confirm permission and attribution status;
- ensure claim language does not exceed the evidence;
- identify missing internal data or human decisions.

## 7. Report the result

Return:

- evidence collected by class;
- candidate claims created or changed;
- contradictory or limiting evidence;
- permissions or approvals required;
- files created or updated;
- recommended next step.

Do not publish testimonials, change advertisements, contact reviewers, or make external representations without explicit human approval.
