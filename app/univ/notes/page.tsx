"use client"

import { useState, useEffect } from "react"
import { 
  FileSpreadsheet, 
  Save, 
  Upload, 
  Search, 
  UserCircle, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function GradeEntry() {
  const [students, setStudents] = useState<any[]>([])
  const [selectedSubject, setSelectedSubject] = useState("INF1011")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Mock students for the subject
    setStudents([
      { id: "S1", name: "Mactar Ndiaye", matricule: "UAM-24-001", grade: "" },
      { id: "S2", name: "Aminata Diallo", matricule: "UAM-24-002", grade: "" },
      { id: "S3", name: "Ibrahima Sarr", matricule: "UAM-24-003", grade: "" },
      { id: "S4", name: "Fatou Kiné", matricule: "UAM-24-004", grade: "" },
      { id: "S5", name: "Moussa Sow", matricule: "UAM-24-005", grade: "" },
    ])
  }, [])

  const handleGradeChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    if (value !== "" && (isNaN(numValue) || numValue < 0 || numValue > 20)) return
    
    setStudents(prev => prev.map(s => s.id === id ? { ...s, grade: value } : s))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert("Notes enregistrées et crédits calculés !")
    }, 1500)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Saisie des Notes</h2>
          <p className="text-muted-foreground mt-1">Interface de saisie rapide pour les professeurs.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-border h-12">
            <Upload size={18} />
            Import Excel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 min-w-[160px]"
          >
            <Save size={18} />
            {isSaving ? "Enregistrement..." : "Enregistrer tout"}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Matière (EC)</label>
          <div className="relative">
             <FileSpreadsheet className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
             <select 
               className="w-full h-12 pl-12 pr-4 bg-muted/30 border-none rounded-xl appearance-none font-bold"
               value={selectedSubject}
               onChange={(e) => setSelectedSubject(e.target.value)}
             >
                <option value="INF1011">Programmation C (UE-INF-101)</option>
                <option value="INF1012">Structure de Données (UE-INF-101)</option>
                <option value="LAN1011">Anglais Technique (UE-LAN-101)</option>
             </select>
          </div>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Semestre</label>
          <div className="h-12 flex items-center px-4 bg-muted/30 rounded-xl font-bold">
            Semestre 1 - 2024/2025
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-widest border-b border-border bg-muted/10">
                <th className="px-8 py-5 font-bold">Étudiant</th>
                <th className="px-8 py-5 font-bold">Matricule</th>
                <th className="px-8 py-5 font-bold text-center w-48">Note / 20</th>
                <th className="px-8 py-5 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student) => (
                <tr key={student.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {student.name.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="font-bold text-sm">{student.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{student.matricule}</span>
                  </td>
                  <td className="px-8 py-5">
                    <Input 
                      value={student.grade}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      placeholder="--"
                      className="h-12 text-center text-lg font-black bg-muted/20 border-none focus-visible:ring-primary rounded-xl"
                    />
                  </td>
                  <td className="px-8 py-5">
                    {student.grade !== "" ? (
                      parseFloat(student.grade) >= 10 ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 size={16} /> Validé
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
                          <AlertCircle size={16} /> Échec
                        </div>
                      )
                    ) : (
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">En attente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <p className="text-sm text-muted-foreground italic bg-muted/30 px-6 py-3 rounded-full border border-dashed border-border">
          Astuce : Utilisez la touche <b>Tab</b> pour passer rapidement d'un étudiant à l'autre.
        </p>
      </div>
    </div>
  )
}
