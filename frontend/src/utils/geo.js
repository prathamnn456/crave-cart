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
