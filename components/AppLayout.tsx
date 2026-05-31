"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      <main className="flex-1 md:ml-64 h-full overflow-y-auto pt-20 md:pt-0 bg-surface">
        {children}
      </main>
    </div>
  );
}
