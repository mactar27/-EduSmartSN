"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 md:py-32 lg:py-40">
      {/* Ultra-Visible background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/40 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] animate-float [animation-delay:4s]" />
      </div>
      
      {/* Subtle tech overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">Souveraineté Numérique</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-left-8 duration-1000">
              L&apos;Intelligence <span className="text-gradient">Collective</span> au service de l&apos;Éducation
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
              Gérez votre établissement avec la plateforme SaaS n°1 au Sénégal. 
              Conçue pour l&apos;excellence académique et la sécurité totale de vos données.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
              <Link href="#demo-form" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-10 h-16 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 shimmer">
                  Démarrer maintenant
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-[600px] animate-in fade-in zoom-in duration-1000 delay-500">
            {/* Visual element representing the platform */}
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl premium-shadow glass group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-indigo-600/5 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 flex items-center justify-center">
                 {/* This would be a generated image or a mockup */}
                 <div className="w-[85%] h-[80%] bg-background/80 rounded-2xl border border-border shadow-2xl p-6 space-y-6 animate-float">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div className="h-4 w-32 bg-muted rounded-full" />
                      <div className="flex gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20" />
                        <div className="h-6 w-6 rounded-full bg-primary/10" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-20 bg-primary/5 rounded-xl border border-primary/10" />
                      <div className="h-20 bg-primary/5 rounded-xl border border-primary/10" />
                      <div className="h-20 bg-primary/5 rounded-xl border border-primary/10" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-muted rounded-full" />
                      <div className="h-4 w-[80%] bg-muted rounded-full" />
                      <div className="h-4 w-[60%] bg-muted rounded-full" />
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-6 -right-6 p-4 rounded-2xl bg-white shadow-xl border border-border animate-float [animation-delay:2s] dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <span className="font-bold text-xs">+99%</span>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black">Disponibilité</p>
                  <p className="text-sm font-bold">Cloud Souverain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
