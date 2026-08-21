import React, { useState } from 'react'
import './PromoBanner.css'

const PromoBanner = () => {
  const [show, setShow] = useState(() => localStorage.getItem('promo-dismissed') !== '1')
  if (!show) return null
  const dismiss = () => { localStorage.setItem('promo-dismissed', '1'); setShow(false) }
  return (
    <div className='promo-banner'>
      <span>🎉 Save on your order — use <b>SAVE20</b> for 20% off, or <b>FLAT50</b> for ₹50 off orders over ₹200.</span>
      <button className='promo-close' onClick={dismiss} aria-label='Dismiss'>✕</button>
    </div>
  )
}

export default PromoBanner
