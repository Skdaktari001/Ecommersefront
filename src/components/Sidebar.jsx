import React from 'react'
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
  User
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
      {/* ✅ OVERLAY (Mobile Only) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 lg:hidden z-[90]"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(6px)"
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[100] w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0`}
        style={{
          top: "54px", 
          height: "calc(100vh - 54px)",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-light)"
        }}
      >
        <div className="flex flex-col h-full">

          {/* 🔥 HEADER */}
          <div 
            className="h-20 flex items-center px-6"
            style={{ borderBottom: "1px solid var(--border-light)" }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)"
                }}
              >
                <Shield size={18} style={{ color: "var(--primary)" }} />
              </div>

              <span 
                className="text-sm font-black tracking-[0.25em]"
                style={{ color: "var(--text-muted)" }}
              >
                CYNAURA
              </span>
            </div>
          </div>

          {/* 🔥 NAV ITEMS */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all group"
                  style={{
                    background: isActive 
                      ? "rgba(212,175,55,0.1)" 
                      : "transparent",
                    color: isActive 
                      ? "var(--primary)" 
                      : "var(--text-muted)",
                    border: isActive 
                      ? "1px solid rgba(212,175,55,0.2)" 
                      : "1px solid transparent"
                  }}
                >
                  <item.icon 
                    size={18} 
                    style={{
                      color: isActive 
                        ? "var(--primary)" 
                        : "var(--text-muted)"
                    }}
                  />

                  <span className="flex-1">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* 🔥 FOOTER */}
          {userProfile && (
            <div 
              className="p-4"
              style={{
                borderTop: "1px solid var(--border-light)",
                background: "rgba(255,255,255,0.02)"
              }}
            >
              <NavLink 
                to="/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
              >
                <div 
                  className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  {userProfile.profileImage ? (
                    <img 
                      src={userProfile.profileImage} 
                      alt="profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} style={{ color: "var(--text-muted)" }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p 
                    className="text-[13px] font-semibold truncate"
                    style={{ color: "var(--text-main)" }}
                  >
                    {userProfile.name}
                  </p>

                  <p 
                    className="text-[10px] uppercase tracking-widest truncate"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Administrator
                  </p>
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