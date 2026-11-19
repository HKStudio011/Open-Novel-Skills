# Design: Prose Style Guidance + Remove Export

Date: 2026-11-17
Status: approved

## Approved extras (user decision, same session)

- Add a "Style" section to the `project.md` template: target chapter length,
  narrative voice, banned words/clichés — per-project overrides.
- Bump `metadata.version` (1.0.0 → 1.1.0) for every skill edited in this change.

## Intent & Why

OpenNovel's generated prose tends to read like AI output: the narrator explains
emotions, motives, and meaning instead of letting scenes show them. Add explicit
prose-style guidance so chapters read like fiction. Also remove the export
machinery — the CLI command no longer exists and is no longer wanted.

## Goals

1. Prose recipe in `opennovel-writing-assistant` (section 3, Write Content): how to
   render a scene — show don't tell, invisible narrator — with one before/after
   example demonstrating narrator-explaining slop.
2. Slop checklist in `opennovel-review` (step 6, Prose): concrete patterns to detect
   and report — narrator explaining, moralizing endings, summary-after-dialogue,
   uniform witty voice, cliché stock phrases, rhythm/adverb tics.
3. Remove `opennovel-exporter` and all `output/` references:
   - delete `skills/opennovel-exporter/` (SKILL.md + scripts/export.js)
   - root `SKILL.md`: description, inventory row, workflow diagram, command list
   - `src/templates/project.js`: AGENTS.md template Output section, exporter skill
     line, `{ dir: 'output' }` in file tree
   - `src/commands/init.js`: workflow step 7
   - repo `AGENTS.md`: CLI list, skills list, project layout
   - `README.md` / `README.vi.md`: export references + skill count
   - `opennovel-writing-assistant`: drop rule "Do not write to output/ — that is
     for exporter only"

## Non-goals

- No separate style-guide file or new sub-skill (approach B rejected)
- No changes to bible-builder, outline-builder, continuity-manager
- No Vietnamese examples (user chose English)

## Anti-goals

- Prohibition lists as the writer's guidance — the writer gets a positive recipe
- Same list duplicated in both skills: writer learns how to render, reviewer
  learns what to flag

## Constraints

- English, matching existing SKILL.md voice (terse bullets, tables)
- writing-assistant addition ~30-40 lines; review addition ~15-25 lines

## Approaches considered

- **A. Inline in both skills (chosen)** — each skill gets the form that fits its
  job; installed skills stay self-contained; no indirection.
- **B. Shared style-guide.md** — single source of truth, but cross-skill references
  break when skills install separately, and the content is too small to earn a file.

## Decisions (by user)

- Approach A; guidance in English; delete `output/` from scaffolding entirely.

## Verification

- Baseline first: subagent writes a scene from a brief with no style guidance;
  record slop verbatim (RED).
- After edits: same brief with the new guidance in context — slop reduced (GREEN);
  review skill flags planted slop patterns.

## Left to implementer

- Exact slop patterns, example wording, section placement, README skill counts.
- Optional extras pending user decision: Style section in project.md template;
  metadata version bumps for edited skills.
