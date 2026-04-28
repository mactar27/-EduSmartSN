"use client"

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Users, 
  Wallet, 
  CheckCircle2,
  AlertCircle,
  QrCode,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnivDashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [tenantId]);

  const fetchData = async () => {
    try {
      const url = `/api/univ/stats${tenantId ? `?tenantId=${tenantId}` : ''}`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch univ stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Chargement des données réelles...</div>;
  if (!data?.tenant) return <div className="p-10 text-center text-red-500">Aucun établissement trouvé dans la base.</div>;

  const stats = [
    { label: "Élèves Inscrits", value: data.stats.students.toLocaleString(), icon: Users, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Validation Dossiers", value: data.stats.enrollmentRate, icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Recettes Globales", value: `${data.stats.totalRevenue.toLocaleString()} F`, icon: Wallet, bg: "bg-amber-50", color: "text-amber-600" },
    { label: "Alertes Système", value: "0", icon: AlertCircle, bg: "bg-rose-50", color: "text-rose-600" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{data.tenant.name}</h2>
            <p className="text-muted-foreground mt-1">Dashboard Officiel | Portail de Gestion</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 font-bold h-12">
            <QrCode size={20} />
            Scanner Carte
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-12 shadow-lg shadow-emerald-200 transition-transform hover:scale-105">
            Nouvelle Inscription
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className={`p-3 rounded-xl w-fit ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
              <stat.icon size={24} />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Wallet className="text-primary" />
            Répartition des Paiements Réels
          </h3>
          <div className="space-y-4">
            {data.stats.paymentsByMethod.length === 0 ? (
              <p className="text-muted-foreground italic text-center py-4">Aucune transaction enregistrée.</p>
            ) : (
              data.stats.paymentsByMethod.map((payment: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      payment.method === 'WAVE' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {payment.method[0]}
                    </div>
                    <div>
                      <p className="font-bold">{payment.method}</p>
                      <p className="text-xs text-muted-foreground">Transactions validées</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">{payment.total.toLocaleString()} FCFA</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" />
            Activités Pédagogiques
          </h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 border border-border/50 rounded-xl hover:border-primary transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 animate-pulse" />
              <div>
                <p className="font-bold">Inscriptions de l'Année Académique</p>
                <p className="text-sm text-muted-foreground">En cours de traitement dans votre base de données.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-border/50 rounded-xl opacity-60">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
              <div>
                <p className="font-bold">Saisie des Notes LMD</p>
                <p className="text-sm text-muted-foreground italic">Module prêt pour l'intégration des fichiers Excel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
