"use client"

import { useState } from "react"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User,
  Download,
  Plus,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
const START_HOUR = 8
const END_HOUR = 18
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR)

// Improved Mock Events with exact times in minutes
const MOCK_EVENTS = [
  { 
    id: 1, day: "Lundi", startTime: "08:00", endTime: "10:30", 
    subject: "Mathématiques Appliquées", room: "Amphi 102", 
    prof: "Dr. Ba", type: "CM",
    color: "from-indigo-500 to-blue-600", shadow: "shadow-blue-500/30"
  },
  { 
    id: 2, day: "Lundi", startTime: "11:00", endTime: "13:00", 
    subject: "Algorithmique", room: "Labo 1", 
    prof: "M. Diallo", type: "TD",
    color: "from-emerald-400 to-emerald-600", shadow: "shadow-emerald-500/30"
  },
  { 
    id: 3, day: "Mardi", startTime: "14:30", endTime: "17:00", 
    subject: "Anglais Technique", room: "Salle 205", 
    prof: "Mme. Sarr", type: "TD",
    color: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/30"
  },
  { 
    id: 4, day: "Mercredi", startTime: "09:00", endTime: "12:00", 
    subject: "Physique Quantique", room: "Amphi A", 
    prof: "Dr. Ndoye", type: "CM",
    color: "from-rose-400 to-red-600", shadow: "shadow-rose-500/30"
  },
  { 
    id: 5, day: "Jeudi", startTime: "10:00", endTime: "12:00", 
    subject: "Base de données", room: "Labo 3", 
    prof: "Dr. Fall", type: "TP",
    color: "from-violet-500 to-purple-600", shadow: "shadow-purple-500/30"
  }
]

export default function SchedulePage() {
  const [view, setView] = useState<"week" | "month">("week")

  // Function to calculate top and height based on time strings like "08:30"
  const getEventPosition = (start: string, end: string) => {
    const [startH, startM] = start.split(":").map(Number)
    const [endH, endM] = end.split(":").map(Number)
    
    // Top position: (Hour - START_HOUR) * 5rem + (Minutes / 60) * 5rem
    const top = (startH - START_HOUR) * 5 + (startM / 60) * 5
    // Height: (End Hour - Start Hour) * 5rem + ((End Minutes - Start Minutes) / 60) * 5rem
    const height = (endH - startH) * 5 + ((endM - startM) / 60) * 5

    return { top: `${top}rem`, height: `${height}rem` }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Emploi du Temps</h2>
          <p className="text-muted-foreground mt-1">Gestion dynamique et temps réel des plannings.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-12 rounded-xl gap-2 border-border shadow-sm bg-card hover:bg-muted/50">
            <Download size={18} />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 h-12 px-6 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Plus size={18} />
            Nouveau Cours
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        {/* Toolbar */}
        <div className="p-6 border-b border-border bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 text-slate-600">
              <ChevronLeft size={20} />
            </Button>
            <div className="flex items-center gap-2 px-4">
              <CalendarIcon size={18} className="text-primary" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">15 - 21 Avril 2026</h3>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 text-slate-600">
              <ChevronRight size={20} />
            </Button>
          </div>

          <div className="flex items-center bg-slate-200/50 p-1 rounded-xl">
             <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-lg px-6 h-9 font-bold transition-all ${view === 'week' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setView('week')}
              >
                Semaine
              </Button>
             <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-lg px-6 h-9 font-bold transition-all ${view === 'month' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setView('month')}
              >
                Mois
              </Button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="overflow-x-auto bg-slate-50">
          <div className="min-w-[900px] relative">
            
            {/* Current Time Indicator (Mocked at 10:45) */}
            <div className="absolute left-20 right-0 h-px bg-rose-500 z-20 pointer-events-none" style={{ top: `${(10.75 - START_HOUR) * 5 + 4}rem` }}>
              <div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            </div>

            {/* Header Days */}
            <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
              <div className="p-4 flex items-center justify-center border-r border-slate-100">
                <Clock size={16} className="text-slate-400" />
              </div>
              {DAYS.map((day, idx) => (
                <div key={day} className="p-4 flex flex-col items-center justify-center border-r border-slate-100 gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{day}</span>
                  <span className={`text-xl font-black ${idx === 2 ? 'text-primary' : 'text-slate-800'}`}>
                    {15 + idx}
                  </span>
                  {idx === 2 && <div className="w-1 h-1 rounded-full bg-primary mt-1" />}
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-[80px_repeat(6,1fr)] bg-white relative">
              
              {/* Hours Column */}
              <div className="flex flex-col border-r border-slate-100 bg-slate-50/50">
                {HOURS.map(hour => (
                  <div key={hour} className="h-20 relative">
                    <span className="absolute -top-2.5 right-4 text-[10px] font-black text-slate-400">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {DAYS.map(day => (
                <div key={day} className="relative border-r border-slate-100">
                  {HOURS.map(hour => (
                    <div key={`${day}-${hour}`} className="h-20 border-b border-slate-100/50 hover:bg-slate-50/80 transition-colors" />
                  ))}
                  
                  {/* Events for this day */}
                  {MOCK_EVENTS.filter(e => e.day === day).map(event => {
                    const { top, height } = getEventPosition(event.startTime, event.endTime)
                    
                    return (
                      <div 
                        key={event.id}
                        className={`absolute left-1.5 right-1.5 rounded-2xl p-3 text-white shadow-lg transition-all hover:scale-[1.02] hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${event.color} ${event.shadow}`}
                        style={{ top, height, zIndex: 10 }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {event.type}
                          </span>
                          <button className="text-white/70 hover:text-white transition-colors">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                        
                        <h4 className="text-xs font-black leading-tight mb-2 line-clamp-2 drop-shadow-md">
                          {event.subject}
                        </h4>
                        
                        <div className="space-y-1.5 mt-auto absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90">
                            <Clock size={12} className="opacity-70" /> 
                            {event.startTime} - {event.endTime}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90">
                            <MapPin size={12} className="opacity-70" /> 
                            {event.room}
                          </div>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                            <Avatar className="w-5 h-5 border border-white/30">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${event.prof}&backgroundColor=ffffff`} />
                              <AvatarFallback className="text-[8px] text-black">PR</AvatarFallback>
                            </Avatar>
                            <span className="text-[10px] font-bold truncate text-white/90">{event.prof}</span>
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
