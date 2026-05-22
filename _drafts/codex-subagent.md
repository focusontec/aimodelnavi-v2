---
title: "Codex Subagent 小白入门"
author: "老金独立开发"
date: "2026年5月21日 22:09"
source: "https://mp.weixin.qq.com/s/7Nw5BwM9_uLGTFvalpPJMQ"
---

# Codex Subagent 小白入门 
 ![图片](/images/blog/codex-subagent/img-1.png) 
 昨天文章里，我们讲了 Claude Subagent 小白入门教程，今天我们来看下 Codex 的 Subagent 应该怎么做。 

## Codex Subagent是什么 

 类似地，Subagent 就是 Codex 里的"子代理"。一个复杂任务,你可以让 Codex 拆开，丢给几个子代理并行处理，每个跑在自己的线程里，跑完把结论交回主线程汇总。 

 OpenAI 文档里的说法稍微正式点：Subagent workflow 指 Codex 同时跑多个并行代理再汇总；Subagent 是被派出去做某件事的代理；Agent thread 是每个代理自己的线程，可以在 CLI 里查看和切换。 

 它解决的其实就两件事： 

 一件是 context 被污染。让 Codex 修一个测试这种活，中间它要读很多文件、跑很多命令、看很多报错。这些日志、猜测、失败尝试要是都塞进主线程,后面的判断很容易乱。Subagent 把过程放在子线程里，只把结论带回来，保持主线程清爽。 

 另一件是该并行的事被串行做了。review 一个 PR，安全、风格、测试覆盖、并发、可维护性，本来这几个维度可以同时看。一个代理从头查到尾，不仅慢，还容易顾此失彼。 

 所以记住一句话：Subagent 是 Codex 的一种用法。 

## 适用场景与不适用场景 

 简单判断的话，可以看任务能不能拆成几块互不依赖的小事。如果能，就适合开 subagent。如果不能就别开。 

 哪些情况不适合？任务本身很小、几个子任务紧紧咬在一起、写入范围会重叠、或者你自己都还没想清楚要拆成几块，这几种情况下硬上 subagent，反而添乱。 

 可以试试 subagent 的场景大致是这几类: 
 
- • 大型代码库探索 
- • 给 PR 做多维度 review 
- • 同时排查几个 bug 方向 
- • 安全、性能、测试、可维护性分开看 
- • 长文档、长日志、复杂报错的分块分析 
- • 一个代理实现功能,另一个并行跑风险检查 
 官方建议起步时优先选 read-heavy 的活，比如探索、测试、triage、总结这种。多个代理并行改代码属于 write-heavy，要更小心一点，文件冲突和协调成本都是真实存在的麻烦。 

 还有一笔账要算：每个子代理都独立在跑模型和工具，token 消耗比单代理多。这一点项目小的时候不明显，项目一大就肉眼可见。 

## 如何起用 subagent 

 Codex 默认不会主动开 subagent。你得在 prompt 里讲清楚要它开几个、分别干什么。比较常见的几种说法: 
 
- • "spawn two agents" 
- • "delegate this work in parallel" 
- • "use one agent per point" 
- • 中文的话直接说 "启动 3 个 subagent 分别检查安全、测试和可维护性" 也行 
 我自己经常用的一个模板长这样: 

```
 ` 请使用并行 subagents review 当前分支。 启动 3 个 subagent: 1. 一个检查安全风险 2. 一个检查测试缺口 3. 一个检查代码可维护性 请等待所有 subagent 完成后,再汇总结果。 输出时按严重程度排序,并附上文件路径。 `
```

## 拿来 review PR 的例子 

 假设刚写完一个功能要提 PR,可以这样写: 

```
 ` 请 review 当前分支相对 main 的改动。 使用一个 subagent 检查潜在 bug; 使用一个 subagent 检查测试覆盖; 使用一个 subagent 检查代码质量和可维护性。 每个 subagent 只输出明确问题,不要输出大段过程。 等三个 subagent 都完成后,请汇总: - 高风险问题 - 中风险问题 - 可选优化 - 建议我优先修什么 `
```

 这个模板有几个细节是花了点心思的。每个 subagent 干嘛分得很清楚，不会重叠；明确写了“等所有 subagent 完成后再汇总”，避免主代理拿着半成品就开始下结论；最后还指定了输出格式，你拿到的是按风险等级排好的清单，不是一堆原始过程。最后那句“建议我优先修什么”特别实用，subagent 找出来的问题往往不止 P0，把排序的活也丢给它，你自己只管挑。 

## 结合 ShipReady 案例 

 光看模板没意思，我拿一个手头的小项目 ShipReady 举例说明一下。这是个 SaaS landing page audit 的 MVP，代码量不大：后端 API 在 ` src/app.js ` ，审计规则和 rewrite 在 ` src/audit.js ` ，存储是 ` src/store.js ` ，前端就一个 ` public/app.js ` 。 

 第一个反应可能是：既然要试 subagent，那就让它们一起改代码呗。错~项目越小，几个 agent 撞同一个文件的概率越高。更稳的开法是先全部 read-only，只让它们看。 

