const fs = require('fs');
const path = require('path');

const STATE_FILENAME = '.opennovel/state.json';

function statePath(projectDir) {
  return path.join(projectDir, STATE_FILENAME);
}

function initState(projectName, projectDir) {
  const sp = statePath(projectDir);
  const dir = path.dirname(sp);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const state = {
    projectName,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(sp, JSON.stringify(state, null, 2), 'utf-8');
  return state;
}

module.exports = { initState };
