"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

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
        setSuccessMsg("Registration successful! Please check your email to verify your account, then sign in.");
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
          <div className="mb-4 p-4 bg-error/10 border border-error/30 text-error rounded-lg font-body-sm text-center flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-4 bg-deficit-success/10 border border-deficit-success/30 text-deficit-success rounded-lg font-body-sm text-center flex flex-col items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
            {successMsg}
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
            className={`w-full font-label-mono text-label-mono font-bold uppercase py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
              isLogin 
                ? "bg-primary hover:bg-primary/90 text-on-primary" 
                : "bg-tertiary hover:bg-tertiary/90 text-on-primary"
            }`}
          >
            {loading && (
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
            )}
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-outline-variant/30">
          <p className="text-on-surface-variant font-body-sm mb-3">
            {isLogin ? "New to Youker Fit?" : "Already a member?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccessMsg(null);
            }}
            className={`font-label-mono uppercase tracking-wider px-6 py-2 rounded-full border-2 transition-all duration-300 ${
              isLogin
                ? "border-tertiary text-tertiary hover:bg-tertiary/10"
                : "border-primary text-primary hover:bg-primary/10"
            }`}
          >
            {isLogin
              ? "Create an Account"
              : "Sign In Here"}
          </button>
        </div>
      </div>
    </div>
  );
}
