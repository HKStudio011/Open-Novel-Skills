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
