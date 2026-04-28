import { 
  Wallet, 
  GraduationCap, 
  MessageSquare, 
  Calendar,
  FileText,
  BarChart3
} from "lucide-react"

const modules = [
  {
    icon: Wallet,
    title: "Module Financier",
    description: "Gestion complète des paiements avec intégration Wave, Orange Money et Free Money.",
    features: [
      "Génération automatique des factures",
      "Relances SMS automatiques",
      "Suivi des impayés en temps réel",
      "Rapports financiers détaillés",
    ],
    color: "border-accent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: GraduationCap,
    title: "Module Pédagogique",
    description: "Gestion académique complète selon le système LMD sénégalais.",
    features: [
      "Saisie et calcul des notes",
      "Gestion des examens et rattrapages",
      "Cartes étudiants avec QR Code",
      "Relevés de notes automatiques",
    ],
    color: "border-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: MessageSquare,
    title: "Module Communication",
    description: "Restez connecté avec étudiants, parents et professeurs.",
    features: [
      "Notifications SMS et email",
      "Messagerie interne",
      "Annonces et actualités",
      "Alertes automatiques",
    ],
    color: "border-secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: Calendar,
    title: "Emplois du Temps",
    description: "Planification et gestion des cours et salles.",
    features: [
      "Planning interactif",
      "Gestion des salles",
      "Conflits détectés automatiquement",
      "Export PDF et iCal",
    ],
    color: "border-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Génération et gestion des documents administratifs.",
    features: [
      "Certificats de scolarité",
      "Attestations de réussite",
      "Demandes en ligne",
      "Signatures électroniques",
    ],
    color: "border-secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: BarChart3,
    title: "Tableaux de Bord",
    description: "Visualisez toutes vos données en un coup d&apos;œil.",
    features: [
      "KPIs en temps réel",
      "Graphiques interactifs",
      "Rapports personnalisés",
      "Export des données",
    ],
    color: "border-accent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
]

export function ModulesSection() {
  return (
    <section id="modules" className="py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Modules <span className="text-secondary">complets</span> et{" "}
            <span className="text-primary">intégrés</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tous les outils dont vous avez besoin pour gérer votre établissement efficacement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`p-4 sm:p-6 bg-background rounded-xl border-2 ${module.color} hover:shadow-xl transition-all duration-300`}
            >
              <div className={`inline-flex p-2.5 sm:p-3 rounded-lg ${module.iconBg} mb-3 sm:mb-4`}>
                <module.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${module.iconColor}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                {module.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                {module.description}
              </p>
              <ul className="space-y-1.5 sm:space-y-2">
                {module.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-xs sm:text-sm text-foreground/80">
                    <span className={`h-1.5 w-1.5 rounded-full ${module.iconBg.replace('/10', '')}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
