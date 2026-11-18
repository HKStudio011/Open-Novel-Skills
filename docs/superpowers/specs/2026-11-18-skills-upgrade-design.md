# Design: `opennovel skills upgrade` command

Date: 2026-11-18
Status: approved (user delegated approach + execution choices to implementer)

## Intent & Why

Users with existing OpenNovel projects never receive updated skills:
`skills install` skips any skill directory that already exists, without
checking versions. The PR #2 reviewer flagged this as the one Important
finding. This change adds a real upgrade command instead of the manual
delete-and-reinstall procedure documented in PR #2's Upgrading note.

## Goals

`opennovel skills upgrade --target codex|claude --scope project|user [--yes]`

- Default **dry-run**: print the planned actions, change nothing.
- `--yes` applies: update outdated skills, remove orphaned ones.
- **Local-modification detection**: same version but different content →
  list as modified, skip, warn. Never silently overwrite user edits.
- **Newer-than-repo protection**: installed version higher than repo → skip.
- **Orphan removal**: installed `opennovel-*` skill absent from the repo
  (e.g. `opennovel-exporter`) → listed and removed on `--yes`.
- Only manages `opennovel-*` directories; other skills in the target are
  never touched. Directories without `SKILL.md` are listed as unknown, skipped.
- Skills present in repo but not installed are NOT installed (install's job).

## Non-goals

- No README/AGENTS.md edits in this branch (avoids conflict with PR #2's
  Upgrading section; a follow-up doc update lands after #2 merges).
- No interactive prompts; no changes to `install` semantics.
- No AGENTS.md rewriting in user projects.

## Anti-goals

- Silently overwriting locally modified skills.
- Downgrading a newer installed skill.
- Touching non-`opennovel-*` directories.

## Interfaces (new module `src/utils/skill-versions.js`)

- `parseSkillVersion(skillMdText) → string|null` — reads `version:` from frontmatter.
- `compareVersions(a, b) → -1|0|1` — numeric per-segment semver compare.
- `dirsEqual(a, b) → boolean` — recursive file-list + byte comparison.
- `planUpgrade(installedDir, repoDir) → { updates, current, modified, newer, orphans, unknown }`
  — pure plan; `updates` entries carry `{ name, from, to }`.
- `applyUpgrade(plan, installedDir, repoDir) → applied[]` — replaces update
  targets (unlink symlinks/junctions first), removes orphans, touches nothing else.

CLI wiring in `src/commands/skills.js`: `upgrade` subcommand, shared
target/scope parsing helper with `install`, updated `--help` text.

## Verification

- TDD: `node:test` unit tests for the module (temp-dir fixtures), e2e test
  spawning the real CLI against a fixture project. `npm test` script added
  (repo previously had no tests).
- E2E fixture covers: outdated 0.9.0 → update; exact copy → current; edited
  copy → modified; 9.9.9 → newer; orphan exporter; unknown dir; other-skill
  untouched.
- Independent whole-branch review before PR.

## Decisions (delegated to implementer by user)

- New subcommand (not version-aware `install`); separate PR from master.
- Dry-run by default, `--yes` to apply.
- `npm test` script added to package.json.

## Amendments after independent review (2026-11-19)

The reviewer reproduced five Important issues; #1 and #2 were re-graded as
data-loss severity by effect. All fixed in one pass with RED→GREEN tests:

1. **Source integrity**: a repo counterpart that exists but is invalid
   (missing SKILL.md) never orphans an install — it is reported as unknown
   and skipped. Orphan removal is refused when the repo has zero valid
   skills (an empty/corrupt source must never trigger mass deletion).
2. **Failure-safe replacement**: copy to a temp sibling first; swap only
   after a successful copy; rollback on failure. Junctioned destinations
   are unlinked and can be recreated on rollback.
3. **Nested links**: `listEntries` compares links by target without
   following or byte-reading them; trees containing them compare as
   different instead of crashing (`EISDIR`).
4. **Frontmatter-scoped parsing**: version is read only inside the opening
   `---` block; root-level and nested forms accepted; CRLF supported;
   body-only `version:` lines are ignored.
5. **Honest safety text**: dry-run states that updating replaces the whole
   directory including local edits; only same-version MODIFIED entries are
   skipped. CLI surfaces apply failures as an error message + exit 1.
