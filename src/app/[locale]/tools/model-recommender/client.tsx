"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Code, FileText, Brain, DollarSign, Zap, Globe } from "lucide-react";
import { pricingData } from "@/data/pricing";

interface Answers { useCase: string; budget: string; priority: string; context: string; }
interface Recommendation { model: string; reason: string; score: number; pricing: string; bestFor: string; link: string; }

const T = {
  ja: {
    back: "ツール一覧に戻る", title: "AIモデル推薦", subtitle: "4つの質問に答えて、あなたに最適なAIモデルを見つけましょう",
    questionOf: "質問", of: "/", resultTitle: "おすすめのAIモデル", restart: "もう一度診断する",
    viewDetails: "詳細を見る", matchScore: "適合度", availableModels: "対象モデル数",
  },
  en: {
    back: "Back to Tools", title: "AI Model Recommender", subtitle: "Answer 4 questions to find the perfect AI model for your needs",
    questionOf: "Question", of: "of", resultTitle: "Recommended AI Models", restart: "Start Over",
    viewDetails: "View Details", matchScore: "Match Score", availableModels: "Models evaluated",
  },
  ko: {
    back: "도구 목록으로", title: "AI 모델 추천", subtitle: "4가지 질문에 답하여 최적의 AI 모델을 찾아보세요",
    questionOf: "질문", of: "/", resultTitle: "추천 AI 모델", restart: "다시 진단하기",
    viewDetails: "자세히 보기", matchScore: "적합도", availableModels: "평가 대상 모델",
  },
};

const questions = [
  { id: "useCase", question: { ja: "主な用途は何ですか？", en: "What's your primary use case?", ko: "주요 용도는 무엇인가요?" }, options: [
    { value: "coding", label: { ja: "コーディング", en: "Coding", ko: "코딩" }, icon: Code },
    { value: "writing", label: { ja: "文章作成", en: "Writing", ko: "글쓰기" }, icon: FileText },
    { value: "analysis", label: { ja: "データ分析", en: "Analysis", ko: "데이터 분석" }, icon: Brain },
    { value: "chatbot", label: { ja: "チャットボット", en: "Chatbot", ko: "챗봇" }, icon: Globe },
  ]},
  { id: "budget", question: { ja: "月間のAPI予算は？", en: "Monthly API budget?", ko: "월간 API 예산은?" }, options: [
    { value: "low", label: { ja: "~$50", en: "~$50", ko: "~$50" }, icon: DollarSign },
    { value: "medium", label: { ja: "$50-$200", en: "$50-$200", ko: "$50-$200" }, icon: DollarSign },
    { value: "high", label: { ja: "$200+", en: "$200+", ko: "$200+" }, icon: DollarSign },
  ]},
  { id: "priority", question: { ja: "最も重視するポイントは？", en: "What matters most?", ko: "가장 중요한 것은?" }, options: [
    { value: "quality", label: { ja: "品質", en: "Quality", ko: "품질" }, icon: Sparkles },
    { value: "speed", label: { ja: "速度", en: "Speed", ko: "속도" }, icon: Zap },
    { value: "cost", label: { ja: "コスパ", en: "Cost", ko: "비용" }, icon: DollarSign },
  ]},
  { id: "context", question: { ja: "扱うデータ量は？", en: "Data volume?", ko: "데이터량은?" }, options: [
    { value: "small", label: { ja: "少量", en: "Small", ko: "소량" }, icon: FileText },
    { value: "medium", label: { ja: "中程度", en: "Medium", ko: "중간" }, icon: FileText },
    { value: "large", label: { ja: "大量(100万トークン)", en: "Large (1M tokens)", ko: "대량 (100만 토큰)" }, icon: FileText },
  ]},
];

