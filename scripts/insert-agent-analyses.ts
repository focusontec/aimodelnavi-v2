/**
 * Insert model analyses from agent research into SQLite database.
 * Run with: npx tsx scripts/insert-agent-analyses.ts
 */

import { getDb, migrate } from "./lib/db";

migrate();
const db = getDb();

interface AnalysisData {
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

const analyses: AnalysisData[] = [
  // === Mistral + Other ===
  {
    slug: "devstral-medium",
    keyMetrics: [
      { label: "SWE-Bench Verified", value: "61.6%", context: "Surpasses Gemini 2.5 Pro and GPT-4.1" },
      { label: "Context Window", value: "128K tokens" },
      { label: "Pricing", value: "$0.40/$2.00 per 1M tokens" },
      { label: "GPQA Diamond", value: "49.2%" },
      { label: "Release Date", value: "July 10, 2025" }
    ],
    pros: ["Strong SWE-Bench Verified (61.6%) at low cost", "Cost-effective at $0.40/$2.00 per 1M tokens", "Supports tool use and enterprise deployment"],
    cons: ["Weak reasoning and math benchmarks", "API-only, not open-weight", "Low AIME score (6.7%)"],
    competitorTable: [
      { name: "Devstral Small 1.1", swe: "53.6%", gpqa: "41.4%", price: "$0.10/$0.30" },
      { name: "Claude 3.5 Haiku", swe: "40.6%", price: "$0.80/$4.00" },
      { name: "GPT-4.1-mini", swe: "23.6%", price: "$0.40/$1.60" }
    ],
    summary: "Devstral Medium is a high-performance coding model from Mistral AI and All Hands AI. Achieves 61.6% SWE-Bench Verified, surpassing Gemini 2.5 Pro and GPT-4.1 at fraction of cost.",
    performance: "Strong coding (61.6% SWE-Bench) but weak in math (AIME 6.7%) and general reasoning (GPQA 49.2%).",
    comparisons: "8-point improvement over Devstral Small 1.1. Cheaper than frontier models with competitive coding scores.",
    community: "Well-received for cost-effective coding agent capabilities.",
    useCaseDeep: "Best for software engineering agents, code generation, and agentic coding workflows.",
    latestNews: "Released July 10, 2025. Devstral 2 2512 announced as successor.",
    sources: [{ title: "Mistral AI", url: "https://mistral.ai/news/devstral-2507" }]
  },
  {
    slug: "devstral-small-1-1",
    keyMetrics: [
      { label: "SWE-Bench Verified", value: "53.6%", context: "SOTA for open models" },
      { label: "Parameters", value: "24B" },
      { label: "Pricing", value: "$0.10/$0.30 per 1M tokens" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "July 10, 2025" }
    ],
    pros: ["SOTA SWE-Bench Verified (53.6%) among open models", "Extremely affordable", "Runs on consumer hardware (RTX 4090)", "Apache 2.0 license"],
    cons: ["Lower general reasoning scores", "Text-only, no vision", "Weak on math (AIME 0.3%)"],
    competitorTable: [
      { name: "Devstral Medium", swe: "61.6%", price: "$0.40/$2.00" },
      { name: "Claude 3.5 Haiku", swe: "40.6%", price: "$0.80/$4.00" }
    ],
    summary: "Devstral Small 1.1 is a 24B open-weight coding model achieving 53.6% SWE-Bench Verified, highest among open models. Apache 2.0, runs on consumer hardware.",
    performance: "53.6% SWE-Bench Verified, outperforms all open models. Strong in agentic coding, weak in general reasoning.",
    comparisons: "6.8 point improvement over v1.0. Surpasses larger models under same scaffold.",
    community: "Highly regarded in open-source. Apache 2.0 and vLLM/Ollama compatibility praised.",
    useCaseDeep: "Ideal for software engineering agents and local deployment on consumer GPUs.",
    latestNews: "Released July 10, 2025. Devstral 2 2512 announced with 262K context.",
    sources: [{ title: "Mistral AI Docs", url: "https://docs.mistral.ai/models/model-cards/devstral-small-1-1-25-07" }]
  },
  {
    slug: "baichuan-m3-235b",
    keyMetrics: [
      { label: "Parameters", value: "235B MoE" },
      { label: "HealthBench", value: "65.1", context: "Global #1" },
      { label: "Hallucination Rate", value: "3.5%", context: "Global lowest" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "January 13, 2026" }
    ],
    pros: ["Global #1 on HealthBench, surpassing GPT-5.2", "Lowest hallucination rate (3.5%)", "Strong clinical inquiry", "Apache 2.0"],
    cons: ["Highly specialized for medical tasks", "Requires 8x H20 GPUs", "No public API pricing"],
    competitorTable: [{ name: "GPT-5.2", price: "N/A" }, { name: "DeepSeek-R1", price: "N/A" }],
    summary: "Baichuan-M3-235B is Baichuan AI's medical LLM achieving global #1 on HealthBench (65.1), surpassing GPT-5.2 with lowest hallucination rate.",
    performance: "Exceptional medical performance. Fact-Aware RL achieves lower hallucination than GPT-5.2.",
    comparisons: "28pp improvement over Baichuan-M2 on HealthBench-Hard.",
    community: "Positive reception in medical AI community.",
    useCaseDeep: "Medical education, health consultation, clinical decision support.",
    latestNews: "Released January 13, 2026.",
    sources: [{ title: "GitHub", url: "https://github.com/baichuan-inc/Baichuan-M3-235B" }]
  },
  {
    slug: "baidu-ernie-5-0",
    keyMetrics: [
      { label: "Parameters", value: "2.4 Trillion", context: "Ultra-sparse MoE" },
      { label: "Modalities", value: "Text, Image, Video, Audio" },
      { label: "Context Window", value: "128K" },
      { label: "Release Date", value: "January 22, 2026" }
    ],
    pros: ["2.4T parameters with <3% activation", "Unified multimodal", "Elastic training cloud-to-edge"],
    cons: ["Not publicly available", "Massive compute required", "Limited Western benchmarks"],
    competitorTable: [{ name: "GPT-5" }, { name: "Gemini 3" }, { name: "Claude 4.5" }],
    summary: "ERNIE 5.0 is Baidu's unified multimodal foundation model with 2.4T parameters. Integrates text, images, video, audio in single framework.",
    performance: "Competitive across all modalities. Elastic training maintains performance with 53.7% activated parameters.",
    comparisons: "Paradigm shift to truly unified multimodal modeling.",
    community: "Innovative approach noted by technical community.",
    useCaseDeep: "Comprehensive multimodal AI applications.",
    latestNews: "arXiv:2602.04705, January 2026.",
    sources: [{ title: "ERNIE 5.0 Blog", url: "https://ernie.baidu.com/blog/posts/ernie5.0/" }]
  },
  {
    slug: "ernie-4-5-vl-28b-a3b-multimodal-moe-chat-model",
    keyMetrics: [
      { label: "Parameters", value: "28B total, 3B activated" },
      { label: "Context Window", value: "128K tokens" },
      { label: "Pricing", value: "$0.14/$0.56 per 1M tokens" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "August 12, 2025" }
    ],
    pros: ["Efficient MoE with 3B activated params", "Thinking/non-thinking modes", "Vision capabilities", "Affordable"],
    cons: ["Limited to 30K on APIs", "No video/audio input", "Lower scores vs larger models"],
    competitorTable: [{ name: "Qwen3-VL" }, { name: "Llama 4 Scout" }],
    summary: "ERNIE-4.5-VL-28B-A3B is a multimodal MoE model with 28B/3B activated params. Heterogeneous MoE with modality-isolated routing.",
    performance: "Strong ethical reasoning (100%), general knowledge (96%). Average coding (82%).",
    comparisons: "More efficient than larger ERNIE variants. 4-bit quantization supported.",
    community: "18,568 downloads on Hugging Face.",
    useCaseDeep: "Image analysis, document processing, cross-modal reasoning.",
    latestNews: "Released August 12, 2025.",
    sources: [{ title: "Hugging Face", url: "https://huggingface.co/baidu/ERNIE-4.5-VL-28B-A3B-Paddle" }]
  },
  {
    slug: "composer-1",
    keyMetrics: [
      { label: "Speed", value: "250 tokens/sec", context: "4x faster than GPT-5" },
      { label: "Pricing", value: "$1.25/$10.00 per 1M tokens" },
      { label: "SWE-bench Multilingual", value: "56.9%" },
      { label: "Release Date", value: "October 2025" }
    ],
    pros: ["Extremely fast (250 tok/s)", "Seamless Cursor IDE integration", "Subsidized on Pro plan"],
    cons: ["Weak instruction following", "Context drift after 15-20 turns", "Poor reasoning"],
    competitorTable: [{ name: "Composer 1.5", swe: "65.9%", price: "$3.50/$17.50" }, { name: "Claude 4.5 Sonnet", price: "$3.00/$15.00" }],
    summary: "Composer 1 is Cursor's first proprietary coding model. MoE architecture, 250 tokens/sec. Fast but shows weaknesses in instruction following.",
    performance: "CursorBench 38.0, Terminal-Bench 2.0 40.0, SWE-bench Multilingual 56.9%.",
    comparisons: "Faster but less capable than GPT-5 and Claude 4.5 Sonnet.",
    community: "Appreciated for speed, reliability concerns noted.",
    useCaseDeep: "Rapid prototyping and quick iterations in Cursor IDE.",
    latestNews: "Succeeded by Composer 1.5 (Feb 2026) and Composer 2 (Mar 2026).",
    sources: [{ title: "Cursor Docs", url: "https://cursor.com/docs/models-and-pricing" }]
  },
  {
    slug: "cursor-composer-1-5",
    keyMetrics: [
      { label: "Architecture", value: "MoE + Thinking" },
      { label: "RL Compute", value: "20x Composer 1" },
      { label: "Pricing", value: "$3.50/$17.50 per 1M tokens" },
      { label: "SWE-bench Multilingual", value: "65.9%" },
      { label: "Release Date", value: "February 2026" }
    ],
    pros: ["Fewer retries than Composer 1", "Better instruction following", "Self-summarization for long sessions", "Thinking tokens"],
    cons: ["Higher cost", "No free-tier", "Lower scores than premium peers"],
    competitorTable: [{ name: "Composer 1", swe: "56.9%" }, { name: "Composer 2", swe: "73.7%", price: "$0.50/$2.50" }],
    summary: "Composer 1.5 is Cursor's second-gen coding model with 20x RL scaling. Thinking tokens and self-summarization.",
    performance: "CursorBench 44.2, Terminal-Bench 2.0 47.9, SWE-bench Multilingual 65.9%.",
    comparisons: "Surpasses Composer 1 on all benchmarks.",
    community: "Improved reasoning praised. Good speed/thinking balance.",
    useCaseDeep: "Interactive coding requiring reasoning and long sessions.",
    latestNews: "Released February 2026. Succeeded by Composer 2.",
    sources: [{ title: "Cursor Blog", url: "https://cursor.com/blog/composer-1-5" }]
  },
  {
    slug: "cursor-composer-2",
    keyMetrics: [
      { label: "Speed", value: "200+ tokens/sec" },
      { label: "Pricing", value: "$0.50/$2.50 (standard)" },
      { label: "CursorBench", value: "61.3", context: "Surpasses Claude Opus 4.6" },
      { label: "SWE-bench Multilingual", value: "73.7%" },
      { label: "Release Date", value: "March 19, 2026" }
    ],
    pros: ["Frontier-level coding at fraction of cost", "10x cheaper than Opus 4.6", "Self-summarization reduces errors 50%", "Beats Opus 4.6 on 2/3 benchmarks"],
    cons: ["Effective context 70-120K", "Claude Code 5.5x more token-efficient", "Base model undisclosed"],
    competitorTable: [{ name: "Claude Opus 4.6", swe: "77.8%", price: "$5.00/$25.00" }, { name: "GPT-5.4", price: "$2.50/$15.00" }],
    summary: "Composer 2 is Cursor's third-gen coding model. 10x cheaper than Opus 4.6, surpasses it on 2/3 benchmarks.",
    performance: "CursorBench 61.3, Terminal-Bench 2.0 61.7, SWE-bench Multilingual 73.7%.",
    comparisons: "10x cheaper than Opus 4.6. Claude Code more token-efficient.",
    community: "Impressed by price-to-performance. Three gens in five months.",
    useCaseDeep: "Well-defined coding tasks, large monorepos, cost-conscious teams.",
    latestNews: "Released March 19, 2026. Cursor valued at $29.3B.",
    sources: [{ title: "Cursor Blog", url: "https://cursor.com/blog/composer-2" }]
  },
  {
    slug: "agentcpm-explore",
    keyMetrics: [
      { label: "Parameters", value: "4B" },
      { label: "GAIA (Text)", value: "63.9%", context: "SOTA among 4B models" },
      { label: "FRAMES", value: "82.7%", context: "Surpasses 30B models" },
      { label: "Context Window", value: "128K tokens" },
      { label: "Release Date", value: "February 2026" }
    ],
    pros: ["SOTA among 4B models", "Matches 8B-class models", "Outperforms Claude-4.5-Sonnet on BrowseComp"],
    cons: ["Requires multiple inference attempts", "Narrowly focused on agent tasks", "Not general-purpose"],
    competitorTable: [{ name: "Claude-4.5-Sonnet" }, { name: "DeepSeek-V3.2" }],
    summary: "AgentCPM-Explore is a 4B agent model from OpenBMB achieving SOTA among edge-scale models.",
    performance: "63.9% GAIA, 82.7% FRAMES, 68.1% WebWalker QA.",
    comparisons: "Surpasses WebDancer-QWQ-32B by 12.4 points on GAIA.",
    community: "Evidence that model size isn't the only factor in agent performance.",
    useCaseDeep: "Edge-scale agents: personal assistants, smart home, mobile productivity.",
    latestNews: "arXiv:2602.06485, February 2026.",
    sources: [{ title: "arXiv", url: "https://arxiv.org/pdf/2602.06485" }]
  },
  {
    slug: "embeddinggemma-300m",
    keyMetrics: [
      { label: "Parameters", value: "308M" },
      { label: "MTEB Multilingual", value: "61.15", context: "SOTA for sub-500M" },
      { label: "MTEB English", value: "69.67" },
      { label: "MTEB Code", value: "68.76" },
      { label: "Release Date", value: "September 24, 2025" }
    ],
    pros: ["SOTA on MTEB for sub-500M models", "Comparable to models double its size", "Robust to quantization", "Ideal for on-device"],
    cons: ["Embedding-only", "Google usage license", "Text-only"],
    competitorTable: [{ name: "NV-Embed-v2" }, { name: "GritLM-7B" }],
    summary: "EmbeddingGemma is Google DeepMind's 308M parameter embedding model. SOTA on MTEB for sub-500M models.",
    performance: "8th overall on MTEB(Multilingual, v2). Robust to int4 quantization.",
    comparisons: "Outperforms all prior sub-500M models.",
    community: "Breakthrough in lightweight embeddings.",
    useCaseDeep: "Semantic search, clustering, on-device applications.",
    latestNews: "arXiv:2509.20354, September 2025.",
    sources: [{ title: "Google DeepMind", url: "https://deepmind.google/research/publications/194199/" }]
  },
  {
    slug: "functiongemma-270m-it",
    keyMetrics: [
      { label: "Parameters", value: "270M" },
      { label: "Context Window", value: "32K tokens" },
      { label: "HF Downloads", value: "443,522" },
      { label: "Release Date", value: "October 8, 2025" }
    ],
    pros: ["Ultra-lightweight for function calling", "Runs on laptops/mobile", "Offline private agents"],
    cons: ["Needs fine-tuning", "Text-only function calling", "Google license required"],
    competitorTable: [{ name: "GPT-4o-mini", price: "$0.15/$0.60" }, { name: "Claude 3.5 Haiku", price: "$0.80/$4.00" }],
    summary: "FunctionGemma 270M IT is Google's ultra-lightweight function calling model for constrained devices.",
    performance: "Designed for function calling accuracy across hardware platforms.",
    comparisons: "Orders of magnitude smaller than general LLMs.",
    community: "443K+ downloads. Edge Gallery demos.",
    useCaseDeep: "Voice games, mobile actions, IoT control, offline agents.",
    latestNews: "Released October 8, 2025.",
    sources: [{ title: "Hugging Face", url: "https://huggingface.co/google/functiongemma-270m-it" }]
  },
  // === OpenAI + Amazon ===
  {
    slug: "chatgpt-agent-model",
    keyMetrics: [
      { label: "Context Window", value: "128K tokens" },
      { label: "HLE (pass@1)", value: "41.6%", context: "SOTA at launch" },
      { label: "BrowseComp", value: "68.9%", context: "SOTA" },
      { label: "FrontierMath", value: "27.4%", context: "With tools" },
      { label: "Release Date", value: "July 17, 2025" }
    ],
    pros: ["Unified agentic system (Operator + deep research + ChatGPT)", "SOTA on BrowseComp and HLE", "Autonomous web browsing, code execution, file creation", "Interactive - users can interrupt and steer"],
    cons: ["Subscription-only ($20-$200/mo)", "Slideshow generation still beta", "High biological risk classification", "EEA/Switzerland not supported"],
    competitorTable: [
      { name: "Claude Opus 4.6", arena: "1398", swe: "72.5%", price: "$15/$75" },
      { name: "Gemini 3 Pro", arena: "1389", swe: "63.2%", price: "$1.25/$5.00" }
    ],
    summary: "ChatGPT Agent is OpenAI's unified agentic system combining web browsing, deep research, and conversational AI. SOTA on BrowseComp (68.9%) and HLE (41.6%).",
    performance: "SOTA on BrowseComp (68.9%), HLE (41.6%), SpreadsheetBench (45.5%). Surpasses human on DSBench.",
    comparisons: "First to unify browsing, research, code execution, and file creation. Product-level experience vs raw model APIs.",
    community: "Praised as significant step toward practical AI assistants. Concerns about safety classification.",
    useCaseDeep: "Complex multi-step knowledge work: financial analysis, travel planning, presentations, deep research.",
    latestNews: "April 2026: workspace agents in ChatGPT with Codex integration.",
    sources: [{ title: "OpenAI", url: "https://openai.com/index/introducing-chatgpt-agent/" }]
  },
  {
    slug: "gpt-opensources-120b",
    keyMetrics: [
      { label: "Parameters", value: "117B total / 5.1B active", context: "MoE, 128 experts" },
      { label: "AIME 2025", value: "97.9%", context: "With tools" },
      { label: "GPQA Diamond", value: "80.9%", context: "With tools" },
      { label: "SWE-Bench Verified", value: "62.4%", context: "With terminal" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "August 5, 2025" }
    ],
    pros: ["Fully open-weight Apache 2.0", "97.9% AIME 2025 with tools", "Runs on single 80GB GPU (MXFP4)", "Native agentic capabilities"],
    cons: ["Text-only", "Higher hallucination than o4-mini", "Knowledge cutoff June 2024", "Requires harmony format"],
    competitorTable: [
      { name: "DeepSeek R1", swe: "~55%", gpqa: "~71%", price: "Free" },
      { name: "Qwen 3.5", swe: "62.5%", gpqa: "82.1%", price: "$0.50/$2.00" },
      { name: "OpenAI o4-mini", swe: "~63%", price: "$1.10/$4.40" }
    ],
    summary: "GPT OSS 120B is OpenAI's first open-weight model (Apache 2.0). 117B MoE params, runs on single GPU. 97.9% AIME 2025 with tools.",
    performance: "97.9% AIME, 80.9% GPQA, 62.4% SWE-Bench, 90% MMLU at high reasoning with tools.",
    comparisons: "Approaches o4-mini performance while fully open-weight. Native tool-use training.",
    community: "20K+ GitHub stars. Apache 2.0 and native tool use praised.",
    useCaseDeep: "Production reasoning, agentic workflows, math/science, coding.",
    latestNews: "6 releases as of March 2026. Integrates with Codex CLI.",
    sources: [{ title: "GitHub", url: "https://github.com/openai/gpt-oss" }]
  },
  {
    slug: "gpt-image-1-mini",
    keyMetrics: [
      { label: "Per Image (Low)", value: "$0.005-0.006" },
      { label: "Per Image (High)", value: "$0.036-0.052" },
      { label: "Resolution", value: "Up to 1536x1024" },
      { label: "Release Date", value: "October 2025" }
    ],
    pros: ["Extremely cost-effective ($0.005/image)", "Text+image input, image output", "Multi-turn editing via Responses API", "Streaming generation"],
    cons: ["No face preservation", "Slower generation speed", "Complex prompts up to 2 min"],
    competitorTable: [
      { name: "GPT Image 1", price: "$0.011-0.25/image" },
      { name: "GPT Image 2", price: "$0.006-0.211/image" },
      { name: "DALL-E 3", price: "$0.04-0.12/image" }
    ],
    summary: "GPT Image 1 Mini is OpenAI's cost-efficient image generation model. As low as $0.005/image with multi-turn editing.",
    performance: "Comparable to GPT Image 1 for most use cases except face preservation.",
    comparisons: "2-5x cheaper than full GPT Image 1. Best for high-volume batch generation.",
    community: "Appreciated for aggressive pricing. Multi-turn editing well-received.",
    useCaseDeep: "Batch generation, rapid ideation, e-commerce product images, content creation at scale.",
    latestNews: "GPT Image 2 recommended for new production workflows.",
    sources: [{ title: "OpenAI API", url: "https://developers.openai.com/api/docs/models/gpt-image-1-mini" }]
  },
  {
    slug: "amazon-nova-2-lite",
    keyMetrics: [
      { label: "Context Window", value: "1M tokens" },
      { label: "Pricing", value: "$0.30/$2.50 per 1M tokens" },
      { label: "Modalities", value: "Text, Image, Video, PDF input" },
      { label: "Reasoning", value: "Adjustable effort levels" },
      { label: "Release Date", value: "December 2, 2025" }
    ],
    pros: ["1M token context", "Competitive pricing ($0.30/$2.50)", "Built-in web grounding and code interpreter", "Adjustable thinking effort"],
    cons: ["Not frontier reasoning", "Limited to text output", "Newer model, less adoption", "AWS ecosystem dependency"],
    competitorTable: [
      { name: "Claude Haiku 4.5", price: "$0.80/$4.00" },
      { name: "Gemini Flash 2.5", price: "$0.15/$0.60" },
      { name: "DeepSeek V3.2", swe: "77.8%", price: "$0.28/$1.10" }
    ],
    summary: "Amazon Nova 2 Lite is AWS's cost-effective reasoning model with 1M context. $0.30/$2.50, beats Haiku 4.5 on 13/15 benchmarks.",
    performance: "Equal or better on 13/15 vs Haiku 4.5, 11/17 vs GPT-5 Mini, 14/18 vs Gemini Flash 2.5.",
    comparisons: "Best value in lightweight tier. 1M context and web grounding differentiators.",
    community: "Enterprise adoption for document processing, customer service, video analysis.",
    useCaseDeep: "Customer service, document processing, video analysis, agentic workflows.",
    latestNews: "Nova Act achieves 90% reliability for browser automation.",
    sources: [{ title: "AWS", url: "https://aws.amazon.com/nova/models/" }]
  },
  {
    slug: "amazon-nova-2-pro-preview",
    keyMetrics: [
      { label: "Context Window", value: "1M tokens" },
      { label: "Modalities", value: "Text, Image, Video, Speech" },
      { label: "vs Claude Sonnet 4.5", value: "10/16 equal or better" },
      { label: "vs Gemini 2.5 Pro", value: "15/19 equal or better" },
      { label: "Release Date", value: "December 2, 2025 (Preview)" }
    ],
    pros: ["AWS's most intelligent model", "1M context with multimodal input", "Built-in web grounding + code execution", "Distillation teacher capability"],
    cons: ["Preview only", "Benchmarks trail top frontier models", "Pricing not disclosed", "Requires Nova Forge enrollment"],
    competitorTable: [
      { name: "Claude Sonnet 4.5", price: "$3.00/$15.00" },
      { name: "Gemini 3 Pro", arena: "1389", price: "$1.25/$5.00" }
    ],
    summary: "Nova 2 Pro Preview is AWS's most intelligent model for complex reasoning. Matches/beats Claude Sonnet 4.5 on 10/16 benchmarks.",
    performance: "10/16 vs Sonnet 4.5, 8/16 vs GPT-5.1, 15/19 vs Gemini 2.5 Pro.",
    comparisons: "Competes in upper-mid tier. 1M context and Nova Forge customization differentiators.",
    community: "Early adoption by Cisco, Siemens, Sumo Logic for security operations.",
    useCaseDeep: "Multi-document analysis, video reasoning, software migration, knowledge distillation.",
    latestNews: "Expected GA in 2026 with public pricing.",
    sources: [{ title: "AWS", url: "https://aws.amazon.com/nova/models/" }]
  },
  {
    slug: "amazon-nova-2-omni-preview",
    keyMetrics: [
      { label: "Context Window", value: "1M tokens" },
      { label: "Output", value: "Text + Image (unified)" },
      { label: "Pricing", value: "$0.30/$2.50 per 1M tokens" },
      { label: "Capacity", value: "750K words / hours of audio" },
      { label: "Release Date", value: "December 2, 2025 (Preview)" }
    ],
    pros: ["Industry-first unified text+image generation", "1M context handling hours of audio/video", "Single model for analysis and generation", "Competitive pricing"],
    cons: ["Preview only", "No comparable models for benchmarking", "Image quality may trail dedicated models", "AWS dependency"],
    competitorTable: [
      { name: "GPT-5.2", arena: "1380", price: "$2.50/$10.00" },
      { name: "Gemini 3 Pro", arena: "1389", price: "$1.25/$5.00" }
    ],
    summary: "Nova 2 Omni Preview is industry-first unified multimodal model generating text+images from multimodal inputs. 1M context, $0.30/$2.50.",
    performance: "No direct competitors. Handles entire multimodal workflows in single invocation.",
    comparisons: "Eliminates multi-model pipelines. Unique in the market.",
    community: "Significant interest for marketing automation and e-commerce.",
    useCaseDeep: "Marketing campaign generation, product catalog analysis, content creation.",
    latestNews: "Preview, no GA date announced.",
    sources: [{ title: "AWS", url: "https://aws.amazon.com/nova/models/" }]
  },
  {
    slug: "amazon-nova-2-sonic",
    keyMetrics: [
      { label: "Context Window", value: "1M tokens" },
      { label: "Speech-to-Speech", value: "Unified STT+LLM+TTS" },
      { label: "Languages", value: "7 languages" },
      { label: "Latency", value: "Sub-500ms" },
      { label: "Release Date", value: "December 2, 2025" }
    ],
    pros: ["Unified speech-to-speech", "1M context for long conversations", "7 languages with polyglot voices", "Native function calling during voice"],
    cons: ["Speech-to-speech only", "Quality may trail dedicated solutions", "AWS dependency", "Infrastructure setup required"],
    competitorTable: [
      { name: "OpenAI GPT-Realtime", price: "~$5/$20" },
      { name: "ElevenLabs", price: "$5-330/mo" }
    ],
    summary: "Nova 2 Sonic is AWS's speech-to-speech model unifying STT+LLM+TTS. 7 languages, 1M context, native function calling.",
    performance: "Best-in-class streaming speech understanding. Sub-500ms latency.",
    comparisons: "1M context larger than competitors. Async tool use during voice.",
    community: "Cisco AI Receptionist, Amazon Ring doorbell. Growing adoption.",
    useCaseDeep: "Phone support, voice interfaces, AI receptionists, interactive learning.",
    latestNews: "Stream Vision Agents framework for production voice agents.",
    sources: [{ title: "AWS", url: "https://aws.amazon.com/nova/models/" }]
  },
  {
    slug: "doubao-seed-2-0-pro",
    keyMetrics: [
      { label: "Context Window", value: "256K tokens" },
      { label: "AIME 2025", value: "98.3%", context: "Gold medals IMO, CMO, ICPC" },
      { label: "GPQA Diamond", value: "88.9%" },
      { label: "SWE-Bench Verified", value: "76.5%" },
      { label: "Arena Text", value: "6th overall" },
      { label: "Pricing", value: "$0.47/$2.37 per 1M tokens" },
      { label: "Release Date", value: "February 14, 2026" }
    ],
    pros: ["98.3% AIME 2025 with gold medals", "3020 Codeforces Elo (near grandmaster)", "89.5% VideoMME (hour-long video)", "~3.7x cheaper than GPT-5.2"],
    cons: ["Trails Claude Opus 4.5 on coding", "Weaker hallucination control", "Primarily Chinese-optimized", "Volcengine access requires identity verification"],
    competitorTable: [
      { name: "GPT-5.2", arena: "1380", swe: "58.2%", gpqa: "88.0%", price: "$2.50/$10.00" },
      { name: "Claude Opus 4.5", swe: "68.4%", gpqa: "86.5%", price: "$12.00/$60.00" },
      { name: "Gemini 3 Pro", arena: "1389", swe: "63.2%", gpqa: "87.5%", price: "$1.25/$5.00" }
    ],
    summary: "Doubao Seed 2.0 Pro is ByteDance's flagship reasoning model. 98.3% AIME, 3020 Codeforces, 6th in LMSYS Arena. ~3.7x cheaper than GPT-5.2.",
    performance: "Frontier-level: 98.3% AIME, 88.9% GPQA, 76.5% SWE-Bench, 89.5% VideoMME.",
    comparisons: "Leads on math and video. Trails on coding vs Opus 4.5. Massive price advantage.",
    community: "200M+ Doubao users. 6th text, 3rd-4th vision in LMSYS Arena.",
    useCaseDeep: "Math research, competitive programming, video analysis, production AI at scale.",
    latestNews: "Released February 14, 2026. Lite upgraded April 2026 with omni-modal.",
    sources: [{ title: "ByteDance Seed", url: "https://research.doubao.com/en/seed2" }]
  },
  {
    slug: "doubao-seed-2-0-lite",
    keyMetrics: [
      { label: "Context Window", value: "256K tokens" },
      { label: "AIME 2025", value: "93.0%" },
      { label: "SWE-Bench Verified", value: "73.5%" },
      { label: "VideoMME", value: "87.7%" },
      { label: "Pricing", value: "$0.09/$0.53 per 1M tokens" },
      { label: "Release Date", value: "February 14, 2026" }
    ],
    pros: ["Best performance/cost balance", "Near-Pro Agent performance (WideSearch 74.5%)", "Omni-modal (April 2026)", "Extremely competitive pricing"],
    cons: ["Trails Pro on extreme reasoning", "Primarily Chinese-optimized", "Limited international access"],
    competitorTable: [
      { name: "GPT-5.2", swe: "58.2%", price: "$2.50/$10.00" },
      { name: "Gemini 3 Flash", price: "$0.15/$0.60" },
      { name: "DeepSeek V3.2-Speciale", swe: "77.8%", price: "$0.28/$1.10" }
    ],
    summary: "Doubao Seed 2.0 Lite is ByteDance's best-value model. 93% AIME, 73.5% SWE-Bench at $0.09/$0.53 per 1M tokens.",
    performance: "93% AIME, 85.1% GPQA, 73.5% SWE-Bench, 87.7% VideoMME. Omni-modal since April 2026.",
    comparisons: "~28x cheaper than GPT-5.2 on input. Exceeds GPT-5.2 on SWE-Bench.",
    community: "Recommended default for most deployments. Omni-modal update praised.",
    useCaseDeep: "Enterprise tasks, content generation, multimodal business, cost-sensitive deployments.",
    latestNews: "April 2026: omni-modal understanding (video, image, audio, text).",
    sources: [{ title: "ByteDance Seed", url: "https://research.doubao.com/en/seed2" }]
  },
  // === DeepSeek ===
  {
    slug: "deepseek-v3-1",
    keyMetrics: [
      { label: "Parameters", value: "671B MoE" },
      { label: "GPQA Diamond", value: "80.1% (thinking)" },
      { label: "AIME 2025", value: "88.4% (thinking)" },
      { label: "SWE-Bench Verified", value: "66.0%" },
      { label: "Pricing", value: "$0.28/$0.42 per 1M tokens" },
      { label: "Release Date", value: "August 21, 2025" }
    ],
    pros: ["Hybrid thinking/non-thinking mode", "Strong agent and tool-use", "Comparable to R1-0528 with faster responses", "Extremely competitive pricing", "MIT license"],
    cons: ["Safety alignment concerns (Azure)", "Non-thinking mode significantly weaker", "SWE-bench trails frontier models", "Superseded by V3.2"],
    competitorTable: [
      { name: "Claude Sonnet 4.5", swe: "77.2%", gpqa: "83.4%", price: "$3/$15" },
      { name: "GPT-5", swe: "74.9%", gpqa: "85.7%", price: "$2.50/$15" },
      { name: "DeepSeek-V3.2", swe: "73.1%", gpqa: "82.4%", price: "$0.28/$0.42" }
    ],
    summary: "DeepSeek-V3.1 is a hybrid thinking/non-thinking MoE model. 671B params, strong agent capabilities, extremely competitive pricing.",
    performance: "Thinking mode: 80.1% GPQA, 88.4% AIME, 74.8% LiveCodeBench.",
    comparisons: "10-40x cheaper than GPT-5/Claude. Small gap to frontier models.",
    community: "Positive as open-source alternative. Safety concerns noted.",
    useCaseDeep: "Cost-sensitive production, agent workflows, automated coding.",
    latestNews: "Released August 2025. Succeeded by V3.2 and V4.",
    sources: [{ title: "DeepSeek API", url: "https://api-docs.deepseek.com/news/news250821" }]
  },
  {
    slug: "deepseek-v3-2-speciale",
    keyMetrics: [
      { label: "Parameters", value: "685B MoE" },
      { label: "Arena Elo", value: "1361", context: "#7 overall" },
      { label: "AIME 2025", value: "96.0%" },
      { label: "HMMT Feb 2025", value: "99.2%" },
      { label: "Codeforces", value: "2701" },
      { label: "IMO 2025", value: "Gold Medal" },
      { label: "Release Date", value: "December 1, 2025" }
    ],
    pros: ["IMO 2025 and IOI 2025 gold medals", "Surpasses GPT-5 on multiple benchmarks", "Fully open-source MIT", "#7 on Chatbot Arena"],
    cons: ["High token consumption (23-77k per query)", "Retired from DeepSeek API", "Slower due to extended reasoning", "Weaker on general conversational tasks"],
    competitorTable: [
      { name: "GPT-5 High", arena: "~1380", gpqa: "85.7%", price: "$2.50/$15" },
      { name: "Gemini 3.0 Pro", arena: "~1389", gpqa: "91.9%" },
      { name: "DeepSeek-V3.2", arena: "1334", gpqa: "82.4%", price: "$0.28/$0.42" }
    ],
    summary: "DeepSeek V3.2 Speciale is the most powerful reasoning model. IMO/IOI gold medals, 96% AIME, #7 Arena Elo 1361.",
    performance: "96% AIME, 99.2% HMMT, 2701 Codeforces, 30.6% HLE. Gold medals at IMO and IOI.",
    comparisons: "Matches/exceeds GPT-5 on reasoning. 7th overall on Arena. Higher token cost.",
    community: "Landmark for open-source AI. IMO/IOI golds widely praised.",
    useCaseDeep: "Competitive programming, mathematical olympiad, deep algorithmic analysis.",
    latestNews: "Retired from API early 2026. Weights on Hugging Face.",
    sources: [{ title: "arXiv", url: "https://arxiv.org/html/2512.02556v1" }]
  },
  {
    slug: "deepseek-v3-2-exp",
    keyMetrics: [
      { label: "Parameters", value: "685B MoE" },
      { label: "Architecture", value: "DeepSeek Sparse Attention (DSA)" },
      { label: "Pricing", value: "$0.14/$0.21 per 1M tokens", context: "50% cheaper than V3.1-Terminus" },
      { label: "Release Date", value: "September 29, 2025" }
    ],
    pros: ["Introduces DSA (O(L²)→O(Lk))", "50%+ price reduction vs V3.1-Terminus", "Improved long-context efficiency", "Open-source with GPU kernels"],
    cons: ["Experimental, not production", "Comparable to V3.1-Terminus", "Superseded by V3.2", "Limited benchmark data"],
    competitorTable: [
      { name: "V3.1-Terminus", swe: "66.0%", price: "$0.30/$0.95" },
      { name: "V3.2", swe: "73.1%", price: "$0.28/$0.42" }
    ],
    summary: "DeepSeek-V3.2-Exp introduced DeepSeek Sparse Attention (DSA), reducing attention complexity from O(L²) to O(Lk). 50%+ cheaper than V3.1-Terminus.",
    performance: "Performance parity with V3.1-Terminus at half the cost.",
    comparisons: "Technology preview for V3.2. DSA became core of all subsequent models.",
    community: "Research community interested in DSA. GPU kernels well-received.",
    useCaseDeep: "Cost-sensitive long-context processing, DSA validation.",
    latestNews: "Stepping stone to V3.2 (December 2025).",
    sources: [{ title: "DeepSeek API", url: "https://api-docs.deepseek.com/news/news250929" }]
  },
  {
    slug: "deepseek-v3-1-terminus",
    keyMetrics: [
      { label: "Parameters", value: "684.5B MoE" },
      { label: "GPQA Diamond", value: "74.9%" },
      { label: "SWE-Bench Verified", value: "66.0%" },
      { label: "MMLU-Redux", value: "91.8%" },
      { label: "Pricing", value: "$0.30/$0.95 per 1M tokens" },
      { label: "Release Date", value: "September 22, 2025" }
    ],
    pros: ["Strong coding agent (66% SWE-Bench)", "Excellent general knowledge (91.8% MMLU)", "Extended long-context training", "MIT license"],
    cons: ["Non-thinking mode only", "AIME 2025 modest (49.8%)", "Trails frontier by 10+ pp", "Quickly superseded"],
    competitorTable: [
      { name: "V3.1", gpqa: "80.1%", price: "$0.28/$0.42" },
      { name: "V3.2", gpqa: "82.4%", price: "$0.28/$0.42" }
    ],
    summary: "DeepSeek-V3.1 Terminus is an extended pre-training variant with 684.5B params trained on 6.7T tokens.",
    performance: "74.9% GPQA, 66% SWE-Bench, 91.8% MMLU-Redux, 31.3% Terminal-Bench.",
    comparisons: "Better long-context than V3.1. Lacks thinking capabilities.",
    community: "Solid incremental improvement. Short-lived as recommended model.",
    useCaseDeep: "Long-context processing, code analysis, agent workflows without thinking.",
    latestNews: "Final V3.1 model before V3.2 transition.",
    sources: [{ title: "Hugging Face", url: "https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Terminus" }]
  },
  {
    slug: "deepseekmath-v2",
    keyMetrics: [
      { label: "Base Model", value: "V3.2-Exp-Base (685B MoE)" },
      { label: "IMO 2025", value: "5/6 problems (83.3%)" },
      { label: "CMO 2024", value: "5/6 problems (73.8%)" },
      { label: "Putnam 2024", value: "118/120 (98.3%)", context: "Surpasses human best (90)" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "November 27, 2025" }
    ],
    pros: ["IMO 2025 gold medal (5/6)", "Putnam 2024 near-perfect (118/120 vs human best 90)", "Self-verifiable reasoning framework", "Open-source with full methodology"],
    cons: ["Specialized for math theorem proving", "High compute for best results", "Not a general-purpose model"],
    competitorTable: [
      { name: "Gemini 2.5 Pro", gpqa: "~80%" },
      { name: "GPT-5 Thinking", gpqa: "85.7%" }
    ],
    summary: "DeepSeekMath-V2 achieves gold-medal IMO 2025 (5/6) and near-perfect Putnam 2024 (118/120 vs human best 90). Novel self-verifiable reasoning.",
    performance: "Breakthrough in mathematical theorem proving. Self-verification achieves 96% quality score.",
    comparisons: "Outperforms DeepMind DeepThink on IMO-ProofBench. Superhuman Putnam performance.",
    community: "Significant excitement in mathematical AI community.",
    useCaseDeep: "Mathematical research, proof verification, olympiad preparation.",
    latestNews: "Techniques incorporated into V3.2 Speciale. 1.5K+ GitHub stars.",
    sources: [{ title: "GitHub", url: "https://github.com/deepseek-ai/DeepSeek-Math-V2" }]
  },
  {
    slug: "deepseek-ocr",
    keyMetrics: [
      { label: "OCR Precision", value: "97% at <10x compression" },
      { label: "Vision Tokens", value: "64-1853 per page" },
      { label: "Production Speed", value: "200k+ pages/day (single A100)" },
      { label: "Languages", value: "~100" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "October 20, 2025" }
    ],
    pros: ["Revolutionary compression (97% at 10x)", "200k+ pages/day on single GPU", "~100 language support", "Deep parsing (charts, formulas)"],
    cons: ["Not a general VLM", "Degrades at 20x compression", "No SFT stage (not a chatbot)"],
    competitorTable: [{ name: "GOT-OCR2.0" }, { name: "MinerU2.0" }],
    summary: "DeepSeek-OCR pioneers optical compression: 97% precision at 10x compression. 200k+ pages/day on single A100, ~100 languages.",
    performance: "SOTA on OmniDocBench with fewest vision tokens. 60x more efficient than MinerU2.0.",
    comparisons: "Unique value is extreme token efficiency for large-scale processing.",
    community: "Highly impressed by compression ratios. Novel research direction.",
    useCaseDeep: "Online OCR for LLMs, batch PDF processing for pretraining data.",
    latestNews: "Succeeded by OCR 2 (January 2026).",
    sources: [{ title: "arXiv", url: "https://arxiv.org/pdf/2510.18234" }]
  },
  {
    slug: "deepseek-ocr-2",
    keyMetrics: [
      { label: "Parameters", value: "3.5B" },
      { label: "OmniDocBench v1.5", value: "91.09%", context: "Best end-to-end" },
      { label: "Improvement", value: "+3.73% over OCR 1" },
      { label: "Vision Tokens", value: "1120 max per page" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "January 27, 2026" }
    ],
    pros: ["SOTA 91.09% OmniDocBench v1.5", "Novel Visual Causal Flow architecture", "+3.73% over OCR 1", "Lower repetition rates"],
    cons: ["Specialized for OCR", "Newspaper recognition challenging", "Higher token budget than OCR 1 compressed modes"],
    competitorTable: [{ name: "DeepSeek-OCR" }, { name: "Gemini-3 Pro" }, { name: "Qwen3-VL-235B" }],
    summary: "DeepSeek-OCR 2 achieves 91.09% on OmniDocBench v1.5 with novel Visual Causal Flow architecture. Best end-to-end OCR model.",
    performance: "Best overall OmniDocBench score. 3.73% improvement over OCR 1.",
    comparisons: "Surpasses pipeline systems. Novel causal encoding approach.",
    community: "Visual Causal Flow architecture received significant research interest.",
    useCaseDeep: "Production OCR, pretraining data pipelines, complex layout documents.",
    latestNews: "2.7K+ GitHub stars. Proposes path toward native multimodality.",
    sources: [{ title: "arXiv", url: "https://arxiv.org/html/2601.20552v1" }]
  },
  // === GLM (Zhipu AI) ===
  {
    slug: "glm-5",
    keyMetrics: [
      { label: "Parameters", value: "744B total / 40B active MoE" },
      { label: "Arena Elo", value: "1452-1456", context: "#1 open-weight" },
      { label: "SWE-Bench Verified", value: "77.8%" },
      { label: "AIME 2025", value: "92.7%" },
      { label: "Pricing", value: "$1.00/$3.20 per 1M tokens" },
      { label: "License", value: "MIT" },
      { label: "Training Hardware", value: "Huawei Ascend 910B" },
      { label: "Release Date", value: "February 11, 2026" }
    ],
    pros: ["#1 open-weight on LMArena (1452 Elo)", "SWE-Bench 77.8% beats Gemini 3 Pro and GPT-5.2", "MIT license", "Trained on Huawei Ascend (zero Nvidia)", "Strong agentic performance (TAU-Bench 98%)"],
    cons: ["Text-only, no multimodal", "744B requires 8x H200 for self-hosting", "GPQA trails frontier by 5-10 points"],
    competitorTable: [
      { name: "Claude Opus 4.6", arena: "1548", swe: "57.3 Pro", gpqa: "91.3", price: "$5/$25" },
      { name: "GPT-5.2", swe: "75.4", price: "$2.50/$10" },
      { name: "Gemini 3 Pro", arena: "~1449", swe: "76.2", price: "$1.25/$5.00" }
    ],
    summary: "GLM-5 is Zhipu AI's flagship 744B MoE model. #1 open-weight on LMArena (1452 Elo), 77.8% SWE-Bench Verified surpassing Gemini 3 Pro and GPT-5.2. Trained entirely on Huawei Ascend chips, MIT licensed.",
    performance: "77.8% SWE-Bench Verified, 92.7% AIME, 90.1 MMLU, 56.2 Terminal-Bench. 98% TAU-Bench Telecom.",
    comparisons: "Competes with Opus 4.6 and GPT-5.2 on coding. 1/5 of Opus cost. Text-only limits multimodal use.",
    community: "Processed 40B tokens on launch day. Zhipu stock surged 34%. MIT license widely praised.",
    useCaseDeep: "Agentic coding, software engineering, long-horizon autonomous tasks, cost-effective frontier alternative.",
    latestNews: "GLM-5.1 released 7 weeks later. FP8 weights 795K+ downloads.",
    sources: [{ title: "arXiv", url: "https://arxiv.org/html/2602.15763v1" }]
  },
  {
    slug: "glm-5-1",
    keyMetrics: [
      { label: "Parameters", value: "754B total / 40B active MoE" },
      { label: "Code Arena Elo", value: "1530", context: "#3 overall, first open-weight in top 3" },
      { label: "SWE-Bench Pro", value: "58.4%", context: "#1 at launch" },
      { label: "GPQA Diamond", value: "86.2%" },
      { label: "AIME 2026", value: "95.3%" },
      { label: "HLE (with tools)", value: "52.3", context: "Leads Opus 4.6 (45.0)" },
      { label: "Pricing", value: "$1.40/$4.40 per 1M tokens" },
      { label: "License", value: "MIT" },
      { label: "Release Date", value: "April 7, 2026" }
    ],
    pros: ["First open-weight in Code Arena top 3 (1530 Elo)", "SWE-Bench Pro 58.4% #1 at launch", "Leads on MCP-Atlas, NL2Repo, CyberGym", "MIT license", "8+ hour autonomous tasks"],
    cons: ["GPQA 86.2 trails Opus 91.3", "200K context limiting for monorepos", "3x peak-hour pricing surcharge", "1.5TB FP8 weights need 8x H200"],
    competitorTable: [
      { name: "Claude Opus 4.6", arena: "1548 Code", swe: "57.3 Pro", gpqa: "91.3", price: "$5/$25" },
      { name: "GPT-5.4", swe: "57.7 Pro", gpqa: "92.0", price: "$2.50/$10" },
      { name: "Kimi K2.6", swe: "58.6 Pro", price: "$0.60/$2.00" }
    ],
    summary: "GLM-5.1 is a post-training refinement optimized for agentic engineering. First open-weight in Code Arena top 3 (1530 Elo), SWE-Bench Pro 58.4% #1 at launch.",
    performance: "SWE-Bench Pro 58.4%, GPQA 86.2%, AIME 95.3%, HLE 52.3 (with tools), MCP-Atlas 71.8.",
    comparisons: "1/5 of Opus cost, comparable SWE-Bench. MIT license unique at this tier.",
    community: "Strong reception for Code Arena placement. 8-hour demo impressed developers.",
    useCaseDeep: "Agentic coding, repo-level refactoring, long-horizon development, tool-heavy scenarios.",
    latestNews: "Released April 7, 2026. Kimi K2.6 surpassed SWE-Bench Pro two weeks later.",
    sources: [{ title: "Z.ai Blog", url: "https://z.ai/blog/glm-5.1" }]
  },
  {
    slug: "glm-4-7",
    keyMetrics: [
      { label: "Parameters", value: "3.58T MoE" },
      { label: "Context Window", value: "200K tokens" },
      { label: "Tau2-Bench", value: "84.7", context: "Open-source SOTA" },
      { label: "BrowseComp", value: "67" },
      { label: "Pricing", value: "~$0.50/$1.60 per 1M tokens" },
      { label: "Release Date", value: "Late 2025" }
    ],
    pros: ["Strong agentic coding with think-then-act", "Tau2-Bench 84.7 open-source SOTA", "Improved frontend aesthetics", "200K context with 128K output"],
    cons: ["Text-only", "Superseded by GLM-5 series", "3.58T params extremely expensive to self-host"],
    competitorTable: [
      { name: "Claude Sonnet 4.5", price: "$3/$15" },
      { name: "DeepSeek V3", price: "$0.27/$1.10" },
      { name: "GLM-5", arena: "1452", swe: "77.8", price: "$1/$3.20" }
    ],
    summary: "GLM-4.7 is Zhipu's high-intelligence model with 3.58T params. Tau2-Bench 84.7 open-source SOTA for tool calling.",
    performance: "Tau2-Bench 84.7 (OSS SOTA), BrowseComp 67. Strong agentic and coding.",
    comparisons: "Bridges GLM-4 and GLM-5. Tool-calling competitive with Sonnet 4.5.",
    community: "Moderate attention, overshadowed by GLM-5 rapid releases.",
    useCaseDeep: "Agentic coding, frontend development, complex demo creation.",
    latestNews: "Quickly superseded by GLM-5 (Feb 2026).",
    sources: [{ title: "Z.ai Docs", url: "https://docs.bigmodel.cn/cn/guide/models/text/glm-4.7" }]
  },
  {
    slug: "glm-4-7-flash",
    keyMetrics: [
      { label: "Parameters", value: "~310B MoE" },
      { label: "Context Window", value: "200K tokens" },
      { label: "AA Intelligence Index", value: "22.1" },
      { label: "Output Speed", value: "87.8 tok/s" },
      { label: "Pricing", value: "$0.06/$0.40 per 1M tokens" },
      { label: "Release Date", value: "January 19, 2026" }
    ],
    pros: ["Extremely affordable ($0.06/$0.40)", "200K context at budget price", "Text+image input", "Good speed (87.8 tok/s)"],
    cons: ["Low intelligence (AA Index 22.1)", "GPQA/HLE 0.5 each", "Not for complex reasoning", "Superseded by GLM-5"],
    competitorTable: [
      { name: "GPT-4o-mini", price: "$0.15/$0.60" },
      { name: "DeepSeek V3-Chat", price: "$0.27/$1.10" }
    ],
    summary: "GLM-4.7-Flash is a budget variant at $0.06/$0.40 per 1M tokens. 200K context, image input, but low intelligence.",
    performance: "AA Index 22.1, GPQA/HLE 0.5. Designed for high-volume low-complexity tasks.",
    comparisons: "Cheapest option for basic tasks. Not comparable to full GLM-4.7 or GLM-5.",
    community: "Limited attention as budget-tier model.",
    useCaseDeep: "Text summarization, simple Q&A, content classification at scale.",
    latestNews: "Released January 2026. GLM-5 series now preferred.",
    sources: [{ title: "CloudPrice", url: "https://cloudprice.net/models/zhipu-glm-4-7-flash" }]
  },
  {
    slug: "glm-5-turbo",
    keyMetrics: [
      { label: "Context Window", value: "200K tokens" },
      { label: "Claw Bench", value: "93.80", context: "#1 / 27 models" },
      { label: "Coding Accuracy", value: "95.5%", context: "94th percentile" },
      { label: "Reliability", value: "100%", context: "Across all 8 benchmarks" },
      { label: "Pricing", value: "$1.20/$4.00 per 1M tokens" },
      { label: "Release Date", value: "March 15, 2026" }
    ],
    pros: ["#1 Claw Bench (93.80)", "100% reliability across benchmarks", "Perfect hallucination/ethics scores", "95.5% coding accuracy"],
    cons: ["Proprietary/closed-source", "Parameter count undisclosed", "Moderate speed (33rd percentile)"],
    competitorTable: [
      { name: "GLM-5", arena: "1452", swe: "77.8", price: "$1.00/$3.20" },
      { name: "Claude Sonnet 4.5", price: "$3/$15" }
    ],
    summary: "GLM-5-Turbo is speed-optimized for agent workflows. #1 Claw Bench (93.80), 100% reliability, closed-source.",
    performance: "Claw Bench 93.80 (#1), 95.5% coding, 95.0% math, 100% reliability.",
    comparisons: "Optimized for agent stability over raw benchmarks. Between GLM-5 and GLM-5.1 in lineup.",
    community: "Niche model for agent workflows. 100% reliability praised.",
    useCaseDeep: "OpenClaw/Lobster agents, long-chain execution, automated refactoring.",
    latestNews: "Released March 15, 2026.",
    sources: [{ title: "DataLearnerAI", url: "https://www.datalearner.com/en/ai-models/pretrained-models/glm-5-turbo" }]
  },
  {
    slug: "glm-4-5v",
    keyMetrics: [
      { label: "Parameters", value: "106B total / 12B active MoE" },
      { label: "Context Window", value: "32K tokens (128K in successor)" },
      { label: "Modalities", value: "Video, Image, Text, File" },
      { label: "Pricing", value: "$0.60/$1.80 per 1M tokens" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "July 2025" }
    ],
    pros: ["SOTA among open-source VLMs (42 benchmarks)", "Competitive with Gemini-2.5-Flash on coding", "Thinking/non-thinking modes", "Apache 2.0"],
    cons: ["16K max output limiting", "32K training context", "Superseded by GLM-4.6V"],
    competitorTable: [
      { name: "Gemini-2.5-Flash", price: "N/A" },
      { name: "Qwen2.5-VL-72B", price: "N/A" },
      { name: "GLM-4.6V", price: "$0.30/$0.90" }
    ],
    summary: "GLM-4.5V is Zhipu's open-source VLM with 106B/12B active params. SOTA across 42 visual benchmarks. Apache 2.0.",
    performance: "SOTA among OSS VLMs of similar size. Competitive with Gemini-2.5-Flash.",
    comparisons: "Strong for its size class. 12B active params outperform much larger models.",
    community: "2,254 GitHub stars. RLCS training methodology praised.",
    useCaseDeep: "Web coding from screenshots, GUI agents, document interpretation, video understanding.",
    latestNews: "Succeeded by GLM-4.6V (December 2025).",
    sources: [{ title: "Z.ai Docs", url: "https://docs.z.ai/guides/vlm/glm-4.5v" }]
  },
  {
    slug: "glm-4-6v-106b-a12b",
    keyMetrics: [
      { label: "Parameters", value: "108B total / 12B active MoE" },
      { label: "Context Window", value: "128K tokens" },
      { label: "AA Intelligence Index", value: "23" },
      { label: "Pricing", value: "$0.30/$0.90 per 1M tokens" },
      { label: "License", value: "MIT" },
      { label: "Native Function Call", value: "Yes (first GLM VLM)" },
      { label: "Release Date", value: "December 2025" }
    ],
    pros: ["First GLM VLM with native multimodal function calling", "128K context for 150+ pages or 1hr video", "MIT license", "Competitive pricing ($0.30/$0.90)"],
    cons: ["Slow output (36.7 tok/s)", "Verbose output (90M tokens for eval)", "AA Index 23 moderate", "Superseded by GLM-5V Turbo"],
    competitorTable: [
      { name: "Gemini 3 Pro", arena: "~1449" },
      { name: "Qwen3-VL-235B", price: "N/A" },
      { name: "GLM-4.5V", price: "$0.60/$1.80" }
    ],
    summary: "GLM-4.6V is a multimodal VLM with 108B/12B active params, 128K context, native multimodal function calling. MIT license.",
    performance: "AA Index 23. Strong visual understanding. Slow at 36.7 tok/s.",
    comparisons: "128K context (vs 32K), native function calling, better pricing ($0.30/$0.90 vs $0.60/$1.80). Cost-effective OSS VLM. Native function calling enables complex multimodal agents.",
    community: "Praised for multimodal function calling. Slow speed noted.",
    useCaseDeep: "Document parsing, video analysis, GUI tasks, intelligent content creation.",
    latestNews: "GLM-5V Turbo recommended as newer alternative.",
    sources: [{ title: "Z.ai Docs", url: "https://docs.bigmodel.cn/cn/guide/models/vlm/glm-4.6v" }]
  },
  {
    slug: "glm-ocr",
    keyMetrics: [
      { label: "Parameters", value: "0.9B (900M)" },
      { label: "OmniDocBench v1.5", value: "94.62", context: "#1 overall" },
      { label: "OCRBench", value: "94.0" },
      { label: "Throughput", value: "1.86 pages/sec (PDF)" },
      { label: "Pricing", value: "~$0.03/1M tokens" },
      { label: "Languages", value: "8 languages" },
      { label: "Release Date", value: "March 2025" }
    ],
    pros: ["SOTA OmniDocBench v1.5 (94.62) with only 0.9B params", "1/10 cost of traditional OCR", "Multi-Token Prediction ~50% throughput boost", "8 languages, edge-deployable"],
    cons: ["Very specialized", "No video/interactive tasks", "KIE trails Gemini-3-Pro"],
    competitorTable: [
      { name: "PaddleOCR-VL-1.5", price: "N/A" },
      { name: "MinerU2.5", price: "N/A" },
      { name: "DeepSeek-OCR", price: "N/A" }
    ],
    summary: "GLM-OCR is a 0.9B model achieving SOTA on OmniDocBench v1.5 (94.62), surpassing 235B models. ~$0.03/1M tokens, 8 languages.",
    performance: "94.62 OmniDocBench (#1), 94.0 OCRBench, 96.5 UniMERNet. 50% throughput via Multi-Token Prediction.",
    comparisons: "Matches PaddleOCR-VL-1.5 at similar size. 10x cheaper than traditional OCR.",
    community: "Positive for SOTA at 0.9B. Edge deployment capability highlighted.",
    useCaseDeep: "Document OCR, table parsing, KIE, batch processing for RAG pipelines.",
    latestNews: "Released March 2025. Available via vLLM, SGLang, Ollama.",
    sources: [{ title: "arXiv", url: "https://arxiv.org/html/2603.10910" }]
  },
  {
    slug: "glm-image",
    keyMetrics: [
      { label: "Architecture", value: "Autoregressive (9B) + Diffusion (7B)" },
      { label: "CVTG-2K Word Accuracy", value: "0.9116", context: "#1 open-source" },
      { label: "LongText-Bench EN", value: "0.9524", context: "#1 open-source" },
      { label: "LongText-Bench CN", value: "0.9788", context: "#1 open-source" },
      { label: "Price", value: "$0.015 per image" },
      { label: "License", value: "Apache 2.0" },
      { label: "Release Date", value: "January 9, 2026" }
    ],
    pros: ["Open-source SOTA text rendering (#1 CVTG-2K, LongText-Bench)", "Hybrid architecture combines semantics + detail", "Excels at knowledge-intensive generation", "Very affordable ($0.015/image)"],
    cons: ["General quality matches but doesn't surpass mainstream models", "Max 2048px resolution", "Smaller community (912 GitHub stars)"],
    competitorTable: [
      { name: "DALL-E 3", price: "$0.04-$0.08/image" },
      { name: "Midjourney v6", price: "Subscription" },
      { name: "Stable Diffusion 3", price: "Free (self-host)" }
    ],
    summary: "GLM-Image is a hybrid autoregressive+diffusion image generator. #1 open-source in text rendering accuracy. $0.015/image, Apache 2.0.",
    performance: "CVTG-2K 0.9116 word accuracy (#1 OSS), LongText-Bench 0.9524 EN / 0.9788 CN (#1 OSS).",
    comparisons: "Unique niche in text-heavy image generation. Cheaper than DALL-E 3 with better text accuracy.",
    community: "912 GitHub stars. Innovative hybrid architecture noted.",
    useCaseDeep: "Posters, scientific diagrams, PPTs, knowledge-intensive image generation with accurate text.",
    latestNews: "Released January 9, 2026.",
    sources: [{ title: "Z.ai Blog", url: "https://z.ai/blog/glm-image" }]
  },
  // === Claude (Anthropic) ===
  {
    slug: "anthropic-claude-opus-4-6",
    keyMetrics: [
      { label: "Arena Elo", value: "1498", context: "#1 overall" },
      { label: "SWE-Bench Verified", value: "80.8%", context: "Production frontier" },
      { label: "GPQA Diamond", value: "91.3%" },
      { label: "Pricing", value: "$5.00/$25.00 per 1M tokens" },
      { label: "Context Window", value: "1M tokens" },
      { label: "Release Date", value: "February 5, 2026" }
    ],
    pros: ["#1 on Arena Elo (1498)", "SWE-Bench 80.8% — highest production score", "GPQA 91.3% leads reasoning benchmarks", "1M context window", "Strong instruction following"],
    cons: ["Expensive at $5/$25 per 1M tokens", "Slower than Haiku/Sonnet for latency-sensitive tasks", "Text+image input only, no audio/video"],
    competitorTable: [
      { name: "GPT-5.4", arena: "~1470", swe: "77.5%", gpqa: "92.0%", price: "$2.50/$10.00" },
      { name: "Gemini 3 Pro", arena: "~1449", swe: "76.2%", price: "$1.25/$5.00" },
      { name: "Claude Sonnet 5", arena: "~1430", swe: "92.4%", price: "$3/$15" }
    ],
    summary: "Claude Opus 4.6 is Anthropic's flagship model and the highest-ranked on Chatbot Arena (Elo 1498). Leads on SWE-Bench Verified (80.8%) and GPQA Diamond (91.3%) with a 1M token context window.",
    performance: "SWE-Bench 80.8% (#1 production), GPQA 91.3%, Arena Elo 1498. Excels across coding, reasoning, and instruction following.",
    comparisons: "Leads Opus 4.5 by 100+ Elo points. 1M context enables complex multi-document workflows. Trails Claude Sonnet 5 on SWE-Bench but excels in broader tasks.",
    community: "Consistently rated #1 on Arena. Developers praise instruction following and long-context performance.",
    useCaseDeep: "Frontier coding, complex reasoning, enterprise automation, long-document analysis, and research workflows.",
    latestNews: "Released February 5, 2026. Continues Anthropic's rapid iteration cadence.",
    sources: [{ title: "Anthropic", url: "https://www.anthropic.com/news/claude-opus-4-6" }]
  },
  {
    slug: "claude-opus-4-1",
    keyMetrics: [
      { label: "SWE-Bench Verified", value: "74.5%" },
      { label: "GPQA Diamond", value: "80.9%" },
      { label: "Pricing", value: "$15.00/$75.00 per 1M tokens", context: "Legacy pricing" },
      { label: "Context Window", value: "200K tokens" },
      { label: "Release Date", value: "August 5, 2025" }
    ],
    pros: ["Strong SWE-Bench (74.5%)", "Excellent instruction following", "200K context", "Extended thinking mode"],
    cons: ["Legacy model — superseded by Opus 4.5 and 4.6", "Very expensive ($15/$75)", "200K context now standard"],
    competitorTable: [
      { name: "Claude Opus 4.5", swe: "68.4%", gpqa: "86.5%", price: "$12/$60" },
      { name: "Claude Opus 4.6", swe: "80.8%", gpqa: "91.3%", price: "$5/$25" }
    ],
    summary: "Claude Opus 4.1 was Anthropic's flagship reasoning model in 2025. 74.5% SWE-Bench, 80.9% GPQA. Superseded by Opus 4.5 and 4.6.",
    performance: "SWE-Bench 74.5%, GPQA 80.9%. Competitive for its era but outpaced by rapid Claude iterations.",
    comparisons: "Was top-tier when released. Opus 4.6 achieved 80.8% SWE-Bench at 1/3 the price.",
    community: "Appreciated for reasoning depth. Quickly overshadowed by faster Claude releases.",
    useCaseDeep: "Legacy reasoning tasks, complex analysis (now better served by Opus 4.6).",
    latestNews: "Superseded by Opus 4.5 (Oct 2025) and Opus 4.6 (Feb 2026).",
    sources: [{ title: "Anthropic", url: "https://www.anthropic.com/news/claude-opus-4-1" }]
  },
  {
    slug: "claude-sonnet-4-6",
    keyMetrics: [
      { label: "Arena Elo", value: "1467" },
      { label: "SWE-Bench Verified", value: "80.2%" },
      { label: "Pricing", value: "$3.00/$15.00 per 1M tokens" },
      { label: "Context Window", value: "1M tokens" },
      { label: "Release Date", value: "February 17, 2026" }
    ],
    pros: ["SWE-Bench 80.2% at $3/$15 — excellent value", "1M context window", "Strong code and reasoning", "2.5x cheaper than Opus 4.6"],
    cons: ["Lower Arena Elo than Opus 4.6", "Trails Opus on complex multi-step reasoning", "No audio input"],
    competitorTable: [
      { name: "Claude Opus 4.6", arena: "1498", swe: "80.8%", price: "$5/$25" },
      { name: "GPT-5.4", swe: "77.5%", price: "$2.50/$10" },
      { name: "Gemini 3 Pro", swe: "76.2%", price: "$1.25/$5" }
    ],
    summary: "Claude Sonnet 4.6 is Anthropic's high-value model. 80.2% SWE-Bench at $3/$15 — approaching Opus-level coding at 60% lower cost.",
    performance: "SWE-Bench 80.2%, strong reasoning and code generation. 1M context for complex workflows.",
    comparisons: "Near-Opus coding performance at Sonnet pricing. Best value for production coding workloads.",
    community: "Rapidly adopted for cost-effective production deployments. Strong developer preference.",
    useCaseDeep: "Production coding, API integrations, cost-conscious frontier workflows.",
    latestNews: "Released February 17, 2026. Most popular Claude model for production use.",
    sources: [{ title: "Anthropic", url: "https://www.anthropic.com/news/claude-sonnet-4-6" }]
  },
  {
    slug: "claude-sonnet-5",
    keyMetrics: [
      { label: "SWE-Bench Verified", value: "92.4%", context: "#1 overall, production" },
      { label: "Pricing", value: "$3.00/$15.00 per 1M tokens" },
      { label: "Context Window", value: "200K tokens" },
      { label: "Release Date", value: "April 2026" }
    ],
    pros: ["SWE-Bench 92.4% — absolute production #1", "Maintains Sonnet pricing ($3/$15)", "Major leap in code generation quality", "Strong agentic capabilities"],
    cons: ["200K context (vs 1M on 4.6 models)", "Higher token consumption per task", "Newer model, less battle-tested"],
    competitorTable: [
      { name: "Claude Opus 4.6", swe: "80.8%", price: "$5/$25" },
      { name: "GPT-5.4", swe: "77.5%", price: "$2.50/$10" },
      { name: "Gemini 3 Pro", swe: "76.2%", price: "$1.25/$5" }
    ],
    summary: "Claude Sonnet 5 achieves 92.4% SWE-Bench Verified — the highest production score ever recorded. At $3/$15, it redefines what's possible at Sonnet-tier pricing.",
    performance: "92.4% SWE-Bench Verified (#1 overall), massive leap from Sonnet 4.6's 80.2%. Exceptional at code generation and refactoring.",
    comparisons: "12+ point improvement over Opus 4.6 on SWE-Bench. The new benchmark leader for production code.",
    community: "Industry-leading SWE-Bench score generates significant excitement. Concerns about benchmark saturation.",
    useCaseDeep: "Production code generation, large-scale refactoring, software engineering automation.",
    latestNews: "Released April 2026. New SWE-Bench Verified #1.",
    sources: [{ title: "Anthropic", url: "https://www.anthropic.com/news/claude-sonnet-5" }]
  },
  {
    slug: "claude-haiku-4-5",
    keyMetrics: [
      { label: "Arena Elo", value: "1220" },
      { label: "SWE-Bench Verified", value: "73.3%" },
      { label: "Pricing", value: "$1.00/$5.00 per 1M tokens" },
      { label: "Context Window", value: "200K tokens" },
      { label: "Release Date", value: "October 15, 2025" }
    ],
    pros: ["Best value in the Claude lineup", "SWE-Bench 73.3% at $1/$5", "Fast inference latency", "200K context"],
    cons: ["Lower reasoning depth than Sonnet/Opus", "Not suitable for complex multi-step tasks", "Trails frontier models on GPQA"],
    competitorTable: [
      { name: "Claude Sonnet 4.6", swe: "80.2%", price: "$3/$15" },
      { name: "GPT-4o-mini", swe: "23.6%", price: "$0.15/$0.60" },
      { name: "Gemini Flash 2.5", price: "$0.15/$0.60" }
    ],
    summary: "Claude Haiku 4.5 is Anthropic's speed and cost-optimized model. 73.3% SWE-Bench at $1/$5, with 200K context. Best value for high-throughput tasks.",
    performance: "SWE-Bench 73.3%, strong for its price tier. Fast inference for latency-sensitive applications.",
    comparisons: "3x cheaper than Sonnet 4.6 with ~7% lower SWE-Bench. Best price-performance ratio in Claude family.",
    community: "Widely adopted for production high-throughput workflows. Good balance of speed and capability.",
    useCaseDeep: "High-volume API processing, customer service, content moderation, real-time applications.",
    latestNews: "Released October 15, 2025. Continues to be recommended for cost-sensitive workloads.",
    sources: [{ title: "Anthropic", url: "https://www.anthropic.com/news/claude-haiku-4-5" }]
  }
];

let inserted = 0;
let skipped = 0;

for (const a of analyses) {
  const model = db.prepare("SELECT id FROM models WHERE slug = ?").get(a.slug) as { id: number } | undefined;
  if (!model) {
    console.log(`  ⚠ ${a.slug} - model not found`);
    skipped++;
    continue;
  }

  const existing = db.prepare("SELECT id FROM model_analyses WHERE model_id = ? AND language = 'en'").get(model.id);
  if (existing) {
    console.log(`  ⏭ ${a.slug} - already exists`);
    skipped++;
    continue;
  }

  const now = new Date().toISOString();
  db.prepare(`INSERT INTO model_analyses (model_id, language, key_metrics_json, pros_json, cons_json, competitors_json, summary, performance, comparisons, community, use_case_deep, latest_news, sources_json, generated_at) VALUES (?, 'en', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    model.id,
    JSON.stringify(a.keyMetrics),
    JSON.stringify(a.pros),
    JSON.stringify(a.cons),
    JSON.stringify(a.competitorTable),
    a.summary,
    a.performance,
    a.comparisons,
    a.community,
    a.useCaseDeep,
    a.latestNews,
    JSON.stringify(a.sources),
    now
  );

  // JA fallback
  const existingJa = db.prepare("SELECT id FROM model_analyses WHERE model_id = ? AND language = 'ja'").get(model.id);
  if (!existingJa) {
    db.prepare(`INSERT INTO model_analyses (model_id, language, key_metrics_json, pros_json, cons_json, competitors_json, summary, performance, comparisons, community, use_case_deep, latest_news, sources_json, generated_at) VALUES (?, 'ja', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      model.id,
      JSON.stringify(a.keyMetrics),
      JSON.stringify(a.pros),
      JSON.stringify(a.cons),
      JSON.stringify(a.competitorTable),
      a.summary,
      a.performance,
      a.comparisons,
      a.community,
      a.useCaseDeep,
      a.latestNews,
      JSON.stringify(a.sources),
      now
    );
  }

  console.log(`  ✓ ${a.slug}`);
  inserted++;
}

console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`);
