"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Overview" },
  { href: "/food-log", icon: "restaurant", label: "Nutrition" },
  { href: "/exercise-log", icon: "fitness_center", label: "Workouts" },
  { href: "/profile", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface-container-low border-r border-outline-variant h-screen w-64 fixed left-0 top-0 flex flex-col py-6 px-4 gap-base hidden md:flex z-50">
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
          onClick={() => alert("Jika butuh bantuan, email ke: support@youkerfit.com")}
          className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg flex items-center gap-3 px-3 py-2 transition-all duration-200 cursor-pointer w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          <span className="font-label-mono text-label-mono uppercase">
            Help
          </span>
        </button>
        <button
          onClick={() => {
            if (confirm("Yakin ingin keluar? Semua log sesi ini akan dihapus (selama belum tersambung ke database).")) {
              localStorage.clear();
              window.location.href = "/";
            }
          }}
          className="text-on-surface-variant hover:bg-surface-container-high hover:text-error rounded-lg flex items-center gap-3 px-3 py-2 transition-all duration-200 cursor-pointer w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-label-mono text-label-mono uppercase">
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}
