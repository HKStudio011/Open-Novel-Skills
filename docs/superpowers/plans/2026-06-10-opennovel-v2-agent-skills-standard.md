# OpenNovel v2 — Agent Skills Standard Refactor

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor OpenNovel from 40+ inline template files to a clean 4-file project tree + 7 Agent Skills-compatible skill packs following skills.sh standard.

**Architecture:** Decouple project data (files created by `opennovel init`) from agent instructions (skills/ folder with SKILL.md per skill). The CLI creates a minimal project with 4 core Markdown files, 2 empty directories, and state. A new `opennovel skills install` command copies skill folders to `.agents/` or `.claude/` per the Agent Skills standard.

**Tech Stack:** Node.js 18+ (no dependencies, no test framework), Markdown templates, JSON state.

---

## File Structure (after all tasks)

```
opennovel/
├── package.json
├── bin/opennovel.js
├── SKILL.md                            ← updated meta-skill
├── src/
│   ├── index.js                        ← +skills command
│   ├── commands/
│   │   ├── init.js                     ← simplified tree
│   │   ├── status.js                   ← 6 modules
│   │   ├── next.js                     ← 6 modules
│   │   ├── export.js                   ← content/ instead of approved/
│   │   ├── agents.js                   ← minimal changes
│   │   └── skills.js                   ← NEW: install/list
│   ├── templates/
│   │   └── project.js                  ← 4 templates only
│   └── utils/
│       └── state.js                    ← 6 modules
└── skills/
    ├── opennovel-project-setup/
    │   └── SKILL.md
    ├── opennovel-bible-builder/
    │   └── SKILL.md
    ├── opennovel-outline-builder/
    │   └── SKILL.md
    ├── opennovel-chapter-writer/
    │   └── SKILL.md
    ├── opennovel-continuity-manager/
    │   └── SKILL.md
    ├── opennovel-editor/
    │   └── SKILL.md
    └── opennovel-exporter/
        ├── SKILL.md
        └── scripts/
            └── export.js
```

## Project tree created by `opennovel init <name>`

```
<name>/
├── project.md
├── bible.md
├── outline.md
├── continuity.md
├── content/
├── output/
├── AGENTS.md
└── .opennovel/
    └── state.json
```

---

### Task 1: Rewrite templates (project.js)

**Files:**
- Rewrite: `src/templates/project.js` (entire file)

The old file exports `getFileTree()` returning 40+ entries (11 modules, 30+ template files). Replace with 4 template files + AGENTS.md. Keep the same module signature (`getFileTree(projectName)` returns an array of `{dir}` and `{file, content}` objects) so `init.js` doesn't need structural changes.

- [ ] **Step 1: Delete old templates, write new getFileTree with 5 entries**

Replace the entire file contents:

```js
const path = require('path');

function getFileTree(projectName) {
  return [
    { file: 'project.md', content: projectTemplate(projectName) },
    { file: 'bible.md', content: bibleTemplate(projectName) },
    { file: 'outline.md', content: outlineTemplate(projectName) },
    { file: 'continuity.md', content: continuityTemplate },
    { dir: 'content' },
    { dir: 'output' },
    { file: 'AGENTS.md', content: agentsMdTemplate },
  ];
}
```

- [ ] **Step 2: Write projectTemplate function**

```js
function projectTemplate(name) {
  return `# Project: ${name}

## Metadata
- **Genre:**
- **Target audience:**
- **Tone:**
- **Point of view:**
- **Tense:**
- **Estimated length:**

## Premise
[One-sentence summary of the core idea]

## Logline
A [protagonist] must [goal], but [obstacle], forcing them to [choice/change].

## Themes
-
-

## Central Conflict
- External:
- Internal:

## Stakes
What happens if the protagonist fails:
-

## Ending Type
[Closed / open / tragedy / bittersweet / twist / loop]
`;
}
```

- [ ] **Step 3: Write bibleTemplate function**

```js
function bibleTemplate(name) {
  return `# Story Bible — ${name}

## Characters

### Character Profile Template
Copy and fill for each character:

