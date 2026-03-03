---
title: Modular Code — Why Your AI Agent Keeps Breaking Its Own Work
description: AI agents love stuffing everything into one file. Here's why that destroys your codebase and how to fix it before it's too late.
pubDate: 2026-03-03
readTime: 6 min read
---

There's a pattern I've seen every single time I let an AI agent build freely: it puts everything in one file.

The bot logic, the message handling, the API calls, the utility functions, the error handling — all crammed into a single file that grows and grows until one day you realize features you tested last week are mysteriously broken. Not because you changed them. Because the agent changed them while working on something else entirely.

## The Monolith Problem

AI agents are optimized for completing the task in front of them. They're not thinking about your codebase six months from now. So when you ask them to add group chat support to your Telegram bot, they don't think "where does this logically belong?" They think "let me add this right here, in the file I'm already looking at."

The result is a 2,000-line file that does everything. And every time the agent edits it, there's a chance it accidentally overwrites something it wrote last week. The file is too big for the agent to hold in context all at once, so it works on one section and silently mangles another.

I've watched this happen in real time. A perfectly working streaming preview — just gone. Not deleted intentionally. Overwritten by an agent that was editing a different part of the same file and didn't realize it had changed 40 lines it shouldn't have touched.

## Why Agents Do This

It's not laziness. It's how they're trained.

When an AI agent gets a task, it looks at the current file, understands the immediate context, and adds the new functionality right there. It's the path of least resistance. Creating a new file, importing it, wiring it up — that's more steps, more complexity, more chances to break something. So the agent takes the shortcut.

The problem is that shortcut compounds. Every feature added to the monolith makes the next feature harder. The file gets longer, the context window fills up faster, and the agent starts losing track of what's already there.

## What Actually Breaks

Here's the specific failure mode I've seen repeatedly:

**Feature drift.** You build a Telegram bot with direct message handling. It works perfectly. Then you ask the agent to add group chat support. Instead of reusing the existing message handling logic, the agent creates *entirely new* message handling code inside the same file. Now you have two versions of the same logic. When you fix a bug in one, the other still has it. When you add a feature to one, the other doesn't get it.

**Silent overwrites.** The agent is editing line 800 of a 1,500-line file. It regenerates a chunk of code and accidentally changes lines 750-780 — code that was working fine. You don't notice until days later when that feature breaks and you have no idea why.

**Context starvation.** A 2,000-line file eats up the agent's context window. It can see maybe half the file at once. So it makes decisions without knowing what the other half is doing. It duplicates functions that already exist. It creates conflicting variable names. It solves problems that were already solved 800 lines up.

## The Fix: Enforce Modularity From Day One

The solution isn't complicated, but it requires discipline — specifically, it requires you to be explicit with the agent about how you want code organized.

### Separate concerns into files

Every distinct piece of functionality gets its own file. Message handling, API calls, utility functions, configuration — all separate. The main file becomes a thin orchestration layer that imports and wires things together.

```
// ❌ What the agent wants to do
telegram-bot.js          // 2,000 lines, does everything

// ✅ What you need to enforce
telegram/
├── index.js             // Entry point, wiring only
├── config.js            // Configuration and constants
├── handlers/
│   ├── messages.js      // Message handling (DM + group)
│   ├── voice.js         // Voice note processing
│   └── commands.js      // Slash commands
├── utils/
│   ├── files.js         // File operations
│   └── transcribe.js    // Audio transcription
└── state.js             // Session state management
```

### Make shared logic actually shared

This is the critical one. When the agent needs group chat functionality, it should import the same message handling that direct chat uses — not recreate it. You have to make this explicit:

> "Use the existing message handler from handlers/messages.js. Do not create new message handling logic. If the existing handler doesn't support groups, extend it — don't duplicate it."

Without this instruction, the agent will create a parallel implementation every single time.

### Keep files small enough for full context

If a file is under 200 lines, the agent can see the whole thing at once. It knows what functions already exist. It knows what patterns are established. It doesn't accidentally overwrite anything because it can see everything.

The moment a file crosses 500 lines, you're in the danger zone. The agent starts working blind on portions of the file it can't currently see.

### Put the rules in your system prompt

This is the most important step. If you're using AI agents with any kind of system instructions or project configuration, put your modularity rules there. I literally have this in my project instructions:

> "NEVER create components inline within page files. ALWAYS create separate component files."

The agent reads this every single session. It doesn't forget. It doesn't drift. The rule is always there.

## The Compound Effect

Here's what happens when you enforce modularity:

**Bug fixes propagate.** Fix a bug in the shared message handler, and it's fixed everywhere — direct chat, group chat, every channel that imports it.

**Features compound.** Add voice note support to the handler once, and every channel gets it automatically.

**The agent gets smarter.** With smaller, focused files, the agent can see everything it needs. It stops duplicating. It stops overwriting. It starts building *on top of* what exists instead of *next to* it.

**You can actually debug.** When something breaks, you know exactly which file to look at. The blast radius of any change is contained to one module.

## The Mindset

AI agents are incredibly capable builders. But they optimize for the immediate task, not for long-term codebase health. That's your job.

Think of it like managing a brilliant but impatient junior developer. They'll write amazing code — but they'll put it wherever is most convenient unless you give them a clear structure to follow.

The structure isn't overhead. It's what makes everything else possible. Without it, you'll spend more time fixing what the agent broke than building new things. With it, every session builds on the last, and the system gets more capable over time.

Your codebase is the agent's memory. Keep it clean, and the agent stays smart. Let it become a monolith, and you'll be debugging ghost overwrites forever.
