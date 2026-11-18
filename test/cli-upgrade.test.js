const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const BIN = path.join(REPO_ROOT, 'bin', 'opennovel.js');
const REPO_SKILLS = path.join(REPO_ROOT, 'skills');

function makeProject() {
  const proj = fs.mkdtempSync(path.join(os.tmpdir(), 'onup-cli-'));
  fs.mkdirSync(path.join(proj, '.opennovel'), { recursive: true });
  fs.writeFileSync(path.join(proj, '.opennovel', 'state.json'), '{}', 'utf8');
  const skillsDir = path.join(proj, '.agents', 'skills');
  fs.mkdirSync(skillsDir, { recursive: true });
  return { proj, skillsDir };
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

function runCli(proj, extraArgs = []) {
  return execFileSync(
    process.execPath,
    [BIN, 'skills', 'upgrade', '--target', 'codex', '--scope', 'project', ...extraArgs],
    { cwd: proj, encoding: 'utf8' }
  );
}

test('dry run reports the plan and changes nothing on disk', () => {
  const { proj, skillsDir } = makeProject();

  // Outdated vs repo (repo skills are all 1.0.0 on this branch)
  writeSkill(skillsDir, 'opennovel-writing-assistant', '0.9.0', 'old content');
  // Current: exact copy of the repo skill
  fs.cpSync(path.join(REPO_SKILLS, 'opennovel-bible-builder'), path.join(skillsDir, 'opennovel-bible-builder'), { recursive: true });
  // Modified: exact copy + local edit
  const modifiedDir = path.join(skillsDir, 'opennovel-review');
  fs.cpSync(path.join(REPO_SKILLS, 'opennovel-review'), modifiedDir, { recursive: true });
  fs.appendFileSync(path.join(modifiedDir, 'SKILL.md'), '\nmy local edit\n', 'utf8');
  // Newer than repo
  writeSkill(skillsDir, 'opennovel-outline-builder', '9.9.9', 'future');
  // Orphan: not present in the repo skills dir
  writeSkill(skillsDir, 'opennovel-legacy-tool', '1.0.0', 'orphan');
  // Not ours — must never appear
  writeSkill(skillsDir, 'other-skill', '0.1.0', 'untouched');

  const out = runCli(proj);
  assert.match(out, /0\.9\.0/);
  assert.match(out, /1\.0\.0/);
  assert.match(out, /opennovel-legacy-tool/);
  assert.match(out, /opennovel-review/);
  assert.match(out, /[Dd]ry run/);
  assert.equal(out.includes('other-skill'), false);

  // Nothing changed
  assert.match(fs.readFileSync(path.join(skillsDir, 'opennovel-writing-assistant', 'SKILL.md'), 'utf8'), /0\.9\.0/);
  assert.equal(fs.existsSync(path.join(skillsDir, 'opennovel-legacy-tool')), true);
});

test('--yes updates outdated, removes orphans, preserves modified/newer/foreign skills', () => {
  const { proj, skillsDir } = makeProject();

  const waDir = writeSkill(skillsDir, 'opennovel-writing-assistant', '0.9.0', 'old content');
  const modifiedDir = path.join(skillsDir, 'opennovel-review');
  fs.cpSync(path.join(REPO_SKILLS, 'opennovel-review'), modifiedDir, { recursive: true });
  fs.appendFileSync(path.join(modifiedDir, 'SKILL.md'), '\nmy local edit\n', 'utf8');
  writeSkill(skillsDir, 'opennovel-outline-builder', '9.9.9', 'future');
  writeSkill(skillsDir, 'opennovel-legacy-tool', '1.0.0', 'orphan');
  writeSkill(skillsDir, 'other-skill', '0.1.0', 'untouched');

  const out = runCli(proj, ['--yes']);
  assert.match(out, /updated|Updated/i);

  // Updated content matches the repo copy exactly
  const repoWa = fs.readFileSync(path.join(REPO_SKILLS, 'opennovel-writing-assistant', 'SKILL.md'), 'utf8');
  assert.equal(fs.readFileSync(path.join(waDir, 'SKILL.md'), 'utf8'), repoWa);
  // Orphan removed
  assert.equal(fs.existsSync(path.join(skillsDir, 'opennovel-legacy-tool')), false);
  // Local edit preserved
  assert.match(fs.readFileSync(path.join(modifiedDir, 'SKILL.md'), 'utf8'), /my local edit/);
  // Newer and foreign skills untouched
  assert.match(fs.readFileSync(path.join(skillsDir, 'opennovel-outline-builder', 'SKILL.md'), 'utf8'), /9\.9\.9/);
  assert.equal(fs.existsSync(path.join(skillsDir, 'other-skill', 'SKILL.md')), true);
});

test('project with no installed skills prints a friendly no-op', () => {
  const { proj } = makeProject();
  fs.rmSync(path.join(proj, '.agents'), { recursive: true, force: true });
  const out = runCli(proj);
  assert.match(out, /nothing to upgrade/i);
});

test('outdated skill with local edits: dry-run warns about wholesale replacement, --yes replaces including local files', () => {
  const { proj, skillsDir } = makeProject();
  const waDir = writeSkill(skillsDir, 'opennovel-writing-assistant', '0.9.0', 'old content');
  fs.writeFileSync(path.join(waDir, 'my-local-notes.txt'), 'user notes', 'utf8');

  const dry = runCli(proj);
  assert.match(dry, /replaces its entire directory, including any local edits/i);
  assert.match(dry, /Only same-version differences detected as MODIFIED are skipped/i);
  // Dry run leaves the local file in place
  assert.equal(fs.existsSync(path.join(waDir, 'my-local-notes.txt')), true);

  runCli(proj, ['--yes']);
  // Replacement is wholesale: local extra file is gone, content matches repo
  assert.equal(fs.existsSync(path.join(waDir, 'my-local-notes.txt')), false);
  const repoWa = fs.readFileSync(path.join(REPO_SKILLS, 'opennovel-writing-assistant', 'SKILL.md'), 'utf8');
  assert.equal(fs.readFileSync(path.join(waDir, 'SKILL.md'), 'utf8'), repoWa);
});
