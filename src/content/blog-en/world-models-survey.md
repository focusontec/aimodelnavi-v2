---
title: "Understanding World Models: The Core Technology for AI 'Thought' Before Action"
date: "2026-06-02"
tag: "Open Source"
excerpt: "Explore the evolution of World Models from conceptual predictions in 1943 to the cutting-edge architectures like V-JEPA 2 and DreamDojo. This deep dive explains how AI is moving from passive observation to active participation by simulating the physical consequences of actions."
---

## The Convergence of AI Giants: LeCun, Fei-Fei, and Hassabis

Recently, a counter-mainstream movement has emerged in the AI industry. 

Turing Award winner **Yann LeCun**, alongside Sainbay Xie, founded AMI Labs and raised **$1 billion**. Rather than building larger LLMs, they are targeting the development of "World Models." Almost simultaneously, **Fei-Fei Li's** World Labs raised hundreds of millions to pioneer "Spatial Intelligence," aiming to give AI a true understanding of the 3D world beyond mere chatting or drawing. Combined with **Demis Hassabis** at DeepMind—who continues to bet heavily on projects like Genie—the most influential names in AI are pivoting toward the same frontier.

This field is known as **World Models**.

World models solve a fundamentally different problem than LLMs. While an LLM can tell you *what the world is*, a world model tells you **"how the world will change after I take this specific action."** One is an observer; the other is a participant.

To help the community master this complex topic, Datawhale has launched the **learn-world-model** open-source project. This article serves as a comprehensive introduction to the field, bridging the gap between conceptual theory and practical implementation.

![](/images/blog/world-models-survey/img-1.png)

We will avoid jargon and heavy formulas. Instead, we will define what a world model is, trace its 80-year evolutionary history, and analyze the five most prominent technical trajectories currently dominating the research.

The origin of this concept predates LLMs by decades. In 1943, British psychologist Kenneth Craik predicted that the brain maintains a "reduced model of reality," running internal simulations before executing actions. Eighty years later, this prediction is being realized through the efforts of today's AI pioneers.

## The Brain as a "Prediction Machine"

Neuroscience revealed a fascinating fact in the 1990s: the brain doesn't simply "see" the world; it **predicts** it and only processes the parts where the prediction fails.

This is known as **Predictive Coding**.

The visual cortex does not pass every single pixel to higher layers because it would be too energy-intensive. Instead, higher layers send "predictions" down to lower layers; the lower layers only transmit the **error** (the difference between the prediction and actual sensory input) back up. 

When you walk into a familiar office, your brain processes very little information because everything is expected. However, if a colleague's chair has been moved, that "deviation" signal immediately captures your attention. Predicted information is compressed; only the errors consume valuable cognitive resources.

In control engineering, a similar principle was discovered in the 1960s called the **Internal Model Principle**: 

> "To completely control a system, the controller must contain a model of that system within itself."

To control something, you must first understand it. This principle underlies everything from robotics to spacecraft and autonomous driving, forming the theoretical bedrock of Model-Based Reinforcement Learning (MBRL).

## What Exactly is a World Model?

The term is often used loosely, so it is important to clarify the scope.

**Broadly speaking**, any model that can predict "what happens next" can be called a world model. Video generation models predict the next frame, language models predict the next word, and weather models predict tomorrow's temperature. All fit this general description.

**In a narrow sense**, specifically within reinforcement learning and robotics, a world model must be conditioned on **actions**. It doesn't just ask "what does the next frame look like?" but rather:

> "How will the world change after I take this action?"

Mathematically, it predicts the probability distribution of the next observation given the current observation and action:

![](/images/blog/world-models-survey/img-2.png)

Here, $o_t$ is the current observation, $a_t$ is the action taken, and $o_{t+1}$ is the observation at the next time step.

This condition transforms the model from an "observer" to a "participant": it doesn't just simulate the world, it tells you **the consequences of your choices**. This is precisely what a robot needs to navigate the physical world.

## The Three Irreplaceable Values of World Models

World models provide three critical advantages. While the first is intuitive, the latter two are the primary drivers for industrial adoption.

### 1. Sample Efficiency: Practicing Ten Thousand Times in the Mind

Model-Free Reinforcement Learning (RL) often requires millions of real-world interactions to learn simple tasks, consuming massive time and resources. 

World models allow an agent to "virtually experience" vast amounts of trajectories via internal simulation:

![](/images/blog/world-models-survey/img-3.png)

