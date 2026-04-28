"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function HeroSection() {
  const { data: stats } = useSWR("/api/stats", fetcher, {
    refreshInterval: 30000,
    fallbackData: {
      total_etablissements: 50,
      total_etudiants: 25000,
      total_professeurs: 1500,
      paiements_mois: 0,
    },
  })

  const displayStats = [
    { value: `${stats?.total_etablissements || 50}+`, label: "Établissements" },
    { value: `${(stats?.total_etudiants / 1000).toFixed(0) || 25}K+`, label: "Étudiants" },
    { value: "99.9%", label: "Disponibilité" },
    { value: "3", label: "Paiements mobiles" },
  ]

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-primary mb-6 sm:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            Nouveau : Intégration Wave & Orange Money
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 text-balance">
            La plateforme de gestion universitaire{" "}
            <span className="text-primary">moderne</span> du{" "}
            <span className="text-secondary">Sénégal</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto text-pretty px-2 sm:px-0">
            Gérez vos étudiants, professeurs, paiements et cours depuis une seule plateforme. 
            Solution SaaS multi-tenant conçue pour les universités et écoles supérieures africaines.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 sm:px-0">
            <Link href="#demo-form">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6 sm:px-8">
                Demander une démo gratuite
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-muted-foreground/30 text-foreground hover:bg-muted gap-2">
              <Play className="h-4 w-4" />
              Voir la vidéo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 pt-8 sm:pt-10 border-t border-border">
            {displayStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
