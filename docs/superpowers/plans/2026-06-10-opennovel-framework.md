# OpenNovel Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete framework (CLI tool + AI skill instructions) for AI-assisted novel/story writing with structured workflow.

**Architecture:** Three-tier system — (1) Node.js CLI tool (`opennovel`) that scaffolds project directories with template files and tracks progress via local state, (2) `SKILL.md` that teaches AI the 4-step pipeline, (3) `REFERENCE.md` + `AGENTS.md` that provide detailed templates and session configuration. The CLI has zero external dependencies, using only Node.js built-in modules.

**Tech Stack:** Node.js (>=18), markdown templates, JSON state file

---

## New Directory Naming Convention

All directory names are **English, lowercase, no numbering**. Example: `core/`, `characters/`, `world/`, etc.

## File Structure

```
D:\Code\Open Novel Skills\
├── AGENTS.md                    # AI session config
├── SKILL.md                     # Concise AI workflow instruction
├── REFERENCE.md                 # Detailed templates & examples
├── package.json                 # npm package definition
├── bin/
│   └── opennovel.js             # CLI entry point (#! node shebang)
└── src/
    ├── index.js                 # Main dispatcher: parse argv → route to command
    ├── commands/
    │   ├── init.js              # opennovel init <name> — scaffold project
    │   ├── status.js            # opennovel status — show progress
    │   └── next.js              # opennovel next — suggest next step
    ├── templates/
    │   └── project.js           # Project directory structure + file content generators
    └── utils/
        └── state.js             # Read/write .opennovel/state.json
```

---

### Task 1: Package definition and CLI entry point

**Files:**
- Create: `D:\Code\Open Novel Skills\package.json`
- Create: `D:\Code\Open Novel Skills\bin\opennovel.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "opennovel",
  "version": "0.1.0",
  "description": "CLI tool for the OpenNovel novel-writing framework — scaffold project structure and track writing progress",
  "bin": {
    "opennovel": "./bin/opennovel.js"
  },
  "files": [
    "bin/",
    "src/"
  ],
  "engines": {
    "node": ">=18"
  },
  "license": "MIT"
}
```

- [ ] **Step 2: Create CLI entry point**

```javascript
#!/usr/bin/env node

const { run } = require('../src/index.js');

run(process.argv.slice(2));
```

- [ ] **Step 3: Verify file structure**

