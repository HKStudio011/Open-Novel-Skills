const { MODULES, loadState, findProjectDir } = require('../utils/state.js');

const WORKFLOW_GUIDE = {
  'project': {
    message: 'Define your project metadata',
    detail: 'Open project.md and fill in: genre, tone, POV, premise, logline, themes, conflict, stakes, ending type.',
    hint: 'Start with a strong logline — it guides every decision afterward.',
  },
  'bible': {
    message: 'Build your story bible',
    detail: 'Open bible.md and fill in characters, world, rules, secrets, logic. Start with the protagonist, then antagonist, then supporting cast.',
    hint: 'Give each character a secret, a fear, and a goal that conflicts with others.',
  },
  'outline': {
    message: 'Plan the plot and outline chapters',
    detail: 'Open outline.md and map: main plot, subplots, timeline, 10 turning points, chapter list, chapter briefs.',
    hint: 'Each chapter needs: goal, characters, events, reveals, emotional arc, hook.',
  },
  'content': {
    message: 'Start writing chapters',
    detail: 'Use opennovel-chapter-writer skill to write chapters. Save outputs to content/chapter_001.md, etc.',
    hint: 'Always check bible.md and continuity.md before writing to stay consistent.',
  },
  'continuity': {
    message: 'Update continuity after each chapter',
    detail: 'After each approved chapter, update continuity.md with what changed: character status, revealed info, hooks for next chapter.',
    hint: 'This prevents AI from forgetting — critical for long stories.',
  },
  'output': {
    message: 'Export final output',
    detail: 'Compile content/ into output formats. Use opennovel-exporter skill or run opennovel export.',
    hint: 'Consider converting to TXT, HTML, DOCX, or PDF.',
  },
};

function next() {
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

  // Find first non-done module
  let currentModule = null;
  for (const mod of MODULES) {
    const s = state.modules[mod.id] || 'pending';
    if (s === 'in_progress' || s === 'pending') {
      currentModule = mod;
      break;
    }
  }

  if (!currentModule) {
    console.log('\uD83C\uDF89 All modules completed! Ready for final output.');
    console.log('Run: opennovel status');
    return;
  }

  const guide = WORKFLOW_GUIDE[currentModule.id];
  if (!guide) {
    console.log(`Next step: ${currentModule.name} (${currentModule.label}/)`);
    return;
  }

  console.log(`=== Next Step: ${guide.message} ===`);
  console.log('');
  console.log(guide.detail);
  console.log('');
  console.log(`\uD83D\uDCA1 Tip: ${guide.hint}`);
  console.log('');

  const inProgress = MODULES.find(m => state.modules[m.id] === 'in_progress');
  if (inProgress) {
    console.log(`Note: "${inProgress.name}" is marked as in_progress \u2014 you may want to complete it first.`);
  }
}

module.exports = next;
