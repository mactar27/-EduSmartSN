"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"

export function DemoForm() {
  const [formData, setFormData] = useState({
    etablissement_name: "",
    contact_name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Une erreur est survenue")
      }

      setIsSuccess(true)
      setFormData({
        etablissement_name: "",
        contact_name: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Demande envoyée avec succès !
        </h3>
        <p className="text-muted-foreground mb-4">
          Notre équipe vous contactera dans les 24 heures.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
          className="border-primary text-primary hover:bg-primary/10"
        >
          Envoyer une autre demande
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="etablissement_name" className="block text-sm font-medium text-foreground mb-1.5">
            Nom de l&apos;établissement *
          </label>
          <Input
            id="etablissement_name"
            required
            value={formData.etablissement_name}
            onChange={(e) => setFormData({ ...formData, etablissement_name: e.target.value })}
            placeholder="Université / École"
            className="bg-background"
          />
        </div>
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-foreground mb-1.5">
            Votre nom *
          </label>
          <Input
            id="contact_name"
            required
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            placeholder="Prénom Nom"
            className="bg-background"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="votre@email.sn"
            className="bg-background"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
            Téléphone *
          </label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+221 77 XXX XX XX"
            className="bg-background"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
          Message (optionnel)
        </label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Parlez-nous de vos besoins..."
          rows={4}
          className="bg-background resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/10 shimmer transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            Demander ma démo gratuite
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-4 px-4">
        En soumettant ce formulaire, vous acceptez notre{" "}
        <Link href="/privacy" className="text-primary font-bold hover:underline">
          politique de confidentialité
        </Link>.
      </p>
    </form>
  )
}
