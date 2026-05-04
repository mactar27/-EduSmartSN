"use client"

import { Shield, Lock, Eye, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-20 px-6">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 bg-grid opacity-[0.2]" />
      <div className="fixed inset-0 -z-10 bg-glow" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-[2rem] text-primary mb-4 shadow-xl shadow-primary/5 animate-in zoom-in duration-700">
            <Shield size={48} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Politique de <span className="text-gradient">Confidentialité</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Protection des données personnelles et conformité avec la CDP du Sénégal.
          </p>
        </div>

        <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Card className="p-8 sm:p-10 rounded-[2.5rem] border-border shadow-2xl premium-shadow glass space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Lock size={28} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">1. Collecte des Données</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              EduSmart SN collecte les données strictement nécessaires à la gestion académique et administrative de l&apos;établissement (Noms, prénoms, cursus, notes). Ces données sont collectées uniquement dans le cadre de la mission d&apos;éducation souveraine.
            </p>
          </Card>

          <Card className="p-8 sm:p-10 rounded-[2.5rem] border-border shadow-2xl premium-shadow glass space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Eye size={28} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">2. Finalité du Traitement</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed text-lg">
              Les données sont traitées pour :
              <ul className="list-disc ml-6 mt-4 space-y-3 font-medium">
                <li>La gestion des inscriptions et du cursus scolaire.</li>
                <li>Le calcul automatique des moyennes et crédits LMD.</li>
                <li>La sécurisation des accès via authentification forte.</li>
                <li>L&apos;édition des cartes d&apos;étudiant et relevés officiels.</li>
              </ul>
            </div>
          </Card>

          <Card className="p-8 sm:p-10 rounded-[2.5rem] border-border shadow-2xl premium-shadow glass space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <div className="p-3 rounded-2xl bg-primary/10">
                <FileText size={28} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">3. Droits et Souveraineté</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Conformément à la loi sénégalaise, vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;opposition. EduSmart s&apos;engage à maintenir vos données sur des serveurs sécurisés garantissant une souveraineté numérique totale au Sénégal.
            </p>
          </Card>

          <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/20 text-center italic text-sm text-muted-foreground">
            Dernière mise à jour : 04 Mai 2026. EduSmart est une plateforme conçue et hébergée au Sénégal.
          </div>
        </div>
      </div>
    </div>
  )
}
