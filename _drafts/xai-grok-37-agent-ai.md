---
title: "xAI突然官宣：Grok全面接入37万星开源Agent平台，订阅用户直接白嫖，马斯克这次要抢AI入口了？"
author: "未来跃迁"
date: "2026年5月22日 04:11"
source: "https://mp.weixin.qq.com/s/-4BQbFf_qcthkspT631Lkw"
---

导读 xAI 昨天毫无预告地宣布，Grok 模型正式接入开源 Agent 平台 OpenClaw——GitHub 上 37 万星的超级项目。最关键的一点：SuperGrok 和 X Premium 订阅用户无需申请 API key，登录就能用。对话、生图、生视频、搜 X 帖子，全部打通。这意味着 Grok 第一次真正走出 X 平台，杀入开源 Agent 生态的腹地。 
## Grok 走出围墙花园 

 5 月 19 日，xAI 官方博客发了一篇简短公告，标题四个词： ** Use Grok in OpenClaw ** 。 

 同一时间，xAI 的官方 X 账号发出确认推文，96 万次浏览，6400 多个赞，迅速冲上开发者社区热榜。 

> "Starting today, use your Grok or X Premium subscription in @openclaw. Chat with your agent, generate images and videos, or search for X posts." 

 「从今天起，在 OpenClaw 中使用你的 Grok 或 X Premium 订阅。和你的 agent 对话、生成图片和视频，或搜索 X 帖子。」 
 ![](/images/blog/xai-grok-37-agent-ai/img-1.jpg) 
 ▲ xAI 官方推文宣布 Grok 接入 OpenClaw，96 万次浏览 
 
 这条公告的信息量很大，但最让人意外的细节藏在一个词里： ** subscription ** 。 

 用户不需要去 api.x.ai 申请密钥，不需要绑信用卡，不需要按 token 计费。只要你有 SuperGrok 或 X Premium 订阅，登录 OpenClaw 就能直接调用 Grok 的全部能力。 

 换句话说，xAI 把 Grok 的分发模式从"开发者找上门"变成了"用户顺手就能用"。 

## OpenClaw 凭什么？ 

 如果你还没听说过 OpenClaw，先看一个数字： ** GitHub 37.3 万星 ** 。 

 这个数字意味着什么？它比绝大多数 AI 开源项目的星标数都高出一个数量级。OpenClaw 的定位是"THE AI THAT ACTUALLY DOES THINGS"——一个开源、本地优先的 AI agent 和个人助理平台。 
 ![](/images/blog/xai-grok-37-agent-ai/img-2.jpg) 
 ▲ OpenClaw 官网首页："THE AI THAT ACTUALLY DOES THINGS" 
 
 它的几个核心卖点： 

** 本地运行，数据不出设备。 ** Mac Mini、笔记本、服务器、VPS，甚至树莓派都能跑。安装只需要一行命令： 

 ```bash curl -fsSL https://openclaw.ai/install.sh | bash ``` 

** 跨会话持久记忆。 ** agent 在对话之间保持记忆，不会每次重新开始。这让它能当 24/7 运行的长期助手。 

** 全平台消息打通。 ** WhatsApp、Telegram、Slack、Discord、Signal、iMessage——你在哪个聊天工具里，就在哪个聊天工具里跟 agent 说话。 

** 完全开源，MIT 许可证。 ** 主仓库用 TypeScript 开发，28 名贡献者，生态下 64 个子仓库，社区相当活跃。 
 ![](/images/blog/xai-grok-37-agent-ai/img-3.jpg) 
 ▲ OpenClaw GitHub 主仓库，37.3 万星，7.7 万 fork 
 
 有个用户的评价很有代表性： 

> "The fact that it's hackable (and more importantly, self-hackable) and hostable on-prem will make sure tech like this DOMINATES conventional SaaS." 

 「它可以被 hack、更重要的是可以自我 hack、还能本地私有化部署——这类技术注定会碾压传统 SaaS。」 

## 技术细节：订阅即用，零门槛接入 

 根据 xAI 博客的详细说明，这次整合的技术路径非常清晰： 

** 第一步，装 OpenClaw。 ** 一行 curl 命令搞定安装，然后跑引导流程： 

 ```bash openclaw onboard --install-daemon ``` 

** 第二步，登录 xAI 账号。 ** 如果是 VPS 或 SSH 环境，OpenClaw 支持 device-code 认证： 

 ```bash openclaw onboard --auth-choice xai-device-code ``` 

** 第三步，直接用。 ** 登录后 Grok 的能力就全部可用了——对话、图片生成、视频生成、X 帖子搜索，所有订阅层级都支持。 
 ![](/images/blog/xai-grok-37-agent-ai/img-4.jpg) 
 ▲ xAI 官方博客详细说明了接入步骤 
 
 整个流程没有 API key 申请、没有开发者审核、没有额外付费。对普通用户来说，这可能是目前接入 Grok 最无痛的方式。 

## 社区反应：开发者已经在玩了 

 推文发出后，评论区迅速热闹起来。 

 用户 @lemin_ebnou 的评价代表了很多人的想法： 

> "grok and x premium working inside OpenClaw 2026.5.18 without a separate api key is a clean move" 

 「Grok 和 X Premium 订阅直接在 OpenClaw 里用，不需要单独的 API key，这一步走得漂亮。」 

 @tulipdotmd 则点出了背后的工程量： 

> "Grok integration into OpenClaw is the sort of thing that sounds obvious in hindsight and took an unreasonable amount of work to ship" 

 「Grok 接入 OpenClaw 这件事，事后看理所当然，但实际上要交付它需要大量工程投入。」 

 最有意思的是 @halfsoldered——这位老兄用 Grok + OpenClaw 给自己的宠物壁虎做了一个小型实体版 Grok 机器人，还发了视频。开源社区的创造力永远不会让人失望。 

## 更大的棋：Grok 的分发野心 

 往回看 Grok 的分发路线：最早只在 X 平台内部和 grok.com 可用，后来开放了 API（api.x.ai），现在又进入了第三方开源 Agent 平台。 

 每一步都在扩大触达范围，降低使用门槛。 

 而 OpenClaw 这边，此前已经接入了 Claude（通过 Anthropic API 或 Claude Max 订阅）和 GPT 系列（通过 OpenAI API）。Grok 的加入让 OpenClaw 成了一个真正的多模型 Agent 枢纽——用户可以根据任务需求随时切换底层模型。 

 xAI 在公告末尾留了一句： ** "More open-source agents and integrations are coming soon." **

 这句话配合 xAI 此前开源 Grok-1 模型权重的动作来看，方向很明确：Grok 正在从一个平台绑定的聊天机器人，变成一个可以在任意终端被调用的通用 AI 引擎。 

 当 ChatGPT 和 Claude 还在各自的围墙花园里经营时，xAI 选择了另一条路——把 Grok 送进别人的平台，用订阅打通使用场景，用开源社区做分发。 

 这盘棋到底能走多远，要看 xAI 后续能拿出多少真正的技术差异化。但至少目前这一步，切入点选得相当精准。 
 
 — END — 
 — END —