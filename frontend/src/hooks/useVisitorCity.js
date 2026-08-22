import { useState, useEffect } from 'react'

// Detects the visitor's city from their IP address (no permission prompt).
// Returns '' until known; callers can show a neutral fallback meanwhile.
// Uses ipwho.is — a free, keyless, HTTPS + CORS geolocation service.
export default function useVisitorCity() {
  const [city, setCity] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('https://ipwho.is/')
        const data = await res.json()
        if (!cancelled && data && data.success && data.city) {
          setCity(data.city)
        }
      } catch {
        /* keep the neutral fallback on any network/lookup failure */
      }
    })()
    return () => { cancelled = true }
  }, [])

  return city
}
