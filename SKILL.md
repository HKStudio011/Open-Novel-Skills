---
name: opennovel
description: Framework for AI-assisted novel/story writing. Covers project setup, story bible, plot outlining, chapter writing, continuity tracking, editing, and export. Use when user wants to write a novel, story, or script — or invokes /opennovel.
---

# OpenNovel Framework

## Quick Start

User says "I want to write a story" → load this skill → start the pipeline.

## 6-Step Pipeline

### Step 0: Discussion
Do NOT start filling templates yet. First discuss with user:
- Genre, tone, inspiration
- Premise & logline ideas
- Character concepts (protagonist, antagonist)
- World & setting overview
- Plot skeleton (beginning → middle → end)

After user confirms → proceed to project setup.

### Step 1: Project Setup
- Run `opennovel init <name>` to scaffold the project
- Fill `project.md` — genre, tone, POV, premise, logline, themes, conflict, stakes, ending type

### Step 2: Bible Builder
- Fill `bible.md` — characters, world, rules, secrets, cause-effect
- Use `opennovel-bible-builder` skill for guidance

### Step 3: Outline Builder
- Fill `outline.md` — plot, timeline, 10 turning points, chapter list, chapter briefs
- Use `opennovel-outline-builder` skill for guidance

### Step 4: Write (per chapter loop)
1. Read chapter brief from `outline.md`
2. Check continuity in `continuity.md`
3. Write chapter → `content/chapter_NNN.md`
4. Review (logic → character → plot → pacing → emotion → prose)
5. Edit if needed
6. Update `continuity.md`

### Step 5: Final Review & Edit
1. Read entire story from `content/`
2. Review holistically (plot holes, pacing across chapters, character arcs)
3. Fix issues (logic first, prose last)
4. Export → `opennovel export`

### Step 6: Export
- Run `opennovel export` or the exporter script for various formats
- Output goes to `output/`

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
- `opennovel export [--from N] [--to N]` — compile chapters into output
- `opennovel skills list` — list available OpenNovel skills
- `opennovel skills install --target codex|claude --scope project|user [--link]` — install skills for your coding agent
