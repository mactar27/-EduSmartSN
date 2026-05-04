"use client"

import { Bell, Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function UnivHeader() {
  return (
    <header className="h-20 border-b border-white/5 bg-[#1a2e26]/80 backdrop-blur-md sticky top-0 z-30 px-6 md:px-8 flex items-center justify-between text-white">
      <div className="relative w-full max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-100/40" size={20} />
        <Input 
          className="pl-10 h-11 bg-white/5 border-none rounded-xl text-white placeholder:text-emerald-100/20" 
          placeholder="Rechercher un élève, un cours..." 
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="text-right hidden sm:block mr-2">
          <p className="text-xs text-emerald-400/60 font-bold uppercase tracking-widest">28 Avril 2026</p>
          <p className="text-sm font-bold text-white">Dakar, Sénégal</p>
        </div>
        
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-white/5 text-emerald-100/60 hover:text-white">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#1a2e26]"></span>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 text-emerald-100/60 hover:text-white">
          <Settings size={22} />
        </Button>
      </div>
    </header>
  )
}
