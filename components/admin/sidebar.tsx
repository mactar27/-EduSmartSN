"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { 
  LayoutDashboard, 
  School, 
  Users, 
  CreditCard, 
  Settings, 
  ShieldAlert,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/admin/dashboard" },
  { icon: School, label: "Établissements", href: "/admin/tenants" },
  { icon: Users, label: "Utilisateurs", href: "/admin/users" },
  { icon: CreditCard, label: "Commissions", href: "/admin/payments" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
                src="/logo.png"
                alt="EduSmart SN Logo"
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
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-primary-foreground" : "group-hover:text-primary"
                )} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border space-y-4">
            <div className="bg-muted/50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Admin Global</p>
                <p className="text-xs text-muted-foreground truncate">admin@edusmart.sn</p>
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
