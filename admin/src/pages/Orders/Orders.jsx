import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { url, currency } from '../../assets/assets';

const statusClass = (status) => {
  if (status === 'Delivered') return 'good'
  if (status === 'Out for delivery') return 'warn'
  return 'info'
}

const fmtDate = (d) => new Date(d).toLocaleString(undefined, {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

const Order = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order'>
      <div className="page-head">
        <div>
          <h1>Orders</h1>
          <div className="sub">Track and update every order's status.</div>
        </div>
        {!loading && orders.length > 0 && (
          <span className="head-chip">{orders.length} order{orders.length === 1 ? '' : 's'}</span>
        )}
      </div>

      {loading ? (
        <div className="order-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="order-card" key={i}>
              <div className="order-card-head">
                <div className="order-id">
                  <span className="sk sk-box"></span>
                  <div style={{ flex: 1 }}>
                    <span className="sk sk-line lg"></span>
                    <span className="sk sk-line sm" style={{ marginTop: 8 }}></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="order-empty">
          <div className="order-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 8l8-4 8 4-8 4-8-4Z" /><path d="M4 8v8l8 4 8-4V8" strokeLinejoin="round" /></svg>
          </div>
          <p>No orders yet</p>
          <span>New customer orders will show up here as they come in.</span>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            const id6 = order._id.slice(-6).toUpperCase();
            return (
              <div key={order._id} className='order-card'>
                <div className='order-card-head'>
                  <div className='order-id'>
                    <span className='order-box'>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 8l8-4 8 4-8 4-8-4Z" /><path d="M4 8v8l8 4 8-4V8" strokeLinejoin="round" /></svg>
                    </span>
                    <div>
                      <b>Order #{id6}</b>
                      <small>{fmtDate(order.date)}</small>
                    </div>
                  </div>
                  <span className={'pill ' + statusClass(order.status)}>{order.status}</span>
                </div>

                <div className='order-card-body'>
                  <div className='order-col'>
                    <span className='order-col-label'>Items · {order.items.length}</span>
                    <p className='order-items'>{order.items.map(it => `${it.name} × ${it.quantity}`).join(', ')}</p>
                  </div>

                  <div className='order-col'>
                    <span className='order-col-label'>Deliver to</span>
                    <p className='order-name'>{order.address.firstName} {order.address.lastName}</p>
                    <p className='order-address'>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.country} — {order.address.zipcode}</p>
                    <p className='order-phone'>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 18l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" /></svg>
                      {order.address.phone}
                    </p>
                  </div>

                  <div className='order-col order-col-right'>
                    <span className='order-col-label'>Total</span>
                    <span className='order-amount tnum'>{currency}{order.amount}</span>
                    <select
                      className={'order-status order-status-' + statusClass(order.status)}
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                    >
                      <option value="Food Processing">Food Processing</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Order
