import React, { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import LoginPopup from './components/LoginPopup/LoginPopup'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import CartDrawer from './components/CartDrawer/CartDrawer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify'
import Favorites from './pages/Favorites/Favorites'
import Profile from './pages/Profile/Profile'

const App = () => {

  const [showLogin,setShowLogin] = useState(false);
  const [showCart,setShowCart] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('cc-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cc-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <>
    <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} autoClose={2000}/>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <CartDrawer show={showCart} setShow={setShowCart} setShowLogin={setShowLogin}/>
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} setShowCart={setShowCart} theme={theme} toggleTheme={toggleTheme}/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/order' element={<PlaceOrder />}/>
          <Route path='/myorders' element={<MyOrders />}/>
          <Route path='/favorites' element={<Favorites />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/verify' element={<Verify />}/>
        </Routes>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default App
