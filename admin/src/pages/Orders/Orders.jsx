import React, { useEffect, useMemo, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { url, currency } from '../../assets/assets';
import DeliveryMap from '../../components/DeliveryMap/DeliveryMap';

const STATUSES = ['Food Processing', 'Out for delivery', 'Delivered'];
const statusClass = (s) => s === 'Delivered' ? 'good' : s === 'Out for delivery' ? 'warn' : 'info';
const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const Order = ({ search = '' }) => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('All');
  const [mapOrder, setMapOrder] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`)
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error")
      }
    } finally {
      setLoading(false);
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(() => { fetchAllOrders(); }, [])

  const counts = useMemo(() => {
    const c = { All: orders.length, 'Food Processing': 0, 'Out for delivery': 0, 'Delivered': 0 };
    orders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(o => {
      if (tab !== 'All' && o.status !== tab) return false;
      if (!q) return true;
      const cust = `${o.address?.firstName || ''} ${o.address?.lastName || ''}`.toLowerCase();
      const items = o.items.map(i => i.name).join(' ').toLowerCase();
      const id = o._id.slice(-6).toLowerCase();
      return cust.includes(q) || items.includes(q) || id.includes(q);
    });
  }, [orders, tab, search]);

  return (
    <div className='order'>
      <div className="page-head">
        <div>
          <h1>Orders</h1>
          <div className="sub">Track and update every order's status.</div>
        </div>
        {!loading && <span className="head-chip">{orders.length} order{orders.length === 1 ? '' : 's'}</span>}
      </div>

      <div className="tabs">
        {['All', ...STATUSES].map(t => (
          <button key={t} className={'tab' + (tab === t ? ' active' : '')} onClick={() => setTab(t)}>
            {t}<span className="tab-count">{counts[t] || 0}</span>
          </button>
        ))}
      </div>

      <div className="panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th className="ta-center">Map</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={7}><div className="sk sk-line" style={{ height: 16 }}></div></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="table-empty">
                  <p>No orders found</p>
                  <span>{search || tab !== 'All' ? 'Try a different search or filter.' : 'New orders will show up here.'}</span>
                </div>
              </td></tr>
            ) : filtered.map(o => (
              <tr key={o._id}>
                <td><span className="cell-id">#{o._id.slice(-6).toUpperCase()}</span></td>
                <td>
                  <div className="cell-cust">
                    <b>{o.address?.firstName} {o.address?.lastName}</b>
                    <span>{o.address?.phone}</span>
                  </div>
                </td>
                <td><span className="cell-items">{o.items.map(it => `${it.name} ×${it.quantity}`).join(', ')}</span></td>
                <td><b className="tnum">{currency}{o.amount}</b></td>
                <td className="cell-date">{fmtDate(o.date)}</td>
                <td>
                  <select
                    className={'order-status order-status-' + statusClass(o.status)}
                    value={o.status}
                    onChange={(e) => statusHandler(e, o._id)}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="ta-center">
                  <button className="row-btn" title="View delivery location" onClick={() => setMapOrder(o)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11Z" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mapOrder && (() => {
        const a = mapOrder.address || {}
        const addressText = [a.street, a.city, a.state, a.country, a.zipcode].filter(Boolean).join(', ')
        const mapsHref = (Number.isFinite(+a.lat) && Number.isFinite(+a.lng))
          ? `https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`
        return (
          <div className="map-overlay" onClick={() => setMapOrder(null)}>
            <div className="map-modal" onClick={(e) => e.stopPropagation()}>
              <div className="map-modal-head">
                <div className="map-modal-title">
                  <span className="map-modal-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11Z" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" /></svg>
                  </span>
                  <div>
                    <h3>Delivery location</h3>
                    <span>Order #{mapOrder._id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
                <button className="map-close" onClick={() => setMapOrder(null)} aria-label="Close">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
                </button>
              </div>

              <div className="map-modal-map">
                <DeliveryMap address={mapOrder.address} height={320} />
              </div>

              <div className="map-modal-info">
                <div className="map-info-row">
                  <span className="map-info-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" /></svg></span>
                  <div>
                    <b>{a.firstName} {a.lastName}</b>
                    {a.phone && <span>{a.phone}</span>}
                  </div>
                </div>
                <div className="map-info-row">
                  <span className="map-info-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11Z" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" /></svg></span>
                  <div>
                    <span className="map-info-label">Delivery address</span>
                    <p>{addressText}</p>
                  </div>
                </div>
              </div>

              <div className="map-modal-foot">
                <a className="btn" href={mapsHref} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

export default Order
