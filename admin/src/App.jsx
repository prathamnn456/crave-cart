import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Login from './components/Login/Login'
import { Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// restore admin session before any request fires
const storedToken = localStorage.getItem('admin_token');
if (storedToken) axios.defaults.headers.common['token'] = storedToken;

const App = () => {

  const [theme, setTheme] = useState(() => localStorage.getItem('cc-theme') || 'light');
  const [token, setToken] = useState(storedToken || '');
  const [search, setSearch] = useState('');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cc-theme', theme);
  }, [theme]);

  // clear the search box when moving between pages
  useEffect(() => { setSearch(''); }, [location.pathname]);

  // auto-logout if the server rejects the admin token
  useEffect(() => {
    const id = axios.interceptors.response.use(res => {
      const msg = res?.data?.message || '';
      if (res?.data?.success === false && /not authorized|log in as admin|session expired|admin access/i.test(msg)) {
        handleLogout();
        toast.error('Session expired — please sign in again');
      }
      return res;
    });
    return () => axios.interceptors.response.eject(id);
  }, []);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const handleLogin = (t) => {
    axios.defaults.headers.common['token'] = t;
    localStorage.setItem('admin_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common['token'];
    localStorage.removeItem('admin_token');
    setToken('');
  };

  return (
    <>
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} autoClose={2000} />
      {!token
        ? <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />
        : (
          <div className='app-shell'>
            <Sidebar />
            <div className="main">
              <Navbar theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} search={search} setSearch={setSearch} pathname={location.pathname} />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/add" element={<Add />} />
                  <Route path="/list" element={<List search={search} />} />
                  <Route path="/orders" element={<Orders search={search} />} />
                </Routes>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default App
