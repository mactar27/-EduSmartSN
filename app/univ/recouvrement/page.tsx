"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  Filter,
  Download,
  Phone,
  MessageSquare,
  AlertCircle,
  CreditCard,
  Wallet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function RecoveryDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Stats Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recouvrement & Trésorerie</h2>
          <p className="text-muted-foreground mt-1">Suivi en temps réel des flux financiers de l'établissement.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-border h-12">
            <Download size={18} />
            Exporter (PDF/Excel)
          </Button>
          <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <CreditCard size={18} />
            Lancer un appel de fonds
          </Button>
        </div>
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-border rounded-[2rem] bg-card hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Encaissé (Mai)</p>
          <h3 className="text-3xl font-black mt-1">8 450 000 <span className="text-sm font-bold opacity-50">FCFA</span></h3>
        </Card>

        <Card className="p-6 border-border rounded-[2rem] bg-card hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertCircle size={24} />
            </div>
            <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-full">-3%</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Reste à Recouvrer</p>
          <h3 className="text-3xl font-black mt-1">2 120 000 <span className="text-sm font-bold opacity-50">FCFA</span></h3>
        </Card>

        <Card className="p-6 border-border rounded-[2rem] bg-card hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">452</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Élèves à Jour</p>
          <h3 className="text-3xl font-black mt-1">78% <span className="text-sm font-bold opacity-50">Effectif</span></h3>
        </Card>

        <Card className="p-6 border-border rounded-[2rem] bg-primary text-white shadow-lg shadow-primary/30">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Wallet size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-white/70">Solde Disponible (PayTech)</p>
          <h3 className="text-3xl font-black mt-1">4 215 500 <span className="text-sm font-bold opacity-70">FCFA</span></h3>
        </Card>
      </div>

      {/* Main Section: Gauge & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Gauge & Analysis */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-10 border-border rounded-[3rem] bg-card shadow-xl flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-8">Indice de Recouvrement</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96" cy="96" r="80"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted/20"
                />
                <circle
                  cx="96" cy="96" r="80"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={2 * Math.PI * 80 * (1 - 0.78)}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-primary">78%</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global</span>
              </div>
            </div>
            
            <div className="space-y-4 w-full text-left">
               <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Inscription</span>
                  <span className="text-foreground">95%</span>
               </div>
               <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[95%]" />
               </div>

               <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2">
                  <span>Mensualité Mai</span>
                  <span className="text-foreground">62%</span>
               </div>
               <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[62%]" />
               </div>
            </div>
          </Card>

          <Card className="p-8 border-border rounded-[2.5rem] bg-muted/30">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-rose-500" />
              Alerte Trésorerie
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le taux de recouvrement des mensualités est inférieur de 12% par rapport au mois dernier à la même période.
            </p>
            <Button variant="link" className="text-primary p-0 h-auto font-bold mt-4">
              Lancer une relance SMS collective
            </Button>
          </Card>
        </div>

        {/* Right: Lists */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-4 p-1 bg-muted rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Derniers Flux
            </button>
            <button 
              onClick={() => setActiveTab("impayes")}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'impayes' ? 'bg-card shadow-sm text-rose-600' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Impayés Critiques
            </button>
          </div>

          <Card className="border-border rounded-[2.5rem] overflow-hidden shadow-xl bg-card">
            <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input placeholder="Rechercher un élève ou une transaction..." className="pl-12 h-12 bg-muted/20 border-none rounded-2xl" />
              </div>
              <Button variant="outline" className="h-12 rounded-2xl border-border gap-2">
                <Filter size={18} /> Filtres
              </Button>
            </div>

            <div className="overflow-x-auto">
              {activeTab === 'overview' ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-[0.2em] bg-muted/10">
                      <th className="px-8 py-4 font-black">Date & Heure</th>
                      <th className="px-8 py-4 font-black">Élève</th>
                      <th className="px-8 py-4 font-black">Type</th>
                      <th className="px-8 py-4 font-black">Montant</th>
                      <th className="px-8 py-4 font-black">Méthode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[1,2,3,4,5].map((i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="text-xs font-bold">Aujourd'hui</p>
                          <p className="text-[10px] text-muted-foreground">14:2{i}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="font-bold text-sm">Amadou Sall</p>
                          <p className="text-[10px] text-muted-foreground">L1 Informatique</p>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded">MENSUALITÉ</span>
                        </td>
                        <td className="px-8 py-5 font-black text-primary">+15 000</td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-[#00AEEF] flex items-center justify-center p-1">
                               <img src="/wave.png" alt="Wave" />
                             </div>
                             <span className="text-xs font-bold uppercase">Wave</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-[0.2em] bg-muted/10">
                      <th className="px-8 py-4 font-black">Étudiant</th>
                      <th className="px-8 py-4 font-black">Classe</th>
                      <th className="px-8 py-4 font-black">Retard</th>
                      <th className="px-8 py-4 font-black">Montant Dû</th>
                      <th className="px-8 py-4 font-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[1,2,3].map((i) => (
                      <tr key={i} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-sm">Abdoulaye Diop</td>
                        <td className="px-8 py-5 text-xs">M2 Marketing</td>
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded">12 JOURS</span>
                        </td>
                        <td className="px-8 py-5 font-black text-rose-600">30 000 CFA</td>
                        <td className="px-8 py-5 flex gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-primary border-primary/20 hover:bg-primary/5">
                            <Phone size={14} />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-emerald-600 border-emerald-100 hover:bg-emerald-50">
                            <MessageSquare size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
