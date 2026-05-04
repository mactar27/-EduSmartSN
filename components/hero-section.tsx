"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36 bg-[#1a2e26]">
      {/* Chalkboard Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-linen.png')" }} />
      
      {/* Chalk Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/20 rounded-full blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/10 rounded-full blur-[2px] animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white/15 rounded-full blur-[1px] animate-pulse [animation-delay:4s]" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-emerald-100/80 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Souveraineté Numérique Sénégalaise</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] animate-in fade-in slide-in-from-left-8 duration-1000">
                L&apos;Excellence <br /> 
                <span className="font-caveat text-emerald-300 drop-shadow-[0_2px_10px_rgba(110,231,183,0.3)] rotate-[-2deg] inline-block mt-2">
                  commence ici.
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-emerald-50/70 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                Pilotez votre établissement avec la plateforme de gestion <span className="text-white font-bold underline decoration-emerald-500/50 underline-offset-8">souveraine</span> de référence au Sénégal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
              <Link href="#demo-form" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-[#1a2e26] hover:bg-emerald-50 gap-3 px-10 h-16 text-lg font-black rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95">
                  Demander une démo
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
              <button className="flex items-center gap-3 text-emerald-100/60 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-all group-hover:scale-110">
                  <Play className="h-4 w-4 fill-current ml-1" />
                </div>
                <span className="font-bold text-sm tracking-wide">Voir la vidéo</span>
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-[650px] animate-in fade-in zoom-in duration-1000 delay-500">
            {/* The "Tableau" Visual Element */}
            <div className="relative aspect-[16/10] rounded-[3rem] p-4 bg-[#2a2a2a] border-[12px] border-[#3e2723] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] premium-shadow group">
              {/* Inner Chalkboard */}
              <div className="absolute inset-4 rounded-[2rem] bg-[#1a2e26] shadow-inner overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />
                 
                 {/* Chalk Drawings/UI Elements */}
                 <div className="w-[90%] h-[85%] border-2 border-dashed border-white/10 rounded-2xl flex flex-col p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="font-caveat text-3xl text-white/40">Dashboard_v1</div>
                      <div className="flex gap-4">
                        <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/10" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 flex-1">
                       <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-end">
                          <div className="font-caveat text-4xl text-emerald-200">1,250</div>
                          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mt-2">Étudiants</p>
                       </div>
                       <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-end">
                          <div className="font-caveat text-4xl text-emerald-200">98%</div>
                          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mt-2">Réussite</p>
                       </div>
                    </div>

                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-emerald-400/20 rounded-full" />
                    </div>
                 </div>
              </div>

              {/* Wooden chalk shelf */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-[#3e2723] rounded-full shadow-lg" />
              
              {/* Floating Chalks */}
              <div className="absolute -bottom-8 right-20 w-12 h-3 bg-white rounded-sm rotate-[15deg] shadow-md opacity-90" />
              <div className="absolute -bottom-6 right-36 w-8 h-3 bg-emerald-200 rounded-sm rotate-[-10deg] shadow-md opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
