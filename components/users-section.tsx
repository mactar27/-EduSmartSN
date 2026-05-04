"use client"

import { useState } from "react"
import { 
  Crown, 
  Building, 
  BookOpen, 
  User,
  ChevronRight
} from "lucide-react"

const users = [
  {
    id: "superadmin",
    icon: Crown,
    title: "Super Administrateur",
    subtitle: "Gestionnaire de la plateforme",
    description: "Gérez tous les établissements depuis un tableau de bord central.",
    features: [
      "Création et suspension des comptes établissements",
      "Tableau de bord global des revenus",
      "Gestion des commissions sur les paiements",
      "Statistiques nationales",
    ],
    color: "accent",
    image: "/admin-demo.png"
  },
  {
    id: "univadmin",
    icon: Building,
    title: "Administrateur Université",
    subtitle: "Client de la plateforme",
    description: "Configurez et pilotez votre établissement en toute autonomie.",
    features: [
      "Configuration de l'année académique",
      "Gestion des facultés et départements",
      "Comptes professeurs et personnel",
      "Suivi financier en temps réel",
    ],
    color: "primary",
    image: "/univ-demo.png"
  },
  {
    id: "professor",
    icon: BookOpen,
    title: "Professeur",
    subtitle: "Équipe pédagogique",
    description: "Des outils simples pour gérer cours, notes et présences.",
    features: [
      "Saisie des notes et moyennes",
      "Gestion des absences via QR Code",
      "Partage de supports de cours",
      "Communication avec les étudiants",
    ],
    color: "secondary",
    image: "/prof-demo.png"
  },
  {
    id: "student",
    icon: User,
    title: "Étudiant",
    subtitle: "Utilisateur final",
    description: "Un portail complet pour suivre sa scolarité et payer en ligne.",
    features: [
      "Consultation des notes et emplois du temps",
      "Paiement via Wave/Orange Money",
      "Demande de certificats en ligne",
      "Accès aux supports de cours",
    ],
    color: "primary",
    image: "/student-demo.png"
  },
]

export function UsersSection() {
  const [activeIndex, setActiveIndex] = useState(1) // Default to Univ Admin
  const activeUser = users[activeIndex]

  return (
    <section id="utilisateurs" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Une interface pour <span className="text-primary">chaque rôle</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment EduSmart SN transforme le quotidien de tous les acteurs de l&apos;éducation.
          </p>
        </div>

        <div className="flex flex-col md:flex-row bg-background rounded-3xl border border-border shadow-xl overflow-hidden max-w-5xl mx-auto">
          {/* Sidebar Selector */}
          <div className="w-full md:w-80 border-r border-border bg-muted/10 p-4 sm:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar">
            {users.map((user, index) => (
              <button
                key={user.id}
                onClick={() => setActiveIndex(index)}
                className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 group shrink-0 md:shrink ${
                  activeIndex === index 
                  ? `bg-primary text-white shadow-lg shadow-primary/20` 
                  : `hover:bg-muted text-muted-foreground`
                }`}
              >
                <user.icon className={`h-5 w-5 ${activeIndex === index ? 'text-white' : 'group-hover:text-primary'}`} />
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">{user.title}</span>
                <ChevronRight className={`ml-auto h-4 w-4 hidden md:block transition-transform ${activeIndex === index ? 'translate-x-1' : 'opacity-0'}`} />
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 sm:p-10 lg:p-12 animate-in fade-in duration-500">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
                  {activeUser.subtitle}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{activeUser.title}</h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-8">
                {activeUser.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                {activeUser.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
