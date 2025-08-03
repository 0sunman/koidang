import FoodList from "../list/food";
import { getResultByCategory } from "./getAllResults";

const categories = ["연애운", "학업운", "금전운", "건강운"] as const;

export async function getFoodRecommendationWithDate(
  name: string,
  birth: string,
  mbti: string
): Promise<Record<(typeof categories)[number], string[]>> {
  const result: Record<string, string[]> = {};

  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  for (const category of categories) {
    // 날짜도 seed에 포함시켜 개인화 강화
    const { 장점_index } = await getResultByCategory(
      name,
      birth,
      mbti,
      `${category}-${yearMonth}`
    );
    const recommended = 장점_index
      .map((i) => FoodList[i % FoodList.length])
      .slice(0, 5);
    result[category] = recommended;
  }

  return result;
}
