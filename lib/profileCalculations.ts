import type { ActivityLevel, FitnessGoal } from "@/types";

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export function calculateBMR(
  gender: "male" | "female",
  weightKg: number,
  heightCm: number,
  age: number
): number {
  // Mifflin-St Jeor
  if (gender === "male") {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activityLevel]);
}

export function calculateDailyCalorieTarget(
  tdee: number,
  goal: FitnessGoal
): number {
  switch (goal) {
    case "fat_loss_light":
      return tdee - 300;
    case "fat_loss_moderate":
      return tdee - 500;
    case "fat_loss_aggressive":
      return tdee - 700;
    case "maintenance":
    case "general_health":
      return tdee;
    case "muscle_gain":
      return tdee + 250;
    default:
      return tdee;
  }
}

export function calculateProteinTarget(weightKg: number, goal: FitnessGoal): number {
  // Protein target in grams per day
  switch (goal) {
    case "muscle_gain":
      return Math.round(weightKg * 2.0); // 2g per kg
    case "fat_loss_light":
    case "fat_loss_moderate":
    case "fat_loss_aggressive":
      return Math.round(weightKg * 1.8); // 1.8g per kg
    case "maintenance":
    case "general_health":
    default:
      return Math.round(weightKg * 1.5); // 1.5g per kg
  }
}
