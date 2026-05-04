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
    title: "Paiements Mobiles",
    description: "Intégration native Wave, Orange Money et Free Money.",
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-4 sm:p-6 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex p-2.5 sm:p-3 rounded-lg ${feature.bg} mb-3 sm:mb-4`}>
                <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
