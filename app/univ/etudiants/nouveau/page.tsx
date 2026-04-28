"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, UserCircle } from "lucide-react"
import Link from "next/link"

export default function NewStudentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    department: "",
    photoUrl: "",
    birthDate: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/univ/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        router.push('/univ/etudiants')
      } else {
        alert("Erreur lors de la création")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/univ/etudiants">
          <Button variant="ghost" className="p-2 rounded-full h-10 w-10">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Nouvelle Inscription</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 bg-muted rounded-full flex items-center justify-center border-4 border-dashed border-border group hover:border-primary transition-colors cursor-pointer overflow-hidden">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={64} className="text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Ajouter Photo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">Nom Complet</label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Mactar Ndiaye" 
              required 
              className="rounded-xl h-12 bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Numéro de Matricule</label>
            <Input 
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              placeholder="Ex: UAM-2024-123" 
              required 
              className="rounded-xl h-12 bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Département / Faculté</label>
            <Input 
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              placeholder="Ex: Informatique" 
              className="rounded-xl h-12 bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">URL de la Photo</label>
            <Input 
              value={formData.photoUrl}
              onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
              placeholder="Lien vers une image" 
              className="rounded-xl h-12 bg-muted/30"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-emerald-200 gap-2 mt-4"
        >
          <Save size={20} />
          {isLoading ? "Enregistrement..." : "Valider l'inscription"}
        </Button>
      </form>
    </div>
  )
}
