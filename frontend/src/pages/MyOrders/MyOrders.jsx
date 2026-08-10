import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const STEPS = [
  { key: 'Food Processing', label: 'Order placed' },
  { key: 'Out for delivery', label: 'Out for delivery' },
  { key: 'Delivered', label: 'Delivered' },
];

const statusClass = (status) => {
  if (status === 'Delivered') return 'good';
  if (status === 'Out for delivery') return 'warn';
  return 'info';
};

const MyOrders = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token])

  return (
    <div className='my-orders'>
      <div className='my-orders-head'>
        <h2>My Orders</h2>
        <button className='my-orders-refresh' onClick={fetchOrders}>↻ Refresh</button>
      </div>

      {loading && (
        <div className="container">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className='my-orders-order' key={i}>
              <div className='order-head'>
                <div className='sk' style={{ width: 46, height: 46, borderRadius: 12 }}></div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className='sk sk-line lg'></div>
                  <div className='sk sk-line sm'></div>
                </div>
              </div>
              <div className='sk' style={{ height: 30, marginTop: 24, borderRadius: 8 }}></div>
            </div>
          ))}
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className='my-orders-empty'>
          <p>No orders yet.</p>
          <span>Your placed orders will show up here.</span>
        </div>
      )}

      {!loading && <div className="container">
        {data.map((order, index) => {
          const currentStep = Math.max(0, STEPS.findIndex(s => s.key === order.status));
          return (
            <div key={index} className='my-orders-order'>
              <div className='order-head'>
                <img src={assets.parcel_icon} alt="" />
                <div className='order-head-info'>
                  <b>{order.items.map((item, i) => (
                    i === order.items.length - 1
                      ? item.name + " x " + item.quantity
                      : item.name + " x " + item.quantity + ", "
                  ))}</b>
                  <span>{order.items.length} item{order.items.length === 1 ? '' : 's'} · {currency}{order.amount}.00</span>
                </div>
                <span className={'order-pill ' + statusClass(order.status)}>{order.status}</span>
              </div>

              <div className='track'>
                {STEPS.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className={'track-node' + (i < currentStep ? ' done' : '') + (i === currentStep ? ' current' : '')}>
                      <div className='track-dot'>{i < currentStep ? '✓' : i + 1}</div>
                      <span>{step.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={'track-bar' + (i < currentStep ? ' filled' : '')}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )
        })}
      </div>}
    </div>
  )
}

export default MyOrders
