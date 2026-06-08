---
title: "Anthropic Launches Claude Opus 4.8 With Modest Coding and Agent Gains, Same Pricing"
date: "2026-06-08"
tag: "Anthropic"
excerpt: 'Anthropic has released Claude Opus 4.8, a modest update to its flagship model with improvements in coding, agentic terminal tasks, and reasoning — all at unchanged pricing. The company is positioning "honesty" — the model's tendency to flag its own uncertainty rather than confidently err — as the release's most important differentiator, alongside alignment gains that now approach Mythos levels.'
---

On May 28, 2026, Anthropic released Claude Opus 4.8, the latest iteration of its flagship model. The update is a measured but clearly directional step forward: Opus 4.8 edges ahead of its predecessor, Opus 4.7, across coding, agentic tasks, reasoning, and knowledge work benchmarks — all without a price increase. Anthropic has also placed "honesty" front and center as the headline improvement. In its official announcement, the company didn't hedge, describing the release as "a modest but tangible improvement" over the previous generation.

One notable detail is the pace of iteration. Opus 4.8 arrived just **41 days** after Opus 4.7 — the fastest version cadence in the Opus series to date. The model ID is `claude-opus-4-8`, with a context window of 1 million input tokens and 128,000 output tokens.

![](/images/blog/anthropic-released-opus-4_8/img-1.png)

## Benchmarks: Meaningful Coding Gains, but Terminal Tasks Still Trail GPT-5.5

Looking at the data published in the official System Card, the most substantial improvements cluster around coding and agentic capabilities — though the magnitude varies significantly across benchmarks.

**Coding.** The most meaningful gains show up on the harder **SWE-bench Pro**: Opus 4.8 scores **69.2%**, up 4.9 percentage points from Opus 4.7's 64.3%. By contrast, the already near-ceiling SWE-bench Verified only inched from 87.6% to **88.6%** (+1.0), and SWE-bench Multilingual rose from 80.5% to 84.4% (+3.9). In other words, **on saturated benchmarks there's little room to grow; the gains concentrate on harder, unsaturated tasks** — which is arguably a more reliable signal of genuine coding improvement.

**Agentic terminal tasks (Terminal-Bench 2.1)** saw the single largest jump of any benchmark, climbing from 66.1% to **74.6%** — a full 8.5-point improvement. **But here's the honest caveat: even with that gain, Opus 4.8 still loses to GPT-5.5 on this metric.** Under the same Terminus-2 public harness, GPT-5.5 scores 78.2%; using GPT-5.5's own Codex CLI harness, that figure jumps to 83.4%. Anthropic acknowledges this in a footnote. The takeaway is straightforward: **if your work lives primarily in the terminal/CLI environment, the overall strongest model may not be the best fit for your workflow.**

**Reasoning** benchmarks present a mixed picture. The most striking number is on **USAMO 2026 math proofs**, which leaped from 69.3% to **96.7%** — a 27.4-point jump in a single version cycle. That's less incremental polishing and more a qualitative shift in mathematical reasoning depth. Meanwhile, **GPQA Diamond** saw a **slight regression**, falling from 94.2% (Opus 4.7) to 93.6%. Humanity's Last Exam (with tools) climbed from 54.7% to 57.9%.

**Knowledge work** shows strong results. In Artificial Analysis's GDPval-AA evaluation, Opus 4.8 leads at **1890 Elo**, up 137 points from the prior generation's 1753, and well ahead of GPT-5.5's 1769. Computer use (OSWorld-Verified) scored 83.4%, and browser agent performance (Online-Mind2Web) reached 84%. Overall, **Opus 4.8 wins six out of seven comparisons Anthropic published — the sole loss being Terminal-Bench 2.1 mentioned above.**

## "Honesty" Is the Improvement Anthropic Emphasized Most

If the benchmark numbers represent a gentle lift, the quality Anthropic spent the most ink on in its announcement is the model's **honesty**.

Here, "honesty" has a specific definition: it refers to the model's tendency to avoid making assertions it cannot substantiate. A common problem with AI models is that **they leap to conclusions with insufficient evidence, confidently declaring a task complete or progress achieved**. Anthropic says Opus 4.8 is more inclined to proactively flag uncertainties in its own work and less likely to offer unsupported conclusions.

In quantifiable terms: **Opus 4.8 lets defects slip through its own code unmarked roughly one-quarter as often as the previous generation (approximately 4x lower).** Early testers' feedback echoes this — the model proactively flags issues in both inputs and outputs, the kind of edge cases that other models routinely leave for users to discover.

