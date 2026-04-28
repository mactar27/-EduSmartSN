"use client"

import { useState, useEffect } from "react"
import { Printer, Download, CheckCircle, Award, FileText, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { QRCodeSVG } from "qrcode.react"

export default function StudentTranscript() {
  const [student, setStudent] = useState<any>(null)
  const [tenant, setTenant] = useState<any>(null)

  useEffect(() => {
    // Mock data for the transcript
    setStudent({
      id: "S1",
      name: "Mactar Ndiaye",
      matricule: "UAM-2024-001",
      department: "Génie Informatique",
      level: "Licence 1",
      semester: "Semestre 1",
      results: [
        { ue: "UE-INF-101", name: "Fondamentale Informatique", credits: 12, subjects: [
          { name: "Programmation C", note: 14.5, credits: 6, isResit: false },
          { name: "Structure de Données", note: 12.0, credits: 6, isResit: false }
        ], get moyenne() {
          const totalPoints = this.subjects.reduce((acc: number, s: any) => acc + (s.note * s.credits), 0);
          return totalPoints / this.credits;
        }, status: "Validé" },
        { ue: "UE-MAT-101", name: "Mathématiques Appliquées", credits: 12, subjects: [
          { name: "Analyse 1", note: 8.0, credits: 6, isResit: false },
          { name: "Algèbre Linéaire", note: 11.5, credits: 6, isResit: true } // Resit note replacing old one
        ], get moyenne() {
          const totalPoints = this.subjects.reduce((acc: number, s: any) => acc + (s.note * s.credits), 0);
          return totalPoints / this.credits;
        }, status: "Compensation" },
        { ue: "UE-LAN-101", name: "Langues & Com", credits: 6, subjects: [
          { name: "Anglais Technique", note: 16.0, credits: 3, isResit: false },
          { name: "Français", note: 11.0, credits: 3, isResit: false }
        ], get moyenne() {
          const totalPoints = this.subjects.reduce((acc: number, s: any) => acc + (s.note * s.credits), 0);
          return totalPoints / this.credits;
        }, status: "Validé" }
      ],
      get totalMoyenne() {
        const totalPoints = this.results.reduce((acc: number, ue: any) => acc + (ue.moyenne * ue.credits), 0);
        const totalCredits = this.results.reduce((acc: number, ue: any) => acc + ue.credits, 0);
        return (totalPoints / totalCredits).toFixed(2);
      },
      totalCredits: 30
    })
    
    fetch('/api/univ/stats')
      .then(res => res.json())
      .then(data => setTenant(data.tenant));
  }, [])

  if (!student) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-2xl font-bold">Aperçu du Relevé de Notes</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-border" onClick={() => window.print()}>
            <Printer size={18} />
            Imprimer
          </Button>
          <Button className="bg-primary rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold">
            <Download size={18} />
            Télécharger PDF
          </Button>
        </div>
      </div>

      <div className="bg-white text-black p-12 rounded-[2rem] shadow-2xl border border-slate-200 max-w-5xl mx-auto relative overflow-hidden font-serif print:shadow-none print:border-none print:p-0">
        {/* Dynamic Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-[-30deg]">
          <h1 className="text-[150px] font-black uppercase">{tenant?.name || 'EDUSMART'}</h1>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 relative">
          <div className="space-y-4">
             <img src={tenant?.logoUrl || "/logo.png"} className="h-16 w-auto" alt="Logo University" />
             <div>
                <p className="font-black text-xl uppercase">{tenant?.name || 'Université Amadou Mahtar Mbow'}</p>
                <p className="text-xs font-bold italic">Souveraineté • Excellence • Innovation</p>
             </div>
          </div>
          <div className="text-right space-y-1">
             <h1 className="text-3xl font-black uppercase tracking-tighter">Relevé de Notes</h1>
             <p className="font-bold text-sm">Session Principale - 2024/2025</p>
             <p className="text-[10px] bg-slate-100 px-2 py-1 rounded inline-block">Réf: RN-{student.id}-2024-S1</p>
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 gap-8 my-10 py-6 border-y border-slate-200 bg-slate-50/50 px-6 rounded-2xl relative">
           <div className="space-y-2">
              <p className="text-xs uppercase text-slate-500 font-bold">Informations Étudiant</p>
              <p className="text-xl font-bold">{student.name}</p>
              <p className="text-sm font-medium">Matricule : <span className="font-bold">{student.matricule}</span></p>
              <p className="text-sm">Né(e) le : 12/05/2004</p>
           </div>
           <div className="space-y-2 text-right">
              <p className="text-xs uppercase text-slate-500 font-bold">Cursus Académique</p>
              <p className="text-lg font-bold">{student.department}</p>
              <p className="text-sm font-bold text-slate-700">{student.level} - {student.semester}</p>
           </div>
        </div>

        {/* Grades Table */}
        <div className="relative">
           <table className="w-full border-collapse">
              <thead>
                 <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-widest">
                    <th className="p-3 text-left">Unités d'Enseignement (UE) / Matières (EC)</th>
                    <th className="p-3 text-center">Note / 20</th>
                    <th className="p-3 text-center">Crédits</th>
                    <th className="p-3 text-center">Résultat</th>
                 </tr>
              </thead>
              <tbody className="text-sm">
                 {student.results.map((ue: any, idx: number) => (
                    <>
                       <tr key={`ue-${idx}`} className="bg-slate-100 font-black border-y border-slate-300">
                          <td className="p-3">{ue.ue} : {ue.name}</td>
                          <td className="p-3 text-center">{ue.moyenne.toFixed(2)}</td>
                          <td className="p-3 text-center">{ue.credits}</td>
                          <td className="p-3 text-center">
                             <span className={ue.moyenne >= 10 ? "text-emerald-700" : "text-rose-700"}>{ue.status}</span>
                          </td>
                       </tr>
                       {ue.subjects.map((subject: any, sIdx: number) => (
                          <tr key={`sub-${idx}-${sIdx}`} className="border-b border-slate-100">
                             <td className="p-3 pl-10 text-slate-600 font-medium italic">{subject.name}</td>
                             <td className="p-3 text-center font-bold">
                                {subject.note.toFixed(2)}
                                {subject.isResit && <span className="ml-1 text-[8px] bg-amber-100 text-amber-700 px-1 rounded">R</span>}
                             </td>
                             <td className="p-3 text-center text-slate-500">{subject.credits}</td>
                             <td className="p-3"></td>
                          </tr>
                       ))}
                    </>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Footer Summary */}
        <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t-2 border-slate-900">
           <div className="col-span-2 space-y-4">
              <div className="flex gap-10">
                 <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 min-w-[150px]">
                    <p className="text-[10px] uppercase font-black text-slate-500">Moyenne Générale</p>
                    <p className="text-3xl font-black text-slate-900">{student.totalMoyenne}</p>
                 </div>
                 <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 min-w-[150px]">
                    <p className="text-[10px] uppercase font-black text-slate-500">Crédits Capitalisés</p>
                    <p className="text-3xl font-black text-emerald-600">{student.totalCredits} / 30</p>
                 </div>
              </div>
              <div className="pt-4">
                 <p className="text-xs"><strong>Décision du Jury :</strong> ADMIS AU SEMESTRE 2</p>
                 <p className="text-[10px] text-slate-500 mt-1">Fait à Dakar, le 28 Avril 2026</p>
              </div>
           </div>
           
           <div className="text-right flex flex-col items-end justify-between">
              <div className="p-2 border-2 border-slate-900 rounded-xl">
                 <QRCodeSVG 
                    value={`https://edusmartsn.vercel.app/verify/transcript/${student.id}`}
                    size={80}
                 />
                 <p className="text-[8px] font-bold text-center mt-1 uppercase">Vérifier l'authenticité</p>
              </div>
              <div className="space-y-1">
                 <p className="text-xs font-bold uppercase underline">Le Recteur</p>
                 <div className="h-16 italic font-serif text-slate-400">Signature & Cachet</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
