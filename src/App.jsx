import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import Add from './pages/Add';
import Edit from './pages/Edit';
import List from './pages/List';
import Orders from './pages/Orders';
import AdminManagement from './pages/AdminManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import AdminReviews from './pages/AdminReviews';

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/";
export const currency = '$';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchUserProfile = async (retryCount = 0) => {
    if (!token) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}api/user-profile/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        }
      );

      if (response.data.success) {
        setUserProfile(response.data.user);
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED' && retryCount < 1) {
        console.warn('Profile fetch timed out, retrying once...');
        return fetchUserProfile(retryCount + 1);
      }

      console.error('Failed to fetch user profile:', error);

      if (error.response?.status === 401) {
        setToken('');
        localStorage.removeItem('token');
      }
    } finally {
      if (retryCount === 0 || !userProfile) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.timeout = 15000;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      delete axios.defaults.timeout;
      localStorage.removeItem('token');
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen font-roboto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex flex-col h-screen">
          {/* Top Navigation */}
          <NavBar
            token={token}
            setToken={setToken}
            userProfile={userProfile}
            fetchUserProfile={fetchUserProfile}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Layout Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
              userProfile={userProfile}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />

            {/* Content Scroll Area — lg:ml-64 offsets for the fixed sidebar on desktop */}
            <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 md:p-8 lg:p-10 lg:ml-64">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<AdminDashboard token={token} />} />
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/edit/:id" element={<Edit token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route path="/admin-management" element={<AdminManagement token={token} />} />
                  <Route path="/analytics" element={<Analytics token={token} />} />
                  <Route path="/settings" element={<Settings token={token} />} />
                  <Route path="/users" element={<Users token={token} />} />
                  <Route path="/profile" element={<UserProfile token={token} />} />
                  <Route path="/admin/reviews" element={<AdminReviews token={token} />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;