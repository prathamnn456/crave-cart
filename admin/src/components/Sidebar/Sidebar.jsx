import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className='sidebar'>
      <div className="sidebar-brand">
        <svg viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7h7l5 20h16l4-14H16" stroke="#FF5A2C" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="21" cy="33" r="3.4" fill="#FF5A2C" />
          <circle cx="35" cy="33" r="3.4" fill="#FF5A2C" />
        </svg>
        <b>Crave<span>Cart</span><i>.</i></b>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-label">Manage</p>

        <NavLink to='/' end className="sidebar-option">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
          <p>Dashboard</p>
        </NavLink>

        <NavLink to='/add' className="sidebar-option">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" strokeLinecap="round" /></svg>
          <p>Add Item</p>
        </NavLink>

        <NavLink to='/list' className="sidebar-option">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 4v16" strokeLinecap="round" /></svg>
          <p>Menu</p>
        </NavLink>

        <NavLink to='/orders' className="sidebar-option">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16l-1.5 12.5A2 2 0 0 1 16.5 20h-9a2 2 0 0 1-2-1.5L4 6Z" /><path d="M9 6V4.5A2.5 2.5 0 0 1 11.5 2h1A2.5 2.5 0 0 1 15 4.5V6" strokeLinecap="round" /></svg>
          <p>Orders</p>
        </NavLink>
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-avatar">PN</div>
        <div className="sidebar-who">
          <b>Pratham N.</b>
          <span>Store admin</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
