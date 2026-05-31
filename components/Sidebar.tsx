"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Overview" },
  { href: "/food-log", icon: "restaurant", label: "Nutrition" },
  { href: "/exercise-log", icon: "fitness_center", label: "Workouts" },
  { href: "/profile", icon: "settings", label: "Settings" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
    <nav className={`bg-surface-container-low border-r border-outline-variant h-screen w-64 fixed left-0 top-0 flex flex-col py-6 px-4 gap-base z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header Brand */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-primary icon-fill">
            account_circle
          </span>
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-semibold text-on-surface tracking-tight">
            Youker Fit
          </h1>
          <p className="font-label-mono text-label-mono text-primary">
            Premium Member
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg flex items-center gap-3 px-3 py-2.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? "icon-fill" : ""}`}
              >
                {item.icon}
              </span>
              <span className="font-label-mono text-label-mono uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        href="/food-log"
        className="bg-secondary text-on-secondary font-label-mono text-label-mono font-bold uppercase rounded-lg py-3 px-4 w-full flex justify-center items-center gap-2 hover:opacity-90 transition-opacity mb-4"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Log New Entry
      </Link>

      {/* Footer Links */}
      <div className="mt-auto border-t border-outline-variant/50 pt-4 flex flex-col gap-1">
        <button
          onClick={() => setShowHelp(true)}
          className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg flex items-center gap-3 px-3 py-2 transition-all duration-200 cursor-pointer w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          <span className="font-label-mono text-label-mono uppercase">
            Help
          </span>
        </button>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="text-on-surface-variant hover:bg-surface-container-high hover:text-error rounded-lg flex items-center gap-3 px-3 py-2 transition-all duration-200 cursor-pointer w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-label-mono text-label-mono uppercase">
            Logout
          </span>
        </button>
      </div>
    </nav>

    {/* Custom Modals */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 transition-opacity" onClick={() => setShowLogoutConfirm(false)}>
        <div className="bg-surface-container rounded-2xl p-6 max-w-sm w-full border border-outline-variant/30 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-error icon-fill text-2xl">logout</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Sign Out</h3>
          <p className="font-body-md text-on-surface-variant mb-8">Are you sure you want to log out of your account?</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowLogoutConfirm(false)} className="px-5 py-2.5 rounded-lg font-label-mono uppercase tracking-wide text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
            <button onClick={async () => {
              const { createClient } = await import("@/utils/supabase/client");
              const supabase = createClient();
              await supabase.auth.signOut();
              localStorage.clear();
              window.location.href = "/login";
            }} className="px-5 py-2.5 rounded-lg font-label-mono uppercase tracking-wide bg-error text-on-error hover:bg-error/90 transition-colors">Sign Out</button>
          </div>
        </div>
      </div>
    )}

    {showHelp && (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 transition-opacity" onClick={() => setShowHelp(false)}>
        <div className="bg-surface-container rounded-2xl p-6 max-w-sm w-full border border-outline-variant/30 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-secondary icon-fill text-2xl">help</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Need Help?</h3>
          <p className="font-body-md text-on-surface-variant mb-8">If you encounter any issues or have questions, please email us at <strong className="text-secondary">support@youkerfit.com</strong>.</p>
          <div className="flex justify-end">
            <button onClick={() => setShowHelp(false)} className="px-5 py-2.5 rounded-lg font-label-mono uppercase tracking-wide bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors">Got it</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
