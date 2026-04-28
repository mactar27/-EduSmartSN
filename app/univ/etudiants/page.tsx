"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  UserPlus, 
  Search, 
  CreditCard, 
  MoreVertical, 
  Printer,
  ChevronRight,
  FileSpreadsheet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

export default function StudentListPage() {
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/univ/students')
      const data = await res.json()
      if (data.data) {
        setStudents(data.data)
      } else {
        setStudents([])
      }
    } catch (error) {
      console.error("Failed to fetch students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          name: values[0],
          email: values[1],
          studentId: values[2] || `SN-${Math.random().toString(36).slice(-5).toUpperCase()}`,
          department: values[3] || 'Général'
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
          fetchStudents();
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'importation.");
      } finally {
        setIsLoading(false);
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
            className="h-12 rounded-xl gap-2 font-bold border-primary text-primary hover:bg-primary/5"
            onClick={() => document.getElementById('csv-import')?.click()}
          >
            <FileSpreadsheet size={20} />
            Import CSV
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
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input className="pl-10 h-12 bg-muted/30 border-border rounded-xl" placeholder="Rechercher par nom, matricule ou département..." />
        </div>
        <Button variant="outline" className="h-12 rounded-xl px-6 font-bold border-border gap-2">
          <Printer size={18} />
          Impression Groupée
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">Chargement des élèves réels...</div>
        ) : students.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Users size={40} />
            </div>
            <p className="text-muted-foreground italic">Aucun élève inscrit pour le moment.</p>
            <Link href="/univ/etudiants/nouveau">
              <Button variant="link" className="text-primary font-bold">Inscrire votre premier élève</Button>
            </Link>
          </div>
        ) : (
          students.map((student) => (
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
                    <span className="text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-lg text-[10px] uppercase">Actif</span>
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
