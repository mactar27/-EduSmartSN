"use client"

import { useState } from "react"
import { 
  Wallet, 
  GraduationCap, 
  MessageSquare, 
  Calendar,
  FileText,
  BarChart3,
  CheckCircle2
} from "lucide-react"

const modules = [
  {
    id: "finance",
    icon: Wallet,
    title: "Module Financier",
    description: "Gestion complète des paiements avec intégration Wave, Orange Money et Free Money.",
    features: [
      "Génération automatique des factures",
      "Relances SMS automatiques",
      "Suivi des impayés en temps réel",
      "Rapports financiers détaillés",
    ],
    color: "primary",
  },
  {
    id: "pedagogy",
    icon: GraduationCap,
    title: "Module Pédagogique",
    description: "Gestion académique complète selon le système LMD sénégalais.",
    features: [
      "Saisie et calcul des notes",
      "Gestion des examens et rattrapages",
      "Cartes étudiants avec QR Code",
      "Relevés de notes automatiques",
    ],
    color: "secondary",
  },
  {
    id: "comms",
    icon: MessageSquare,
    title: "Module Communication",
    description: "Restez connecté avec étudiants, parents et professeurs.",
    features: [
      "Notifications SMS et email",
      "Messagerie interne",
      "Annonces et actualités",
      "Alertes automatiques",
    ],
    color: "accent",
  },
  {
    id: "schedule",
    icon: Calendar,
    title: "Emplois du Temps",
    description: "Planification et gestion des cours et salles.",
    features: [
      "Planning interactif",
      "Gestion des salles",
      "Conflits détectés automatiquement",
      "Export PDF et iCal",
    ],
    color: "primary",
  },
  {
    id: "docs",
    icon: FileText,
    title: "Documents",
    description: "Génération et gestion des documents administratifs.",
    features: [
      "Certificats de scolarité",
      "Attestations de réussite",
      "Demandes en ligne",
      "Signatures électroniques",
    ],
    color: "secondary",
  },
  {
    id: "dashboards",
    icon: BarChart3,
    title: "Tableaux de Bord",
    description: "Visualisez toutes vos données en un coup d&apos;œil.",
    features: [
      "KPIs en temps réel",
      "Graphiques interactifs",
      "Rapports personnalisés",
      "Export des données",
    ],
    color: "accent",
  },
]

export function ModulesSection() {
  const [activeTab, setActiveTab] = useState(modules[0].id)
  const activeModule = modules.find(m => m.id === activeTab) || modules[0]

  return (
    <section id="modules" className="py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Tout ce dont vous avez <span className="text-primary">besoin</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Une suite d&apos;outils puissants, regroupés en une seule interface fluide.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Navigation - Left side on Desktop */}
          <div className="w-full lg:w-1/3 grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                  activeTab === module.id 
                  ? `border-primary bg-primary/5 shadow-md` 
                  : `border-transparent hover:bg-muted/50`
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === module.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  <module.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className={`text-sm sm:text-base font-bold ${activeTab === module.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {module.title}
                </span>
              </button>
            ))}
          </div>

          {/* Content - Right side on Desktop */}
          <div className="w-full lg:w-2/3">
            <div className="bg-card border border-border rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <activeModule.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{activeModule.title}</h3>
                    <div className="h-1 w-12 bg-primary mt-1 rounded-full" />
                  </div>
                </div>

                <p className="text-base sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                  {activeModule.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {activeModule.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50 group hover:bg-muted/50 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-sm sm:text-base font-medium text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
