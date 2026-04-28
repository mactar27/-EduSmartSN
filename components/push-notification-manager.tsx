"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const VAPID_PUBLIC_KEY = "BPK1sBLoOY5IYC95UY-QM3UcTsiQnCXqeJe8B6j2_tf4Z5-X9E8e65UHyeke91eSkUSMYlS1Gkjnyxf5lqRAHTQ"

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      checkSubscription()
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkSubscription = async () => {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
    setIsLoading(false)
  }

  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })

      // Send subscription to server
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      })

      if (res.ok) {
        setSubscription(sub)
        alert("Notifications activées ! Vous recevrez vos notes en temps réel.")
      }
    } catch (error) {
      console.error("Subscription failed", error)
    }
  }

  const unsubscribe = async () => {
    if (subscription) {
      await subscription.unsubscribe()
      setSubscription(null)
    }
  }

  if (!isSupported) return null

  return (
    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${subscription ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
          {subscription ? <CheckCircle2 size={24} /> : <Bell size={24} />}
        </div>
        <div className="flex-1">
          <h4 className="font-bold">Alertes de Notes</h4>
          <p className="text-xs text-muted-foreground">
            {subscription 
              ? "Vous recevrez une notification dès qu'une note est publiée." 
              : "Activez les notifications pour ne rater aucun résultat."}
          </p>
        </div>
        <Button 
          variant={subscription ? "ghost" : "default"}
          onClick={subscription ? unsubscribe : subscribe}
          disabled={isLoading}
          className="rounded-xl font-bold"
        >
          {subscription ? "Désactiver" : "Activer"}
        </Button>
      </div>
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
