#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

function parseArgs(argv) {
  let input = null, format = 'both', output = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--input' && i + 1 < argv.length) input = argv[++i];
    if (argv[i] === '--format' && i + 1 < argv.length) format = argv[++i];
    if (argv[i] === '--output' && i + 1 < argv.length) output = argv[++i];
  }
  format = ['txt', 'html', 'both'].includes(format) ? format : 'both';
  return { input, format, output };
}

function promptUser(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => { rl.close(); resolve(answer.trim()); });
  });
}

function findMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ name: f, fullPath: path.join(dir, f) }));
}

function extractTitle(md, filename) {
  const firstLine = md.trim().split('\n')[0];
  const m = firstLine.match(/^#\s+(.+)/);
  return m ? m[1] : path.basename(filename, '.md');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMdToHtml(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

function mdToHtml(md) {
  const lines = md.split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      html.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      i++;
      continue;
    }

    if (/^-{3,}$/.test(line.trim())) {
      html.push('<hr>');
      i++;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      html.push(`<h${level}>${inlineMdToHtml(headingMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    if (line.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      html.push(`<blockquote>${quoteLines.map(l => inlineMdToHtml(l)).join('<br>')}</blockquote>`);
      continue;
    }

    if (/^[\s]*[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[\s]*[-*+]\s+/.test(lines[i])) {
        items.push(inlineMdToHtml(lines[i].replace(/^[\s]*[-*+]\s+/, '')));
        i++;
      }
      html.push(`<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^[\s]*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[\s]*\d+\.\s+/.test(lines[i])) {
        items.push(inlineMdToHtml(lines[i].replace(/^[\s]*\d+\.\s+/, '')));
        i++;
      }
      html.push(`<ol>${items.map(item => `<li>${item}</li>`).join('')}</ol>`);
      continue;
    }

    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '') {
      paraLines.push(inlineMdToHtml(lines[i]));
      i++;
    }
    html.push(`<p>${paraLines.join('<br>')}</p>`);
  }

  return html.join('\n');
}

function htmlTemplate(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;max-width:800px;margin:0 auto;padding:2rem 1.5rem;line-height:1.8;color:#1a1a1a;background:#fafafa}
h1,h2,h3,h4{margin-top:1.5em;margin-bottom:0.5em;line-height:1.3;color:#000}
h1{font-size:2em;border-bottom:2px solid #e0e0e0;padding-bottom:.3em}
h2{font-size:1.5em}h3{font-size:1.25em}
p{margin-bottom:1em}
pre{background:#f0f0f0;padding:1rem;border-radius:4px;overflow-x:auto;margin:1em 0}
code{font-family:Consolas,Monaco,monospace;font-size:.9em;background:#f0f0f0;padding:.2em .4em;border-radius:3px}
pre code{background:0 0;padding:0}
blockquote{border-left:4px solid #ccc;margin:1em 0;padding:.5em 1em;color:#555;background:#f5f5f5}
ul,ol{margin:.5em 0 .5em 1.5em}
li{margin-bottom:.3em}
hr{margin:2em 0;border:none;border-top:1px solid #e0e0e0}
a{color:#0366d6}
@media(prefers-color-scheme:dark){
  body{color:#e0e0e0;background:#1a1a1a}
  h1,h2,h3,h4{color:#fff}
  h1{border-bottom-color:#333}
  pre,code{background:#2d2d2d}
  blockquote{color:#aaa;background:#252525;border-left-color:#555}
  a{color:#58a6ff}
  hr{border-top-color:#333}
}
</style>
</head>
<body>
<article>
<h1>${escapeHtml(title)}</h1>
${body}
</article>
</body>
</html>`;
}

function processFile(filePath, outputDir, format) {
  const md = fs.readFileSync(filePath, 'utf-8');
  const baseName = path.basename(filePath, '.md');
  const title = extractTitle(md, filePath);
  const mdBody = md.trimStart().startsWith('# ') ? md.replace(/^#\s+.*\n?/, '') : md;

  if (format === 'txt' || format === 'both') {
    const txtPath = path.join(outputDir, baseName + '.txt');
    fs.writeFileSync(txtPath, md, 'utf-8');
    console.log(`  TXT  \u2192 ${txtPath}`);
  }

  if (format === 'html' || format === 'both') {
    const body = mdToHtml(mdBody);
    const html = htmlTemplate(title, body);
    const htmlPath = path.join(outputDir, baseName + '.html');
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`  HTML \u2192 ${htmlPath}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let inputPath = args.input;
  if (!inputPath) {
    inputPath = await promptUser('Enter file or directory path: ');
  }

  inputPath = path.resolve(inputPath);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: "${inputPath}" does not exist.`);
    process.exit(1);
  }

  const outputDir = args.output ? path.resolve(args.output) : path.resolve('output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const stats = fs.statSync(inputPath);

  if (stats.isFile()) {
    if (!inputPath.endsWith('.md')) {
      console.error('Error: Input file must be a .md file.');
      process.exit(1);
    }
    console.log(`Exporting: ${inputPath}`);
    processFile(inputPath, outputDir, args.format);
  } else if (stats.isDirectory()) {
    const files = findMdFiles(inputPath);
    if (files.length === 0) {
      console.error(`Error: No .md files found in "${inputPath}".`);
      process.exit(1);
    }
    console.log(`Found ${files.length} .md file(s) in: ${inputPath}`);
    files.forEach(f => processFile(f.fullPath, outputDir, args.format));
  }

  console.log('Done.');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