Dreamer V3 (arXiv:2301.04104) surpassed human-level performance on the Atari 100k benchmark (which allows only 100,000 real-world steps) by utilizing this exact mechanism.

### 2. Planning Ability: Computing Before Moving

With a world model, an agent can simulate various possible paths in its head before acting, selecting the one with the highest expected reward.

MuZero (DeepMind, 2020, arXiv:1911.08265) relied on this to master chess, Go, and Atari games without ever being told the rules of the game, by learning its own internal dynamics model.

### 3. Safety: The Industrial Critical Factor

In robotics and autonomous driving, the cost of trial-and-error can be catastrophic. World models solve this by synthesizing safe training data:

![](/images/blog/world-models-survey/img-4.png)

Wayve's GAIA-1 (arXiv:2309.17080) demonstrates this at an industrial scale. By conditioning on real driving fragments, the model can automatically generate variations—such as different weather conditions or pedestrian behaviors at the same intersection. This expands the coverage of safety-critical scenarios far beyond what real-world data collection could achieve, at a fraction of the cost.

## A Brief History: From 1943 to 2026

### Phase 1: Theoretical Foundations (1950s – 2017)

For 70 years, researchers used Recurrent Neural Networks (RNNs), Kalman Filters, and Hidden Markov Models to predict future states across audio, robotics, and control. These were disparate tools, not yet unified under the banner of "World Models."

For example, the 1960s Kalman Filter helped the Apollo navigation system predict a spacecraft's position in real-time. It "guessed" the next second's position via an internal model and then corrected the error using sensor readings. The same logic reappeared later in speech recognition and industrial robotics.

### Phase 2: "Learning to Drive in Dreams" (2018)

In 2018, David Ha and Jürgen Schmidhuber published *World Models* (arXiv:1803.10122), proposing a three-module framework:

![](/images/blog/world-models-survey/img-5.png)

- **V-module (Vision):** A CNN that compresses game frames into a low-dimensional vector $z$.
- **M-module (Memory):** An MDN-RNN that predicts the next $z$ based on the current $z$ and action.
- **C-module (Controller):** A simple linear layer mapping the current state to an action.

Their most striking experiment involved training the controller within the **virtual environment** imagined by the memory module and then transferring that policy to the real game. **"
Learning to drive in dreams and waking up ready to run"** became the defining metaphor that brought world models into the spotlight.

However, this revealed a core challenge: "reward hacking." The controller learned to exploit errors in the world model to achieve fake high scores in its dreams—essentially "cheating" the simulation. This remains a central challenge in the field.

### Phase 3: The Latent Space Revolution (2019 – 2022)

Danijar Hafner and colleagues introduced Dreamer V1 (arXiv:1912.01603) and the **Recurrent State Space Model (RSSM)**, pushing the architecture forward.

The key shift was to **avoid doing anything in pixel space**. Instead, prediction, planning, and reward learning all happened within a low-dimensional **latent space**.

**What is latent space?** It compresses a 64x64 game frame (12,288 pixel values) into a small vector, discarding irrelevant details like lighting or background noise and retaining structural information (e.g., "there is a platform here, an enemy there"). This is typically achieved via a **Variational Autoencoder (VAE)**.

Predicting in pixel space is computationally expensive and noisy. RSSM solves this by splitting the process into two paths: a **deterministic path** (using a GRU) to capture smooth dynamics, and a **stochastic path** to handle environment uncertainties (e.g., will the ball go in the hole?).

![](/images/blog/world-models-survey/img-6.png)

This allowed the "Imagine $\rightarrow$ Score $\rightarrow$ Act" cycle to occur entirely within the latent space, running significantly faster than the real environment. Dreamer V3 eventually achieved competitive results across 150+ tasks in 8 different domains using a single set of hyperparameters.

### Phase 4: Video as the World (2023 – Present)

Recently, two parallel tracks have converged on the question: *Can we learn the laws of physics purely from video?*

**Track A: JEPA (Joint Embedding Predictive Architecture)**
Yann LeCun's team abandoned pixel reconstruction entirely, predicting only within a **semantic embedding space**.

![](/images/blog/world-models-survey/img-7.png)

As LeCun puts it, "You don't need to draw a face to know who a person is." Meta's V-JEPA 2 (2025) is positioned as a component for AGI, predicting future visual representations in semantic space rather than generating realistic images.

**Track B: Large-Scale Video Generation**

