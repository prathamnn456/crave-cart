import React, { useContext, useEffect, useState } from 'react'
import './FoodModal.css'
import { StoreContext } from '../../Context/StoreContext'
import StarRating from '../StarRating/StarRating'
import axios from 'axios'

const StarPicker = ({ value, onChange }) => (
  <div className='review-star-picker'>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        type='button'
        key={n}
        className={'review-star' + (n <= value ? ' filled' : '')}
        onClick={() => onChange(n)}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
      >★</button>
    ))}
  </div>
)

const FoodModal = ({ item, onClose }) => {
  const { url, currency, cartItems, addToCart, removeFromCart, getRating, token, submitReview } = useContext(StoreContext);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async (foodId) => {
    setLoadingReviews(true);
    try {
      const res = await axios.post(url + "/api/review/list", { foodId });
      if (res.data.success) setReviews(res.data.reviews);
    } finally {
      setLoadingReviews(false);
    }
  }

  useEffect(() => {
    if (item?.id) fetchReviews(item.id);
    setMyRating(0);
    setMyComment("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  if (!item) return null;

  const { avg: rating, count } = getRating(item.id);
  const qty = cartItems[item.id] || 0;

  const onSubmitReview = async (e) => {
    e.preventDefault();
    if (!myRating) return;
    setSubmitting(true);
    const ok = await submitReview(item.id, myRating, myComment);
    setSubmitting(false);
    if (ok) {
      setMyComment("");
      setMyRating(0);
      fetchReviews(item.id);
    }
  }

  const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

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

          {/* ---- Reviews ---- */}
          <div className='food-modal-reviews'>
            <h3>Reviews {count > 0 && <span className='reviews-avg'>★ {rating.toFixed(1)} · {count}</span>}</h3>

            {token ? (
              <form className='review-form' onSubmit={onSubmitReview}>
                <StarPicker value={myRating} onChange={setMyRating} />
                <textarea
                  placeholder='Share what you thought about this dish…'
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  rows={2}
                  maxLength={500}
                />
                <button type='submit' disabled={!myRating || submitting}>
                  {submitting ? 'Posting…' : 'Post review'}
                </button>
              </form>
            ) : (
              <p className='review-signin'>Sign in to leave a review.</p>
            )}

            {loadingReviews ? (
              <p className='reviews-loading'>Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p className='reviews-empty'>No reviews yet — be the first!</p>
            ) : (
              <ul className='review-list'>
                {reviews.map((rv) => (
                  <li key={rv._id} className='review-item'>
                    <div className='review-item-head'>
                      <b>{rv.userName}</b>
                      <span className='review-item-stars'>{'★'.repeat(rv.rating)}{'☆'.repeat(5 - rv.rating)}</span>
                      <small>{fmtDate(rv.date)}</small>
                    </div>
                    {rv.comment && <p>{rv.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodModal
