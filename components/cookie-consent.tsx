"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("edusmart-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem("edusmart-consent", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] bg-slate-900 text-white p-6 rounded-3xl shadow-2xl z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-start gap-4">
        <div className="bg-primary/20 p-2 rounded-xl text-primary">
          <ShieldCheck size={24} />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-bold">Protection des Données</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            EduSmart utilise des cookies pour assurer la sécurité de vos paiements et votre session de travail. En continuant, vous acceptez notre <a href="/privacy" className="text-primary underline">politique de confidentialité (CDP)</a>.
          </p>
          <div className="flex gap-2 pt-2">
            <Button onClick={accept} size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex-1">
              J'ai compris
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="rounded-xl text-slate-400 hover:text-white">
              <X size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
