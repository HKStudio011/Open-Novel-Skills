const fs = require('fs');
const path = require('path');
const { initState } = require('../utils/state.js');
const { getFileTree } = require('../templates/project.js');

function init(args) {
  const projectName = args[0];

  if (!projectName) {
    console.error('Usage: opennovel init <project-name>');
    process.exit(1);
  }

  const trimmed = projectName.trim();

  if (!trimmed) {
    console.error('Error: Project name cannot be empty.');
    process.exit(1);
  }

  if (!/^[\p{L}\p{N}_ -]+$/u.test(trimmed)) {
    console.error('Error: Project name can only contain letters, numbers, hyphens, underscores, and spaces.');
    process.exit(1);
  }

  const safeName = trimmed.replace(/\s+/g, '-');
  const targetDir = path.resolve(process.cwd(), safeName);

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

  initState(projectName, targetDir);

  const skillsDir = path.resolve(__dirname, '..', '..', 'skills');
  const projectSkillsDir = path.join(targetDir, '.agents', 'skills');

  if (fs.existsSync(skillsDir)) {
    console.log('');
    console.log('  Installing OpenNovel skills...');
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    const skillDirs = entries.filter(e =>
      e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, 'SKILL.md'))
    );
    for (const dir of skillDirs) {
      if (dir.name === 'opennovel-project-init') continue;
      const src = path.join(skillsDir, dir.name);
      const dest = path.join(projectSkillsDir, dir.name);
      if (!fs.existsSync(dest)) {
        fs.cpSync(src, dest, { recursive: true });
        console.log(`    \u2728 Installed: ${dir.name}`);
      } else {
        console.log(`    Skipped (exists): ${dir.name}`);
      }
    }
  }

  console.log('');
  console.log(`\u2705 Project "${projectName}" initialized successfully!`);
  console.log('');
  console.log('Next step: load opennovel-writing-assistant skill to start writing.');
  console.log('');
  console.log('\u2500'.repeat(40));
  console.log('OpenNovel Workflow:');
  console.log('1. Init project         - project.md');
  console.log('2. Build story bible    - bible.md');
  console.log('3. Plan plot & outline  - outline.md');
  console.log('4. Write chapters       - content/ (via opennovel-writing-assistant)');
  console.log('5. Review chapters      - opennovel-review (diagnosis before finalize)');
  console.log('6. Track continuity     - continuity.md');
  console.log('7. Export final         - output/');
  console.log('');
  console.log('Skills installed at .agents/skills/ \u2014 ready for your AI coding assistant.');
}

module.exports = init;
