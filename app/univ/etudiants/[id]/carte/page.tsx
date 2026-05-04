"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"

export default function StudentCardPage() {
  const { id } = useParams()
  const [student, setStudent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      // In a real app we'd have a specific GET /api/students/[id]
      const res = await fetch(`/api/univ/students`)
      const data = await res.json()
      const found = data.data.find((s: any) => s.id === id)
      setStudent(found)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-20 text-center">Génération de la carte...</div>
  if (!student) return <div className="p-20 text-center text-red-500">Élève non trouvé.</div>

  const publicProfileUrl = `https://edusmartsn.vercel.app/verify/${student.studentId}`

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/univ/etudiants">
            <Button variant="ghost" className="p-2 rounded-full h-10 w-10">
              <ArrowLeft size={24} />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Carte d'Identité Scolaire</h2>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-border gap-2" onClick={() => window.print()}>
            <Printer size={18} />
            Imprimer
          </Button>
          <Button className="bg-primary rounded-xl font-bold shadow-lg shadow-primary/20 gap-2">
            <Download size={18} />
            Télécharger PNG
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-12">
        {/* Front of Card */}
        <div className="relative w-[500px] h-[315px] bg-[#0f172a] rounded-[24px] overflow-hidden shadow-2xl border border-white/10 text-white print:shadow-none">
          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 h-2 bg-primary" />
          
          <div className="p-8 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo" width={100} height={35} className="h-8 w-auto brightness-0 invert" />
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Carte Élève Officielle</p>
                <p className="text-[10px] text-white/50">Année 2024 - 2025</p>
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/20 bg-white/5 shadow-inner">
                <Image 
                  src={student.photoUrl || "https://ui-avatars.com/api/?name=" + student.name} 
                  alt={student.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-2xl font-black tracking-tight">{student.name}</h3>
                <p className="text-primary font-bold tracking-widest text-sm uppercase">{student.studentId}</p>
                <div className="pt-2">
                   <p className="text-[10px] uppercase text-white/40 font-bold tracking-tighter">Département</p>
                   <p className="text-sm font-semibold">{student.department || "Enseignement Général"}</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl">
                <QRCodeSVG value={publicProfileUrl} size={70} level="H" />
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-4">
              <div>
                <p className="text-[8px] text-white/30 uppercase font-bold">Valide jusqu'au</p>
                <p className="text-xs font-bold">31 Décembre 2025</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-white/30 uppercase font-bold">Établissement Emmetteur</p>
                <p className="text-xs font-bold italic">Université Amadou Mahtar Mbow</p>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
        </div>

        <div className="bg-muted/50 p-6 rounded-2xl border border-border max-w-lg text-center space-y-2">
           <p className="text-sm font-semibold flex items-center justify-center gap-2">
             <Share2 size={16} className="text-primary" />
             Lien de vérification publique :
           </p>
           <code className="text-xs bg-card px-3 py-1 rounded-lg border border-border block truncate">
             {publicProfileUrl}
           </code>
           <p className="text-[10px] text-muted-foreground italic">
             Scannez le QR Code pour vérifier l'authenticité de cette carte sur n'importe quel smartphone.
           </p>
        </div>
      </div>
    </div>
  )
}
