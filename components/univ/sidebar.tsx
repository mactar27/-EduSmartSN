"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Calendar,
  Wallet,
  Settings,
  FileSpreadsheet,
  TrendingUp,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";


const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/univ/dashboard" },
  { icon: GraduationCap, label: "Élèves", href: "/univ/etudiants" },
  { icon: BookOpen, label: "Pédagogie LMD", href: "/univ/pedagogie" },
  { icon: FileSpreadsheet, label: "Saisie des Notes", href: "/univ/notes" },
  { icon: Users, label: "Professeurs", href: "/univ/professors" },
  { icon: Calendar, label: "Emploi du temps", href: "/univ/schedule" },
  { icon: Wallet, label: "Régie Financière", href: "/univ/regie-financiere" },
  { icon: TrendingUp, label: "Recouvrement", href: "/univ/recouvrement" },
  { icon: Settings, label: "Configuration", href: "/univ/settings" },
];

export function UnivSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    fetch('/api/univ/stats')
      .then(res => res.json())
      .then(data => setTenant(data.tenant));
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-[#1a2e26] text-white border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-xl">E</div>
                <span className="text-xl font-bold tracking-tight">EduSmart <span className="text-emerald-400">SN</span></span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                   "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                   pathname === item.href 
                     ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/20" 
                     : "text-emerald-100/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-white" : "group-hover:text-emerald-400"
                )} 
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            <div className="p-4 rounded-2xl flex items-center gap-3 bg-white/5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border border-white/10 bg-white/10 text-white">
                {tenant?.name?.substring(0, 2).toUpperCase() || 'UN'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">{tenant?.name || 'Université'}</p>
                <p className="text-xs text-emerald-400/60 truncate italic font-medium uppercase tracking-wider">Plateforme Souveraine</p>
              </div>
            </div>
            <Link href="/login" className="flex items-center gap-4 px-4 py-3 rounded-xl text-rose-300 hover:bg-rose-500/10 transition-all font-bold">
              <LogOut size={20} />
              Déconnexion
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
