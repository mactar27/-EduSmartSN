"use client"

import { useEffect, useState } from "react"

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState({ primary: '#4f46e5', secondary: '#6366f1' })

  useEffect(() => {
    async function fetchColors() {
      try {
        const res = await fetch('/api/univ/stats')
        const data = await res.json()
        if (data.tenant) {
          let primary = data.tenant.primary_color || data.tenant.primaryColor || '#4f46e5'
          let secondary = data.tenant.secondary_color || data.tenant.secondaryColor || '#6366f1'
          
          // Force Indigo if it's the old green
          if (primary === '#059669' || primary === '#10b981') {
            primary = '#4f46e5'
            secondary = '#6366f1'
          }
          
          setColors({ primary, secondary })
          
          // Apply to CSS variables
          document.documentElement.style.setProperty('--primary', hexToHsl(primary))
          // We can also set custom variables
          document.documentElement.style.setProperty('--univ-primary', primary)
          document.documentElement.style.setProperty('--univ-secondary', secondary)
        }
      } catch (e) {
        console.error("Theme fetch error", e)
      }
    }
    fetchColors()
  }, [])

  return <>{children}</>
}

// Helper to convert HEX to HSL for Tailwind compatibility if needed
// Or we just use raw CSS variables in our components
function hexToHsl(hex: string) {
  // Simple conversion or just return hex if using standard CSS
  return hex 
}
