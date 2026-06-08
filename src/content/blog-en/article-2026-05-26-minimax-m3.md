---
title: "MiniMax M3 Review: The Cost-Effective Multimodal Model with 1M Token Context and Blazing Fast Decoding"
date: "2026-06-01"
tag: "Benchmark"
excerpt: "MiniMax M3 introduces a groundbreaking architecture that processes up to 1 million tokens with 15.6x faster decoding speeds, making it highly competitive in benchmarks against models like GPT-5.2 and Claude Opus 4.7. With its affordable pricing, starting at $0.30 per 1 million tokens during launch, it offers a cost-effective alternative for developers seeking powerful multimodal capabilities."
---

On June 1, 2026, Chinese AI startup MiniMax (Shanghai) officially unveiled its flagship model, MiniMax M3. Unlike its M2.x series, which focused on code generation, M3 is positioned as a "full-office scenario" model, natively supporting text, images, video, and computer use as a multimodal model.

This article provides a detailed breakdown of M3's unique MSA (MiniMax Sparse Attention) architecture, key benchmark results, API pricing, and comparisons with existing models.

![MiniMax M3 architecture](/images/blog/article-2026-05-26-minimax-m3/img-1-hero.png)

## What is MiniMax M3?

MiniMax M3 is a next-generation multimodal large language model that completely revamps the M2.x series. Key specifications include:

| Item | Specification |
|------|---------------|
| Developer | MiniMax (Shanghai, China) |
| Release Date | June 1, 2026 |
| Context Length | Up to 1 million tokens |
| Multimodal Support | Text, images, video, computer use |
| Architecture | MSA (MiniMax Sparse Attention) |
| API Price (Regular) | Input: $0.60 per 1M tokens, Output: $2.40 per 1M tokens |
| API Price (Launch Discount) | Input: $0.30 per 1M tokens, Output: $1.20 per 1M tokens |
| Open Weights | Scheduled for release within about 10 days after launch |

The biggest innovation in M3 is its proprietary "MSA (MiniMax Sparse Attention)" architecture, which fundamentally differs from traditional full-attention mechanisms, reducing per-token computation to 1/20th for processing 1 million token contexts.

## MSA Architecture: Why 1 Million Tokens is Practical

### Limitations of Previous Architectures

The M2.x series used a "full-attention" method, which offers high accuracy but incurs quadratic computational cost as context length increases, making processing of 1 million token-level texts impractical.

Particularly during reinforcement learning (RL) training, linear attention or conventional sparse attention caused numerical convergence issues, leading to accuracy degradation in complex multi-step reasoning.

### Design Philosophy of MSA

MSA addresses these challenges fundamentally. Its core aspects include:

1. **Context Compression**: Efficiently compressing 1 million token inputs to extract and process only necessary information.

2. **Dynamic Sparsity**: Dynamically allocating computational resources, focusing on important tokens.

3. **RL Compatibility**: Designed to ensure numerical stability during reinforcement learning.

### Speed Improvements Proven by Benchmarks

The effects of MSA have been quantitatively measured:

- **Prefill Speed**: Over **9x faster** compared to previous models.

- **Decode Speed**: **15.6x faster** compared to previous models.

- **Computation per Token**: For 1 million token contexts, **1/20th** of previous computation.

These are not just theoretical values but directly impact real-world API response times. For example, summarizing a 1 million token document that previously took minutes with other models might now be completed in seconds with M3.

## Benchmark Results: Rivaling Top Models

### Code Generation Capabilities

M3 has achieved top-tier results in code generation benchmarks:

![Benchmark comparison](/images/blog/article-2026-05-26-minimax-m3/img-2-benchmark.jpg)

| Benchmark | M3 | GPT-5.5 | Claude Opus 4.7 | Claude Opus 4.8 | DeepSeek V3.2 |
|-----------|-----|---------|-----------------|-----------------|---------------|
| SWE-Bench Pro | **59.0%** | 58.6% | 64.3% | 69.2% | 49.2% |
| Terminal-Bench 2.1 | **66.0%** | 62.1% | 68.5% | 74.6% | 54.8% |

