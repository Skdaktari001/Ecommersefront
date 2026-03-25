import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  PackagePlus, 
  Package, 
  ShoppingCart, 
  Shield, 
  BarChart3, 
  Settings,
  Users as UsersIcon,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

const Sidebar = ({ userProfile, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/add', icon: PackagePlus, label: 'Add Product' },
    { path: '/list', icon: Package, label: 'Products' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin-management', icon: Shield, label: 'Admins' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/users', icon: UsersIcon, label: 'Users' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/admin/reviews', icon: BarChart3, label: 'Reviews' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-[70] w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header/Branding */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <span className="text-xl font-black tracking-widest text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Shield size={20} className="text-white" />
              </div>
              FOREVER
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all group ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <item.icon size={18} className={`${location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Footer */}
          {userProfile && (
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <NavLink 
                to="/profile" 
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-700 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
                  {userProfile.profileImage ? (
                    <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <User size={18} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[13px] font-bold text-white truncate">{userProfile.name}</p>
                  <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest font-medium">Administrator</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar