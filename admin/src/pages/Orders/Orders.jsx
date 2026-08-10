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

const Order = () => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`)
    if (response.data.success) {
      setOrders(response.data.data.reverse());
    }
    else {
      toast.error("Error")
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
      </div>

      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-card'>
            <div className='order-box'>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 8l8-4 8 4-8 4-8-4Z" /><path d="M4 8v8l8 4 8-4V8" strokeLinejoin="round" /></svg>
            </div>

            <div className='order-details'>
              <p className='order-food'>
                {order.items.map((item, i) => (
                  i === order.items.length - 1
                    ? item.name + " x " + item.quantity
                    : item.name + " x " + item.quantity + ", "
                ))}
              </p>
              <p className='order-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-phone'>{order.address.phone}</p>
            </div>

            <div className='order-meta'>
              <span className='order-items-count'>Items: {order.items.length}</span>
              <span className='order-amount tnum'>{currency}{order.amount}</span>
              <span className={'pill ' + statusClass(order.status)}>{order.status}</span>
            </div>

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
        ))}
      </div>
    </div>
  )
}

export default Order