```
 ` 请对这个项目尝试使用 subagent。 启动 3 个 read-only subagent: 1. runtime-risk-agent: 检查潜在 bug、异步错误、API 状态流、生产运行风险。 2. qa-coverage-agent: 检查测试缺口、缺失用例、回归风险。 3. architecture-agent: 检查模块边界、重复逻辑、后续可维护性。 所有 subagent 都不要改文件。 等全部完成后,主线程汇总结论,再决定要不要修。 `
```
 ![图片](/images/blog/codex-subagent/img-2.png) 
 这样拆有几个好处。三个方向相互不依赖，谁也不用等谁；全部都是读，不会产生文件冲突；主线程在等结果的时候还能继续读项目结构、做自己的判断。 

 从启动到拿到三份结论，体感是几分钟级别，不是那种要去喝杯咖啡的长任务。项目本身就小，所以真正省下来的不是"读文件的绝对时间"，而是主线程不需要同时记着三种问题：运行时怎么挂、测试缺哪条、模块该不该拆。这个减负在几分钟里感觉不强烈，等任务再大一点会很明显。 
 ![图片](/images/blog/codex-subagent/img-3.png) 
 三个 subagent 给的结论里, ** runtime-risk-agent ** 是最有价值的那个。它找到了 ` handleRequest ` 里 async 路由没 ` await ` ，外层 ` try/catch ` 接不住 async handler 抛出的错。这种 bug 在 happy path 测试里看不出来，出问题就是请求挂住或者 unhandled rejection。它还顺手指出 ` /api/rewrite ` 只判断 brief 是否存在,完全没看 brief 质量到不到位。这两个发现后来都直接进了改动清单。 

** qa-coverage-agent ** 列出来的缺口也实用：invalid JSON、未付费 share、过早 follow-up、弱 brief 绕过 rewrite——基本是 happy path 之外的 API 负路径。这些不一定都要立刻补，但摆在面前一目了然。 

** architecture-agent ** 是最让我犹豫的那个。它说 ` src/app.js ` 职责太多， ` src/audit.js ` 应该拆成 page-extract / checks / brief / rewrite 四块，前后端还在重复维护 audit label 和 brief ready 判断。判断都对,但对当时的任务来说太大了。这次的目标是写测试 + 修 bug,不是重构 audit engine，而且测试只有 smoke happy path，这个时候动核心文件等于把风险扩散出去。所以这部分建议最后一个字都没改。只是记下来，留给下次。 

 三个 subagent 之间没真正打架，但它们各自的优先级不一样：runtime-risk 想让你先修服务端；qa-coverage 想让你先补测试；architecture 想让你先理边界。主线程要做的不是给三票打个平均分，而是排个序——先挑那种确定性高、改动小、能被测试锁住的事。 

 最后真正落地的就这几条: 
 
- • 异步路由分支统一加 ` await ` ,让外层错误处理真正生效 
- • ` /api/rewrite ` 必须 ` briefReady(record.brief) ` 才解锁 
- • ` /api/brief/follow-up ` 加上"还没提交 brief"和"非法字段"两种校验 
- • ` readJson ` 加 body size 限制,invalid JSON 返回 400 
- • 补一组 node:test 回归测试把这些状态流锁住 
 跑一遍验证: 

```
 ` npm run check npm test `
```

 整个过程最有意思的一个瞬间，是 runtime-risk-agent 报出 async handler 的 bug，几乎同时，qa-coverage-agent 在另一份结论里建议补 API 负路径测试。两份结论拼起来正好是一个完整的修复方案，一边告诉你哪里坏了，一边告诉你怎么把它锁住不再坏第二次。主线程这时候根本不用再把整个项目重 review 一遍，只要判断这个问题值不值得现在修，然后改代码、补测试、跑验证就完事了。 

 这就是 subagent 真正干的活。它不是替主线程做决定,只是把几个方向的结论同时端到桌面上,让主线程做取舍的速度变快。 

## 跑起来之后怎么管 

 Codex CLI 里有 ` /agent ` 命令,用来切换 agent thread、看哪些线程还在跑。除了直接用命令，你也可以用自然语言让 Codex 帮你停掉某个、关掉某个。 

 实际上新手记住下面几个用法基本够了: 

```
 ` /agent `
```

 查看和切换 agent 线程。 

```
 ` 请停止那个负责性能分析的 subagent `
```

 某个子任务已经偏离方向或者你不再需要它，直接停。 

```
 ` 请关闭已经完成的 agent threads `
```

 跑完的线程留着没意义，顺手清掉。 

## 给新手的练手顺序 

 不建议一上来就让 5 个 agent 一起改全项目。从风险低的开始练： 
 
- 1. 并行阅读：让多个 subagent 各自负责理解不同模块，你做最后的串联 
- 2. 并行 review：bug / 安全 / 测试 / 可维护性，分头看 
- 3. 单写多审：主代理或一个 worker 改代码，其他 subagent 做 review 
- 4. 小范围并行修改：确认模块边界很清楚之后，再让多个 worker 同时动不同模块 ![图片](/images/blog/codex-subagent/img-4.png) 
 下回让 Codex review PR 的时候，可以直接拿这个去试: 

```
 ` 请使用 3 个 subagent 并行检查当前 PR: 一个看 bug,一个看测试,一个看可维护性。 等全部完成后,按风险等级汇总给我。 `
```

 看完这篇教程，建议你找个项目亲自动手体验一下。
