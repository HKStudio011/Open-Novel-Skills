#!/usr/bin/env node

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
  return formatHtml(chapters);
}

function formatPdf(chapters) {
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
