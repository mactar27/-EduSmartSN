"use client"

import { useEffect, useState } from "react"

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState({ primary: '#4f46e5', secondary: '#6366f1' })

  useEffect(() => {
    // Standardize to Sovereign Green
    document.documentElement.style.setProperty('--primary', '#1a2e26')
    document.documentElement.style.setProperty('--secondary', '#10b981')
  }, [])

  return <>{children}</>
}

// Helper to convert HEX to HSL for Tailwind compatibility if needed
// Or we just use raw CSS variables in our components
function hexToHsl(hex: string) {
  // Simple conversion or just return hex if using standard CSS
  return hex 
}