On SWE-Bench Pro, M3 slightly outperforms GPT-5.5 and nearly matches Claude Opus 4.7, marking an unprecedented achievement for a Chinese-developed model. However, it's important to note that Claude Opus 4.8, released just three days before M3's launch, shows significantly higher scores (69.2% vs 59.0% on SWE-Bench Pro).

**Benchmark Credibility Note**: All of M3's launch benchmarks were run on MiniMax's own infrastructure using their configured agent scaffolding. Independent evaluations from Artificial Analysis and LMArena were still pending at publication. Developers should run their own evaluations before committing production workloads.

### Real-World Code Audit: Kilo's Head-to-Head Test

The most interesting data point comes from Kilo Code, who ran the same code audit task on both Claude Opus 4.8 (at four reasoning levels) and MiniMax M3. They used a TypeScript webhook delivery service with 17 known bugs and measured what each model caught.

**The results surprised me:**

| Model | Issues Found | Cost | Time |
|-------|-------------|------|------|
| MiniMax M3 | 13/17 | $0.07 | 5m 03s |
| Claude Opus 4.8 (medium) | 13/17 | $1.30 | 3m 53s |
| Claude Opus 4.8 (high) | 13/17 | $1.93 | 4m 33s |
| Claude Opus 4.8 (xhigh) | 15/17 | $2.03 | 7m 26s |
| Claude Opus 4.8 (max) | 15/17 | $3.39 | 9m 24s |

MiniMax M3 found the same number of issues as Claude Opus 4.8 at medium and high settings, but at **1/18th the cost**. That's not a typo—$0.07 vs $1.30.

**What M3 caught that cheaper Claude runs missed:**
- An endpoint that returned a stored secret
- A delivery-list filter bug when two filters were combined
- Subscriber deletion failing once delivery history exists

**What M3 missed that Claude Opus 4.8 at xhigh caught:**
- Invalid JSON returning a 500
- Database setup running at import time
- Async callback running inside a synchronous transaction

As @daheiniu2026 pointed out on X: "Looking close at the 3 bugs MiniMax missed, they're tightly coupled with specific TS/Bun runtime quirks, like async callbacks inside sync transactions. M3 nails hard security logic but still lags behind Opus in deep language-specific edge cases."

That's a fair assessment. M3 gets the big-picture security stuff right, but Claude's higher reasoning levels catch the subtle language-specific issues.

### Agent Capabilities

M3 also excels in agent applications:

| Benchmark | M3 | GPT-5.2 | Claude Opus 4.7 |
|-----------|-----|---------|-----------------|
| MCP Atlas | **74.2%** | 71.8% | 76.1% |
| BrowseComp | **83.5** | 80.2 | 85.3 |

On MCP Atlas (tool calling accuracy), M3 scores 74.2%, ensuring sufficient precision for practical agent development.

### Multimodal Capabilities

It also demonstrates high performance in image and video understanding:

![MLE-Bench results](/images/blog/article-2026-05-26-minimax-m3/img-4-mle-bench.png)

| Benchmark | M3 | GPT-5.2 | Gemini 3.0 Pro |
|-----------|-----|---------|----------------|
| PostTrainBench | **0.37** | 0.35 | 0.39 |
| MLE-Bench | **52.1%** | 48.7% | 54.3% |

### Practicality of 1 Million Token Context

M3's 1 million token context is not just a marketing figure. In demonstrations, the following were showcased:

- **24-hour CUDA Kernel Optimization**: Reading a legacy codebase with 1 million tokens, achieving a 9.4x speed improvement.

- **12-hour Paper Restoration**: Completely re-implementing code from academic papers from scratch.

These demos indicate M3's capability to effectively utilize long-context processing.

## Price Comparison: About 1/3 the Cost of GPT-5.2

