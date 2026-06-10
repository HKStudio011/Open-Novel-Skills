const fs = require('fs');
const path = require('path');
const { MODULES, initState } = require('../utils/state.js');
const { getFileTree } = require('../templates/project.js');

function init(args) {
  const projectName = args[0];

  if (!projectName) {
    console.error('Usage: opennovel init <project-name>');
    process.exit(1);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
    console.error('Error: Project name can only contain letters, numbers, hyphens, and underscores.');
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory "${targetDir}" already exists.`);
    process.exit(1);
  }

  console.log(`Creating OpenNovel project: ${projectName}`);
  console.log(`Location: ${targetDir}`);
  console.log('');

  const tree = getFileTree(projectName);

  for (const entry of tree) {
    if (entry.dir) {
      const fullDir = path.join(targetDir, entry.dir);
      fs.mkdirSync(fullDir, { recursive: true });
      console.log(`  \uD83D\uDCC1 Created: ${entry.dir}/`);
    } else if (entry.file) {
      const fullPath = path.join(targetDir, entry.file);
      const parentDir = path.dirname(fullPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(fullPath, entry.content, 'utf-8');
      console.log(`  \uD83D\uDCC4 Created: ${entry.file}`);
    }
  }

  // Init state
  initState(projectName, targetDir);
  console.log('');
  console.log(`\u2705 Project "${projectName}" initialized successfully!`);
  console.log('');
  console.log('Next steps:');
  console.log(`  cd ${projectName}`);
  console.log('  opennovel next');
  console.log('  opennovel status');

  // Print quick reference
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
  console.log('  opennovel skills list');
  console.log('  opennovel skills install --target codex --scope project');
  console.log('  opennovel skills install --target claude --scope project');
}

module.exports = init;
