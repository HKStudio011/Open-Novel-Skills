---
name: opennovel
description: Framework for AI-assisted novel/story writing. Load this skill as the entry point — delegates to opennovel-writing-assistant for interactive writing sessions. Covers project init, story bible, outlining, chapter writing, review, continuity tracking, and export.
---

# OpenNovel Framework

## Entry Point

**Load `opennovel-writing-assistant` to start a creative writing session.**

This skill (`opennovel`) is the root entry point. When the user says "I want to write a story" or similar:

1. Load this skill for orientation
2. Delegate to `opennovel-writing-assistant` for the interactive session
3. The writing assistant will check for project context and call helper skills as needed

## Skill Inventory

| Skill | Role | When to use |
|---|---|---|
| `opennovel-project-init` | Create/update project.md | New project, missing metadata |
| `opennovel-writing-assistant` | Core orchestration, write/revise content | Every writing session |
| `opennovel-bible-builder` | Build story bible (characters, world, rules, secrets) | Missing context, worldbuilding |
| `opennovel-outline-builder` | Plan plot, timeline, chapter briefs | Missing structure, planning |
| `opennovel-continuity-manager` | Track story state after chapters | After chapter is finalized |
| `opennovel-review` | Diagnosis-only quality check | Before finalizing a chapter |
| `opennovel-exporter` | Export .md files to TXT/HTML | Ready for final output |

## Workflow (managed by writing-assistant)

```
writing-assistant
  ├── check project.md → missing? → project-init
  ├── check bible.md → missing? → bible-builder
  ├── check outline.md → missing? → outline-builder
  ├── write/revise content/chapter_NNN.md
  │     ├── → review (diagnosis)
  │     ├── → revise (loop until OK)
  │     └── → continuity-manager (only after chapter finalized)
  └── repeat → exporter when complete
```

## Golden Rules

1. Never reveal secrets before their scheduled chapter
2. Never make characters act against their core personality without sufficient cause
3. Never break world logic without establishing exception rules first
4. Always update continuity after each chapter (AI forgets)
5. Each chapter must have: goal, conflict, mini-climax, and hook

## Commands

- `opennovel init <name>` — scaffold a new project
- `opennovel status` — check progress
- `opennovel next` — show next recommended step
- `opennovel export` — see opennovel-exporter skill for usage
- `opennovel skills list` — list available OpenNovel skills
- `opennovel skills install --target codex|claude --scope project|user [--link]` — install skills