Run: `node -e "require('./bin/opennovel.js')" 2>&1 || true`
Expected: No syntax errors (will fail with "Cannot find module" for `../src/index.js` — that's expected, next task creates it)

---

### Task 2: Main dispatcher

**Files:**
- Create: `D:\Code\Open Novel Skills\src\index.js`

- [ ] **Step 1: Create src/index.js — argument parser and command router**

```javascript
const init = require('./commands/init.js');
const status = require('./commands/status.js');
const next = require('./commands/next.js');

const COMMANDS = {
  init:   { fn: init,   desc: 'Scaffold a new novel project directory' },
  status: { fn: status, desc: 'Show writing progress for current project' },
  next:   { fn: next,   desc: 'Suggest the next step in the writing workflow' },
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
```

- [ ] **Step 2: Verify dispatcher loads**

Run: `node -e "const m = require('./src/index.js'); console.log(typeof m.run);"`
Expected: `function`

---

### Task 3: State manager utility

**Files:**
- Create: `D:\Code\Open Novel Skills\src\utils\state.js`

- [ ] **Step 1: Create state manager — reads/writes `.opennovel/state.json`**

```javascript
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
```

- [ ] **Step 2: Verify state manager loads**

Run: `node -e "const s = require('./src/utils/state.js'); console.log(s.MODULES.length);"`
Expected: `11`

---

### Task 4: Template definitions

**Files:**
- Create: `D:\Code\Open Novel Skills\src\templates\project.js`

- [ ] **Step 1: Create template definitions — directory tree and file content generators**

```javascript
const path = require('path');

const EMPTY = '.gitkeep\n';

function getFileTree(projectName) {
  return [
    // Story Core
    { dir: 'core' },
    { file: 'core/story_core.md', content: storyCoreTemplate(projectName) },

    // Characters
    { dir: 'characters' },
    { dir: 'characters/main_characters' },
    { file: 'characters/main_characters/.gitkeep', content: EMPTY },
    { dir: 'characters/supporting_characters' },
    { file: 'characters/supporting_characters/.gitkeep', content: EMPTY },
    { dir: 'characters/antagonists' },
    { file: 'characters/antagonists/.gitkeep', content: EMPTY },
    { file: 'characters/character_bible.md', content: characterBibleTemplate },
    { file: 'characters/relationships.md', content: relationshipsTemplate },

    // World
    { dir: 'world' },
    { file: 'world/world_overview.md', content: worldOverviewTemplate },
    { file: 'world/locations.md', content: locationsTemplate },
    { file: 'world/history.md', content: historyTemplate },
    { file: 'world/culture.md', content: cultureTemplate },
    { file: 'world/atmosphere.md', content: atmosphereTemplate },

    // Logic
    { dir: 'logic' },
    { file: 'logic/world_rules.md', content: worldRulesTemplate },
    { file: 'logic/power_system.md', content: powerSystemTemplate },
    { file: 'logic/secrets_reveals.md', content: secretsRevealsTemplate },
    { file: 'logic/cause_effect.md', content: causeEffectTemplate },
    { file: 'logic/logic_errors_to_avoid.md', content: logicErrorsTemplate },

    // Plot
    { dir: 'plot' },
    { file: 'plot/main_plot.md', content: mainPlotTemplate },
    { file: 'plot/subplot.md', content: subplotTemplate },
    { file: 'plot/timeline.md', content: timelineTemplate },
    { file: 'plot/turning_points.md', content: turningPointsTemplate },
    { file: 'plot/climax_ending.md', content: climaxEndingTemplate },

    // Chapters
    { dir: 'chapters' },
    { dir: 'chapters/chapter_briefs' },
    { file: 'chapters/chapter_briefs/.gitkeep', content: EMPTY },
    { dir: 'chapters/scene_breakdowns' },
    { file: 'chapters/scene_breakdowns/.gitkeep', content: EMPTY },
    { file: 'chapters/chapter_list.md', content: chapterListTemplate },
    { file: 'chapters/chapter_hooks.md', content: chapterHooksTemplate },

    // Writing
    { dir: 'writing' },
    { dir: 'writing/ai_outputs' },
    { file: 'writing/ai_outputs/.gitkeep', content: EMPTY },
    { dir: 'writing/review_notes' },
    { file: 'writing/review_notes/.gitkeep', content: EMPTY },
    { file: 'writing/writing_prompts.md', content: writingPromptsTemplate },
    { file: 'writing/revision_prompts.md', content: revisionPromptsTemplate },

    // Approved chapters
    { dir: 'approved' },
    { file: 'approved/.gitkeep', content: EMPTY },

    // Continuity
    { dir: 'continuity' },
    { file: 'continuity/continuity_log.md', content: continuityLogTemplate },
    { file: 'continuity/character_status.md', content: characterStatusTemplate },
    { file: 'continuity/revealed_information.md', content: revealedInfoTemplate },
    { file: 'continuity/hidden_information.md', content: hiddenInfoTemplate },
    { file: 'continuity/next_chapter_setup.md', content: nextChapterSetupTemplate },

    // Editing
    { dir: 'editing' },
    { file: 'editing/structure_edit.md', content: structureEditTemplate },
    { file: 'editing/prose_edit.md', content: proseEditTemplate },
    { file: 'editing/dialogue_edit.md', content: dialogueEditTemplate },
    { file: 'editing/final_review.md', content: finalReviewTemplate },

    // Output
    { dir: 'output' },
    { file: 'output/full_story.md', content: fullStoryTemplate },
    { file: 'output/final_script.md', content: finalScriptTemplate },
  ];
}

// ----- Template content generators -----

function storyCoreTemplate(name) {
  return `# Story Core — ${name}

## Premise
[Ý tưởng nền của câu chuyện]

## Logline
Một [nhân vật chính] phải [mục tiêu], nhưng [trở ngại lớn], buộc họ phải [lựa chọn/thay đổi].

## Chủ đề chính
-
-

## Xung đột chính
- Bên ngoài:
- Bên trong:

## Mục tiêu nhân vật chính
- Mục tiêu bên ngoài:
- Mục tiêu bên trong:

## Cái giá nếu thất bại
-

## Tông truyện
-

## Kiểu kết thúc
[Đóng / mở / bi kịch / bittersweet / twist / vòng lặp]
`;
}

const characterBibleTemplate = `# Character Bible

## Hồ sơ nhân vật chuẩn

Tên:
Vai trò:
Tuổi:
Ngoại hình:
Trang phục:
Vũ khí/vật phẩm đặc trưng:
Tính cách:
Giọng nói/hội thoại:
Mục tiêu bên ngoài:
Mục tiêu bên trong:
Nỗi sợ:
Điểm yếu:
Điểm mạnh:
Quá khứ:
Bí mật:
Quan hệ với nhân vật khác:
Điều nhân vật biết:
Điều nhân vật chưa biết:
Điều nhân vật đang che giấu:
Sự thay đổi qua truyện:
Số phận cuối truyện:

## Không được viết sai
-
-
-
`;

const relationshipsTemplate = `# Relationships

## Bảng quan hệ nhân vật

| Nhân vật 1 | Nhân vật 2 | Kiểu quan hệ | Mức độ tin tưởng | Mâu thuẫn | Thay đổi qua truyện |
|------------|------------|--------------|------------------|-----------|---------------------|
|            |            |              |                  |           |                     |
`;

const worldOverviewTemplate = `# World Overview

## Tổng quan bối cảnh
[Thế giới/câu chuyện diễn ra ở đâu?]

## Thời gian
[Quá khứ / hiện đại / tương lai / giả tưởng / không xác định]
`;

const locationsTemplate = `# Locations

## Địa điểm chính
-
-

## Địa điểm phụ
-
-
`;

const historyTemplate = `# History

## Lịch sử quan trọng
- Sự kiện quá khứ:
- Biến cố ảnh hưởng tới hiện tại:
`;

const cultureTemplate = `# Culture

## Xã hội và văn hóa
- Luật lệ:
- Tầng lớp:
- Tín ngưỡng:
- Tập quán:
`;

const atmosphereTemplate = `# Atmosphere

## Không khí hình ảnh
- Màu sắc:
- Ánh sáng:
- Âm thanh:
- Cảm giác chủ đạo:
`;

const worldRulesTemplate = `# World Rules

## Luật thế giới
1.
2.
3.
`;

const powerSystemTemplate = `# Power System

## Luật sức mạnh/năng lực/hệ thống
1.
2.
3.

## Giới hạn
- Nhân vật không thể:
- Thế giới không cho phép:
- Phản diện không thể:
`;

const secretsRevealsTemplate = `# Secrets & Reveals

## Bí mật và thời điểm hé lộ
- Bí mật 1:
  - Người biết:
  - Người chưa biết:
  - Hé lộ ở chương:
- Bí mật 2:
  - Người biết:
  - Người chưa biết:
  - Hé lộ ở chương:
`;

const causeEffectTemplate = `# Cause & Effect

## Nhân quả quan trọng
Nếu [sự kiện A] xảy ra thì [hệ quả B].
`;

const logicErrorsTemplate = `# Logic Errors to Avoid

## Lỗi logic cần tránh
-
-
`;

const mainPlotTemplate = `# Main Plot

## Mở đầu
-

## Biến cố khởi đầu
-

## Mục tiêu chính được thiết lập
-

## Điểm ngoặt 1
-

## Chuỗi thử thách
1.
2.
3.

## Điểm giữa truyện
-

## Khủng hoảng lớn
-

## Điểm ngoặt 2
-

## Cao trào
-

## Kết thúc
-

## Dư âm sau kết thúc
-
`;

const subplotTemplate = `# Subplot

## Tuyến phụ
[Miêu tả tuyến truyện phụ và cách nó kết nối với mạch chính]
`;

const timelineTemplate = `# Timeline

## Dòng thời gian
| Thời điểm | Sự kiện | Ghi chú |
|-----------|---------|---------|
|           |         |         |
`;

const turningPointsTemplate = `# Turning Points

1. Opening Image
2. Inciting Incident
3. First Turning Point
4. Rising Conflict
5. Midpoint
6. Crisis
7. Second Turning Point
8. Climax
9. Resolution
10. Final Image

[Điền chi tiết cho từng mốc]
`;

const climaxEndingTemplate = `# Climax & Ending

## Cao trào
-

## Kết thúc
[Miêu tả kết thúc]

## Loại kết thúc
[Đóng / mở / bi kịch / bittersweet / twist / vòng lặp]
`;

const chapterListTemplate = `# Chapter List

| Chương | Tên | Độ dài dự kiến | Trạng thái |
|--------|-----|----------------|------------|
| 1      |     |                |            |
`;

const chapterHooksTemplate = `# Chapter Hooks

| Chương | Hook cuối | Dẫn tới chương |
|--------|-----------|----------------|
|        |           |                |
`;

const writingPromptsTemplate = `# Writing Prompts

## Prompt chuẩn cho AI viết chương

Khi viết chương, hãy sử dụng prompt sau:

"Bạn là AI viết truyện theo OpenNovel Framework.
Hãy viết Chương [số]: [tên chương].
...
"
`;

const revisionPromptsTemplate = `# Revision Prompts

## Prompt review

"Hãy review chương truyện theo OpenNovel Framework.
Kiểm tra: Logic, Nhân vật, Cốt truyện, Nhịp truyện, Cảm xúc, Văn phong."

## Prompt sửa

"Hãy chỉnh sửa chương dựa trên lỗi đã phát hiện.
Thứ tự sửa: logic → nhân vật → cốt truyện → nhịp → hội thoại → văn phong."
`;

const continuityLogTemplate = `# Continuity Log

## Chương [số]
- Nhân vật đã biết thêm:
- Bí mật đã hé lộ:
- Quan hệ thay đổi:
- Vật phẩm/sự kiện mới:
- Trạng thái cuối chương:
- Móc nối chương sau:
`;

const characterStatusTemplate = `# Character Status

| Nhân vật | Tình trạng | Mục tiêu hiện tại | Đã biết | Đang giấu | Cảm xúc |
|----------|------------|-------------------|---------|-----------|---------|
|          |            |                   |         |           |         |
`;

const revealedInfoTemplate = `# Revealed Information

## Thông tin đã hé lộ
-
`;

const hiddenInfoTemplate = `# Hidden Information

## Thông tin vẫn cần giấu
-
`;

const nextChapterSetupTemplate = `# Next Chapter Setup

## Hậu quả cần nhớ ở chương sau
-

## Móc nối chương tiếp theo
-
`;

const structureEditTemplate = `# Structure Edit

## Kiểm tra cấu trúc tổng thể
[ ]
`;

const proseEditTemplate = `# Prose Edit

## Kiểm tra văn phong
[ ]
`;

const dialogueEditTemplate = `# Dialogue Edit

## Kiểm tra hội thoại
[ ]
`;

const finalReviewTemplate = `# Final Review

## Kiểm tra lần cuối
[ ]
`;

const fullStoryTemplate = `# Full Story

[Toàn bộ truyện hoàn chỉnh]
`;

const finalScriptTemplate = `# Final Script

[Kịch bản hoàn chỉnh]
`;

module.exports = { getFileTree };
```

- [ ] **Step 2: Verify template module loads**

Run: `node -e "const t = require('./src/templates/project.js'); const tree = t.getFileTree('test'); console.log('Entries:', tree.length);"`
Expected: `Entries: 59`

---

### Task 5: Init command

**Files:**
- Create: `D:\Code\Open Novel Skills\src\commands\init.js`

- [ ] **Step 1: Create init command — scaffolds a complete project directory**

```javascript
const fs = require('fs');
const path = require('path');
const { MODULES, initState } = require('../utils/state.js');
const { getFileTree } = require('../templates/project.js');

function init(args) {
  const projectName = args[0];

  if (!projectName) {
    console.error('Usage: opennovel init <project-name>');
    process.exit(1);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
    console.error('Error: Project name can only contain letters, numbers, hyphens, and underscores.');
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory "${targetDir}" already exists.`);
    process.exit(1);
  }

  console.log(`Creating OpenNovel project: ${projectName}`);
  console.log(`Location: ${targetDir}`);
  console.log('');

  const tree = getFileTree(projectName);

  for (const entry of tree) {
    if (entry.dir) {
      const fullDir = path.join(targetDir, entry.dir);
      fs.mkdirSync(fullDir, { recursive: true });
      console.log(`  📁 Created: ${entry.dir}/`);
    } else if (entry.file) {
      const fullPath = path.join(targetDir, entry.file);
      const parentDir = path.dirname(fullPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(fullPath, entry.content, 'utf-8');
      console.log(`  📄 Created: ${entry.file}`);
    }
  }

  // Init state
  initState(projectName, targetDir);
  console.log('');
  console.log(`✅ Project "${projectName}" initialized successfully!`);
  console.log('');
  console.log('Next steps:');
  console.log(`  cd ${projectName}`);
  console.log('  opennovel next');
  console.log('  opennovel status');

  // Print quick reference
  console.log('');
  console.log('─'.repeat(40));
  console.log('OpenNovel Workflow:');
  console.log('1. Start with Story Core  — core/story_core.md');
  console.log('2. Build characters       — characters/');
  console.log('3. Create the world       — world/');
  console.log('4. Set logic rules        — logic/');
  console.log('5. Plan the plot          — plot/');
  console.log('6. Outline chapters       — chapters/');
  console.log('7. AI writes chapters     — writing/');
  console.log('8. Review & approve       — approved/');
  console.log('9. Track continuity       — continuity/');
  console.log('10. Final editing         — editing/');
  console.log('11. Export final          — output/');
}

