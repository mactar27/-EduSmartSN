import { Metadata } from "next"
import prisma from "@/lib/prisma"
import { ShieldCheck, XCircle, GraduationCap, Calendar, Hash } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ studentId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Vérification Étudiant | ${resolvedParams.studentId}`,
  }
}

export default async function VerifyPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = await params;
  
  const student = await prisma.student.findUnique({
    where: { studentId: resolvedParams.studentId },
    include: { tenant: true }
  })

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100 p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Carte Invalide</h1>
          <p className="text-gray-500">
            Ce matricule ({resolvedParams.studentId}) n'existe pas dans la base de données sécurisée. Cette carte est potentiellement falsifiée.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="bg-emerald-500 p-6 text-center text-white flex flex-col items-center">
          <ShieldCheck className="w-16 h-16 mb-2" />
          <h1 className="text-2xl font-bold">Certificat Authentique</h1>
          <p className="text-emerald-100 text-sm mt-1">Vérifié par Base de Données Souveraine</p>
        </div>
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-white shadow-lg -mt-16">
              {student.name?.split(' ').map((n: string) => n[0]).join('')}
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
            <p className="text-emerald-600 font-semibold">{student.tenant.name}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
              <Hash className="w-5 h-5 text-slate-400 mr-3" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Matricule</p>
                <p className="text-sm font-bold text-slate-700">{student.studentId}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
              <GraduationCap className="w-5 h-5 text-slate-400 mr-3" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Département</p>
                <p className="text-sm font-bold text-slate-700">{student.department || 'Général'}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-400 mr-3" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Année Universitaire</p>
                <p className="text-sm font-bold text-slate-700">2024 - 2025</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Document généré et certifié par EduSmart SN
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
