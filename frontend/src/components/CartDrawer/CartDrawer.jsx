import React, { useContext } from 'react'
import './CartDrawer.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const CartDrawer = ({ show, setShow, setShowLogin }) => {
  const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, url, currency, deliveryCharge, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const items = food_list.filter(f => cartItems[f._id] > 0);
  const subtotal = getTotalCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + deliveryCharge;

  const go = (path) => { setShow(false); navigate(path); };

  const checkout = () => {
    if (!token) { setShow(false); setShowLogin(true); return; }
    go('/order');
  };

  return (
    <>
      <div className={'cart-drawer-overlay' + (show ? ' show' : '')} onClick={() => setShow(false)}></div>
      <aside className={'cart-drawer' + (show ? ' show' : '')} role="dialog" aria-label="Cart">
        <header className='cart-drawer-head'>
          <h3>Your cart {items.length > 0 && <span>({items.length})</span>}</h3>
          <button className='cart-drawer-close' onClick={() => setShow(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className='cart-drawer-empty'>
            <div className='cart-drawer-empty-ic'>🛒</div>
            <p>Your cart is empty</p>
            <span>Add some delicious dishes to get started.</span>
            <button className='cart-drawer-browse' onClick={() => go('/')}>Browse menu</button>
          </div>
        ) : (
          <>
            <div className='cart-drawer-items'>
              {items.map(item => (
                <div className='cart-drawer-item' key={item._id}>
                  <img src={url + "/images/" + item.image} alt={item.name} />
                  <div className='cart-drawer-item-info'>
                    <b>{item.name}</b>
                    <span className='cart-drawer-item-price'>{currency}{item.price}</span>
                  </div>
                  <div className='cart-drawer-stepper'>
                    <button onClick={() => removeFromCart(item._id)} aria-label="Remove one">−</button>
                    <span className='tnum'>{cartItems[item._id]}</span>
                    <button onClick={() => addToCart(item._id)} aria-label="Add one">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className='cart-drawer-foot'>
              <div className='cart-drawer-row'><span>Subtotal</span><span className='tnum'>{currency}{subtotal}</span></div>
              <div className='cart-drawer-row'><span>Delivery</span><span className='tnum'>{currency}{deliveryCharge}</span></div>
              <div className='cart-drawer-row total'><span>Total</span><span className='tnum'>{currency}{total}</span></div>
              <button className='cart-drawer-checkout' onClick={checkout}>Checkout · {currency}{total}</button>
              <button className='cart-drawer-viewcart' onClick={() => go('/cart')}>View full cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
