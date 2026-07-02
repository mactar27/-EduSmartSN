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
  Calendar,
  X,
  Save,
  Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProfessorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: ""
  });
  
  const { data, error, isLoading, mutate } = useSWR('/api/univ/professors', fetcher)
  const { data: deptsData } = useSWR('/api/univ/departments', fetcher)
  
  const professors = data?.data || [];
  const departments = deptsData?.data || [];
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

  const handleCreateProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch('/api/univ/professors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      
      if (res.ok) {
        alert(`Professeur créé avec succès !\n\nEmail: ${formData.email}\nMot de passe temporaire: ${json.tempPassword}`);
        setFormData({ name: "", email: "", phone: "", specialization: "" });
        setIsModalOpen(false);
        mutate();
      } else {
        alert(`Erreur: ${json.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du professeur.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Corps Professoral</h2>
          <p className="text-muted-foreground mt-1">Gérez vos enseignants et leurs attributions pédagogiques.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
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

      {/* Modal Ajout Professeur */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl p-8 relative animate-in slide-in-from-bottom-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-muted rounded-full hover:bg-muted-foreground/20 transition-colors"
            >
              <X size={20} className="text-foreground" />
            </button>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Ajouter un Professeur</h3>
              <p className="text-muted-foreground mt-1">Créez le profil et envoyez les accès.</p>
            </div>
            <form onSubmit={handleCreateProfessor} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">Nom Complet</label>
                <Input 
                  placeholder="Ex: Dr. Moussa Diop" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-12 rounded-xl bg-muted/30"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Adresse Email</label>
                <Input 
                  type="email"
                  placeholder="Ex: m.diop@edusmart.sn" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 rounded-xl bg-muted/30"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Téléphone (Optionnel)</label>
                  <Input 
                    placeholder="Ex: 77 000 00 00" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-12 rounded-xl bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Département (Spécialisation)</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <select
                      className="w-full h-12 pl-10 pr-4 bg-muted/30 border border-input rounded-xl appearance-none text-sm"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      required
                    >
                      <option value="">Sélectionner</option>
                      {departments.map((d: any) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={isCreating} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 gap-2 mt-4">
                <Save size={20} />
                {isCreating ? 'Enregistrement...' : 'Valider le professeur'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