\`\`\`
Name:
Role:
Age:
Appearance:
Personality:
Voice/speech:
External goal:
Internal goal:
Fear:
Weakness:
Strength:
Backstory:
Secret:
Relationships:
What they know:
What they don't know:
What they hide:
Arc through story:
Final fate:
\`\`\`

### Must Not Write Wrong
-
-
-

## World

### Setting
[Where and when does the story take place?]

### Locations
-
-

### History
- Past events:

### Culture
- Rules/laws:
- Social classes:
- Beliefs:
- Customs:

### Atmosphere
- Colors:
- Light:
- Sound:
- Dominant feeling:

## Logic & Rules

### World Rules
1.
2.
3.

### Power System (if applicable)
1.
2.
3.

### Limits
- Characters cannot:
- The world does not allow:
- The antagonist cannot:

### Secrets & Reveals
- Secret 1:
  - Known by:
  - Hidden from:
  - Reveal chapter:
- Secret 2:
  - Known by:
  - Hidden from:
  - Reveal chapter:

### Cause & Effect
If [event A] then [consequence B].

### Logic Errors to Avoid
-
-
`;
}
```

- [ ] **Step 4: Write outlineTemplate function**

```js
function outlineTemplate(name) {
  return `# Outline — ${name}

## Plot

### Opening
-

### Inciting Incident
-

### Main Goal Established
-

### Turning Point 1
-

### Rising Conflict Chain
1.
2.
3.

### Midpoint
-

### Crisis
-

### Turning Point 2
-

### Climax
-

### Resolution
-

### Aftermath
-

## Subplots
[Describe subplots and how they connect to the main plot]

## Timeline

| Time | Event | Notes |
|------|-------|-------|
|      |       |       |

## 10 Turning Points
1. Opening Image
2. Inciting Incident
3. First Turning Point
4. Rising Conflict
5. Midpoint
6. Crisis
7. Second Turning Point
8. Climax
9. Resolution
10. Final Image

## Chapter List

| # | Title | Est. Length | Status |
|---|-------|-------------|--------|
| 1 |       |             |        |

## Chapter Hooks

| # | End Hook | Leads To |
|---|----------|----------|
|   |          |          |
`;
}
```

- [ ] **Step 5: Write continuityTemplate function**

```js
function continuityTemplate = `# Continuity

## Chapter Log
\`\`\`
Chapter [N]:
- New info characters learned:
- Secrets revealed:
- Relationship changes:
- New items/events:
- End state:
- Hook for next:
\`\`\`

## Character Status

| Character | Status | Current Goal | Knows | Hides | Emotion |
|-----------|--------|-------------|-------|-------|---------|
|           |        |             |       |       |         |

## Revealed Information
-

## Hidden Information (still to conceal)
-

## Next Chapter Setup
### Consequences to carry forward
-

### Hooks for next chapter
-
`;
}
```

Note: `continuityTemplate` is a `const` not a function — same pattern as the old code.

- [ ] **Step 6: Write agentsMdTemplate**

```js
const agentsMdTemplate = `<!-- OPENNOVEL_START -->
# OpenNovel — Writing Framework

## AI Role
You are an AI assistant using the OpenNovel Framework for novel/story writing.

## Core Files
- \`project.md\` — project metadata, genre, tone, POV, premise, logline
- \`bible.md\` — characters, world, rules, secrets, logic
- \`outline.md\` — plot, timeline, chapter list, chapter briefs
- \`continuity.md\` — story state, revealed/hidden info, next chapter setup

## Content
- \`content/\` — chapter files (\`chapter_001.md\`, etc.)

## Output
- \`output/\` — final exported files (.txt, .html, .docx, .pdf)

## OpenNovel Skills
When available, use installed skills:
- \`opennovel-project-setup\`
- \`opennovel-bible-builder\`
- \`opennovel-outline-builder\`
- \`opennovel-chapter-writer\`
- \`opennovel-continuity-manager\`
- \`opennovel-editor\`
- \`opennovel-exporter\`

## Writing Rules
1. Every chapter needs: goal, conflict, mini-climax, hook
2. Review order: logic → character → plot → pacing → emotion → prose
3. Fix order: logic first, prose last
4. Update continuity after every chapter
5. Never reveal secrets early or break character
<!-- OPENNOVEL_END -->
`;
```

- [ ] **Step 7: Update module.exports**

```js
module.exports = { getFileTree, agentsMdTemplate };
```

- [ ] **Step 8: Verify the file**

Run: `node -e "const {getFileTree} = require('./src/templates/project'); const tree = getFileTree('test'); console.log('Entries:', tree.length); tree.forEach(e => console.log(e.file || e.dir))"`

Expected output:
```
Entries: 7
project.md
bible.md
outline.md
continuity.md
content
output
AGENTS.md
```

- [ ] **Step 9: Commit**

```bash
git add src/templates/project.js
git commit -m "refactor: simplify project templates to 4 core files + AGENTS.md"
```

---

### Task 2: Update state module list

**Files:**
- Modify: `src/utils/state.js:6-17`

The old `MODULES` array has 11 entries matching the old project structure. Replace with 6 entries matching the new structure.

- [ ] **Step 1: Replace MODULES array**

Change lines 6-17 from:
```js
const MODULES = [
  { id: 'core',       name: 'Story Core',        label: 'core' },
  { id: 'characters', name: 'Characters',        label: 'characters' },
  { id: 'world',      name: 'World',             label: 'world' },
  { id: 'logic',      name: 'Logic System',      label: 'logic' },
  { id: 'plot',       name: 'Plot Architecture', label: 'plot' },
  { id: 'chapters',   name: 'Chapters',          label: 'chapters' },
  { id: 'writing',    name: 'Writing Pipeline',  label: 'writing' },
  { id: 'approved',   name: 'Approved Chapters', label: 'approved' },
  { id: 'continuity', name: 'Continuity Memory', label: 'continuity' },
  { id: 'editing',    name: 'Final Review & Edit', label: 'editing' },
  { id: 'output',     name: 'Final Output',        label: 'output' },
];
```

To:
```js
const MODULES = [
  { id: 'project',    name: 'Project Setup',     label: 'project' },
  { id: 'bible',      name: 'Story Bible',       label: 'bible' },
  { id: 'outline',    name: 'Plot & Outline',    label: 'outline' },
  { id: 'content',    name: 'Chapter Writing',   label: 'content' },
  { id: 'continuity', name: 'Continuity',        label: 'continuity' },
  { id: 'output',     name: 'Final Output',      label: 'output' },
];
```

- [ ] **Step 2: Verify**

Run: `node -e "const { MODULES } = require('./src/utils/state'); console.log(MODULES.map(m => m.id).join(', '))"`

Expected: `project, bible, outline, content, continuity, output`

- [ ] **Step 3: Commit**

```bash
git add src/utils/state.js
git commit -m "refactor: update state MODULES from 11 to 6 entries"
```

---

### Task 3: Update status command

**Files:**
- Modify: `src/commands/status.js`

The status command reads `MODULES` and checks directory existence for each `mod.label`. No structural change needed — it automatically adapts to the new MODULES array from Task 2. The only change: remove the directory-existence check since the new project has only `content/` and `output/` directories (the core files are files, not directories).

- [ ] **Step 1: Remove directory-existence column from output**

Current line 41-42:
```js
const dirExists = fs.existsSync(path.join(projectDir, mod.label));
const dirMark = dirExists ? '\uD83D\uDCC1' : '\u274C';
```

Change to not show directory status (since the new modules are `.md` files, not directories):

```js
    const icon = STATUS_ICONS[s] || '\u2B1C';
    const label = `${mod.label}`;

    console.log(`  ${icon} ${label.padEnd(20)} ${mod.name} [${s}]`);
