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
    <main className="min-h-screen bg-background relative">
      {/* Global Background Effects */}
      <div className="fixed inset-0 -z-20 bg-grid opacity-[0.2]" />
      <div className="fixed inset-0 -z-20 bg-glow" />
      
      {/* Decorative Blobs */}
      <div className="fixed top-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-float -z-10" />
      <div className="fixed bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] animate-float [animation-delay:3s] -z-10" />
      
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ModulesSection />
      <UsersSection />
      <CTASection />
      <Footer />
    </main>
  )
}
