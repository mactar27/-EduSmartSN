"use client"

import { useState } from "react"
import useSWR from "swr"
import { 
  Users, 
  UserPlus, 
  Search, 
  CreditCard, 
  MoreVertical, 
  Printer,
  ChevronRight,
  FileSpreadsheet,
  Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function StudentListPage() {
  const [selectedDept, setSelectedDept] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isImporting, setIsImporting] = useState(false)

  const { data: deptsData } = useSWR('/api/univ/departments', fetcher)
  const departments = deptsData?.data || []

  const { data: studentsData, isLoading, mutate } = useSWR(`/api/univ/students?filiere=${selectedDept !== 'all' ? encodeURIComponent(selectedDept) : ''}`, fetcher)
  const students = studentsData?.data || []

  const filteredStudents = students.filter((s: any) => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExportCSV = () => {
    const rows = [
      ['Nom', 'Email', 'Matricule', 'Département', 'Statut'],
      ...filteredStudents.map((s: any) => [s.name, s.email, s.studentId, s.department, s.statut])
    ]
    const csv = rows.map(r => r.map((v: string) => `"${v || ''}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `etudiants_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          name: values[0],
          email: values[1],
          studentId: values[2] || `SN-${Math.random().toString(36).slice(-5).toUpperCase()}`,
          department: values[3] || (selectedDept !== 'all' ? selectedDept : 'Général')
        };
      }).filter(item => item.name);

      try {
        const res = await fetch('/api/univ/students/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students: data })
        });

        if (res.ok) {
          alert(`${data.length} élèves importés avec succès !`);
          mutate(); // re-fetch students
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'importation.");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Élèves</h2>
          <p className="text-muted-foreground mt-1">Gérez les dossiers et générez les cartes d'identité biométriques.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            id="csv-import" 
            accept=".csv" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <Button 
            variant="outline" 
            disabled={isImporting}
            className="h-12 rounded-xl gap-2 font-bold border-primary text-primary hover:bg-primary/5"
            onClick={() => document.getElementById('csv-import')?.click()}
          >
            <FileSpreadsheet size={20} />
            {isImporting ? 'Importation...' : 'Import CSV'}
          </Button>
          <Link href="/univ/etudiants/nouveau">
            <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
              <UserPlus size={20} />
              Inscrire un élève
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full md:max-w-xs">
           <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
           <select 
             className="w-full h-12 pl-10 pr-4 bg-muted/30 border-border rounded-xl appearance-none font-bold"
             value={selectedDept}
             onChange={(e) => setSelectedDept(e.target.value)}
           >
              <option value="all">Toutes les classes</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
           </select>
        </div>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            className="pl-10 h-12 bg-muted/30 border-border rounded-xl" 
            placeholder="Rechercher par nom, matricule ou département..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl px-6 font-bold border-border gap-2" onClick={handleExportCSV}>
          <Printer size={18} />
          Impression Groupée
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground font-medium">Chargement des élèves...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Users size={40} />
            </div>
            <p className="text-muted-foreground italic">Aucun élève trouvé pour cette sélection.</p>
            {searchTerm === "" && (
              <Link href="/univ/etudiants/nouveau">
                <Button variant="link" className="text-primary font-bold">Inscrire un premier élève</Button>
              </Link>
            )}
          </div>
        ) : (
          filteredStudents.map((student: any) => (
            <div key={student.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-muted border-2 border-primary/20">
                    <Image 
                      src={student.photoUrl || student.photo_url || "https://ui-avatars.com/api/?name=" + (student.name || "E")} 
                      alt={student.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{student.name || "Sans Nom"}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{student.studentId || student.student_id}</p>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <MoreVertical size={20} className="text-muted-foreground" />
                  </button>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Département</span>
                    <span className="font-semibold">{student.department || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-lg text-[10px] uppercase">{student.statut || "Actif"}</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Link href={`/univ/etudiants/${student.id}/carte`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl gap-2 font-bold h-10 text-sm">
                      <CreditCard size={16} />
                      Générer Carte
                    </Button>
                  </Link>
                  <Button variant="outline" className="rounded-xl border-border hover:bg-muted px-3">
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
