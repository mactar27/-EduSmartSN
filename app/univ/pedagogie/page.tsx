"use client"

import { useState } from "react"
import useSWR from "swr"
import { BookOpen, Plus, Search, BookCheck, GraduationCap, ChevronRight, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function LMDManagement() {
  const [selectedDept, setSelectedDept] = useState("all")

  const { data: deptsData } = useSWR('/api/univ/departments', fetcher)
  const departments = deptsData?.data || []

  const { data: coursData, isLoading } = useSWR(`/api/cours?filiere=${selectedDept !== 'all' ? encodeURIComponent(selectedDept) : ''}`, fetcher)
  const subjects = coursData?.data || []

  // Group subjects by UE
  const uesMap = new Map()
  subjects.forEach((sub: any) => {
    // In our simplified API we don't return UE details directly, but we can group them
    // Wait, the API returns subjects, let's group by "etablissement_name" or "filiere" 
    // Ideally we'd have ue_name, but since we didn't add it in API, let's fake the UE grouping based on code prefix or just group all subjects under one UE for demo if needed.
    // Let's modify the grouping logic to group by a fake UE or if the subject has UE info.
    // The subject API returns: id, code, name, credits, coefficient, etablissement_name, filiere.
    // We'll group them under one "UE de " + filiere for the UI.
    const ueKey = sub.filiere || 'Général'
    if (!uesMap.has(ueKey)) {
      uesMap.set(ueKey, {
        id: ueKey,
        name: `UE : ${ueKey}`,
        code: `UE-${ueKey.substring(0,3).toUpperCase()}`,
        credits: 0,
        subjects: []
      })
    }
    const ue = uesMap.get(ueKey)
    ue.subjects.push(sub)
    ue.credits += sub.credits
  })

  const ues = Array.from(uesMap.values())

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion Pédagogique (LMD)</h2>
          <p className="text-muted-foreground mt-1">Configurez les Unités d'Enseignement (UE) et les Matières (EC).</p>
        </div>
        <div className="flex gap-4">
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
          <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
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
                      <p className="text-xs text-muted-foreground font-mono">{ue.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">{ue.credits}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Crédits ECTS</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {ue.subjects.map((subject: any) => (
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
                  <Button variant="ghost" className="w-full mt-4 border border-dashed border-border rounded-2xl py-6 text-muted-foreground hover:text-primary hover:bg-primary/5 gap-2">
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
    </div>
  )
}

