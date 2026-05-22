---
title: "How TwELL by Sakana AI and NVIDIA Accelerates LLMs by 20% Using Unstructured Sparsity"
date: "2026-05-08"
tag: "Benchmark"
excerpt: "Sakana AI and NVIDIA have co-developed TwELL, a novel sparsity format that accelerates large language model inference and training by up to 20% on NVIDIA GPUs. By leveraging unstructured sparsity in feed-forward networks with custom CUDA kernels, it achieves substantial performance gains without sacrificing model accuracy."
---

## Introduction: The Efficiency Race in LLMs and the Emergence of TwELL
As large language models (LLMs) become more widespread, the immense costs associated with their inference and training pose a major challenge for the industry. In particular, the feed-forward network (FFN) layers in Transformer architectures consume a significant portion of model parameters and are bottlenecks in terms of computational resources and memory.

To address this, Sakana AI and NVIDIA have co-developed a new technology called "TwELL". TwELL provides a method to efficiently leverage "unstructured sparsity" inherent in FFN layers using GPU hardware.

Benchmarks show that on H100 GPUs, TwELL achieves over 20% speedups in both inference and training. This technology is gaining attention as a new paradigm for LLM efficiency.

## Technical Explanation: Unstructured Sparsity and TwELL's Innovation
"Unstructured sparsity" refers to a state where zero elements are irregularly distributed in matrices or tensors. Recent research indicates that combining activation functions like ReLU with L1 regularization in LLM FFN layers can induce **over 95% sparsity** (where more than 95% of units are near zero) without significant accuracy loss. Theoretically, this could reduce computational and memory usage by a factor of 20.

However, modern GPUs are optimized for dense matrix multiplication. Traditional algorithms handling unstructured sparsity, such as COO or CSR formats, incur high overhead in managing non-zero elements, negating theoretical benefits. This is known as the "sparsity paradox".

TwELL (Tile-wise ELLPACK) is a new sparse packing format designed to resolve this paradox.

### Core of TwELL: Integration with Tiled Matrix Operations
TwELL's key feature is its direct integration with the **tiled matrix operations** executed by modern GPUs. By applying the ELLPACK format in "tile units" that fit GPU memory hierarchies and execution pipelines, it enhances memory locality and minimizes management costs.

Specifically, matrices are divided into fixed-size tiles, and non-zero elements are efficiently packed within each tile. This allows GPU streaming multiprocessors (SMs) to process sparse operations with efficiency comparable to dense ones.

Furthermore, a **custom CUDA kernel** optimized for this format was developed. By fusing matrix multiplication and activation function application in kernels for inference and training, it reduces memory bandwidth pressure and maximizes throughput.

## Benchmark Data: Measured Performance Improvements
Sakana AI and NVIDIA conducted rigorous evaluations using multi-billion parameter LLMs. Key published performance data includes:

- **Inference speed**: Up to **30% speedup** in batch inference on H100 GPUs.
- **Training speed**: Over **20% speedup** in complete training cycles, including backpropagation.
- **Memory usage**: Model weight memory footprint reduced by **over 24%**.
- **Energy efficiency**: Achieved power consumption reduction correlated with improved computational efficiency (specific numbers not disclosed).

Notably, these speedups are attained without significant degradation in model accuracy, thanks to the approach of inducing high sparsity with mild L1 regularization and processing it efficiently with TwELL and custom kernels.

## Industry Impact: Cost Reduction and New Possibilities
The emergence of TwELL is considered a practical turning point in LLM efficiency approaches. Previously, unstructured sparsity was seen as promising algorithmically but was not widely adopted due to the gap with hardware.

The involvement of NVIDIA, a hardware vendor, in co-developing a solution deeply integrated with GPU architecture is highly significant.

### Short-term Impact
Initially, cost reduction in **cloud-based LLM inference services** will accelerate. Improved inference latency and increased throughput per instance directly enhance service providers' revenue structures. Additionally, running large models on resource-limited edge devices or on-premises environments becomes more feasible.

### Long-term Impact
Lower training costs will promote **accelerated R&D cycles** and broader adoption of domain-specific model fine-tuning. Moreover, TwELL can be combined with other optimization techniques like "8-bit quantization" and "structured pruning". We expect further research into composite efficiency methods such as "sparse quantization".

## Practical Guide: Next Steps for Developers
Developers and researchers looking to leverage this in their projects should consider the following steps:

1. **Understand fundamentals and implementations**: Review Sakana AI's technical blog and GitHub repositories to grasp TwELL's principles and research implementation. It's crucial to understand the mechanism for inducing sparsity via "ReLU + L1 regularization".
2. **Analyze existing models**: Monitor the FFN layers of your Transformer models (e.g., Llama or GPT series) to assess inherent sparsity. Conduct fine-tuning with mild L1 regularization to measure the accuracy-sparsity trade-off.
3. **Optimize environments**: The implementation is optimized for NVIDIA H100 and CUDA environments. Verify compatibility and recommend testing performance on A100 or RTX series.
4. **Gradual adoption**: Start with inference phase adoption. Analyze trained model FFN layers and experiment with converting high-sparsity sections to TwELL format.

## Contextualization: Evolution and Trends in Sparsity Methods
Leveraging sparsity for efficiency has been a long-standing theme, but it faces new challenges in the LLM era.

- **Structured sparsity**: Methods that zero out channels or blocks. It has hardware support and practical applications but lacks flexibility and can lead to accuracy drops.
- **Unstructured sparsity**: Allows zeroing individual weights arbitrarily, favoring accuracy retention. TwELL addresses the final hurdle of "computational efficiency".
- **Dynamic sparsity**: Techniques like Mixture of Experts (MoE) that dynamically select activation units based on input.

TwELL brings the benefits of unstructured sparsity to **standard dense Transformer models** without requiring architectural changes like MoE, demonstrating high versatility applicable to all existing models.

## Summary and Outlook
The development of TwELL by Sakana AI and NVIDIA advances LLM efficiency research from "theory" to "implementation and hardware". It's groundbreaking for translating the theoretical potential of unstructured sparsity into real-world speedups on modern GPUs.

Key future aspects include:

1. **Integration into software stacks**: Adoption in standard libraries like PyTorch or TensorRT to lower usage barriers.
2. **Architectural expansion**: Extending to GPUs beyond H100 and other AI chips.
3. **Broadening applications**: Verifying applicability to similar structures in computer vision (CV) or multimodal models beyond FFN layers.

Cost reduction is essential for LLM democratization, and TwELL has become a critical piece in that puzzle. For development communities worldwide, embracing this efficiency trend early offers a significant opportunity to enhance competitiveness.