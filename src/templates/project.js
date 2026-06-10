function projectTemplate(name) {
  return `# Project: ${name}

## Metadata
- **Genre:**
- **Target audience:**
- **Tone:**
- **Point of view:**
- **Tense:**
- **Estimated length:**

## Premise
[One-sentence summary of the core idea]

## Logline
A [protagonist] must [goal], but [obstacle], forcing them to [choice/change].

## Themes
-
-

## Central Conflict
- External:
- Internal:

## Stakes
What happens if the protagonist fails:
-

## Ending Type
[Closed / open / tragedy / bittersweet / twist / loop]
`;
}

function bibleTemplate(name) {
  return `# Story Bible — ${name}

## Characters

### Character Profile Template
Copy and fill for each character:

\`\`\`
Name:
Role:
Age:
Appearance:
Personality:
Voice/speech:
External goal:
Internal goal:
Fear:
Weakness:
Strength:
Backstory:
Secret:
Relationships:
What they know:
What they don't know:
What they hide:
Arc through story:
Final fate:
\`\`\`

### Must Not Write Wrong
-
-
-

## World

### Setting
[Where and when does the story take place?]

### Locations
-
-

### History
- Past events:

### Culture
- Rules/laws:
- Social classes:
- Beliefs:
- Customs:

### Atmosphere
- Colors:
- Light:
- Sound:
- Dominant feeling:

## Logic & Rules

### World Rules
1.
2.
3.

### Power System (if applicable)
1.
2.
3.

### Limits
- Characters cannot:
- The world does not allow:
- The antagonist cannot:

### Secrets & Reveals
- Secret 1:
  - Known by:
  - Hidden from:
  - Reveal chapter:
- Secret 2:
  - Known by:
  - Hidden from:
  - Reveal chapter:

### Cause & Effect
If [event A] then [consequence B].

### Logic Errors to Avoid
-
-
`;
}

function outlineTemplate(name) {
  return `# Outline — ${name}

## Plot

### Opening
-

### Inciting Incident
-

### Main Goal Established
-

### Turning Point 1
-

### Rising Conflict Chain
1.
2.
3.

### Midpoint
-

### Crisis
-

### Turning Point 2
-

### Climax
-

### Resolution
-

### Aftermath
-

## Subplots
[Describe subplots and how they connect to the main plot]

## Timeline

| Time | Event | Notes |
|------|-------|-------|
|      |       |       |

## 10 Turning Points
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

## Chapter List

| # | Title | Est. Length | Status |
|---|-------|-------------|--------|
| 1 |       |             |        |

## Chapter Hooks

| # | End Hook | Leads To |
|---|----------|----------|
|   |          |          |
`;
}

const continuityTemplate = `# Continuity

## Chapter Log
\`\`\`
Chapter [N]:
- New info characters learned:
- Secrets revealed:
- Relationship changes:
- New items/events:
- End state:
- Hook for next:
\`\`\`

## Character Status

| Character | Status | Current Goal | Knows | Hides | Emotion |
|-----------|--------|-------------|-------|-------|---------|
|           |        |             |       |       |         |

## Revealed Information
-

## Hidden Information (still to conceal)
-

## Next Chapter Setup
### Consequences to carry forward
-

### Hooks for next chapter
-
`;

const agentsMdTemplate = `<!-- OPENNOVEL_START -->
# OpenNovel — Writing Framework

## AI Role
You are an AI assistant using the OpenNovel Framework for novel/story writing.

## Core Files
- \`project.md\` — project metadata, genre, tone, POV, premise, logline
- \`bible.md\` — characters, world, rules, secrets, logic
- \`outline.md\` — plot, timeline, chapter list, chapter briefs
- \`continuity.md\` — story state, revealed/hidden info, next chapter setup

## Content
- \`content/\` — chapter files (\`chapter_001.md\`, etc.)

## Output
- \`output/\` — final exported files (.txt, .html, .docx, .pdf)

## OpenNovel Skills
When available, use installed skills:
- \`opennovel-project-setup\`
- \`opennovel-bible-builder\`
- \`opennovel-outline-builder\`
- \`opennovel-chapter-writer\`
- \`opennovel-continuity-manager\`
- \`opennovel-editor\`
- \`opennovel-exporter\`

## Writing Rules
1. Every chapter needs: goal, conflict, mini-climax, hook
2. Review order: logic → character → plot → pacing → emotion → prose
3. Fix order: logic first, prose last
4. Update continuity after every chapter
5. Never reveal secrets early or break character
<!-- OPENNOVEL_END -->
`;

function getFileTree(projectName) {
  return [
    { file: 'project.md', content: projectTemplate(projectName) },
    { file: 'bible.md', content: bibleTemplate(projectName) },
    { file: 'outline.md', content: outlineTemplate(projectName) },
    { file: 'continuity.md', content: continuityTemplate },
    { dir: 'content' },
    { dir: 'output' },
    { file: 'AGENTS.md', content: agentsMdTemplate },
  ];
}

module.exports = { getFileTree, agentsMdTemplate };
