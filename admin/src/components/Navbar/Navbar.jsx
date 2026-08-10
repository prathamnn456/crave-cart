import React from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ theme, toggleTheme, onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className='navbar'>
      <div className="navbar-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" /></svg>
        <input placeholder='Search items, orders, customers…' />
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" /></svg>
          )}
        </button>
        <button className="btn" onClick={() => navigate('/add')}>+ Add Item</button>
        <button className="navbar-icon-btn" onClick={onLogout} title="Log out" aria-label="Log out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12H3m0 0 4-4m-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  )
}

export default Navbar
