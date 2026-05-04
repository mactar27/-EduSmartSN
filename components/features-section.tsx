import { 
  Building2, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone, 
  Clock 
} from "lucide-react"

const features = [
  {
    icon: Building2,
    title: "Multi-Tenant",
    description: "Isolation complète des données pour chaque établissement.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Souveraineté",
    description: "Vos données restent au Sénégal sur des serveurs sécurisés.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Smartphone,
    title: "Portail Étudiant",
    description: "Un espace dédié pour consulter les notes, cours et emploi du temps.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Une plateforme pensée pour{" "}
            <span className="text-primary">l&apos;Afrique</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Des fonctionnalités adaptées aux réalités et besoins des établissements sénégalais.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 sm:p-10 bg-background/50 backdrop-blur-sm rounded-[2rem] border border-border hover:border-primary/50 hover:shadow-2xl hover:premium-shadow transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-${(index + 1) * 100}`}
            >
              <div className={`inline-flex p-4 rounded-2xl ${feature.bg} mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
