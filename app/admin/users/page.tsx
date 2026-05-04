"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  Plus, 
  Search, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck,
  Mail,
  Building,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'SUPER_ADMIN': return <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase">Super Admin</span>
      case 'UNIV_ADMIN': return <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase">Admin Univ</span>
      case 'PROFESSOR': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">Professeur</span>
      case 'STUDENT': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Étudiant</span>
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-black">{role}</span>
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Utilisateurs Globaux</h2>
          <p className="text-muted-foreground mt-1">Gérez tous les comptes utilisateurs à travers tous les établissements.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <UserPlus size={20} />
          Créer un Utilisateur
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input className="pl-10 h-12 bg-muted/30 border-border rounded-xl" placeholder="Rechercher un utilisateur (nom, email...)" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl premium-shadow">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border">
              <TableHead className="font-bold py-6 px-6">Utilisateur</TableHead>
              <TableHead className="font-bold">Rôle</TableHead>
              <TableHead className="font-bold">Établissement</TableHead>
              <TableHead className="font-bold">Créé le</TableHead>
              <TableHead className="text-right px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-muted-foreground">Chargement des utilisateurs...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-muted-foreground">Aucun utilisateur trouvé.</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {user.name?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.name || 'Sans nom'}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Building size={14} className="text-muted-foreground" />
                      {user.tenant_name || 'Global'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Button variant="ghost" className="p-2 h-10 w-10 rounded-xl">
                      <MoreVertical size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
