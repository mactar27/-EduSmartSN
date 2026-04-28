"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { School, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        const userRole = data.user.role?.toUpperCase();
        if (userRole === 'SUPER_ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/univ/dashboard')
        }
      } else {
        setError(data.error || "Erreur de connexion")
      }
    } catch (err) {
      setError("Erreur serveur")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/logo.png"
              alt="EduSmart SN Logo"
              width={180}
              height={60}
              className="h-16 w-auto mx-auto"
            />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Connexion au Portail
          </h2>
          <p className="text-muted-foreground">
            Accédez à votre espace de gestion universitaire.
          </p>
        </div>

        <div className="bg-card border border-border p-8 rounded-2xl shadow-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input 
                  type="email" 
                  placeholder="votre@email.sn" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/50 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mot de passe</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/50 border-border"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-md font-bold shadow-lg shadow-primary/20"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          {/* Section Démo retirée pour le mode réel */}
        </div>
      </div>
    </div>
  )
}
