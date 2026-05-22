---
title: "Mastering Codex Subagents: A Practical Guide to Parallel Processing for Developers"
date: "2026-05-21"
tag: "OpenAI"
excerpt: "This guide explains how to use Codex's Subagent feature for parallel task processing to improve development efficiency. It covers when to use sub-agents, how to launch them effectively, and provides a practical PR review case study demonstrating how independent, parallel inspections can uncover critical issues faster. Learn step-by-step how to split complex tasks and manage agent threads to reduce cognitive load."
---

![画像](/images/blog/codex-subagent/img-1.png)

## What is Codex Subagent?

Codex's Subagent, also referred to as a "child agent," is a feature that splits a complex task into multiple sub-agents for parallel processing. Each sub-agent runs in an independent thread and returns its conclusion to the main thread.

According to OpenAI's documentation, a sub-agent workflow is defined as a process that executes multiple parallel agents and integrates their results. A Subagent is an agent responsible for a specific task, while an Agent thread is the execution thread for each agent, which can be viewed and switched via the CLI.

This feature primarily addresses two main challenges:

1.  **Preventing Context Contamination:** In tasks like test fixing, which require reading numerous files, executing commands, and analyzing errors, processing everything in the main thread can easily lead to confused judgment. Subagents process these tasks in sub-threads and return only the conclusion, keeping the main thread clean.

2.  **Improving Efficiency Through Parallel Processing:** For tasks like PR reviews, which require multiple perspectives (security, style, test coverage, concurrency, maintainability), processing in parallel is faster and more thorough than a single agent handling them sequentially.

In short, Subagent is one of the usage patterns for Codex.

## When to Use (and When Not to Use)

The simple judgment criterion is whether the task can be broken down into independent, smaller blocks. If it can, use Subagents; if not, do not.

Inappropriate scenarios include:

- When the task itself is small.
- When subtasks are tightly coupled.
- When write ranges overlap.
- When the division method is unclear.

Scenarios where Subagents are effective mainly include:

- Exploring large codebases.
- Multi-dimensional PR reviews.
- Simultaneously investigating multiple bug causes.
- Evaluating security, performance, testing, and maintainability separately.
- Splitting analysis of long documents, logs, or complex errors.
- Having one agent implement a feature while another performs a concurrent risk check.

Officially, it's recommended to start with read-intensive tasks (exploration, testing, triage, summarization). Multiple agents modifying code is write-intensive and risks file conflicts and coordination costs.

Additionally, since each sub-agent runs models and tools independently, token consumption increases compared to a single agent. This may be negligible for small projects but becomes more significant at scale.

## How to Launch Subagents

By default, Codex does not automatically spawn Subagents. You must explicitly specify the number and tasks in your prompt. Common specification methods include:

- "spawn two agents"
- "delegate this work in parallel"
- "use one agent per point"

For example, you can also use a directive like: "Spawn three Subagents to inspect security, testing, and maintainability, respectively."

Here's a practical template example:

```
Please review the current branch using parallel Subagents.
Spawn 3 Subagents:
1. Inspect for security risks.
2. Inspect for missing tests.
3. Inspect for code maintainability.

Wait for all Subagents to complete, then integrate the results.
Sort the output by severity and include file paths.
```

## Practical Example: PR Review

For a PR review after implementing a new feature, the following prompt is effective:

```
Review the current branch based on its diff with main.
Use one Subagent to inspect for potential bugs,
one Subagent to inspect for test coverage,
and one Subagent to inspect for code quality and maintainability.

Each Subagent should output only clear issues, not detailed processes.
After all 3 Subagents complete, integrate the following:
- High-risk issues
- Medium-risk issues
- Any optimization suggestions
- Recommendations for priority fixes
```

Key points of this template:

- Clearly separates each Subagent's role to prevent overlap.
- Explicitly states "wait for all Subagents to complete before integrating" to prevent judgment on intermediate results.
- Specifies the output format to provide a list organized by risk level.
- Requests "recommendations for priority fixes," which delegates the prioritization of issues as well.

## Case Study: ShipReady

Let's look at a Subagent usage example in an actual project, "ShipReady" (an MVP for SaaS landing page auditing). The project is small, with key files as follows:

- Backend API: `src/app.js`
- Audit Rules & Rewrites: `src/audit.js`
- Storage: `src/store.js`
- Frontend: `public/app.js`

Your first instinct might be to instruct Subagents to make code changes, but the smaller the project, the more likely file conflicts between agents. A more stable approach is to initially run all Subagents in read-only mode.

