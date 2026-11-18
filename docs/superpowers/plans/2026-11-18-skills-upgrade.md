# `opennovel skills upgrade` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a safe, version-aware `opennovel skills upgrade` command so existing projects receive updated skills.

**Architecture:** Pure planning module (`src/utils/skill-versions.js`) + thin CLI wiring (`src/commands/skills.js`). Dry-run by default; `--yes` applies.

**Tech Stack:** Node.js CommonJS, `node:test` (built-in), temp-dir fixtures.

**Spec:** `docs/superpowers/specs/2026-11-18-skills-upgrade-design.md`

## Global Constraints

- Branch `feature/skills-upgrade` from `master`. No README/AGENTS.md edits.
- CommonJS, match existing style in `src/commands/skills.js` (fs/path, console.log output).
- Only `opennovel-*` directories are managed in the install target.

## Review Focus

1. **Local edits on an outdated version** — cannot be distinguished from pristine-old without a stored baseline; dry-run output must state that updating replaces the whole skill directory. Pinned: CLI help/output text in Task 3.
2. **Symlinked installs (`--link`)** — replace must unlink, not recurse into the repo copy. Pinned: applyUpgrade unlink branch + e2e fixture in Task 3.
3. **Missing installed dir** — upgrade with no skills installed must not crash; prints "nothing to upgrade". Pinned: unit test in Task 2.
4. **Non-opennovel dirs** — `other-skill` in the target must be untouched by plan and apply. Pinned: unit + e2e fixtures.

---

### Task 1: Test infrastructure + docs commit

**Files:**
- Modify: `package.json` (add scripts)
- Create: spec + plan docs (already written)

- [ ] **Step 1:** Add `"scripts": { "test": "node --test test/" }` to package.json (currently no scripts key).
- [ ] **Step 2:** `npm test` runs (zero tests found is OK — exits 0 with no test files? If node --test errors on missing dir, create `test/.gitkeep`). Expected: command runs without "Missing script" error.
- [ ] **Step 3:** Commit: `docs+chore: spec/plan for skills upgrade, npm test script`.

### Task 2: `skill-versions.js` core (TDD)

**Files:**
- Test: `test/skill-versions.test.js`
- Create: `src/utils/skill-versions.js`

**Interfaces:** see spec's Interfaces block — exact function names and plan shape.

- [ ] **Step 1: Write failing tests** — fixtures via `fs.mkdtempSync(path.join(os.tmpdir(), 'onup-'))`, helper `writeSkill(dir, name, version, extra)` writing `<dir>/<name>/SKILL.md` with frontmatter version + `extra` content. Cases:
  - `parseSkillVersion`: `"1.1.0"` parsed; no version → null.
  - `compareVersions`: 1.0.0<1.1.0; equal; 1.2.0>1.1.0; 1.10.0>1.9.0.
  - `planUpgrade` buckets: outdated→updates({name,from,to}); identical copy→current; edited same-version→modified; installed 9.9.9→newer; installed-only exporter→orphans; dir without SKILL.md→unknown; repo-only skill→absent from all buckets; `other-skill`→absent from all buckets; nonexistent installedDir→all buckets empty.
- [ ] **Step 2: Run `npm test` — expect fail** (module not found).
- [ ] **Step 3: Implement** `parseSkillVersion`, `compareVersions`, `dirsEqual`, `planUpgrade` per spec.
- [ ] **Step 4: Run `npm test` — expect pass**, read output.
- [ ] **Step 5: Commit:** `feat: skill version comparison + upgrade planning`.

### Task 3: `applyUpgrade` + CLI wiring (TDD)

**Files:**
- Modify: `src/utils/skill-versions.js` (add applyUpgrade)
- Modify: `src/commands/skills.js` (upgrade subcommand, shared parse helper, help)
- Test: `test/skill-versions.test.js` (apply cases), `test/cli-upgrade.test.js` (e2e)

**Interfaces:** `applyUpgrade(plan, installedDir, repoDir) → applied[]` with `{action:'updated'|'removed', name, from?, to?}`.

- [ ] **Step 1: Failing tests** — apply: updates replaced (content equals repo), orphans removed, modified/newer/unknown/other-skill untouched; symlinked dest unlinked not recursed (create with `fs.symlinkSync(src, dest, 'junction')`); CLI e2e: fixture project (`.opennovel/state.json` empty file + `.agents/skills/...`) covering all buckets, run `node bin/opennovel.js skills upgrade --target codex --scope project` via `child_process.execFileSync` with `cwd` — assert dry-run output lists update 0.9.0→1.0.0 and changes nothing on disk; then `--yes` — assert updated content matches repo, orphan gone, modified file still has its appended line.
- [ ] **Step 2: Run — expect fail** (applyUpgrade missing; CLI "Unknown subcommand").
- [ ] **Step 3: Implement** applyUpgrade + `upgradeSkills(args)`; extract shared target/scope parsing used by both install and upgrade (keep install's messages/behavior identical); dry-run prints plan + "Dry run — re-run with --yes to apply. Updating replaces the whole skill directory."; update `skills --help`.
- [ ] **Step 4: Run `npm test` — all pass.** Also `node bin/opennovel.js skills --help` shows upgrade.
- [ ] **Step 5: Commit:** `feat: skills upgrade command with dry-run and safe apply`.

### Task 4: Independent review + PR

- [ ] **Step 1:** Full battery: `npm test` green; `node --check` on touched files; `node bin/opennovel.js` help works.
- [ ] **Step 2:** Dispatch fresh reviewer subagent with the code-reviewer template (base = master 9b6da5f, spec + plan + this Review Focus).
- [ ] **Step 3:** Critical/Important → one fix pass with RED→GREEN tests; Minor → ledger in final message.
- [ ] **Step 4:** Push branch, `gh pr create` to master, report URL + rulings + deferred minors.