```

And remove the `const dirExists = ...` and `const dirMark = ...` lines entirely. Remove `dirMark` from the template string.

- [ ] **Step 2: Remove unused `fs` import**

Line 1: `const fs = require('fs');` — remove this line since we no longer call `fs.existsSync`.

Also remove `const path = require('path');` on line 2 — it's no longer used either.

- [ ] **Step 3: Verify**

Run: `node -e "const status = require('./src/commands/status'); console.log('status function type:', typeof status)"`

Expected: `status function type: function` (no crash)

- [ ] **Step 4: Commit**

```bash
git add src/commands/status.js
git commit -m "refactor: remove dir checks from status, adapt to 6 modules"
```

---

### Task 4: Update next command

**Files:**
- Modify: `src/commands/next.js`

The `WORKFLOW_GUIDE` object maps old module IDs to messages. Replace with new 6-entry guide.

- [ ] **Step 1: Replace WORKFLOW_GUIDE object**

Replace the entire `WORKFLOW_GUIDE` (lines 3-59) with:

```js
const WORKFLOW_GUIDE = {
  'project': {
    message: 'Define your project metadata',
    detail: 'Open project.md and fill in: genre, tone, POV, premise, logline, themes, conflict, stakes, ending type.',
    hint: 'Start with a strong logline — it guides every decision afterward.',
  },
  'bible': {
    message: 'Build your story bible',
    detail: 'Open bible.md and fill in characters, world, rules, secrets, logic. Start with the protagonist, then antagonist, then supporting cast.',
    hint: 'Give each character a secret, a fear, and a goal that conflicts with others.',
  },
  'outline': {
    message: 'Plan the plot and outline chapters',
    detail: 'Open outline.md and map: main plot, subplots, timeline, 10 turning points, chapter list, chapter briefs.',
    hint: 'Each chapter needs: goal, characters, events, reveals, emotional arc, hook.',
  },
  'content': {
    message: 'Start writing chapters',
    detail: 'Use opennovel-chapter-writer skill to write chapters. Save outputs to content/chapter_001.md, etc.',
    hint: 'Always check bible.md and continuity.md before writing to stay consistent.',
  },
  'continuity': {
    message: 'Update continuity after each chapter',
    detail: 'After each approved chapter, update continuity.md with what changed: character status, revealed info, hooks for next chapter.',
    hint: 'This prevents AI from forgetting — critical for long stories.',
  },
  'output': {
    message: 'Export final output',
    detail: 'Compile content/ into output formats. Use opennovel-exporter skill or run opennovel export.',
    hint: 'Consider converting to TXT, HTML, DOCX, or PDF.',
  },
};
```

- [ ] **Step 2: Verify**

Run: `node -e "const next = require('./src/commands/next'); console.log('next function type:', typeof next)"`

Expected: `next function type: function`

- [ ] **Step 3: Commit**

```bash
git add src/commands/next.js
git commit -m "refactor: update WORKFLOW_GUIDE to match 6 new modules"
```

---

### Task 5: Update init command

**Files:**
- Modify: `src/commands/init.js`

The init command calls `getFileTree()` and iterates over entries. The new `getFileTree` returns 7 entries (4 files + 2 dirs + AGENTS.md) instead of 40+. The command logic stays the same — it already handles both `{dir}` and `{file, content}` entries generically.

The only changes needed:
1. The printed workflow reference (lines 78-91) references old modules. Update it.
2. The success message references old paths. Update it.

- [ ] **Step 1: Update the quick reference printout**

Replace lines 78-91:
```js
  console.log('');
  console.log('\u2500'.repeat(40));
  console.log('OpenNovel Workflow:');
  console.log('1. Start with Story Core  — core/story_core.md');
  ...
  console.log('11. Export final          — output/');
```

With:
```js
  console.log('');
  console.log('\u2500'.repeat(40));
  console.log('OpenNovel Workflow:');
  console.log('1. Set up project       — project.md');
  console.log('2. Build story bible    — bible.md');
  console.log('3. Plan plot & outline  — outline.md');
  console.log('4. Write chapters       — content/');
  console.log('5. Track continuity     — continuity.md');
  console.log('6. Export final         — output/');
  console.log('');
  console.log('Install agent skills:');
  console.log('  opennovel skills install --target codex --scope project');
  console.log('  opennovel skills install --target claude --scope project');
