const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  parseSkillVersion,
  planUpgrade,
  applyUpgrade,
} = require('../src/utils/skill-versions.js');

function makeTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'onup-safe-'));
}

function writeSkill(root, name, version, extra = '') {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'SKILL.md'),
    `---\nname: ${name}\nmetadata:\n  version: "${version}"\n---\n${extra}`,
    'utf8'
  );
  return dir;
}

test('repo counterpart that exists but is invalid is not an orphan', () => {
  const root = makeTmp();
  const repo = path.join(root, 'repo');
  const installed = path.join(root, 'installed');
  fs.mkdirSync(path.join(repo, 'opennovel-review'), { recursive: true }); // dir, no SKILL.md
  writeSkill(installed, 'opennovel-review', '1.0.0', 'user content');

  const plan = planUpgrade(installed, repo);
  assert.deepEqual(plan.orphans, [], 'invalid repo counterpart must not orphan the install');
  assert.deepEqual(plan.unknown.map(s => s.name), ['opennovel-review']);
  assert.match(plan.unknown[0].reason || '', /repo/);

  applyUpgrade(plan, installed, repo);
  assert.equal(fs.existsSync(path.join(installed, 'opennovel-review', 'SKILL.md')), true);
});

test('empty repo refuses orphan removal and preserves the installation', () => {
  const root = makeTmp();
  const repo = path.join(root, 'repo');
  const installed = path.join(root, 'installed');
  fs.mkdirSync(repo, { recursive: true });
  writeSkill(installed, 'opennovel-writing-assistant', '1.0.0', 'user content');

  const plan = planUpgrade(installed, repo);
  assert.deepEqual(plan.orphans.map(s => s.name), ['opennovel-writing-assistant']);
  assert.throws(() => applyUpgrade(plan, installed, repo), /no valid skills|Refusing/);
  assert.match(
    fs.readFileSync(path.join(installed, 'opennovel-writing-assistant', 'SKILL.md'), 'utf8'),
    /user content/
  );
});

test('a failed replacement copy preserves the old installation', () => {
  const root = makeTmp();
  const repo = path.join(root, 'repo');
  const installed = path.join(root, 'installed');
  const repoWa = writeSkill(repo, 'opennovel-writing-assistant', '1.1.0', 'new');
  writeSkill(installed, 'opennovel-writing-assistant', '1.0.0', 'old content');

  const plan = planUpgrade(installed, repo);
  assert.equal(plan.updates.length, 1);

  // Source disappears between planning and apply (permissions/disk failures behave the same)
  fs.rmSync(repoWa, { recursive: true, force: true });

  assert.throws(() => applyUpgrade(plan, installed, repo));
  const dest = path.join(installed, 'opennovel-writing-assistant');
  assert.match(fs.readFileSync(path.join(dest, 'SKILL.md'), 'utf8'), /old content/);
  const leftovers = fs.readdirSync(installed).filter(n => n.includes('upgrade-'));
  assert.deepEqual(leftovers, [], 'no temp/backup leftovers after a failed apply');
});

test('a nested directory link makes the tree different without crashing', () => {
  const root = makeTmp();
  const repo = path.join(root, 'repo');
  const installed = path.join(root, 'installed');
  writeSkill(repo, 'opennovel-review', '1.0.0', 'same');
  writeSkill(installed, 'opennovel-review', '1.0.0', 'same');

  // Repo has a regular file; installed has a junction with the same name
  fs.writeFileSync(path.join(repo, 'opennovel-review', 'extra.txt'), 'plain file', 'utf8');
  const linkTarget = writeSkill(root, 'elsewhere', '1.0.0', 'target');
  fs.symlinkSync(linkTarget, path.join(installed, 'opennovel-review', 'extra.txt'), 'junction');

  const plan = planUpgrade(installed, repo); // must not throw EISDIR
  assert.deepEqual(plan.modified.map(s => s.name), ['opennovel-review']);
  assert.deepEqual(plan.updates, []);
});

test('parseSkillVersion reads only the frontmatter block', () => {
  // Body-only version must be ignored
  assert.equal(parseSkillVersion('---\nname: x\n---\n  version: "9.9.9"\n'), null);
  // Root-level version inside frontmatter is valid
  assert.equal(parseSkillVersion('---\nname: x\nversion: "1.2.3"\n---\nbody'), '1.2.3');
  // CRLF frontmatter
  assert.equal(parseSkillVersion('---\r\nname: x\r\n  version: "1.1.0"\r\n---\r\nbody'), '1.1.0');
  // Unterminated frontmatter
  assert.equal(parseSkillVersion('---\nname: x\n  version: "1.0.0"\nno closing'), null);
  // Tab-indented version
  assert.equal(parseSkillVersion('---\nname: x\n\tversion: "2.0.0"\n---\n'), '2.0.0');
  // Original nested form still works
  assert.equal(parseSkillVersion('---\nname: x\nmetadata:\n  version: "1.1.0"\n---\n'), '1.1.0');
});
