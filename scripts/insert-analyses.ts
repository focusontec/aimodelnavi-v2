/**
 * Batch insert model analyses into the database.
 * Usage: npx tsx scripts/insert-analyses.ts
 */

import { getDb, migrate } from "./lib/db";

migrate();
const db = getDb();

interface Analysis {
  slug: string;
  keyMetrics: { label: string; value: string; context?: string }[];
  pros: string[];
  cons: string[];
  competitorTable: { name: string; arena?: string; swe?: string; gpqa?: string; price?: string }[];
  summary: string;
  performance: string;
  comparisons: string;
  community: string;
  useCaseDeep: string;
  latestNews: string;
  sources: { title: string; url: string }[];
}

const analyses: Analysis[] = [
  {
    slug: "gpt-5-4",
    keyMetrics: [
      { label: "Arena Elo", value: "1467", context: "#9 overall" },
      { label: "SWE-Bench Verified", value: "80.8%", context: "vs Claude Opus 4.7: 87.6%" },
      { label: "SWE-Bench Pro", value: "57.7%", context: "vs Claude Opus 4.7: 64.3%" },
      { label: "GPQA Diamond", value: "94.4%", context: "near parity with frontier" },
      { label: "Input Price", value: "$2.50/1M", context: "vs Claude Opus 4.7: $5/1M" },
      { label: "Context Window", value: "1.05M tokens", context: "largest in GPT-5 family" },
    ],
    pros: [
      "Best-in-class web research (BrowseComp 89.3%)",
      "Strong terminal-heavy coding (Terminal-Bench 75.1%)",
      "Competitive pricing at $2.50/$15 per 1M tokens",
      "1M context window with strong retrieval",
    ],
    cons: [
      "Trails Claude Opus 4.7 on agentic coding (SWE-bench Pro 57.7% vs 64.3%)",
      "Weaker multi-tool orchestration than Claude (MCP-Atlas 68.1% vs 77.3%)",
      "Computer use below Claude Opus 4.7 (OSWorld 75.0% vs 78.0%)",
    ],
    competitorTable: [
      { name: "Claude Opus 4.7", arena: "~1500", swe: "87.6%", gpqa: "94.2%", price: "$5/$25" },
      { name: "Gemini 3.1 Pro", arena: "~1485", swe: "84.2%", gpqa: "94.3%", price: "$2/$12" },
      { name: "GPT-5.4", arena: "1467", swe: "80.8%", gpqa: "94.4%", price: "$2.50/$15" },
    ],
    summary: `GPT-5.4 is OpenAI's flagship model released on March 5, 2026, positioned as a versatile frontier model for professional work. Built on the GPT-5 architecture with explicit chain-of-thought reasoning, it offers a 1.05M token context window and competitive benchmark performance across coding, reasoning, and knowledge tasks.

The model's strongest category is knowledge work (#1 on BenchLM), making it particularly effective for research, analysis, and factual Q&A. It excels at web research with an 89.3% BrowseComp score and handles terminal-heavy coding well at 75.1% on Terminal-Bench 2.0. At $2.50/$15 per 1M tokens, it offers strong value compared to Claude Opus 4.7's $5/$25 pricing.

However, GPT-5.4 trails Claude Opus 4.7 in agentic coding scenarios (57.7% vs 64.3% on SWE-bench Pro) and multi-tool orchestration (68.1% vs 77.3% on MCP-Atlas). For teams prioritizing web research, terminal workflows, or cost efficiency, GPT-5.4 remains the better choice.`,
    performance: `## Benchmark Scores

| Benchmark | GPT-5.4 | Claude Opus 4.7 | Gemini 3.1 Pro |
|-----------|---------|-----------------|----------------|
| Arena Elo | 1467 | ~1500 | ~1485 |
| SWE-bench Verified | 80.8% | 87.6% | 84.2% |
| SWE-bench Pro | 57.7% | 64.3% | 54.2% |
| GPQA Diamond | 94.4% | 94.2% | 94.3% |
| Terminal-Bench 2.0 | 75.1% | 69.4% | 68.5% |
| BrowseComp | 89.3% | 79.3% | 85.9% |
| OSWorld-Verified | 75.0% | 78.0% | 76.5% |
| MCP-Atlas | 68.1% | 77.3% | 73.9% |

GPT-5.4 leads on web research and terminal coding benchmarks, while Claude Opus 4.7 dominates agentic coding and tool orchestration.`,
    comparisons: `## GPT-5.4 vs Claude Opus 4.7

GPT-5.4 costs 50% less than Claude Opus 4.7 ($2.50/$15 vs $5/$25) and leads on web research (+10 points on BrowseComp) and terminal coding (+5.7 points on Terminal-Bench). Claude Opus 4.7 responds with superior agentic coding (6.6 points higher on SWE-bench Pro) and tool orchestration (9.2 points on MCP-Atlas).

**Choose GPT-5.4** for web research, terminal-heavy work, or cost-sensitive deployments.
**Choose Claude Opus 4.7** for autonomous multi-file coding and complex tool chains.

## GPT-5.4 vs Gemini 3.1 Pro

Both offer similar pricing ($2.50/$15 vs $2/$12) and 1M context. Gemini 3.1 Pro edges ahead on hallucination resistance and scientific reasoning, while GPT-5.4 leads on coding benchmarks and web research.`,
    community: `GPT-5.4 received a measured reception from the developer community. The pricing at $2.50/$15 was seen as reasonable for a frontier model, and the 1.05M context window was welcomed for long-document workflows.

However, the release was overshadowed by Claude Opus 4.7's launch just weeks later, which delivered superior agentic coding performance. Developers building coding agents largely migrated to Claude, while GPT-5.4 retained its user base for research, analysis, and general-purpose tasks.

Enterprise adoption has been steady, particularly among teams already in the OpenAI ecosystem. The model's strength in knowledge work and web research makes it a solid choice for knowledge-intensive applications.`,
    useCaseDeep: `1. **Web Research & Analysis**: With 89.3% on BrowseComp, GPT-5.4 is the best model for automated web research, fact-checking, and information synthesis across multiple sources.

2. **Terminal-Heavy Development**: Terminal-Bench 2.0 score of 75.1% makes it ideal for DevOps, system administration, and command-line workflow automation.

3. **Document Analysis**: The 1.05M context window enables processing entire codebases, legal documents, or research paper collections in a single pass.

4. **Cost-Sensitive Production**: At $2.50/$15, it offers frontier-level capability at roughly half the cost of Claude Opus 4.7, making it suitable for high-volume API workloads.`,
    latestNews: `GPT-5.4 was released on March 5, 2026, as the first model in the GPT-5.4 family (alongside GPT-5.4 Pro, Mini, and Nano). It was superseded by GPT-5.5 on April 23, 2026, which delivered significant improvements in agentic coding (Terminal-Bench 2.0: 82.7%) while maintaining the same per-token latency. GPT-5.4 remains available and is recommended for cost-sensitive workloads.`,
    sources: [
      { title: "BenchLM.ai: GPT-5.4 Benchmarks", url: "https://benchlm.ai/models/gpt-5-4" },
      { title: "OpenAI: Introducing GPT-5.4", url: "https://openai.com/index/introducing-gpt-5-4/" },
      { title: "OpenAI API: GPT-5.4 Model", url: "https://developers.openai.com/api/docs/models/gpt-5.4" },
    ],
  },
  {
    slug: "gpt-5-5",
    keyMetrics: [
      { label: "Terminal-Bench 2.0", value: "82.7%", context: "SOTA, up from 75.1% (GPT-5.4)" },
      { label: "Expert-SWE", value: "73.1%", context: "internal frontier eval" },
      { label: "SWE-Bench Pro", value: "58.6%", context: "vs GPT-5.4: 57.7%" },
      { label: "Input Price", value: "$5/1M", context: "2x GPT-5.4" },
      { label: "Output Price", value: "$30/1M", context: "2x GPT-5.4" },
      { label: "Context Window", value: "1M tokens", context: "same as GPT-5.4" },
    ],
    pros: [
      "State-of-the-art agentic coding (Terminal-Bench 82.7%)",
      "More token-efficient than GPT-5.4 — fewer tokens for same tasks",
      "Matches GPT-5.4 latency despite higher intelligence",
      "Strong computer use and knowledge work capabilities",
    ],
    cons: [
      "2x price of GPT-5.4 ($5/$30 vs $2.50/$15)",
      "Trails Claude Opus 4.7 on SWE-bench Pro (58.6% vs 64.3%)",
      "API availability limited — rolling out gradually",
    ],
    competitorTable: [
      { name: "Claude Opus 4.7", arena: "~1500", swe: "87.6%", gpqa: "94.2%", price: "$5/$25" },
      { name: "GPT-5.5", arena: "N/A", swe: "N/A", gpqa: "N/A", price: "$5/$30" },
      { name: "GPT-5.4", arena: "1467", swe: "80.8%", gpqa: "94.4%", price: "$2.50/$15" },
    ],
    summary: `GPT-5.5 is OpenAI's most capable model, released on April 23, 2026. It represents a significant step up in agentic coding, computer use, and knowledge work while matching GPT-5.4's per-token latency — a notable engineering achievement.

The model's headline achievement is 82.7% on Terminal-Bench 2.0, a new state-of-the-art for complex command-line workflows. On Expert-SWE, OpenAI's internal frontier eval for long-horizon coding tasks (median 20 hours human completion time), GPT-5.5 outperforms GPT-5.4 significantly. It also uses fewer tokens to complete the same Codex tasks, making it both more capable and more efficient.

At $5/$30 per 1M tokens, GPT-5.5 is priced 2x higher than GPT-5.4 but delivers substantially better performance on agentic tasks. For teams building production coding agents, the efficiency gains (fewer tokens, fewer retries) may offset the higher per-token cost.`,
    performance: `## Benchmark Scores

| Benchmark | GPT-5.5 | GPT-5.4 | Claude Opus 4.7 |
|-----------|---------|---------|-----------------|
| Terminal-Bench 2.0 | 82.7% | 75.1% | 69.4% |
| Expert-SWE (Internal) | 73.1% | 68.5% | N/A |
| SWE-Bench Pro | 58.6% | 57.7% | 64.3% |
| GDPval (wins/ties) | 84.9% | 83.0% | 80.3% |

GPT-5.5 delivers state-of-the-art performance on terminal-heavy coding and knowledge work, with significant improvements over GPT-5.4 while using fewer tokens.`,
    comparisons: `## GPT-5.5 vs Claude Opus 4.7

GPT-5.5 leads on Terminal-Bench 2.0 (82.7% vs 69.4%) and knowledge work (GDPval 84.9% vs 80.3%), while Claude Opus 4.7 leads on SWE-bench Pro (64.3% vs 58.6%) and tool orchestration. Both are priced at $5/1M input, but GPT-5.5's output pricing ($30/1M) is higher than Claude's ($25/1M).

## GPT-5.5 vs GPT-5.4

GPT-5.5 offers 7.6 points higher on Terminal-Bench 2.0 and 4.6 points higher on Expert-SWE, while matching per-token latency. The 2x price increase is offset by token efficiency — GPT-5.5 uses fewer tokens to complete the same tasks.`,
    community: `GPT-5.5 was received with enthusiasm by the coding agent community. The Terminal-Bench 2.2% score was seen as a breakthrough, and early Codex users reported significantly better results on complex multi-file engineering tasks.

The pricing at $5/$30 drew some criticism, with developers noting it's 2x GPT-5.4's price. However, OpenAI's argument about token efficiency resonated with production teams — if GPT-5.5 uses 30% fewer tokens, the effective cost increase is closer to 40% rather than 100%.

Enterprise adoption has been cautious due to the gradual API rollout, with most teams waiting for full availability before migrating from GPT-5.4.`,
    useCaseDeep: `1. **Production Coding Agents**: Terminal-Bench 82.7% makes it the best model for autonomous coding workflows that involve planning, iteration, and tool coordination.

2. **Complex Knowledge Work**: GDPval 84.9% indicates strong performance on multi-step research, analysis, and document generation tasks.

3. **Computer Use Automation**: Improved OSWorld performance makes it suitable for GUI testing, software automation, and visual workflow tasks.

4. **Scientific Research**: Early testers report strong performance on research partner tasks — critiquing manuscripts, stress-testing arguments, and working with code and PDFs.`,
    latestNews: `GPT-5.5 was released on April 23, 2026, with GPT-5.5 Pro following for Pro, Business, and Enterprise users. The API rollout is gradual, with full availability expected within weeks. GPT-5.5 Pro is priced at $30/$180 per 1M tokens for even higher accuracy.`,
    sources: [
      { title: "OpenAI: Introducing GPT-5.5", url: "https://openai.com/index/introducing-gpt-5-5/" },
      { title: "OpenAI API: GPT-5.5 Model", url: "https://developers.openai.com/api/docs/models/gpt-5.5" },
    ],
  },
  {
    slug: "claude-opus-4-5",
    keyMetrics: [
      { label: "Arena Elo", value: "1468", context: "#6 overall at launch" },
      { label: "SWE-Bench Verified", value: "72.8%", context: "at launch (Sept 2025)" },
      { label: "Input Price", value: "$5/1M", context: "same as Opus 4.7" },
      { label: "Output Price", value: "$25/1M", context: "same as Opus 4.7" },
      { label: "Context Window", value: "200K tokens", context: "vs Opus 4.7: 1M" },
      { label: "Output Speed", value: "50 tok/s", context: "frontier tier" },
    ],
    pros: [
      "Strong coding performance at launch (SWE-bench Verified 72.8%)",
      "Excellent mathematical reasoning",
      "Mature ecosystem with broad tool support",
      "Same pricing as Opus 4.7 ($5/$25)",
    ],
    cons: [
      "200K context window — smaller than competitors (1M+)",
      "Superseded by Opus 4.7 with significant improvements",
      "Extended thinking removed in favor of adaptive thinking",
    ],
    competitorTable: [
      { name: "Claude Opus 4.7", arena: "~1500", swe: "87.6%", gpqa: "94.2%", price: "$5/$25" },
      { name: "GPT-5.4", arena: "1467", swe: "80.8%", gpqa: "94.4%", price: "$2.50/$15" },
      { name: "Claude Opus 4.5", arena: "1468", swe: "72.8%", gpqa: "~90%", price: "$5/$25" },
    ],
    summary: `Claude Opus 4.5 is Anthropic's previous flagship model, released in September 2025. At launch, it was the leading coding model with a 72.8% SWE-bench Verified score and strong general intelligence (Arena Elo 1468).

The model offered a 200K context window and excelled at coding, mathematical reasoning, and extended autonomous work (30+ hours continuous operation). It was positioned as Anthropic's recommended model for "basically every use case" at the time of release.

However, Opus 4.5 has been superseded by Opus 4.7, which delivers dramatically better agentic coding (87.6% vs 72.8% on SWE-bench Verified) and a 5x larger context window (1M vs 200K). Teams still using Opus 4.5 should consider migrating to Opus 4.7 for the substantial capability improvements.`,
    performance: `## Benchmark Scores

| Benchmark | Opus 4.5 | Opus 4.7 | GPT-5.4 |
|-----------|----------|----------|---------|
| Arena Elo | 1468 | ~1500 | 1467 |
| SWE-bench Verified | 72.8% | 87.6% | 80.8% |
| Context Window | 200K | 1M | 1.05M |

Opus 4.5 was a strong model at launch but has been significantly surpassed by Opus 4.7.`,
    comparisons: `## Opus 4.5 vs Opus 4.7

Opus 4.7 delivers 14.8 points higher on SWE-bench Verified, a 5x larger context window, and new capabilities like adaptive thinking and self-verification. Same pricing ($5/$25). Migration is strongly recommended for production workloads.

## Opus 4.5 vs GPT-5.4

GPT-5.4 offers a 5x larger context window (1M vs 200K) at half the price ($2.50/$15 vs $5/$25). GPT-5.4 leads on web research and terminal coding, while Opus 4.5 leads on agentic coding. For most use cases, GPT-5.4 offers better value.`,
    community: `Opus 4.5 was well-received at launch, praised for its coding improvements and extended autonomous work capabilities. However, the 200K context window was seen as limiting compared to Google's 1M context models.

The release of Opus 4.7 in April 2026 made Opus 4.5 largely obsolete for new deployments. Existing users report that Opus 4.5 still performs well for coding tasks but lacks the agentic capabilities of its successor.`,
    useCaseDeep: `1. **Coding Workflows**: Strong SWE-bench performance makes it suitable for code generation, review, and debugging tasks.

2. **Extended Analysis**: 30+ hours of continuous operation enables long-running research and analysis tasks.

3. **Cost-Conscious Teams**: If Opus 4.7's agentic capabilities aren't needed, Opus 4.5 offers solid performance at the same price point.`,
    latestNews: `Claude Opus 4.5 was released in September 2025 and superseded by Claude Opus 4.7 in April 2026. It remains available via the API but is not recommended for new deployments.`,
    sources: [
      { title: "AI Value Index: Claude Opus 4.5", url: "https://serenitiesai.com/benchmark/models/claude-opus-4-5" },
    ],
  },
  {
    slug: "claude-sonnet-4-5",
    keyMetrics: [
      { label: "SWE-Bench Verified", value: "77.2%", context: "best at launch (Sept 2025)" },
      { label: "GPQA Diamond", value: "83.4%", context: "strong reasoning" },
      { label: "OSWorld", value: "61.4%", context: "SOTA computer use at launch" },
      { label: "Input Price", value: "$3/1M", context: "same as Sonnet 4" },
      { label: "Output Price", value: "$15/1M", context: "same as Sonnet 4" },
      { label: "Context Window", value: "200K tokens", context: "1M beta at Tier 4+" },
    ],
    pros: [
      "Best coding model at launch (SWE-bench Verified 77.2%)",
      "Price parity with Sonnet 4 — pure capability upgrade",
      "Outstanding computer use (OSWorld 61.4%, 45% over Sonnet 4)",
      "Fast output speed (63 tok/s)",
    ],
    cons: [
      "200K context window (1M in beta only)",
      "Superseded by Sonnet 4.6 and 4.8",
      "GPQA Diamond (83.4%) trails frontier models (94%+)",
    ],
    competitorTable: [
      { name: "Claude Sonnet 4.6", arena: "~1490", swe: "79.6%", gpqa: "89.9%", price: "$3/$15" },
      { name: "GPT-5.4", arena: "1467", swe: "80.8%", gpqa: "94.4%", price: "$2.50/$15" },
      { name: "Claude Sonnet 4.5", arena: "~1460", swe: "77.2%", gpqa: "83.4%", price: "$3/$15" },
    ],
    summary: `Claude Sonnet 4.5 is Anthropic's mid-tier coding model, released on September 29, 2025. At launch, it achieved the highest SWE-bench Verified score (77.2%), establishing itself as the leading model for real-world software engineering tasks at its price point.

The model maintains price parity with Sonnet 4 at $3/$15 per million tokens, making the upgrade a pure capability gain. It dominates computer use benchmarks with 61.4% OSWorld (45% improvement over Sonnet 4) and demonstrates exceptional agent capabilities with 98% on TAU-bench Telecom.

Sonnet 4.5 has been superseded by Sonnet 4.6 (February 2026) and the upcoming Sonnet 4.8, which deliver further improvements. However, it remains a strong choice for cost-sensitive coding workloads.`,
    performance: `## Benchmark Scores

| Benchmark | Sonnet 4.5 | Sonnet 4.6 | GPT-5.4 |
|-----------|------------|------------|---------|
| SWE-bench Verified | 77.2% | 79.6% | 80.8% |
| GPQA Diamond | 83.4% | 89.9% | 94.4% |
| OSWorld | 61.4% | ~65% | 75.0% |
| TAU-bench Telecom | 98% | N/A | N/A |

Sonnet 4.5 was a strong coding model at launch, with SWE-bench Verified leading all models. It has since been surpassed by Sonnet 4.6 and GPT-5.4.`,
    comparisons: `## Sonnet 4.5 vs Sonnet 4.6

Sonnet 4.6 delivers 2.4 points higher on SWE-bench Verified and 6.5 points higher on GPQA Diamond at the same price. Migration is recommended for improved reasoning and coding.

## Sonnet 4.5 vs GPT-5.4

GPT-5.4 offers a 5x larger context window (1M vs 200K) and higher benchmark scores across the board, at a lower price ($2.50/$15 vs $3/$15). GPT-5.4 is the better choice for most workloads.`,
    community: `Sonnet 4.5 was praised for delivering best-in-class coding at the same price as Sonnet 4. Developers appreciated the pure upgrade without cost increases.

The model's computer use capabilities (OSWorld 61.4%) were seen as a breakthrough for GUI automation tasks. However, the 200K context window was a limitation for long-document workflows.

With the release of Sonnet 4.6 and 4.8, Sonnet 4.5 is now considered a legacy model but still performs well for coding tasks.`,
    useCaseDeep: `1. **Production Coding**: SWE-bench Verified 77.2% makes it suitable for code generation, review, and debugging in production environments.

2. **Computer Use Automation**: OSWorld 61.4% enables GUI testing, software automation, and visual workflow tasks.

3. **Agent Workflows**: TAU-bench Telecom 98% demonstrates exceptional performance on multi-step agent tasks.

4. **Budget-Conscious Teams**: At $3/$15, it offers strong coding capability at a lower price than frontier models.`,
    latestNews: `Claude Sonnet 4.5 was released September 29, 2025, and superseded by Claude Sonnet 4.6 on February 17, 2026. Sonnet 4.8 is expected in mid-2026. Sonnet 4.5 remains available via the API.`,
    sources: [
      { title: "The AI Rankings: Claude Sonnet 4.5", url: "https://theairankings.com/anthropic/claude-sonnet-4-5/" },
      { title: "BenchLM: Claude Sonnet 4.5", url: "https://benchlm.ai/models/claude-sonnet-4-5" },
    ],
  },
  {
    slug: "grok-4-2",
    keyMetrics: [
      { label: "Arena Elo", value: "~1493", context: "#4 overall (preliminary)" },
      { label: "Output Speed", value: "234.9 tok/s", context: "#1 among flagships" },
      { label: "Context Window", value: "2M tokens", context: "largest of any flagship" },
      { label: "Input Price", value: "$2/1M", context: "cheapest flagship" },
      { label: "Output Price", value: "$6/1M", context: "cheapest flagship" },
      { label: "Multi-Agent", value: "16 sub-agents", context: "native multi-agent mode" },
    ],
    pros: [
      "Largest context window (2M tokens) among flagship models",
      "Fastest output speed (234.9 tok/s) — 3x faster than Claude",
      "Cheapest flagship pricing ($2/$6 per 1M tokens)",
      "Native multi-agent mode with up to 16 coordinating sub-agents",
    ],
    cons: [
      "No published SWE-bench or GPQA scores — limited benchmark transparency",
      "Multi-agent runs can be expensive (all tokens billed)",
      "Trails Claude Opus 4.6 on Arena Elo (~1493 vs ~1500)",
    ],
    competitorTable: [
      { name: "Claude Opus 4.6", arena: "~1500", price: "$15/$75" },
      { name: "Grok 4.2", arena: "~1493", price: "$2/$6" },
      { name: "GPT-5.4", arena: "1467", price: "$2.50/$15" },
      { name: "Gemini 3.1 Pro", arena: "~1485", price: "$2/$10" },
    ],
    summary: `Grok 4.2 (also known as Grok 4.20) is xAI's flagship model, launched in public beta on February 17, 2026. It represents a major upgrade over Grok 4, with an 8x larger context window (2M tokens), a native multi-agent mode with up to 16 coordinating sub-agents, and significantly lower pricing ($2/$6 vs $3/$15 for Grok 4).

The model's standout feature is its output speed — 234.9 tokens per second, roughly 3x faster than Claude Opus 4.6. Combined with the 2M context window, this makes Grok 4.2 uniquely suited for long-document processing and high-throughput workloads.

At $2/$6 per 1M tokens, Grok 4.2 is the cheapest flagship model available. The Arena Elo of ~1493 (#4) puts it competitively close to Claude Opus 4.6 (~1500) and ahead of GPT-5.4 (1467).`,
    performance: `## Benchmark Scores

| Benchmark | Grok 4.2 | Claude Opus 4.6 | GPT-5.4 | Gemini 3.1 Pro |
|-----------|----------|-----------------|---------|----------------|
| Arena Elo | ~1493 | ~1500 | 1467 | ~1485 |
| Output Speed | 234.9 tok/s | ~80 tok/s | ~100 tok/s | ~120 tok/s |
| Context Window | 2M | 1M | 1.05M | 1M |
| Input Price | $2/1M | $15/1M | $2.50/1M | $2/1M |
| Output Price | $6/1M | $75/1M | $15/1M | $10/1M |

Note: xAI has not published SWE-bench, GPQA, or other standard academic benchmarks for Grok 4.2. The Arena Elo is preliminary based on ~5,071 votes.`,
    comparisons: `## Grok 4.2 vs Claude Opus 4.6

Claude Opus 4.6 leads on Arena Elo (~1500 vs ~1493) and has published benchmark scores. Grok 4.2 counters with 2x larger context (2M vs 1M), 3x faster output (234 vs 80 tok/s), and dramatically lower pricing ($2/$6 vs $15/$75).

## Grok 4.2 vs GPT-5.4

Grok 4.2 offers a larger context window (2M vs 1M), faster output (234 vs 100 tok/s), and lower pricing ($2/$6 vs $2.50/$15). GPT-5.4 has more published benchmarks and proven agentic coding performance.

## Grok 4.2 vs Gemini 3.1 Pro

Similar pricing ($2/$6 vs $2/$10) and context window (2M vs 1M). Grok 4.2 is faster; Gemini 3.1 Pro has more benchmark data.`,
    community: `Grok 4.2 received strong interest for its 2M context window and aggressive pricing. The native multi-agent mode was seen as innovative, though developers noted that all agent tokens are billed, making complex runs potentially expensive.

The output speed of 234.9 tok/s was universally praised — it's genuinely 3x faster than any competitor at the flagship tier. For high-throughput workloads, this translates directly to lower latency and higher throughput.

The lack of published standard benchmarks (SWE-bench, GPQA) was a concern for some teams, who prefer models with transparent, reproducible evaluations.`,
    useCaseDeep: `1. **Long-Document Processing**: 2M context window enables loading entire codebases, multi-document legal review, or extended conversation histories without retrieval.

2. **High-Throughput Workloads**: 234.9 tok/s output speed makes it ideal for real-time applications, streaming responses, and high-volume API workloads.

3. **Multi-Agent Research**: Native 16-agent mode enables complex research tasks where multiple perspectives are explored simultaneously.

4. **Cost-Sensitive Production**: At $2/$6, it's the cheapest flagship model, making it suitable for high-volume production deployments.`,
    latestNews: `Grok 4.2 launched in public beta on February 17, 2026, with API access following on March 10. It superseded the original Grok 4 (July 2025) with 8x larger context, lower pricing, and multi-agent capabilities. xAI continues to expand API access and published benchmarks.`,
    sources: [
      { title: "Awesome Agents: Grok 4.20", url: "https://awesomeagents.ai/models/grok-4-20/" },
      { title: "ComputerTech: Grok 4.2 Review", url: "https://computertech.co/grok-4-2-review/" },
      { title: "IsItGoodAI: Grok 4.2 Review", url: "https://www.isitgoodai.com/llm-models/grok-4-2" },
    ],
  },
  {
    slug: "qwen3-max-preview",
    keyMetrics: [
      { label: "Arena Elo", value: "~1450", context: "competitive with GPT-5.4" },
      { label: "Input Price", value: "$0.50/1M", context: "extremely cost-effective" },
      { label: "Output Price", value: "$2/1M", context: "cheapest frontier-tier model" },
      { label: "Context Window", value: "128K tokens", context: "standard context" },
      { label: "Language Support", value: "30+ languages", context: "strong multilingual" },
      { label: "Open Source", value: "No", context: "API-only access" },
    ],
    pros: [
      "Extremely cost-effective ($0.50/$2 per 1M tokens)",
      "Strong multilingual support (30+ languages)",
      "Competitive benchmark performance at fraction of cost",
      "Part of the extensive Qwen3 model family",
    ],
    cons: [
      "128K context window — smaller than competitors (1M+)",
      "API-only access — no open weights for Max variant",
      "Trails frontier models on coding benchmarks",
    ],
    competitorTable: [
      { name: "GPT-5.4", arena: "1467", price: "$2.50/$15" },
      { name: "Qwen3 Max", arena: "~1450", price: "$0.50/$2" },
      { name: "DeepSeek V4 Pro", arena: "1460", price: "$0.435/$0.87" },
      { name: "Claude Sonnet 4.6", arena: "~1490", price: "$3/$15" },
    ],
    summary: `Qwen3 Max (Preview) is Alibaba's flagship reasoning model in the Qwen3 family. It delivers competitive benchmark performance at an extremely low price point ($0.50/$2 per 1M tokens), making it one of the most cost-effective frontier-tier models available.

The model supports 30+ languages with strong multilingual capabilities, and is part of the broader Qwen3 ecosystem that includes specialized variants for coding, reasoning, and multimodal tasks. While the 128K context window is smaller than competitors offering 1M+, the cost advantage is significant — roughly 5-10x cheaper than Western frontier models.

For teams building cost-sensitive applications that need strong multilingual support, Qwen3 Max offers exceptional value. It's particularly strong for Chinese-language tasks and cross-lingual workflows.`,
    performance: `## Benchmark Scores

| Benchmark | Qwen3 Max | GPT-5.4 | DeepSeek V4 Pro |
|-----------|-----------|---------|-----------------|
| Arena Elo | ~1450 | 1467 | 1460 |
| Input Price | $0.50/1M | $2.50/1M | $0.435/1M |
| Output Price | $2/1M | $15/1M | $0.87/1M |
| Context Window | 128K | 1.05M | 1M |

Qwen3 Max delivers competitive Arena Elo at a fraction of the cost of Western frontier models.`,
    comparisons: `## Qwen3 Max vs GPT-5.4

GPT-5.4 leads on Arena Elo (1467 vs ~1450) and context window (1M vs 128K), but costs 5x more on input and 7.5x more on output. For cost-sensitive workloads, Qwen3 Max offers 80% of the capability at 20% of the cost.

## Qwen3 Max vs DeepSeek V4 Pro

Both are extremely cost-effective Chinese frontier models. DeepSeek V4 Pro offers a larger context window (1M vs 128K) and slightly lower pricing, while Qwen3 Max has broader multilingual support.`,
    community: `Qwen3 Max has been well-received in the Chinese AI community and among cost-conscious developers globally. The pricing at $0.50/$2 is seen as aggressive and competitive with DeepSeek's pricing.

The model's multilingual capabilities are praised, particularly for Chinese, Japanese, and other Asian languages. However, the 128K context window is seen as a limitation compared to models offering 1M+ context.

The Max variant is API-only, which limits adoption among teams that prefer open-weight models for self-hosting.`,
    useCaseDeep: `1. **Cost-Sensitive Production**: At $0.50/$2, it's ideal for high-volume API workloads where cost is a primary concern.

2. **Multilingual Applications**: Strong support for 30+ languages makes it suitable for global applications and cross-lingual workflows.

3. **Chinese-Language Tasks**: Part of the Qwen3 ecosystem with strong Chinese language capabilities.

4. **Prototyping**: Low cost enables rapid experimentation and prototyping without significant API spend.`,
    latestNews: `Qwen3 Max (Preview) is part of the Qwen3 family released by Alibaba Cloud in 2026. It's positioned as the flagship reasoning model, with specialized variants (Qwen3-Coder, Qwen3-VL) for specific tasks. The model continues to receive updates and improvements.`,
    sources: [
      { title: "Alibaba Cloud: Qwen3-Max", url: "https://www.alibabacloud.com/blog/qwen3-max-just-scale-it_602621" },
      { title: "Alibaba Cloud: Qwen3.6-Max-Preview", url: "https://www.alibabacloud.com/blog/qwen3-6-max-preview-smarter-sharper-still-evolving_603055" },
    ],
  },
];

