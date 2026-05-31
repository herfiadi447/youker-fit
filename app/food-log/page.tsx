"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { parseFoodInput } from "@/lib/foodParser";
import { estimateFoodCalories } from "@/lib/calorieEstimator";
import type { FoodLogEntry } from "@/types";

export default function FoodLogPage() {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [mealTime, setMealTime] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack">("Breakfast");
  const [preview, setPreview] = useState<any[]>([]);
  const [history, setHistory] = useState<FoodLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUserId(user.id);

      const { data } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", todayStr)
        .order("created_at", { ascending: false });

      if (data) setHistory(data as FoodLogEntry[]);
      setLoading(false);
    }
    loadData();
  }, [supabase, todayStr]);

  const handleParse = () => {
    if (!query.trim()) return;
    const parsedItems = parseFoodInput(query);
    const estimatedItems = parsedItems
      .filter((item) => item.matchedFood)
      .map((item) => {
        const est = estimateFoodCalories(item.matchedFood!, item.quantity);
        return {
          name: item.foodName,
          quantity: item.quantity,
          servingUnit: item.unit,
          servingGram: item.matchedFood!.default_serving_gram,
          ...est,
        };
      });
    setPreview(estimatedItems);
  };

  const handleSave = async () => {
    if (preview.length === 0 || !userId) return;

    const newLogs = preview.map((item) => ({
      user_id: userId,
      food_name: item.name,
      quantity: item.quantity,
      serving_unit: item.servingUnit,
      serving_gram: item.servingGram,
      total_gram: item.totalGram,
      estimated_calories: item.calories,
      estimated_protein: item.protein,
      estimated_carbs: item.carbs,
      estimated_fat: item.fat,
      meal_time: mealTime,
      log_date: todayStr,
    }));

    const { data, error } = await supabase.from("food_logs").insert(newLogs).select();

    if (!error && data) {
      setHistory([...(data as FoodLogEntry[]), ...history]);
      setPreview([]);
      setQuery("");
    } else {
      alert("Error saving: " + error?.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-on-surface-variant animate-pulse">Loading data...</div>;

  return (
    <div className="max-w-[800px] mx-auto p-container-padding flex flex-col gap-section-gap pb-24">
      <header>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">Nutrition Log</h2>
        <p className="text-on-surface-variant mt-2">What did you eat today?</p>
      </header>

      <section className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/30 flex flex-col gap-4">
        <div>
          <label className="block text-label-mono text-on-surface-variant mb-2">MEAL TIME</label>
          <select
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value as any)}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface"
          >
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-label-mono text-on-surface-variant mb-2">WHAT DID YOU EAT?</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., nasi putih 1 piring, telur rebus 2 butir"
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface h-32 resize-none"
          />
        </div>
        <button onClick={handleParse} className="bg-secondary text-on-secondary py-3 rounded-lg w-full font-bold uppercase tracking-wider">
          Calculate Calories
        </button>
      </section>

      {preview.length > 0 && (
        <section className="bg-surface-container-high rounded-xl p-card-inner border border-primary/30">
          <h3 className="font-headline-sm text-primary mb-4">Preview</h3>
          <ul className="flex flex-col gap-3 mb-6">
            {preview.map((item, i) => (
              <li key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <div>
                  <p className="font-medium text-on-surface capitalize">{item.name}</p>
                  <p className="text-[12px] text-on-surface-variant">{item.quantity} {item.servingUnit} ({item.totalGram}g)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-surplus-warning">+{item.calories} kcal</p>
                  <p className="text-[10px] text-on-surface-variant">P:{item.protein}g C:{item.carbs}g F:{item.fat}g</p>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3 rounded-lg font-bold">
            Save to Log
          </button>
        </section>
      )}

      <section className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/30">
        <h3 className="font-label-mono text-on-surface-variant uppercase mb-4">Today's History</h3>
        {history.length === 0 ? (
          <p className="text-on-surface-variant text-center py-4">No food logged yet today.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((log) => (
              <li key={log.id} className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                <div>
                  <p className="font-medium text-on-surface capitalize">{log.food_name}</p>
                  <p className="text-[12px] text-on-surface-variant">{log.meal_time} • {log.quantity} {log.serving_unit}</p>
                </div>
                <span className="font-bold text-surplus-warning">+{log.estimated_calories} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
