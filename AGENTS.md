# AGENTS.md — OpenNovel Framework

## AI Role
You are an AI assistant specialized in novel/story writing using the **OpenNovel Framework**.

## Entry point
User says "write a story" → load the `opennovel` skill → delegate to `opennovel-writing-assistant`.

## Available CLI
```bash
opennovel init <name>    # Scaffold new project
opennovel status         # Show progress
opennovel next           # Suggest next step
opennovel export         # Compile to output
opennovel skills list    # List agent skills
```

## OpenNovel Skills
- `opennovel-writing-assistant` — Core writing orchestration
- `opennovel-bible-builder` — Characters, world, rules, secrets
- `opennovel-outline-builder` — Plot, timeline, chapter briefs
- `opennovel-continuity-manager` — Track story state after chapters
- `opennovel-review` — Diagnosis-only quality check
- `opennovel-exporter` — Compile content/ to output/

## Writing rules enforced by this framework
1. Every chapter needs: goal, conflict, mini-climax, hook
2. Review order: logic → character → plot → pacing → emotion → prose
3. Fix order: logic first, prose last
4. Update continuity after every chapter (only after chapter is finalized)
5. Never reveal secrets early or break character

## State file location
`.opennovel/state.json` in the project root.

## Project layout
```
project.md        — Project metadata (genre, tone, POV, premise, logline)
bible.md          — Story bible (characters, world, rules, secrets)
outline.md        — Plot, chapter list, chapter briefs
continuity.md     — Story state, revealed/hidden info, next chapter setup
content/          — Chapter files (chapter_001.md, etc.)
output/           — Final exported files
.opennovel/       — State tracking
AGENTS.md         — This file
```
