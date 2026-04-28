"use client"

import { useState } from "react"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  BookOpen, 
  User,
  Filter,
  Download,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

const MOCK_EVENTS = [
  { day: "Lundi", start: "08:00", end: "10:00", subject: "Mathématiques", room: "Salle 102", prof: "Dr. Ba", color: "bg-blue-500" },
  { day: "Lundi", start: "10:00", end: "12:00", subject: "Informatique", room: "Labo 1", prof: "M. Diallo", color: "bg-emerald-500" },
  { day: "Mardi", start: "14:00", end: "16:00", subject: "Anglais", room: "Salle 205", prof: "Mme. Sarr", color: "bg-amber-500" },
  { day: "Mercredi", start: "09:00", end: "12:00", subject: "Physique", room: "Amphi A", prof: "Dr. Ndoye", color: "bg-rose-500" },
]

export default function SchedulePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Emploi du Temps</h2>
          <p className="text-muted-foreground mt-1">Planning hebdomadaire des cours et examens.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-12 rounded-xl gap-2 border-border shadow-sm">
            <Download size={18} />
            Exporter PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Plus size={18} />
            Nouveau Cours
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border bg-muted/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ChevronLeft size={20} />
            </Button>
            <h3 className="text-lg font-bold">Semaine du 15 au 21 Avril 2024</h3>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ChevronRight size={20} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" className="rounded-full px-4 h-9 border-primary text-primary font-bold">Semaine</Button>
             <Button variant="ghost" size="sm" className="rounded-full px-4 h-9">Mois</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] relative">
            {/* Header Jours */}
            <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-border">
              <div className="p-4 bg-muted/5 font-bold text-xs uppercase tracking-widest text-muted-foreground text-center">Heure</div>
              {DAYS.map(day => (
                <div key={day} className="p-4 font-black text-sm text-center border-l border-border">{day}</div>
              ))}
            </div>

            {/* Grid Planning */}
            <div className="grid grid-cols-[100px_repeat(6,1fr)]">
              {/* Colonne Heures */}
              <div className="flex flex-col">
                {HOURS.map(hour => (
                  <div key={hour} className="h-20 p-2 text-[10px] font-bold text-muted-foreground border-b border-border flex items-start justify-center">
                    {hour}
                  </div>
                ))}
              </div>

              {/* Colonnes Jours */}
              {DAYS.map(day => (
                <div key={day} className="relative border-l border-border bg-grid-pattern group">
                  {HOURS.map(hour => (
                    <div key={`${day}-${hour}`} className="h-20 border-b border-border/50 group-hover:border-border transition-colors"></div>
                  ))}
                  
                  {/* Events Overlay */}
                  {MOCK_EVENTS.filter(e => e.day === day).map((event, i) => {
                    const startIndex = HOURS.indexOf(event.start)
                    const endIndex = HOURS.indexOf(event.end)
                    const duration = endIndex - startIndex
                    
                    return (
                      <div 
                        key={i}
                        className={`absolute left-1 right-1 p-3 rounded-2xl shadow-lg border-l-4 border-white/20 text-white ${event.color} transition-transform hover:scale-[1.02] cursor-pointer`}
                        style={{ 
                          top: `${startIndex * 5}rem`, 
                          height: `${duration * 5}rem`,
                          zIndex: 10
                        }}
                      >
                        <p className="text-xs font-black uppercase mb-1 leading-tight">{event.subject}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-90">
                            <Clock size={10} /> {event.start} - {event.end}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-90">
                            <MapPin size={10} /> {event.room}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-90">
                            <User size={10} /> {event.prof}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
