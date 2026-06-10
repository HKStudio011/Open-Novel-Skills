const fs = require('fs');
const path = require('path');
const { loadState, saveState, findProjectDir } = require('../utils/state.js');

const CHAPTER_NUM_RE = /(\d+)/;
const APPROVED_DIR = 'approved';
const OUTPUT_DIR = 'output';
const FULL_STORY_FILE = 'full_story.md';
const FINAL_SCRIPT_FILE = 'final_script.md';

function parseArgs(args) {
  let from = null;
  let to = null;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--from' || args[i] === '-f') && i + 1 < args.length) {
      from = parseInt(args[++i], 10);
    }
    if ((args[i] === '--to' || args[i] === '-t') && i + 1 < args.length) {
      to = parseInt(args[++i], 10);
    }
  }

  return { from, to };
}

function extractChapterNumber(filename) {
  const match = filename.match(CHAPTER_NUM_RE);
  return match ? parseInt(match[1], 10) : null;
}

function processContent(filename, content) {
  const trimmed = content.trim();
  const num = extractChapterNumber(filename);
  if (!trimmed.startsWith('#')) {
    const heading = num ? `# Chương ${num}` : `# ${path.basename(filename, '.md')}`;
    return `${heading}\n\n${trimmed}\n`;
  }
  return trimmed + '\n';
}

function exportOutput(args) {
  const projectDir = findProjectDir();

  if (!projectDir) {
    console.log('Not inside an OpenNovel project.');
    console.log('Run "opennovel init <project-name>" first.');
    process.exit(1);
  }

  const approvedDir = path.join(projectDir, APPROVED_DIR);

  if (!fs.existsSync(approvedDir)) {
    console.log('Error: approved/ directory not found.');
    process.exit(1);
  }

  let files = fs.readdirSync(approvedDir)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep')
    .map(f => ({
      name: f,
      num: extractChapterNumber(f),
      fullPath: path.join(approvedDir, f),
    }));

  if (files.length === 0) {
    console.log('No approved chapters found in approved/.');
    console.log('Approve chapters first by saving them as .md files in approved/.');
    process.exit(1);
  }

  files.sort((a, b) => {
    if (a.num !== null && b.num !== null) return a.num - b.num;
    if (a.num !== null) return -1;
    if (b.num !== null) return 1;
    return a.name.localeCompare(b.name);
  });

  const { from, to } = parseArgs(args);

  if (from !== null || to !== null) {
    files = files.filter(f => {
      if (f.num === null) return true;
      if (from !== null && f.num < from) return false;
      if (to !== null && f.num > to) return false;
      return true;
    });
  }

  const state = loadState(projectDir);
  const projectName = state ? state.projectName : path.basename(projectDir);

  const outputDir = path.join(projectDir, OUTPUT_DIR);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let fullStoryParts = [];
  let scriptParts = [];

  for (const file of files) {
    const content = fs.readFileSync(file.fullPath, 'utf-8');
    const processed = processContent(file.name, content);
    fullStoryParts.push(processed);
    scriptParts.push(content.trim());
  }

  const fullStoryPath = path.join(outputDir, FULL_STORY_FILE);
  const finalScriptPath = path.join(outputDir, FINAL_SCRIPT_FILE);

  fs.writeFileSync(fullStoryPath, fullStoryParts.join('\n'), 'utf-8');
  fs.writeFileSync(finalScriptPath, scriptParts.join('\n\n'), 'utf-8');

  const rangeInfo = [];
  if (from !== null) rangeInfo.push(`from chapter ${from}`);
  if (to !== null) rangeInfo.push(`to chapter ${to}`);
  const rangeStr = rangeInfo.length > 0 ? ` (${rangeInfo.join(' ')})` : '';

  console.log(`Exported ${files.length} chapter(s)${rangeStr}:`);
  console.log(`  ${FULL_STORY_FILE}  → ${fullStoryPath}`);
  console.log(`  ${FINAL_SCRIPT_FILE} → ${finalScriptPath}`);

  if (state) {
    state.modules.output = 'done';
    saveState(projectDir, state);
    console.log('State updated: output → done');
  }
}

module.exports = exportOutput;