For teams deploying the model in code review, financial analysis, legal work, and other high-stakes professional workflows, this improvement may matter more than any single benchmark score. **A model that says "I'm not sure here" is more usable in long-running, unsupervised agentic workflows than a model with a higher score that confidently gets things wrong.**

## Alignment: Misalignment Rates Now Approach Mythos Levels

Anthropic's alignment team concluded that Opus 4.8 "sets new highs in measuring prosocial traits — supporting user autonomy, acting in the user's best interest, and related behaviors."

The more significant data point: **Opus 4.8's rate of misaligned behaviors (deception, facilitating misuse, etc.) is markedly lower than Opus 4.7's, and now approaches the levels of Claude Mythos Preview — Anthropic's best-performing model on alignment.** The full alignment evaluation and a suite of pre-deployment safety tests are documented in the Opus 4.8 System Card.

## Three Feature Updates Shipped Alongside the Model

Beyond the model itself, Anthropic rolled out three companion updates, two of which directly address the most common Opus 4.7 user complaint: excessive thinking time.

**1. Effort Control.** A new selector appears next to the model picker on claude.ai and in Cowork, letting users manually set how much compute and token budget Claude dedicates to a task. Opus 4.8 defaults to "high" — consuming roughly the same token volume as Opus 4.7's default setting but delivering better results. Users can also select "extra" (mapped to `xhigh` in Claude Code) or "max" to trade more tokens for higher quality. Anthropic recommends the "extra" setting for difficult tasks and long-running asynchronous workflows, and has raised Claude Code's rate limits accordingly.

**2. Dynamic Workflows (Research Preview).** Available on Claude Code for Enterprise, Team, and Max plans, this feature lets Claude first plan a task, then spin up **hundreds of sub-agents in parallel within a single session**, and self-verify outputs before reporting back. The flagship use case Anthropic highlights: Claude Code with Opus 4.8 can take a repository-level migration from kickoff to merge across hundreds of thousands of lines of code, using the existing test suite as the acceptance gate.

**3. Messages API: Inline System Messages.** The Messages API now supports inserting `system` entries inside the `messages` array. This means developers can update Claude's instructions mid-task — adjusting permissions, token budgets, or environmental context — without breaking prompt caches or disguising the update as a user turn.

## Pricing and Availability: Unchanged, With Fast Mode 3x Cheaper

Opus 4.8 is available across all platforms as of today. **Standard pricing matches Opus 4.7 exactly: $5 per million input tokens, $25 per million output tokens.** Developers can access it via the Claude API using the model ID `claude-opus-4-8`.

The change is in **fast mode**: it runs at roughly 2.5x speed and costs $10/$50 per million input/output tokens (2x the standard rate) — but that unit price is **3x cheaper** than the fast mode of the previous Claude generation. This adjustment aligns with the broader industry trend of driving down per-inference costs even as capabilities improve, and it has significant implications for cost-sensitive, high-throughput use cases.

## What's Next: Mythos-Class Models Coming to All Customers

Anthropic reiterated its forward-looking roadmap in the announcement: it plans to release a **new class of models with intelligence levels beyond Opus**. As part of Project Glasswing, a small number of organizations are already using Claude Mythos Preview for cybersecurity-related work. Because models at this capability tier require stronger cybersecurity safeguards before broad deployment, Anthropic says it is fast-tracking those protections and **expects to bring Mythos-class models to all customers "within the coming weeks."**

A caveat: the strongest publicly available model remains Opus 4.8. Mythos-class models are not yet generally accessible, and their actual capabilities and release timeline carry some uncertainty.

## The Bottom Line

Claude Opus 4.8 is a clearly positioned **consolidation update**, not a disruptive leap. It holds pricing steady while pushing coding (particularly on the harder SWE-bench Pro), agentic terminal tasks, and knowledge work up a notch across the board, with an anomalously large jump on USAMO 2026 math proofs.

But its real differentiation lies not in any single benchmark number, but in two relatively "soft" dimensions: **first, honesty** — fewer confident errors, more proactive disclosure of uncertainty; **second, alignment** — misalignment rates now approaching Mythos levels. For users chasing absolute terminal coding performance, GPT-5.5 still holds the edge on Terminal-Bench 2.1. But for professional workflows that demand long-running, trustworthy, low-risk delegation of real work, **Opus 4.8's reliability gains may matter more than any score.**

Given that it arrived only 41 days after Opus 4.7 and Anthropic has explicitly previewed Mythos-class models on the horizon, Opus 4.8 reads most accurately as a **steady transition the night before a larger launch.**