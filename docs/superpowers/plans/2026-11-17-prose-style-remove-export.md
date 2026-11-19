# Prose Style Guidance + Remove Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Teach OpenNovel's skills to write fiction instead of AI-slop (narrator stops explaining), and remove the unused export machinery.

**Architecture:** Two guidance edits — a positive prose recipe in `opennovel-writing-assistant`, a slop-detection checklist in `opennovel-review` — validated by same-input subagent A/B tests (baseline without guidance → with guidance). Then a mechanical removal of `opennovel-exporter` and all `output/` references across 8 files, plus a per-project Style section in the scaffold template.

**Tech Stack:** Markdown skills; Node.js CLI (no test framework — verification via `node -c` syntax checks, CLI smoke tests, and subagent scenarios).

**Spec:** `docs/superpowers/specs/2026-11-17-prose-style-remove-export-design.md` (approved)

## Global Constraints

- Guidance text in English. README.md is English; README.vi.md mirrors it structurally in Vietnamese.
- Writer gets a **positive recipe** (what to do); reviewer gets a **detection checklist** (what to flag). No prohibition lists for the writer; no shared/duplicated list.
- Size: writing-assistant addition ~30-40 lines; review addition ~15-25 lines.
- Bump `metadata.version` `"1.0.0"` → `"1.1.0"` in both edited skills.
- Never edit files under `docs/superpowers/plans/2026-06-*` (historical records). Do not commit the pre-existing local modification to `.codegraph/.gitignore`.
- Subagent test inputs (scenario, plant passage) are fixed below — reuse verbatim for baseline and verification runs.

## Review Focus

1. **Fresh scaffold** — after template edits, `opennovel init` must create a project with no `output/` dir and an AGENTS.md with no Output section. Pinned: Task 5 Step 5.
2. **Raw Story mode** — rewriting an existing draft must obey the Prose Style recipe the same as fresh writing. Pinned: Task 1/4 use a rewrite scenario as the A/B input.
3. **Review stays read-only** — the expanded checklist must not turn review into an editor. Pinned: Task 4 Step 3 asserts no rewrites in review output.
4. **Dynamic skill discovery** — `opennovel skills list` and `init` copy skills by directory scan; deleting `skills/opennovel-exporter/` must drop it everywhere with no code change. Pinned: Task 5 Step 6.
5. **Bilingual doc drift** — README.md and README.vi.md must end up structurally equal (no exporter mentions in either). Pinned: Task 7 Step 1.

---

### Task 1: Baseline slop test (RED)

**Files:**
- Create: `docs/superpowers/plans/2026-11-17-prose-style-baseline.md`

**Interfaces:**
- Produces: baseline record file. Task 4 compares its metrics against the with-skill rerun (same subagent prompt, updated skill content).

- [ ] **Step 1: Commit spec + plan docs**

```bash
git add docs/superpowers/specs/2026-11-17-prose-style-remove-export-design.md docs/superpowers/plans/2026-11-17-prose-style-remove-export.md
git commit -m "docs: spec and plan for prose style guidance + export removal"
```

- [ ] **Step 2: Dispatch baseline subagent (no style guidance)**

Dispatch a fresh `general` subagent with this exact prompt (the skill text embedded is the **current** content of `skills/opennovel-writing-assistant/SKILL.md`, verbatim):

```
You are a fiction-writing assistant using the OpenNovel framework. Follow this skill:

---SKILL START---
<full current text of skills/opennovel-writing-assistant/SKILL.md>
---SKILL END---

A user pasted a draft chapter opening and asked you to rewrite it as a proper scene.

Draft to rewrite (keep these events, the POV, the tense, the tone):
"That night, Linh felt suspicious of her brother. She knew that Phong was lying about where he went every evening, and the weight of that realization troubled her deeply. At dinner, the air was thick with tension. Phong told a joke to lighten the mood, because he always used humor to avoid conflict. Linh smiled, but inside she felt a wave of frustration. It was the moment she decided to search his jacket. When she found the second phone, she suddenly understood that her brother was in danger, and her heart was filled with dread. Everything was going to change from now on."

Context: third person limited (Linh, 24), past tense, restrained contemporary drama. Phong is charming, conflict-avoidant, protective of Linh.

Rewrite as a scene of 250-350 words. Output only the scene prose, nothing else.
```

