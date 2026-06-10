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

If any are missing and the user is NOT in Raw Story mode, ask if they want to create the missing file and suggest the appropriate skill. In Raw Story mode, missing files are acceptable — the raw text serves as the source.

## Process

### 1. Session Start

Ask the user what they want to do:

- **Write a new chapter** — check outline.md for the next brief, or ask user directly
- **Continue from where they left off** — read continuity.md for next chapter setup
- **Revise an existing chapter** — read the chapter from content/, call review, then edit
- **Delete or rewrite content** — confirm with user before any deletion
- **Check project status** — summarize what exists and what's missing
- **Work with raw story** — paste a chapter or story text from outside OpenNovel. The assistant will analyze it, optionally extract bible/outline info, then rewrite or continue it.

### 2. Context Check

If the user selected **Work with raw story**, skip this check — proceed to Raw Story Assimilation Mode (section 7).

Otherwise, before writing, check for missing context:

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

### 7. Raw Story Assimilation Mode

Use this mode when the user pastes existing story text, a chapter draft, or an external story and asks to rewrite, continue, import, or analyze it.

#### Behavior

1. **Detect raw story input** — the user pastes text or says "here is my chapter" / "rewrite this story".
2. **Do NOT require an existing project** — if no project.md/bible.md/outline.md exists, proceed without them.
3. **Ask the user's intent** — two possible paths:

##### Light Path: Quick Rewrite

Use when the user wants a fast rewrite of a single chapter without full project context.

1. Read the pasted chapter text.
2. Ask a few clarifying questions: tone, POV, what specifically they want changed.
3. Rewrite the chapter in Markdown.
4. Present the rewrite to the user.
5. If they want revisions, loop: revise → review (call `opennovel-review`) → revise.
6. If the user wants to save, ask: "Create an OpenNovel project for this?" → if yes, call `opennovel-project-init`, save to `content/chapter_001.md`.
7. Do NOT create or modify bible.md/outline.md unless the user explicitly asks.

##### Full Path: Extract, Propose, Rewrite

Use when the user wants to import a story or chapter into the OpenNovel framework with full context tracking.

1. Read the pasted story text.
2. Determine how many chapters the text contains (look for chapter headings or divisions).
3. Call `opennovel-bible-builder` in Analyze Mode with the raw text to produce a **Proposed Bible Update**.
4. Call `opennovel-outline-builder` in Analyze Mode with the raw text to produce a **Proposed Outline Update**.
5. Present both proposals to the user:

   ```
   I've analyzed your story and found:

   ### Proposed Bible Update
   [summary of characters, world, secrets, rules detected]

   ### Proposed Outline Update
   [summary of plot structure, chapters, timeline detected]

   Would you like to apply these to bible.md and outline.md?
   [Yes, apply both] [Bible only] [Outline only] [No, skip - just rewrite]
   ```

6. If user approves (fully or partially):
   - Create or update `bible.md` with the proposed content.
   - Create or update `outline.md` with the proposed content.
   - If no project exists yet, ask: "Create an OpenNovel project for this?" → run `opennovel-project-init` first.
7. If user declines updates, proceed with the rewrite using only the raw text as context.
8. Proceed to rewrite/revise the chapter(s):
   - Save rewritten content to `content/chapter_NNN.md`.
   - Run `opennovel-review` for quality check.
   - Loop: revise → review → revise until approved.
9. After chapter is finalized, call `opennovel-continuity-manager` to update `continuity.md`.

## Rules

- Never write without checking existing context first
- Never update continuity.md directly — always go through continuity-manager
- Never delete content without user confirmation
- Never contradict bible.md (character consistency, world rules, secret timing)
- Do not write to output/ — that is for exporter only
- If the user gives vague instructions, ask clarifying questions (2-3 specific options)
- Keep POV and tense consistent with project.md
- After each approved chapter, the state is maintained through continuity.md — no separate status command needed
- When in Raw Story mode, missing project files are not errors — treat the raw text as source material
- Always produce Proposed Bible/Outline Updates before writing to bible.md/outline.md — never write without user approval
- In Light Path, do NOT create or modify bible.md/outline.md unless user explicitly asks
- Distinguish between explicit facts (stated directly in raw text) and inferred facts (implied) when proposing updates — label them clearly
- After importing via Full Path, the imported chapters become canonical — update continuity.md through continuity-manager
