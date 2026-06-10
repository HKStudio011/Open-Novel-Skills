const init = require('./commands/init.js');
const skills = require('./commands/skills.js');

const COMMANDS = {
  init:   { fn: init,   desc: 'Scaffold a new novel project directory' },
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
    console.log('Writing workflow is managed by the opennovel-writing-assistant skill.');
    console.log('');
    console.log('Examples:');
    console.log('  opennovel init my-story');
    console.log('  opennovel skills list');
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
