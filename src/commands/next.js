const { MODULES, loadState, findProjectDir } = require('../utils/state.js');

const WORKFLOW_GUIDE = {
  'core': {
    message: 'Define your Story Core',
    detail: 'Open core/story_core.md and fill in: premise, logline, theme, conflict, stakes, tone, ending type.',
    hint: 'Ask AI to help you refine the logline if stuck.',
  },
  'characters': {
    message: 'Build your characters',
    detail: 'Create character profiles in characters/. Start with the protagonist, then antagonist, then supporting cast.',
    hint: 'Give each character a secret, a fear, and a goal that conflicts with others.',
  },
  'world': {
    message: 'Create your world',
    detail: 'Fill in world overview, locations, history, culture, and atmosphere in world/.',
    hint: 'Focus on how the world shapes the characters and conflict.',
  },
  'logic': {
    message: 'Set your logic system',
    detail: 'Define world rules, power system, secrets timeline, cause-effect chains, and common logic pitfalls in logic/.',
    hint: 'Mark which secrets are revealed in which chapter to avoid accidental early reveals.',
  },
  'plot': {
    message: 'Plan the plot architecture',
    detail: 'Outline main plot, subplots, timeline, turning points, and climax in plot/.',
    hint: 'Use the 10 turning points framework: Opening \u2192 Inciting Incident \u2192 ... \u2192 Climax \u2192 Resolution.',
  },
  'chapters': {
    message: 'Outline chapters',
    detail: 'List all chapters in chapters/chapter_list.md. Create briefs for the first few chapters.',
    hint: 'Each chapter needs: goal, characters, events, reveals, emotional arc, hook.',
  },
  'writing': {
    message: 'Start AI writing pipeline',
    detail: 'Use prompts in writing/writing_prompts.md to guide AI chapter writing. Save outputs to writing/ai_outputs/.',
    hint: 'Always provide the Chapter Brief, Scene Breakdown, and relevant Character profiles before writing.',
  },
  'approved': {
    message: 'Review and approve chapters',
    detail: 'After AI writes a chapter, review it. Move approved chapters to approved/.',
    hint: 'Check: logic \u2192 character \u2192 plot \u2192 pacing \u2192 emotion \u2192 prose, in that order.',
  },
  'continuity': {
    message: 'Update continuity memory',
    detail: 'After each approved chapter, update continuity/ with what changed.',
    hint: 'This prevents AI from forgetting \u2014 critical for long stories.',
  },
  'editing': {
    message: 'Final edit',
    detail: 'Edit the full story: structure, prose, dialogue, consistency. Use editing/.',
    hint: 'Read the entire story in one sitting before editing.',
  },
  'output': {
    message: 'Export final output',
    detail: 'Compile the final story into output/full_story.md and export to desired format.',
    hint: 'Consider converting to PDF, EPUB, or script format.',
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
