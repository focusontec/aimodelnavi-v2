---
title: "PilotDeck: The New Open-Source Agent OS Reducing Token Costs by Up to 70%"
date: "2026-05-28"
tag: "Open Source"
excerpt: "Tsinghua University's team has open-sourced PilotDeck, an AI Agent OS that introduces intelligent routing and isolated workspaces. The system can reduce token costs by up to 75% while improving accuracy through strategic model allocation."
---

![Agentシステムの概要](/images/blog/agent-token-70/img-1.png)

![PilotDeckの紹介](/images/blog/agent-token-70/img-2.png)

Developed collaboratively by THUNLP Lab at Tsinghua University, ModelBest, OpenBMB, and AI9stars, **PilotDeck** is an open-source operating system designed specifically for AI agents. By introducing independent workspaces, visual and editable memory management, and an intelligent routing system, PilotDeck enables users to build a "AI army" that maximizes personal productivity while drastically slashing token expenses.

![PilotDeckの概要図](/images/blog/agent-token-70/img-3.png)

![PilotDeckの機能概要](/images/blog/agent-token-70/img-4.png)

## Multi-Workspace Support for Concurrent Task Processing

One of PilotDeck's standout features is its ability to run entirely different tasks in parallel through independent workspaces. To test this, researchers executed two vastly different project types simultaneously: game development and data visualization.

In the first workspace, a prompt was entered to create a *Boba Shop Management Simulation Game*, featuring procurement, pricing, and a queuing system where customers make decisions based on cost and reputation. PilotDeck decomposed the core game design cycle, creating five product lines and systems for finance, customers, and procurement. Technically, it pre-built the JavaScript modules, implementation steps, and a card-style UI layout.

![ゲーム設計のプロセス1](/images/blog/agent-token-70/img-5.png) ![ゲーム設計のプロセス2](/images/blog/agent-token-70/img-6.png)

The result was a fully functional, playable boba shop simulator.

Simultaneously, in a second workspace, the system was tasked with creating an *Interactive Data Visualization Dashboard* using global AI funding data. PilotDeck generated four detailed charts, including Top 10 funding amounts, regional distributions (North America/Europe/Asia), and sector-specific breakdowns (General AI, Enterprise AI, Generative AI), complete with animation effects and hover-over details.

![データ可視化の結果](/images/blog/agent-token-70/img-7.gif)

Furthermore, a "Programmer Personality Test" (10 questions) was developed in parallel. This application featured a high-tech design utilizing GitHub's dark theme and JetBrains Mono fonts, categorizing users into six archetypes, such as "Architect" or "Philosopher."

![性格診断アプリのUI](/images/blog/agent-token-70/img-8.png) ![性格診断の結果画面](/images/blog/agent-token-70/img-9.gif)

All these tasks operated in isolated workspaces, ensuring that the context and logic of one project never interfered with another.

![ワークスペースの管理画面](/images/blog/agent-token-70/img-10.png)

## Beyond Folder Isolation: The Workspace as a "Living Environment"

PilotDeck views a workspace not merely as a directory of files, but as a comprehensive "living environment" for the AI agent.

![メモリパネルの画面](/images/blog/agent-token-70/img-11.png)

For instance, the Boba Shop project memory stores game logic and UI styles, while the data dashboard project keeps track of chart types and color schemes. These memories remain strictly separated.

![メモリの内容1](/images/blog/agent-token-70/img-12.png) ![メモリの内容2](/images/blog/agent-token-70/img-13.png)

While many tools rely on simple "folder + rule" isolation, PilotDeck implements a sophisticated three-layer structure:

- **Dedicated File System**: Clearly delineates the boundary between user-provided files and AI-generated assets.
- **Dedicated Memory**: Maintains "Project Memory" (definitions and progress) and "Collaboration Feedback" (user preferences), both of which are fully visible and editable by the user.
- **Dedicated Skills**: Users can install specific skills from a skill store directly into a workspace (e.g., PDF analysis tools or game asset searchers).

![スキル管理画面](/images/blog/agent-token-70/img-14.png) ![ワークスペースの構造](/images/blog/agent-token-70/img-15.png)

## Slashing Token Costs via Intelligent Routing

To lower the operational cost of AI agents, PilotDeck introduces an **Intelligent Routing** mechanism. 

Traditional routing often switches models at the request level, which breaks the KV cache and reduces inference efficiency. PilotDeck solves this by performing routing at the "sub-agent" level. By breaking a complex task into parts and assigning a specific sub-agent to a specific model for the duration of that sub-task, the system maintains continuous context caching, preserving performance while reducing costs.

Routing strategies can be defined using natural language prompts—for example, "Use Claude Opus for code-related tasks and a cheaper model for text processing."

In practical tests, creating the Programmer Personality app cost **$10.97 without routing**, but only **$1.42 with routing**, representing a **~75% cost reduction**.

![ルーティングパネルのコスト比較](/images/blog/agent-token-70/img-16.png)

Similar savings were observed in other scenarios:
- **SNS Content Generation**: Reduced from $12.58 to $2.83 (~70% saving).
- **Complex Tasks (Financial Analysis/Docs)**: A combination of Claude 3.5 Sonnet and MiniMax-M2.7 cost only $3.15 (compared to $18.36 for Sonnet alone) while actually improving the accuracy score from 69.1 to 70.6.

Additionally, PilotDeck supports connecting local models as sub-agents. This allows sensitive data to be processed locally without leaving the device, with the ability to auto-deploy edge models for specific tasks like voice generation.

![ルーティングの構成図](/images/blog/agent-token-70/img-17.png)

## White-Box Memory Management and the "Dream" Mechanism

PilotDeck's memory panel transforms the "black box" of AI memory into a transparent system. Each memory entry is tagged with a timestamp, source path, and type, allowing users to see exactly what the AI remembered and when.

![メモリ管理の詳細](/images/blog/agent-token-70/img-18.png)

If the AI records incorrect information, the user can edit it directly or delete unnecessary memories, eliminating the need to reset conversations or re-train preferences.

PilotDeck also features a unique **"Dream" mechanism**. During idle time, the AI automatically reviews and organizes its memories in the background. If the reorganization leads to a loss of critical detail, users can roll back to the pre-organized state with a single click.

![メモリ整理の機能](/images/blog/agent-token-70/img-19.png)

GitHub: [https://github.com/OpenBMB/PilotDeck](https://github.com/OpenBMB/PilotDeck)
Official Site: [https://pilotdeck.openbmb.cn/](https://pilotdeck.openbmb.cn/)

![フッター画像1](/images/blog/agent-token-70/img-20.jpg) ![フッター画像2](/images/blog/agent-token-70/img-21.jpg)