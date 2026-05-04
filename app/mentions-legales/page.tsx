import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-28 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-8">Mentions Légales</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground">
          
          <section className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">Éditeur du site</h2>
            <p><strong>EduSmart SN</strong> est une plateforme développée par <strong>WockyTech</strong>.</p>
            <p>Directeur de la publication : Amadou Mactar Ndiaye</p>
            <p>Email : ndiayeamadoumactar3@gmail.com</p>
            <p>Téléphone : +221 77 351 91 28</p>
          </section>

          <section className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Hébergement</h2>
            <p>Le site est hébergé par Vercel Inc., situé au 340 S Lemon Ave #4133 Walnut, CA 91789, USA.</p>
          </section>

          <section className="p-8 bg-primary/5 rounded-2xl border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Propriété Intellectuelle</h2>
            <p>L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
