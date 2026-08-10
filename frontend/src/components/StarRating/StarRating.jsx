import React from 'react'
import './StarRating.css'

// deterministic pseudo-rating from an id so each dish shows a stable rating
export const ratingFor = (id = '') => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffff;
  const rating = 3.8 + (h % 12) / 10;      // 3.8 – 4.9
  const count = 24 + (h % 476);            // 24 – 499
  return { rating: Math.round(rating * 10) / 10, count };
};

const StarRating = ({ rating = 4.5, count }) => {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className='star-rating' title={`${rating} out of 5`}>
      <span className='star-rating-stars'>
        <span className='star-rating-bg'>★★★★★</span>
        <span className='star-rating-fg' style={{ width: pct + '%' }}>★★★★★</span>
      </span>
      <b>{rating.toFixed(1)}</b>
      {count != null && <small>({count})</small>}
    </span>
  )
}

export default StarRating
