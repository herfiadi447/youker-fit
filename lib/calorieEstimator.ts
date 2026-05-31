import type { FoodItem, NutrientEstimate } from "@/types";

export function estimateFoodCalories(
  food: FoodItem,
  quantity: number
): NutrientEstimate {
  const totalGram = quantity * food.default_serving_gram;

  return {
    totalGram,
    calories: Math.round((totalGram / 100) * food.calories_per_100g),
    protein: Math.round(((totalGram / 100) * food.protein_per_100g) * 10) / 10,
    carbs: Math.round(((totalGram / 100) * food.carbs_per_100g) * 10) / 10,
    fat: Math.round(((totalGram / 100) * food.fat_per_100g) * 10) / 10,
  };
}
