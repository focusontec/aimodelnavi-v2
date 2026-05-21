'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { pricingData } from '@/data/pricing';

const T = {
  ja: {
    title: "APIコスト計算",
    desc: "モデルと使用量を入力すると、月額のAPIコストを試算できます。",
    selectModel: "モデルを選択",
    placeholder: "モデルを選んでください",
    inputTokens: "1リクエストあたりの入力トークン数",
    outputTokens: "1リクエストあたりの出力トークン数",
    requestsDay: "1日あたりのリクエスト数",
    perRequest: "1リクエストあたり",
    perDay: "1日あたり",
    perMonth: "月額（30日）",
    noData: "このモデルの標準課金データが見つかりません。",
    note: "※ この計算は概算です。実際の料金は各プロバイダーの公式価格表に基づきます。バッチ処理やキャッシュを利用することで、実際のコストを大幅に削減できる場合があります。",
  },
  en: {
    title: "API Cost Calculator",
    desc: "Enter a model and usage to estimate monthly API costs.",
    selectModel: "Select Model",
    placeholder: "Choose a model",
    inputTokens: "Input tokens per request",
    outputTokens: "Output tokens per request",
    requestsDay: "Requests per day",
    perRequest: "Per request",
    perDay: "Per day",
    perMonth: "Monthly (30 days)",
    noData: "Standard pricing data not found for this model.",
    note: "※ This calculation is an estimate. Actual pricing is based on each provider's official price list. Using batch processing or caching can significantly reduce actual costs.",
  },
};

export default function CostCalculatorPage() {
  const locale = useLocale();
  const t = T[locale as keyof typeof T] || T.ja;

  const [selectedModel, setSelectedModel] = useState('');
  const [inputTokens, setInputTokens] = useState(1000000);
  const [outputTokens, setOutputTokens] = useState(250000);
  const [requestsPerDay, setRequestsPerDay] = useState(100);

  const modelOptions = [...new Set(pricingData.map((p) => p.modelName))];

  const selectedPricing = pricingData.find(
    (p) => p.modelName === selectedModel && p.billingMode === 'standard'
  );

  const inputCost = selectedPricing
    ? (inputTokens / 1_000_000) * selectedPricing.inputPrice
    : 0;
  const outputCost = selectedPricing
    ? (outputTokens / 1_000_000) * selectedPricing.outputPrice
    : 0;
  const perRequestCost = inputCost + outputCost;
  const dailyCost = perRequestCost * requestsPerDay;
  const monthlyCost = dailyCost * 30;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
      <p className="text-gray-500 mb-8">{t.desc}</p>

      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        {/* Model select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t.selectModel}
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{t.placeholder}</option>
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Input tokens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t.inputTokens}
          </label>
          <input
            type="number"
            value={inputTokens}
            onChange={(e) => setInputTokens(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">
            {inputTokens >= 1000000
              ? `${(inputTokens / 1000000).toFixed(1)}M tokens`
              : inputTokens >= 1000
              ? `${(inputTokens / 1000).toFixed(0)}K tokens`
              : `${inputTokens} tokens`}
          </p>
        </div>

        {/* Output tokens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t.outputTokens}
          </label>
          <input
            type="number"
            value={outputTokens}
            onChange={(e) => setOutputTokens(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Requests per day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t.requestsDay}
          </label>
          <input
            type="number"
            value={requestsPerDay}
            onChange={(e) => setRequestsPerDay(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results */}
      {selectedPricing && (
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="p-5 bg-primary-50 rounded-xl">
            <p className="text-xs font-medium text-primary-600 mb-1">{t.perRequest}</p>
            <p className="text-2xl font-bold text-primary-700">
              ${perRequestCost.toFixed(4)}
            </p>
          </div>
          <div className="p-5 bg-accent-50 rounded-xl">
            <p className="text-xs font-medium text-accent-600 mb-1">{t.perDay}</p>
            <p className="text-2xl font-bold text-accent-700">
              ${dailyCost.toFixed(2)}
            </p>
          </div>
          <div className="p-5 bg-emerald-50 rounded-xl">
            <p className="text-xs font-medium text-emerald-600 mb-1">{t.perMonth}</p>
            <p className="text-2xl font-bold text-emerald-700">
              ${monthlyCost.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {selectedModel && !selectedPricing && (
        <div className="mt-8 p-4 bg-amber-50 text-amber-700 text-sm rounded-lg">
          {t.noData}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">{t.note}</p>
      </div>
    </div>
  );
}
