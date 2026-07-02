"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, UserCircle, Building } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function NewStudentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
    photoUrl: "",
    birthDate: ""
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  const { data: deptsData } = useSWR('/api/univ/departments', fetcher)
  const departments = deptsData?.data || []

  // Ensure department is set to the first one by default if not set
  if (departments.length > 0 && !formData.department) {
    setFormData(prev => ({ ...prev, department: departments[0].name }))
  }

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
          <label className="relative w-32 h-32 bg-muted rounded-full flex items-center justify-center border-4 border-dashed border-border group hover:border-primary transition-colors cursor-pointer overflow-hidden">
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Show immediate preview
                  setPhotoPreview(URL.createObjectURL(file));
                  setIsUploadingPhoto(true);
                  try {
                    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                      method: 'POST',
                      body: file,
                    });
                    const blob = await res.json();
                    if (blob.url) setFormData({ ...formData, photoUrl: blob.url });
                  } catch (err) {
                    console.error('Photo upload failed:', err);
                  } finally {
                    setIsUploadingPhoto(false);
                  }
                }
              }}
            />
            {photoPreview || formData.photoUrl ? (
              <img src={photoPreview || formData.photoUrl} className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={64} className="text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">Importer Photo</span>
            </div>
          </label>
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
            <label className="text-sm font-bold">Adresse Email</label>
            <Input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Ex: etudiant@edusmart.sn" 
              required 
              className="rounded-xl h-12 bg-muted/30"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold">Classe / Département</label>
            <div className="relative">
               <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
               <select 
                 className="w-full h-12 pl-10 pr-4 bg-muted/30 border-border rounded-xl appearance-none"
                 value={formData.department}
                 onChange={(e) => setFormData({...formData, department: e.target.value})}
                 required
               >
                  {departments.length === 0 ? (
                    <option value="">Aucune classe trouvée</option>
                  ) : (
                    departments.map((d: any) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))
                  )}
               </select>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || departments.length === 0}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 gap-2 mt-4"
        >
          <Save size={20} />
          {isLoading ? "Enregistrement..." : "Valider l'inscription"}
        </Button>
      </form>
    </div>
  )
}
