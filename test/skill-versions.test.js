const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  parseSkillVersion,
  compareVersions,
  dirsEqual,
  planUpgrade,
  applyUpgrade,
} = require('../src/utils/skill-versions.js');

function makeTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'onup-'));
}

function writeSkill(root, name, version, extra = '') {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  const front = version === null
    ? `---\nname: ${name}\n---\n`
    : `---\nname: ${name}\nmetadata:\n  version: "${version}"\n---\n`;
  fs.writeFileSync(path.join(dir, 'SKILL.md'), front + extra, 'utf8');
  return dir;
}

test('parseSkillVersion reads frontmatter version', () => {
  assert.equal(parseSkillVersion('---\nname: x\nmetadata:\n  version: "1.1.0"\n---\nbody'), '1.1.0');
  assert.equal(parseSkillVersion("---\nmetadata:\n  version: '2.0.3'\n---\n"), '2.0.3');
  assert.equal(parseSkillVersion('---\nname: x\n---\nno version here'), null);
});

test('compareVersions compares numeric segments', () => {
  assert.equal(compareVersions('1.0.0', '1.1.0'), -1);
  assert.equal(compareVersions('1.1.0', '1.1.0'), 0);
  assert.equal(compareVersions('1.2.0', '1.1.0'), 1);
  assert.equal(compareVersions('1.10.0', '1.9.0'), 1);
  assert.equal(compareVersions('0.9.9', '1.0.0'), -1);
});

test('dirsEqual compares file lists and contents', () => {
  const root = makeTmp();
  const a = path.join(root, 'a');
  const b = path.join(root, 'b');
  fs.mkdirSync(a, { recursive: true });
  fs.mkdirSync(b, { recursive: true });
  fs.writeFileSync(path.join(a, 'SKILL.md'), 'same-content', 'utf8');
  fs.writeFileSync(path.join(b, 'SKILL.md'), 'same-content', 'utf8');
  assert.equal(dirsEqual(a, b), true);
  fs.writeFileSync(path.join(b, 'SKILL.md'), 'changed', 'utf8');
  assert.equal(dirsEqual(a, b), false);
  fs.writeFileSync(path.join(b, 'extra.txt'), 'more', 'utf8');
  assert.equal(dirsEqual(a, b), false);
});

test('planUpgrade sorts skills into the right buckets', () => {
  const root = makeTmp();
  const repo = path.join(root, 'repo');
  const installed = path.join(root, 'installed');
  fs.mkdirSync(installed, { recursive: true });

  // Repo (upstream) skills
  writeSkill(repo, 'opennovel-writing-assistant', '1.0.0', 'wa repo');
  writeSkill(repo, 'opennovel-bible-builder', '1.0.0', 'bb repo');
  writeSkill(repo, 'opennovel-review', '1.0.0', 'rv repo');
  writeSkill(repo, 'opennovel-outline-builder', '1.0.0', 'ob repo');
  writeSkill(repo, 'opennovel-continuity-manager', '1.0.0', 'cm repo'); // repo-only: never installed

  // Installed skills
  writeSkill(installed, 'opennovel-writing-assistant', '0.9.0', 'wa old');       // → updates
  writeSkill(installed, 'opennovel-bible-builder', '1.0.0', 'bb repo');         // → current (identical)
  writeSkill(installed, 'opennovel-review', '1.0.0', 'rv repo\nlocal edit');    // → modified
  writeSkill(installed, 'opennovel-outline-builder', '9.9.9', 'ob newer');      // → newer
  writeSkill(installed, 'opennovel-exporter', '1.0.0', 'orphan');               // → orphans
  fs.mkdirSync(path.join(installed, 'opennovel-broken'), { recursive: true });  // → unknown (no SKILL.md)
  writeSkill(installed, 'other-skill', '0.1.0', 'not ours');                    // → ignored

  const plan = planUpgrade(installed, repo);

  assert.deepEqual(plan.updates, [{ name: 'opennovel-writing-assistant', from: '0.9.0', to: '1.0.0' }]);
  assert.deepEqual(plan.current.map(s => s.name), ['opennovel-bible-builder']);
  assert.deepEqual(plan.modified.map(s => s.name), ['opennovel-review']);
  assert.deepEqual(plan.newer.map(s => s.name), ['opennovel-outline-builder']);
  assert.deepEqual(plan.orphans.map(s => s.name), ['opennovel-exporter']);
  assert.deepEqual(plan.unknown.map(s => s.name), ['opennovel-broken']);

  const all = Object.values(plan).flat().map(s => s.name);
  assert.equal(all.includes('other-skill'), false, 'non-opennovel dirs must be ignored');
  assert.equal(all.includes('opennovel-continuity-manager'), false, 'repo-only skills are not upgrade targets');
});

