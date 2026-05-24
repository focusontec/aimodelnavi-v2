// Hand-curated use-case taxonomy for scenario-based recommendations.
// NOT auto-generated — edit manually when adding new scenarios.

export interface UseCaseScenario {
  slug: string;
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  icon: string;
  matchKeywordsJa: string[];
  matchKeywordsEn: string[];
  preferredTypes: ("reasoning" | "foundation" | "chat" | "coder")[];
  priorityBenchmarks: string[];
}

export const useCaseScenarios: UseCaseScenario[] = [
  {
    slug: "code-generation",
    titleJa: "コード生成",
    titleEn: "Code Generation",
    descriptionJa: "プログラミング・コード生成に最適なモデル",
    descriptionEn: "Best models for programming and code generation",
    icon: "Code",
    matchKeywordsJa: ["コーディング", "コード生成", "プログラミング", "リファクタリング", "デバッグ"],
    matchKeywordsEn: ["coding", "code generation", "programming", "refactoring", "debugging"],
    preferredTypes: ["coder", "reasoning"],
    priorityBenchmarks: ["sweBenchVerified", "liveCodeBench", "aiderPolyglot", "sweBenchPro"],
  },
  {
    slug: "text-writing",
    titleJa: "文章作成",
    titleEn: "Text Writing",
    descriptionJa: "ブログ・レポート・マーケティング文書の作成に最適なモデル",
    descriptionEn: "Best models for writing blogs, reports, and marketing copy",
    icon: "PenTool",
    matchKeywordsJa: ["テキスト生成", "コンテンツ生成", "文章", "チャットボット", "対話"],
    matchKeywordsEn: ["text generation", "content generation", "writing", "chatbot", "dialogue"],
    preferredTypes: ["chat", "foundation"],
    priorityBenchmarks: ["elo", "mmluPro"],
  },
  {
    slug: "data-analysis",
    titleJa: "データ分析",
    titleEn: "Data Analysis",
    descriptionJa: "データの分析・要約・レポート作成に最適なモデル",
    descriptionEn: "Best models for data analysis, summarization, and reporting",
    icon: "BarChart3",
    matchKeywordsJa: ["分析", "要約", "データ", "レポート", "大量データ"],
    matchKeywordsEn: ["analysis", "summarization", "data", "report", "large-scale"],
    preferredTypes: ["reasoning", "foundation"],
    priorityBenchmarks: ["mmluPro", "gpqaDiamond", "hle"],
  },
  {
    slug: "math-reasoning",
    titleJa: "数学・推論",
    titleEn: "Math & Reasoning",
    descriptionJa: "数学的推論・論理的思考に最適なモデル",
    descriptionEn: "Best models for mathematical reasoning and logical thinking",
    icon: "Calculator",
    matchKeywordsJa: ["数学", "推論", "論理", "問題解決"],
    matchKeywordsEn: ["mathematical", "reasoning", "logical", "problem-solving"],
    preferredTypes: ["reasoning"],
    priorityBenchmarks: ["aime2025", "aime2026", "frontierMath", "math500", "gpqaDiamond"],
  },
  {
    slug: "japanese",
    titleJa: "日本語特化",
    titleEn: "Japanese Language",
    descriptionJa: "日本語の処理・生成に最適なモデル",
    descriptionEn: "Best models for Japanese language processing and generation",
    icon: "Languages",
    matchKeywordsJa: ["日本語", "国産", "日本"],
    matchKeywordsEn: ["Japanese", "domestic", "Japan"],
    preferredTypes: ["chat", "foundation"],
    priorityBenchmarks: ["elo", "mmluPro"],
  },
  {
    slug: "agent-automation",
    titleJa: "エージェント・自動化",
    titleEn: "Agent & Automation",
    descriptionJa: "自律エージェント・タスク自動化に最適なモデル",
    descriptionEn: "Best models for autonomous agents and task automation",
    icon: "Bot",
    matchKeywordsJa: ["エージェント", "自動化", "ツール", "タスク"],
    matchKeywordsEn: ["agent", "automation", "tool", "task"],
    preferredTypes: ["reasoning", "coder"],
    priorityBenchmarks: ["tauBench", "terminalBench", "sweBenchVerified"],
  },
  {
    slug: "cost-efficient",
    titleJa: "コスト重視",
    titleEn: "Budget-Friendly",
    descriptionJa: "低コストで利用できる高品質モデル",
    descriptionEn: "High-quality models at low cost",
    icon: "Coins",
    matchKeywordsJa: ["コスト", "低価格", "無料", "軽量"],
    matchKeywordsEn: ["cost", "budget", "free", "lightweight"],
    preferredTypes: ["foundation", "chat"],
    priorityBenchmarks: ["mmluPro", "elo"],
  },
  {
    slug: "multimodal",
    titleJa: "マルチモーダル",
    titleEn: "Multimodal",
    descriptionJa: "画像・動画を含むマルチモーダルタスクに最適なモデル",
    descriptionEn: "Best models for tasks involving images, video, and multimodal input",
    icon: "Image",
    matchKeywordsJa: ["マルチモーダル", "画像", "ビジョン"],
    matchKeywordsEn: ["multimodal", "image", "vision"],
    preferredTypes: ["foundation"],
    priorityBenchmarks: ["mmluPro", "gpqaDiamond"],
  },
];
