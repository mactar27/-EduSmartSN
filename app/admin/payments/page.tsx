"use client"

import { useEffect, useState } from "react";
import { 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminPayments() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch of manual payment requests
    setSubscriptions([
      { id: "SUB-001", tenant: "UAM", amount: 150000, duration: "3 Mois", status: "PENDING", date: "2026-05-04", contact: "+221 77 123 45 67" },
      { id: "SUB-002", tenant: "Espoir BS", amount: 500000, duration: "1 An", status: "PAID", date: "2026-05-01", contact: "+221 70 987 65 43" },
      { id: "SUB-003", tenant: "UAM", amount: 50000, duration: "1 Mois", status: "PAID", date: "2026-04-28", contact: "+221 76 555 44 33" },
    ]);
    setIsLoading(false);
  }, []);

  const handleConfirm = (id: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'PAID' } : sub
    ));
    toast.success("Paiement confirmé !", {
      description: `L'accès pour l'abonnement ${id} a été activé.`,
    });
  };

  const showDetails = (sub: any) => {
    toast.info(`Détails: ${sub.tenant}`, {
      description: `Montant: ${sub.amount.toLocaleString()} F | Contact: ${sub.contact}`,
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Abonnements & Paiements Directs</h2>
          <p className="text-muted-foreground mt-1">Gérez les paiements directs reçus sur votre numéro et validez les accès.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <CheckCircle2 size={20} />
          Valider un Paiement Manuel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-[2rem] shadow-xl premium-shadow glass border-b-4 border-b-primary">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">Total Recettes</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Recettes Directes</p>
            <h3 className="text-2xl font-black mt-1">1.250.000 F</h3>
          </div>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-[2rem] shadow-xl premium-shadow glass border-b-4 border-b-amber-500">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <Clock size={24} />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">À Valider</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">En attente de confirmation</p>
            <h3 className="text-2xl font-black mt-1">150.000 F</h3>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-[2rem] shadow-xl premium-shadow glass border-b-4 border-b-indigo-500">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Abonnements Actifs</p>
            <h3 className="text-2xl font-black mt-1">12 Établissements</h3>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl premium-shadow">
        <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/10">
          <div>
            <h3 className="font-bold text-xl">Historique des Paiements Directs</h3>
            <p className="text-sm text-muted-foreground">Liste des transactions reçues par téléphone à confirmer.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input className="pl-10 h-11 bg-background border-border rounded-xl" placeholder="Rechercher par université..." />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/5">
                <th className="px-8 py-5 font-black">Réf / Date</th>
                <th className="px-8 py-5 font-black">Université</th>
                <th className="px-8 py-5 font-black">Contact</th>
                <th className="px-8 py-5 font-black">Montant / Durée</th>
                <th className="px-8 py-5 font-black">Statut</th>
                <th className="px-8 py-5 text-right font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.map((sub, i) => (
                <tr key={i} className="group hover:bg-muted/40 transition-all">
                  <td className="px-8 py-6">
                    <p className="font-bold text-sm text-foreground">{sub.id}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{new Date(sub.date).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-xs text-primary">
                        {sub.tenant.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm">{sub.tenant}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-muted-foreground">
                    {sub.contact}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-foreground">{sub.amount.toLocaleString()} F</p>
                    <p className="text-[10px] font-bold text-primary uppercase">{sub.duration}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {sub.status === 'PAID' ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 size={12} /> Confirmé
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Clock size={12} /> En attente
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {sub.status === 'PENDING' ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleConfirm(sub.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                      >
                        Confirmer Reçu
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => showDetails(sub)}
                        className="rounded-lg text-xs font-bold border border-border"
                      >
                        Détails
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