```

- [ ] **Step 2: Remove unused `path` import (line 2)**

Line 2: `const path = require('path');` — it's used for `path.join` and `path.resolve` and `path.dirname`, so actually keep it. It IS used.

- [ ] **Step 3: Verify with a temp directory**

```bash
mkdir -p /tmp/opennovel-test && cd /tmp/opennovel-test && node "D:\Code\Open Novel Skills\bin\opennovel.js" init test-story
```

Expected: Creates `test-story/` with `project.md`, `bible.md`, `outline.md`, `continuity.md`, `content/`, `output/`, `AGENTS.md`, `.opennovel/state.json`.

```bash
rm -rf /tmp/opennovel-test/test-story
```

- [ ] **Step 4: Commit**

```bash
git add src/commands/init.js
git commit -m "refactor: update init workflow reference to 6-step model"
```

---

### Task 6: Update export command

**Files:**
- Modify: `src/commands/export.js`

The old export reads from `approved/` directory. Change it to read from `content/` (all `.md` files). Remove the `FINAL_SCRIPT_FILE` output (the old "final script" concept is dropped — just export the full story).

- [ ] **Step 1: Change directory constants**

Lines 6-9:
```js
const CHAPTER_NUM_RE = /(\d+)/;
const APPROVED_DIR = 'approved';
const OUTPUT_DIR = 'output';
const FULL_STORY_FILE = 'full_story.md';
const FINAL_SCRIPT_FILE = 'final_script.md';
```

Change to:
```js
const CHAPTER_NUM_RE = /(\d+)/;
const CONTENT_DIR = 'content';
const OUTPUT_DIR = 'output';
const OUTPUT_FILE = 'full_story.md';
```

- [ ] **Step 2: Update directory reads**

Change line 51 `const approvedDir = path.join(projectDir, APPROVED_DIR);` to:
```js
const contentDir = path.join(projectDir, CONTENT_DIR);
```

Change line 53-56 from:
```js
if (!fs.existsSync(approvedDir)) {
  console.log('Error: approved/ directory not found.');
  process.exit(1);
}
```

To:
```js
if (!fs.existsSync(contentDir)) {
  console.log('Error: content/ directory not found.');
  process.exit(1);
}
```

Change line 58 `let files = fs.readdirSync(approvedDir)` to:
```js
let files = fs.readdirSync(contentDir)
```

Change line 64 `fullPath: path.join(approvedDir, f)` to:
```js
fullPath: path.join(contentDir, f),
```

- [ ] **Step 3: Update error messages**

Lines 66-69:
```js
  if (files.length === 0) {
    console.log('No approved chapters found in approved/.');
    console.log('Approve chapters first by saving them as .md files in approved/.');
    process.exit(1);
  }
```

Change to:
```js
  if (files.length === 0) {
    console.log('No chapters found in content/.');
    console.log('Write chapters first using the opennovel-chapter-writer skill.');
    process.exit(1);
  }
```

- [ ] **Step 4: Simplify output to single file (remove final_script.md concept)**

Remove the `FINAL_SCRIPT_FILE` constant, remove `scriptParts` array and its usage.
Change lines 98-112 to:

```js
  // Concatenate all chapters into one story
  let storyParts = [];

  for (const file of files) {
    const content = fs.readFileSync(file.fullPath, 'utf-8');
    const processed = processContent(file.name, content);
    storyParts.push(processed);
  }

  const outputPath = path.join(outputDir, OUTPUT_FILE);
  fs.writeFileSync(outputPath, storyParts.join('\n\n---\n\n'), 'utf-8');
```

- [ ] **Step 5: Update success message**

Lines 119-121:
```js
  console.log(`Exported ${files.length} chapter(s)${rangeStr}:`);
  console.log(`  ${FULL_STORY_FILE}  → ${fullStoryPath}`);
  console.log(`  ${FINAL_SCRIPT_FILE} → ${finalScriptPath}`);
```

Change to:
```js
  console.log(`Exported ${files.length} chapter(s)${rangeStr}:`);
  console.log(`  ${OUTPUT_FILE} → ${outputPath}`);
```

- [ ] **Step 6: Remove old `fullStoryPath`/`finalScriptPath` variables**

Replace lines 108-112 with just:
```js
  const outputPath = path.join(outputDir, OUTPUT_FILE);
  fs.writeFileSync(outputPath, storyParts.join('\n\n---\n\n'), 'utf-8');
```

- [ ] **Step 7: Verify**

Run: `node -e "const exp = require('./src/commands/export'); console.log('export function type:', typeof exp)"`

Expected: `export function type: function`

- [ ] **Step 8: Commit**

```bash
git add src/commands/export.js
git commit -m "refactor: export from content/ instead of approved/, single output file"
```

---

### Task 7: Update agents command (minimal)

**Files:**
- Modify: `src/commands/agents.js`

The `agents.js` command imports `agentsMdTemplate` from `project.js` and handles AGENTS.md. The template updated in Task 1 already covers this. No code changes needed — verify it still works.

- [ ] **Step 1: Verify the agents command still works**

```bash
node -e "const agents = require('./src/commands/agents'); console.log('agents function type:', typeof agents)"
```

Expected: `agents function type: function`

- [ ] **Step 2: Commit (if any changes needed)**

If no changes were needed:
```bash
git add src/commands/agents.js
git commit -m "chore: verify agents command compatibility with new templates"
```

---

### Task 8: Create 7 skill SKILL.md files

**Files:**
- Create: `skills/opennovel-project-setup/SKILL.md`
- Create: `skills/opennovel-bible-builder/SKILL.md`
- Create: `skills/opennovel-outline-builder/SKILL.md`
- Create: `skills/opennovel-chapter-writer/SKILL.md`
- Create: `skills/opennovel-continuity-manager/SKILL.md`
- Create: `skills/opennovel-editor/SKILL.md`
- Create: `skills/opennovel-exporter/SKILL.md`

Each SKILL.md has frontmatter (`name`, `description`) for agent discovery plus body instructions.

- [ ] **Step 1: Create skills/ directory**

```bash
mkdir -p skills/opennovel-project-setup skills/opennovel-bible-builder skills/opennovel-outline-builder skills/opennovel-chapter-writer skills/opennovel-continuity-manager skills/opennovel-editor skills/opennovel-exporter/scripts
```

- [ ] **Step 2: Create opennovel-project-setup/SKILL.md**

```md
---
name: opennovel-project-setup
description: Initialize or update an OpenNovel story project. Use when the user wants to create a new story project, update project metadata, or run opennovel init.
license: MIT
compatibility: Node.js 18+, opennovel CLI
metadata:
  version: "1.0.0"
  category: setup
