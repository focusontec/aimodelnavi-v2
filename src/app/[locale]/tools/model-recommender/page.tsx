"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Code, FileText, Brain, DollarSign, Zap, Globe } from "lucide-react";

interface Answers {
  useCase: string;
  budget: string;
  priority: string;
  context: string;
}

interface Recommendation {
  model: string;
  reason: string;
  score: number;
  pricing: string;
  bestFor: string;
  link: string;
}

const questions = [
  {
    id: "useCase",
    question: { ja: "主な用途は何ですか？", en: "What's your primary use case?" },
    options: [
      { value: "coding", label: { ja: "コーディング", en: "Coding" }, icon: Code },
      { value: "writing", label: { ja: "文章作成", en: "Writing" }, icon: FileText },
      { value: "analysis", label: { ja: "データ分析", en: "Analysis" }, icon: Brain },
      { value: "chatbot", label: { ja: "チャットボット", en: "Chatbot" }, icon: Globe },
    ],
  },
  {
    id: "budget",
    question: { ja: "月間のAPI予算は？", en: "Monthly API budget?" },
    options: [
      { value: "low", label: { ja: "~$50", en: "~$50" }, icon: DollarSign },
      { value: "medium", label: { ja: "$50-$200", en: "$50-$200" }, icon: DollarSign },
      { value: "high", label: { ja: "$200+", en: "$200+" }, icon: DollarSign },
    ],
  },
  {
    id: "priority",
    question: { ja: "最も重視するポイントは？", en: "What matters most?" },
    options: [
      { value: "quality", label: { ja: "品質", en: "Quality" }, icon: Sparkles },
      { value: "speed", label: { ja: "速度", en: "Speed" }, icon: Zap },
      { value: "cost", label: { ja: "コスパ", en: "Cost" }, icon: DollarSign },
    ],
  },
  {
    id: "context",
    question: { ja: "扱うデータ量は？", en: "Data volume?" },
    options: [
      { value: "small", label: { ja: "少量", en: "Small" }, icon: FileText },
      { value: "medium", label: { ja: "中程度", en: "Medium" }, icon: FileText },
      { value: "large", label: { ja: "大量(100万トークン)", en: "Large (1M tokens)" }, icon: FileText },
    ],
  },
];

function getRecommendations(answers: Answers): Recommendation[] {
  const models: Recommendation[] = [];

  // Claude Opus 4.8
  let opusScore = 0;
  if (answers.useCase === "coding") opusScore += 30;
  if (answers.useCase === "analysis") opusScore += 25;
  if (answers.priority === "quality") opusScore += 30;
  if (answers.budget === "high") opusScore += 20;
  if (answers.context === "large") opusScore += 15;
  models.push({
    model: "Claude Opus 4.8",
    reason: "最高品質のコーディングと分析能力",
    score: Math.min(opusScore, 100),
    pricing: "$5/$25 per 1M",
    bestFor: "高品質コード生成",
    link: "/models/claude-opus-4-8",
  });

  // MiniMax M3
  let m3Score = 0;
  if (answers.useCase === "coding") m3Score += 25;
  if (answers.priority === "cost") m3Score += 35;
  if (answers.budget === "low") m3Score += 30;
  if (answers.context === "large") m3Score += 20;
  models.push({
    model: "MiniMax M3",
    reason: "コスパ最強。100万トークン対応",
    score: Math.min(m3Score, 100),
    pricing: "$0.30/$1.20 per 1M",
    bestFor: "コスト効率",
    link: "/models/minimax-m3",
  });

  // GPT-5.5
  let gptScore = 0;
  if (answers.useCase === "writing") gptScore += 25;
  if (answers.useCase === "chatbot") gptScore += 25;
  if (answers.priority === "quality") gptScore += 20;
  if (answers.priority === "speed") gptScore += 15;
  if (answers.budget === "medium") gptScore += 15;
  models.push({
    model: "GPT-5.5",
    reason: "バランスの取れた高性能モデル",
    score: Math.min(gptScore, 100),
    pricing: "$2.50/$10 per 1M",
    bestFor: "汎用タスク",
    link: "/models/gpt-5-5",
  });

  return models.sort((a, b) => b.score - a.score).slice(0, 3);
}

export default function ModelRecommenderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ useCase: "", budget: "", priority: "", context: "" });
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setRecommendations(getRecommendations(newAnswers));
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({ useCase: "", budget: "", priority: "", context: "" });
    setRecommendations(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" />ツール一覧に戻る
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">AIモデル推薦</h1>
        <p className="text-gray-500 mb-8">4つの質問に答えて、あなたに最適なAIモデルを見つけましょう</p>

        {/* Progress */}
        {!recommendations && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>質問 {currentStep + 1} / {questions.length}</span>
              <span>{Math.round((currentStep / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${(currentStep / questions.length) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Questions */}
        {!recommendations && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{questions[currentStep].question.ja}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {questions[currentStep].options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                    className="p-5 rounded-xl border-2 border-gray-200 text-left transition-all hover:border-primary-300 hover:bg-primary-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg"><Icon className="w-5 h-5 text-gray-600" /></div>
                      <span className="font-medium text-gray-900">{option.label.ja}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {recommendations && (
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-50 rounded-lg"><Sparkles className="w-6 h-6 text-primary-600" /></div>
                <h2 className="text-xl font-bold text-gray-900">おすすめのAIモデル</h2>
              </div>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={rec.model} className={`p-5 rounded-xl border-2 ${index === 0 ? "border-primary-500 bg-primary-50" : "border-gray-200"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {index === 0 && <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-medium rounded-full">#1</span>}
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
                        <div className="text-xs text-gray-500">適合度</div>
                      </div>
                    </div>
                    <Link href={rec.link} className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 mt-3">
                      詳細を見る <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button onClick={reset} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50">
                <RotateCcw className="w-4 h-4" />もう一度診断する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
