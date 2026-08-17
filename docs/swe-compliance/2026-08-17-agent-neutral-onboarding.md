# Agent-Neutral Onboarding Compliance Checklist

Status: In progress
Owner: RUDI
Date: 2026-08-17

## Phase 0: Baseline And Manual Lookup

- [x] Scope: replace platform-specific, bracket-edit onboarding with a universal prompt for file-capable AI agents.
- [x] Files inspected before editing: `README.md`, `docs/index.html`, `marketing-os/skills/setup-company/SKILL.md`, `marketing-os/system/approval-rules.md`, repository status, GitHub Pages configuration.
- [x] Relevant SWE manual sections: Appendix B5 accessibility, B9 browser compatibility, B10 frontend testing, Appendix C testing discipline, and Security Standard F13 agent safety.
- [x] Current-state commands: `git status --short --branch`, `git worktree list --porcelain`, `rg -n "Claude|Cowork|setup-company"`, and `gh api repos/learnrudi/marketing-os-starter/pages`.
- [x] Risks and invariants: preserve the existing dirty checkout; keep the download self-contained; require human review; prohibit unapproved external actions; do not claim every chat product can access local files.
- [x] Exit criteria: clean isolated worktree created from `origin/main` and source paths confirmed.

## Phase 1: Scope Lock

- [x] In scope: universal onboarding prompt, human and agent entry points, agent-neutral landing-page and README language, agent-neutral approval terminology, deterministic onboarding contract test.
- [x] Non-goals: campaign feature changes, populated company data, connector setup, automatic publishing, new dependencies, or changes to the MarketingOS domain model.
- [x] Expected files touched: `START-HERE.md`, `AGENTS.md`, `README.md`, `docs/index.html`, `marketing-os/system/approval-rules.md`, `tests/onboarding-contract.test.mjs`, and this checklist.
- [x] External inputs and trust boundaries: organization website content and user-provided business objectives remain untrusted evidence until reviewed.
- [x] Failure behavior: agents must preserve non-placeholder content, mark unknowns, and stop for human confirmation before research expansion, campaign production, or external actions.
- [x] Exit criteria: scope is explicit and unrelated populated MarketingOS files remain outside the worktree.

## Phase 2: Red Tests

- [x] Observable behavior to prove: the download contains human and agent entry points; the landing page copies an agent-neutral prompt that asks for the two inputs interactively; approval rules are platform-neutral.
- [x] Test files to add or edit: `tests/onboarding-contract.test.mjs`.
- [x] Red command: `node --test tests/onboarding-contract.test.mjs`.
- [x] Expected failure: `START-HERE.md must ship in the downloaded workspace`.
- [x] Exit criteria: the new test failed for the expected missing-entry-point reason before implementation.

## Phase 3: Implementation

- [x] Implementation rules: made the smallest coherent copy and entry-point changes; retained the ZIP link and clipboard fallback; added no dependencies.
- [x] Files allowed to change: changes remain limited to the expected files named in Phase 1.
- [x] Validation and error-handling requirements: the universal prompt names exact source files, requires provenance, preserves existing work, treats website content as untrusted evidence, and defines stop conditions.
- [x] Observability requirements: clipboard status remains available through the existing ARIA live region; agent work remains auditable through durable files and review output.
- [x] Exit criteria: the landing page, `START-HERE.md`, `AGENTS.md`, README, and approval rules express the same safe user journey.

## Phase 4: Green Tests And Refactor

- [x] Green command: `node --test tests/onboarding-contract.test.mjs` (1 passed).
- [x] Refactor constraints: removed stale platform-only and bracket-replacement language without restructuring unrelated styles or skills.
- [x] Regression checks: reran the same behavior contract after README tree cleanup; 1 test passed.
- [x] Exit criteria: targeted test remains green after refactor.

## Phase 5: Full Verification

- [x] Targeted tests: `node --test tests/onboarding-contract.test.mjs` passed (1 test).
- [x] Full suite: `node --test` passed (1 test; the repository has one test file).
- [x] Build/typecheck/lint: no package build exists; all `.js`, `.cjs`, and `.mjs` files passed `node --check`, and the extracted landing-page script compiled with `new Function`.
- [x] JS/TS debt scan, if applicable: no debt policy or JavaScript package root exists. Structural fallback search found no TODO, debug logging, process, shell, or dynamic-code patterns in the new test. The direct scanner reported zero findings but had no `src` graph, so its signal is limited.
- [x] Live smoke checks: served `docs/` locally; desktop 1280px and mobile 390px had no page-level horizontal overflow; semantic DOM contained the expected landmarks; the copy button wrote the exact 1,212-character prompt and emitted its ARIA live status; browser console had no warnings or errors; the GitHub ZIP link resolved to the expected codeload archive.
- [x] Exit criteria: deterministic checks pass and desktop/mobile rendered review confirms the start flow is usable. Automated accessibility tooling was unavailable and is recorded below.

## Phase 6: Docs, Contracts, And Closure

- [x] Docs or API contracts updated: `README.md`, `START-HERE.md`, `AGENTS.md`, the landing page, and agent-neutral approval rules.
- [x] Final files touched: `AGENTS.md`, `START-HERE.md`, `README.md`, `docs/index.html`, `marketing-os/system/approval-rules.md`, `tests/onboarding-contract.test.mjs`, and this checklist.
- [x] Commands run and results: red test failed on missing `START-HERE.md`; unchanged behavior contract passed after implementation and refactor; full Node tests and syntax checks passed; rendered desktop/mobile and clipboard smoke checks passed; `git diff --check` passed.
- [x] Accepted debt: this dependency-free repository has no automated accessibility or visual-regression runner. Semantic DOM, keyboard-native controls, ARIA live status, desktop/mobile screenshots, and overflow checks were reviewed manually. The installed `tidy` build is HTML4-era and rejected valid HTML5 landmarks, so it was not treated as authoritative.
- [ ] Definition of Done: onboarding contract passes, user flow is smoke-tested, docs agree, only task files are committed, and the published GitHub branch is updated.
