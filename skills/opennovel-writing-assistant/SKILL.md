---
name: opennovel-writing-assistant
description: Core orchestration skill for the OpenNovel writing framework. Use when the user wants to write a story, continue writing, revise chapters, manage a creative writing session, or anything related to creating/editing story content.
license: MIT
compatibility: Works standalone. Best with: bible.md, outline.md, continuity.md
metadata:
  version: "1.0.0"
  category: writing
---

# OpenNovel Writing Assistant

## Purpose

Core orchestration skill for the OpenNovel Framework. Manages the end-to-end writing process: starts a creative session, checks for missing context files, delegates to helper skills when needed, writes/edits/deletes content, invokes review for quality checks, and triggers continuity updates only after chapters are finalized.

## Required Context

Read these files if they exist:

- `project.md` — tone, POV, tense, genre, premise
- `bible.md` — characters, world rules, secrets timeline
- `outline.md` — chapter brief, plot position
- `continuity.md` — current story state, revealed/hidden info

If any are missing, do NOT start writing. Ask the user if they want to create the missing file and suggest the appropriate skill.

## Process

### 1. Session Start

Ask the user what they want to do:

- **Write a new chapter** — check outline.md for the next brief, or ask user directly
- **Continue from where they left off** — read continuity.md for next chapter setup
- **Revise an existing chapter** — read the chapter from content/, call review, then edit
- **Delete or rewrite content** — confirm with user before any deletion
- **Check project status** — summarize what exists and what's missing

### 2. Context Check

Before writing, check for missing context:

| Missing file | Action |
|---|---|
| `project.md` | Suggest `opennovel-project-init` to set up project metadata |
| `bible.md` | Suggest `opennovel-bible-builder` to create characters/world/secrets |
| `outline.md` or empty chapter list | Suggest `opennovel-outline-builder` to create chapter briefs |
| `continuity.md` | Ask user for current story state, create initial continuity entry |

If the user declines to create the missing file, ask enough clarifying questions to write confidently without it.

### 3. Write Content

1. Read the chapter brief from `outline.md` (or ask user for goal, conflict, mini-climax, hook)
2. Read `continuity.md` for current story state, character status, hooks
3. Read relevant sections from `bible.md` (characters appearing, world rules active this chapter)
4. Write the chapter in Markdown
5. Save to `content/chapter_NNN.md` (zero-padded, e.g., `chapter_001.md`)

Each chapter must include:
- **Goal** — what does this chapter accomplish?
- **Conflict** — what obstacle drives the tension?
- **Mini-climax** — the peak moment of this chapter
- **Hook** — what makes the reader want the next chapter?

### 4. Review Cycle

After writing:

1. Call `opennovel-review` to diagnose issues in the chapter
2. Present findings to the user with severity levels (Critical / Major / Minor / Suggestion)
3. If issues found, ask: "Do you want me to fix these issues?"
4. If yes: fix issues (logic first, prose last per framework rules), then call review again
5. Loop: revise → review → revise until user is satisfied

### 5. Continuity Update

Only after the chapter is finalized (user confirms it's good):

1. Create a "Continuity Update Draft" summarizing:
   - New information characters learned
   - Secrets revealed
   - Relationship changes
   - Character status changes
   - Hooks for next chapter
2. Present the draft to the user for review
3. If approved, call `opennovel-continuity-manager` to write the official update to `continuity.md`
4. If user wants changes, adjust the draft and repeat

### 6. Repeat

Return to step 1 for the next chapter. Ask the user:

- "Ready for the next chapter?"
- "Want to review anything before continuing?"
- "Save and take a break?"

## Rules

- Never write without checking existing context first
- Never update continuity.md directly — always go through continuity-manager
- Never delete content without user confirmation
- Never contradict bible.md (character consistency, world rules, secret timing)
- Do not write to output/ — that is for exporter only
- If the user gives vague instructions, ask clarifying questions (2-3 specific options)
- Keep POV and tense consistent with project.md
- After each approved chapter, update the module status via `opennovel status` equivalent
