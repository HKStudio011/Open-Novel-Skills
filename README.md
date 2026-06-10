# OpenNovel Framework 🖋️

AI-assisted novel/story writing framework.

[:vietnam: Tiếng Việt](README.vi.md)

Combines a **CLI tool** + **7 agent skills** for AI coding assistants (Claude Code, OpenCode, Codex) — from project scaffolding, story bible, plot outline, chapter writing, review, continuity tracking, to final export.

---

## Features

- **CLI scaffold** — `opennovel init` creates a standardized project structure
- **Story bible** — characters, world rules, secrets, cause-effect chains
- **Plot outline** — chapter briefs, timeline, turning points, hooks
- **AI-assisted writing** — chapters written per brief, in-character
- **Built-in review** — 6-layer quality check (logic → character → plot → pacing → emotion → prose)
- **Continuity tracking** — auto-update story state after each chapter
- **Raw Story Assimilation** — import existing stories, extract bible/outline, rewrite or continue
- **Export** — `.md` → `.txt` / `.html`

---

## Installation

```bash
# Global install
npm install -g opennovel

# Or run directly via npx
npx opennovel init my-story
```

**Requirements:** Node.js >= 18

---

## Quick Start

```bash
npx opennovel init my-story
cd my-story
```

Then load the `opennovel-writing-assistant` skill in your AI coding assistant (Claude Code, OpenCode, Codex...).

### Option 1: New story

Tell the AI:

> "I want to write a story"

The AI will automatically:
1. Fill in project metadata (genre, tone, POV, premise...)
2. Build story bible (characters, world rules, secrets)
3. Create outline (plot structure, chapter briefs)
4. Write each chapter, review, revise, update continuity

### Option 2: Existing story

Paste your story text and tell the AI:

> "Continue this story" / "Rewrite this chapter"

The AI enters **Raw Story Assimilation Mode**:
1. Analyze content → detect characters, plot, secrets
2. Propose Bible Update + Outline Update
3. After your approval, rewrite or continue with continuity tracking

---

## Workflow

```
Bible → Outline → Write → Review → Revise → Continuity
  ↑                                                │
  └───────────────────── Next chapter ─────────────┘
                              │
                              ↓
                          Export
```

Breakdown:
1. **project-init** — scaffold project, fill metadata
2. **bible-builder** — characters, world, rules, secrets
3. **outline-builder** — plot, timeline, chapter briefs
4. **writing-assistant** — write chapter per brief
5. **review** — quality check (diagnosis-only, no edits)
6. **writing-assistant** — fix issues from review (logic first, prose last)
7. **continuity-manager** — update story state (only after chapter finalized)
8. Loop to step 4 for next chapter, or **export** on completion

---

## Skill Inventory

| Skill | Role | When to use |
|---|---|---|
| `opennovel-project-init` | Create/update project metadata | New project, missing metadata |
| `opennovel-writing-assistant` | Core orchestration, write/revise | Every writing session — **main entry point** |
| `opennovel-bible-builder` | Characters, world, rules, secrets | Missing context, worldbuilding, or raw text analysis |
| `opennovel-outline-builder` | Plot, timeline, chapter briefs | Missing structure, planning, or raw text analysis |
| `opennovel-continuity-manager` | Track story state | After each finalized chapter |
| `opennovel-review` | Diagnosis-only quality check | Before finalizing a chapter |
| `opennovel-exporter` | .md → .txt / .html | Story complete |

---

## Golden Rules

1. Every chapter needs: **goal** → **conflict** → **mini-climax** → **hook**
2. Review order: logic → character → plot → pacing → emotion → prose
3. Fix order: logic first, prose last
4. Update continuity after every chapter (only after finalized)
5. Never reveal secrets early or break character

---

## License

MIT
