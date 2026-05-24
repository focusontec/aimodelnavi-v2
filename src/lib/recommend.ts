import { modelDetails, type ModelDetail } from "@/data/models";
import { leaderboardData, type ModelRanking } from "@/data/leaderboard";
import { pricingData } from "@/data/pricing";
import { useCaseScenarios, type UseCaseScenario } from "@/data/use-case-taxonomy";

export interface Recommendation {
  model: ModelDetail;
  score: number;
  matchedUseCases: string[];
  topBenchmark: { key: string; score: number } | null;
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildLeaderboardMap(): Map<string, ModelRanking> {
  const map = new Map<string, ModelRanking>();
  for (const entry of leaderboardData) {
    map.set(normalizeName(entry.name), entry);
  }
  return map;
}

function buildPricingMap(): Map<string, { inputPer1M: number; outputPer1M: number }> {
  const map = new Map<string, { inputPer1M: number; outputPer1M: number }>();
  for (const p of pricingData) {
    const key = normalizeName(p.modelName);
    if (!map.has(key)) {
      map.set(key, { inputPer1M: p.inputPrice, outputPer1M: p.outputPrice });
    }
  }
  return map;
}

function getKeywordMatchScore(
  model: ModelDetail,
  keywordsJa: string[],
  keywordsEn: string[],
): { score: number; matched: string[] } {
  const matched: string[] = [];
  const allUseCases = [...model.useCases, ...model.useCasesEn].map((u) => u.toLowerCase());

  for (const kw of [...keywordsJa, ...keywordsEn]) {
    const kwLower = kw.toLowerCase();
    if (allUseCases.some((uc) => uc.includes(kwLower))) {
      matched.push(kw);
    }
  }

  const score = Math.min(30, (matched.length / Math.max(keywordsJa.length + keywordsEn.length, 1)) * 30);
  return { score, matched };
}

function getTypeAffinityScore(model: ModelDetail, preferredTypes: string[]): number {
  if (preferredTypes.includes(model.type)) return 20;
  return 0;
}

function getBenchmarkScore(
  model: ModelDetail,
  priorityBenchmarks: string[],
  leaderboardMap: Map<string, ModelRanking>,
): { score: number; topBenchmark: { key: string; score: number } | null } {
  const entry = leaderboardMap.get(normalizeName(model.name));
  if (!entry) return { score: 0, topBenchmark: null };

  let totalScore = 0;
  let benchmarkCount = 0;
  let topKey = "";
  let topScore = 0;

  for (const key of priorityBenchmarks) {
    const entryAny = entry as unknown as Record<string, unknown>;
    const val = entryAny[key];
    if (typeof val === "number" && val > 0) {
      totalScore += val;
      benchmarkCount++;
      if (val > topScore) {
        topScore = val;
        topKey = key;
      }
    }
  }

  if (benchmarkCount === 0) return { score: 0, topBenchmark: null };

  const avg = totalScore / benchmarkCount;
  const normalized = Math.min(40, (avg / 100) * 40);
  return { score: normalized, topBenchmark: { key: topKey, score: topScore } };
}

function getPricingScore(
  model: ModelDetail,
  scenario: UseCaseScenario,
  pricingMap: Map<string, { inputPer1M: number; outputPer1M: number }>,
): number {
  const pricing = pricingMap.get(normalizeName(model.name));
  if (!pricing) return 0;

  const blendedCost = (pricing.inputPer1M + 2 * pricing.outputPer1M) / 3;
  if (blendedCost <= 0) return scenario.slug === "cost-efficient" ? 10 : 2;

  if (scenario.slug === "cost-efficient") {
    if (blendedCost < 0.5) return 10;
    if (blendedCost < 2) return 7;
    if (blendedCost < 5) return 4;
    return 1;
  }

  return blendedCost < 2 ? 3 : blendedCost < 10 ? 1 : 0;
}

export function getRecommendations(scenarioSlug: string, locale: string = "ja"): Recommendation[] {
  const scenario = useCaseScenarios.find((s) => s.slug === scenarioSlug);
  if (!scenario) return [];

  const leaderboardMap = buildLeaderboardMap();
  const pricingMap = buildPricingMap();

  const results: Recommendation[] = [];

  for (const model of modelDetails) {
    const { score: kwScore, matched } = getKeywordMatchScore(
      model,
      scenario.matchKeywordsJa,
      scenario.matchKeywordsEn,
    );
    const typeScore = getTypeAffinityScore(model, scenario.preferredTypes);
    const { score: benchScore, topBenchmark } = getBenchmarkScore(
      model,
      scenario.priorityBenchmarks,
      leaderboardMap,
    );
    const priceScore = getPricingScore(model, scenario, pricingMap);

    const totalScore = Math.round(kwScore + typeScore + benchScore + priceScore);

    if (totalScore > 0) {
      results.push({
        model,
        score: totalScore,
        matchedUseCases: matched,
        topBenchmark,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 20);
}