M3's API pricing is highly competitive compared to models of similar quality:

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Notes |
|-------|-----------------------|------------------------|-------|
| **MiniMax M3** | **$0.30** | **$1.20** | Launch discount applied |
| MiniMax M3 (Regular) | $0.60 | $2.40 | After discount ends |
| GPT-5.2 | $2.50 | $10.00 | OpenAI |
| Claude Opus 4.7 | $15.00 | $75.00 | Anthropic |
| Claude Opus 4.8 | $5.00 | $25.00 | Anthropic |
| Gemini 3.0 Pro | $1.25 | $5.00 | Google |
| Grok 4 | $3.00 | $15.00 | xAI |
| DeepSeek V3.2 | $0.27 | $1.10 | DeepSeek |

With the launch discount, M3 is about 1/8 the cost of GPT-5.2, and even at regular pricing, it's about 1/4. Compared to DeepSeek V3.2, M3 maintains much higher benchmark scores while achieving comparable pricing levels.

**Pricing Reality Check**: The widely circulated "$0.27 vs $5.00" comparison comes from launch-week promotional pricing (50% discount). At standard rates ($0.60/M input), M3 is roughly 10x cheaper than Claude Opus 4.8 ($5-6/M input at volume) — still a meaningful advantage, but not the 15-25x headline figure.

Token plans are also available, with monthly subscriptions at $20, $50, and $120. The $20 plan offers approximately 1.7 billion M3 tokens per month, making it particularly attractive for high-volume usage.

## Real-World Use Cases and Experiences

### Use Cases for Developers

M3 excels particularly in the following scenarios:

**Understanding Large Codebases**: With 1 million token context, it can read entire repositories at once. Ideal for refactoring legacy code or reviewing large pull requests.

![Coding benchmarks](/images/blog/article-2026-05-26-minimax-m3/img-5-coding-bench.png)

**Agent Development**: With MCP Atlas accuracy of 74.2%, it provides a practical level for agent applications that heavily use tool calling. BrowseComp's 83.5 indicates reliability for web-operating agents.

**Multimodal Processing**: Native support for images and videos enables use in document screenshot analysis or automated UI testing.

### Expansion into Office Scenarios

MiniMax designed M3 for "full-office scenarios." Specifically:

- Cross-analysis of multiple spreadsheets and documents.

- Automated generation of presentation materials.

- Summarization of email threads and creation of reply drafts.

- Extraction of action items from meeting transcripts.

![Office benchmarks](/images/blog/article-2026-05-26-minimax-m3/img-6-office-bench.png)

While these use cases were possible with previous models, M3's 1 million token context and fast decoding allow processing of larger volumes of documents more quickly.

## M3 vs. Existing Models: Which to Choose?

### GPT-5.2 vs. M3

- **Accuracy**: GPT-5.2 may slightly outperform in some areas, but M3 is at a comparable level.

- **Speed**: M3 is 15x faster (with 1 million token context).

- **Price**: M3 is about 1/3 to 1/8 the cost of GPT-5.2.

- **Conclusion**: Choose M3 for cost efficiency, GPT-5.2 for maximum accuracy.

### Claude Opus 4.7 vs. M3

- **Accuracy**: Claude Opus 4.7 outperforms overall (e.g., SWE-Bench Pro 64.3% vs. 59.0%).

- **Speed**: M3 is significantly faster.

- **Price**: M3 is about 1/25 to 1/50 the cost of Claude.

- **Conclusion**: Choose Claude for highest quality, M3 for cost-performance ratio.

### Claude Opus 4.8 vs. M3

- **Accuracy**: Claude Opus 4.8 shows significant improvements over 4.7 (SWE-Bench Pro 69.2% vs 59.0%).

- **Speed**: M3 is still faster with MSA architecture.

- **Price**: M3 is about 10x cheaper at standard pricing.

- **Conclusion**: Opus 4.8 is the clear winner on autonomous software tasks, but M3 offers dramatically better cost efficiency.

### Grok 4 vs. M3

