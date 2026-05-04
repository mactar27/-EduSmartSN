import { Phone, Mail, MapPin } from "lucide-react"
import { DemoForm } from "./demo-form"

export function CTASection() {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left side - Info */}
          <div className="lg:pr-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
              Prêt à <span className="text-primary">moderniser</span> votre établissement ?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              Rejoignez les établissements sénégalais qui ont choisi EduSmart SN pour leur transformation digitale. 
              Notre équipe vous accompagne à chaque étape.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Téléphone</p>
                  <a href="tel:+221773519128" className="text-muted-foreground hover:text-primary transition-colors">
                    +221 77 351 91 28
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:ndiayeamadoumactar3@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                    ndiayeamadoumactar3@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Adresse</p>
                  <p className="text-muted-foreground">
                    Dakar, Sénégal
                  </p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Réponse sous 24h
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Démo personnalisée
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Sans engagement
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div id="demo-form" className="bg-muted/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-border">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              Demandez votre démo gratuite
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Remplissez le formulaire et notre équipe vous contactera rapidement.
            </p>
            <DemoForm />
          </div>
        </div>
      </div>
    </section>
  )
}