---

# OpenNovel Project Setup

## Purpose
Initialize or update an OpenNovel story project with the 4 core files and directory structure.

## Usage
Run the opennovel CLI:
```
opennovel init <project-name> [--force]
```

Or create the structure manually:
```
<project-name>/
├── project.md
├── bible.md
├── outline.md
├── continuity.md
├── content/
├── output/
├── AGENTS.md
└── .opennovel/
    └── state.json
```

## Process
1. Ask for the project name if not provided.
2. Run `opennovel init <name>` to scaffold.
3. Open `project.md` and fill in: genre, tone, POV, premise, logline, themes, conflict, stakes, ending type.
4. Guide the user through each field — do not fill without discussion.

## Rules
- Do NOT skip the discussion phase.
- Do NOT create the project manually unless CLI is unavailable.
- Do NOT modify bible.md, outline.md, or continuity.md — those belong to other skills.
```

- [ ] **Step 3: Create opennovel-bible-builder/SKILL.md**

```md
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
```

- [ ] **Step 4: Create opennovel-outline-builder/SKILL.md**

```md
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
- Do not write chapter prose — use opennovel-chapter-writer for that.
```

- [ ] **Step 5: Create opennovel-chapter-writer/SKILL.md**

```md
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
```

- [ ] **Step 6: Create opennovel-continuity-manager/SKILL.md**

```md
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
```

- [ ] **Step 7: Create opennovel-editor/SKILL.md**

```md
---
name: opennovel-editor
description: Review, revise, and edit story chapters for an OpenNovel project. Use when the user asks to review a chapter, revise prose, fix plot holes, check character consistency, or do a final edit before export.
license: MIT
compatibility: Requires an OpenNovel project with bible.md, outline.md, continuity.md
metadata:
  version: "1.0.0"
  category: writing
---

# OpenNovel Editor

## Purpose
Review and edit story chapters for quality, consistency, and polish.

## Required Context
Before editing, read:
- `project.md` — tone, POV, tense
- `bible.md` — character profiles, world rules, secrets
- `outline.md` — intended plot progression
- `continuity.md` — revealed information, story state
- The target chapter from `content/`

## Review Process
Review in this exact order:

1. **Logic** — Does the chapter contradict bible.md, continuity.md, or basic cause-effect?
2. **Character** — Do characters act according to their established personality?
3. **Plot** — Does the chapter advance the plot per outline.md?
4. **Pacing** — Is the rhythm right? Too fast? Too slow?
5. **Emotion** — Does the chapter land emotionally?
6. **Prose** — Style, clarity, word choice, sentence flow.

## Edit Process
Fix issues in this exact order:
1. Logic issues first (these cascade to everything else)
2. Character issues
3. Plot issues
4. Pacing adjustments
5. Dialogue fixes
6. Prose polish last

## Rules
- Always review before editing — diagnosis before treatment.
- If a logic or character issue is found, check if it affects other chapters too.
- Do not change the plot without user approval.
- Do not introduce new contradictions with bible.md or continuity.md.
```

- [ ] **Step 8: Create opennovel-exporter/SKILL.md**

```md
---
name: opennovel-exporter
description: Export OpenNovel chapters from content/ to output/ in various formats. Use when the user asks to export the story, compile chapters, generate output files, or convert to txt/html/docx/pdf.
license: MIT
compatibility: Requires an OpenNovel project with content/chapter_*.md files
metadata:
  version: "1.0.0"
  category: export
---

# OpenNovel Exporter

## Purpose
Compile story chapters from `content/` into final output formats.

## Methods

### CLI Export (basic)
Run:
```
opennovel export
opennovel export --from 3 --to 7
```

This concatenates `content/chapter_*.md` into `output/full_story.md`.

### Script Export (advanced)
For TXT, HTML, DOCX, or PDF output:
```bash
node skills/opennovel-exporter/scripts/export.js [--from N] [--to N] [--format txt|html|docx|pdf]
```

## Process
1. Read all chapter files from `content/` sorted by chapter number.
2. Concatenate with chapter separators.
3. Write to `output/` in the requested format.

## Rules
- Never modify `content/` files — read-only on source.
- Always write to `output/` — never anywhere else.
- Preserve chapter headings and structure.
- If a format conversion fails, fall back to Markdown.
```

- [ ] **Step 9: Verify all SKILL.md files exist**

```bash
Get-ChildItem -Recurse -Filter "SKILL.md" skills/ | ForEach-Object { $_.FullName }
```

Expected: 7 files, one per skill folder.

- [ ] **Step 10: Commit**

```bash
git add skills/
git commit -m "feat: add 7 OpenNovel skill packs with SKILL.md per skills.sh standard"
```

---

### Task 9: Create exporter script

**Files:**
- Create: `skills/opennovel-exporter/scripts/export.js`

This script reads `content/chapter_*.md` and outputs to requested format. Implement Markdown concatenation (always works) with optional format conversion via a simple approach.

- [ ] **Step 1: Create the export script**

```js
#!/usr/bin/env node