// Get model IDs
const modelSlugs = analyses.map(a => a.slug);
const placeholders = modelSlugs.map(() => "?").join(",");
const models = db.prepare(`SELECT id, slug FROM models WHERE slug IN (${placeholders})`).all(...modelSlugs) as { id: number; slug: string }[];

const modelIdMap = new Map(models.map(m => [m.slug, m.id]));

const insertEn = db.prepare(`
  INSERT OR REPLACE INTO model_analyses
    (model_id, language, key_metrics_json, pros_json, cons_json, competitors_json, summary, performance, comparisons, community, use_case_deep, latest_news, sources_json, generated_at)
    VALUES (?, 'en', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

const insertJa = db.prepare(`
  INSERT OR REPLACE INTO model_analyses
    (model_id, language, key_metrics_json, pros_json, cons_json, competitors_json, summary, performance, comparisons, community, use_case_deep, latest_news, sources_json, generated_at)
    VALUES (?, 'ja', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

let inserted = 0;
let skipped = 0;

for (const analysis of analyses) {
  const modelId = modelIdMap.get(analysis.slug);
  if (!modelId) {
    console.log(`  ⚠ Model not found: ${analysis.slug}`);
    skipped++;
    continue;
  }

  const args = [
    JSON.stringify(analysis.keyMetrics),
    JSON.stringify(analysis.pros),
    JSON.stringify(analysis.cons),
    JSON.stringify(analysis.competitorTable),
    analysis.summary,
    analysis.performance,
    analysis.comparisons,
    analysis.community,
    analysis.useCaseDeep,
    analysis.latestNews,
    JSON.stringify(analysis.sources),
  ];

  insertEn.run(modelId, ...args);
  insertJa.run(modelId, ...args); // Use EN as JA fallback for now
  inserted++;
  console.log(`  ✓ ${analysis.slug}`);
}

console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`);
