import React from 'react';
import { assets } from '../assets/assets';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ setToken, userProfile, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      className="flex items-center justify-between py-4 px-6 
      sticky top-0 z-50"
      style={{
        background: "rgb(255, 255, 255)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
        padding: "0.1rem 1.5rem"
      }}
    >

      {/* LEFT */}
      <div className="flex items-center gap-6">
        
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-xl"
          style={{ background: "transparent" }}
        >
          <Menu size={20} style={{ color: "var(--text-muted)" }} />
        </button>

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)"
            }}
          >
            <img
              src={assets.logopic}
              alt="logo"
              className="w-6 opacity-80 group-hover:opacity-100"
            />
          </div>

          <span
            className="hidden sm:block text-[11px] font-black tracking-[0.25em]"
            style={{ color: "var(--text-nav)" }}
          >
            CYNAURA
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl border"
          style={{
            borderColor: "transparent",
            color: "var(--text-muted)"
          }}
        >
          <Bell size={18} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: "var(--primary)" }}
          />
        </button>

        {/* Profile */}
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-xl border group"
          style={{
            borderColor: "transparent"
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)"
            }}
          >
            {userProfile?.profileImage ? (
              <img
                src={userProfile.profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} style={{ color: "var(--text-muted)" }} />
            )}
          </div>

          <div className="hidden md:block">
            <span
              className="text-[13px] font-semibold block"
              style={{ color: "var(--text-main)" }}
            >
              {userProfile?.name || 'Admin'}
            </span>
            <div
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {userProfile?.isAdmin ? 'Master' : 'User'}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold"
          style={{
            background: "var(--gold-gradient)",
            color: "#0B0B0F",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <LogOut size={14} />
          <span className="hidden md:inline uppercase tracking-widest">
            logout
          </span>
        </button>

      </div>
    </div>
  );
};

export default NavBar;