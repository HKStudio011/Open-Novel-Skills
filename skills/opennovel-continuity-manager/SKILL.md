---
name: opennovel-continuity-manager
description: Track and update story continuity for an OpenNovel project. Use when the user finishes a chapter, asks to update continuity, check for inconsistencies, or summarize current story state.
license: MIT
compatibility: Requires an OpenNovel project with continuity.md
metadata:
  version: "1.0.0"
  category: writing
---

# OpenNovel Continuity Manager

## Purpose
Track story state, character status, revealed/hidden information, and chapter-to-chapter hooks.

## Required Context
Before working, read:
- `continuity.md` — current continuity state
- The latest chapter from `content/chapter_NNN.md`

## Process
1. Read the latest chapter from `content/`.
2. Read current `continuity.md`.
3. Update each section:
   - **Chapter Log** — new info characters learned, secrets revealed, relationship changes, new items/events, end state, hook for next
   - **Character Status** — update each character's status, current goal, knowledge, hidden info, emotion
   - **Revealed Information** — append new reveals
   - **Hidden Information** — remove newly revealed secrets, keep others
   - **Next Chapter Setup** — consequences to carry forward, hooks for next chapter
4. Write updated content into `continuity.md`.

## Rules
- Do NOT add information that wasn't revealed in the chapter.
- Do NOT remove hidden information that hasn't been revealed yet.
- If a contradiction is found between a new chapter and previous continuity, flag it for the user.
- Keep the log concise — bullet points, not prose.
