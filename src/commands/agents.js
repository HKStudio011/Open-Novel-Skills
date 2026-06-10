const fs = require('fs');
const path = require('path');
const { findProjectDir, loadState } = require('../utils/state.js');
const { agentsMdTemplate } = require('../templates/project.js');

const START_MARKER = '<!-- OPENNOVEL_START -->';
const END_MARKER = '<!-- OPENNOVEL_END -->';

function agents() {
  const projectDir = findProjectDir();

  if (!projectDir) {
    console.log('Not inside an OpenNovel project.');
    console.log('Run "opennovel init <project-name>" first.');
    process.exit(1);
  }

  const state = loadState(projectDir);
  const projectName = state ? state.projectName : path.basename(projectDir);

  const agentsPath = path.join(projectDir, 'AGENTS.md');
  const template = agentsMdTemplate;

  if (!fs.existsSync(agentsPath)) {
    // Create new file
    fs.writeFileSync(agentsPath, template, 'utf-8');
    console.log(`Created AGENTS.md with OpenNovel section.`);
    return;
  }

  const content = fs.readFileSync(agentsPath, 'utf-8');
  const startIdx = content.indexOf(START_MARKER);
  const endIdx = content.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    // No existing OpenNovel section — append
    const separator = content.endsWith('\n') ? '\n' : '\n\n';
    fs.writeFileSync(agentsPath, content + separator + template, 'utf-8');
    console.log(`Appended OpenNovel section to existing AGENTS.md.`);
  } else {
    // Replace existing section
    const before = content.slice(0, startIdx);
    const after = content.slice(endIdx + END_MARKER.length);
    fs.writeFileSync(agentsPath, before + template + after, 'utf-8');
    console.log(`Updated OpenNovel section in existing AGENTS.md.`);
  }
}

module.exports = agents;
