"use client"

import { useEffect, useState } from "react";
import { 
  School, 
  Users, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  Plus,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [demoRequests, setDemoRequests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, demoRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/demo-requests')
      ]);
      const statsData = await statsRes.json();
      const demoData = await demoRes.json();
      
      setStats(statsData);
      setDemoRequests(demoData.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Voulez-vous vraiment approuver cet établissement ?")) return;

    try {
      const res = await fetch(`/api/admin/demo-requests/${id}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        alert("Établissement approuvé ! Un e-mail de bienvenue a été envoyé.");
        fetchData();
      } else {
        alert("Erreur lors de l'approbation.");
      }
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  const statCards = [
    { label: "Universités", value: stats?.total_etablissements || "0", icon: School, trend: "+2 ce mois", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Étudiants Total", value: stats?.total_etudiants || "0", icon: Users, trend: "+12%", color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Revenus (FCFA)", value: `${(stats?.paiements_mois || 0).toLocaleString()} F`, icon: Wallet, trend: "+8.4%", color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Demandes Démo", value: demoRequests.length.toString(), icon: Clock, trend: "En attente", color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord Global</h2>
          <p className="text-muted-foreground mt-1">Supervision réelle d'EduSmart SN.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2 shadow-lg shadow-primary/20">
          <Plus size={20} />
          Ajouter manuellement
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-bl-full translate-x-12 -translate-y-12 transition-transform group-hover:translate-x-10 group-hover:-translate-y-10`} />
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                {stat.trend}
                <ArrowUpRight size={12} />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-primary" />
              Demandes de Démo en Attente
            </h3>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
              {demoRequests.length} nouvelles
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="pb-4 font-bold">Établissement</th>
                  <th className="pb-4 font-bold">Contact</th>
                  <th className="pb-4 font-bold">Email / Téléphone</th>
                  <th className="pb-4 font-bold">Date</th>
                  <th className="pb-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {demoRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-muted-foreground italic">
                      Aucune demande en attente.
                    </td>
                  </tr>
                ) : (
                  demoRequests.map((demo) => (
                    <tr key={demo.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-foreground">{demo.etablissementName}</p>
                        <p className="text-xs text-muted-foreground">{demo.message?.substring(0, 50)}...</p>
                      </td>
                      <td className="py-4 font-medium">{demo.contactName}</td>
                      <td className="py-4 text-sm">
                        <p className="text-foreground">{demo.email}</p>
                        <p className="text-muted-foreground text-xs">{demo.phone}</p>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {new Date(demo.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 text-right">
                        <Button 
                          onClick={() => handleApprove(demo.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-1.5 h-auto text-xs font-bold gap-1.5 shadow-sm"
                        >
                          <CheckCircle size={14} />
                          Approuver
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