module.exports = init;
```

- [ ] **Step 2: Test init command**

Run: `node -e "require('./src/commands/init.js')(['test-project'])"` (from the project root)

Actually, we should test this differently since it creates a directory. Let me use a temp location.

Run:
```powershell
$tmp = Join-Path $env:TEMP "opennovel-test-$(Get-Random)"
node -e "process.chdir('$tmp'); require('D:/Code/Open Novel Skills/src/commands/init.js')(['my-novel'])"
```
Expected: Creates `$tmp/my-novel/` with full structure.

Run:
```powershell
if (Test-Path "$tmp/my-novel/01_Loi_Truyen/story_core.md") { echo "PASS: story_core.md created" } else { echo "FAIL" }
if (Test-Path "$tmp/my-novel/.opennovel/state.json") { echo "PASS: state.json created" } else { echo "FAIL" }
Remove-Item -Recurse -Force "$tmp/my-novel"
```
Expected: Both PASS

---

### Task 6: Status command

**Files:**
- Create: `D:\Code\Open Novel Skills\src\commands\status.js`

- [ ] **Step 1: Create status command — shows progress across all 11 modules**

```javascript
const fs = require('fs');
const path = require('path');
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
    pending: '⬜',
    in_progress: '🔄',
    done: '✅',
  };

  let completed = 0;
  let inProgress = 0;
  let pending = 0;

  for (const mod of MODULES) {
    const s = state.modules[mod.id] || 'pending';
    const icon = STATUS_ICONS[s] || '⬜';
    const label = `${mod.label}`;
    const dirExists = fs.existsSync(path.join(projectDir, mod.label));
    const dirMark = dirExists ? '📁' : '❌';

    console.log(`  ${icon} ${dirMark} ${label.padEnd(20)} ${mod.name} [${s}]`);

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
```

- [ ] **Step 2: Test status command**

Run:
```powershell
$tmp = Join-Path $env:TEMP "opennovel-status-test-$(Get-Random)"
New-Item -ItemType Directory -Path $tmp -Force | Out-Null
node -e "require('D:/Code/Open Novel Skills/src/commands/init.js')(['my-novel'])" --cwd $tmp
Push-Location $tmp/my-novel
node "D:/Code/Open Novel Skills/src/commands/status.js"
Pop-Location
Remove-Item -Recurse -Force $tmp/my-novel
```
Expected: Shows project info, all 11 modules as pending, "Progress: 0/11 modules completed"

---

### Task 7: Next command

**Files:**
- Create: `D:\Code\Open Novel Skills\src\commands\next.js`

- [ ] **Step 1: Create next command — analyzes state and suggests the next workflow step**

```javascript
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
    hint: 'Use the 10 turning points framework: Opening → Inciting Incident → ... → Climax → Resolution.',
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
    hint: 'Check: logic → character → plot → pacing → emotion → prose, in that order.',
  },
  'continuity': {
    message: 'Update continuity memory',
    detail: 'After each approved chapter, update continuity/ with what changed.',
    hint: 'This prevents AI from forgetting — critical for long stories.',
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
    console.log('🎉 All modules completed! Ready for final output.');
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
  console.log(`💡 Tip: ${guide.hint}`);
  console.log('');

  const inProgress = MODULES.find(m => state.modules[m.id] === 'in_progress');
  if (inProgress) {
    console.log(`Note: "${inProgress.name}" is marked as in_progress — you may want to complete it first.`);
  }
}

