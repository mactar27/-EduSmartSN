"use client"

import { useState } from "react"
import useSWR from "swr"
import { BookOpen, Plus, Search, BookCheck, GraduationCap, ChevronRight, Building, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function LMDManagement() {
  const [selectedDept, setSelectedDept] = useState("all")
  const [isUeModalOpen, setIsUeModalOpen] = useState(false)
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false)
  const [targetUeId, setTargetUeId] = useState<string>("")
  const [isCreatingUe, setIsCreatingUe] = useState(false)
  const [isCreatingSubject, setIsCreatingSubject] = useState(false)
  const [ueFormData, setUeFormData] = useState({ name: "", code: "", departmentId: "" })
  const [subjectFormData, setSubjectFormData] = useState({ name: "", code: "", credits: "", coefficient: "1.0", ueId: "" })

  const { data: deptsData, mutate: mutateDepts } = useSWR('/api/univ/departments', fetcher)
  const departments = deptsData?.data || []

  const { data: coursData, isLoading, mutate: mutateCours } = useSWR(`/api/cours?filiere=${selectedDept !== 'all' ? encodeURIComponent(selectedDept) : ''}`, fetcher)
  const ues = coursData?.data || []

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClassName.trim()) return

    setIsCreating(true)
    try {
      const res = await fetch('/api/univ/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClassName })
      })

      if (res.ok) {
        alert("Classe créée avec succès !")
        setNewClassName("")
        setIsModalOpen(false)
        mutateDepts() // Rafraîchir la liste des classes
      } else {
        const errorData = await res.json()
        alert(`Erreur: ${errorData.error}`)
      }
    } catch (error) {
      console.error(error)
      alert("Une erreur est survenue lors de la création de la classe.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateUe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingUe(true)
    try {
      const res = await fetch('/api/univ/ue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ueFormData)
      })

      if (res.ok) {
        alert("UE créée avec succès !")
        setUeFormData({ name: "", code: "", departmentId: "" })
        setIsUeModalOpen(false)
        mutateCours()
      } else {
        const errorData = await res.json()
        alert(`Erreur: ${errorData.error}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsCreatingUe(false)
    }
  }

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingSubject(true)
    try {
      const res = await fetch('/api/univ/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...subjectFormData, ueId: targetUeId })
      })

      if (res.ok) {
        alert("Matière créée avec succès !")
        setSubjectFormData({ name: "", code: "", credits: "", coefficient: "1.0", ueId: "" })
        setIsSubjectModalOpen(false)
        mutateCours()
      } else {
        const errorData = await res.json()
        alert(`Erreur: ${errorData.error}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsCreatingSubject(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion Pédagogique (LMD)</h2>
          <p className="text-muted-foreground mt-1">Configurez les Unités d'Enseignement (UE) et les Matières (EC).</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="outline" 
            className="h-12 rounded-xl gap-2 font-bold border-primary text-primary hover:bg-primary/5"
          >
            <Plus size={20} />
            Nouvelle Classe
          </Button>
          <div className="relative w-64">
             <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
             <select 
               className="w-full h-12 pl-12 pr-4 bg-card border-border rounded-xl appearance-none font-bold shadow-sm"
               value={selectedDept}
               onChange={(e) => setSelectedDept(e.target.value)}
             >
                <option value="all">Tous les départements</option>
                {departments.map((d: any) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
             </select>
          </div>
          <Button 
            onClick={() => setIsUeModalOpen(true)}
            className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            Nouvelle UE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="p-10 text-center text-muted-foreground">Chargement des matières...</div>
          ) : ues.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground bg-card border border-border rounded-3xl">Aucune matière configurée pour ce département.</div>
          ) : (
            ues.map((ue: any) => (
              <Card key={ue.id} className="p-0 overflow-hidden border-border rounded-3xl shadow-sm hover:shadow-md transition-all">
                <div className="bg-muted/30 p-6 flex justify-between items-center border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{ue.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{ue.code} • {ue.filiere}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">{ue.credits}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Crédits ECTS</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {ue.subjects?.map((subject: any) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-8 bg-muted rounded-full group-hover:bg-primary transition-colors" />
                          <div>
                            <p className="font-bold text-sm">{subject.name}</p>
                            <p className="text-[10px] text-muted-foreground">{subject.code}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center w-16">
                            <p className="font-bold">{subject.credits}</p>
                            <p className="text-[10px] text-muted-foreground italic">Crédits</p>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-primary/10 group-hover:text-primary">
                            <ChevronRight size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => { setTargetUeId(ue.id); setIsSubjectModalOpen(true); }}
                    variant="ghost" 
                    className="w-full mt-4 border border-dashed border-border rounded-2xl py-6 text-muted-foreground hover:text-primary hover:bg-primary/5 gap-2"
                  >
                    <Plus size={18} />
                    Ajouter une Matière (EC)
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
           <Card className="p-8 rounded-3xl border-border space-y-6 bg-primary text-white shadow-xl shadow-primary/20">
              <div className="flex items-center gap-3">
                <BookCheck size={32} />
                <h3 className="text-xl font-bold">Règle de Validation</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-xs uppercase font-black tracking-widest opacity-60">Moyenne de Validation</p>
                  <p className="text-3xl font-black">10.00 / 20</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl">
                  <p className="text-xs uppercase font-black tracking-widest opacity-60">Compensation UE</p>
                  <p className="text-lg font-bold">Activée</p>
                  <p className="text-[10px] opacity-70">Les matières d'une même UE se compensent entre elles.</p>
                </div>
              </div>
           </Card>

           <Card className="p-8 rounded-3xl border-border bg-card shadow-sm border-dashed border-2">
              <h4 className="font-bold mb-4">Aide au Paramétrage</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  Une UE doit totaliser 30 crédits par semestre.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  Les crédits sont acquis si la moyenne de l'UE ≥ 10.
                </li>
              </ul>
           </Card>
        </div>
      </div>

      {/* Modal Nouvelle Classe */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl p-6 relative animate-in slide-in-from-bottom-4">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-muted rounded-full hover:bg-muted-foreground/20 transition-colors">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Nouvelle Classe</h3>
              <p className="text-muted-foreground text-sm">Créez une nouvelle filière ou département.</p>
            </div>
            <form onSubmit={handleCreateClass} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Nom de la Classe</label>
                <Input placeholder="Ex: Licence 1 Informatique" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} className="h-12 rounded-xl bg-muted/30" required />
              </div>
              <Button type="submit" disabled={isCreating} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                {isCreating ? 'Création...' : 'Créer la classe'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nouvelle UE */}
      {isUeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl p-6 relative animate-in slide-in-from-bottom-4">
            <button onClick={() => setIsUeModalOpen(false)} className="absolute top-4 right-4 p-2 bg-muted rounded-full hover:bg-muted-foreground/20 transition-colors">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Nouvelle UE</h3>
              <p className="text-muted-foreground text-sm">Créez une Unité d'Enseignement.</p>
            </div>
            <form onSubmit={handleCreateUe} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Nom de l'UE</label>
                <Input placeholder="Ex: Mathématiques Appliquées" value={ueFormData.name} onChange={(e) => setUeFormData({...ueFormData, name: e.target.value})} className="h-12 rounded-xl bg-muted/30" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Code (ex: UE-MATH)</label>
                <Input placeholder="Ex: UE-MATH" value={ueFormData.code} onChange={(e) => setUeFormData({...ueFormData, code: e.target.value})} className="h-12 rounded-xl bg-muted/30" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Classe associée</label>
                <select className="w-full h-12 px-4 bg-muted/30 border border-input rounded-xl appearance-none font-bold text-sm" value={ueFormData.departmentId} onChange={(e) => setUeFormData({...ueFormData, departmentId: e.target.value})} required>
                  <option value="">Sélectionner une classe</option>
                  {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <Button type="submit" disabled={isCreatingUe} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                {isCreatingUe ? 'Création...' : 'Créer l\'UE'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Matière */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl p-6 relative animate-in slide-in-from-bottom-4">
            <button onClick={() => setIsSubjectModalOpen(false)} className="absolute top-4 right-4 p-2 bg-muted rounded-full hover:bg-muted-foreground/20 transition-colors">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Nouvelle Matière (EC)</h3>
              <p className="text-muted-foreground text-sm">Ajoutez une matière à l'UE.</p>
            </div>
            <form onSubmit={handleCreateSubject} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Nom</label>
                <Input placeholder="Ex: Algèbre Linéaire" value={subjectFormData.name} onChange={(e) => setSubjectFormData({...subjectFormData, name: e.target.value})} className="h-12 rounded-xl bg-muted/30" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Code</label>
                <Input placeholder="Ex: ALG101" value={subjectFormData.code} onChange={(e) => setSubjectFormData({...subjectFormData, code: e.target.value})} className="h-12 rounded-xl bg-muted/30" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Crédits ECTS</label>
                  <Input type="number" min="0" placeholder="Ex: 4" value={subjectFormData.credits} onChange={(e) => setSubjectFormData({...subjectFormData, credits: e.target.value})} className="h-12 rounded-xl bg-muted/30" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Coefficient</label>
                  <Input type="number" step="0.1" min="0.1" placeholder="Ex: 1.5" value={subjectFormData.coefficient} onChange={(e) => setSubjectFormData({...subjectFormData, coefficient: e.target.value})} className="h-12 rounded-xl bg-muted/30" required />
                </div>
              </div>
              <Button type="submit" disabled={isCreatingSubject} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                {isCreatingSubject ? 'Création...' : 'Créer la Matière'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

