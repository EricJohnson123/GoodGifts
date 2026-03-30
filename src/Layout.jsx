import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Gift } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <style>{`
        :root {
          --color-cream: #FFFBF0;
          --color-cream-dark: #FFF5DC;
          --color-red: #D94040;
          --color-red-dark: #B83030;
          --color-red-light: #FFE8E8;
        }
      `}</style>
      
      <header className="border-b border-[#F0E6CC] bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("Quiz")} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#D94040] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Good<span className="text-[#D94040]">Gifts</span>
            </span>
          </Link>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
}
