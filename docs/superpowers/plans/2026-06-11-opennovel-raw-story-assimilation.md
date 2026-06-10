# Raw Story Assimilation Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Raw Story Assimilation Mode to `opennovel-writing-assistant` so it can accept pasted chapter/story text, analyze it, optionally update bible.md + outline.md (with user approval), then rewrite/revise/continue.

**Architecture:** Three skill files updated in order: (1) `bible-builder` gets an Analyze Mode for extracting characters/world/secrets from raw text, (2) `outline-builder` gets an Analyze Mode for extracting plot/timeline from raw text, (3) `writing-assistant` gets a new Raw Story Assimilation section covering both light path (quick rewrite) and full path (extract → propose → confirm → apply → rewrite → continuity).

**Tech Stack:** Markdown skill files (Agent Skills standard). No code changes.

---

## File Inventory

### Files to modify
| File | Change |
|------|--------|
| `skills/opennovel-bible-builder/SKILL.md` | Add Analyze Mode section: extract characters, world, secrets, rules from raw text → Proposed Bible Update |
| `skills/opennovel-outline-builder/SKILL.md` | Add Analyze Mode section: extract plot, timeline, chapter list from raw text → Proposed Outline Update |
| `skills/opennovel-writing-assistant/SKILL.md` | Add Raw Story Assimilation Mode section: Session Start option, light/full paths, delegation to bible/outline builders |

### Files unchanged
- All other skill files, CLI code, templates
- `skills/opennovel-continuity-manager/SKILL.md` — already supports draft vs official
- `skills/opennovel-review/SKILL.md` — no change needed

---

### Task 1: Add Analyze Mode to bible-builder

**Files:**
- Modify: `skills/opennovel-bible-builder/SKILL.md`

- [ ] **Step 1: Read current file**

```bash
cat skills/opennovel-bible-builder/SKILL.md
```

Expected: 38 lines, Process section has 5 steps, Rules section has 4 rules.

- [ ] **Step 2: Add Analyze Mode section**

Insert after line 14 (`Build the story bible: characters, world, rules, secrets, and logic.`) and before `## Required Context`:

```markdown
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
```

- [ ] **Step 3: Update Required Context**

Change line 16-19 from:
```markdown
## Required Context
Before working, read:
- `project.md` — for genre, tone, and premise
- `bible.md` — current state of the bible
```

To:
```markdown
## Required Context
Before working, read:
- `project.md` — for genre, tone, and premise (if exists)
- `bible.md` — current state of the bible (if exists)
- Raw story text — provided by the user or calling skill (Analyze Mode only)
```

- [ ] **Step 4: Add rule for Analyze Mode**

Append to the Rules section (after line 38):

```markdown
- In Analyze Mode, never write to bible.md without user approval.
- When analyzing raw text, distinguish between explicit facts (stated directly) and inferred facts (implied but not confirmed). Label inferred facts clearly.
```

- [ ] **Step 5: Verify the file**

```bash
cat skills/opennovel-bible-builder/SKILL.md
```

Expected: new Analyze Mode section, updated Required Context, 2 new rules.

- [ ] **Step 6: Commit**

```bash
git add skills/opennovel-bible-builder/SKILL.md
git commit -m "feat: add Analyze Mode to bible-builder for raw story extraction"
```

---

### Task 2: Add Analyze Mode to outline-builder

**Files:**
- Modify: `skills/opennovel-outline-builder/SKILL.md`

- [ ] **Step 1: Read current file**

```bash
cat skills/opennovel-outline-builder/SKILL.md
```

Expected: 47 lines, Process has 4 steps, Chapter Brief Structure, Rules section.

- [ ] **Step 2: Add Analyze Mode section**

Insert after line 14 (`Plan the plot architecture and chapter outline.`) and before `## Required Context`:

```markdown
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
```

- [ ] **Step 3: Update Required Context**

Change lines 16-20 from:
```markdown
## Required Context
Before working, read:
- `project.md` — genre, tone, premise, ending type
- `bible.md` — characters, secrets timeline, world rules
- `outline.md` — current state of the outline
```

To:
```markdown
## Required Context
Before working, read:
- `project.md` — genre, tone, premise, ending type (if exists)
- `bible.md` — characters, secrets timeline, world rules (if exists)
- `outline.md` — current state of the outline (if exists)
- Raw story text — provided by the user or calling skill (Analyze Mode only)
```

- [ ] **Step 4: Add rule for Analyze Mode**

Append to the Rules section (after line 47):

```markdown
- In Analyze Mode, never write to outline.md without user approval.
- When no chapter breaks exist in raw text, treat the entire input as a single chapter.
- When multiple chapters exist, preserve the original chapter division in the proposal.
```

- [ ] **Step 5: Verify the file**

```bash
cat skills/opennovel-outline-builder/SKILL.md
```

Expected: new Analyze Mode section, updated Required Context, 3 new rules.

- [ ] **Step 6: Commit**

```bash
git add skills/opennovel-outline-builder/SKILL.md
git commit -m "feat: add Analyze Mode to outline-builder for raw story extraction"
```

