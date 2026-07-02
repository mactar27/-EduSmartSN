"use client"

import { useState } from "react"
import useSWR from "swr"
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  MoreVertical, 
  BookOpen, 
  TrendingUp,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProfessorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, error, isLoading } = useSWR('/api/univ/professors', fetcher)

  const professors = data?.data || [];
  const stats = data?.stats || {
    totalProfessors: 0,
    totalHours: "0h",
    departments: 0,
    occupancyRate: "0%"
  };

  const filteredProfessors = professors.filter((prof: any) => 
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    prof.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessors.map((prof: any) => (
            <Card key={prof.id} className="group overflow-hidden border-border bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-[2rem]">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary overflow-hidden relative">
                      {prof.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{prof.name}</h3>
                      <p className="text-sm text-primary font-medium">{prof.role === 'SUPER_ADMIN' ? 'Admin' : prof.role}</p>
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
                    <span>Spécialisation: {prof.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <span className="truncate">{prof.email}</span>
                  </div>
                  {prof.phone && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Phone size={16} />
                      </div>
                      <span>{prof.phone}</span>
                    </div>
                  )}
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
      )}
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Professeurs", value: stats.totalProfessors.toString(), icon: Users, color: "bg-emerald-500" },
          { label: "Charges Horaires", value: stats.totalHours, icon: Calendar, color: "bg-emerald-500" },
          { label: "Départements", value: stats.departments.toString(), icon: BookOpen, color: "bg-amber-500" },
          { label: "Taux Occupation", value: stats.occupancyRate, icon: TrendingUp, color: "bg-rose-500" },
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
