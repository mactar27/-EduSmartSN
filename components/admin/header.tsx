"use client";

import { Bell, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";

export function AdminHeader() {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-8">
      <div className="relative w-96 max-w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher une université, un étudiant..." 
          className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
        </button>

        <div className="h-8 w-px bg-border mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">27 Avril 2026</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dakar, Sénégal</p>
          </div>
        </div>
      </div>
    </header>
  );
}
