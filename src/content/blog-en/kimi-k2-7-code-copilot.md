---
title: "Kimi K2.7 Code Joins GitHub Copilot: First Open-Source Model Enters Mainstream Dev Tools"
date: "2026-07-02"
tag: "Open Source"
excerpt: "Kimi K2.7 Code, an open-source coding model from Moonshot AI, has been integrated into GitHub Copilot, marking the first time an open-weight model is available in the platform. This milestone highlights the growing adoption of open-source AI in mainstream development tools, offering cost-effective and flexible alternatives to proprietary models."
---

On July 1, 2026, GitHub officially announced that **Kimi K2.7 Code** is now available in the GitHub Copilot model selector. This is the **first open-weight model** in Copilot's history, marking a breakthrough for open-source AI in the developer toolchain.

For developers and businesses, including those in Japan, this means GitHub Copilot no longer offers only closed-source options like GPT-4o and Claude; now, you can choose a model that is **fully open-source, locally deployable, and performs close to closed-source flagships**.

## What is Kimi K2.7 Code?

Kimi K2.7 Code is a large language model optimized for coding, developed by China's Moonshot AI (月之暗面).

| Item | Specification |
|------|---------------|
| Developer | Moonshot AI (月之暗面) |
| Architecture | Sparse Mixture of Experts (MoE) |
| Total Parameters | **Approx. 1 trillion (1T)** |
| Active Parameters | **Approx. 32 billion (32B)** |
| Number of Experts | 384 |
| Context Window | **256K tokens** |
| License | Modified MIT (Open Weights) |
| API Pricing (Input) | $0.95/1M tokens |
| API Pricing (Output) | $4.00/1M tokens |
| Cached Input Pricing | $0.19/1M tokens |
| Release Date | June 12, 2026 |
| Copilot Launch Date | July 1, 2026 |

The core feature of Kimi K2.7 Code is its **sparse MoE architecture**—while the total parameter count reaches 1 trillion, only 32 billion parameters are activated per inference, balancing model capacity with inference efficiency.

## Performance Benchmarks

Kimi K2.7 Code's benchmark data is as follows:

| Benchmark | K2.7 Code | K2.6 (Previous) | Improvement |
|-----------|-----------|-----------------|-------------|
| Kimi Code Bench v2 | **62.0** | 50.9 | +21.8% |
| MCP Mark Verified | **81.1** | 72.8 | +11.4% |
| SWE Marathon | — | — | +76.2% |
| Program-Bench | **53.6** | 48.3 | +10.4% |
| MLS Bench Lite | **35.1** | 26.7 | +31.5% |

Notably, **K2.7 Code has not yet published official scores for SWE-bench Verified**. The previous K2.6 achieved **80.2%** on SWE-bench Verified; if K2.7 Code maintains or exceeds this level, it will become one of the strongest competitors among open-source coding models.

## How to Use in GitHub Copilot

Kimi K2.7 Code's current availability in GitHub Copilot:

| Plan | Availability | Notes |
|------|--------------|-------|
| Copilot Pro | ✅ Launched | Usage-based billing |
| Copilot Pro+ | ✅ Launched | Usage-based billing |
| Copilot Max | ✅ Launched | Usage-based billing |
| Copilot Business | ⏳ Coming Soon | Requires admin policy enablement |
| Copilot Enterprise | ⏳ Coming Soon | Requires admin policy enablement |

The model is hosted by **Microsoft Azure**, with pricing based on vendor list prices.

## Same-Day Release: Copilot Vision and Browser Tools GA

Alongside Kimi K2.7 Code, GitHub announced two other major updates:

### Copilot Vision (GA)

Copilot Vision allows developers to interact directly with visual content like screenshots, UI designs, and error messages in the IDE. The model can "see" your screen content and provide relevant suggestions.

### Browser Tools for Copilot in VS Code (GA)

This is a significant update—Copilot can now **control real browsers**. The agent can:
- Navigate web pages, click buttons, and input text
- Take screenshots
- Read console output
- Perform end-to-end tests

This feature is enabled by default, and enterprise admins can control policies.

## What This Means for Developers

### 1. Enhanced Credibility for Open-Source Models

When GitHub (a Microsoft subsidiary) integrates an open-source model into Copilot, it's not just technical recognition but also a **commercial endorsement**. For businesses previously hesitant about open-source models, this is a crucial signal.

### 2. Cost Advantages

| Model | Input Price (/1M tokens) | Output Price (/1M tokens) |
|-------|--------------------------|--------------------------|
| Kimi K2.7 Code | **$0.95** | **$4.00** |
| GPT-4o (Copilot) | ~$2.50 | ~$10.00 |
| Claude Sonnet 5 | $2.00 | $10.00 |

Kimi K2.7 Code's API pricing is less than half that of GPT-4o and Claude Sonnet 5, offering significant cost savings for teams heavily using Copilot.

### 3. Local Deployment Possibility

As an open-weight model, Kimi K2.7 Code can be deployed locally. This is a critical option for institutions with data security requirements, such as financial organizations and government agencies.

## Recommended Use Cases

| Use Case | Recommended Model | Reason |
|----------|-------------------|--------|
| Daily Coding Assistance (Cost Priority) | **Kimi K2.7 Code** | Lowest pricing, performance near closed-source |
| Complex Reasoning and Architecture Design | **Claude Sonnet 5** | Strongest HLE reasoning capabilities |
| IDE Integration and Workflows | **GPT-4o** | Most mature Copilot ecosystem |
| Data-Sensitive Environments | **Kimi K2.7 Code** | Locally deployable with MIT license |
| Multimodal Tasks (Image/UI) | **Copilot Vision** | New GA feature with visual understanding |

## Conclusion: A Key Step for Open-Source Models in the Mainstream

The integration of Kimi K2.7 Code into GitHub Copilot marks **a turning point in AI developer toolchains for the second half of 2026**. Open-source models are no longer "experimental" alternatives but production-grade options officially adopted by mainstream commercial tools.

Key takeaways:
- **First open-weight model in GitHub Copilot**—a milestone in commercial trust
- **1T-parameter MoE architecture** with 32B active parameters and 256K context—specs rivaling closed-source competitors
- **Pricing at just 40% of GPT-4o**—significant cost advantages
- **Same-day launch of Copilot Vision + Browser Tools GA**—a comprehensive upgrade for AI dev tools
- **Modified MIT license**—locally deployable for data-sensitive scenarios

For developers, now is a good time to evaluate open-source models' feasibility in production environments. GitHub Copilot's endorsement lowers the barrier to trial, and K2.7 Code's performance and pricing make it a serious contender.

---

## Related Articles

- [Claude Sonnet 5 Unveiled: Anthropic's Strongest Mid-Range Model Exceeds GPT-5.5 Across the Board](/blog/claude-sonnet-5-deep-dive)
- [GPT-5.6 Sol Announced: OpenAI's Most Powerful Model with Ultra Mode for Sub-Agent Coordination](/blog/gpt-5-6-sol-preview)
- [GLM-5.2: Open-Source Model Outperforms GPT-5.5 on FrontierSWE for the First Time, Its Implications](/blog/glm52-open-weight-frontier)