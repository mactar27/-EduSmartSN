"use client"

import { useEffect, useState } from "react"
import { 
  School, 
  Plus, 
  Search, 
  ExternalLink, 
  MoreVertical, 
  ShieldCheck,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import { 
  School, 
  Plus, 
  Search, 
  ExternalLink, 
  MoreVertical, 
  Trash2,
  Edit,
  CheckCircle2,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminTenants() {
  const [tenants, setTenants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<any>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    subdomain: "",
    primaryColor: "#1e40af"
  })

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      const res = await fetch('/api/admin/tenants')
      const data = await res.json()
      setTenants(data.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (tenant?: any) => {
    if (tenant) {
      setEditingTenant(tenant)
      setFormData({
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        primaryColor: tenant.primaryColor || "#1e40af"
      })
    } else {
      setEditingTenant(null)
      setFormData({
        id: "",
        name: "",
        subdomain: "",
        primaryColor: "#1e40af"
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTenant 
        ? `/api/admin/tenants/${editingTenant.id}` 
        : '/api/admin/tenants'
      
      const method = editingTenant ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingTenant ? "Établissement modifié" : "Établissement créé")
        setIsModalOpen(false)
        fetchTenants()
      } else {
        toast.error("Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Erreur de connexion")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet établissement ?")) return
    
    try {
      const res = await fetch(`/api/admin/tenants/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success("Établissement supprimé")
        fetchTenants()
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Établissements Partenaires</h2>
          <p className="text-muted-foreground mt-1">Gérez les universités et écoles utilisant la plateforme EduSmart SN.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            Ajouter une Université
          </Button>
          <DialogContent className="rounded-[2.5rem] border-border shadow-2xl glass">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">{editingTenant ? "Modifier" : "Ajouter"} l&apos;Université</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Nom de l&apos;établissement</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="rounded-xl h-12 bg-muted/30 border-border" 
                  placeholder="Ex: Université de Dakar" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">ID Unique</label>
                  <Input 
                    required
                    disabled={!!editingTenant}
                    value={formData.id}
                    onChange={e => setFormData({...formData, id: e.target.value})}
                    className="rounded-xl h-12 bg-muted/30 border-border font-mono uppercase" 
                    placeholder="ucad" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Sous-domaine</label>
                  <Input 
                    required
                    value={formData.subdomain}
                    onChange={e => setFormData({...formData, subdomain: e.target.value})}
                    className="rounded-xl h-12 bg-muted/30 border-border font-mono" 
                    placeholder="ucad" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Couleur Principale</label>
                <Input 
                  type="color"
                  value={formData.primaryColor}
                  onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                  className="rounded-xl h-12 bg-muted/30 border-border p-1" 
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20">
                  {editingTenant ? "Enregistrer les modifications" : "Créer l'établissement"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input className="pl-10 h-12 bg-muted/30 border-border rounded-xl" placeholder="Rechercher par nom, sous-domaine..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground font-medium animate-pulse">Chargement des universités...</div>
        ) : tenants.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">Aucun établissement trouvé.</div>
        ) : (
          tenants.map((tenant) => (
            <div key={tenant.id} className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:premium-shadow transition-all group relative">
              <div className="h-3 w-full" style={{ backgroundColor: tenant.primaryColor || '#1e40af' }} />
              
              {/* Action menu floating */}
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(tenant)}
                  className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-lg text-slate-600 hover:text-primary transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(tenant.id)}
                  className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-lg text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner" style={{ color: tenant.primaryColor || '#1e40af' }}>
                    {tenant.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    tenant.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {tenant.status}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-2xl tracking-tight text-foreground">{tenant.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-sm text-primary font-mono font-bold">{tenant.subdomain}.edusmart.sn</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Link href={`/univ/dashboard?tenantId=${tenant.id}`} className="flex-1">
                    <Button variant="outline" className="w-full h-12 rounded-xl gap-2 font-bold hover:bg-primary hover:text-white transition-all border-border shadow-sm group-hover:shadow-md">
                      <ExternalLink size={18} />
                      Ouvrir le Portail
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
