import React, { useEffect, useMemo, useState } from 'react'
import './DeliveryMap.css'
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// fix Leaflet's default marker icon paths under Vite bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// geocode an address via OpenStreetMap Nominatim, trying progressively
// broader queries so a too-specific street still resolves to the area.
export async function geocodeAddress(address) {
  const p = address || {}
  const candidates = [
    [p.street, p.city, p.state, p.country].filter(Boolean).join(', '),
    [p.city, p.state, p.country].filter(Boolean).join(', '),
    [p.city, p.country].filter(Boolean).join(', '),
    [p.state, p.country].filter(Boolean).join(', '),
  ].filter((v, i, a) => v && a.indexOf(v) === i)

  for (const q of candidates) {
    const key = 'geo:' + q
    const cached = sessionStorage.getItem(key)
    if (cached) return JSON.parse(cached)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`, {
        headers: { 'Accept-Language': 'en' },
      })
      const data = await res.json()
      if (data && data[0]) {
        const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
        sessionStorage.setItem(key, JSON.stringify(loc))
        return loc
      }
    } catch { /* try next candidate */ }
  }
  return null
}

const DeliveryMap = ({ address, height = 200 }) => {
  const hasCoords = address && Number.isFinite(+address.lat) && Number.isFinite(+address.lng)
  const [pos, setPos] = useState(hasCoords ? { lat: +address.lat, lng: +address.lng } : null)
  const [status, setStatus] = useState(hasCoords ? 'ready' : 'loading')

  const addressText = useMemo(() => (
    [address?.street, address?.city, address?.state, address?.country, address?.zipcode].filter(Boolean).join(', ')
  ), [address])

  useEffect(() => {
    if (hasCoords) return
    let alive = true
    setStatus('loading')
    geocodeAddress(address).then(loc => {
      if (!alive) return
      if (loc) { setPos(loc); setStatus('ready') } else setStatus('notfound')
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressText, hasCoords])

  if (status === 'loading') return <div className="map-msg" style={{ height }}>Locating delivery address…</div>
  if (status === 'notfound' || !pos) return <div className="map-msg" style={{ height }}>Couldn’t place this address on the map.</div>

  return (
    <div className="delivery-map" style={{ height }}>
      <MapContainer center={[pos.lat, pos.lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Map">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer attribution='Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Marker position={[pos.lat, pos.lng]}>
          <Popup>{addressText || 'Delivery location'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default DeliveryMap
