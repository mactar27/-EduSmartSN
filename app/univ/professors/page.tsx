"use client"

import { useState } from "react"
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  MoreVertical, 
  BookOpen, 
  GraduationCap,
  BadgeCheck,
  Calendar,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const MOCK_PROFESSORS = [
  {
    id: 1,
    name: "Dr. Amadou Diallo",
    role: "Professeur Titulaire",
    department: "Informatique",
    email: "a.diallo@edusmart.sn",
    phone: "+221 77 123 45 67",
    courses: 4,
    status: "Active",
    avatar: "/avatars/prof1.png"
  },
  {
    id: 2,
    name: "Mme. Mariama Ba",
    role: "Maître de Conférences",
    department: "Mathématiques",
    email: "m.ba@edusmart.sn",
    phone: "+221 77 987 65 43",
    courses: 3,
    status: "On Leave",
    avatar: "/avatars/prof2.png"
  },
  {
    id: 3,
    name: "Dr. Moussa Sarr",
    role: "Assistant",
    department: "Physique",
    email: "m.sarr@edusmart.sn",
    phone: "+221 76 543 21 00",
    courses: 5,
    status: "Active",
    avatar: "/avatars/prof3.png"
  }
];

export default function ProfessorsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Corps Professoral</h2>
          <p className="text-muted-foreground mt-1">Gérez vos enseignants et leurs attributions pédagogiques.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus size={18} />
          Ajouter un Professeur
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            placeholder="Rechercher un professeur (nom, département, email...)" 
            className="pl-12 h-12 bg-card border-border rounded-xl focus-visible:ring-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl gap-2 border-border bg-card shadow-sm">
          <Filter size={18} />
          Filtres
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROFESSORS.map((prof) => (
          <Card key={prof.id} className="group overflow-hidden border-border bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-[2rem]">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary overflow-hidden relative">
                    {prof.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{prof.name}</h3>
                    <p className="text-sm text-primary font-medium">{prof.role}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                  <span>Département {prof.department}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <span className="truncate">{prof.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <span>{prof.phone}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
                    {prof.courses} Cours assignés
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  prof.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                )}>
                  {prof.status === "Active" ? "Actif" : "En Congé"}
                </div>
              </div>

              <Button variant="ghost" className="w-full h-10 rounded-xl hover:bg-primary hover:text-white transition-all font-bold group">
                Consulter le Dossier
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Professeurs", value: "48", icon: Users, color: "bg-emerald-500" },
          { label: "Charges Horaires", value: "1,240h", icon: Calendar, color: "bg-emerald-500" },
          { label: "Départements", value: "8", icon: BookOpen, color: "bg-amber-500" },
          { label: "Taux Occupation", value: "88%", icon: TrendingUp, color: "bg-rose-500" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 border-border bg-card rounded-2xl flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
