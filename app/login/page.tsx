"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/dashboard";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="max-w-md w-full bg-surface-container rounded-2xl p-8 border border-outline-variant/30 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl icon-fill">
              fitness_center
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2">
            Sign in to start tracking your fitness journey.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg font-body-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">
              EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-mono text-label-mono font-bold uppercase py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            {loading && (
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
            )}
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-body-sm text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
