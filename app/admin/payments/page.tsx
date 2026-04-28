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

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // We'll reuse the stats API or create a specific one if needed
      // For now, let's assume we have a simple payments fetcher
      const res = await fetch('/api/univ/stats'); // Just to get some data for the demo
      const data = await res.json();
      // Mocking payments list based on the summary data for the demo
      setPayments([
        { id: "TX-9283", tenant: "UAM", student: "Mactar Ndiaye", amount: 150000, method: "WAVE", status: "PAID", date: "2026-04-27" },
        { id: "TX-9284", tenant: "Espoir BS", student: "Aminata Diallo", amount: 250000, method: "ORANGE_MONEY", status: "PAID", date: "2026-04-26" },
        { id: "TX-9285", tenant: "UAM", student: "Ibrahima Sarr", amount: 75000, method: "WAVE", status: "PENDING", date: "2026-04-28" },
      ]);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Flux Financiers & Commissions</h2>
          <p className="text-muted-foreground mt-1">Surveillez les encaissements de tous les établissements en temps réel.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2 h-11 border-border">
            <Download size={18} />
            Exporter CSV
          </Button>
          <Button className="bg-primary rounded-xl gap-2 h-11 shadow-lg shadow-primary/20 font-bold">
            <Filter size={18} />
            Filtrer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm border-b-4 border-b-emerald-500">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12.4%</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Volume Total (30j)</p>
            <h3 className="text-2xl font-black mt-1">45.280.000 F</h3>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm border-b-4 border-b-primary">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-blue-100 text-primary">
              <CreditCard size={24} />
            </div>
            <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-1 rounded-lg">8% fixe</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Commissions EduSmart</p>
            <h3 className="text-2xl font-black mt-1">3.622.400 F</h3>
          </div>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm border-b-4 border-b-amber-500">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <Clock size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">En attente de Reversement</p>
            <h3 className="text-2xl font-black mt-1">12.500.000 F</h3>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20">
          <h3 className="font-bold text-lg">Transactions Récentes</h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input className="pl-10 bg-background border-border rounded-xl" placeholder="Rechercher une transaction..." />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-widest border-b border-border">
                <th className="px-6 py-4 font-bold">Réf / Date</th>
                <th className="px-6 py-4 font-bold">Établissement</th>
                <th className="px-6 py-4 font-bold">Étudiant</th>
                <th className="px-6 py-4 font-bold">Montant</th>
                <th className="px-6 py-4 font-bold">Méthode</th>
                <th className="px-6 py-4 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment, i) => (
                <tr key={i} className="group hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm">{payment.id}</p>
                    <p className="text-[10px] text-muted-foreground">{payment.date}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-sm">{payment.tenant}</td>
                  <td className="px-6 py-4 text-sm font-medium">{payment.student}</td>
                  <td className="px-6 py-4 text-sm font-black text-foreground">
                    {payment.amount.toLocaleString()} F
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                      payment.method === 'WAVE' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {payment.status === 'PAID' ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-600">Validé</span>
                        </>
                      ) : (
                        <>
                          <Clock size={14} className="text-amber-500" />
                          <span className="text-xs font-bold text-amber-600">En attente</span>
                        </>
                      )}
                    </div>
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
