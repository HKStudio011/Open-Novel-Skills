---
name: opennovel-bible-builder
description: Build the story bible for an OpenNovel project. Use when the user wants to create characters, develop worldbuilding, set logic rules, define secrets, or fill bible.md.
license: MIT
compatibility: Requires an OpenNovel project with bible.md
metadata:
  version: "1.0.0"
  category: writing
---

# OpenNovel Bible Builder

## Purpose
Build the story bible: characters, world, rules, secrets, and logic.

## Required Context
Before working, read:
- `project.md` — for genre, tone, and premise
- `bible.md` — current state of the bible

## Process
1. Read `project.md` for genre and tone alignment.
2. Read `bible.md` to see existing content.
3. Work through each section of `bible.md` with the user:
   - Characters (protagonist first, then antagonist, then supporting)
   - World (setting, locations, history, culture, atmosphere)
   - Logic (rules, power system, limits)
   - Secrets & reveals timeline
   - Cause-effect chains
4. Write content into `bible.md` in Markdown format.
5. After each significant addition, update `continuity.md` if needed.

## Rules
- Do not contradict `project.md` (genre, tone, POV).
- Each character needs: goal, fear, secret, and a conflict with at least one other character.
- Secrets must have a planned reveal chapter.
- World rules must have limits — unlimited power breaks story logic.
- Never delete existing content unless the user explicitly asks.
