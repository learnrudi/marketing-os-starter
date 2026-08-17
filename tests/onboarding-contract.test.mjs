import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const normalize = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/\r\n/g, '\n')
    .trim();

test('the download provides one agent-neutral, self-contained onboarding path', () => {
  for (const path of ['START-HERE.md', 'AGENTS.md']) {
    assert.equal(
      existsSync(new URL(`../${path}`, import.meta.url)),
      true,
      `${path} must ship in the downloaded workspace`,
    );
  }

  const startHere = read('START-HERE.md');
  const agentInstructions = read('AGENTS.md');
  const readme = read('README.md');
  const landingPage = read('docs/index.html');
  const approvalRules = read('marketing-os/system/approval-rules.md');

  const markdownPrompt = startHere.match(
    /<!-- ONBOARDING_PROMPT_START -->\s*```text\s*([\s\S]*?)\s*```\s*<!-- ONBOARDING_PROMPT_END -->/,
  );
  const pagePrompt = landingPage.match(/<pre id="prompt-text">([\s\S]*?)<\/pre>/);

  assert.ok(markdownPrompt, 'START-HERE.md must identify the canonical onboarding prompt');
  assert.ok(pagePrompt, 'the landing page must expose a copyable onboarding prompt');
  assert.equal(
    normalize(pagePrompt[1]),
    normalize(markdownPrompt[1]),
    'the website and downloaded prompt must stay synchronized',
  );

  const prompt = normalize(markdownPrompt[1]);
  assert.match(prompt, /Read `?README\.md`?/);
  assert.match(prompt, /marketing-os\/skills\/setup-company\/SKILL\.md/);
  assert.match(prompt, /organization(?:'s|’s) website/i);
  assert.match(prompt, /business objective/i);
  assert.match(prompt, /ask(?:ing)? me/i);
  assert.match(prompt, /stop/i);
  assert.match(prompt, /human confirmation|my confirmation/i);
  assert.doesNotMatch(prompt, /\[YOUR (?:WEBSITE|BUSINESS OBJECTIVE)\]/);

  assert.match(readme, /START-HERE\.md/);
  assert.match(agentInstructions, /marketing-os\/skills\/setup-company\/SKILL\.md/);
  assert.match(
    landingPage,
    /https:\/\/github\.com\/learnrudi\/marketing-os-starter\/archive\/refs\/heads\/main\.zip/,
  );
  assert.match(landingPage, />Copy onboarding prompt</);

  for (const [name, content] of [
    ['README.md', readme],
    ['docs/index.html', landingPage],
    ['marketing-os/system/approval-rules.md', approvalRules],
  ]) {
    assert.doesNotMatch(content, /\b(?:Claude|Cowork)\b/, `${name} must remain agent-neutral`);
  }
});