- [ ] **Step 3: Score the output and record it**

Read the subagent's scene. Count instances of: named emotions ("felt suspicious/dread"), stated knowledge/motives ("she knew", "because he always used humor"), stock phrasing ("air was thick with tension", "wave of"), moralizing/summary close ("Everything was going to change"). Write `docs/superpowers/plans/2026-11-17-prose-style-baseline.md` with: the full verbatim output, the per-pattern counts, and a one-line verdict. Expected: ≥3 planted patterns survive — this is the failing test. If the baseline output is already clean (0-1 patterns), STOP: there is nothing to fix; report to the human partner before any guidance is written.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-11-17-prose-style-baseline.md
git commit -m "test: record baseline slop without prose guidance"
```

### Task 2: Prose recipe in writing-assistant (GREEN)

**Files:**
- Modify: `skills/opennovel-writing-assistant/SKILL.md` (frontmatter line 7; insert after line 68, the end of the goal/conflict/climax/hook block; Rules line 164)

**Interfaces:**
- Produces: section `### Prose Style` inside `## Process`. Task 6 references its rule that `project.md` Style overrides these defaults.

- [ ] **Step 1: Insert the Prose Style section**

Insert immediately after the goal/conflict/mini-climax/hook bullet list (after the `- **Hook**` line):

```markdown
### Prose Style

Applies to every scene you write or rewrite, in any mode. Write scenes, not summaries — the reader watches events happen; the narrator stays invisible.

Render everything through what can be seen, heard, said, or done:

| Instead of | Write |
|---|---|
| Naming emotions ("she felt guilty") | Behavior that shows them (she put the phone face-down and stopped stirring) |
| Stating motives ("he lied to protect her") | Choices and dialogue that let the reader infer the motive |
| Narrator lectures ("As everyone knew, the war...") | A character learning it on the page, or the information staying hidden |
| Explaining a scene's meaning ("it was the last time...") | Nothing — if the scene showed it, cut the line |

One test: if a sentence tells the reader what to think about what just happened, delete it.

If `project.md` has a filled-in **Style** section, it overrides these defaults for that story.

Example — narrator explaining (not acceptable):

> Minh felt a wave of guilt. He knew he had betrayed his brother's trust, and the weight of that realization was almost unbearable. It was the last time they would laugh together like this.

Same beat, rendered:

> Minh put the phone face-down. Across the table, his brother was still laughing at something on his own screen.
```

- [ ] **Step 2: Remove the exporter rule, bump version**

- Delete the Rules line `- Do not write to output/ — that is for exporter only`
- In frontmatter, change `version: "1.0.0"` to `version: "1.1.0"`

- [ ] **Step 3: Verify**

```bash
Select-String -Path skills/opennovel-writing-assistant/SKILL.md -Pattern 'Prose Style|output/|1\.1\.0'
```
Expected: `Prose Style` and `1.1.0` present; no `output/` matches.

- [ ] **Step 4: Commit**

```bash
git add skills/opennovel-writing-assistant/SKILL.md
git commit -m "feat(skills): prose style recipe in writing-assistant"
```

### Task 3: Slop checklist in review (GREEN)

**Files:**
- Modify: `skills/opennovel-review/SKILL.md` (line 38; frontmatter line 7)

- [ ] **Step 1: Replace step 6 Prose with the checklist**

Replace the single line `6. **Prose** — Is the tone correct for this story? ...` with:

```markdown
6. **Prose** — scan for AI-slop patterns and report each occurrence:
   - **Narrator explains** — names emotions ("she felt..."), states motives, or tells the reader what a scene meant
   - **Redundant summary** — a sentence restating what dialogue or action just showed
   - **Moralizing** — the narrator draws the lesson ("and in that moment, she understood..."), especially at chapter endings
   - **Stock phrasing** — clichés doing the emotional work ("a wave of", "the air was thick with tension", "little did they know")
   - **Uniform voice** — every character speaks in the same clever, balanced rhythm
   - **Tics** — heavy adverbs and intensifiers ("suddenly", "very"), one sentence pattern repeated

   Severity: narrator-explaining and moralizing are **Minor** when scattered, **Major** when dense or at a chapter's emotional peak. The rest are **Minor** or **Suggestion**. Keep the tone check from this step's original purpose: flag tone that contradicts project.md.
```

- [ ] **Step 2: Bump version**

