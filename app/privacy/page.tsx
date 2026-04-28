"use client"

import { Shield, Lock, Eye, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl text-primary mb-4">
            <Shield size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Politique de Confidentialité</h1>
          <p className="text-muted-foreground text-lg">Conformité avec la CDP (Commission de Protection des Données Personnelles du Sénégal)</p>
        </div>

        <div className="grid gap-8">
          <Card className="p-8 rounded-3xl border-border shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Lock size={24} />
              <h2 className="text-xl font-bold">1. Collecte des Données</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              EduSmart SN collecte les données nécessaires à la gestion académique et administrative des établissements (Noms, prénoms, photos, notes, historiques de paiement). Ces données sont collectées uniquement dans le cadre de la mission d'éducation de l'établissement partenaire.
            </p>
          </Card>

          <Card className="p-8 rounded-3xl border-border shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Eye size={24} />
              <h2 className="text-xl font-bold">2. Finalité du Traitement</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Les données sont traitées pour :
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>La gestion des inscriptions et du cursus scolaire.</li>
                <li>Le calcul automatique des moyennes et crédits LMD.</li>
                <li>La sécurisation des paiements via PayTech SN.</li>
                <li>L'édition des cartes d'étudiant et relevés de notes.</li>
              </ul>
            </p>
          </Card>

          <Card className="p-8 rounded-3xl border-border shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <FileText size={24} />
              <h2 className="text-xl font-bold">3. Droits des Utilisateurs</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Conformément à la loi sénégalaise, chaque étudiant, parent ou professeur dispose d'un droit d'accès, de rectification et d'opposition sur ses données personnelles. Pour exercer ce droit, contactez l'administration de votre établissement ou le support EduSmart.
            </p>
          </Card>

          <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20 text-center italic text-sm text-slate-500">
            Dernière mise à jour : 28 Avril 2026. EduSmart s'engage à une souveraineté totale des données sur le territoire sénégalais.
          </div>
        </div>
      </div>
    </div>
  )
}
