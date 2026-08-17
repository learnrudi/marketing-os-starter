# MarketingOS Starter

Start with an empty company workspace. Give a file-capable AI agent a website and one business objective, review the resulting Draft context, and then build a campaign from confirmed information.

**Workshop start page:** <https://learnrudi.github.io/marketing-os-starter/>

No GitHub account is required. Use the start page to download the starter as a ZIP and copy the universal onboarding prompt. The same instructions are available offline in [`START-HERE.md`](START-HERE.md).

## Start here

1. Download and unzip the complete starter folder.
2. Open or connect the folder in a file-capable AI agent.
3. Paste the universal prompt from [`START-HERE.md`](START-HERE.md).
4. Answer the agent's questions about your website and one concrete business objective.
5. Review every Draft, Hypothesis, Candidate, and `[NEEDS INPUT]` item.
6. Confirm or correct the company context before campaign production.

The prompt instructs the agent to read the setup procedure directly, ask for the two required inputs, protect existing work, and stop for confirmation. A minimal equivalent request is:

```text
Read START-HERE.md and begin the MarketingOS onboarding. Ask me for the two required inputs.
```

Optional context may include geography, target market, known offers, existing customers, or approved evidence. The setup skill must continue safely when only the two required inputs are available.

## Agent compatibility

The workspace uses Markdown, JSON, CSV, HTML, and ordinary folders. It can work with any AI agent that can read and write the downloaded folder and follow the embedded `SKILL.md` procedures. Website setup and market research also require authorized browser or internet access.

A chat interface without access to the local folder cannot operate the MarketingOS directly. Automatic skill discovery varies by agent, so the universal prompt names the exact setup instruction file.

## What setup creates

The first pass drafts:

- the business objective;
- the machine-readable design system;
- brand guidelines and messaging;
- offers observed on the website;
- audience or persona hypotheses;
- an initial customer-problem hypothesis;
- candidate proof found on the supplied website;
- a list of decisions requiring human confirmation.

Website language is evidence of how the company currently presents itself. It is not automatic proof that an offer, persona, customer problem, or performance claim is correct.

## What happens next

After confirming the first pass:

1. Use `research-market-problem` to validate the customer problem.
2. Use `collect-marketing-evidence` to gather owned, customer, and external proof.
3. Confirm the personas and offers.
4. Use `build-campaign` to create a campaign workspace.
5. Use `create-brand-creative` and `operate-campaign` to produce and manage the work.

## Workspace

```text
marketing-os-starter/
├── AGENTS.md
├── README.md
├── START-HERE.md
├── business/
│   └── objectives/
└── marketing-os/
    ├── research/
    ├── personas/
    ├── offers/
    ├── evidence/
    ├── brand/
    ├── system/
    ├── content-library/
    ├── templates/
    ├── skills/
    └── campaigns/
```

## Domain responsibilities

- `business/objectives/` defines the outcomes the company is trying to achieve.
- `marketing-os/research/` contains market problems, market and competitor research, and preserved source material.
- `marketing-os/personas/` describes the people marketing needs to understand and move.
- `marketing-os/offers/` describes what the company is asking those people to consider or buy.
- `marketing-os/evidence/` contains provenance-aware proof and the claims ledger.
- `marketing-os/brand/` contains the design system, brand guidelines, messaging, and canonical identity assets.
- `marketing-os/system/` contains the approval and channel rules governing how work operates.
- `marketing-os/content-library/` contains approved content intended for reuse across campaigns.
- `marketing-os/templates/` contains reusable starting structures.
- `marketing-os/skills/` contains reusable procedures for recurring work.
- `marketing-os/campaigns/` contains one self-contained folder per campaign.

## File and approval rules

- Prefer Markdown for knowledge, briefs, decisions, and instructions.
- Prefer JSON or CSV for structured records, metrics, calendars, and manifests.
- Prefer SVG and HTML for editable visuals and working artifacts.
- Use PDF, DOCX, PPTX, and PNG primarily as delivery formats.
- Preserve source provenance and mark missing information as `[NEEDS INPUT]`.
- Never invent company facts, customer quotations, approvals, or performance claims.
- Require human approval before anything is sent, published, purchased, scheduled externally, or used to change an external system.
