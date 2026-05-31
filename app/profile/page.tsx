"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  calculateBMR,
  calculateTDEE,
  calculateDailyCalorieTarget,
  calculateProteinTarget,
} from "@/lib/profileCalculations";
import type { UserProfile, ActivityLevel, FitnessGoal } from "@/types";

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "lightly_active", label: "Lightly Active (1-3 days/week)" },
  { value: "moderately_active", label: "Moderately Active (3-5 days/week)" },
  { value: "very_active", label: "Very Active (6-7 days/week)" },
  { value: "extra_active", label: "Extra Active (very intense)" },
];

const GOALS: { value: FitnessGoal; label: string }[] = [
  { value: "fat_loss_light", label: "Fat Loss (Ringan: -300 kcal)" },
  { value: "fat_loss_moderate", label: "Fat Loss (Sedang: -500 kcal)" },
  { value: "fat_loss_aggressive", label: "Fat Loss (Agresif: -700 kcal)" },
  { value: "maintenance", label: "Maintenance" },
  { value: "muscle_gain", label: "Muscle Gain (+250 kcal)" },
  { value: "general_health", label: "General Health" },
];

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "",
    age: 25,
    gender: "male",
    height_cm: 170,
    start_weight: 70,
    current_weight: 70,
    target_weight: 65,
    activity_level: "moderately_active",
    goal: "fat_loss_moderate",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setProfile(data as UserProfile);
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const bmr = calculateBMR(
    profile.gender || "male",
    profile.current_weight || 70,
    profile.height_cm || 170,
    profile.age || 25
  );
  const tdee = calculateTDEE(bmr, profile.activity_level || "moderately_active");
  const dailyCalorieTarget = calculateDailyCalorieTarget(
    tdee,
    profile.goal || "fat_loss_moderate"
  );
  const dailyProteinTarget = calculateProteinTarget(
    profile.current_weight || 70,
    profile.goal || "fat_loss_moderate"
  );

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const fullProfile = {
      id: userId,
      name: profile.name || "User",
      age: profile.age || 25,
      gender: profile.gender || "male",
      height_cm: profile.height_cm || 170,
      start_weight: profile.start_weight || 70,
      current_weight: profile.current_weight || 70,
      target_weight: profile.target_weight || 65,
      activity_level: profile.activity_level || "moderately_active",
      goal: profile.goal || "fat_loss_moderate",
      bmr,
      tdee,
      daily_calorie_target: dailyCalorieTarget,
      daily_protein_target: dailyProteinTarget,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(fullProfile);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Error saving profile: " + error.message);
    }
  };

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface font-label-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-shadow shadow-inner";

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-label-mono animate-pulse">Loading profile data...</div>;
  }

  return (
    <div className="max-w-[800px] mx-auto p-gutter md:p-container-padding flex flex-col gap-section-gap pb-32 md:pb-container-padding">
      <header>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Profile & Target
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Set up your body data and fitness goals.
        </p>
      </header>

      <section className="bg-deep-slate rounded-xl p-card-inner shadow-sm border border-outline-variant/20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary-container/5 rounded-full blur-3xl pointer-events-none"></div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">Body Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">NAME</label>
            <input className={inputClass} type="text" value={profile.name || ""} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" />
          </div>
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">AGE</label>
            <input className={inputClass} type="number" min={10} max={100} value={profile.age || ""} onChange={(e) => setProfile((p) => ({ ...p, age: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">GENDER</label>
            <select className={inputClass} value={profile.gender || "male"} onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value as "male" | "female" }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">HEIGHT (CM)</label>
            <input className={inputClass} type="number" min={100} max={250} value={profile.height_cm || ""} onChange={(e) => setProfile((p) => ({ ...p, height_cm: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">CURRENT WEIGHT (KG)</label>
            <input className={inputClass} type="number" min={30} max={300} step={0.1} value={profile.current_weight || ""} onChange={(e) => setProfile((p) => ({ ...p, current_weight: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">TARGET WEIGHT (KG)</label>
            <input className={inputClass} type="number" min={30} max={300} step={0.1} value={profile.target_weight || ""} onChange={(e) => setProfile((p) => ({ ...p, target_weight: parseFloat(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">ACTIVITY LEVEL</label>
            <select className={inputClass} value={profile.activity_level || "moderately_active"} onChange={(e) => setProfile((p) => ({ ...p, activity_level: e.target.value as ActivityLevel }))}>
              {ACTIVITY_LEVELS.map((al) => (<option key={al.value} value={al.value}>{al.label}</option>))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">FITNESS GOAL</label>
            <select className={inputClass} value={profile.goal || "fat_loss_moderate"} onChange={(e) => setProfile((p) => ({ ...p, goal: e.target.value as FitnessGoal }))}>
              {GOALS.map((g) => (<option key={g.value} value={g.value}>{g.label}</option>))}
            </select>
          </div>
        </div>
      </section>

      {/* Calculated Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        <div className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/30 text-center">
          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2">BMR</p>
          <p className="font-headline-md text-headline-md text-on-surface">{bmr}</p>
        </div>
        <div className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/30 text-center">
          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2">TDEE</p>
          <p className="font-headline-md text-headline-md text-on-surface">{tdee}</p>
        </div>
        <div className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/30 text-center">
          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2">Target Cal</p>
          <p className="font-headline-md text-headline-md text-secondary">{dailyCalorieTarget}</p>
        </div>
        <div className="bg-surface-container rounded-xl p-card-inner border border-outline-variant/30 text-center">
          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2">Target Protein</p>
          <p className="font-headline-md text-headline-md text-tertiary">{dailyProteinTarget}</p>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-emerald-muted hover:bg-secondary text-white font-headline-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined icon-fill">{saved ? "check" : "save"}</span>
        {saving ? "Saving..." : saved ? "Saved!" : "Save Profile to Cloud"}
      </button>
    </div>
  );
}
