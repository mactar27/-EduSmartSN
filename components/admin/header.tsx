"use client";

import { Bell, Search, Clock, CheckCircle2, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      setNotifications(data.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
    return past.toLocaleDateString('fr-FR');
  };

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
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-2.5 rounded-xl transition-all duration-200 hover:bg-muted text-muted-foreground",
              showNotifications && "bg-primary/10 text-primary"
            )}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-[2rem] shadow-2xl premium-shadow overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-border bg-muted/20 flex justify-between items-center">
                <h3 className="font-black text-sm uppercase tracking-wider">Notifications Réelles</h3>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
                  {notifications.length} Nouvelles
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">Chargement...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">Aucune notification pour le moment.</div>
                ) : (
                  notifications.map((notif, i) => (
                    <div key={i} className="p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          {notif.type.includes("demande") ? (
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                              <Info size={14} />
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                              <CheckCircle2 size={14} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-primary uppercase tracking-tighter mb-0.5">{notif.type}</p>
                          <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{notif.title}</p>
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground font-medium">
                            <Clock size={10} />
                            {getTimeAgo(notif.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-muted/10 border-t border-border">
                <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-border mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">
              {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dakar, Sénégal</p>
          </div>
        </div>
      </div>
    </header>
  );
}
