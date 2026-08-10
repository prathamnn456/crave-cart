import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { url } from '../../assets/assets'
import './Login.css'

const Login = ({ onLogin, theme, toggleTheme }) => {

  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setData(d => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/admin/login`, data);
      if (res.data.success) {
        onLogin(res.data.token);
        toast.success('Welcome back, admin 👋');
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Could not reach the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='admin-login'>
      <button className='admin-login-theme' onClick={toggleTheme} aria-label='Toggle theme'>
        {theme === 'dark'
          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" strokeLinecap="round" /></svg>
          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" /></svg>}
      </button>

      <form className='admin-login-card' onSubmit={onSubmit}>
        <div className='admin-login-brand'>
          <svg viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7h7l5 20h16l4-14H16" stroke="#FF5A2C" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="21" cy="33" r="3.4" fill="#FF5A2C" />
            <circle cx="35" cy="33" r="3.4" fill="#FF5A2C" />
          </svg>
          <b>Crave<span>Cart</span><i>.</i></b>
        </div>

        <h1>Admin sign in</h1>
        <p className='admin-login-sub'>Manage your menu and orders.</p>

        <label>Email</label>
        <input name='email' type='email' value={data.email} onChange={onChange} placeholder='admin@cravecart.com' required autoFocus />

        <label>Password</label>
        <input name='password' type='password' value={data.password} onChange={onChange} placeholder='••••••••' required />

        <button className='btn' type='submit' disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}

export default Login
