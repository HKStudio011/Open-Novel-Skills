const init = require('./commands/init.js');
const status = require('./commands/status.js');
const next = require('./commands/next.js');
const exp = require('./commands/export.js');
const skills = require('./commands/skills.js');

const COMMANDS = {
  init:   { fn: init,   desc: 'Scaffold a new novel project directory' },
  status: { fn: status, desc: 'Show writing progress for current project' },
  next:   { fn: next,   desc: 'Suggest the next step in the writing workflow' },
  export: { fn: exp,    desc: 'Compile chapters from content/ into output/full_story.md' },
  skills: { fn: skills, desc: 'List or install OpenNovel skills for your AI agent' },
};

function run(argv) {
  const commandName = argv[0];
  const subargs = argv.slice(1);

  if (!commandName || commandName === '--help' || commandName === '-h') {
    console.log('OpenNovel Framework — AI-assisted novel writing');
    console.log('');
    console.log('Usage: opennovel <command> [options]');
    console.log('');
    console.log('Commands:');
    for (const [name, cmd] of Object.entries(COMMANDS)) {
      console.log(`  ${name.padEnd(10)} ${cmd.desc}`);
    }
    console.log('');
    console.log('Examples:');
    console.log('  opennovel init my-story');
    console.log('  opennovel status');
    console.log('  opennovel next');
    return;
  }

  const cmd = COMMANDS[commandName];
  if (!cmd) {
    console.error(`Unknown command: "${commandName}"`);
    console.error(`Run "opennovel --help" for available commands.`);
    process.exit(1);
  }

  cmd.fn(subargs);
}

module.exports = { run };
