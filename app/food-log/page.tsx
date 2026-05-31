"use client";

import { useState, useEffect } from "react";
import { parseFoodInput } from "@/lib/foodParser";
import { estimateFoodCalories } from "@/lib/calorieEstimator";
import {
  addFoodLog,
  getFoodLogsByDate,
  deleteFoodLog,
  getTodayString,
  generateId,
} from "@/lib/store";
import type { FoodLogEntry, ParsedFoodItem, MealTime } from "@/types";

export default function FoodLogPage() {
  const [input, setInput] = useState("");
  const [parsedItems, setParsedItems] = useState<
    (ParsedFoodItem & {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      totalGram: number;
    })[]
  >([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [mealTime, setMealTime] = useState<MealTime>("Lunch");
  const [todayLogs, setTodayLogs] = useState<FoodLogEntry[]>([]);

  const today = getTodayString();

  useEffect(() => {
    setTodayLogs(getFoodLogsByDate(today));
  }, [today]);

  const handleParse = () => {
    if (!input.trim()) return;
    setIsParsing(true);

    setTimeout(() => {
      const items = parseFoodInput(input);
      const enriched = items.map((item) => {
        if (item.matchedFood) {
          const est = estimateFoodCalories(item.matchedFood, item.quantity);
          return { ...item, ...est };
        }
        return { ...item, calories: 0, protein: 0, carbs: 0, fat: 0, totalGram: 0 };
      });
      setParsedItems(enriched);
      setShowPreview(true);
      setIsParsing(false);
    }, 600);
  };

  const handleSave = () => {
    const entries: FoodLogEntry[] = parsedItems
      .filter((item) => item.matchedFood)
      .map((item) => ({
        id: generateId(),
        user_id: "local",
        food_id: item.matchedFood!.id,
        food_name: item.matchedFood!.name,
        quantity: item.quantity,
        serving_unit: item.unit,
        serving_gram: item.matchedFood!.default_serving_gram,
        total_gram: item.totalGram,
        estimated_calories: item.calories,
        estimated_protein: item.protein,
        estimated_carbs: item.carbs,
        estimated_fat: item.fat,
        meal_time: mealTime,
        log_date: today,
        created_at: new Date().toISOString(),
      }));

    entries.forEach((e) => addFoodLog(e));
    setTodayLogs(getFoodLogsByDate(today));
    setParsedItems([]);
    setShowPreview(false);
    setInput("");
  };

  const handleDelete = (id: string) => {
    deleteFoodLog(id);
    setTodayLogs(getFoodLogsByDate(today));
  };

  const totalEntryCalories = parsedItems.reduce((s, i) => s + i.calories, 0);
  const totalLoggedCalories = todayLogs.reduce(
    (s, l) => s + l.estimated_calories,
    0
  );

  return (
    <div className="max-w-[1000px] mx-auto px-gutter md:px-container-padding py-8 pb-32 md:pb-12">
      <header className="mb-8">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
          Log Food
        </h2>
        <p className="text-on-surface-variant font-body-md">
          Tell us what you ate. Our system will parse the details and estimate
          macros.
        </p>
      </header>

      {/* Natural Language Input Section */}
      <section className="mb-section-gap">
        <div className="bg-surface-container rounded-xl p-card-inner shadow-[0_4px_20px_-2px_rgba(11,19,38,0.4)] border border-outline-variant/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary-container"></div>
          <label
            className="flex items-center gap-2 text-on-surface-variant mb-3 font-label-mono text-label-mono uppercase tracking-wider"
            htmlFor="nlp-input"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            Smart Entry
          </label>
          <textarea
            className="w-full bg-surface-container-highest text-primary-fixed-dim rounded-lg p-4 border-none focus:ring-1 focus:ring-secondary/50 outline-none resize-none shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.2)] font-label-mono text-label-mono leading-relaxed transition-all placeholder:text-outline/50"
            id="nlp-input"
            placeholder="e.g., nasi putih 1 piring, tahu goreng 2 potong, telur rebus 1 butir..."
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleParse();
              }
            }}
          />

          {/* Meal Time Selector */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">
              Meal:
            </span>
            {(
              [
                "Breakfast",
                "Lunch",
                "Dinner",
                "Snack",
                "Pre-workout",
                "Post-workout",
              ] as MealTime[]
            ).map((mt) => (
              <button
                key={mt}
                onClick={() => setMealTime(mt)}
                className={`px-3 py-1 rounded-full text-label-mono font-label-mono transition-colors ${
                  mealTime === mt
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {mt}
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleParse}
              disabled={isParsing || !input.trim()}
              className="bg-charcoal-surface hover:bg-surface-bright text-on-surface font-body-sm font-medium py-2 px-6 rounded-lg transition-all duration-200 border border-outline-variant flex items-center gap-2 disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isParsing ? "animate-spin" : ""
                }`}
              >
                {isParsing ? "sync" : "psychology"}
              </span>
              {isParsing ? "Parsing..." : "Analyze Input"}
            </button>
          </div>
        </div>
      </section>

      {/* Parsed Preview Section */}
      {showPreview && parsedItems.length > 0 && (
        <section className="mb-section-gap animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Parsed Items
            </h3>
            <span className="bg-surface-container-highest px-3 py-1 rounded-full text-label-mono font-label-mono text-on-surface-variant border border-outline-variant/30">
              Draft
            </span>
          </div>
          <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/20 shadow-[0_4px_20px_-2px_rgba(11,19,38,0.4)]">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container-high border-b border-outline-variant/30 text-label-mono font-label-mono text-on-surface-variant uppercase tracking-wider">
              <div className="col-span-5">Food Item</div>
              <div className="col-span-2 text-right">Calories</div>
              <div className="col-span-4 flex justify-between text-xs px-4">
                <span className="text-tertiary">P</span>
                <span className="text-surplus-warning">C</span>
                <span className="text-error">F</span>
              </div>
              <div className="col-span-1 text-center">Action</div>
            </div>
            {parsedItems.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:px-6 md:py-4 border-b border-outline-variant/10 items-center hover:bg-surface-container-high/50 transition-colors group"
              >
                <div className="col-span-1 md:col-span-5 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                  <span className="font-body-md text-on-surface font-medium">
                    {item.matchedFood
                      ? item.matchedFood.name.charAt(0).toUpperCase() +
                        item.matchedFood.name.slice(1)
                      : item.foodName}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    {item.quantity} {item.unit}{" "}
                    {item.matchedFood
                      ? `(~${item.totalGram}g)`
                      : "(tidak ditemukan)"}
                  </span>
                </div>
                <div className="col-span-1 md:col-span-2 text-left md:text-right font-label-mono text-on-surface">
                  {item.calories}{" "}
                  <span className="text-xs text-on-surface-variant md:hidden">
                    kcal
                  </span>
                </div>
                <div className="col-span-1 md:col-span-4 flex justify-between items-center bg-surface-container-lowest/50 rounded p-2 md:p-0 md:bg-transparent">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="font-label-mono text-on-surface">
                      {item.protein}g
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-surplus-warning"></div>
                    <span className="font-label-mono text-on-surface">
                      {item.carbs}g
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="font-label-mono text-on-surface">
                      {item.fat}g
                    </span>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center gap-2">
                  <button
                    className="text-on-surface-variant hover:text-error transition-colors"
                    onClick={() => {
                      setParsedItems((prev) =>
                        prev.filter((_, i) => i !== idx)
                      );
                    }}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-high/30 p-4 rounded-xl border border-outline-variant/20">
            <div className="flex items-baseline gap-2">
              <span className="text-on-surface-variant text-body-sm">
                Total Entry:
              </span>
              <span className="font-display-stat text-headline-lg text-primary">
                {totalEntryCalories}
              </span>
              <span className="text-on-surface-variant text-label-mono uppercase">
                kcal
              </span>
            </div>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto bg-emerald-muted hover:bg-secondary text-white hover:text-surface-container-lowest font-body-md font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Save Entry
            </button>
          </div>
        </section>
      )}

      {/* Today's History Section */}
      <section className="mt-section-gap border-t border-outline-variant/20 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">
              history
            </span>
            Today&apos;s Meals
          </h3>
          <div className="text-right">
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest block">
              Total Logged
            </span>
            <span className="font-headline-md text-primary">
              {totalLoggedCalories.toLocaleString()} kcal
            </span>
          </div>
        </div>

        {todayLogs.length === 0 ? (
          <div className="bg-surface-container-low rounded-xl p-card-inner border border-dashed border-outline-variant/50 flex flex-col items-center justify-center min-h-[140px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] mb-2">
              restaurant
            </span>
            <span className="font-body-sm">
              No meals logged yet today. Start by entering food above!
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/10 shadow-[0_4px_20px_-2px_rgba(11,19,38,0.4)] hover:-translate-y-1 transition-transform duration-300 cursor-default group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-surface-container-highest text-primary-fixed-dim text-[10px] font-label-mono uppercase px-2 py-1 rounded tracking-widest">
                      {log.meal_time}
                    </span>
                    <h4 className="font-body-lg text-on-surface mt-2 capitalize">
                      {log.food_name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-mono text-on-surface bg-surface-container-lowest px-2 py-1 rounded">
                      {log.estimated_calories} cal
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
                <div className="flex gap-4 text-body-sm text-on-surface-variant border-t border-outline-variant/10 pt-3 mt-auto">
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
                    {log.estimated_protein}g
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-surplus-warning"></div>
                    {log.estimated_carbs}g
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-error"></div>
                    {log.estimated_fat}g
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
