const fs = require('fs');
const path = require('path');

const STATE_FILENAME = '.opennovel/state.json';

const MODULES = [
  { id: 'core',       name: 'Story Core',        label: 'core' },
  { id: 'characters', name: 'Characters',        label: 'characters' },
  { id: 'world',      name: 'World',             label: 'world' },
  { id: 'logic',      name: 'Logic System',      label: 'logic' },
  { id: 'plot',       name: 'Plot Architecture', label: 'plot' },
  { id: 'chapters',   name: 'Chapters',          label: 'chapters' },
  { id: 'writing',    name: 'Writing Pipeline',  label: 'writing' },
  { id: 'approved',   name: 'Approved Chapters', label: 'approved' },
  { id: 'continuity', name: 'Continuity Memory', label: 'continuity' },
  { id: 'editing',    name: 'Final Editing',     label: 'editing' },
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
