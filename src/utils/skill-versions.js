const fs = require('fs');
const path = require('path');

/**
 * Skill version reading and upgrade planning for `opennovel skills upgrade`.
 *
 * Plan shape: { updates, current, modified, newer, orphans, unknown }
 * - updates:  installed older than repo → { name, from, to }
 * - current:  same version and identical content → { name, version }
 * - modified: same/unreadable version but content differs → { name, from, to }
 * - newer:    installed newer than repo → { name, from, to } (never downgraded)
 * - orphans:  installed opennovel-* skill absent from repo → { name }
 * - unknown:  opennovel-* directory without SKILL.md → { name }
 */

function parseSkillVersion(skillMdText) {
  const match = skillMdText.match(/^\s+version:\s*["']?([0-9]+\.[0-9]+\.[0-9]+)["']?\s*$/m);
  return match ? match[1] : null;
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff < 0 ? -1 : 1;
  }
  return 0;
}

function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFiles(full, base));
    } else {
      out.push(path.relative(base, full));
    }
  }
  return out.sort();
}

function dirsEqual(a, b) {
  const fa = listFiles(a);
  const fb = listFiles(b);
  if (fa.length !== fb.length) return false;
  for (let i = 0; i < fa.length; i++) {
    if (fa[i] !== fb[i]) return false;
    if (!fs.readFileSync(path.join(a, fa[i])).equals(fs.readFileSync(path.join(b, fb[i])))) return false;
  }
  return true;
}

function repoSkillNames(repoDir) {
  if (!fs.existsSync(repoDir)) return new Set();
  return new Set(
    fs.readdirSync(repoDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && fs.existsSync(path.join(repoDir, e.name, 'SKILL.md')))
      .map(e => e.name)
  );
}

function planUpgrade(installedDir, repoDir) {
  const plan = { updates: [], current: [], modified: [], newer: [], orphans: [], unknown: [] };
  if (!fs.existsSync(installedDir)) return plan;

  const repoSkills = repoSkillNames(repoDir);
  for (const entry of fs.readdirSync(installedDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('opennovel-')) continue;
    const name = entry.name;
    const installedPath = path.join(installedDir, name);
    const repoPath = path.join(repoDir, name);

    if (!fs.existsSync(path.join(installedPath, 'SKILL.md'))) {
      plan.unknown.push({ name });
      continue;
    }
    if (!repoSkills.has(name)) {
      plan.orphans.push({ name });
      continue;
    }

    const from = parseSkillVersion(fs.readFileSync(path.join(installedPath, 'SKILL.md'), 'utf8'));
    const to = parseSkillVersion(fs.readFileSync(path.join(repoPath, 'SKILL.md'), 'utf8'));
    const cmp = (from && to) ? compareVersions(from, to) : null;

    if (cmp !== null && cmp < 0) {
      plan.updates.push({ name, from, to });
    } else if (cmp !== null && cmp > 0) {
      plan.newer.push({ name, from, to });
    } else if (dirsEqual(installedPath, repoPath)) {
      plan.current.push({ name, version: from });
    } else {
      plan.modified.push({ name, from, to });
    }
  }
  return plan;
}

module.exports = { parseSkillVersion, compareVersions, dirsEqual, planUpgrade };