Frontmatter `version: "1.0.0"` → `version: "1.1.0"`.

- [ ] **Step 3: Verify**

```bash
Select-String -Path skills/opennovel-review/SKILL.md -Pattern 'AI-slop|1\.1\.0'
```
Expected: both present.

- [ ] **Step 4: Commit**

```bash
git add skills/opennovel-review/SKILL.md
git commit -m "feat(skills): slop detection checklist in review step 6"
```

### Task 4: Guidance verification (GREEN check)

**Files:**
- Modify: `docs/superpowers/plans/2026-11-17-prose-style-baseline.md` (append results)

**Interfaces:**
- Consumes: Task 1's subagent prompt (verbatim, with updated SKILL text) and Task 1's metrics; Task 2's Prose Style section; Task 3's checklist.

- [ ] **Step 1: Rerun the rewrite scenario with the updated skill**

Dispatch a fresh `general` subagent with the exact Task 1 Step 2 prompt, but the SKILL block contains the **updated** `skills/opennovel-writing-assistant/SKILL.md` (with Prose Style). Score with the same pattern list. Expected: ≤2 planted patterns survive, no moralizing close, no narrator explaining. If it fails: tighten the Prose Style wording (the recipe rows, not new prohibitions), re-run. Up to 2 refactor rounds.

- [ ] **Step 2: Plant-slop test for review**

Dispatch a fresh `general` subagent with this prompt:

```
You are using this review skill:

---SKILL START---
<full current text of skills/opennovel-review/SKILL.md>
---SKILL END---

Review the Prose layer (step 6) of this passage:

"Lan felt a wave of sadness wash over her. She knew her father had never really loved the shop, and the weight of that realization was almost unbearable. The air was thick with tension as he handed her the keys. 'Well,' he said quietly, 'the shop is yours now.' And in that moment, she understood that her childhood was truly over. Everything was going to be different from now on."

Follow the skill's output format. Do not rewrite the passage.
```

Expected: flags narrator-explaining, stock phrasing, and moralizing with severities per the checklist; produces NO rewritten prose. If it rewrites despite the skill, tighten the skill's read-only rule (an existing constraint being violated — fix belongs in the skill's Rules section).

- [ ] **Step 3: Record results**

Append to `docs/superpowers/plans/2026-11-17-prose-style-baseline.md`: baseline counts vs with-skill counts, review test verdict, rounds used. Verdict line: guidance reduces slop or not.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-11-17-prose-style-baseline.md
git commit -m "test: verify prose guidance reduces slop"
```

### Task 5: Remove export and output/ everywhere

**Files:**
- Delete: `skills/opennovel-exporter/SKILL.md`, `skills/opennovel-exporter/scripts/export.js`
- Modify: `SKILL.md:3,27,40,56`, `src/templates/project.js:253-254,263,281`, `src/commands/init.js:94`, `AGENTS.md:14,24,43`, `README.md:7,20,79-80,91,104`, `README.vi.md:7,20,79-80,91,104`

- [ ] **Step 1: Delete the skill directory**

```bash
Remove-Item -Recurse -Force skills/opennovel-exporter
```

- [ ] **Step 2: Root SKILL.md**

- Line 3 description: `...review, continuity tracking, and export.` → `...review, and continuity tracking.`
- Line 27: delete the `opennovel-exporter` inventory row
- Line 40: `└── repeat → exporter when complete` → `└── repeat (next chapter)`
- Line 56: delete the `- \`opennovel export\` — see opennovel-exporter skill for usage` line

- [ ] **Step 3: src/templates/project.js (AGENTS.md template + file tree)**

- Delete the template lines `## Output` + `` - \`output/\` — final exported files (.txt, .html, .docx, .pdf) `` (with their blank line)
- Delete the template line `` - \`opennovel-exporter\` ``
- Delete `{ dir: 'output' },` from `getFileTree`

- [ ] **Step 4: src/commands/init.js + repo AGENTS.md**

- init.js line 94: delete `console.log('7. Export final         - output/');`
- AGENTS.md: delete line 14 (`opennovel export         # Compile to output`), line 24 (`` - `opennovel-exporter` — Compile content/ to output/``), line 43 (`output/           — Final exported files`)

- [ ] **Step 5: README.md + README.vi.md (mirror edits)**

