import React, { useContext } from 'react'
import './FoodModal.css'
import { StoreContext } from '../../Context/StoreContext'
import StarRating, { ratingFor } from '../StarRating/StarRating'

const FoodModal = ({ item, onClose }) => {
  const { url, currency, cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  if (!item) return null;

  const { rating, count } = ratingFor(item.id);
  const qty = cartItems[item.id] || 0;

  return (
    <div className='food-modal-overlay' onClick={onClose}>
      <div className='food-modal' onClick={(e) => e.stopPropagation()} role='dialog' aria-label={item.name}>
        <button className='food-modal-close' onClick={onClose} aria-label='Close'>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
        </button>

        <div className='food-modal-img'>
          <img src={url + "/images/" + item.image} alt={item.name} />
          <span className={'veg-dot' + (item.type === 'nonveg' ? ' nonveg' : '')} title={item.type === 'nonveg' ? 'Non-veg' : 'Veg'}></span>
        </div>

        <div className='food-modal-body'>
          <div className='food-modal-top'>
            <h2>{item.name}</h2>
            <StarRating rating={rating} count={count} />
          </div>
          {item.category && <span className='food-modal-cat'>{item.category}</span>}
          <p className='food-modal-desc'>{item.desc}</p>

          <div className='food-modal-foot'>
            <span className='food-modal-price'>{currency}{item.price}</span>
            {qty === 0 ? (
              <button className='food-modal-add' onClick={() => addToCart(item.id)}>Add to cart</button>
            ) : (
              <div className='food-modal-stepper'>
                <button onClick={() => removeFromCart(item.id)} aria-label='Remove one'>−</button>
                <span className='tnum'>{qty}</span>
                <button onClick={() => addToCart(item.id)} aria-label='Add one'>+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodModal
