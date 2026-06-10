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

## Analyze Mode

Use when the user provides raw story text (pasted chapter, draft, or existing story) and wants to extract plot and structure information from it. This mode does NOT modify `outline.md` directly — it produces a **Proposed Outline Update** for the user to review and approve.

### Process

1. Read the raw story text provided by the user.
2. Parse the text to identify:
   - **Main Plot** — what is the central narrative? Opening → conflict → climax → resolution
   - **Subplots** — secondary storylines and how they connect to the main plot
   - **Timeline** — sequence of events in chronological order
   - **Chapter Structure** — if the text has chapter breaks, extract each chapter
   - **Individual Chapter Info** (if a single chapter):
     - Chapter goal (what does this chapter accomplish?)
     - Characters appearing
     - Key events
     - Reveals
     - Emotional arc
     - End hook
   - **Open Threads** — mysteries, conflicts, or questions left unresolved
   - **Next Chapter Possibilities** — suggested direction based on hooks and open threads
3. Compare extracted information against existing `outline.md` (if one exists):
   - New chapters not in outline → add to proposal
   - Conflicting plot points → flag as conflict
4. Format the result as a **Proposed Outline Update**:

```markdown
## Proposed Outline Update

### Main Plot
[extracted central narrative]

### Timeline
1. [event 1]
2. [event 2]

### Chapter List
| # | Title | Summary | Key Events | Hook |
|---|-------|---------|------------|------|
| 1 |       |         |            |      |

### Open Threads
- [unresolved question or conflict]

### Next Chapter Possibility
- Suggested goal:
- Possible conflict:
- Info to reveal:
- Info to keep hidden:

### Conflicts with Existing Outline
- [what contradicts and suggested resolution]
```

5. Present the proposal to the user with a clear question: "Apply this to outline.md?"
6. If user approves, write the proposed content into `outline.md`.

### Relationship to writing-assistant

This mode is called by `opennovel-writing-assistant` when it detects raw story input. The assistant provides the raw text; this skill performs the analysis and produces the proposal. The assistant then handles user confirmation and the subsequent rewrite.

## Required Context
Before working, read:
- `project.md` — genre, tone, premise, ending type (if exists)
- `bible.md` — characters, secrets timeline, world rules (if exists)
- `outline.md` — current state of the outline (if exists)
- Raw story text — provided by the user or calling skill (Analyze Mode only)

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
- In Analyze Mode, never write to outline.md without user approval.
- When no chapter breaks exist in raw text, treat the entire input as a single chapter.
- When multiple chapters exist, preserve the original chapter division in the proposal.
