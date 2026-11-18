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
 * - unknown:  skipped entries → { name, reason? } (no SKILL.md, invalid repo
 *   counterpart). Never deleted.
 *
 * Safety invariants:
 * - A repo counterpart that exists but is invalid is never an orphan.
 * - Orphan removal is refused when the repo has no valid skills at all.
 * - Replacement copies to a temp sibling first; the old installation is only
 *   touched after a successful copy, with rollback on failure.
 */

function parseSkillVersion(skillMdText) {
  const fm = skillMdText.match(/^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?(?:\n|$)/);
  if (!fm) return null;
  const v = fm[1].match(/^[ \t]*version:[ \t]*["']?([0-9]+\.[0-9]+\.[0-9]+)["']?[ \t]*\r?$/m);
  return v ? v[1] : null;
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

function listEntries(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listEntries(full, base));
      continue;
    }
    const rel = path.relative(base, full);
    if (entry.isSymbolicLink()) {
      // Links are compared by target, never followed or byte-read: a link to
      // a directory must not crash comparison, and a broken link must not
      // crash either.
      let target = 'broken';
      try { target = fs.readlinkSync(full); } catch { /* keep 'broken' */ }
      out.push({ rel, link: target });
    } else {
      out.push({ rel, link: null });
    }
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

function dirsEqual(a, b) {
  const ea = listEntries(a);
  const eb = listEntries(b);
  if (ea.length !== eb.length) return false;
  for (let i = 0; i < ea.length; i++) {
    if (ea[i].rel !== eb[i].rel) return false;
    if (ea[i].link !== eb[i].link) return false;
    if (ea[i].link === null &&
        !fs.readFileSync(path.join(a, ea[i].rel)).equals(fs.readFileSync(path.join(b, eb[i].rel)))) {
      return false;
    }
  }
  return true;
}

/** Map of every repo skill directory → whether it has a valid SKILL.md. */
function repoSkillMap(repoDir) {
  const map = new Map();
  if (!fs.existsSync(repoDir)) return map;
  for (const e of fs.readdirSync(repoDir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    map.set(e.name, fs.existsSync(path.join(repoDir, e.name, 'SKILL.md')));
  }
  return map;
}

function planUpgrade(installedDir, repoDir) {
  const plan = { updates: [], current: [], modified: [], newer: [], orphans: [], unknown: [] };
  if (!fs.existsSync(installedDir)) return plan;

  const repoSkills = repoSkillMap(repoDir);
  for (const entry of fs.readdirSync(installedDir, { withFileTypes: true })) {
    if (!entry.name.startsWith('opennovel-')) continue;
    const installedPath = path.join(installedDir, entry.name);
    let isDir = entry.isDirectory();
    if (!isDir && entry.isSymbolicLink()) {
      try { isDir = fs.statSync(installedPath).isDirectory(); } catch { isDir = false; }
    }
    if (!isDir) continue;
    const name = entry.name;
    const repoPath = path.join(repoDir, name);

    if (!fs.existsSync(path.join(installedPath, 'SKILL.md'))) {
      plan.unknown.push({ name });
      continue;
    }
    if (!repoSkills.has(name)) {
      plan.orphans.push({ name });
      continue;
    }
    if (!repoSkills.get(name)) {
      plan.unknown.push({ name, reason: 'repo copy has no SKILL.md' });
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

function removeInstalledDir(dest) {
  const stat = fs.lstatSync(dest, { throwIfNoEntry: false });
  if (!stat) return;
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(dest);
  } else {
    fs.rmSync(dest, { recursive: true, force: true });
  }
}

/**
 * Replace dest with a copy of src without losing the old installation on
 * failure: copy to a temp sibling first, then swap, with rollback.
 * Symlinked/junctioned destinations are unlinked (their targets survive).
 */
function replaceDirSafe(src, dest) {
  const tmp = `${dest}.upgrade-tmp-${process.pid}`;
  const backup = `${dest}.upgrade-backup-${process.pid}`;
  removeInstalledDir(tmp);
  removeInstalledDir(backup);

  const stat = fs.lstatSync(dest, { throwIfNoEntry: false });
  const linkTarget = (stat && stat.isSymbolicLink()) ? fs.readlinkSync(dest) : null;

  try {
    fs.cpSync(src, tmp, { recursive: true });
    if (stat) {
      if (linkTarget !== null) fs.unlinkSync(dest);
      else fs.renameSync(dest, backup);
    }
    fs.renameSync(tmp, dest);
    if (fs.existsSync(backup)) removeInstalledDir(backup);
  } catch (err) {
    removeInstalledDir(tmp);
    if (!fs.existsSync(dest)) {
      if (fs.existsSync(backup)) {
        fs.renameSync(backup, dest);
      } else if (linkTarget !== null) {
        try { fs.symlinkSync(linkTarget, dest, 'junction'); } catch { /* best effort */ }
      }
    }
    throw err;
  }
}

function applyUpgrade(plan, installedDir, repoDir) {
  const validRepoSkills = [...repoSkillMap(repoDir).values()].filter(Boolean).length;
  if (plan.orphans.length > 0 && validRepoSkills === 0) {
    throw new Error('Refusing to remove orphans: repository contains no valid skills. Reinstall the OpenNovel CLI and retry.');
  }

  const applied = [];
  for (const u of plan.updates) {
    replaceDirSafe(path.join(repoDir, u.name), path.join(installedDir, u.name));
    applied.push({ action: 'updated', name: u.name, from: u.from, to: u.to });
  }
  for (const o of plan.orphans) {
    removeInstalledDir(path.join(installedDir, o.name));
    applied.push({ action: 'removed', name: o.name });
  }
  return applied;
}

module.exports = { parseSkillVersion, compareVersions, dirsEqual, planUpgrade, applyUpgrade };
