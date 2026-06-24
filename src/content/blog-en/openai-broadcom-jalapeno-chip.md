---
title: "OpenAI Unveils 'Jalapeño': First Custom AI Chip Built with Broadcom to Revolutionize LLM Inference"
date: "2026-06-24"
tag: "OpenAI"
excerpt: "OpenAI and Broadcom have announced Jalapeno, OpenAI's first custom-designed chip built from the ground up for LLM inference. The move aims to drastically reduce costs and gain hardware independence, challenging Nvidia's dominance and accelerating the industry-wide shift toward custom AI silicon."
---

On June 24, 2026, OpenAI and Broadcom (NASDAQ: AVGO) officially announced "Jalapeño," OpenAI's first custom-designed AI inference accelerator. Dubbed an "intelligence processor," this chip is specifically engineered for LLM inference, marking a significant shift in the AI infrastructure landscape.

![OpenAI and Broadcom leaders display the Jalapeno inference chip](/images/blog/openai-jalapeno-chip.png)

## What is Jalapeño?

Jalapeño is a **ground-up, purpose-built chip for LLM inference**, designed based on insights from the systems running OpenAI's products like ChatGPT, Codex, and its API daily. It is not a repurposed general-purpose accelerator but is optimized for current and future LLM inference needs.

### Key Specifications

| Spec | Detail |
|------|------|
| Chip Name | Jalapeño |
| Development Partners | OpenAI + Broadcom + Celestica |
| Design to Mass-Production Tape-out | **9 months** (industry-leading speed) |
| Primary Use Case | LLM Inference (ChatGPT, Codex, API) |
| Test Workload | GPT-5.3-Codex-Spark |
| Initial Deployment | End of 2026 |
| Scale | Gigawatt-class data centers |
| Network | Broadcom Tomahawk Ethernet |

### Design Philosophy

Richard Ho, Head of OpenAI's Hardware, explained that "Jalapeño is optimized around the most critical kernels, memory movements, networks, and serving patterns for frontier AI models."

The core design principles are threefold:

1. **Inference Specialization**: Focuses on the memory bottlenecks and latency inherent in LLM inference, unlike general-purpose accelerators.
2. **Full-Stack Integration**: Directly incorporates OpenAI's model knowledge into the hardware design.
3. **Multi-Generation Roadmap**: This is the first step, with plans to scale to 10 gigawatts by 2029.

## Why This Matters

### 1. A Fundamental Shift in AI Inference Costs

Industry estimates suggest a 1GW data center costs approximately $50 billion, with about $35 billion allocated to chips (based on current Nvidia pricing). OpenAI developing its own chip presents a significant opportunity to drastically reduce inference costs.

Sam Altman stated, "This allows us to deliver massive computational infrastructure to the world. It leads to major efficiency gains, better performance, faster models, cheaper models—all of that becomes possible."

### 2. Gaining Hardware Sovereignty

"If you make your own chip, you control your own destiny," Altman said, symbolizing a move to reduce reliance on Nvidia. OpenAI currently operates with about 2GW of compute capacity and has announced a total of approximately 33GW in compute commitments with Nvidia, AMD, and Broadcom combined.

### 3. Using Models to Accelerate Chip Design

Greg Brockman noted, "We used OpenAI's models to accelerate the chip design process and improve efficiency. We achieved massive area savings." By pouring compute into already human-optimized components, they achieve unique, model-driven optimizations.

## The Broadcom Partnership

This announcement is the tangible outcome of the 10GW joint development plan revealed in October 2025.

- **Broadcom**: Provides silicon implementation, networking (Tomahawk), and connectivity technology.
- **Celestica**: Handles board, rack, and system integration.
- **OpenAI**: Leads chip design and architecture.

Hock Tan, CEO of Broadcom, commented, "This is just the beginning of a multi-generational roadmap. We will begin deploying into gigawatt-class data centers with Microsoft and other partners starting at the end of 2026."

## Industry Impact

### Impact on Nvidia

The Jalapeño announcement is a direct challenge to Nvidia's AI accelerator market dominance. While OpenAI has a 10GW commitment (up to a $100B investment) with Nvidia, the success of its own chip could reduce future dependency.

### Intensifying Custom Chip Competition

Following Google (TPU), Amazon (Trainium/Inferentia), and Meta (MTIA), OpenAI enters the custom AI chip race. Owning proprietary silicon is becoming a key differentiator in the AI industry.

### Structural Change in Inference Costs

If Jalapeño delivers a "performance-per-watt significantly better than current state-of-the-art," it could fundamentally alter the pricing structure of LLM APIs. For large-scale services like ChatGPT, reduced inference costs directly translate to improved profitability.

## Conclusion

Jalapeño is more than just a chip announcement; it's a critical step for OpenAI's evolution from a "model company" to a "full-stack AI platform." The remarkable 9-month development speed, leveraging its own models for chip design, and the 10GW-scale deployment plan signal that the AI infrastructure race has entered a new phase.

The industry will be watching closely to see how Jalapeño impacts the cost and performance of LLM inference following its initial deployment at the end of 2026.