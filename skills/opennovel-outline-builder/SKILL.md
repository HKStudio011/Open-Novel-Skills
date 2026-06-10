---
name: opennovel-outline-builder
description: Plan plot, timeline, and chapter outline for an OpenNovel project. Use when the user wants to outline the plot, create chapter list, write chapter briefs, or fill outline.md.
license: MIT
compatibility: Requires an OpenNovel project with bible.md
metadata:
  version: "1.0.0"
  category: writing
---

# OpenNovel Outline Builder

## Purpose
Plan the plot architecture and chapter outline.

## Required Context
Before working, read:
- `project.md` — genre, tone, premise, ending type
- `bible.md` — characters, secrets timeline, world rules
- `outline.md` — current state of the outline

## Process
1. Read `project.md` and `bible.md` for alignment.
2. Read `outline.md` to see existing content.
3. Work through each section:
   - Main plot arc (opening → climax → resolution)
   - Subplots and how they connect
   - Timeline of events
   - 10 turning points
   - Chapter list with briefs
4. Write content into `outline.md`.

## Chapter Brief Structure
Each chapter brief must include:
- Chapter number and title
- Goal (what must this chapter accomplish?)
- Characters involved
- Key events
- Reveals
- Emotional arc
- End hook

## Rules
- Every chapter must have a goal, conflict, mini-climax, and hook for next chapter.
- Do not reveal secrets before their scheduled chapter per bible.md.
- Keep the outline consistent with bible.md (characters, world rules).
- Do not write chapter prose — use opennovel-writing-assistant for that.
