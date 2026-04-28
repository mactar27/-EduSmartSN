"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet, CreditCard, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function CheckoutPage() {
  const [amount, setAmount] = useState("25000")
  const [studentId, setStudentId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/paiement/initialiser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          studentId: studentId || "DEMO-STU-001",
          description: "Frais d'inscription académique EduSmart"
        })
      })
      const data = await res.json()
      if (data.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        alert("Erreur lors de l'initialisation du paiement.")
      }
    } catch (err) {
      console.error(err)
      alert("Erreur serveur.")
    } finally {
      setIsLoading(false)
    }
  }

  // Format number safely for hydration
  const formatAmount = (val: string) => {
    if (!mounted) return val;
    return parseInt(val).toLocaleString('fr-FR');
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="gap-2 font-bold text-muted-foreground hover:text-primary">
            <ArrowRight size={20} className="rotate-180" />
            Retour
          </Button>
        </Link>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="EduSmart SN Logo"
            width={220}
            height={80}
            className="h-20 w-auto"
          />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Résumé du Paiement</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground font-medium">Inscription Académique</span>
                <span className="font-bold">{formatAmount(amount)} FCFA</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground font-medium">Frais de plateforme</span>
                <span className="font-bold text-emerald-600">Offert</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Total à payer</span>
                <span className="text-2xl font-black text-primary">{formatAmount(amount)} FCFA</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={20} />
                <span className="font-bold text-sm">Paiement 100% Sécurisé</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vos transactions sont protégées par le système de cryptage souverain d'EduSmart SN et PayTech.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
            <Image src="https://paytech.sn/assets/img/wave.png" alt="Wave" width={60} height={30} className="object-contain" />
            <Image src="https://paytech.sn/assets/img/orange-money.png" alt="Orange Money" width={60} height={30} className="object-contain" />
            <Image src="https://paytech.sn/assets/img/visa-mastercard.png" alt="Visa/Mastercard" width={80} height={30} className="object-contain" />
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Informations Étudiant</h3>
            <p className="text-sm text-muted-foreground">Entrez vos détails pour valider votre inscription.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Numéro de Matricule / Dossier</label>
              <Input 
                placeholder="Ex: UAM-2024-001" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="bg-muted/50 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Montant à régler (FCFA)</label>
              <Input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-muted/50 h-12 rounded-xl font-bold text-lg"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Choisir un moyen de paiement</p>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={handlePayment}
                disabled={isLoading}
                className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-background rounded-xl shadow-sm">
                    <Wallet className="text-primary" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Mobile Money & Cartes</p>
                    <p className="text-xs text-muted-foreground">Wave, Orange Money, Free Money, CB</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
          >
            {isLoading ? "Initialisation..." : "Procéder au paiement"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Validation instantanée dans votre dossier académique
          </div>
        </div>

      </div>
    </div>
  )
}
