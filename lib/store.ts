"use client";

import type {
  UserProfile,
  FoodLogEntry,
  ExerciseLogEntry,
  WeightLogEntry,
} from "@/types";

const STORAGE_KEYS = {
  profile: "youker_fit_profile",
  foodLogs: "youker_fit_food_logs",
  exerciseLogs: "youker_fit_exercise_logs",
  weightLogs: "youker_fit_weight_logs",
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Profile ----
export function getProfile(): UserProfile | null {
  return getItem<UserProfile | null>(STORAGE_KEYS.profile, null);
}

export function saveProfile(profile: UserProfile): void {
  setItem(STORAGE_KEYS.profile, profile);
}

// ---- Food Logs ----
export function getFoodLogs(): FoodLogEntry[] {
  return getItem<FoodLogEntry[]>(STORAGE_KEYS.foodLogs, []);
}

export function getFoodLogsByDate(date: string): FoodLogEntry[] {
  return getFoodLogs().filter((l) => l.log_date === date);
}

export function addFoodLog(entry: FoodLogEntry): void {
  const logs = getFoodLogs();
  logs.push(entry);
  setItem(STORAGE_KEYS.foodLogs, logs);
}

export function deleteFoodLog(id: string): void {
  const logs = getFoodLogs().filter((l) => l.id !== id);
  setItem(STORAGE_KEYS.foodLogs, logs);
}

// ---- Exercise Logs ----
export function getExerciseLogs(): ExerciseLogEntry[] {
  return getItem<ExerciseLogEntry[]>(STORAGE_KEYS.exerciseLogs, []);
}

export function getExerciseLogsByDate(date: string): ExerciseLogEntry[] {
  return getExerciseLogs().filter((l) => l.log_date === date);
}

export function addExerciseLog(entry: ExerciseLogEntry): void {
  const logs = getExerciseLogs();
  logs.push(entry);
  setItem(STORAGE_KEYS.exerciseLogs, logs);
}

export function deleteExerciseLog(id: string): void {
  const logs = getExerciseLogs().filter((l) => l.id !== id);
  setItem(STORAGE_KEYS.exerciseLogs, logs);
}

// ---- Weight Logs ----
export function getWeightLogs(): WeightLogEntry[] {
  return getItem<WeightLogEntry[]>(STORAGE_KEYS.weightLogs, []);
}

export function addWeightLog(entry: WeightLogEntry): void {
  const logs = getWeightLogs();
  logs.push(entry);
  setItem(STORAGE_KEYS.weightLogs, logs);
}

export function getLatestWeight(): number | null {
  const logs = getWeightLogs();
  if (logs.length === 0) return null;
  const sorted = [...logs].sort(
    (a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
  );
  return sorted[0].weight;
}

// ---- Helpers ----
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
