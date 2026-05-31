"use client";

import { useState, useEffect } from "react";
import exerciseTypesData from "@/data/exercise_types.json";
import type { ExerciseType, ExerciseLogEntry } from "@/types";
import {
  estimateExerciseByMET,
  estimateRunningCalories,
} from "@/lib/exerciseEstimator";
import {
  addExerciseLog,
  getExerciseLogsByDate,
  deleteExerciseLog,
  getLatestWeight,
  getTodayString,
  generateId,
} from "@/lib/store";

const exerciseTypes = exerciseTypesData as ExerciseType[];

const INTENSITY_MAP: Record<number, { label: string; mult: number }> = {
  1: { label: "Low", mult: 0.8 },
  2: { label: "Moderate", mult: 1.0 },
  3: { label: "Vigorous", mult: 1.3 },
};

export default function ExerciseLogPage() {
  const [selectedType, setSelectedType] = useState(exerciseTypes[0]);
  const [duration, setDuration] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [intensity, setIntensity] = useState(2);
  const [todayLogs, setTodayLogs] = useState<ExerciseLogEntry[]>([]);

  const today = getTodayString();
  const userWeight = getLatestWeight() ?? 70;

  useEffect(() => {
    setTodayLogs(getExerciseLogsByDate(today));
  }, [today]);

  const estimatedCalories = (() => {
    const intensityMult = INTENSITY_MAP[intensity].mult;
    if (selectedType.calculation_type === "distance_based" && distance > 0) {
      return Math.round(estimateRunningCalories(userWeight, distance) * intensityMult);
    }
    if (duration > 0) {
      return Math.round(
        estimateExerciseByMET(selectedType.met_value, userWeight, duration) *
          intensityMult
      );
    }
    return 0;
  })();

  const handleSave = () => {
    if (duration <= 0 && distance <= 0) return;

    const entry: ExerciseLogEntry = {
      id: generateId(),
      user_id: "local",
      exercise_type_id: selectedType.id,
      exercise_name: selectedType.name,
      duration_minutes: duration,
      distance_km: distance || undefined,
      intensity: INTENSITY_MAP[intensity].label as "Low" | "Moderate" | "Vigorous",
      estimated_calories_burned: estimatedCalories,
      log_date: today,
      created_at: new Date().toISOString(),
    };

    addExerciseLog(entry);
    setTodayLogs(getExerciseLogsByDate(today));
    setDuration(0);
    setDistance(0);
    setIntensity(2);
  };

  const handleClear = () => {
    setDuration(0);
    setDistance(0);
    setIntensity(2);
    setSelectedType(exerciseTypes[0]);
  };

  const handleDelete = (id: string) => {
    deleteExerciseLog(id);
    setTodayLogs(getExerciseLogsByDate(today));
  };

  return (
    <div className="max-w-[1200px] mx-auto p-gutter md:p-container-padding flex flex-col gap-section-gap pb-32 md:pb-container-padding">
      {/* Header Section */}
      <header>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Log Exercise
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Track your activity and monitor your energy expenditure.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-container-padding">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-2 flex flex-col gap-container-padding">
          <section className="bg-deep-slate rounded-xl p-card-inner shadow-sm border border-outline-variant/20 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary-container/5 rounded-full blur-3xl group-hover:bg-secondary-container/10 transition-colors duration-500 pointer-events-none"></div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">
              Activity Details
            </h3>
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {/* Activity Type Selection */}
              <div>
                <label className="block font-label-mono text-label-mono text-on-surface-variant mb-3">
                  ACTIVITY TYPE
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {exerciseTypes.slice(0, 8).map((type) => (
                    <label key={type.id} className="relative cursor-pointer">
                      <input
                        className="peer sr-only"
                        name="activity"
                        type="radio"
                        value={type.id}
                        checked={selectedType.id === type.id}
                        onChange={() => setSelectedType(type)}
                      />
                      <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-outline-variant/30 bg-surface-container-low peer-checked:bg-charcoal-surface peer-checked:border-secondary hover:bg-surface-container transition-all text-on-surface-variant peer-checked:text-secondary">
                        <span
                          className="material-symbols-outlined text-[28px]"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          {type.icon}
                        </span>
                        <span className="font-body-sm text-body-sm text-center">
                          {type.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metrics Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">
                    DURATION (MINUTES)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">
                        timer
                      </span>
                    </span>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 pl-10 pr-4 text-on-surface font-label-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-shadow shadow-inner"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={duration || ""}
                      onChange={(e) =>
                        setDuration(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">
                    DISTANCE (KM)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">
                        route
                      </span>
                    </span>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 pl-10 pr-4 text-on-surface font-label-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-shadow shadow-inner"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={distance || ""}
                      onChange={(e) =>
                        setDistance(parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Intensity Slider */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block font-label-mono text-label-mono text-on-surface-variant">
                    INTENSITY
                  </label>
                  <span className="font-label-mono text-label-mono text-secondary">
                    {INTENSITY_MAP[intensity].label}
                  </span>
                </div>
                <input
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                  type="range"
                  min="1"
                  max="3"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                />
                <div className="flex justify-between mt-2 font-label-mono text-[10px] text-on-surface-variant/70">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>Vigorous</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-2 border-t border-outline-variant/20 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-muted hover:bg-secondary text-white hover:text-on-secondary font-headline-sm text-[16px] py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    save
                  </span>
                  Save Exercise
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 border border-outline-variant text-blue-muted hover:bg-surface-variant/30 font-headline-sm text-[16px] rounded-lg transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Live Calculation & History */}
        <div className="flex flex-col gap-container-padding">
          {/* Live Calorie Counter */}
          <section className="bg-charcoal-surface/40 backdrop-blur-md rounded-xl p-card-inner border border-outline-variant/30 relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/10 to-transparent pointer-events-none"></div>
            <p className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest mb-2 z-10">
              Estimated Burn
            </p>
            <div className="flex items-baseline gap-2 z-10">
              <span className="font-display-stat text-display-stat text-secondary tabular-nums transition-transform duration-150">
                {estimatedCalories}
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                kcal
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-deficit-success bg-deficit-success/10 px-3 py-1 rounded-full z-10">
              <span className="material-symbols-outlined text-[16px]">
                trending_up
              </span>
              <span className="font-label-mono text-[11px]">
                Based on inputs
              </span>
            </div>
          </section>

          {/* Today's Workouts List */}
          <section className="bg-deep-slate rounded-xl p-card-inner shadow-sm border border-outline-variant/20 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Today&apos;s Workouts
              </h3>
              <span className="font-label-mono text-label-mono text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">
                {todayLogs.length} Entries
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {todayLogs.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm text-center py-8">
                  No workouts logged today yet.
                </p>
              ) : (
                todayLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:border-outline-variant/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded bg-secondary-container/20 flex items-center justify-center text-secondary">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {exerciseTypes.find((t) => t.id === log.exercise_type_id)
                          ?.icon || "fitness_center"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline-sm text-[14px] leading-tight text-on-surface">
                        {log.exercise_name}
                      </h4>
                      <p className="font-label-mono text-[11px] text-on-surface-variant mt-1">
                        {log.duration_minutes} min
                        {log.distance_km
                          ? ` • ${log.distance_km} km`
                          : ""}
                        {" "}• {log.intensity}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-label-mono text-label-mono text-secondary">
                        {log.estimated_calories_burned} kcal
                      </span>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          close
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
