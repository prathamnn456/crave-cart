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

  // most-ordered items (by total quantity)
  const topItems = useMemo(() => {
    const map = {}
    orders.forEach(o => o.items.forEach(it => {
      map[it.name] = (map[it.name] || 0) + (Number(it.quantity) || 0)
    }))
    const arr = Object.entries(map).map(([name, qty]) => ({ name, qty }))
    arr.sort((a, b) => b.qty - a.qty)
    const max = arr.length ? arr[0].qty : 1
    return { list: arr.slice(0, 5), max }
  }, [orders])

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
          <div className="dash-tile-ic accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8l8-4 8 4-8 4-8-4Z" /><path d="M4 8v8l8 4 8-4V8" strokeLinejoin="round" /></svg>
          </div>
          <div className="dash-tile-txt">
            <span className="lbl">Total orders</span>
            <span className="val tnum">{stats.total}</span>
            <span className="sub2">All time</span>
          </div>
        </div>

        <div className="dash-tile">
          <div className="dash-tile-ic good">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="dash-tile-txt">
            <span className="lbl">Revenue</span>
            <span className="val tnum">{currency}{stats.revenue.toLocaleString('en-IN')}</span>
            <span className="sub2">All time</span>
          </div>
        </div>

        <div className="dash-tile">
          <div className="dash-tile-ic info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 4v16" strokeLinecap="round" /></svg>
          </div>
          <div className="dash-tile-txt">
            <span className="lbl">Menu items</span>
            <span className="val tnum">{stats.items}</span>
            <span className="sub2">Live on menu</span>
          </div>
        </div>

        <div className="dash-tile">
          <div className="dash-tile-ic warn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="dash-tile-txt">
            <span className="lbl">Pending</span>
            <span className="val tnum">{stats.pending}</span>
            <span className="sub2">Awaiting delivery</span>
          </div>
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

      <div className="panel top-panel">
        <div className="panel-head">
          <h3>Popular items</h3>
          <Link to='/list'>Menu →</Link>
        </div>
        <div className="panel-body">
          {topItems.list.length === 0 && <div className="empty">No sales yet.</div>}
          {topItems.list.map((it, i) => (
            <div className="toprow" key={i}>
              <span className="toprank">{i + 1}</span>
              <div className="topinfo">
                <div className="topinfo-head">
                  <b>{it.name}</b>
                  <span>{it.qty} sold</span>
                </div>
                <div className="topbar"><div className="topbar-fill" style={{ width: (it.qty / topItems.max) * 100 + '%' }}></div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
