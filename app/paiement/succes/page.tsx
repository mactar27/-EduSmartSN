"use client"

import { CheckCircle2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-emerald-50/30">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200 animate-bounce">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Paiement Réussi !</h1>
        <p className="text-muted-foreground">
          Votre paiement a été validé avec succès. Votre inscription est désormais active et votre dossier a été mis à jour.
        </p>
        <div className="pt-6">
          <Link href="/">
            <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl gap-2">
              <Home size={20} />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
