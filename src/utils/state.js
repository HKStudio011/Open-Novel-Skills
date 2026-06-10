const fs = require('fs');
const path = require('path');

const STATE_FILENAME = '.opennovel/state.json';

const MODULES = [
  { id: 'project',    name: 'Project Setup',     label: 'project' },
  { id: 'bible',      name: 'Story Bible',       label: 'bible' },
  { id: 'outline',    name: 'Plot & Outline',    label: 'outline' },
  { id: 'content',    name: 'Chapter Writing',   label: 'content' },
  { id: 'continuity', name: 'Continuity',        label: 'continuity' },
  { id: 'output',     name: 'Final Output',      label: 'output' },
];

const DEFAULT_STATE = {
  projectName: '',
  createdAt: '',
  modules: {},
};

function defaultModuleState() {
  const m = {};
  for (const mod of MODULES) {
    m[mod.id] = 'pending';
  }
  return m;
}

function statePath(projectDir) {
  return path.join(projectDir, STATE_FILENAME);
}

function loadState(projectDir) {
  const sp = statePath(projectDir);
  try {
    const raw = fs.readFileSync(sp, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(projectDir, state) {
  const sp = statePath(projectDir);
  const dir = path.dirname(sp);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(sp, JSON.stringify(state, null, 2), 'utf-8');
}

function initState(projectName, projectDir) {
  const state = {
    projectName,
    createdAt: new Date().toISOString(),
    modules: defaultModuleState(),
  };
  saveState(projectDir, state);
  return state;
}

function findProjectDir(startDir) {
  let current = path.resolve(startDir || process.cwd());
  while (true) {
    const sp = statePath(current);
    if (fs.existsSync(sp)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

module.exports = { MODULES, loadState, saveState, initState, findProjectDir };
