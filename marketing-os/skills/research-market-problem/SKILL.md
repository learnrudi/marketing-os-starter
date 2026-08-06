---
name: research-market-problem
description: Investigate and document a customer or market problem using current, sourced research and authorized connected information. Use when validating a problem hypothesis, learning who experiences it, understanding triggers and consequences, comparing current alternatives, or producing a research record that can inform future personas, offers, messaging, and campaigns.
---

# Research Market Problem

Turn a problem hypothesis into a sourced, reviewable problem record. Separate observation, inference, and open questions.

Resolve relative paths from this skill directory. The MarketingOS root is `../..`.

## 1. Define the research question

Require:

- the problem hypothesis;
- market, geography, or category scope;
- relevant customer roles when known;
- the decision the research should inform;
- recency or deadline requirements.

Read existing files under `../../research/`, `../../personas/`, `../../offers/`, and `../../evidence/`. Read `../../../business/objectives/objectives.md` when the research is connected to a company outcome. Do not assume an existing persona or offer is correct merely because it exists.

## 2. Plan the evidence search

Identify questions about:

- who experiences the problem and in what situation;
- triggers, frequency, severity, and consequences;
- language customers use to describe it;
- current tools, services, manual processes, and the option to do nothing;
- evidence that contradicts or narrows the hypothesis;
- unresolved segments, contexts, or alternatives.

Use authorized internet, browser, file, and connector access. Do not bypass authentication, access controls, robots restrictions, or platform limitations.

## 3. Gather credible sources

Prefer direct customer language, primary research, official data, first-party product information, and reputable current sources. Use secondary commentary to discover leads, not as the sole support for important claims.

For every source, record:

- title, publisher or speaker, and URL or local path;
- publication date and capture date;
- what was directly observed;
- the question the source helps answer;
- limitations, audience, and potential bias.

Use short excerpts only when necessary. Summarize instead of copying long source passages.

## 4. Test the hypothesis

Actively seek both supporting and contradictory evidence. Distinguish:

- `Finding` — directly supported by a source;
- `Inference` — a reasoned interpretation of findings;
- `Hypothesis` — a proposition that still needs evidence;
- `Unknown` — information not established by the available research.

Do not invent market size, frequency, costs, customer quotations, or confidence. Do not upgrade a problem to `Validated` solely because several articles repeat the same unsourced assertion.

## 5. Write the problem record

Create or update `../../research/problems/<problem-slug>.md` using `../../templates/problem-record.md`.

Include:

- a concise problem statement;
- affected roles or segments;
- situations and triggers;
- consequences and current alternatives;
- supporting evidence and counterevidence;
- source links and confidence;
- open questions;
- possible implications clearly labeled as unapproved.

Use status `Hypothesis`, `Supported`, `Validated`, or `Rejected`. Require human acceptance before setting `Validated`. Link persona, offer, or evidence IDs only when those records exist.

## 6. Preserve research inputs

Store permitted original source files under `../../research/source-material/`. Store market-wide findings under `../../research/market/` and alternative or competitor findings under `../../research/competitors/` when separate records are useful. Do not duplicate material already available through an authorized connector unless durable local preservation is necessary and permitted.

## 7. Report the result

Return:

- current problem status;
- strongest supporting findings;
- meaningful counterevidence;
- remaining questions;
- files created or updated;
- the next research or human decision.

Do not create public claims, finalize personas, define offers, or publish content as part of this skill.
