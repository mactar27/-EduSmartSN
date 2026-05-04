"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Calendar, FileText, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a2e26] text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-xl">E</div>
          <span className="text-xl font-bold tracking-tight">EduSmart <span className="text-emerald-400">SN</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="#" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors">
            <BookOpen size={20} />
            <span>Mes Cours</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors">
            <Calendar size={20} />
            <span>Emploi du Temps</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors">
            <FileText size={20} />
            <span>Notes & Bulletins</span>
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-emerald-200 hover:text-white transition-colors mt-auto"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Bienvenue, Modou !</h1>
            <p className="text-slate-500">Voici un aperçu de votre situation académique.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-800">Modou Ndiaye</p>
              <p className="text-xs text-slate-500">Matricule: MAT-38659</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">Cours inscrits</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">12</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">Moyenne Générale</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">15.8 / 20</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">Prochain examen</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">Dans 3 jours</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Emploi du temps du jour</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-16 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase">08:00</p>
                <p className="text-xs font-bold text-slate-400 uppercase">10:00</p>
              </div>
              <div className="w-1 h-10 bg-emerald-500 rounded-full" />
              <div>
                <h4 className="font-bold text-slate-800">Algorithmique Avancée</h4>
                <p className="text-sm text-slate-500">Salle 104 • Dr. Diop</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
              <div className="w-16 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase">10:15</p>
                <p className="text-xs font-bold text-slate-400 uppercase">12:15</p>
              </div>
              <div className="w-1 h-10 bg-blue-500 rounded-full" />
              <div>
                <h4 className="font-bold text-slate-800">Base de Données SQL</h4>
                <p className="text-sm text-slate-500">Salle 202 • Prof. Ndiaye</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