/**
 * OpenNovel Exporter Script
 * Usage: node skills/opennovel-exporter/scripts/export.js [options]
 *
 * Options:
 *   --from <N>      Start chapter number
 *   --to <N>        End chapter number
 *   --format <fmt>  Output format: txt, html, docx, pdf (default: txt)
 *   --output <path> Output file path (default: output/full_story.<format>)
 */

const fs = require('fs');
const path = require('path');

const CHAPTER_RE = /chapter_(\d+)\.md$/i;

function findProjectDir(startDir) {
  let current = path.resolve(startDir || process.cwd());
  while (true) {
    if (fs.existsSync(path.join(current, '.opennovel', 'state.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function parseArgs(argv) {
  let from = null, to = null, format = 'txt', output = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--from' && i + 1 < argv.length) from = parseInt(argv[++i], 10);
    if (argv[i] === '--to' && i + 1 < argv.length) to = parseInt(argv[++i], 10);
    if (argv[i] === '--format' && i + 1 < argv.length) format = argv[++i];
    if (argv[i] === '--output' && i + 1 < argv.length) output = argv[++i];
  }
  return { from, to, format, output };
}

function collectChapters(contentDir, from, to) {
  let files = fs.readdirSync(contentDir)
    .filter(f => CHAPTER_RE.test(f))
    .map(f => ({
      name: f,
      num: parseInt(f.match(CHAPTER_RE)[1], 10),
      fullPath: path.join(contentDir, f),
    }))
    .sort((a, b) => a.num - b.num);

  if (from !== null) files = files.filter(f => f.num >= from);
  if (to !== null) files = files.filter(f => f.num <= to);

  return files.map(f => ({
    num: f.num,
    content: fs.readFileSync(f.fullPath, 'utf-8').trim(),
  }));
}

function formatTxt(chapters) {
  return chapters.map(ch => {
    const header = `Chapter ${ch.num}\n${'='.repeat(20)}`;
    return `${header}\n\n${ch.content}`;
  }).join('\n\n---\n\n');
}

function formatHtml(chapters) {
  const body = chapters.map(ch => {
    return `  <section>\n    <h1>Chapter ${ch.num}</h1>\n${ch.content.split('\n').map(l => `    <p>${l}</p>`).join('\n')}\n  </section>`;
  }).join('\n\n');
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Full Story</title>\n</head>\n<body>\n${body}\n</body>\n</html>`;
}

function formatDocx(chapters) {
  // Basic DOCX via HTML wrapper (Word can open HTML as DOCX)
  return formatHtml(chapters);
}

function formatPdf(chapters) {
  // Basic PDF-like output (user can print to PDF from browser)
  // For real PDF, recommend pandoc: pandoc output/full_story.md -o output/full_story.pdf
  return formatHtml(chapters);
}

function main() {
  const projectDir = findProjectDir();
  if (!projectDir) {
    console.error('Not inside an OpenNovel project.');
    process.exit(1);
  }

  const contentDir = path.join(projectDir, 'content');
  if (!fs.existsSync(contentDir)) {
    console.error('content/ directory not found.');
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));
  const chapters = collectChapters(contentDir, args.from, args.to);

  if (chapters.length === 0) {
    console.error('No chapters found in content/.');
    process.exit(1);
  }

  const formatters = { txt: formatTxt, html: formatHtml, docx: formatDocx, pdf: formatPdf };
  const formatter = formatters[args.format] || formatTxt;

  const outputDir = path.join(projectDir, 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = args.output || path.join(outputDir, `full_story.${args.format}`);
  const outputContent = formatter(chapters);
  fs.writeFileSync(outputPath, outputContent, 'utf-8');

  console.log(`Exported ${chapters.length} chapter(s) to ${outputPath}`);
}

main();
```

- [ ] **Step 2: Verify the script loads without syntax errors**

```bash
node -c skills/opennovel-exporter/scripts/export.js
```

Expected: no output (syntax is valid).

- [ ] **Step 3: Commit**

```bash
git add skills/opennovel-exporter/scripts/export.js
git commit -m "feat: add exporter script with txt/html/docx/pdf format support"
```

---

### Task 10: Create skills CLI command

**Files:**
- Create: `src/commands/skills.js`

This command handles `opennovel skills list` and `opennovel skills install`. It discovers skills from the `skills/` directory in the opennovel package root, reads SKILL.md frontmatter, and copies/symlinks to the target agent directory.

- [ ] **Step 1: Create src/commands/skills.js**

```js
const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', 'skills');

const TARGET_DIRS = {
  'codex': {
    project: '.agents/skills',
    user: '.agents/skills',
  },
  'claude': {
    project: '.claude/skills',
    user: '~/.claude/skills',
  },
};

function listSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('No skills directory found at:', SKILLS_DIR);
    process.exit(1);
  }

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skills = entries
    .filter(e => e.isDirectory())
    .map(dir => {
      const skillPath = path.join(SKILLS_DIR, dir.name, 'SKILL.md');
      if (!fs.existsSync(skillPath)) return null;
      const content = fs.readFileSync(skillPath, 'utf-8');
      const nameMatch = content.match(/^name:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*(.+)$/m);
      const catMatch = content.match(/^\s+category:\s*(.+)$/m);
      return {
        folder: dir.name,
        name: nameMatch ? nameMatch[1].trim() : dir.name,
        description: descMatch ? descMatch[1].trim() : '(no description)',
        category: catMatch ? catMatch[1].trim() : 'uncategorized',
      };
    })
    .filter(Boolean);

  if (skills.length === 0) {
    console.log('No skills found.');
    return;
  }

  console.log(`Available OpenNovel skills (${skills.length}):`);
  console.log('');

  const byCategory = {};
  for (const s of skills) {
    (byCategory[s.category] || (byCategory[s.category] = [])).push(s);
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    console.log(`  [${cat}]`);
    for (const s of items) {
      console.log(`    ${s.folder}`);
      console.log(`      ${s.description}`);
    }
    console.log('');
  }
}

function copyOrLinkSkill(srcDir, destDir, useLink) {
  const destParent = path.dirname(destDir);
  if (!fs.existsSync(destParent)) {
    fs.mkdirSync(destParent, { recursive: true });
  }

  if (fs.existsSync(destDir)) {
    console.log(`    Skipped (already exists): ${destDir}`);
    return;
  }

  if (useLink) {
    // Relative symlink for portability
    const relSrc = path.relative(destParent, srcDir);
    try {
      fs.symlinkSync(relSrc, destDir, 'junction');
      console.log(`    Linked: ${destDir} -> ${relSrc}`);
    } catch (err) {
      console.error(`    Failed to create symlink: ${err.message}`);
      console.log('    Falling back to copy...');
      fs.cpSync(srcDir, destDir, { recursive: true });
      console.log(`    Copied: ${destDir}`);
    }
  } else {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`    Copied: ${destDir}`);
  }
}

function installSkills(args) {
  const targetIndex = args.indexOf('--target');
  const scopeIndex = args.indexOf('--scope');
  const useLink = args.includes('--link');

  if (targetIndex === -1 || scopeIndex === -1) {
    console.error('Usage: opennovel skills install --target codex|claude --scope project|user [--link]');
    console.error('');
    console.error('  --target   Agent type: codex or claude');
    console.error('  --scope    Install scope: project (in-project) or user (global)');
    console.error('  --link     Create symlinks instead of copying (developer mode)');
    process.exit(1);
  }

  const target = args[targetIndex + 1];
  const scope = args[scopeIndex + 1];

  if (!['codex', 'claude'].includes(target)) {
    console.error(`Invalid target: "${target}". Use "codex" or "claude".`);
    process.exit(1);
  }

  if (!['project', 'user'].includes(scope)) {
    console.error(`Invalid scope: "${scope}". Use "project" or "user".`);
    process.exit(1);
  }

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('No skills directory found at:', SKILLS_DIR);
    process.exit(1);
  }

  const projectDir = (scope === 'project')
    ? findProjectDir()
    : null;

  if (scope === 'project' && !projectDir) {
    console.error('Not inside an OpenNovel project. Run from a project directory or use --scope user.');
    process.exit(1);
  }

  const baseDir = (scope === 'project')
    ? path.join(projectDir, TARGET_DIRS[target][scope])
    : path.resolve(TARGET_DIRS[target][scope].replace(/^~/, process.env.HOME || process.env.USERPROFILE));

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skillDirs = entries.filter(e => e.isDirectory() && fs.existsSync(path.join(SKILLS_DIR, e.name, 'SKILL.md')));

  if (skillDirs.length === 0) {
    console.log('No skills with SKILL.md found.');
    return;
  }

  console.log(`Installing ${skillDirs.length} OpenNovel skill(s) to ${baseDir} ...`);

  for (const dir of skillDirs) {
    const src = path.join(SKILLS_DIR, dir.name);
    const dest = path.join(baseDir, dir.name);
    copyOrLinkSkill(src, dest, useLink);
  }

  console.log('');
  console.log('Done. Skills are now available to your coding agent.');
}

function findProjectDir() {
  let current = process.cwd();
  while (true) {
    if (fs.existsSync(path.join(current, '.opennovel', 'state.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function skills(args) {
  const subcommand = args[0];

  if (!subcommand || subcommand === '--help' || subcommand === '-h') {
    console.log('OpenNovel Skills Manager');
    console.log('');
    console.log('Usage:');
    console.log('  opennovel skills list');
    console.log('  opennovel skills install --target codex|claude --scope project|user [--link]');
    console.log('');
    console.log('Targets:');
    console.log('  codex     Codex CLI (.agents/skills/)');
    console.log('  claude    Claude Code (.claude/skills/)');
    console.log('');
    console.log('Scopes:');
    console.log('  project   Install in current project only');
    console.log('  user      Install globally for the user');
    return;
  }

  if (subcommand === 'list') {
    listSkills();
  } else if (subcommand === 'install') {
    installSkills(args.slice(1));
  } else {
    console.error(`Unknown subcommand: "${subcommand}"`);
    console.error('Run "opennovel skills --help" for usage.');
    process.exit(1);
  }
}

module.exports = skills;
```

- [ ] **Step 2: Verify syntax**

```bash
node -c src/commands/skills.js
```

Expected: no output.

- [ ] **Step 3: Test skills list**

```bash
node -e "const skills = require('./src/commands/skills'); skills(['list'])"
```

Expected: Lists 7 skills with categories.

- [ ] **Step 4: Commit**

```bash
git add src/commands/skills.js
git commit -m "feat: add skills CLI command with list and install"
```

---

### Task 11: Update CLI entry point (index.js)

**Files:**
- Modify: `src/index.js`

Add the `skills` command to the COMMANDS map.

- [ ] **Step 1: Add skills import and command**

Line 3: Add `const skills = require('./commands/skills.js');`

After line 8 (export entry), add:
```js
  skills: { fn: skills, desc: 'List or install OpenNovel agent skills (skills.sh standard)' },
```

- [ ] **Step 2: Update help examples**

After line 29 (`opennovel export`), add:
```js
  console.log('  opennovel skills list');
  console.log('  opennovel skills install --target codex --scope project');
```

- [ ] **Step 3: Verify the full CLI works**

```bash
node bin/opennovel.js --help
```

Expected: Shows all commands including `skills`.

```bash
node bin/opennovel.js skills list
```

Expected: Lists 7 skills.

- [ ] **Step 4: Commit**

```bash
git add src/index.js
git commit -m "feat: register skills command in CLI"
```

---

### Task 12: Update root SKILL.md

**Files:**
- Modify: `SKILL.md` (root of the repo)

The root SKILL.md is the meta-skill for the opennovel package itself. Update its description and commands to match v2.

- [ ] **Step 1: Update frontmatter description and content**

Replace the entire file:

```md
---
name: opennovel
description: Framework for AI-assisted novel/story writing. Covers project setup, story bible, plot outlining, chapter writing, continuity tracking, editing, and export. Use when user wants to write a novel, story, or script — or invokes /opennovel.
---

# OpenNovel Framework

## Quick Start

User says "I want to write a story" → load this skill → start the pipeline.

## 6-Step Pipeline

### Step 0: Discussion
Do NOT start filling templates yet. First discuss with user:
- Genre, tone, inspiration
- Premise & logline ideas
- Character concepts (protagonist, antagonist)
- World & setting overview
- Plot skeleton (beginning → middle → end)

After user confirms → proceed to project setup.

### Step 1: Project Setup
- Run `opennovel init <name>` to scaffold the project
- Fill `project.md` — genre, tone, POV, premise, logline, themes, conflict, stakes, ending type

### Step 2: Bible Builder
- Fill `bible.md` — characters, world, rules, secrets, cause-effect
- Use `opennovel-bible-builder` skill for guidance

### Step 3: Outline Builder
- Fill `outline.md` — plot, timeline, 10 turning points, chapter list, chapter briefs
- Use `opennovel-outline-builder` skill for guidance

### Step 4: Write (per chapter loop)
1. Read chapter brief from `outline.md`
2. Check continuity in `continuity.md`
3. Write chapter → `content/chapter_NNN.md`
4. Review (logic → character → plot → pacing → emotion → prose)
5. Edit if needed
6. Update `continuity.md`

### Step 5: Final Review & Edit
1. Read entire story from `content/`
2. Review holistically (plot holes, pacing across chapters, character arcs)
3. Fix issues (logic first, prose last)
4. Export → `opennovel export`

### Step 6: Export
- Run `opennovel export` or the exporter script for various formats
- Output goes to `output/`

## Golden Rules
1. Never reveal secrets before their scheduled chapter
2. Never make characters act against their core personality without sufficient cause
3. Never break world logic without establishing exception rules first
4. Always update continuity after each chapter (AI forgets)
5. Each chapter must have: goal, conflict, mini-climax, and hook

## Commands
- `opennovel init <name> [--force]` — scaffold/update project (re-runnable)
- `opennovel status` — check progress
- `opennovel next` — show next recommended step
- `opennovel export [--from N] [--to N]` — compile chapters into output
- `opennovel skills list` — list available OpenNovel skills
- `opennovel skills install --target codex|claude --scope project|user [--link]` — install skills for your coding agent
```

- [ ] **Step 2: Verify**

```bash
node -e "console.log('SKILL.md updated')"
```

Manual check: The file looks correct and references all 6 steps and 6 CLI commands.

- [ ] **Step 3: Commit**

```bash
git add SKILL.md
git commit -m "docs: update root SKILL.md to match v2 structure"
```

---

### Task 13: Update package.json

**Files:**
- Modify: `package.json`

Add `skills/` to the `files` array so it's included when published.

- [ ] **Step 1: Update files array**

Change:
```json
  "files": [
    "bin/",
    "src/"
  ],
```

To:
```json
  "files": [
    "bin/",
    "src/",
    "skills/"
  ],
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "chore: include skills/ in package files"
```

---

### Self-Review Checklist

1. **Spec coverage:**
   - ✅ Simple project tree (4 files + 2 dirs) → Task 1 (templates), Task 5 (init)
   - ✅ Skill packs as separate SKILL.md directories → Task 8
   - ✅ No SKILLS.md registry file → confirmed not created
   - ✅ 7 skills defined → Tasks 8-9
   - ✅ `opennovel skills install` command → Task 10
   - ✅ --target codex|claude, --scope project|user, --link → Task 10
   - ✅ Export from content/ → Task 6
   - ✅ AGENTS.md with project structure → Task 1 (agentsMdTemplate)
   - ✅ Root SKILL.md updated → Task 12
   - ✅ state.json kept (not .jsonc) → Task 2 doesn't change format
   - ✅ content/ created empty by init → Task 5
   - ✅ exporter script with formats → Task 9

2. **Placeholder scan:** No TBD, TODO, "implement later", "handle edge cases", or "similar to" found.

3. **Type consistency:**
   - `getFileTree()` returns same interface `{dir}` / `{file, content}` — consistent with init.js
   - `MODULES` array shape unchanged — consistent with status.js, next.js, state.js
   - `agentsMdTemplate` exported as same name — consistent with agents.js
   - Skills command uses `{fn, desc}` shape — consistent with index.js

**No gaps found. Plan is complete.**