// Model characteristics for scoring
const modelProfiles: Record<string, { coding: number; writing: number; analysis: number; chatbot: number; costTier: number; speedTier: number; qualityTier: number; contextSize: number }> = {
  "Claude Opus 4.8": { coding: 95, writing: 90, analysis: 95, chatbot: 85, costTier: 1, speedTier: 2, qualityTier: 1, contextSize: 1000000 },
  "Claude Opus 4.7": { coding: 90, writing: 88, analysis: 92, chatbot: 83, costTier: 1, speedTier: 2, qualityTier: 1, contextSize: 1000000 },
  "Claude Opus 4.6": { coding: 88, writing: 86, analysis: 90, chatbot: 82, costTier: 1, speedTier: 2, qualityTier: 1, contextSize: 200000 },
  "Claude Sonnet 4.6": { coding: 85, writing: 88, analysis: 85, chatbot: 90, costTier: 2, speedTier: 1, qualityTier: 2, contextSize: 200000 },
  "GPT-5.5": { coding: 88, writing: 92, analysis: 88, chatbot: 95, costTier: 2, speedTier: 1, qualityTier: 1, contextSize: 256000 },
  "GPT-5.2": { coding: 85, writing: 90, analysis: 85, chatbot: 92, costTier: 2, speedTier: 1, qualityTier: 2, contextSize: 256000 },
  "Gemini 3.0 Pro": { coding: 82, writing: 85, analysis: 88, chatbot: 85, costTier: 2, speedTier: 2, qualityTier: 2, contextSize: 1000000 },
  "Gemini 3.1 Pro Preview": { coding: 84, writing: 86, analysis: 90, chatbot: 86, costTier: 2, speedTier: 2, qualityTier: 2, contextSize: 1000000 },
  "Gemini 3.5 Flash": { coding: 78, writing: 82, analysis: 80, chatbot: 88, costTier: 3, speedTier: 1, qualityTier: 3, contextSize: 1000000 },
  "Grok 4": { coding: 80, writing: 82, analysis: 85, chatbot: 80, costTier: 2, speedTier: 2, qualityTier: 2, contextSize: 1000000 },
  "MiniMax M3": { coding: 85, writing: 78, analysis: 80, chatbot: 75, costTier: 3, speedTier: 1, qualityTier: 2, contextSize: 1000000 },
  "DeepSeek V3.2": { coding: 82, writing: 75, analysis: 78, chatbot: 72, costTier: 3, speedTier: 1, qualityTier: 3, contextSize: 128000 },
  "DeepSeek V4 Pro": { coding: 85, writing: 78, analysis: 80, chatbot: 75, costTier: 3, speedTier: 1, qualityTier: 2, contextSize: 128000 },
  "GPT-4.1": { coding: 75, writing: 80, analysis: 75, chatbot: 85, costTier: 3, speedTier: 1, qualityTier: 3, contextSize: 1000000 },
  "Claude Mythos Preview": { coding: 92, writing: 88, analysis: 95, chatbot: 85, costTier: 1, speedTier: 3, qualityTier: 1, contextSize: 200000 },
};

function getRecommendations(answers: Answers, t: typeof T.ja, locale: string): Recommendation[] {
  const models: Recommendation[] = [];
  const allModels = [...new Set(pricingData.map((p) => p.modelName))];

  for (const modelName of allModels) {
    const profile = modelProfiles[modelName];
    const pricing = pricingData.find((p) => p.modelName === modelName && p.billingMode === "standard");
    if (!profile || !pricing) continue;

    let score = 0;

    // Use case scoring
    if (answers.useCase === "coding") score += profile.coding;
    else if (answers.useCase === "writing") score += profile.writing;
    else if (answers.useCase === "analysis") score += profile.analysis;
    else if (answers.useCase === "chatbot") score += profile.chatbot;

    // Budget scoring
    if (answers.budget === "low" && profile.costTier === 3) score += 20;
    if (answers.budget === "low" && profile.costTier === 2) score += 10;
    if (answers.budget === "medium" && profile.costTier === 2) score += 20;
    if (answers.budget === "medium" && profile.costTier === 1) score += 10;
    if (answers.budget === "high" && profile.costTier === 1) score += 20;
    if (answers.budget === "high" && profile.costTier === 2) score += 10;

    // Priority scoring
    if (answers.priority === "quality" && profile.qualityTier === 1) score += 25;
    if (answers.priority === "quality" && profile.qualityTier === 2) score += 15;
    if (answers.priority === "speed" && profile.speedTier === 1) score += 25;
    if (answers.priority === "speed" && profile.speedTier === 2) score += 15;
    if (answers.priority === "cost" && profile.costTier === 3) score += 25;
    if (answers.priority === "cost" && profile.costTier === 2) score += 15;

    // Context size scoring
    if (answers.context === "large" && profile.contextSize >= 1000000) score += 20;
    if (answers.context === "medium" && profile.contextSize >= 200000) score += 15;
    if (answers.context === "small") score += 10;

    const normalizedScore = Math.min(Math.round((score / 140) * 100), 100);

    models.push({
      model: modelName,
      reason: getReason(modelName, answers, locale),
      score: normalizedScore,
      pricing: `$${pricing.inputPrice}/$${pricing.outputPrice} per 1M`,
      bestFor: getBestFor(modelName, locale),
      link: `/models/${modelName.toLowerCase().replace(/\s+/g, "-")}`,
    });
  }

  return models.sort((a, b) => b.score - a.score).slice(0, 5);
}

