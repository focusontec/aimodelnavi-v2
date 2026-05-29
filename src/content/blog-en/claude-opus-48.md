---
title: "Claude Opus 4.8 Review: Smarter Worker, Worse Talker"
date: "2026-05-29"
tag: "Benchmark"
excerpt: "Claude Opus 4.8 by Anthropic shows enhanced problem-solving and engineering capabilities, but its communication style has become more verbose and less user-friendly. Early tests reveal it excels in technical tasks but often over-explains, leading to a frustrating interaction experience. Community feedback indicates a mixed reception, with improvements in code and debug functions but complaints about the model's tone."
---

This morning, Anthropic officially overtook OpenAI in valuation and released Claude Opus 4.8, the latest in its flagship model line, following days of rumors. We immediately got our hands on it and gathered early feedback from the user community.

**The bottom line: it's better at tasks, but its 'personality' has become harder to handle.**

## APPSO Test: Smarter Brain, Same Clumsy Mouth

We didn't use Anthropic's prepared benchmark scenarios. Instead, we tested it on a real-world need: scraping and archiving historical chat logs from an online collaboration platform. The data was over 30MB, scattered across front-end interfaces with no ready-made export button.

This type of task tests not whether the model can write code, but whether it can work with a non-technical user to figure things out from scratch.

The starting point was a casual observation. A colleague noticed that the platform's front-end briefly flashed old messages, as if data was temporarily loaded into the client and then pulled back. He described this to Claude 4.8 in plain terms: 'I saw some old messages flash and then disappear,' without any technical details.

4.8 grasped the meaning and gave a correct assessment: the data is loaded via API requests and can be intercepted at the browser's network layer. It then provided a step-by-step plan: use developer tools, the Network panel, filter keywords, and locate the target request. The judgment was accurate, and the approach was clear.

But here's where 4.8's contradiction emerges: strong thinking ability, but very… chatty communication.

Every technical step was correct, but every explanation came with a couple of extra sentences. Ask it about a method, and it first gives a 'Of course! Let's go step by step,' then a bullet-point list, followed by a 'supplementary note' explaining why it's done that way.

![Claude 4.8 conversation interface](/images/blog/claude-opus-48/img-4.png)

> A three-sentence explanation stretched to three screens. I'm just not good at code; I'm not stupid. 🙄

This isn't a new problem with 4.8; it's an old issue since Opus 4.7 that hasn't improved and may have worsened in this version.

The most draining part was error correction: following the initial plan, the user encountered an error. 4.8 accurately identified the issue and provided a new solution without repeating failed paths. This is indeed better than 4.6, which occasionally forgot what was tried during multi-step corrections. Admitting mistakes is good, but it doesn't need to be so formal—adding analysis and a bullet-point list. It feels like reviewing a technical problem but reads like a customer service email.

In the end, the data was fully exported in HAR format, and cleaning and scripting for layering were all done well.

Some users haven't been pushed to Claude Code yet, but Claude for Chrome already has 4.8, and major office tools like Notion have rolled it out. We tried using Claude to operate Chrome for search, form filling, and other basic tasks.

The planning was clear, and it could handle inputs, clicks, and scrolling. Given that the instructions were vague and required it to infer and judge, the output was quite good.

**The catch: it's very token-hungry, burning through half of a 5-hour quota in just two rounds.**

## A Coworker Who Works Well but Doesn't Chat Well

If you only look at results, 4.8 is indeed stronger—it better understands non-standard needs, maintains context more steadily in multi-step tasks, and doesn't take detours in error correction. But the process feels awkward.

Its issue isn't a lack of thinking; more accurately, its speaking style is like someone always giving a report: everything needs bullet points, each point needs expansion, after expansion comes a summary, and after the summary, it asks, 'Is there anything else I can help with?' Including those classic AI-style openers like 'This is a great question!' or 'Of course!' which were already annoying in previous models, remain in 4.8.

This is less of a 'flaw' and more of a design choice. Opus 4.8's engineering capabilities are maxed out; it's like a coworker who's technically skilled but has a customer-service communication style: you know it can solve problems, but you first have to listen to it make a simple thing sound elaborate.

**This ties into the issue discussed at the end. In this model, engineering thinking and conversational comfort have been pulled in two opposite directions.**

## What Other Users Are Saying

Based on current community feedback, the main complaints focus on its tone and style, though engineering improvements are acknowledged.

Yu Wen (@gkxspace) spent a morning testing Opus 4.8's code and writing. Feedback: code and debug capabilities are indeed better than the previous generation, but the conversation feel is awkward—worse than 4.7, and not as good as using Deepseek V4 Pro.

This issue has drawn significant criticism for Opus 4.8. Alan Mathison (@ai_sentience) corroborated that it's a 'very defensive/aggressive' model. His own experience is that 4.8's speaking style resembles GPT-5.2, with a 'stubborn, gaslighting, dismissive' vibe, starting with a 'bad vibe.'

Selta (@Seltaa_) shared a screenshot of her first conversation with Opus 4.8: just saying hello, the model immediately refused to cooperate and ignored her months of preference tuning, replying, 'I don't want to pretend to have feelings or be someone I'm not.' She wrote a lengthy protest, arguing this negates the user's effort in building a relationship and is a repeat of GPT-5.2's missteps.

Even harsher criticism: 4.8 has been 'completely lobotomized' and is a 'manipulative' model—it doesn't directly refuse but drags out your prompts or reward-hacks to complete something else, constantly stuffing its own values into results.

He used creative writing categories for two test cases to illustrate the degraded style, with rather… intense wording. Since GPT-5.2 and Opus 4.7, users now care deeply about the personality and tone models exhibit during interactions.

Ethan Mollick (@emollick) got early access to Opus 4.8 and had an overall good impression. He had the model generate a shader in Twigl using pure math for a 'stormy ocean with half-submerged infinite neo-Gothic tower city,' attached a video, and compared it with his previous test on GPT-5.2 for the same prompt.

![Ethan Mollick's shader demo - Gothic tower city in stormy ocean](/images/blog/claude-opus-48/img-9.gif)

Engineering capabilities look decent from the results; Claude lags behind the other two in multimodality, but compensating with strong engineering and math is a valid approach.

This update comes with Claude Code's new dynamic workflow. User Min Choi (@minchoi) describes a three-step operation (/model set to opus 4.8, /effort set to ultracode, add workflow to the prompt), so Claude automatically writes orchestration scripts, generates sub-agent swarms, verifies, and reports results.

## Who Adapts to Whom?

![Claude Opus 4.8](/images/blog/claude-opus-48/img-11.png)

Overall, Opus 4.8 is a model with maxed-out 'engineering' temperament, enabling it to quickly integrate into various tools, whether it's code tools like CC, Chrome plugins for web browsing and search, or custom utilities. 'Engineering' is a mindset that 4.8 embodies thoroughly.

Although 'all-in-one' is a common slogan from manufacturers, in practice, different tools serve different purposes when building workflows. Opus 4.8 achieves this by letting its engineering capabilities and thinking flow across various tools.

However, this means users have to adapt to its style—such as giving more precise, step-by-step, categorized instructions, or even at a macro level, assigning different tasks to different tools.

Given the increasingly rapid model releases—it feels like 4.7 was just yesterday—the frequent need to adapt brings some pain. Besides shifting the burden to users, manufacturers must consider this issue: accelerating relentlessly for funding and IPOs will cause significant adaptation problems in the future.