import { 
  Crown, 
  Building, 
  BookOpen, 
  User 
} from "lucide-react"

const users = [
  {
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
    color: "from-accent to-accent/70",
  },
  {
    icon: Building,
    title: "Administrateur Université",
    subtitle: "Le client de la plateforme",
    description: "Configurez et pilotez votre établissement en toute autonomie.",
    features: [
      "Configuration de l&apos;année académique",
      "Gestion des facultés et départements",
      "Comptes professeurs et personnel",
      "Suivi financier en temps réel",
    ],
    color: "from-primary to-primary/70",
  },
  {
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
    color: "from-secondary to-secondary/70",
  },
  {
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
    color: "from-primary to-secondary",
  },
]

export function UsersSection() {
  return (
    <section id="utilisateurs" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Un profil pour <span className="text-primary">chaque utilisateur</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Des interfaces adaptées aux besoins spécifiques de chaque rôle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {users.map((user, index) => (
            <div
              key={index}
              className="relative p-4 sm:p-6 bg-background rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${user.color}`} />
              
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className={`p-2.5 sm:p-3 rounded-lg bg-gradient-to-br ${user.color}`}>
                  <user.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-0.5">
                    {user.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                    {user.subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-foreground/80 mb-3 sm:mb-4">
                    {user.description}
                  </p>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {user.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
