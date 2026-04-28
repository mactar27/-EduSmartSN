import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ModulesSection } from "@/components/modules-section"
import { UsersSection } from "@/components/users-section"
import { EtablissementsSection } from "@/components/etablissements-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ModulesSection />
      <UsersSection />
      <EtablissementsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
