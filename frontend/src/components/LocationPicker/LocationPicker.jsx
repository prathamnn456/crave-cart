import React, { useEffect, useState } from 'react'
import './LocationPicker.css'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const DEFAULT = { lat: 20.5937, lng: 78.9629 } // India

function ClickMarker({ pos, onChange }) {
  useMapEvents({ click(e) { onChange({ lat: e.latlng.lat, lng: e.latlng.lng }) } })
  if (!pos) return null
  return (
    <Marker
      draggable
      position={[pos.lat, pos.lng]}
      eventHandlers={{ dragend(e) { const m = e.target.getLatLng(); onChange({ lat: m.lat, lng: m.lng }) } }}
    />
  )
}

function Recenter({ pos }) {
  const map = useMap()
  useEffect(() => { if (pos) map.setView([pos.lat, pos.lng], 15) }, [pos, map])
  return null
}

const LocationPicker = ({ value, onChange }) => {
  const [locating, setLocating] = useState(false)

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert('Location is not supported on this device.')
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (p) => { onChange({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocating(false) },
      () => { alert('Could not get your location. You can tap the map to drop a pin instead.'); setLocating(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="loc-picker">
      <div className="loc-picker-head">
        <div>
          <b>Delivery location</b>
          <span>Tap the map or drag the pin to set your exact spot (optional).</span>
        </div>
        <button type="button" className="loc-btn" onClick={useMyLocation} disabled={locating}>
          {locating ? 'Locating…' : '📍 Use my location'}
        </button>
      </div>
      <div className="loc-map">
        <MapContainer center={[value?.lat || DEFAULT.lat, value?.lng || DEFAULT.lng]} zoom={value ? 15 : 4} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickMarker pos={value} onChange={onChange} />
          <Recenter pos={value} />
        </MapContainer>
      </div>
      {value && <small className="loc-coords">📌 {value.lat.toFixed(5)}, {value.lng.toFixed(5)}</small>}
    </div>
  )
}

export default LocationPicker
