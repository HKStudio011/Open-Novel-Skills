---
name: opennovel-chapter-writer
description: Write, continue, or rewrite story chapters for an OpenNovel project. Use when the user asks to write a chapter, continue chapter prose, rewrite a chapter, or generate narrative content from outline and continuity.
license: MIT
compatibility: Requires an OpenNovel project with bible.md, outline.md, continuity.md
metadata:
  version: "1.0.0"
  category: writing
---

# OpenNovel Chapter Writer

## Purpose
Write story chapters for an OpenNovel project using project context files.

## Required Context
Before writing, read:
- `project.md` — tone, POV, tense
- `bible.md` — characters, world rules, secrets
- `outline.md` — chapter brief, plot position
- `continuity.md` — current story state

If writing a chapter after the first, also read the previous chapter from `content/chapter_NNN.md`.

## Process
1. Identify the requested chapter number and find its brief in `outline.md`.
2. Read `continuity.md` for current story state.
3. Read `bible.md` for character details and world rules relevant to this chapter.
4. Write the chapter in Markdown.
5. Save to `content/chapter_NNN.md` (zero-padded, e.g., `chapter_001.md`).
6. Produce a continuity update draft (what changed, what was revealed, hooks).

## Chapter Structure
Each chapter should have:
- **Goal** — what does this chapter accomplish?
- **Conflict** — what obstacle drives the tension?
- **Mini-climax** — the peak moment of this chapter
- **Hook** — what makes the reader want the next chapter?

## Rules
- Do NOT contradict `bible.md` (character consistency, world rules, secret timing).
- Do NOT ignore `continuity.md` (story state must be accurate).
- Do NOT reveal hidden information before the planned reveal in bible.md.
- Do NOT change major plot points unless the user explicitly asks.
- Do NOT write directly into `output/` — output is for final exports only.
- Keep POV and tense consistent with `project.md`.
