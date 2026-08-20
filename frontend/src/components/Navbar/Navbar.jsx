import React, { useContext, useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin, setShowCart, theme, toggleTheme }) => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token ,setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  // scroll-spy: highlight the section currently in view (home page only)
  useEffect(() => {
    const sections = [
      { id: 'footer', name: 'contact' },
      { id: 'app-download', name: 'mob-app' },
      { id: 'explore-menu', name: 'menu' },
    ];
    const onScroll = () => {
      const y = window.scrollY + 140;
      let active = 'home';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && y >= el.offsetTop) { active = s.name; break; }
      }
      setMenu(active);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logged out successfully")
    navigate('/')
  }

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
      </ul>
      <div className="navbar-right">
        <button className='navbar-theme-toggle' onClick={toggleTheme} aria-label='Toggle theme' title='Toggle theme'>
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" /></svg>
          )}
        </button>
        <img src={assets.search_icon} alt="" />
        <button type='button' className='navbar-fav-icon' onClick={() => navigate('/favorites')} aria-label='Favorites' title='Favorites'>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-6.7-4.35-9.33-8.02C.9 10.36 1.4 6.9 4.1 5.6c1.9-.9 4.02-.2 5.2 1.35L12 9.9l2.7-2.95c1.18-1.55 3.3-2.25 5.2-1.35 2.7 1.3 3.2 4.76 1.43 7.38C18.7 16.65 12 21 12 21Z" strokeLinejoin="round"/></svg>
        </button>
        <button type='button' className='navbar-search-icon' onClick={() => setShowCart(true)} aria-label='Open cart'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </button>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
              <hr />
              <li onClick={()=>navigate('/favorites')}> <img src={assets.bag_icon} alt="" style={{visibility:'hidden'}} /> <p>❤️ Favorites</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
            </ul>
          </div>
        }

      </div>
    </div>
  )
}

export default Navbar
