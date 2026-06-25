---
title: "Stop Prompting, Start Engineering Loops: The Rise of Loop Engineering in AI"
date: "2026-06-25"
tag: "Open Source"
excerpt: "Loop Engineering shifts the focus from crafting single prompts to designing autonomous, self-running loops for AI agents. The approach involves key components like shared state, validation sub-agents, and goal-driven automation. However, it introduces new debts—verification, comprehension, and cognitive surrender—that developers must actively manage to avoid long-term risks."
---

On June 7, 2026, Addy Osmani published a lengthy blog post on **Loop Engineering**, quoting Boris Cherny, head of Anthropic’s Claude Code: *“I no longer prompt Claude; I have loops prompt Claude, and the loops decide what to do next. My job is to write the loops.”*

Peter Steinberger later distilled this into a more memorable mantra: *“You shouldn’t prompt the agent; you should design loops that let the agent run.”* Within days, “Loop Engineering” became a buzzword across AI development communities.

## Why Loop Engineering Resonates Now

Two concurrent shifts have birthed this concept:

**Shift 1: The leverage of a single prompt is collapsing.** Tools like Claude Code, Cursor Composer, and Cline have stretched the “one prompt → observable work” cycle from seconds to minutes or even hours. When one conversation can deliver a feature, the marginal benefit of “spending an extra 30 seconds polishing a prompt” diminishes.

**Shift 2: Agents can now run 24/7.** GitHub Actions, cron jobs, and Claude Code’s `/loop` command allow agents to keep working unattended. Once an agent can exist outside a chat session, “who presses Enter?” becomes the new bottleneck.

As Osmani puts it: *“Loop engineering is replacing yourself as the person who prompts the agent.”*

## Five Components + One Shared State

Osmani breaks down a runnable loop into five components plus a shared state, ranked by importance:

### 1. State (Shared Memory)
A persistent place readable and writable across loop iterations. Whether it’s a markdown file, SQLite, or a TODO list, the **single source of truth** matters most.

State must exist outside the loop. Embedding state in conversation history is an anti-pattern—loops relying on “where did we leave off?” won’t survive a full context window.

### 2. Sub-agent (Validation/Division of Labor)
A second agent validates the first agent’s output—a **Maker-Checker pattern**.

Key detail: the reviewer agent must operate in an **independent context**. If it’s just the same session “thinking again about whether there’s a problem,” the model will tend to confirm itself. Physically separating two processes is what makes this effective.

### 3. Automation (Triggering)
When does the loop trigger? Three types:
- **Schedule-driven**: Runs at fixed intervals (e.g., cron).
- **Event-driven**: Triggered by events like a PR submission or issue creation.
- **Goal-driven**: Given a verifiable goal condition, the loop runs, judges whether the goal is met, and stops when it is.

Goal-driven loops are the most underestimated—without a goal, the loop either stops at max iterations or requires a human to hit the stop button.

### 4. Skill (Reusable Context)
Package “how to do X in this project” into a reusable unit—like Claude Code’s SKILL.md or Cursor’s .cursorrules.

Skills are the engineered version of prompts—upgraded from “a well-written hint” to “version-controlled, project-wide, reusable instructions referenced by multiple loops.”

### 5. Worktree (Parallel Isolation)
Each parallel agent gets its own Git worktree, avoiding conflicts.

### 6. Plugin/Connector (External Tools)
MCP servers, API connectors, CLI wrappers—these let the agent do more than output text; they can actually modify databases, push commits, and open PRs.

This is the most visible component but also the most overestimated. **Without state and sub-agents, hooking up a bunch of plugins only plants landmines.**

## The Hierarchy

```
Agentic Engineering: Can this system reliably achieve a goal?
└── Harness Engineering: The machine surrounding the engine
    ├── Loop Engineering: How to design the loop itself
    ├── Other harness sub-areas: Tool calling, observability, guardrails
    └── Context Engineering: What goes into the window
        └── Prompt Engineering: How to write that one piece of text
```

Loop Engineering is not a fifth layer—it’s an independently named engineering sub-discipline within the harness layer.

## Three Debts: The Smoother the Loop Runs, the More You Risk Collapsing

### 1. Verification Debt
A loop might output “task complete,” but that’s just the agent’s claim, not proof. A green CI doesn’t mean the logic is correct; an opened PR doesn’t mean the code is maintainable.

The only way to repay this debt: **build human verification steps into the loop**—physically pause it for human review or executable tests.

### 2. Comprehension Debt
Loops let you merge 10 PRs overnight, but do you really understand what changed? Six months later, when a bug surfaces, you’ll stare at your own repo like it’s stranger’s code.

The repayment method is **slow reading**—after a loop writes an important module, don’t merge it immediately. Read it yourself and annotate a line or two explaining “why it was written this way.”

### 3. Cognitive Surrender
The smoother the loop runs, the more you want to let it run—because “press a button, get results” feels too good. Then one day you realize you’re no longer thinking “should we do this?” but only “which loop should do this?”

Osmani’s words: *“The comfortable posture is the dangerous one.”* This can’t be repaid with tools; only through self-awareness.

## The Bottom Line

**Loops change your job—they don’t eliminate it.** Verification debt asks you to confirm, comprehension debt asks you to read, and cognitive surrender asks you to think. Repay all three, and loop engineering becomes leverage; fail on any one, and it becomes a slow-acting poison.