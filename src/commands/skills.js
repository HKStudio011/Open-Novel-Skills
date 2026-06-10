const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.resolve(__dirname, '..', '..', 'skills');

const TARGET_DIRS = {
  'codex': {
    project: '.agents/skills',
    user: '.agents/skills',
  },
  'claude': {
    project: '.claude/skills',
    user: '~/.claude/skills',
  },
};

function listSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('No skills directory found at:', SKILLS_DIR);
    process.exit(1);
  }

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skills = entries
    .filter(e => e.isDirectory())
    .map(dir => {
      const skillPath = path.join(SKILLS_DIR, dir.name, 'SKILL.md');
      if (!fs.existsSync(skillPath)) return null;
      const content = fs.readFileSync(skillPath, 'utf-8');
      const nameMatch = content.match(/^name:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*(.+)$/m);
      const catMatch = content.match(/^\s+category:\s*(.+)$/m);
      return {
        folder: dir.name,
        name: nameMatch ? nameMatch[1].trim() : dir.name,
        description: descMatch ? descMatch[1].trim() : '(no description)',
        category: catMatch ? catMatch[1].trim() : 'uncategorized',
      };
    })
    .filter(Boolean);

  if (skills.length === 0) {
    console.log('No skills found.');
    return;
  }

  console.log(`Available OpenNovel skills (${skills.length}):`);
  console.log('');

  const byCategory = {};
  for (const s of skills) {
    (byCategory[s.category] || (byCategory[s.category] = [])).push(s);
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    console.log(`  [${cat}]`);
    for (const s of items) {
      console.log(`    ${s.folder}`);
      console.log(`      ${s.description}`);
    }
    console.log('');
  }
}

function copyOrLinkSkill(srcDir, destDir, useLink) {
  const destParent = path.dirname(destDir);
  if (!fs.existsSync(destParent)) {
    fs.mkdirSync(destParent, { recursive: true });
  }

  if (fs.existsSync(destDir)) {
    console.log(`    Skipped (already exists): ${destDir}`);
    return;
  }

  if (useLink) {
    const relSrc = path.relative(destParent, srcDir);
    try {
      fs.symlinkSync(relSrc, destDir, 'junction');
      console.log(`    Linked: ${destDir} -> ${relSrc}`);
    } catch (err) {
      console.error(`    Failed to create symlink: ${err.message}`);
      console.log('    Falling back to copy...');
      fs.cpSync(srcDir, destDir, { recursive: true });
      console.log(`    Copied: ${destDir}`);
    }
  } else {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`    Copied: ${destDir}`);
  }
}

function installSkills(args) {
  const targetIndex = args.indexOf('--target');
  const scopeIndex = args.indexOf('--scope');
  const useLink = args.includes('--link');

  if (targetIndex === -1 || scopeIndex === -1) {
    console.error('Usage: opennovel skills install --target codex|claude --scope project|user [--link]');
    console.error('');
    console.error('  --target   Agent type: codex or claude');
    console.error('  --scope    Install scope: project (in-project) or user (global)');
    console.error('  --link     Create symlinks instead of copying (developer mode)');
    process.exit(1);
  }

  const target = args[targetIndex + 1];
  const scope = args[scopeIndex + 1];

  if (!['codex', 'claude'].includes(target)) {
    console.error(`Invalid target: "${target}". Use "codex" or "claude".`);
    process.exit(1);
  }

  if (!['project', 'user'].includes(scope)) {
    console.error(`Invalid scope: "${scope}". Use "project" or "user".`);
    process.exit(1);
  }

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('No skills directory found at:', SKILLS_DIR);
    process.exit(1);
  }

  const projectDir = (scope === 'project') ? findProjectDir() : null;

  if (scope === 'project' && !projectDir) {
    console.error('Not inside an OpenNovel project. Run from a project directory or use --scope user.');
    process.exit(1);
  }

  const baseDir = (scope === 'project')
    ? path.join(projectDir, TARGET_DIRS[target][scope])
    : path.resolve(TARGET_DIRS[target][scope].replace(/^~/, process.env.HOME || process.env.USERPROFILE));

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skillDirs = entries.filter(e => e.isDirectory() && fs.existsSync(path.join(SKILLS_DIR, e.name, 'SKILL.md')));

  if (skillDirs.length === 0) {
    console.log('No skills with SKILL.md found.');
    return;
  }

  console.log(`Installing ${skillDirs.length} OpenNovel skill(s) to ${baseDir} ...`);
  console.log('');

  for (const dir of skillDirs) {
    const src = path.join(SKILLS_DIR, dir.name);
    const dest = path.join(baseDir, dir.name);
    copyOrLinkSkill(src, dest, useLink);
  }

  console.log('');
  console.log('Done. Skills are now available to your coding agent.');
}

function findProjectDir() {
  let current = process.cwd();
  while (true) {
    if (fs.existsSync(path.join(current, '.opennovel', 'state.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function skills(args) {
  const subcommand = args[0];

  if (!subcommand || subcommand === '--help' || subcommand === '-h') {
    console.log('OpenNovel Skills Manager');
    console.log('');
    console.log('Usage:');
    console.log('  opennovel skills list');
    console.log('  opennovel skills install --target codex|claude --scope project|user [--link]');
    console.log('');
    console.log('Targets:');
    console.log('  codex     Codex CLI (.agents/skills/)');
    console.log('  claude    Claude Code (.claude/skills/)');
    console.log('');
    console.log('Scopes:');
    console.log('  project   Install in current project only');
    console.log('  user      Install globally for the user');
    return;
  }

  if (subcommand === 'list') {
    listSkills();
  } else if (subcommand === 'install') {
    installSkills(args.slice(1));
  } else {
    console.error(`Unknown subcommand: "${subcommand}"`);
    console.error('Run "opennovel skills --help" for usage.');
    process.exit(1);
  }
}

module.exports = skills;
