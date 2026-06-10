---
name: opennovel-review
description: Review story chapters for quality, consistency, and logic errors. Diagnosis-only — does not edit content. Use when the user wants a chapter reviewed, checked for plot holes, character consistency verified, or a quality assessment before finalizing.
license: MIT
compatibility: Requires an OpenNovel project with bible.md, outline.md, continuity.md for full accuracy
metadata:
  version: "1.0.0"
  category: review
---

# OpenNovel Review

## Purpose

Review chapters for quality issues and diagnose problems. This skill is **read-only** — it reports issues with severity levels and suggestions but never modifies files.

## Required Context

Read these for full accuracy:

- `project.md` — tone, POV, tense
- `bible.md` — character profiles, world rules, secrets
- `outline.md` — intended plot progression
- `continuity.md` — revealed information, story state
- The target chapter from `content/`

If some files are missing, review with what is available and note the gap.

## Review Order

Review in this exact order. Each step depends on the previous one:

1. **Logic** — Does the chapter contradict bible.md, continuity.md, or basic cause-effect? Are world rules respected? Are secrets revealed too early?
2. **Character** — Do characters act according to their established personality? Does dialogue match their voice? Does each character have a clear goal in the chapter?
3. **Plot** — Does the chapter advance the plot per outline.md? Are events meaningful? Does the mini-climax have weight? Does the hook make the reader want the next chapter?
4. **Pacing** — Does the opening grab attention? Does the middle drag? Are there unnecessary scenes? Are transitions smooth?
5. **Emotion** — Does the chapter land at the right emotional tone? Are there memorable moments? Does emotional intensity build?
6. **Prose** — Is the tone correct for this story? Are words repeated unnecessarily? Are sentences natural? Is there a good balance of description and dialogue?

## Output Format

For each issue found, report as follows:

```
**Severity: [Critical | Major | Minor | Suggestion]**
**Location:** [section or paragraph reference]
**Problem:** [what is wrong]
**Why it matters:** [impact on story quality]
**Suggestion:** [how to fix — but do not edit]
```

### Severity Definitions

| Level | Meaning | Example |
|---|---|---|
| **Critical** | Makes the chapter unusable | Character acts against core personality, secret revealed 5 chapters early |
| **Major** | Significant quality issue | Logic contradiction, plot hole, continuity break |
| **Minor** | Noticeable but not damaging | Slightly off voice, minor pacing issue |
| **Suggestion** | Improvement opportunity | Tighten prose, stronger hook, more sensory detail |

## Rules

- Do NOT modify any files — this skill is read-only
- Do NOT rewrite prose — report issues, do not fix them
- If the same issue appears across multiple chapters, flag it as a recurring pattern
- After reporting, tell the user to run `opennovel-writing-assistant` to apply fixes if they want changes
- When reviewing a revision, only re-check the areas that changed plus anything affected by those changes
