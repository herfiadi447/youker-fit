"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { calculateDailySummary } from "@/lib/dailySummary";
import type { DailySummary, FoodLogEntry, ExerciseLogEntry } from "@/types";

export default function DashboardPage() {
  const supabase = createClient();
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLogEntry[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogEntry[]>([]);
  const [lastWeight, setLastWeight] = useState<number | null>(null);
  const [proteinTarget, setProteinTarget] = useState(150);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toISOString().split("T")[0];
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Fetch profile for targets and weight
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const targetCalories = profile?.daily_calorie_target ?? 2000;
      setProteinTarget(profile?.daily_protein_target ?? 150);
      setLastWeight(profile?.current_weight ?? null);

      // Fetch today's food logs
      const { data: fLogs } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", todayStr);

      // Fetch today's exercise logs
      const { data: eLogs } = await supabase
        .from("exercise_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", todayStr);

      const foods = (fLogs || []) as FoodLogEntry[];
      const exercises = (eLogs || []) as ExerciseLogEntry[];
      
      setFoodLogs(foods);
      setExerciseLogs(exercises);
      setSummary(calculateDailySummary(foods, exercises, targetCalories));
      setLoading(false);
    }
    loadDashboard();
  }, [supabase, todayStr]);

  if (loading || !summary) {
    return (
      <div className="max-w-[1200px] mx-auto p-container-padding flex items-center justify-center min-h-[400px]">
        <div className="text-on-surface-variant font-label-mono animate-pulse">Loading dashboard from Supabase...</div>
      </div>
    );
  }

  const proteinPercent = Math.min(100, Math.round((summary.totalProtein / proteinTarget) * 100));

  const statusLabel =
    summary.status === "deficit" ? "Deficit on track" : summary.status === "surplus" ? "Over target" : "On target";
  const statusColor =
    summary.status === "deficit" ? "deficit-success" : summary.status === "surplus" ? "surplus-warning" : "on-target";

  return (
    <div className="max-w-[1200px] mx-auto p-container-padding flex flex-col gap-section-gap pb-24">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">Dashboard</h2>
          <p className="text-on-surface-variant mt-1">{dateLabel}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Hero Widget: Daily Calorie Balance */}
        <div className="md:col-span-12 bg-surface-container rounded-xl p-card-inner flex flex-col md:flex-row justify-between items-start md:items-center border border-outline-variant/30 relative overflow-hidden">
          <div className="flex-1 mb-6 md:mb-0 z-10">
            <h3 className="font-label-mono text-on-surface-variant uppercase mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">scale</span> Net Calorie Balance
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="font-display-stat text-on-surface">{summary.netIntake.toLocaleString()}</span>
              <span className="font-body-lg text-on-surface-variant">kcal net</span>
            </div>
            <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-${statusColor}/10 border border-${statusColor}/20`}>
              <div className={`w-2 h-2 rounded-full bg-${statusColor}`}></div>
              <span className={`font-label-mono text-${statusColor} uppercase`}>{statusLabel}</span>
            </div>
          </div>
          <div className="w-full md:w-auto flex gap-6 md:gap-12 z-10">
            <div>
              <p className="font-label-mono text-on-surface-variant mb-1 uppercase">Intake</p>
              <p className="font-headline-md text-on-surface">{summary.totalCaloriesIn.toLocaleString()}</p>
            </div>
            <div className="w-px bg-outline-variant/50 self-stretch"></div>
            <div>
              <p className="font-label-mono text-on-surface-variant mb-1 uppercase">Burned</p>
              <p className="font-headline-md text-on-surface">{summary.totalCaloriesBurned.toLocaleString()}</p>
            </div>
            <div className="w-px bg-outline-variant/50 self-stretch hidden md:block"></div>
            <div className="hidden md:block">
              <p className="font-label-mono text-on-surface-variant mb-1 uppercase">Target</p>
              <p className="font-headline-md text-on-surface">{summary.targetCalories.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="col-span-1 md:col-span-7 bg-surface-container rounded-xl p-card-inner border border-outline-variant/30 flex flex-col">
          <h3 className="font-label-mono text-on-surface-variant uppercase flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[16px]">pie_chart</span> Macro Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-4 flex-1">
            <div className="bg-surface-container-high/50 rounded-lg p-4 text-center">
              <div className="w-3 h-3 rounded-full bg-tertiary mx-auto mb-2"></div>
              <p className="font-headline-md text-on-surface">{summary.totalProtein}g</p>
              <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">Protein</p>
            </div>
            <div className="bg-surface-container-high/50 rounded-lg p-4 text-center">
              <div className="w-3 h-3 rounded-full bg-surplus-warning mx-auto mb-2"></div>
              <p className="font-headline-md text-on-surface">{summary.totalCarbs}g</p>
              <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">Carbs</p>
            </div>
            <div className="bg-surface-container-high/50 rounded-lg p-4 text-center">
              <div className="w-3 h-3 rounded-full bg-error mx-auto mb-2"></div>
              <p className="font-headline-md text-on-surface">{summary.totalFat}g</p>
              <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">Fat</p>
            </div>
          </div>
        </div>

        {/* Small Widgets */}
        <div className="col-span-1 md:col-span-5 bg-surface-container rounded-xl p-card-inner border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="font-label-mono text-on-surface-variant uppercase mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">egg_alt</span> Protein Goal
            </h3>
            <span className="font-label-mono text-[10px] text-on-surface-variant">{proteinPercent}%</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="font-headline-lg text-on-surface">{summary.totalProtein}</span>
            <span className="font-body-sm text-on-surface-variant mb-1">/ {proteinTarget}g</span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
            <div className="bg-secondary h-2.5 rounded-full transition-all duration-500" style={{ width: `${proteinPercent}%` }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}
