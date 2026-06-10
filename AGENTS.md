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
