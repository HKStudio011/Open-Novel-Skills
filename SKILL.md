---
name: opennovel
description: Framework for AI-assisted novel/story writing with structured pipeline. Covers story core, characters, world-building, plot architecture, chapter writing, review, and continuity tracking. Use when user wants to write a novel, story, or script — or invokes /opennovel.
---

# OpenNovel Framework

## Quick Start

User says "I want to write a story" → load this skill → start the pipeline.

## 4-Step Pipeline

### Step 1: Core Setup
- Run `opennovel init <name>` (or create folder structure manually)
- Fill **Story Core** — premise, logline, theme, conflict, stakes, tone, ending
- Build **Characters** — profiles with: role, personality, fear, goal, secret, "must not write wrong"
- Build **World** — setting, locations, history, culture, atmosphere
- Build **Logic** — rules, secrets timeline, cause-effect, limits

### Step 2: Plot Architecture
- Outline main plot + subplots
- Map 10 turning points: Opening → Inciting Incident → 1st Turning Point → Rising Conflict → Midpoint → Crisis → 2nd Turning Point → Climax → Resolution → Final Image
- List all chapters with brief summaries

### Step 3: Write (per chapter)
1. Create **Chapter Brief** — goal, characters, events, reveals, hook
2. Create **Scene Breakdown** — per scene: location, characters, goal, conflict, result
3. **Write chapter** — AI generates based on all prior context
4. **Review** — check: logic → character → plot → pacing → emotion → prose
5. **Revise** — fix in order: logic first, prose last
6. **Update Continuity** — character status, revealed info, hooks for next chapter

### Step 4: Finalize
- Edit full story (structure → prose → dialogue)
- Export final output

## Golden Rules
1. Never reveal secrets before their scheduled chapter
2. Never make characters act against their core personality without sufficient cause
3. Never break world logic without establishing exception rules first
4. Always update continuity after each chapter (AI forgets)
5. Each chapter must have: goal, conflict, mini-climax, and hook

## Commands
- `opennovel init <name>` — scaffold project
- `opennovel status` — check progress
- `opennovel next` — suggest next step