test('planUpgrade on a missing installed directory returns empty buckets', () => {
  const root = makeTmp();
  const repo = path.join(root, 'repo');
  writeSkill(repo, 'opennovel-writing-assistant', '1.0.0', 'wa');
  const plan = planUpgrade(path.join(root, 'does-not-exist'), repo);
  for (const bucket of Object.values(plan)) assert.deepEqual(bucket, []);
});

test('applyUpgrade replaces updates, removes orphans, touches nothing else', () => {
  const root = makeTmp();
  const repo = path.join(root, 'repo');
  const installed = path.join(root, 'installed');
  fs.mkdirSync(installed, { recursive: true });

  writeSkill(repo, 'opennovel-writing-assistant', '1.1.0', 'new version');
  writeSkill(repo, 'opennovel-review', '1.0.0', 'review repo');
  const waInstalled = writeSkill(installed, 'opennovel-writing-assistant', '1.0.0', 'old version');
  writeSkill(installed, 'opennovel-review', '1.0.0', 'review repo\nlocal edit');
  writeSkill(installed, 'opennovel-legacy-tool', '1.0.0', 'orphan');
  writeSkill(installed, 'other-skill', '0.1.0', 'untouched');

  const plan = planUpgrade(installed, repo);
  const applied = applyUpgrade(plan, installed, repo);

  assert.deepEqual(applied.map(a => a.action).sort(), ['removed', 'updated']);
  assert.match(fs.readFileSync(path.join(waInstalled, 'SKILL.md'), 'utf8'), /new version/);
  assert.equal(fs.existsSync(path.join(installed, 'opennovel-legacy-tool')), false);
  assert.match(fs.readFileSync(path.join(installed, 'opennovel-review', 'SKILL.md'), 'utf8'), /local edit/);
  assert.equal(fs.existsSync(path.join(installed, 'other-skill', 'SKILL.md')), true);
});

test('applyUpgrade unlinks a junctioned skill dir instead of recursing into the repo copy', () => {
  const root = makeTmp();
  const repo = path.join(root, 'repo');
  const installed = path.join(root, 'installed');
  fs.mkdirSync(installed, { recursive: true });

  const repoWa = writeSkill(repo, 'opennovel-writing-assistant', '1.1.0', 'repo new');
  const repoOld = path.join(root, 'old-copy');
  writeSkill(root, 'old-copy', '1.0.0', 'old');
  const dest = path.join(installed, 'opennovel-writing-assistant');
  fs.symlinkSync(repoOld, dest, 'junction');

  const plan = planUpgrade(installed, repo);
  assert.equal(plan.updates.length, 1);
  applyUpgrade(plan, installed, repo);

  // Repo copy and old linked copy are untouched
  assert.match(fs.readFileSync(path.join(repoWa, 'SKILL.md'), 'utf8'), /repo new/);
  assert.match(fs.readFileSync(path.join(repoOld, 'SKILL.md'), 'utf8'), /old/);
  // Destination is now a real directory with the new content, not a link
  assert.equal(fs.lstatSync(dest).isSymbolicLink(), false);
  assert.match(fs.readFileSync(path.join(dest, 'SKILL.md'), 'utf8'), /repo new/);
});
