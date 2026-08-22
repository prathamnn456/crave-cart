// Straight-line distance between two {lat,lng} points, in kilometres (haversine).
export function haversineKm(a, b) {
  if (!a || !b) return null
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

// Our (demo) kitchen location, used as the origin for delivery ETA.
export const KITCHEN = { lat: 19.9615, lng: 79.2961 } // Chandrapur

// Rough delivery ETA in minutes: kitchen prep + travel at ~22 km/h city speed.
// Straight-line distance is scaled up ~1.3x to approximate real roads, then
// clamped to a realistic 15–60 min window.
export function etaFromKm(km) {
  if (km == null) return null
  const PREP_MIN = 12
  const SPEED_KMH = 22
  const travelMin = ((km * 1.3) / SPEED_KMH) * 60
  const eta = Math.round((PREP_MIN + travelMin) / 5) * 5 // round to nearest 5
  return Math.min(60, Math.max(15, eta))
}

// Reverse-geocode coordinates into address fields using OpenStreetMap Nominatim.
// Returns { street, city, state, zipcode, country } (any field may be '').
export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    )
    const d = await res.json()
    const a = d.address || {}
    const street = [a.house_number, a.road || a.pedestrian || a.suburb || a.neighbourhood]
      .filter(Boolean)
      .join(' ')
    return {
      street,
      city: a.city || a.town || a.village || a.state_district || a.county || '',
      state: a.state || '',
      zipcode: a.postcode || '',
      country: a.country || '',
    }
  } catch {
    return null
  }
}
