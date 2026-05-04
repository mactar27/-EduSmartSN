import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-28 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-8">Conditions Générales d&apos;Utilisation (CGU)</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Objet</h2>
            <p>Les présentes CGU ont pour objet de définir les modalités de mise à disposition de la plateforme EduSmart SN et les conditions d&apos;utilisation par l&apos;Utilisateur.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Accès au service</h2>
            <p>Le service est accessible gratuitement à tout Utilisateur disposant d&apos;un accès à internet. Tous les frais supportés par l&apos;Utilisateur pour accéder au service sont à sa charge.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Responsabilité</h2>
            <p>EduSmart SN s&apos;efforce de fournir une plateforme de qualité, mais ne saurait être tenue responsable des interruptions de service ou des pertes de données liées à une mauvaise utilisation par l&apos;Utilisateur.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Propriété intellectuelle</h2>
            <p>Tous les contenus présents sur la plateforme (logos, textes, graphiques) sont la propriété exclusive d&apos;EduSmart SN et de WockyTech.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
