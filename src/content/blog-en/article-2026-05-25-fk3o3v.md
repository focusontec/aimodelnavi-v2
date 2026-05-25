---
title: "Huawei's 'τ Law': Achieving 1.4nm Equivalent Density in a 7nm Fab with 'Logic Folding'"
date: "2026-05-25"
tag: "Benchmark"
excerpt: "Huawei has announced the 'τ (tau) Law,' a new chip design philosophy that shifts focus from shrinking transistors to shortening signal delays. Its core technology, 'Logic Folding,' stacks circuit layers vertically within a single chip to achieve 1.4nm equivalent transistor density using 7nm fabrication. This approach challenges the semiconductor industry's fundamental scaling methods and signals Huawei's move from survival to innovation leadership."
---

Twice in a single month, Huawei's chips have made major headlines.

First, DeepSeek announced its V4 series, open-sourcing a 1.6-trillion-parameter model. But what the industry noticed most was a different fact: **the hardware DeepSeek first optimized for wasn't from NVIDIA—it was Huawei's Ascend chips.**

NVIDIA's CEO Jensen Huang had previously warned in an interview that "it would be a fearful outcome" if top models began running on Huawei chips. Now, that scenario has become a reality.

And today, at ISCAS 2026, Huawei Semiconductor President He Tingbo unveiled the **"τ (tau) Law,"** confirming that its upcoming **Kirin 2026** chip will be the first to fully implement the revolutionary **"Logic Folding"** technology.

## What is the "τ Law"?

In a single sentence: **Stop trying to make transistors smaller, and focus on making signals faster.**

A chip's speed is determined by the time it takes for a signal to travel from point A to point B. This time is measured by a physical quantity called the **time constant, τ**. Every time a signal travels through a wire, it's slowed down by resistance and capacitance. A larger τ means a lower achievable frequency.

For the past 50 years, the industry has only known one way to reduce τ: **shrink transistors, pack wires closer together, and shorten signal path lengths.** This was "geometric scaling," the entire basis of Moore's Law.

However, **below 7nm, this approach has hit a wall.**

Huawei's paper states it clearly: "Beyond the 7nm node, the returns from pure dimensional scaling are diminishing."

**Wire delay has become the bottleneck limiting chip speed.** Transistors may have been shrunk to 3nm at immense cost, but the parts that are actually constraining performance have seen little improvement.

To use an analogy: The engine of a supercar is powerful enough, but it's forced to take a long detour on a ring road for its daily commute. The constraint isn't horsepower—it's the length of the journey.

Upgrading the engine (shrinking transistors) might make it 10% faster. Building a tunnel through the city (shortening wiring distances) could make it 50% faster.

Huawei chose to "dig the tunnel."

## Four-Layer Co-Optimization

"Time scaling" isn't a single technology. Huawei is simultaneously optimizing across four layers.

**Layer 1: Device**
Replacing traditional copper wiring with new materials like ruthenium and cobalt to lower resistance. Using low-k dielectric materials to reduce parasitic capacitance, pushing down the physical limits of τ.

**Layer 2: Circuit**
Using Logic Folding to transform flat layouts into three-dimensional ones, drastically shortening wiring. This is the most transformative of the four layers.

**Layer 3: Chip**
Because Huawei controls HarmonyOS, the compiler, and the chip microarchitecture, it can customize data paths for actual workloads, eliminating redundant computations.

**Layer 4: System**
A mechanism called the "Unified Bus (Lingqu Bus)" replaces the traditional layered stack of PCIe + NVLink + Ethernet + software remote memory with a single, unified protocol.

These four layers are like the four cylinders of an engine. Running just one provides limited benefit. Igniting all four simultaneously unleashes the true performance.

## Logic Folding: From Flat to Three-Dimensional

Within the τ Law's four-layer system, **Logic Folding** is the core technology and the Kirin 2026's biggest weapon.

Traditional chip circuits are laid out on a single flat plane. It's like a giant city map where billions of transistors and wires are tiled on the same layer. Sometimes, two logic units that communicate frequently end up on opposite sides of the chip due to layout constraints, forcing signals to travel hundreds of micrometers.

Logic Folding is the technique of "folding" this unfolded map. By folding it, distant parts come together. Centimeters become millimeters.

The chip's circuit logic is split into upper and lower layers, with frequently interacting units connected directly via short vertical channels (through-silicon vias). This replaces the long, planar detours. **The wiring distance for critical paths is reduced by approximately 30%.**

When distance decreases, resistance drops, capacitance drops, and τ shrinks. When τ shrinks, the chip gets faster.

## How It Differs from Existing 3D Technologies

3D stacking isn't a new concept in semiconductors.

