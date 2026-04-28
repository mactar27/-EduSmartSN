"use client"

import { Building2, Users, GraduationCap, MapPin, ExternalLink } from "lucide-react"
import useSWR from "swr"
import { Etablissement } from "@/lib/types"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function EtablissementsSection() {
  const { data, isLoading } = useSWR<{ data: Etablissement[]; total: number }>(
    "/api/etablissements?limit=6",
    fetcher
  )

  const etablissements = data?.data || []

  return (
    <section id="etablissements" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Ils nous font <span className="text-primary">confiance</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les établissements qui utilisent EduSmart SN pour leur gestion académique.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-background rounded-xl border border-border p-4 sm:p-6 animate-pulse">
                <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-4" />
                <div className="flex gap-4">
                  <div className="h-4 bg-muted rounded w-20" />
                  <div className="h-4 bg-muted rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {etablissements.map((etablissement) => (
              <div
                key={etablissement.id}
                className="group bg-background rounded-xl border border-border p-4 sm:p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 sm:p-3 rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  {etablissement.website && (
                    <a
                      href={etablissement.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {etablissement.name}
                </h3>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5" />
                  {etablissement.city}
                </div>

                {etablissement.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {etablissement.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-foreground/80">
                    <Users className="h-4 w-4 text-secondary" />
                    <span>{etablissement.student_count.toLocaleString()} étudiants</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground/80">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>{etablissement.professor_count} profs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.total && data.total > 6 && (
          <div className="text-center mt-8 sm:mt-10">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Voir tous les établissements ({data.total})
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
