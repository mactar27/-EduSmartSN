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
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";


const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/univ/dashboard" },
  { icon: GraduationCap, label: "Étudiants", href: "/univ/etudiants" },
  { icon: Users, label: "Professeurs", href: "/univ/professors" },
  { icon: BookOpen, label: "Cours & LMD", href: "/univ/courses" },
  { icon: Calendar, label: "Emploi du temps", href: "/univ/schedule" },
  { icon: Wallet, label: "Finances", href: "/univ/finance" },
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

  const primaryColor = tenant?.primaryColor || '#059669';

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={tenant?.logoUrl || "/logo.png"}
                alt="University Logo"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
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
                     ? "text-white shadow-md shadow-emerald-200" 
                     : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={pathname === item.href ? { backgroundColor: primaryColor } : {}}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-white" : "group-hover:text-primary"
                )} 
                style={pathname !== item.href ? { color: primaryColor } : {}}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border space-y-4">
            <div className="p-4 rounded-2xl flex items-center gap-3" style={{ backgroundColor: primaryColor + '10' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border" style={{ backgroundColor: primaryColor, color: 'white', borderColor: primaryColor }}>
                {tenant?.name?.substring(0, 2).toUpperCase() || 'UN'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: primaryColor }}>{tenant?.name || 'Université'}</p>
                <p className="text-xs opacity-60 truncate italic">Univ Admin</p>
              </div>
            </div>
            <Link href="/login" className="flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold">
              <LogOut size={20} />
              Déconnexion
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
