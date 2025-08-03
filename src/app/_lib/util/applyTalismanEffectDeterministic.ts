import { getBigSeed, getScoreFromSeed } from "./getAllResults";

const colorList = ["red", "orange", "yellow", "green", "blue", "purple"];

function getColorLuckDistribution(seed: bigint): Record<string, number> {
  const raw: number[] = [];
  for (let i = 0n; i < colorList.length; i++) {
    const val = Number((seed + i * i) % 100n);
    raw.push(val + 1); // 1 이상 보장
  }

  const total = raw.reduce((a, b) => a + b, 0);
  const result: Record<string, number> = {};

  colorList.forEach((color, idx) => {
    const ratio = Math.round((raw[idx] / total) * 100);
    result[color] = ratio;
  });

  // 보정: 합이 100이 아닐 수 있으므로 마지막 색상에 보정값 추가
  const diff = 100 - Object.values(result).reduce((a, b) => a + b, 0);
  result[colorList[colorList.length - 1]] += diff;

  return result;
}

function getBoostFromSeed(seed: bigint): number {
  return Number(seed % 6n) + 5; // 0~5 → 5~10
}

export async function applyTalismanEffectDeterministic(
  name: string,
  birth: string,
  mbti: string,
  category: string
): Promise<{
  baseScore: number;
  boostedScore: number;
  boost: number;
  colorDistribution: Record<string, number>;
}> {
  const baseSeed = await getBigSeed(name, birth, mbti, category);
  const baseScore = getScoreFromSeed(baseSeed);

  const colorSeed = await getBigSeed(name, birth, mbti, category, "color");
  const colorDistribution = getColorLuckDistribution(colorSeed);

  const boostSeed = await getBigSeed(name, birth, mbti, category, "talisman");
  const boost = getBoostFromSeed(boostSeed);

  return {
    baseScore,
    boostedScore: Math.min(baseScore + boost, 100),
    boost,
    colorDistribution,
  };
}