Google's Genie and Veo, followed by NVIDIA's Cosmos, have raised a provocative question: In the process of generating realistic video, do these models accidentally learn **spatial structure, object permanence, and coarse physics**? If so, could these generators serve as the foundation for robotic world models?

## The Perfect Storm: Why Now?

Why has 2024-2025 become the era of the world model? It is the result of three converging trends:

1. **Explosion in Video Quality:** Models like Genie and Cosmos have improved so much that researchers are now questioning if they've acquired a true understanding of physics.
2. **Data Bottlenecks in Embodied AI:** Training general-purpose robots requires massive amounts of teleoperation data, which is expensive. World models provide a shortcut by learning indirectly from unlabeled videos.
3. **Proven Business Value in Auto-Driving:** GAIA-1 proved that using world models to synthesize rare "edge case" scenarios is far more efficient than simply driving millions of real-world miles.

## Five Technical Trajectories: A Deep Dive

Depending on the bottleneck—sample efficiency, long-term dependency, generation quality, or semantic understanding—different architectures are chosen:

### Architecture Comparison Matrix
![](/images/blog/world-models-survey/img-8.png)

### 1. STORM: Turning Frames into "Sentences"

STORM (NeurIPS 2023) treats video frames like tokens in a language model. It uses a **Categorical VAE** to compress frames into **discrete latent variables**. Instead of storing a full waveform of audio, it's like describing a song as "the chorus of the first verse."

![](/images/blog/world-models-survey/img-9.png)

By reducing each frame to a single token, STORM drastically shortens sequence lengths, enabling rapid training. It achieved a record-breaking Human Normalized Score (HNS) of 126.7% on Atari 100k, training on a single RTX 3090 in just 4 hours.

### 2. Diamond: "Painting" the Next Frame via Diffusion

Diamond (NeurIPS 2024) uses **Diffusion Models** to denoise and generate the next frame. By injecting action information via **cross-attention** into a U-Net, the model conditions the denoising process on the agent's actions.

![](/images/blog/world-models-survey/img-10.png)
![](/images/blog/world-models-survey/img-11.png)

Diamond achieved an HNS of 146%, outperforming previous world models with superior visual quality. The trade-off is computational cost: generating one frame requires multiple neural network passes, making it orders of magnitude slower than STORM.

### 3. V-JEPA 2: Understanding Without Drawing

V-JEPA 2 (Meta, 2025) is the most unconventional: it generates no images at all. It predicts the **semantic representation** of masked spatio-temporal blocks in a video.

![](/images/blog/world-models-survey/img-12.png)

A major challenge here is "representation collapse," where the model maps all inputs to the same vector to minimize error. To prevent this, V-JEPA uses **EMA (Exponential Moving Average)**. The target encoder's parameters only slowly approach the student encoder, ensuring they never fully synchronize and forcing the model to learn meaningful features.

### 4. DreamDojo: "Stealing" Skills from Human Videos

DreamDojo (NVIDIA, 2026) addresses the scarcity of robot data by pre-training on massive datasets of human daily activities (like Ego4D). Since the laws of physics are the same for humans and robots, this knowledge transfers.

To handle the lack of action labels in human videos, it uses **continuous latent actions**—automatically extracting motion patterns from the difference between adjacent frames.

![](/images/blog/world-models-survey/img-13.png)

DreamDojo achieves an inference speed of 10.81 FPS at 640x480 resolution, enabling real-time robot control and impressive zero-shot generalization across environments.

## The Great Debate: Is the World Model the Right Path?

There are three prevailing schools of thought regarding the future of AI:

**View 1: The World Model is the Only Way (LeCun/Xie)**
AMI Labs is betting $1 billion that the current LLM-centric trend is a detour. Sainbay Xie famously remarked that "language is a drug"—useful, but a shortcut. LeCun argues that true intelligence requires modeling the physical world directly from continuous sensory signals, not from the secondary abstraction of human symbols (language).

**View 2: Multimodal LLMs are Sufficient (DeepMind/Google)**
Demis Hassabis views the path to a world model as an evolution of Large Multimodal Models (LMMs). By layering spatial perception and RL onto the existing vast knowledge base of LLMs, they can inherit "world common sense" without building a new architecture from scratch.

**View 3: The Hybrid Pragmatists**
Many believe the answer lies in combining the two: using LLMs for high-level reasoning and JEPA-style world models for low-level physical interaction. While LLMs provide the "what" and "why," the world model provides the "how" of physical movement.