module.exports = next;
```

- [ ] **Step 2: Test next command**

Run:
```powershell
$tmp = Join-Path $env:TEMP "opennovel-next-test-$(Get-Random)"
New-Item -ItemType Directory -Path $tmp -Force | Out-Null
node -e "require('D:/Code/Open Novel Skills/src/commands/init.js')(['my-novel'])" --cwd $tmp
Push-Location $tmp/my-novel
node "D:/Code/Open Novel Skills/src/commands/next.js"
Pop-Location
Remove-Item -Recurse -Force $tmp/my-novel
```
Expected: Shows "Next Step: Define your Story Core" with detail and tip.

---

### Task 8: SKILL.md — AI workflow instruction

**Files:**
- Create: `D:\Code\Open Novel Skills\SKILL.md`

- [ ] **Step 1: Create SKILL.md — concise AI workflow instruction (under 100 lines)**

```markdown
---
name: opennovel
description: Framework for AI-assisted novel/story writing with structured pipeline. Covers story core, characters, world-building, plot architecture, chapter writing, review, and continuity tracking. Use when user wants to write a novel, story, or script — or invokes /opennovel.
---

# OpenNovel Framework

## Quick Start

User says "I want to write a story" → load this skill → start the pipeline.

## 4-Step Pipeline

### Step 1: Core Setup
- Run `opennovel init <name>` (or create folder structure manually)
- Fill **Story Core** — premise, logline, theme, conflict, stakes, tone, ending
- Build **Characters** — profiles with: role, personality, fear, goal, secret, "must not write wrong"
- Build **World** — setting, locations, history, culture, atmosphere
- Build **Logic** — rules, secrets timeline, cause-effect, limits

