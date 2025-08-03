// 유틸: SHA-256 기반 BigInt 해시 생성
export async function getBigSeed(...inputs: string[]): Promise<bigint> {
  const str = inputs.join("-");
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return BigInt(
    "0x" + hashArr.map((b) => b.toString(16).padStart(2, "0")).join("")
  );
}

// 점수 계산 (0~100)
export function getScoreFromSeed(seed: bigint): number {
  return Number(seed % 101n);
}

// 유니크한 인덱스 배열 생성
function getUniqueIndexes(
  seed: bigint,
  count: number,
  max: number = 20
): number[] {
  const result = new Set<number>();
  let i = 0n;
  const maxAttempts = BigInt(max * 10);

  while (result.size < count && i < maxAttempts) {
    const index = Number((seed + i * i) % BigInt(max));
    result.add(index);
    i++;
  }

  for (let j = 0; result.size < count && j < max; j++) {
    result.add(j);
  }

  return Array.from(result);
}

// 기본 운세 결과
export async function getResult(
  name: string,
  birth: string,
  mbti: string
): Promise<{
  score: number;
  장점_index: number[];
  단점_index: number[];
}> {
  const seed = await getBigSeed(name, birth, mbti);
  const score = getScoreFromSeed(seed);

  const totalCount = 10;
  const prosCount = Math.round((score / 100) * totalCount);
  const consCount = totalCount - prosCount;

  const prosSeed = await getBigSeed(name, birth, mbti, "pros");
  const consSeed = await getBigSeed(name, birth, mbti, "cons");

  return {
    score,
    장점_index: getUniqueIndexes(prosSeed, prosCount),
    단점_index: getUniqueIndexes(consSeed, consCount),
  };
}

// 카테고리별 운세 결과
export async function getResultByCategory(
  name: string,
  birth: string,
  mbti: string,
  category: string
): Promise<{
  category: string;
  score: number;
  장점_index: number[];
  단점_index: number[];
}> {
  const baseSeed = await getBigSeed(name, birth, mbti, category);
  const score = getScoreFromSeed(baseSeed);

  const totalCount = 10;
  const prosCount = Math.round((score / 100) * totalCount);
  const consCount = totalCount - prosCount;

  const prosSeed = await getBigSeed(name, birth, mbti, category, "pros");
  const consSeed = await getBigSeed(name, birth, mbti, category, "cons");

  return {
    category,
    score,
    장점_index: getUniqueIndexes(prosSeed, prosCount),
    단점_index: getUniqueIndexes(consSeed, consCount),
  };
}

// 전체 카테고리 결과
export async function getAllResults(
  name: string,
  birth: string,
  mbti: string
): Promise<Record<string, Awaited<ReturnType<typeof getResultByCategory>>>> {
  const categories = ["연애운", "학업운", "금전운", "건강운"];
  const results: Record<
    string,
    Awaited<ReturnType<typeof getResultByCategory>>
  > = {};

  for (const category of categories) {
    results[category] = await getResultByCategory(name, birth, mbti, category);
  }

  return results;
}
