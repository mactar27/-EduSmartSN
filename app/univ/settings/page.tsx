"use client"

import { useState, useEffect } from "react"
import { Palette, Upload, Save, Globe, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function UnivSettings() {
  const [tenant, setTenant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchTenant()
  }, [])

  const fetchTenant = async () => {
    try {
      const res = await fetch('/api/univ/stats') // Reusing stats API to get tenant info
      const data = await res.json()
      setTenant(data.tenant)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch('/api/univ/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenant)
      })
      if (res.ok) {
        alert("Configuration mise à jour avec succès !")
        window.location.reload() // Force reload to apply colors
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-20 text-center">Chargement de votre espace...</div>

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Personnalisation (White Label)</h2>
        <p className="text-muted-foreground mt-1">Configurez l'identité visuelle de votre université sur la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Section */}
          <form onSubmit={handleSave} className="bg-card border border-border rounded-3xl p-8 space-y-8 shadow-xl">
            <div className="flex items-center gap-3 text-primary border-b border-border pb-6">
              <Palette size={24} />
              <h3 className="text-xl font-bold">Identité Visuelle</h3>
            </div>

            <div className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Logo de l'établissement</label>
                <div className="flex items-center gap-8">
                  <div className="w-32 h-32 bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                    {tenant.logoUrl ? (
                      <img src={tenant.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain p-2" />
                    ) : (
                      <Image src="/logo.png" alt="Default" width={100} height={40} className="opacity-20" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input 
                      placeholder="URL de votre logo (PNG transparent)" 
                      value={tenant.logoUrl || ""}
                      onChange={(e) => setTenant({...tenant, logoUrl: e.target.value})}
                      className="bg-muted/30 h-12 rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground italic">Recommandé : Format paysage, fond transparent, min 400px.</p>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Couleur Primaire</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="color" 
                      value={tenant.primaryColor || "#4f46e5"}
                      onChange={(e) => setTenant({...tenant, primaryColor: e.target.value})}
                      className="w-16 h-16 rounded-xl cursor-pointer border-none p-0"
                    />
                    <Input 
                      value={tenant.primaryColor || "#4f46e5"}
                      onChange={(e) => setTenant({...tenant, primaryColor: e.target.value})}
                      className="bg-muted/30 font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Couleur Secondaire</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="color" 
                      value={tenant.secondaryColor || "#6366f1"}
                      onChange={(e) => setTenant({...tenant, secondaryColor: e.target.value})}
                      className="w-16 h-16 rounded-xl cursor-pointer border-none p-0"
                    />
                    <Input 
                      value={tenant.secondaryColor || "#6366f1"}
                      onChange={(e) => setTenant({...tenant, secondaryColor: e.target.value})}
                      className="bg-muted/30 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <Button disabled={isSaving} className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2">
                <Save size={18} />
                {isSaving ? "Enregistrement..." : "Enregistrer la Configuration"}
              </Button>
            </div>
          </form>

          {/* Domain Section */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm opacity-60">
            <div className="flex items-center gap-3 text-muted-foreground border-b border-border pb-6">
              <Globe size={24} />
              <h3 className="text-xl font-bold">Domaine & Accès</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/20 rounded-xl">
                <div>
                  <p className="font-bold">Sous-domaine EduSmart</p>
                  <p className="text-sm text-primary font-mono">{tenant.subdomain}.edusmart.sn</p>
                </div>
                <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider">Gérer</Button>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/20 rounded-xl border border-dashed border-border">
                <div>
                  <p className="font-bold text-muted-foreground">Domaine Personnalisé (Premium)</p>
                  <p className="text-xs">Ex: portail.uam.sn</p>
                </div>
                <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded">BIENTÔT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">Aperçu en Temps Réel</h3>
            
            {/* Mock Mobile Sidebar Preview */}
            <div className="bg-white rounded-[40px] border-[8px] border-[#1e1e1e] h-[600px] shadow-2xl overflow-hidden relative">
              <div className="h-full flex">
                <div className="w-16 h-full flex flex-col items-center py-6 gap-6" style={{ backgroundColor: tenant.primaryColor || '#4f46e5' }}>
                   <div className="w-8 h-8 bg-white/20 rounded-lg" />
                   <div className="w-8 h-8 bg-white/10 rounded-lg" />
                   <div className="w-8 h-8 bg-white/10 rounded-lg" />
                   <div className="mt-auto w-8 h-8 bg-rose-500/20 rounded-lg" />
                </div>
                <div className="flex-1 p-6 space-y-6">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="space-y-3">
                    <div className="h-32 w-full bg-muted rounded-2xl" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>
                  <Button className="w-full h-10 rounded-xl font-bold text-xs" style={{ backgroundColor: tenant.primaryColor || '#4f46e5' }}>
                    Action Principal
                  </Button>
                </div>
              </div>
              
              {/* Logo Overlay */}
              <div className="absolute top-8 left-20">
                {tenant.logoUrl ? (
                   <img src={tenant.logoUrl} className="h-8 w-auto" />
                ) : (
                  <div className="font-black italic text-lg" style={{ color: tenant.primaryColor }}>LOGO</div>
                )}
              </div>
            </div>
            
            <p className="text-center text-xs text-muted-foreground">
              Cet aperçu montre comment vos couleurs seront appliquées sur l'interface de vos utilisateurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
