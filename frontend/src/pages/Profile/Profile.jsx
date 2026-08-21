import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const emptyAddr = { firstName: '', lastName: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '' }

const Profile = () => {
  const { url, token, currency } = useContext(StoreContext)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyAddr)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const [p, o] = await Promise.all([
        axios.post(url + '/api/user/profile', {}, { headers: { token } }),
        axios.post(url + '/api/order/userorders', {}, { headers: { token } }),
      ])
      if (p.data.success) setProfile(p.data.user)
      if (o.data.success) setOrders(o.data.data)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (!token) { navigate('/'); return }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const addresses = profile?.addresses || []
  const totalSpent = orders.reduce((s, o) => s + (Number(o.amount) || 0), 0)

  const saveAddr = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await axios.post(url + '/api/user/address/save', { address: form }, { headers: { token } })
      if (res.data.success) {
        setProfile(p => ({ ...p, addresses: res.data.addresses }))
        setForm(emptyAddr); setAdding(false); toast.success('Address saved')
      } else toast.error('Could not save address')
    } catch { toast.error('Could not save address') }
    finally { setSaving(false) }
  }

  const delAddr = async (id) => {
    try {
      const res = await axios.post(url + '/api/user/address/delete', { id }, { headers: { token } })
      if (res.data.success) { setProfile(p => ({ ...p, addresses: res.data.addresses })); toast.info('Address removed') }
    } catch { toast.error('Could not remove address') }
  }

  if (!profile) return <div className='profile'><p className='profile-loading'>Loading your account…</p></div>

  const initials = (profile.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className='profile'>
      <h1 className='profile-title'>My account</h1>

      <div className='profile-card'>
        <div className='profile-avatar'>{initials}</div>
        <div className='profile-who'>
          <b>{profile.name}</b>
          <span>{profile.email}</span>
        </div>
      </div>

      <div className='profile-stats'>
        <div className='profile-stat'><span>Orders</span><b>{orders.length}</b></div>
        <div className='profile-stat'><span>Total spent</span><b className='tnum'>{currency}{totalSpent.toLocaleString('en-IN')}</b></div>
        <div className='profile-stat'><span>Saved addresses</span><b>{addresses.length}</b></div>
      </div>

      <div className='profile-section'>
        <div className='profile-section-head'>
          <h2>Saved addresses</h2>
          {!adding && <button className='addr-add' onClick={() => setAdding(true)}>+ Add address</button>}
        </div>

        {adding && (
          <form className='addr-form' onSubmit={saveAddr}>
            <div className='addr-row'>
              <input placeholder='First name' value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
              <input placeholder='Last name' value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <input placeholder='Street' value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required />
            <div className='addr-row'>
              <input placeholder='City' value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
              <input placeholder='State' value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required />
            </div>
            <div className='addr-row'>
              <input placeholder='Zip code' value={form.zipcode} onChange={e => setForm({ ...form, zipcode: e.target.value })} required />
              <input placeholder='Country' value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required />
            </div>
            <input placeholder='Phone' value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
            <div className='addr-actions'>
              <button type='button' className='ghost' onClick={() => { setAdding(false); setForm(emptyAddr) }}>Cancel</button>
              <button type='submit' disabled={saving}>{saving ? 'Saving…' : 'Save address'}</button>
            </div>
          </form>
        )}

        {addresses.length === 0 && !adding && <p className='addr-empty'>No saved addresses yet — add one to check out faster.</p>}

        <div className='addr-list'>
          {addresses.map(a => (
            <div className='addr-card' key={a.id}>
              <div>
                <b>{a.firstName} {a.lastName}</b>
                <p>{[a.street, a.city, a.state, a.country, a.zipcode].filter(Boolean).join(', ')}</p>
                <span>📞 {a.phone}</span>
              </div>
              <button className='addr-del' onClick={() => delAddr(a.id)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
