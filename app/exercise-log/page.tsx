"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { estimateExerciseByMET, estimateRunningCalories } from "@/lib/exerciseEstimator";
import exerciseTypesRaw from "@/data/exercise_types.json";
import type { ExerciseLogEntry } from "@/types";

const exerciseTypes = exerciseTypesRaw as any[];

export default function ExerciseLogPage() {
  const supabase = createClient();
  const [selectedActivity, setSelectedActivity] = useState<string>("lari");
  const [duration, setDuration] = useState<number>(30);
  const [distance, setDistance] = useState<number>(0);
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");
  
  const [estimatedBurn, setEstimatedBurn] = useState(0);
  const [history, setHistory] = useState<ExerciseLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userWeight, setUserWeight] = useState<number>(70);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUserId(user.id);

      // Fetch user profile weight
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_weight")
        .eq("id", user.id)
        .single();
      
      if (profile?.current_weight) {
        setUserWeight(profile.current_weight);
      }

      // Fetch exercise logs
      const { data } = await supabase
        .from("exercise_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", todayStr)
        .order("created_at", { ascending: false });

      if (data) setHistory(data as ExerciseLogEntry[]);
      setLoading(false);
    }
    loadData();
  }, [supabase, todayStr]);

  // Recalculate estimated burn whenever inputs change
  useEffect(() => {
    const activity = exerciseTypes.find((t) => t.id === selectedActivity);
    if (!activity) return;

    let result = 0;
    if (activity.calculation_type === "distance_based") {
      result = estimateRunningCalories(userWeight, distance);
    } else {
      let met = activity.met_value || 5;
      if (intensity === "low") met *= 0.8;
      if (intensity === "high") met *= 1.2;
      result = estimateExerciseByMET(met, userWeight, duration);
    }
    setEstimatedBurn(result);
  }, [selectedActivity, duration, distance, intensity, userWeight]);

  const handleSave = async () => {
    if (!userId) return;
    const activity = exerciseTypes.find((t) => t.id === selectedActivity);
    if (!activity) return;

    const newLog = {
      user_id: userId,
      exercise_name: activity.name,
      duration_minutes: duration,
      distance_km: distance || null,
      intensity,
      estimated_calories_burned: estimatedBurn,
      log_date: todayStr,
    };

    const { data, error } = await supabase.from("exercise_logs").insert([newLog]).select();

    if (!error && data) {
      setHistory([...(data as ExerciseLogEntry[]), ...history]);
      // Reset form defaults
      setDuration(30);
      setDistance(0);
      setIntensity("medium");
    } else {
      alert("Error saving: " + error?.message);
    }
  };

  const currentActivityObj = exerciseTypes.find((t) => t.id === selectedActivity);
  const showDistance = currentActivityObj?.calculationType === "distance_based";

  if (loading) return <div className="p-8 text-center text-on-surface-variant animate-pulse">Loading data...</div>;

  return (
    <div className="max-w-[800px] mx-auto p-container-padding flex flex-col gap-section-gap pb-24">
      <header>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">Workout Log</h2>
        <p className="text-on-surface-variant mt-2">Track your exercises and calories burned.</p>
      </header>

      <section className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/30 flex flex-col gap-4">
        <div>
          <label className="block text-label-mono text-on-surface-variant mb-2">ACTIVITY TYPE</label>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface"
          >
            {exerciseTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-label-mono text-on-surface-variant mb-2">DURATION (MINUTES)</label>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface"
            />
          </div>
          {showDistance && (
            <div>
              <label className="block text-label-mono text-on-surface-variant mb-2">DISTANCE (KM)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-label-mono text-on-surface-variant mb-2">INTENSITY</label>
          <div className="flex gap-2">
            {["low", "medium", "high"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setIntensity(lvl as any)}
                className={`flex-1 py-2 rounded-lg font-label-mono uppercase transition-colors ${
                  intensity === lvl
                    ? "bg-primary text-on-primary font-bold"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-deficit-success/10 border border-deficit-success/30 rounded-lg p-4 mt-2 flex justify-between items-center">
          <div>
            <p className="font-label-mono text-deficit-success uppercase">Estimated Burn</p>
            <p className="font-headline-lg text-on-surface">{estimatedBurn} <span className="text-body-sm text-on-surface-variant">kcal</span></p>
          </div>
          <button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-on-primary py-2 px-6 rounded-lg font-bold">
            Log Workout
          </button>
        </div>
      </section>

      <section className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/30">
        <h3 className="font-label-mono text-on-surface-variant uppercase mb-4">Today's History</h3>
        {history.length === 0 ? (
          <p className="text-on-surface-variant text-center py-4">No exercises logged yet today.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((log) => (
              <li key={log.id} className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                <div>
                  <p className="font-medium text-on-surface capitalize">{log.exercise_name}</p>
                  <p className="text-[12px] text-on-surface-variant">{log.duration_minutes} min • {log.intensity} intensity</p>
                </div>
                <span className="font-bold text-deficit-success">-{log.estimated_calories_burned} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
