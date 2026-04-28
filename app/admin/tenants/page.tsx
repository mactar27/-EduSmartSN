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

export default function AdminTenants() {
  const [tenants, setTenants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Établissements Partenaires</h2>
          <p className="text-muted-foreground mt-1">Gérez les universités et écoles utilisant la plateforme EduSmart SN.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus size={20} />
          Ajouter une Université
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input className="pl-10 h-12 bg-muted/30 border-border rounded-xl" placeholder="Rechercher par nom, sous-domaine..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">Chargement des universités...</div>
        ) : (
          tenants.map((tenant) => (
            <div key={tenant.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="h-2" style={{ backgroundColor: tenant.primaryColor || '#059669' }} />
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-xl font-black" style={{ color: tenant.primaryColor || '#059669' }}>
                    {tenant.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    tenant.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {tenant.status}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl">{tenant.name}</h3>
                  <p className="text-sm text-primary font-mono mt-1">{tenant.subdomain}.edusmart.sn</p>
                </div>

                <div className="pt-4 flex gap-2">
                  <Link href={`/univ/dashboard?tenantId=${tenant.id}`} className="flex-1">
                    <Button variant="outline" className="w-full h-11 rounded-xl gap-2 font-bold hover:bg-primary hover:text-white transition-all border-border">
                      <ExternalLink size={18} />
                      Ouvrir le Portail
                    </Button>
                  </Link>
                  <Button variant="ghost" className="p-2 rounded-xl h-11 w-11 border border-border">
                    <MoreVertical size={20} />
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