```
Please try using Subagents on this project.
Spawn 3 read-only Subagents:
1. runtime-risk-agent: Inspect for potential bugs, async errors, API state flows, and production risks.
2. qa-coverage-agent: Inspect for missing tests, uncovered use cases, and regression risks.
3. architecture-agent: Inspect for module boundaries, duplicate logic, and backward compatibility.

File changes are prohibited for all Subagents.
After all complete, the main thread will integrate the conclusions to decide if fixes are needed.
```

![画像](/images/blog/codex-subagent/img-2.png)

Advantages of this division method:

- The three directions are independent, so no waiting time occurs.
- Since all are read-only, no file conflicts occur.
- The main thread can continue analyzing the project structure or making its own judgments while waiting for results.

The perceived time from launch to obtaining three conclusions is just a few minutes. Because the project is small, what's saved isn't the "absolute time of file reading," but rather the reduced cognitive load on the main thread of having to simultaneously remember three types of problems (runtime failures, test insufficiencies, and the need for module splitting). This load reduction may not feel strong for a few-minute task, but it becomes more pronounced as the task scale increases.

![画像](/images/blog/codex-subagent/img-3.png)

Among the conclusions from the three Subagents, the **runtime-risk-agent** proved most valuable. It discovered a missing `await` in the async route inside `handleRequest` and that the outer `try/catch` could not catch exceptions from the async handler. Bugs of this type are undetectable in happy-path tests; if they occur, requests will hang or throw unhandled exceptions. It also pointed out that `/api/rewrite` only checks for the existence of a `brief` but lacks a quality check. These findings were directly reflected in the subsequent change list.

The deficiencies listed by **qa-coverage-agent** were also practical: invalid JSON, unshared status on share, premature follow-up, and avoiding rewrites due to weak briefs—mainly negative API paths outside the happy path. While not all need immediate fixes, the issues become clearly visible.

**architecture-agent** provided the most debatable results. It indicated that `src/app.js` has too many responsibilities, that `src/audit.js` should be split into four parts (page-extract, checks, brief, rewrite), and that frontend and backend duplicate the management of audit labels and brief readiness. The judgment was correct, but for the task at hand (creating tests + fixing bugs), the scope was too large. Changing core files at this stage would risk scattering issues, so this proposal was not adopted and was recorded as a task for next time.

There were no direct contradictions between the three Subagents, but their priorities differed: runtime-risk wanted server-side fixes, qa-coverage wanted to add tests, and architecture wanted to reorganize boundaries. The main thread's role is not to average the three votes, but to prioritize issues with high certainty, small change scope, and that can be fixed by tests.

The final changes implemented were:

- Unified `await` in async route branches and enabled outer error handling.
- Made `briefReady(record.brief)` check mandatory for `/api/rewrite`.
- Added two types of validation ("brief not submitted" and "invalid fields") to `/api/brief/follow-up`.
- Added a body size limit to `readJson` and returns a 400 error for invalid JSON.
- Added regression tests using `node:test` to fix the state flow.

Run verification:
```
npm run check
npm test
```

The most interesting moment was when the runtime-risk-agent reported the async handler bug at the same time the qa-coverage-agent suggested adding negative-path API tests. Combining the two conclusions yielded a complete fix plan: one identifies the problem, and the other suggests its prevention. The main thread did not need to re-review the entire project; it only had to judge if this issue was worth fixing now, then execute code changes, test additions, and verification.

This is the essential role of Subagent: not to make decisions for the main thread, but to simultaneously present conclusions from multiple directions to accelerate the main thread's decision-making.

## Post-Execution Management

In the Codex CLI, you can use the `/agent` command to view and switch between agent threads. Beyond commands, you can also use natural language to instruct stopping a specific Subagent or closing completed threads.

Basic commands beginners should learn:

```
/agent
```
View and switch agent threads.

```
Please stop the Subagent responsible for performance analysis.
```
Directly stop a specific sub-task if it goes off track or becomes unnecessary.

```
Please close completed agent threads.
```
Clean up completed threads regularly as they are no longer needed.

## Beginner Practice Steps

It's not recommended to start by using five agents to change an entire project. Practice should begin with low-risk stages:

1.  **Parallel Reading:** Have multiple Subagents responsible for understanding different modules, with the final integration done by you.
2.  **Parallel Review:** Isolate and inspect for bugs, security, testing, and maintainability.
3.  **Single Change + Multiple Reviews:** Have the main agent or one worker make code changes, while other Subagents review them.
4.  **Small-Scale Parallel Changes:** Once module boundaries are clear, have multiple workers simultaneously modify different modules.

![画像](/images/blog/codex-subagent/img-4.png)

The next time you do a PR review in Codex, try this template:

```
Inspect the current PR in parallel using 3 Subagents:
One for bugs, one for tests, one for maintainability.
After all complete, integrate and report by risk level.
```

After reading this tutorial, it is recommended to try it out on an actual project.