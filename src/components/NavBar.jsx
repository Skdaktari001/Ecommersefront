// components/NavBar.jsx
import React from 'react';
import { assets } from '../assets/assets';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ token, setToken, userProfile, fetchUserProfile, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className='flex items-center justify-between py-4 px-6 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm shadow-slate-200/50'>
      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-6">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 -ml-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <Menu size={20} className="text-slate-600" />
        </button>

        <div onClick={handleHomeClick} className='cursor-pointer flex items-center gap-3 group'>
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
            <img className='w-6 opacity-80 group-hover:opacity-100 transition-opacity' src={assets.logo} alt="Logo" />
          </div>
          <div className="hidden sm:block">
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-slate-400 block leading-none mb-1">Station</span>
            <span className="text-sm font-bold text-slate-900 block leading-none">Console</span>
          </div>
        </div>
      </div>

      {/* User Info and Actions */}
      <div className='flex items-center gap-4'>
        {/* Notifications */}
        <button className='relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-all border border-transparent hover:border-slate-200'>
          <Bell size={18} />
          <span className='absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white'></span>
        </button>

        {/* User Profile */}
        <div 
          onClick={handleProfileClick}
          className='flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-xl transition-all border border-transparent hover:border-slate-200 group'
        >
          <div className='w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-indigo-200 transition-all'>
            {userProfile?.profileImage ? (
              <img 
                src={userProfile.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-slate-400" />
            )}
          </div>
          <div className='hidden md:block'>
            <span className='text-[13px] font-bold text-slate-900 block leading-none mb-1'>{userProfile?.name || 'Admin'}</span>
            <div className='text-[10px] text-slate-400 uppercase tracking-widest font-bold'>{userProfile?.isAdmin ? 'Master' : 'User'}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className='bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 hover:shadow-indigo-500/20'
        >
          <LogOut size={14} />
          <span className='hidden md:inline uppercase tracking-widest'>Exit</span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;