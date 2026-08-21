import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import DeliveryMap from '../../components/DeliveryMap/DeliveryMap';

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
  const [openMap, setOpenMap] = useState(null);
  const { url, token, currency, addToCart, food_list, deliveryCharge } = useContext(StoreContext);
  const navigate = useNavigate();

  const printReceipt = (order) => {
    const a = order.address || {};
    const subtotal = order.items.reduce((s, it) => s + it.price * it.quantity, 0);
    const rows = order.items.map(it => (
      `<tr><td>${it.name}</td><td class="c">${it.quantity}</td><td class="r">${currency}${it.price}</td><td class="r">${currency}${it.price * it.quantity}</td></tr>`
    )).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${order._id.slice(-6).toUpperCase()}</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;color:#222;max-width:420px;margin:24px auto;padding:0 18px}
        h1{color:tomato;margin:0 0 2px;font-size:26px}
        .muted{color:#777;font-size:12px}
        table{width:100%;border-collapse:collapse;margin-top:14px;font-size:13px}
        th,td{padding:7px 4px;border-bottom:1px solid #eee}
        th{text-align:left;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
        .c{text-align:center}.r{text-align:right}
        .totals td{border:none;padding:3px 4px}
        .grand td{font-weight:bold;font-size:15px;border-top:2px solid #222;padding-top:8px}
        .foot{margin-top:22px;text-align:center;color:#777;font-size:12px}
      </style></head>
      <body>
        <h1>CraveCart<span style="color:#222">.</span></h1>
        <div class="muted">Order #${order._id.slice(-6).toUpperCase()} · ${new Date(order.date).toLocaleString()}</div>
        <div class="muted">Status: ${order.status}</div>
        <table><thead><tr><th>Item</th><th class="c">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead><tbody>${rows}</tbody></table>
        <table class="totals">
          <tr><td>Subtotal</td><td class="r">${currency}${subtotal}</td></tr>
          ${order.discount ? `<tr><td>Discount ${order.coupon ? '(' + order.coupon + ')' : ''}</td><td class="r">-${currency}${order.discount}</td></tr>` : ''}
          <tr><td>Delivery</td><td class="r">${currency}${deliveryCharge}</td></tr>
          <tr class="grand"><td>Total paid</td><td class="r">${currency}${order.amount}</td></tr>
        </table>
        <div class="muted" style="margin-top:18px"><b>Deliver to</b><br>${a.firstName || ''} ${a.lastName || ''}<br>${[a.street, a.city, a.state, a.country, a.zipcode].filter(Boolean).join(', ')}<br>${a.phone || ''}</div>
        <div class="foot">Thank you for ordering with CraveCart! 🧡</div>
        <script>window.onload=function(){window.print()}</script>
      </body></html>`;
    const w = window.open('', '_blank', 'width=460,height=680');
    if (!w) { toast.error('Please allow pop-ups to print the receipt'); return; }
    w.document.write(html); w.document.close();
  }

  const reorder = async (order) => {
    let added = 0, skipped = 0;
    for (const it of order.items) {
      const live = food_list.find(f => f._id === it._id);
      if (!live || live.available === false) { skipped++; continue; }
      for (let n = 0; n < (it.quantity || 1); n++) { await addToCart(it._id); added++; }
    }
    if (added === 0) { toast.error("Those items aren't available anymore"); return; }
    if (skipped > 0) toast.info(`${skipped} unavailable item${skipped === 1 ? '' : 's'} skipped`);
    navigate('/cart');
  }

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data)
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    fetchOrders();
    // live-ish status: silently refresh every 20s while the page is open
    const id = setInterval(() => { if (!document.hidden) fetchOrders(true); }, 20000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className='my-orders'>
      <div className='my-orders-head'>
        <h2>My Orders {data.length > 0 && <span className='live-dot' title='Auto-updating'></span>}</h2>
        <button className='my-orders-refresh' onClick={() => fetchOrders()}>↻ Refresh</button>
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

              {order.status !== 'Delivered' && (
                <div className='order-eta'>
                  🛵 Estimated delivery by {new Date(new Date(order.date).getTime() + 40 * 60000).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

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

              <div className='order-map-toggle'>
                <button onClick={() => setOpenMap(openMap === order._id ? null : order._id)}>
                  {openMap === order._id ? '▲ Hide delivery location' : '📍 View delivery location'}
                </button>
                <button className='order-reorder' onClick={() => reorder(order)}>🔁 Reorder</button>
                <button onClick={() => printReceipt(order)}>🧾 Receipt</button>
              </div>
              {openMap === order._id && (
                <div className='order-map'>
                  <DeliveryMap address={order.address} height={220} />
                </div>
              )}
            </div>
          )
        })}
      </div>}
    </div>
  )
}

export default MyOrders
