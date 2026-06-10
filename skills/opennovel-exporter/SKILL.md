---
name: opennovel-exporter
description: Export .md files to TXT and/or HTML. Use when the user asks to export a story, compile chapters, or convert markdown files to readable formats.
license: MIT
compatibility: Works standalone — no project scaffolding required
metadata:
  version: "2.0.0"
  category: export
---

# OpenNovel Exporter

## Purpose
Convert `.md` files to plain text (`.txt`) and/or styled HTML (`.html`).

## Usage

```
node skills/opennovel-exporter/scripts/export.js [options]
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--input <path>` | (prompt) | File `.md` or directory containing `.md` files |
| `--format <type>` | `both` | Output type: `txt`, `html`, or `both` |
| `--output <dir>` | `./output/` | Target directory for exported files |

### Examples

```bash
# Prompt for input path, export both txt and html
node skills/opennovel-exporter/scripts/export.js

# Single file to txt only
node skills/opennovel-exporter/scripts/export.js --input my-chapter.md --format txt

# Directory, html only
node skills/opennovel-exporter/scripts/export.js --input chapters/ --format html

# Custom output directory
node skills/opennovel-exporter/scripts/export.js --input story/ --output dist/
```

## Behavior

- **Single `.md` file**: exported as-is (TXT) plus rendered with HTML template
- **Directory**: every `.md` file becomes its own `.txt` and/or `.html` in output
- **Interactive prompt**: if `--input` is omitted, the script asks for the path
- **HTML template**: clean typography, dark mode support, responsive layout