---

### Task 3: Add Raw Story Assimilation Mode to writing-assistant

**Files:**
- Modify: `skills/opennovel-writing-assistant/SKILL.md`

- [ ] **Step 1: Read current file**

```bash
cat skills/opennovel-writing-assistant/SKILL.md
```

Expected: 108 lines, 6 Process sections, Rules.

- [ ] **Step 2: Fix the legacy reference on line 108**

Line 108 currently says:
```
- After each approved chapter, update the module status via `opennovel status` equivalent
```

Replace with:
```
- After each approved chapter, the state is maintained through continuity.md — no separate status command needed
```

- [ ] **Step 3: Update Session Start (Step 1)**

Add a new option to the Session Start list, insert after "Check project status":

```markdown
- **Work with raw story** — paste a chapter or story text from outside OpenNovel. The assistant will analyze it, optionally extract bible/outline info, then rewrite or continue it.
```

- [ ] **Step 4: Update Context Check (Step 2)**

Replace the current Context Check table and its "If any are missing" note (lines 42-51) with:

```markdown
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
```

- [ ] **Step 5: Add Raw Story Assimilation Mode section**

Insert after the Repeat section (after line 97) and before the Rules section:

```markdown
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
```

- [ ] **Step 6: Update Required Context note**

Change line 26 from:
```
If any are missing, do NOT start writing. Ask the user if they want to create the missing file and suggest the appropriate skill.
```

To:
```
If any are missing and the user is NOT in Raw Story mode, ask if they want to create the missing file and suggest the appropriate skill. In Raw Story mode, missing files are acceptable — the raw text serves as the source.
```

- [ ] **Step 7: Add new rules to Rules section**

Append to the Rules section (after line 107):

```markdown
- When in Raw Story mode, missing project files are not errors — treat the raw text as source material
- Always produce Proposed Bible/Outline Updates before writing to bible.md/outline.md — never write without user approval
- In Light Path, do NOT create or modify bible.md/outline.md unless user explicitly asks
- Distinguish between explicit facts (stated directly in raw text) and inferred facts (implied) when proposing updates — label them clearly
- After importing via Full Path, the imported chapters become canonical — update continuity.md through continuity-manager
```

- [ ] **Step 8: Verify the file**

```bash
cat skills/opennovel-writing-assistant/SKILL.md
```

Expected: new Session Start option, updated Context Check, new Raw Story Assimilation Mode section, new rules, fixed legacy reference.

- [ ] **Step 9: Commit**

```bash
git add skills/opennovel-writing-assistant/SKILL.md
git commit -m "feat: add Raw Story Assimilation Mode to writing-assistant"
```

---

### Task 4: Verify cross-references are consistent

**Files:**
- Verify: all 3 modified SKILL.md files

- [ ] **Step 1: Check that writing-assistant references match bible-builder and outline-builder**

```bash
rg -n 'bible-builder|outline-builder' skills/opennovel-writing-assistant/SKILL.md
```

Expected: writing-assistant references `opennovel-bible-builder` (Analyze Mode) and `opennovel-outline-builder` (Analyze Mode) consistently.

- [ ] **Step 2: Check that bible-builder and outline-builder reference writing-assistant consistently**

```bash
rg -n 'writing-assistant' skills/opennovel-bible-builder/SKILL.md skills/opennovel-outline-builder/SKILL.md
```

Expected: both reference `opennovel-writing-assistant` in their "Relationship to writing-assistant" sections.

- [ ] **Step 3: Verify git log**

```bash
git log --oneline -4
```

Expected: 3 feature commits + 1 optional fixup commit.

- [ ] **Step 4: Final sanity check**

```bash
rg -n 'opennovel status' skills/opennovel-writing-assistant/SKILL.md
```

Expected: no matches (the legacy reference was fixed in Step 2).

---

## Self-Review

### Spec Coverage
- writing-assistant Raw Story Assimilation Mode (light + full): **Task 3**
- bible-builder Analyze Mode: **Task 1**
- outline-builder Analyze Mode: **Task 2**
- Proposed update before writing (user approval gate): **Tasks 1, 2, 3**
- Light path (quick rewrite, no bible/outline): **Task 3 - Light Path**
- Full path (extract → propose → confirm → apply): **Task 3 - Full Path**
- Continuity update only after chapter finalized: **Task 3 - Full Path step 9**
- Delegation to bible-builder + outline-builder: **Task 3 - Full Path steps 3-4**
- Graceful handling of missing project: **Task 3 - Step 4 (Context Check) + Step 6**
- Legacy reference fix: **Task 3 - Step 2**

### Placeholder Scan
All steps contain complete content. No TBD, TODO, or placeholder patterns.

### Type/Signature Consistency
- `Proposed Bible Update` used consistently in Tasks 1 and 3
- `Proposed Outline Update` used consistently in Tasks 2 and 3
- `Analyze Mode` used consistently in Tasks 1, 2, 3
- `Light Path` / `Full Path` terminology consistent within Task 3
- `opennovel-bible-builder` and `opennovel-outline-builder` referenced correctly
