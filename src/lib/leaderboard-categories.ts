import { Trophy, Code, Calculator, Bot, Brain, Gauge, type LucideIcon } from "lucide-react";

export interface LeaderboardCategory {
  slug: string;
  title: string;
  titleEn: string;
  titleKo: string;
  description: string;
  descriptionEn: string;
  descriptionKo: string;
  benchmarks: string[];
  icon: LucideIcon;
}

export const leaderboardCategories: Record<string, LeaderboardCategory> = {
  comprehensive: {
    slug: "comprehensive",
    title: "総合ランキング",
    titleEn: "Comprehensive Ranking",
    titleKo: "종합 랭킹",
    description: "HLE、ARC-AGI-2、FrontierMath、SWE-bench Verified、τ²-Bench の総合ランキング。",
    descriptionEn: "Overall AI model ranking across HLE, ARC-AGI-2, FrontierMath, SWE-bench Verified, and τ²-Bench.",
    descriptionKo: "HLE, ARC-AGI-2, FrontierMath, SWE-bench Verified, τ²-Bench 기반 종합 AI 모델 순위.",
    benchmarks: ["hle", "arcAgi2", "frontierMath", "sweBenchVerified", "tauBench"],
    icon: Trophy,
  },
  code: {
    slug: "code",
    title: "コーディング能力ランキング",
    titleEn: "Coding Capability",
    titleKo: "코딩 능력",
    description: "SWE-bench Verified、LiveCodeBench、SWE-bench Pro、Aider-Polyglot によるプログラミング能力評価。",
    descriptionEn: "Programming ability benchmarks: SWE-bench Verified, LiveCodeBench, SWE-bench Pro, Aider-Polyglot.",
    descriptionKo: "SWE-bench Verified, LiveCodeBench, SWE-bench Pro, Aider-Polyglot 기반 프로그래밍 능력 평가.",
    benchmarks: ["sweBenchVerified", "liveCodeBench", "sweBenchPro", "aiderPolyglot"],
    icon: Code,
  },
  math: {
    slug: "math",
    title: "数学能力ランキング",
    titleEn: "Math Capability",
    titleKo: "수학 능력",
    description: "AIME 2025/2026、FrontierMath、MATH-500、GSM8K による数学的推論能力評価。",
    descriptionEn: "Mathematical reasoning benchmarks: AIME 2025/2026, FrontierMath, MATH-500, GSM8K.",
    descriptionKo: "AIME 2025/2026, FrontierMath, MATH-500, GSM8K 기반 수학적 추론 능력 평가.",
    benchmarks: ["aime2025", "aime2026", "frontierMath", "math500", "gsm8k"],
    icon: Calculator,
  },
  agent: {
    slug: "agent",
    title: "AIエージェント能力ランキング",
    titleEn: "AI Agent Capability",
    titleKo: "AI 에이전트 능력",
    description: "τ²-Bench、Terminal Bench Hard、Aider-Polyglot による自律エージェント能力評価。",
    descriptionEn: "Autonomous agent benchmarks: τ²-Bench, Terminal Bench Hard, Aider-Polyglot.",
    descriptionKo: "τ²-Bench, Terminal Bench Hard, Aider-Polyglot 기반 자율 에이전트 능력 평가.",
    benchmarks: ["tauBench", "terminalBench", "aiderPolyglot"],
    icon: Bot,
  },
  reasoning: {
    slug: "reasoning",
    title: "推論能力ランキング",
    titleEn: "Reasoning Capability",
    titleKo: "추론 능력",
    description: "HLE、ARC-AGI-2、GPQA Diamond による推論・思考能力評価。",
    descriptionEn: "Reasoning and thinking benchmarks: HLE, ARC-AGI-2, GPQA Diamond.",
    descriptionKo: "HLE, ARC-AGI-2, GPQA Diamond 기반 추론·사고 능력 평가.",
    benchmarks: ["hle", "arcAgi2", "gpqaDiamond"],
    icon: Brain,
  },
  general: {
    slug: "general",
    title: "汎用性能ランキング",
    titleEn: "General Performance",
    titleKo: "범용 성능",
    description: "MMLU-Pro、LMArena Elo による総合的な性能評価。",
    descriptionEn: "General AI performance: MMLU-Pro, LMArena Elo ratings.",
    descriptionKo: "MMLU-Pro, LMArena Elo 기반 종합 성능 평가.",
    benchmarks: ["mmluPro", "elo"],
    icon: Gauge,
  },
  openclaw: {
    slug: "openclaw",
    title: "OpenClawランキング",
    titleEn: "OpenClaw Ranking",
    titleKo: "OpenClaw 랭킹",
    description: "Claw Bench、Pinch Bench によるOpenClawエージェント性能評価。",
    descriptionEn: "OpenClaw agent performance: Claw Bench and Pinch Bench.",
    descriptionKo: "Claw Bench, Pinch Bench 기반 OpenClaw 에이전트 성능 평가.",
    benchmarks: ["clawBench", "pinchBench"],
    icon: Bot,
  },
};

export const categoryOrder = ["comprehensive", "code", "math", "agent", "reasoning", "general", "openclaw"];

export function getCategoryBySlug(slug: string): LeaderboardCategory | undefined {
  return leaderboardCategories[slug];
}