- **AMD's 3D V-Cache:** Stacks 64MB of SRAM cache on top of CPU cores, boosting gaming performance by an average of 21%. It's already in mass production.
- **Intel's Foveros:** Stacks different functional chiplets (compute, GPU, I/O) face-to-face. Meteor Lake uses this method.
- **TSMC's SoIC:** Offers similar capabilities.

However, all existing technologies stack **different functional modules**. Cache is cache, compute cores are compute cores, I/O is I/O. Each is manufactured independently and bonded with packaging technology. It's like building a skywalk between two separate buildings.

Huawei's approach is more radical—**it's renovating a single building into a duplex.** Instead of bonding two chips, it transforms the internal circuitry of a single chip from one layer into two. Adjacent stages of a CPU pipeline might be placed on an upper and lower floor, connected directly by a vertical shaft (an elevator). Functionally, it remains one unit; physically, it becomes three-dimensional.

**AMD builds a bridge between two buildings; Huawei installs an elevator inside one building. It's a fundamentally different approach.**

This means breaking a basic assumption chip designers have held for decades: that "all logic units must be processed on the same plane." He Tingbo has named this the **"Free Logic Design Philosophy."

Designers can now flexibly decide which logic to place on the upper layer and which on the lower, based on constraints of latency, power consumption, and heat dissipation. This is a foundational change for EDA (Electronic Design Automation) tools. Traditional EDA tools were built on the assumption that the world is "flat," with placement, routing algorithms, timing analysis, and power simulations all based on 2D mathematics.

The world is now 3D. We need 3D placement and routing, 3D timing analysis that calculates vertical via delays, and 3D thermal simulation that predicts heat dissipation in a two-layer structure. Very few companies globally possess a complete toolchain with these capabilities. The fact that Huawei can integrate Logic Folding into a mass-production chip in 2026 indicates it has been preparing this toolchain for a long time.

## 381 Chips: The Foundation of Experience

381 chip types. An average of over 60 per year for six years. Covering smartphones, base stations, AI, and automotive.

The value of this number isn't in its "quantity" but in its **"breadth."** The most expensive part of chip design isn't the tape-out cost, but the trial-and-error in design methodology. Each new design technique must be validated repeatedly across different scenarios, power envelopes, and performance targets.

381 types means Huawei has completed a massive validation matrix. A company making only smartphone chips lacks base station scenarios. A company making only AI chips lacks the constraints of low-power terminals.

The Kirin 2026 isn't the "first attempt" at Logic Folding—it's the **"first successful implementation."**

## Why Announce This Now?

Huawei has long been known for being tight-lipped about its chip information. This level of technical disclosure is therefore highly unusual.

DeepSeek choosing Ascend, and He Tingbo revealing Huawei's semiconductor technical roadmap, happened a month apart, but they tell the same story:

**The narrative of Huawei's chips has turned a page, from "surviving" to "charting a course forward."

On the night of May 16, 2019, the day Huawei was placed on the U.S. Entity List, He Tingbo, then president of HiSilicon, sent an internal email to all employees:

> Years ago, in calmer times, the company hypothesized an extreme scenario: a day when all advanced U.S. chips and technology became unavailable, yet Huawei would still serve its customers. For this hypothesis, which we hoped would never come true, thousands of HiSilicon children embarked on the most epic long march in the history of science and technology, to build a spare tire for the company's survival.

A year later, TSMC cut off contract manufacturing. Huawei had just made the Kirin 9000—the world's first 5nm 5G SoC with 15.3 billion transistors. Each one used was one less available. The Mate 40 was hard to get, and for the next two years, Huawei's flagships had to use Qualcomm Snapdragon 4G chips, causing its global market share to plummet from second place.

Seven years later, the spare tire has been given its own name.

## The Reach of the τ Law

He Tingbo also showed a roadmap: the Kirin 2026 uses two layers, but the future path leads toward complete folding and multi-layering. **By 2031, it aims to achieve transistor density equivalent to the 1.4nm process node for high-end chips.**

In other words: **Using a 7nm-class fab to achieve 1.4nm-class density.** AI hardware integration density will increase by over 100x by 2035—this is the prediction of the τ Law.

## Implications for the Industry

This development cannot be overlooked.

First, **NVIDIA's monopoly is being challenged.** If Huawei chips become an option in the AI inference market, GPU supply diversification will advance. For AI companies, the range of hardware choices could widen.

Second, **the reorganization of the EDA toolchain.** Very few EDA tools globally are built for 3D design. The triopoly of Synopsys, Cadence, and Siemens EDA could be disrupted.

Third, **a paradigm shift in semiconductor strategy.** The τ Law challenges the industrial order where "EUV lithography machines decide everything." Materials technology—where Japan excels (ruthenium, cobalt, low-k dielectrics)—could gain new strategic importance.

The 2019 internal email read: "There is no more time to spend another decade building a spare tire before swapping it. The buffer zone is gone."

Seven years later, the spare tire has its own name and is walking its own path.