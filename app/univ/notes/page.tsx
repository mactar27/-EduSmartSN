"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { 
  FileSpreadsheet, 
  Save, 
  Upload, 
  Search, 
  UserCircle, 
  CheckCircle2, 
  AlertCircle,
  Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function GradeEntry() {
  const [selectedDept, setSelectedDept] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [localGrades, setLocalGrades] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const { data: deptsData } = useSWR('/api/univ/departments', fetcher)
  const departments = deptsData?.data || []

  const { data: subjectsData } = useSWR(`/api/cours?filiere=${selectedDept !== 'all' ? encodeURIComponent(selectedDept) : ''}`, fetcher)
  const subjects = subjectsData?.data || []

  const { data: studentsData } = useSWR(`/api/univ/students?filiere=${selectedDept !== 'all' ? encodeURIComponent(selectedDept) : ''}`, fetcher)
  const students = studentsData?.data || []

  // Ensure first subject is selected when subjects load
  useEffect(() => {
    if (subjects.length > 0 && (!selectedSubject || !subjects.find((s: any) => s.id === selectedSubject))) {
      setSelectedSubject(subjects[0].id)
    }
  }, [subjects, selectedSubject])

  const handleGradeChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    if (value !== "" && (isNaN(numValue) || numValue < 0 || numValue > 20)) return
    
    setLocalGrades(prev => ({ ...prev, [id]: value }))
  }

  const handleSave = async () => {
    if (!selectedSubject) {
      alert("Veuillez sélectionner une matière d'abord.")
      return
    }

    setIsSaving(true)
    
    try {
      const gradesToSave = Object.keys(localGrades).map(studentId => ({
        studentId,
        value: parseFloat(localGrades[studentId])
      })).filter(g => !isNaN(g.value))

      if (gradesToSave.length === 0) {
        alert("Aucune note valide à enregistrer.")
        setIsSaving(false)
        return
      }

      await fetch('/api/univ/grades/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject,
          grades: gradesToSave
        })
      })

      // Envoi des notifications Push réelles
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "Nouvelle Note Disponible 🎓",
          body: `Vos résultats pour la matière sélectionnée sont en ligne.`,
          url: "/univ/dashboard"
        })
      })
      
      alert("Notes enregistrées et notifications envoyées ! 🚀")
      setLocalGrades({}) // Reset after save
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'enregistrement.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedSubject) {
      alert("Veuillez d'abord sélectionner une matière.")
      return
    }
    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string
        const lines = csv.split('\n').slice(1)
        const grades: Record<string, string> = {}
        lines.forEach(line => {
          const [matricule, note] = line.split(',')
          const student = students.find((s: any) => s.studentId === matricule?.trim())
          if (student && note?.trim()) grades[student.id] = note.trim()
        })
        setLocalGrades(prev => ({ ...prev, ...grades }))
        alert(`${Object.keys(grades).length} note(s) importée(s). Format attendu: matricule,note`)
      } catch (err) {
        alert('Format invalide. Utilisez un CSV avec colonnes: matricule,note')
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Saisie des Notes</h2>
          <p className="text-muted-foreground mt-1">Interface de saisie rapide pour les professeurs.</p>
        </div>
        <div className="flex gap-3">
          <input type="file" id="excel-import" accept=".csv" className="hidden" onChange={handleImportExcel} />
          <Button
            variant="outline"
            className="rounded-xl gap-2 border-border h-12"
            disabled={isImporting}
            onClick={() => document.getElementById('excel-import')?.click()}
          >
            <Upload size={18} />
            {isImporting ? 'Import...' : 'Import CSV'}
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
        <div className="w-full md:w-1/3 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Département / Filière</label>
          <div className="relative">
             <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
             <select 
               className="w-full h-12 pl-12 pr-4 bg-muted/30 border-none rounded-xl appearance-none font-bold"
               value={selectedDept}
               onChange={(e) => {
                 setSelectedDept(e.target.value)
                 setLocalGrades({}) // Reset grades when changing department
               }}
             >
                <option value="all">Tous les départements</option>
                {departments.map((d: any) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
             </select>
          </div>
        </div>
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Matière (EC)</label>
          <div className="relative">
             <FileSpreadsheet className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
             <select 
               className="w-full h-12 pl-12 pr-4 bg-muted/30 border-none rounded-xl appearance-none font-bold"
               value={selectedSubject}
               onChange={(e) => setSelectedSubject(e.target.value)}
             >
                {subjects.length === 0 && <option value="">Aucune matière disponible</option>}
                {subjects.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
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
                <th className="px-8 py-5 font-bold">Élève</th>
                <th className="px-8 py-5 font-bold">Matricule</th>
                <th className="px-8 py-5 font-bold text-center w-48">Note / 20</th>
                <th className="px-8 py-5 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-muted-foreground">Aucun élève trouvé.</td>
                </tr>
              ) : students.map((student: any) => {
                const grade = localGrades[student.id] !== undefined ? localGrades[student.id] : "";
                
                return (
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
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{student.studentId || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <Input 
                        value={grade}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        placeholder="--"
                        className="h-12 text-center text-lg font-black bg-muted/20 border-none focus-visible:ring-primary rounded-xl"
                      />
                    </td>
                    <td className="px-8 py-5">
                      {grade !== "" ? (
                        parseFloat(grade) >= 10 ? (
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <p className="text-sm text-muted-foreground italic bg-muted/30 px-6 py-3 rounded-full border border-dashed border-border">
          Astuce : Utilisez la touche <b>Tab</b> pour passer rapidement d'un élève à l'autre.
        </p>
      </div>
    </div>
  )
}

