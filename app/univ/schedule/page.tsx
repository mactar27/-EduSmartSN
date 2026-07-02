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

import useSWR from "swr"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
const START_HOUR = 8
const END_HOUR = 18
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR)

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Fallback colors for Course Types
const getTypeColor = (type: string) => {
  switch (type) {
    case 'CM': return { bg: "from-indigo-500 to-blue-600", shadow: "shadow-blue-500/30" }
    case 'TD': return { bg: "from-emerald-400 to-emerald-600", shadow: "shadow-emerald-500/30" }
    case 'TP': return { bg: "from-violet-500 to-purple-600", shadow: "shadow-purple-500/30" }
    case 'EXAM': return { bg: "from-rose-500 to-red-600", shadow: "shadow-rose-500/30" }
    default: return { bg: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/30" }
  }
}

export default function SchedulePage() {
  const [view, setView] = useState<"week" | "month">("week")
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [currentDate, setCurrentDate] = useState(new Date())

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    type: "CM",
    room: "",
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "10:00"
  })

  // Fetch classes (departments)
  const { data: deptData, isLoading: deptsLoading } = useSWR('/api/univ/departments', fetcher)
  const departments = deptData?.data || []

  // Initialize selectedClassId if empty and departments are loaded
  if (!selectedClassId && departments.length > 0) {
    setSelectedClassId(departments[0].id)
  }

  // Fetch events for the selected class
  const { data: scheduleData, isLoading: scheduleLoading, mutate } = useSWR(
    selectedClassId ? `/api/univ/schedule?departmentId=${selectedClassId}` : null,
    fetcher
  )
  const events = scheduleData?.data || []

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClassId) {
      alert("Veuillez sélectionner une classe d'abord.")
      return
    }

    setIsCreating(true)
    try {
      const tenantId = departments.find((d: any) => d.id === selectedClassId)?.tenantId || "default-tenant" // fallback not needed as api defaults to active tenant if possible, but schema requires it. Let's fetch tenant from an API or rely on the backend.
      // Actually, `/api/univ/schedule` `POST` requires `tenantId`. Where do we get it?
      // Wait, `/api/univ/departments` doesn't return `tenantId`. I will pass `tenantId: "mock"` and let backend fetch active tenant or I should modify the backend.
      
      const res = await fetch('/api/univ/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          departmentId: selectedClassId,
          tenantId: departments[0]?.tenantId || 'dummy' // We'll update the backend to auto-fetch tenant if missing
        })
      })

      if (res.ok) {
        alert("Cours planifié avec succès !")
        setIsModalOpen(false)
        mutate() // Rafraîchir
      } else {
        const err = await res.json()
        alert(`Erreur: ${err.error}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  // Calculate current week dates
  const getMonday = (d: Date) => {
    const date = new Date(d)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(diff))
  }

  const startOfWeek = getMonday(currentDate)
  const weekDates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(d.getDate() + i)
    return d
  })

  const endOfWeek = weekDates[5]
  const monthStr = startOfWeek.toLocaleDateString('fr-FR', { month: 'long' })
  const yearStr = startOfWeek.getFullYear()
  const weekHeader = `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${monthStr} ${yearStr}`

  const prevWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  const nextWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }



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
          <p className="text-muted-foreground mt-1">Gestion dynamique et temps réel des plannings par classe.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-12 rounded-xl gap-2 border-border shadow-sm bg-card hover:bg-muted/50">
            <Download size={18} />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 h-12 px-6 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Nouveau Cours
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        {/* Toolbar */}
        <div className="p-6 border-b border-border bg-slate-50/50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          
          {/* Left: Class Selector & Date Navigation */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Class Selector */}
            <div className="w-full sm:w-[250px]">
              <Select value={selectedClassId} onValueChange={setSelectedClassId} disabled={deptsLoading}>
                <SelectTrigger className="h-12 bg-white rounded-xl border-slate-200 shadow-sm font-bold">
                  <SelectValue placeholder={deptsLoading ? "Chargement..." : "Sélectionner une classe"} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id} className="font-medium">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 w-full sm:w-auto justify-between">
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-100 text-slate-600 h-9 w-9" onClick={prevWeek}>
                <ChevronLeft size={18} />
              </Button>
              <div className="flex items-center gap-2 px-2">
                <CalendarIcon size={16} className="text-primary hidden sm:block" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 whitespace-nowrap">{weekHeader}</h3>
              </div>
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-100 text-slate-600 h-9 w-9" onClick={nextWeek}>
                <ChevronRight size={18} />
              </Button>
            </div>
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
              {weekDates.map((date, idx) => {
                const isToday = new Date().toDateString() === date.toDateString()
                return (
                  <div key={idx} className="p-4 flex flex-col items-center justify-center border-r border-slate-100 gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-primary' : 'text-slate-500'}`}>
                      {DAYS[idx]}
                    </span>
                    <span className={`text-xl font-black ${isToday ? 'text-primary' : 'text-slate-800'}`}>
                      {date.getDate()}
                    </span>
                    {isToday && <div className="w-1 h-1 rounded-full bg-primary mt-1" />}
                  </div>
                )
              })}
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
                  {events
                    .filter((e: any) => DAYS[e.dayOfWeek - 1] === day)
                    .map((event: any) => {
                    const { top, height } = getEventPosition(event.startTime, event.endTime)
                    const styleConfig = getTypeColor(event.type)
                    
                    return (
                      <div 
                        key={event.id}
                        className={`absolute left-1.5 right-1.5 rounded-2xl p-3 text-white shadow-lg transition-all hover:scale-[1.02] hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${styleConfig.bg} ${styleConfig.shadow}`}
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
                          {event.professor && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                              <Avatar className="w-5 h-5 border border-white/30">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${event.professor.user?.name || 'P'}&backgroundColor=ffffff`} />
                                <AvatarFallback className="text-[8px] text-black">PR</AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] font-bold truncate text-white/90">{event.professor.user?.name}</span>
                            </div>
                          )}
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

      {/* Modal Nouveau Cours */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl p-8 relative animate-in slide-in-from-bottom-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-muted rounded-full hover:bg-muted-foreground/20 transition-colors"
            >
              <Plus size={20} className="rotate-45" />
            </button>
            <div className="mb-6">
              <h3 className="text-2xl font-bold">Nouveau Cours</h3>
              <p className="text-muted-foreground text-sm mt-1">Planifiez un événement dans l'emploi du temps.</p>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Matière</label>
                  <input placeholder="Ex: Informatique, Mathématiques..." value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-input" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-input appearance-none" required>
                    <option value="CM">Cours Magistral (CM)</option>
                    <option value="TD">Travaux Dirigés (TD)</option>
                    <option value="TP">Travaux Pratiques (TP)</option>
                    <option value="EXAM">Examen</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Salle</label>
                  <input placeholder="Ex: Amphi A, Salle 101" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-input" required />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Jour</label>
                  <select value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})} className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-input appearance-none" required>
                    {DAYS.map((day, idx) => <option key={idx} value={idx + 1}>{day}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Heure Début</label>
                  <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-input" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Heure Fin</label>
                  <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-input" required />
                </div>
              </div>
              
              <Button type="submit" disabled={isCreating} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 gap-2 mt-4">
                {isCreating ? 'Planification...' : 'Planifier le cours'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
