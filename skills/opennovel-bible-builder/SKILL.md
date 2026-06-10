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

## Analyze Mode

Use when the user provides raw story text (pasted chapter, draft, or existing story) and wants to extract bible-worthy information from it. This mode does NOT modify `bible.md` directly — it produces a **Proposed Bible Update** for the user to review and approve.

### Process

1. Read the raw story text provided by the user.
2. Extract the following information:
   - **Characters** — name, role, visible traits, goal, fear, secret, known facts, hidden facts, current status
   - **Relationships** — dynamic between characters, conflicts, trust level, important history
   - **World & Setting** — main setting, important locations, atmosphere, known history
   - **Rules & Logic** — any rules established by the text (magic, technology, society)
   - **Secrets & Reveals** — what is hidden, who knows, who does not know, whether already revealed
   - **Do Not Break** — specific constraints the text establishes (e.g., "character A fears water", "the city is cursed by a black sun")
3. Compare extracted information against existing `bible.md` (if one exists):
   - New characters not in bible → add to proposal
   - Existing characters with new info → flag as update
   - Conflicts between raw text and existing bible → flag as conflict
4. Format the result as a **Proposed Bible Update**:

```markdown
## Proposed Bible Update

### New Characters
- [Name]: [role, traits, goal, fear, secret]

### Updates to Existing Characters
- [Name]: [what changed]

### New World Details
- [setting/location/history additions]

### New Rules
- [rule]

### Secrets Detected
- [secret]: known by [X], hidden from [Y], revealed: yes/no

### Do Not Break
- [constraint]

### Conflicts with Existing Bible
- [what contradicts and suggested resolution]
```

5. Present the proposal to the user with a clear question: "Apply this to bible.md?"
6. If user approves, write the proposed content into `bible.md`.

### Relationship to writing-assistant

This mode is called by `opennovel-writing-assistant` when it detects raw story input. The assistant provides the raw text; this skill performs the analysis and produces the proposal. The assistant then handles user confirmation and the subsequent rewrite.

## Required Context
Before working, read:
- `project.md` — for genre, tone, and premise (if exists)
- `bible.md` — current state of the bible (if exists)
- Raw story text — provided by the user or calling skill (Analyze Mode only)

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
- In Analyze Mode, never write to bible.md without user approval.
- When analyzing raw text, distinguish between explicit facts (stated directly) and inferred facts (implied but not confirmed). Label inferred facts clearly.