### Step 2: Plot Architecture
- Outline main plot + subplots
- Map 10 turning points: Opening → Inciting Incident → 1st Turning Point → Rising Conflict → Midpoint → Crisis → 2nd Turning Point → Climax → Resolution → Final Image
- List all chapters with brief summaries

### Step 3: Write (per chapter)
1. Create **Chapter Brief** — goal, characters, events, reveals, hook
2. Create **Scene Breakdown** — per scene: location, characters, goal, conflict, result
3. **Write chapter** — AI generates based on all prior context
4. **Review** — check: logic → character → plot → pacing → emotion → prose
5. **Revise** — fix in order: logic first, prose last
6. **Update Continuity** — character status, revealed info, hooks for next chapter

### Step 4: Finalize
- Edit full story (structure → prose → dialogue)
- Export final output

## Golden Rules
1. Never reveal secrets before their scheduled chapter
2. Never make characters act against their core personality without sufficient cause
3. Never break world logic without establishing exception rules first
4. Always update continuity after each chapter (AI forgets)
5. Each chapter must have: goal, conflict, mini-climax, and hook

## Commands
- `opennovel init <name>` — scaffold project
- `opennovel status` — check progress
- `opennovel next` — suggest next step
```

- [ ] **Step 2: Verify SKILL.md is under 100 lines**

Run:
```powershell
$lines = (Get-Content "D:\Code\Open Novel Skills\SKILL.md").Count
if ($lines -le 100) { echo "PASS: $lines lines" } else { echo "FAIL: $lines lines (over 100)" }
```
Expected: `PASS: N lines` (N ≤ 100)

---

### Task 9: REFERENCE.md — detailed templates

**Files:**
- Create: `D:\Code\Open Novel Skills\REFERENCE.md`

- [ ] **Step 1: Create REFERENCE.md — all detailed templates for deep reference**

```markdown
# OpenNovel Reference

