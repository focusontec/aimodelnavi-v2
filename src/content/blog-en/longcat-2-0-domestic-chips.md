---
title: "Meituan's LongCat-2.0: A 1.6-Trillion-Parameter Coding Model Trained Entirely on Chinese Chips, Now MIT-Licensed"
date: "2026-07-02"
tag: "Open Source"
excerpt: "Meituan has open-sourced LongCat-2.0, a 1.6-trillion-parameter MoE coding model trained exclusively on 50,000 domestic Chinese chips, with no Nvidia GPUs. It surpasses GPT-5.5 on the SWE-bench Pro benchmark and offers MIT licensing with aggressive API pricing, marking a significant step in China's AI chip self-sufficiency."
---

Meituan has officially open-sourced **LongCat-2.0**, a Mixture-of-Experts (MoE) coding model with a massive **1.6 trillion** parameters. This is more than just another model release: it's believed to be the **largest frontier AI model ever trained completely on domestic Chinese chips**, with no Nvidia GPUs involved.

For the global AI industry, LongCat-2.0 sends a clear signal: despite chip export controls, China retains the capability to train models that compete with the world's best.

## Model Specifications

| Item | Specification |
|------|---------------|
| Developer | Meituan |
| Architecture | Sparse MoE |
| Total Parameters | **1.6 Trillion** (1.6T) |
| Active Parameters | **~48 Billion** (48B, dynamic range 33B-56B) |
| Context Window | **1M tokens** |
| Training Data | 35 Trillion tokens |
| License | **MIT** (Fully Open-Source) |
| Training Hardware | **50,000 domestic AI chips** (No Nvidia GPUs) |
| Communication Library | Huawei HCCL |
| Special Techniques | LongCat Sparse Attention, 135B N-gram Embedding Module |

## Benchmark Performance

| Benchmark | LongCat-2.0 | GPT-5.5 | Claude Opus 4.8 |
|-----------|-------------|---------|------------------|
| SWE-bench Pro | **59.5** | 58.6 | 69.2 |
| Terminal-Bench 2.1 | **70.8** | 78.2 | 82.7 |

LongCat-2.0 achieved a score of **59.5** on SWE-bench Pro, surpassing GPT-5.5's 58.6. This is a landmark achievement: **an open-source model trained entirely on domestic chips has beaten OpenAI's flagship model on a coding benchmark**.

However, on broader agent benchmarks (FORTE, BrowseComp), LongCat-2.0 still trails Claude Opus 4.8, indicating closed-source flagships maintain an advantage in complex reasoning and multi-step tasks.

## API Pricing

LongCat-2.0 is available on OpenRouter (previously listed anonymously as "Owl Alpha"):

| Pricing Tier | Input Price (per 1M tokens) | Output Price (per 1M tokens) |
|--------------|-----------------------------|-------------------------------|
| Standard | **$0.75** | **$2.95** |
| Promotional | $0.30 | $1.20 |
| Cache Hit | **Free** | — |

Competitive Comparison:

| Model | Input Price | Output Price |
|-------|-------------|--------------|
| **LongCat-2.0** | **$0.75** | **$2.95** |
| Kimi K2.7 Code | $0.95 | $4.00 |
| Claude Sonnet 5 | $2.00 | $10.00 |
| GPT-5.5 | $5.00 | $30.00 |

LongCat-2.0's pricing is approximately **one-seventh** that of GPT-5.5. It's also about 20% cheaper than Kimi K2.7 Code, another open-source model.

## Why This Matters

### 1. Independent Innovation Amid Chip Sanctions

Trained on 50,000 domestic AI chips using Huawei's HCCL library, **without a single Nvidia GPU**, LongCat-2.0 demonstrates:

- China can train frontier-scale AI models under chip sanctions.
- Domestic AI chip clusters have reached production-ready levels.
- The software ecosystem (HCCL) is progressively replacing CUDA.

### 2. Fully Open-Source Under MIT License

Unlike many "open-weight" models with restrictions, LongCat-2.0 uses the **MIT License**—one of the most permissive open-source licenses. This means:

- Commercial use without royalties.
- Modification and redistribution are allowed.
- Full local deployment with no usage limits.

### 3. Coding Capability Approaches the Frontier

A SWE-bench Pro score of 59.5 means LongCat-2.0 performs comparably to GPT-5.5 on real-world GitHub issue resolution tasks. For enterprises looking to deploy large-scale coding agents, it offers an extremely cost-effective option.

## What This Means for Developers

| Use Case | Recommended Model | Rationale |
|----------|-------------------|-----------|
| Cost-sensitive large-scale coding agents | **LongCat-2.0** | $0.75/M input, MIT license |
| Everyday coding assistance | **Kimi K2.7 Code** | Better Copilot integration & ecosystem |
| Complex reasoning & architecture design | **Claude Sonnet 5** | Strongest reasoning capabilities |
| Data-sensitive environments | **LongCat-2.0** | MIT license, fully local deployment |
| IDE-integrated workflows | **GPT-4o** | Most mature Copilot ecosystem |

## Conclusion

The release of LongCat-2.0 represents more than just a new model—it signals **a potential shift in the AI industry landscape**.

Key takeaways:
- A **1.6-trillion-parameter MoE model** trained entirely on domestic chips, without Nvidia GPUs.
- **SWE-bench Pro 59.5 surpasses GPT-5.5**, setting a new bar for open-source coding models.
- **MIT License** offers maximum permissiveness for commercial use.
- **API pricing at $0.75/M input**—roughly one-seventh the cost of GPT-5.5.
- **A major milestone in chip sovereignty**, proving frontier models can be trained under sanctions.

For developers and enterprises, LongCat-2.0 presents a compelling option: near-frontier performance, extremely low cost, and full open-source freedom. In an increasingly diverse model landscape, **cost and flexibility** are becoming as critical as raw capability in the decision-making process.