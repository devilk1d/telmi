import React, { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import '../styles/CMS/CMSLayout.css'

const CMSLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { path: '/cms', icon: '📊', label: 'Dashboard', exact: true },
    { path: '/cms/packages', icon: '📦', label: 'Kelola Paket' },
    { path: '/cms/customers', icon: '👥', label: 'Kelola Pelanggan' },
    { path: '/cms/recommendations', icon: '⭐', label: 'Rekomendasi' },
    { path: '/cms/settings', icon: '⚙️', label: 'Pengaturan' }
  ]

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="cms-layout">
      <aside className={`cms-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">📡</span>
            <span className="logo-text">TELMI CMS</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="back-to-site">
            <span>🏠</span>
            {sidebarOpen && <span>Kembali ke Situs</span>}
          </Link>
        </div>
      </aside>

      <main className="cms-main">
        <header className="cms-header">
          <div className="header-left">
            <h2>Panel Admin TELMI</h2>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="cms-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default CMSLayout



