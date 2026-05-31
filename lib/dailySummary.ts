import type { FoodLogEntry, ExerciseLogEntry, DailySummary } from "@/types";

export function calculateDailySummary(
  foodLogs: FoodLogEntry[],
  exerciseLogs: ExerciseLogEntry[],
  targetCalories: number
): DailySummary {
  const totalCaloriesIn = foodLogs.reduce(
    (sum, item) => sum + item.estimated_calories,
    0
  );
  const totalCaloriesBurned = exerciseLogs.reduce(
    (sum, item) => sum + item.estimated_calories_burned,
    0
  );
  const netIntake = totalCaloriesIn - totalCaloriesBurned;
  const calorieBalance = netIntake - targetCalories;

  const totalProtein = foodLogs.reduce(
    (sum, item) => sum + item.estimated_protein,
    0
  );
  const totalCarbs = foodLogs.reduce(
    (sum, item) => sum + item.estimated_carbs,
    0
  );
  const totalFat = foodLogs.reduce(
    (sum, item) => sum + item.estimated_fat,
    0
  );

  let status: DailySummary["status"] = "on_target";
  if (calorieBalance < 0) status = "deficit";
  if (calorieBalance > 0) status = "surplus";

  return {
    totalCaloriesIn,
    totalCaloriesBurned,
    netIntake,
    targetCalories,
    calorieBalance,
    status,
    totalProtein: Math.round(totalProtein),
    totalCarbs: Math.round(totalCarbs),
    totalFat: Math.round(totalFat),
  };
}
