"use client"

import { useState, useEffect } from "react"
import { BookOpen, Plus, Search, BookCheck, GraduationCap, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LMDManagement() {
  const [ues, setUes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // We'll mock for now, but connect to the new models soon
    setUes([
      { id: "UE1", name: "UE Fondamentale : Algorithmique", code: "UE-INF-101", credits: 12, subjects: [
        { id: "S1", name: "Programmation C", credits: 6, code: "INF1011" },
        { id: "S2", name: "Structure de Données", credits: 6, code: "INF1012" }
      ]},
      { id: "UE2", name: "UE Transversale : Langues", code: "UE-LAN-101", credits: 6, subjects: [
        { id: "S3", name: "Anglais Technique", credits: 3, code: "LAN1011" },
        { id: "S4", name: "Techniques de Com", credits: 3, code: "LAN1012" }
      ]}
    ])
    setIsLoading(false)
  }, [])

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion Pédagogique (LMD)</h2>
          <p className="text-muted-foreground mt-1">Configurez les Unités d'Enseignement (UE) et les Matières (EC).</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus size={20} />
          Nouvelle UE
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {ues.map((ue) => (
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
          ))}
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
