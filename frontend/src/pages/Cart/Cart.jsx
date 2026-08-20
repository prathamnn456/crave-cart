import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {

  const {cartItems, food_list, removeFromCart,getTotalCartAmount,url,currency,deliveryCharge,coupon,applyCoupon,removeCoupon,getDiscount} = useContext(StoreContext);
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");

  const subtotal = getTotalCartAmount();
  const discount = getDiscount();
  const total = subtotal === 0 ? 0 : subtotal - discount + deliveryCharge;

  const applyPromo = async () => {
    const ok = await applyCoupon(promo);
    if (ok) setPromo("");
  };

  return (
    <div className='cart'>
      <h1 className='cart-page-title'>Your cart</h1>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id]>0) {
            return (<div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={url+"/images/"+item.image} alt="" />
                <p>{item.name}</p>
                <p>{currency}{item.price}</p>
                <div>{cartItems[item._id]}</div>
                <p>{currency}{item.price*cartItems[item._id]}</p>
                <p className='cart-items-remove-icon' onClick={()=>removeFromCart(item._id)}>x</p>
              </div>
              <hr />
            </div>)
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{subtotal}</p></div>
            <hr />
            {discount > 0 && (
              <>
                <div className="cart-total-details cart-total-discount">
                  <p>Discount ({coupon.code})</p><p>-{currency}{discount}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{subtotal===0?0:deliveryCharge}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>{currency}{total}</b></div>
          </div>
          <button
            onClick={()=>navigate('/order')}
            disabled={subtotal===0}
            title={subtotal===0 ? 'Add items to your cart first' : ''}
          >PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            {coupon ? (
              <div className='cart-coupon-applied'>
                <span>✅ <b>{coupon.code}</b> applied — {coupon.label}</span>
                <button type='button' onClick={removeCoupon}>Remove</button>
              </div>
            ) : (
              <>
                <p>If you have a promo code, Enter it here</p>
                <div className='cart-promocode-input'>
                  <input type="text" placeholder='promo code' value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') applyPromo(); }} />
                  <button onClick={applyPromo}>Submit</button>
                </div>
                <p className='cart-promocode-hint'>Try <b>CRAVE10</b>, <b>SAVE20</b>, <b>WELCOME15</b> or <b>FLAT50</b> (₹200+).</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