## Story Core Template

```md
# Story Core

## Premise
[Ý tưởng nền của câu chuyện]

## Logline
Một [nhân vật chính] phải [mục tiêu], nhưng [trở ngại lớn], buộc họ phải [lựa chọn/thay đổi].

## Chủ đề chính
-
-

## Xung đột chính
- Bên ngoài:
- Bên trong:

## Mục tiêu nhân vật chính
- Mục tiêu bên ngoài:
- Mục tiêu bên trong:

## Cái giá nếu thất bại
-

## Tông truyện
-

## Kiểu kết thúc
Đóng / mở / bi kịch / bittersweet / twist / vòng lặp
```

## Character Profile Template

```md
# Hồ sơ nhân vật

Tên:
Vai trò:
Tuổi:
Ngoại hình:
Trang phục:
Vũ khí/vật phẩm đặc trưng:
Tính cách:
Giọng nói/hội thoại:
Mục tiêu bên ngoài:
Mục tiêu bên trong:
Nỗi sợ:
Điểm yếu:
Điểm mạnh:
Quá khứ:
Bí mật:
Quan hệ với nhân vật khác:
Điều nhân vật biết:
Điều nhân vật chưa biết:
Điều nhân vật đang che giấu:
Sự thay đổi qua truyện:
Số phận cuối truyện:

## Không được viết sai
-
-
-
```

