import { useState, useEffect } from 'react'

// Best-effort human-readable area for the visitor, e.g. "Karve Nagar, Pune, India".
//  1) Tries precise GPS via the browser Geolocation API (asks permission once)
//     and reverse-geocodes it with OpenStreetMap Nominatim.
//  2) Falls back to an approximate IP-based city (ipwho.is) if permission is
//     denied or GPS is unavailable.
// Returns '' until known so callers can show a neutral placeholder meanwhile.
export default function useVisitorArea() {
  const [area, setArea] = useState('')

  useEffect(() => {
    let cancelled = false
    const set = (v) => { if (!cancelled && v) setArea(v) }

    // join non-empty, de-duplicated parts into "A, B, C"
    const label = (parts) => {
      const out = []
      for (const p of parts) {
        if (p && !out.includes(p)) out.push(p)
      }
      return out.join(', ')
    }

    const ipFallback = async () => {
      try {
        const res = await fetch('https://ipwho.is/')
        const d = await res.json()
        if (d && d.success) set(label([d.city, d.country]))
      } catch { /* keep neutral placeholder */ }
    }

    const reverseGeocode = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`
        )
        const d = await res.json()
        const a = d.address || {}
        const locality = a.suburb || a.neighbourhood || a.quarter || a.hamlet || a.village || a.town || ''
        const city = a.city || a.state_district || a.county || a.town || a.village || ''
        set(label([locality, city, a.country]))
      } catch {
        ipFallback()
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
        () => ipFallback(), // permission denied or lookup error → approximate by IP
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 600000 }
      )
    } else {
      ipFallback()
    }

    return () => { cancelled = true }
  }, [])

  return area
}
