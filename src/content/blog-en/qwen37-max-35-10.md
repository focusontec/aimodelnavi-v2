---
title: "Alibaba Unveils Qwen3.7-Max: Autonomous AI Agent Achieves 10x Speedup in 35-Hour Kernel Optimization"
date: "2026-05-22"
tag: "AI Agent"
excerpt: "Alibaba has launched Qwen3.7-Max, an AI model optimized for agent tasks that rivals top international models in programming and reasoning. In a standout demonstration, it autonomously optimized kernel performance on an unseen chip for 35 hours, achieving a 10x speedup without human intervention."
---

On May 20, 2026, Alibaba officially launched Qwen3.7-Max at the Alibaba Cloud Summit.

---

## Overview

Qwen3.7-Max is Alibaba's latest flagship model, deeply optimized for agent scenarios. It delivers top-tier performance in programming, reasoning, office automation, and long-duration task execution, achieving comprehensive capabilities on par with leading international models like GPT, Claude, and Gemini.

![Qwen3.7-Max Arena AI Rankings](https://i.qbitai.com/wp-content/uploads/2026/05/60ae40faa7aa1115b102dd11ef764d74.webp)

![Qwen3.7-Max Subcategory Rankings](https://i.qbitai.com/wp-content/uploads/2026/05/a0f852571527fd9dd8b9c3856839942f.webp)

---

## Key Benchmark Results

### Programming Agent

| Benchmark | Qwen3.7-Max | DeepSeek-v4-Pro Max | Claude Opus 4.7 Max |
|---|---|---|---|
| TerminalBench 2.0-Terminus | **69.7** | 67.9 | 65.4 |
| SWE-Multilingual | **78.3** | - | - |
| SWE-Pro | 60.6 | - | - |

### General Agent

| Benchmark | Qwen3.7-Max | Claude Opus 4.6 | GLM 5.1 |
|---|---|---|---|
| MCP-Atlas | **76.4** | 75.8 | - |
| MCP-Mark | **60.8** | - | 57.5 |
| SpreadSheetBench-v1 | **87.0** | - | - |

### Reasoning Ability

| Benchmark | Qwen3.7-Max | Claude Opus 4.6 |
|---|---|---|
| GPQA Diamond | **92.4** | 91.3 |
| HLE | **41.4** | 40.0 |

---

## 35-Hour Autonomous Kernel Optimization Experiment

The most notable achievement of Qwen3.7-Max is its fully autonomous hardware optimization task lasting 35 hours.

Alibaba tasked Qwen3.7-Max with optimizing inference kernels on an unseen chip (T-Head ZhenWu M890) not present in training data. Without human intervention, the model worked continuously for 35 hours, ultimately improving the performance of Triton operators by **10x**.

### Experiment Details

- **Chip**: T-Head ZhenWu M890 (no training data exposure)
- **Work Duration**: 35 hours continuous
- **Tool Invocation Count**: 1,158 times
- **Kernel Evaluation Count**: 432 times
- **Final Result**: 10x performance improvement over official reference implementation

### Comparison with Other Models

| Model | Geometric Mean Speedup |
|---|---|
| **Qwen3.7-Max** | **10.0x** |
| GLM 5.1 | 7.3x |
| Kimi K2.6 | 5.0x |
| DeepSeek V4 Pro | 3.3x (interrupted midway) |

---

## Artificial Analysis Ranking

According to the latest ranking from third-party evaluator Artificial Analysis:

- **Overall Score**: 56.6 points
- **Global Ranking**: 5th place
- **Domestic Models**: 1st place
- **Progress from Previous Generation**: +4.8 points

The top positions include models like GPT-5.4(xhigh), Gemini 3.1 Pro Preview, and Claude-Opus4.7(max).

---

## Release Pace

The Qwen series maintains a rapid iteration pace:

![Qwen3.7-Max Release Timeline](https://i.qbitai.com/wp-content/uploads/2026/05/e7b41a582b5ac9f61aebf1a71708a4e4.webp)

| Date | Model | Theme |
|---|---|---|
| March 20, 2026 | Qwen3.5-Max-Preview | Toward Native Multimodal Agents |
| April 20, 2026 | Qwen3.6-Max-Preview | Toward Real-World Agents |
| May 20, 2026 | Qwen3.7-Max | New Benchmark for the Agent Era |

Each month, a flagship model is released, consistently pushing the performance ceiling for domestic models.

---

## Conclusion

Qwen3.7-Max represents a new-generation flagship model specialized in agent capabilities, achieving top-tier performance across programming, reasoning, and office automation. Particularly, the 35-hour autonomous kernel optimization experiment marks a significant milestone in demonstrating AI models' long-term autonomous operational abilities.