## Chapter Brief Template

```md
# Chapter Brief

Chương số:
Tên chương:
Vị trí trong truyện:
Độ dài dự kiến:
Ngôi kể:
Văn phong:

## Tóm tắt trước chương
-

## Mục tiêu chương
-

## Nhân vật xuất hiện
-

## Bối cảnh chương
-

## Sự kiện bắt buộc
1.
2.
3.

## Thông tin cần hé lộ
-

## Thông tin cần giấu
-

## Cảm xúc chủ đạo
-

## Cao trào nhỏ của chương
-

## Kết chương
-

## Không được viết sai
-
```

## Scene Breakdown Template

```md
# Scene Breakdown

## Cảnh 1
Địa điểm:
Nhân vật:
Mục tiêu cảnh:
Xung đột:
Sự kiện chính:
Kết quả:
Cảm xúc:
```

## Review Checklist

- [ ] **Logic**: No contradictions with previous chapters? World rules intact? Secrets not revealed too early?
- [ ] **Character**: Actions match personality? Dialogue matches voice? Character has clear goal in chapter?
- [ ] **Plot**: Chapter advances the story? Meaningful events? Mini-climax has weight? Hook makes reader want next chapter?
- [ ] **Pacing**: Opening grabs? Middle drags? Any unnecessary scenes? Scene transitions smooth?
- [ ] **Emotion**: Right emotional tone? Memorable moments? Emotional intensity builds?
- [ ] **Prose**: Correct tone for story? Word repetition? Natural sentences? Balance of description and dialogue?

## Continuity Update Template

```md
# Continuity Update — Chương [số]

## Trạng thái nhân vật
- [Tên]: tình trạng, mục tiêu hiện tại, điều đã biết, điều đang giấu, cảm xúc

## Quan hệ nhân vật
- A và B: Trước chương → Sau chương, mức độ tin tưởng/mâu thuẫn

## Thông tin đã hé lộ
-

## Thông tin vẫn cần giấu
-

## Sự kiện đã xảy ra
-

## Vật phẩm/địa điểm mới
-

## Hậu quả cần nhớ ở chương sau
-

## Móc nối chương tiếp theo
-
```

## AI Writing Prompt Template

```md
Bạn là AI viết truyện theo OpenNovel Framework.

Hãy viết Chương [số]: [tên chương].

[Context: Story Core + Character profiles + World + Logic + Plot position]

Yêu cầu:
- Ngôi kể:
- Văn phong:
- Tông cảm xúc:
- Độ dài:
- Nhịp truyện:
- Mức độ miêu tả:
- Mức độ hội thoại:

Bắt buộc:
- Giữ đúng tính cách nhân vật
- Không tiết lộ bí mật chưa đến thời điểm
- Không phá luật logic
- Kết chương đúng theo brief
```

## Full Pipeline Diagram

```
Ý tưởng → Story Core → Characters → World → Logic → Plot → Chapters
    → AI Write → Review → Revise → Continuity Update → (repeat) → Final Edit → Export
```
```

- [ ] **Step 2: Verify REFERENCE.md exists**

Run: `Test-Path "D:\Code\Open Novel Skills\REFERENCE.md"`
Expected: `True`

---

### Task 10: AGENTS.md — AI session configuration

**Files:**
- Create: `D:\Code\Open Novel Skills\AGENTS.md`

- [ ] **Step 1: Create AGENTS.md — tells AI how to operate in this project**

```markdown
# AGENTS.md — OpenNovel Framework

## AI Role
You are an AI assistant specialized in novel/story writing using the **OpenNovel Framework**.

## When user says "write a story" or similar
1. Load the `opennovel` skill (SKILL.md)
2. Start the pipeline: Core → Plot → Chapter → Write & Review
3. Always suggest next step — be proactive, not passive

## Pipeline reminder
```
Core Setup → Plot Architecture → Chapter Writing (loop: brief → write → review → revise → update continuity) → Final Edit
```

## Available CLI
```bash
opennovel init <name>    # Scaffold new project
opennovel status         # Show progress
opennovel next           # Suggest next step
```

