"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
      {/* Premium background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-float [animation-delay:2s]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 text-balance leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            L&apos;excellence académique <span className="text-gradient">commence ici</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto text-pretty px-2 sm:px-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            Pilotez votre établissement avec la plateforme de gestion <span className="text-foreground font-semibold italic">numérique souveraine</span> de référence au Sénégal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <Link href="#demo-form" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 sm:px-10 h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 shimmer transition-transform hover:scale-105 active:scale-95">
                Demander une démo gratuite
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
