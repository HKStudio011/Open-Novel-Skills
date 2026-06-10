const { MODULES, loadState, findProjectDir } = require('../utils/state.js');

function status() {
  const projectDir = findProjectDir();

  if (!projectDir) {
    console.log('Not inside an OpenNovel project.');
    console.log('Run "opennovel init <project-name>" first.');
    process.exit(1);
  }

  const state = loadState(projectDir);
  if (!state) {
    console.log('Error: Corrupted state file.');
    process.exit(1);
  }

  const projectName = state.projectName;
  console.log(`Project: ${projectName}`);
  console.log(`Path: ${projectDir}`);
  console.log(`Created: ${state.createdAt.slice(0, 10)}`);
  console.log('');

  const STATUS_ICONS = {
    pending: '\u2B1C',
    in_progress: '\uD83D\uDD04',
    done: '\u2705',
  };

  let completed = 0;
  let inProgress = 0;
  let pending = 0;

  for (const mod of MODULES) {
    const s = state.modules[mod.id] || 'pending';
    const icon = STATUS_ICONS[s] || '\u2B1C';
    const label = `${mod.label}`;

    console.log(`  ${icon} ${label.padEnd(20)} ${mod.name} [${s}]`);

    if (s === 'done') completed++;
    else if (s === 'in_progress') inProgress++;
    else pending++;
  }

  console.log('');
  console.log(`Progress: ${completed}/${MODULES.length} modules completed`);
  if (inProgress > 0) console.log(`In progress: ${inProgress}`);
  if (pending > 0) console.log(`Remaining: ${pending}`);
}

module.exports = status;
