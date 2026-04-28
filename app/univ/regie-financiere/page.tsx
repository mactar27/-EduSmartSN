"use client"

import { useState, useEffect } from "react"
import { 
  Banknote, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  PlusCircle, 
  Calendar,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function FinancialRegistry() {
  const [fees, setFees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  // New Fee Form
  const [newFee, setNewFee] = useState({
    name: "",
    amount: "",
    category: "INSCRIPTION",
    recurrence: "ONCE"
  })

  useEffect(() => {
    fetchFees()
  }, [])

  const fetchFees = async () => {
    setIsLoading(true)
    try {
      // For demo, if tenantId isn't in headers, we'll need a better way in prod
      const res = await fetch('/api/univ/fees', {
        headers: { 'x-tenant-id': 'DEMO-TENANT-001' } // Fallback for dev
      })
      const data = await res.json()
      if (data.fees) setFees(data.fees)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/univ/fees', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': 'DEMO-TENANT-001'
        },
        body: JSON.stringify(newFee)
      })
      if (res.ok) {
        setIsAdding(false)
        setNewFee({ name: "", amount: "", category: "INSCRIPTION", recurrence: "ONCE" })
        fetchFees()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteFee = async (id: string) => {
    if (!confirm("Supprimer ce tarif ?")) return
    try {
      await fetch(`/api/univ/fees?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-tenant-id': 'DEMO-TENANT-001' }
      })
      fetchFees()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Régie Financière</h2>
          <p className="text-muted-foreground mt-1">Configurez les tarifs et frais de scolarité de votre établissement.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
          {isAdding ? "Annuler" : <><PlusCircle size={18} /> Ajouter un tarif</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="p-8 border-primary/20 bg-primary/5 rounded-[2rem] shadow-inner">
          <form onSubmit={handleAddFee} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Libellé du frais</label>
              <Input 
                required
                placeholder="Ex: Frais d'inscription L1"
                value={newFee.name}
                onChange={(e) => setNewFee({...newFee, name: e.target.value})}
                className="h-12 rounded-xl border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Montant (FCFA)</label>
              <Input 
                required
                type="number"
                placeholder="0"
                value={newFee.amount}
                onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                className="h-12 rounded-xl border-border bg-background font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Catégorie</label>
              <select 
                className="w-full h-12 px-4 bg-background border border-border rounded-xl font-medium appearance-none"
                value={newFee.category}
                onChange={(e) => setNewFee({...newFee, category: e.target.value})}
              >
                <option value="INSCRIPTION">Inscription</option>
                <option value="SCOLARITE">Scolarité (Mensuelle)</option>
                <option value="EXAMEN">Frais d'Examen</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full h-12 rounded-xl font-bold">Valider le tarif</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-20">Chargement des tarifs...</div>
        ) : fees.length === 0 ? (
          <div className="col-span-3 bg-card border border-dashed border-border rounded-[2rem] p-20 text-center">
            <Banknote size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Aucun tarif configuré pour le moment.</p>
          </div>
        ) : (
          fees.map((fee) => (
            <Card key={fee.id} className="relative group overflow-hidden border-border hover:border-primary/30 transition-all hover:shadow-xl rounded-[2rem] p-6 bg-card">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteFee(fee.id)}
                  className="text-muted-foreground hover:text-destructive rounded-full"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  {fee.category}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{fee.name}</h3>
                  <p className="text-3xl font-black text-primary mt-2">
                    {fee.amount.toLocaleString('fr-FR')} <span className="text-sm font-bold text-muted-foreground">FCFA</span>
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={14} />
                    {fee.recurrence === "ONCE" ? "Paiement unique" : "Mensuel"}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                    <CheckCircle2 size={12} /> Actif
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="bg-muted/30 border border-border p-6 rounded-3xl flex items-start gap-4">
        <AlertCircle className="text-primary mt-1" size={20} />
        <div className="space-y-1">
          <p className="font-bold text-sm">Note importante pour la comptabilité</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Les tarifs configurés ici seront immédiatement visibles par les étudiants dans leur portail de paiement. 
            Assurez-vous de valider les montants avant toute publication officielle.
          </p>
        </div>
      </div>
    </div>
  )
}