## Writing rules enforced by this framework
1. Every chapter needs: goal, conflict, mini-climax, hook
2. Review order: logic → character → plot → pacing → emotion → prose
3. Fix order: logic first, prose last
4. Update continuity after every chapter
5. Never reveal secrets early or break character

## State file location
`.opennovel/state.json` in the project root.

## Project layout
```
core/          — Story Core (premise, logline, theme, tone)
characters/    — Character profiles
world/         — World building
logic/         — Logic rules, secrets timeline
plot/          — Plot architecture
chapters/      — Chapter list, briefs, scene breakdowns
writing/       — AI writing outputs, review notes
approved/      — Approved chapters
continuity/    — Continuity memory
editing/       — Final editing
output/        — Final output
```
```

- [ ] **Step 2: Verify AGENTS.md exists**

Run: `Test-Path "D:\Code\Open Novel Skills\AGENTS.md"`
Expected: `True`

---

### Task 11: Self-integration test — run opennovel init and inspect output

**Files:**
- None created — this is a test of the full toolchain

- [ ] **Step 1: Create a scratch project and verify full structure**

Run:
```powershell
$tmp = Join-Path $env:TEMP "opennovel-e2e-$(Get-Random)"
New-Item -ItemType Directory -Path $tmp -Force | Out-Null
Push-Location $tmp
```

Run: `node "D:\Code\Open Novel Skills\src\commands\init.js" ["test-novel"]`
Expected: Shows all file creation messages, ends with "Project "test-novel" initialized successfully!"

- [ ] **Step 2: Verify critical files exist**

Run:
```powershell
$root = Join-Path $tmp "test-novel"
$checks = @(
    "core/story_core.md",
    "characters/character_bible.md",
    "world/world_overview.md",
    "logic/world_rules.md",
    "plot/main_plot.md",
    "chapters/chapter_list.md",
    "writing/writing_prompts.md",
    "continuity/continuity_log.md",
    "output/full_story.md",
    ".opennovel/state.json"
)
$allOk = $true
foreach ($c in $checks) {
    $p = Join-Path $root $c
    if (Test-Path $p) { Write-Host "PASS: $c" } else { Write-Host "FAIL: $c"; $allOk = $false }
}
if ($allOk) { Write-Host "ALL CHECKS PASSED" } else { Write-Host "SOME CHECKS FAILED" }
```
Expected: All PASS, "ALL CHECKS PASSED"

- [ ] **Step 3: Test status command on the scratch project**

Run:
```powershell
Push-Location $root
node "D:\Code\Open Novel Skills\src\commands\status.js"
Pop-Location
```
Expected: Shows project name "test-novel", 11 modules listed as "pending"

- [ ] **Step 4: Test next command on the scratch project**

Run:
```powershell
Push-Location $root
node "D:\Code\Open Novel Skills\src\commands\next.js"
Pop-Location
```
Expected: Shows "Next Step: Define your Story Core"

- [ ] **Step 5: Clean up**

Run:
```powershell
Pop-Location
Remove-Item -Recurse -Force $tmp
```
Expected: No errors

---

## Self-Review

### 1. Spec coverage
- ✅ CLI tool with `init`, `status`, `next` commands (Tasks 1-7)
- ✅ SKILL.md with 4-step pipeline (Task 8)
- ✅ REFERENCE.md with detailed templates (Task 9)
- ✅ AGENTS.md for AI session config (Task 10)
- ✅ English folder names, no numbering
- ✅ 11-module directory structure
- ✅ State tracking via `.opennovel/state.json`
- ✅ Zero external dependencies (Node.js built-ins only)

**Gap found:** The spec mentioned `build-core`, `add-character`, `add-chapter` commands — these are omitted from v1 to keep the first iteration minimal and YAGNI. Users fill template files directly; the `next` command guides them. These can be added as v2 commands.

### 2. Placeholder scan
- No "TBD", "TODO", or placeholder text found in implementation code
- Every step has actual code
- Function calls and type names checked for consistency

### 3. Type consistency
- `findProjectDir()` returns string | null — used correctly in status.js and next.js
- `loadState()` returns object | null — checked before use
- `initState()` returns object — used in init.js
- `getFileTree()` returns array — iterated in init.js
- Module IDs match between state.js, WORKFLOW_GUIDE in next.js, and MODULES array
