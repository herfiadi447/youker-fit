// TypeScript types for Youker Fit

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  height_cm: number;
  start_weight: number;
  current_weight: number;
  target_weight: number;
  activity_level: ActivityLevel;
  goal: FitnessGoal;
  bmr: number;
  tdee: number;
  daily_calorie_target: number;
  daily_protein_target: number;
  created_at?: string;
  updated_at?: string;
}

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export type FitnessGoal =
  | "fat_loss_light"
  | "fat_loss_moderate"
  | "fat_loss_aggressive"
  | "maintenance"
  | "muscle_gain"
  | "general_health";

export interface FoodItem {
  id: string;
  name: string;
  aliases: string[];
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  default_serving_gram: number;
  default_serving_name: string;
  category: string;
}

export interface ParsedFoodItem {
  foodName: string;
  quantity: number;
  unit: string;
  matchedFood?: FoodItem;
}

export interface FoodLogEntry {
  id: string;
  user_id: string;
  food_id?: string;
  food_name: string;
  quantity: number;
  serving_unit: string;
  serving_gram: number;
  total_gram: number;
  estimated_calories: number;
  estimated_protein: number;
  estimated_carbs: number;
  estimated_fat: number;
  meal_time: MealTime;
  log_date: string;
  note?: string;
  created_at?: string;
}

export type MealTime =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Snack"
  | "Pre-workout"
  | "Post-workout";

export interface ExerciseType {
  id: string;
  name: string;
  aliases: string[];
  met_value: number;
  calculation_type: "met_based" | "distance_based" | "manual";
  category: string;
  icon: string;
}

export interface ExerciseLogEntry {
  id: string;
  user_id: string;
  exercise_type_id?: string;
  exercise_name: string;
  duration_minutes: number;
  distance_km?: number;
  intensity: "Low" | "Moderate" | "Vigorous";
  estimated_calories_burned: number;
  log_date: string;
  note?: string;
  created_at?: string;
}

export interface WeightLogEntry {
  id: string;
  user_id: string;
  weight: number;
  log_date: string;
  note?: string;
  created_at?: string;
}

export interface DailySummary {
  totalCaloriesIn: number;
  totalCaloriesBurned: number;
  netIntake: number;
  targetCalories: number;
  calorieBalance: number;
  status: "deficit" | "on_target" | "surplus";
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface NutrientEstimate {
  totalGram: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
