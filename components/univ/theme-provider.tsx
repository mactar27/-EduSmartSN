"use client"

import { useEffect, useState } from "react"

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState({ primary: '#059669', secondary: '#10b981' })

  useEffect(() => {
    async function fetchColors() {
      try {
        const res = await fetch('/api/univ/stats')
        const data = await res.json()
        if (data.tenant) {
          const primary = data.tenant.primaryColor || '#059669'
          const secondary = data.tenant.secondaryColor || '#10b981'
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
