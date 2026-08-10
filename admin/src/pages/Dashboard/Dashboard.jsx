import React, { useEffect, useMemo, useState } from 'react'
import './Dashboard.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios'
import { Link } from 'react-router-dom'
import RevenueChart from '../../components/RevenueChart/RevenueChart'

const statusPill = (status) => {
  if (status === 'Delivered') return 'good'
  if (status === 'Out for delivery') return 'warn'
  return 'info'
}

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [foods, setFoods] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [o, f] = await Promise.all([
          axios.get(`${url}/api/order/list`),
          axios.get(`${url}/api/food/list`),
        ])
        if (o.data.success) setOrders(o.data.data)
        if (f.data.success) setFoods(f.data.data)
      } catch (e) {
        // silently ignore — dashboard still renders with zeros
      }
    }
    load()
  }, [])

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
    const pending = orders.filter(o => o.status !== 'Delivered').length
    return { total: orders.length, revenue, items: foods.length, pending }
  }, [orders, foods])

  // revenue for the last 7 days
  const chart = useMemo(() => {
    const days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      days.push({ key: d.toDateString(), label: d.toLocaleDateString('en-US', { weekday: 'short' }), total: 0 })
    }
    orders.forEach(o => {
      const key = new Date(o.date).toDateString()
      const day = days.find(x => x.key === key)
      if (day) day.total += Number(o.amount) || 0
    })
    const max = Math.max(...days.map(d => d.total), 1)
    const peak = days.reduce((p, d) => (d.total > p.total ? d : p), days[0])
    return { days, max, peakKey: peak.key }
  }, [orders])

  const recent = [...orders].reverse().slice(0, 4)

  return (
    <div className='dashboard'>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">Here's what's happening at CraveCart.</div>
        </div>
      </div>

      <div className="dash-tiles">
        <div className="dash-tile">
          <div className="lbl"><span className="dot" style={{ background: 'var(--accent)' }}></span>Total orders</div>
          <div className="val tnum">{stats.total}</div>
        </div>
        <div className="dash-tile">
          <div className="lbl"><span className="dot" style={{ background: 'var(--good)' }}></span>Revenue</div>
          <div className="val tnum">{currency}{stats.revenue.toLocaleString('en-IN')}</div>
        </div>
        <div className="dash-tile">
          <div className="lbl"><span className="dot" style={{ background: 'var(--info)' }}></span>Menu items</div>
          <div className="val tnum">{stats.items}</div>
        </div>
        <div className="dash-tile">
          <div className="lbl"><span className="dot" style={{ background: 'var(--warn)' }}></span>Pending</div>
          <div className="val tnum">{stats.pending}</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-head">
            <h3>Revenue — last 7 days</h3>
          </div>
          <RevenueChart days={chart.days} currency={currency} />
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Recent orders</h3>
            <Link to='/orders'>All →</Link>
          </div>
          <div className="panel-body">
            {recent.length === 0 && <div className="empty">No orders yet.</div>}
            {recent.map((o, i) => (
              <div className="drow" key={i}>
                <div className="dbox">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8l8-4 8 4-8 4-8-4Z" /><path d="M4 8v8l8 4 8-4V8" strokeLinejoin="round" /></svg>
                </div>
                <div className="dinfo">
                  <b>{o.items.map(it => `${it.name} ×${it.quantity}`).join(', ')}</b>
                  <span>{currency}{o.amount} · {o.address?.firstName} {o.address?.lastName}</span>
                </div>
                <span className={'pill ' + statusPill(o.status)}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
