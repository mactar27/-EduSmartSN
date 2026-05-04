"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Start exit animation after 2 seconds
    const timer = setTimeout(() => {
      setIsAnimating(true)
      // Completely remove from DOM after animation finishes (500ms)
      setTimeout(() => {
        setIsVisible(false)
      }, 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-[1000] flex items-center justify-center bg-white transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo Animation */}
        <div className="animate-in fade-in zoom-in duration-1000">
          <Image 
            src="/logo.png" 
            alt="EduSmart SN" 
            width={300} 
            height={100} 
            className="w-64 md:w-80 h-auto"
            priority
          />
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress-fast shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
        </div>

        {/* Sovereign tagline */}
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          Souveraineté Numérique
        </p>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress-fast {
          animation: progress 2.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}