Both files, matching lines:
- Line 7: `**7 agent skills**` → `**6 agent skills**`; drop the trailing `— ... to final export.` / `— ... đến export bản cuối.` clause
- Line 20: delete the Export feature bullet
- Workflow diagram: delete the `↓` + `Export` branch (lines 79-80)
- Line 91: `8. Loop to step 4 for next chapter, or **export** on completion` → `8. Loop to step 4 for the next chapter` (vi: `8. Quay lại bước 4 cho chapter tiếp theo`)
- Line 104: delete the `opennovel-exporter` table row

- [ ] **Step 6: Verify removal**

```bash
node --check src/templates/project.js
node --check src/commands/init.js
Select-String -Path SKILL.md,AGENTS.md,README.md,README.vi.md,src\templates\project.js,src\commands\init.js -Pattern 'exporter|output'
node bin/opennovel.js skills list
Push-Location $env:TEMP\opencode; node "D:\Code\Open Novel Skills\bin\opennovel.js" init smoke-test; Pop-Location
```
Expected: `node --check` silent (syntax OK); zero grep matches in the six files; `skills list` shows 5 skills, no exporter; init succeeds. Then check the smoke project at `$env:TEMP\opencode\smoke-test`: no `output/` dir, generated AGENTS.md has no `## Output` section, `.agents/skills/` holds 5 skills — then `Remove-Item -Recurse -Force $env:TEMP\opencode\smoke-test`.

- [ ] **Step 7: Commit**

```bash
git add -A -- SKILL.md AGENTS.md README.md README.vi.md src skills
git commit -m "refactor: remove exporter skill and output/ scaffolding"
```

### Task 6: Per-project Style section in project.md template

**Files:**
- Modify: `src/templates/project.js` (projectTemplate Metadata block, after line 10)
- Modify: `skills/opennovel-writing-assistant/SKILL.md` (Required Context line 21), `skills/opennovel-review/SKILL.md` (Required Context line 21)

**Interfaces:**
- Produces: `## Style` section in generated `project.md`. Consumed by Task 2's Prose Style rule (project Style overrides defaults).

- [ ] **Step 1: Extend the project template**

In `projectTemplate`, after `- **Estimated length:**` insert:

```js
- **Estimated length:**

## Style
- **Narrative voice:** [how the narrator behaves — e.g., restrained, wry, lyrical]
- **Target chapter length:** [words per chapter]
- **Banned words/clichés:** [phrases this story must never use]
- **Style references:** [works whose prose feels close to this story]
```

- [ ] **Step 2: Point both skills at it**

- writing-assistant Required Context: `` - `project.md` — tone, POV, tense, genre, premise `` → append `, style`
- review Required Context: `` - `project.md` — tone, POV, tense `` → append `, style`

- [ ] **Step 3: Verify**

```bash
node --check src/templates/project.js
Push-Location $env:TEMP\opencode; node "D:\Code\Open Novel Skills\bin\opennovel.js" init smoke-test2; Pop-Location
Select-String -Path $env:TEMP\opencode\smoke-test2\project.md -Pattern '## Style'
```
Expected: syntax OK; generated project.md contains `## Style`. Then `Remove-Item -Recurse -Force $env:TEMP\opencode\smoke-test2`.

- [ ] **Step 4: Commit**

```bash
git add src/templates/project.js skills/opennovel-writing-assistant/SKILL.md skills/opennovel-review/SKILL.md
git commit -m "feat: per-project Style section in project.md template"
```

### Task 7: Final sweep

**Files:**
- Modify: only if the sweep finds stragglers

- [ ] **Step 1: Repo-wide grep**

```bash
Get-ChildItem -Recurse -File -Include *.md,*.js -Path . | Where-Object { $_.FullName -notmatch 'docs\\superpowers\\plans\\2026-06|\.codegraph|node_modules' } | Select-String -Pattern 'opennovel-exporter|output' 
```
Expected: matches only in `docs/superpowers/specs/2026-11-17-*` and `docs/superpowers/plans/2026-11-17-*` (this change's own records). Any other hit: fix it.

- [ ] **Step 2: CLI smoke**

```bash
node bin/opennovel.js
```
Expected: help text lists only `init` and `skills`, no export mention.

- [ ] **Step 3: Commit if needed**

```bash
git status --short
git add <straggler files>
git commit -m "chore: final sweep after export removal"
```
