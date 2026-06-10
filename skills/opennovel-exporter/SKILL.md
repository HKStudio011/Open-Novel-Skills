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