function getReason(model: string, answers: Answers, locale: string): string {
  const reasons: Record<string, Record<string, string>> = {
    "Claude Opus 4.8": { coding: "最高品質のコーディング能力", writing: "優れた文章生成", analysis: "高度な分析能力", chatbot: "高品質な対話" },
    "GPT-5.5": { coding: "バランスの取れたコーディング", writing: "最高品質の文章", analysis: "優れた分析", chatbot: "自然な対話" },
    "MiniMax M3": { coding: "コスパ最強のコーディング", writing: "コスト効率の良い文章", analysis: "大規模データ分析", chatbot: "低コスト対話" },
    "DeepSeek V3.2": { coding: "低コストコーディング", writing: "手軽な文章生成", analysis: "基本分析", chatbot: "手軽な対話" },
  };
  const koReasons: Record<string, Record<string, string>> = {
    "Claude Opus 4.8": { coding: "최고 품질의 코딩 능력", writing: "뛰어난 글 생성", analysis: "고급 분석 능력", chatbot: "고품질 대화" },
    "GPT-5.5": { coding: "균형 잡힌 코딩", writing: "최고 품질의 글", analysis: "뛰어난 분석", chatbot: "자연스러운 대화" },
    "MiniMax M3": { coding: "가성비 최강 코딩", writing: "비용 효율적인 글", analysis: "대규모 데이터 분석", chatbot: "저비용 대화" },
    "DeepSeek V3.2": { coding: "저비용 코딩", writing: "간편한 글 생성", analysis: "기본 분석", chatbot: "간편한 대화" },
  };
  if (locale === "ko") return koReasons[model]?.[answers.useCase] || reasons[model]?.[answers.useCase] || "균형 잡힌 성능";
  return reasons[model]?.[answers.useCase] || "バランスの良い性能";
}

function getBestFor(model: string, locale: string): string {
  const bestFor: Record<string, string> = {
    "Claude Opus 4.8": "高品質コード生成",
    "Claude Opus 4.7": "高品質分析",
    "GPT-5.5": "汎用タスク",
    "GPT-5.2": "バランス重視",
    "MiniMax M3": "コスト効率",
    "DeepSeek V3.2": "低コスト",
    "Gemini 3.0 Pro": "長コンテキスト",
    "Grok 4": "推論タスク",
  };
  const koBestFor: Record<string, string> = {
    "Claude Opus 4.8": "고품질 코드 생성",
    "Claude Opus 4.7": "고품질 분석",
    "GPT-5.5": "범용 태스크",
    "GPT-5.2": "균형 중시",
    "MiniMax M3": "비용 효율",
    "DeepSeek V3.2": "저비용",
    "Gemini 3.0 Pro": "긴 컨텍스트",
    "Grok 4": "추론 태스크",
  };
  if (locale === "ko") return koBestFor[model] || "범용";
  return bestFor[model] || "汎用";
}

export default function ModelRecommenderPage() {
  const params = useParams();
  const locale = (params.locale as string) === "en" ? "en" : (params.locale as string) === "ko" ? "ko" : "ja";
  const t = T[locale];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ useCase: "", budget: "", priority: "", context: "" });
  const [recs, setRecs] = useState<Recommendation[] | null>(null);

  const allModels = [...new Set(pricingData.map((p) => p.modelName))];

  const handleAnswer = (id: string, value: string) => {
    const newAnswers = { ...answers, [id]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) setStep(step + 1);
    else setRecs(getRecommendations(newAnswers, t, locale));
  };

  const reset = () => { setStep(0); setAnswers({ useCase: "", budget: "", priority: "", context: "" }); setRecs(null); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href={`/${locale === "ja" ? "" : locale + "/"}tools`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" />{t.back}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-500 mb-2">{t.subtitle}</p>
        <p className="text-xs text-gray-400 mb-8">{t.availableModels}: {allModels.length}</p>

        {!recs && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{t.questionOf} {step + 1} {t.of} {questions.length}</span>
              <span>{Math.round((step / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${(step / questions.length) * 100}%` }} />
            </div>
          </div>
        )}

        {!recs && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{questions[step].question[locale]}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {questions[step].options.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button key={opt.value} onClick={() => handleAnswer(questions[step].id, opt.value)}
                    className="p-5 rounded-xl border-2 border-gray-200 text-left transition-all hover:border-primary-300 hover:bg-primary-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg"><Icon className="w-5 h-5 text-gray-600" /></div>
                      <span className="font-medium text-gray-900">{opt.label[locale]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {recs && (
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-50 rounded-lg"><Sparkles className="w-6 h-6 text-primary-600" /></div>
                <h2 className="text-xl font-bold text-gray-900">{t.resultTitle}</h2>
              </div>
              <div className="space-y-4">
                {recs.map((rec, i) => (
                  <div key={rec.model} className={`p-5 rounded-xl border-2 ${i === 0 ? "border-primary-500 bg-primary-50" : "border-gray-200"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {i === 0 && <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-medium rounded-full">#1</span>}
                          <h3 className="text-lg font-bold text-gray-900">{rec.model}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{rec.reason}</p>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{rec.pricing}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{rec.bestFor}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">{rec.score}%</div>
                        <div className="text-xs text-gray-500">{t.matchScore}</div>
                      </div>
                    </div>
                    <Link href={`/${locale === "ja" ? "" : locale + "/"}${rec.link}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 mt-3">
                      {t.viewDetails} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button onClick={reset} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50">
                <RotateCcw className="w-4 h-4" />{t.restart}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