- **Accuracy**: Grok 4 excels in reasoning tasks (Humanity's Last Exam: 44.4% with tools), while M3 leads in coding benchmarks.

- **Context Window**: Both support 1M tokens, but M3's MSA architecture provides faster processing.

- **Price**: Grok 4 is significantly more expensive ($3.00/$15.00 per 1M tokens).

- **Multimodal**: M3 natively supports video processing; Grok 4 does not.

- **Conclusion**: Choose Grok for advanced reasoning tasks, M3 for cost-effective coding and long-context work.

### DeepSeek V3.2 vs. M3

- **Accuracy**: M3 clearly outperforms.

- **Speed**: Similar (both are fast).

- **Price**: Similar levels.

- **Conclusion**: At the same price range, M3 offers higher performance.

## What the Community is Saying

The response on X has been mixed but interesting:

**The good:**
- Developers are impressed by the cost savings. One user noted they could run 18 M3 audits for the price of one Claude Opus 4.8 run at medium.
- The 1M token context is getting real usage for large codebase analysis.
- Several users report it works well for debugging and catching security issues.

**The skeptical:**
- @shahidcodes commented "Share the repo or it never happened" — reflecting the community's desire for more transparency around benchmarks.
- @SoonCrush asked "Why compare it with 4.8? The two models 4.8 and 4.7 are pure garbage" — a hot take, but shows some users are frustrated with the benchmark arms race.
- Some users note that M3 can be "chatty" — using more output tokens than necessary, which increases costs.

**The competitive:**
- @chetaslua pointed out that "Kimi K2.6 is godly in terms of webdev and still SOTA chinese model" — reminding us that M3 isn't the only game in town.
- Multiple users are waiting for the open weights to ship before committing to the model.

## Conclusion

As of June 2026, MiniMax M3 represents the most interesting cost-efficiency bet on the frontier coding market. Its MSA architecture enabling 1 million token support and 15.6x faster decoding speeds provide significant practical advantages. With code generation capability of 59.0% on SWE-Bench Pro and agent capability of 74.2% on MCP Atlas, it sits in the same tier as GPT-5.5 on coding benchmarks.

**What M3 delivers:**
- Competitive SWE-Bench Pro score (59%) at a fraction of frontier pricing
- MSA architecture with genuine long-context efficiency gains
- Native multimodal training (not a fine-tuned add-on)
- BrowseComp score of 83.5 beats published Opus 4.7 figures on autonomous web tasks

**What M3 is not:**
- A validated drop-in replacement for Opus 4.8 (59% vs 69.2% on SWE-Bench Pro)
- Independently verified (all benchmarks are vendor-run)
- Fully open-source yet (weights promised by ~June 11)

**Practical recommendation:** Watch for the open weights around June 11. If the technical report confirms the MSA efficiency claims and the license permits commercial use, M3 becomes a serious option for teams doing cost-sensitive long-context agentic work on non-sensitive data. For teams with compliance exposure to Chinese data jurisdiction, wait for the open weights and self-host.

For developers considering processing large codebases, analyzing long documents, or developing cost-efficient agents, M3 is one of the most promising models to watch this summer — but run your own evaluations before committing production workloads.

---

**Related Links**
- [Kilo's Code Audit: Claude Opus 4.8 vs MiniMax M3](https://x.com/kilocode/status/2063719228499542327)
- [MiniMax M3 Official Blog](https://www.minimax.io/blog/minimax-m3)
- [MiniMax M3 on OpenRouter](https://openrouter.ai/minimax/minimax-m3)

---

## Related Articles

- [2026年AI価格競争：中国勢が突きつける「超低コスト」の衝撃と実効性能の正体](/blog/blog-2026-05-28-ws3hli)
- [SWE-bench Verified 2026最新ランキング：90モデルのコーディング性能を徹底比較](/blog/swe-bench-verified-2026-90)
- [GPT-5.2のベンチマーク総まとめ：コーディング・推論性能を徹底検証](/blog/gpt-5-2-benchmark-review)
