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
    color: "primary",
  },
  {
    id: "pedagogy",
    icon: GraduationCap,
    title: "Module Pédagogique",
    description: "Gestion académique complète selon le système LMD sénégalais.",
    color: "secondary",
  },
  {
    id: "comms",
    icon: MessageSquare,
    title: "Module Communication",
    description: "Restez connecté avec étudiants, parents et professeurs.",
    color: "accent",
  },
  {
    id: "schedule",
    icon: Calendar,
    title: "Emplois du Temps",
    description: "Planification et gestion des cours et salles.",
    color: "primary",
  },
  {
    id: "docs",
    icon: FileText,
    title: "Documents",
    description: "Génération et gestion des documents administratifs.",
    color: "secondary",
  },
  {
    id: "dashboards",
    icon: BarChart3,
    title: "Tableaux de Bord",
    description: "Visualisez toutes vos données en un coup d'œil.",
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
            Tout ce dont vous avez <span className="text-gradient">besoin</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Une suite d&apos;outils puissants, regroupés en une seule interface fluide.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Navigation - Left side on Desktop */}
          <div className="w-full lg:w-1/3 grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-4">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`flex items-center gap-3 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border-2 ${
                  activeTab === module.id 
                  ? `border-primary/50 bg-primary/5 shadow-xl premium-shadow scale-105 z-10` 
                  : `border-transparent hover:bg-muted/50 hover:scale-102`
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${activeTab === module.id ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                  <module.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className={`text-sm sm:text-lg font-bold ${activeTab === module.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {module.title}
                </span>
              </button>
            ))}
          </div>

          {/* Content - Right side on Desktop */}
          <div className="w-full lg:w-2/3">
            <div className="bg-card border border-border rounded-[3rem] p-8 sm:p-14 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] animate-pulse [animation-delay:1s]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-8">
                  <div className="p-5 rounded-3xl bg-primary/10 text-primary shadow-inner">
                    <activeModule.icon className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">{activeModule.title}</h3>
                    <div className="h-1.5 w-16 bg-primary mt-2 rounded-full shadow-sm" />
                  </div>
                </div>

                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
                  {activeModule.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
