import React, { useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import '../App.css'

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const adminName = localStorage.getItem('name') || 'Admin'
  const adminImage = localStorage.getItem('image') || ''

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/AdminDashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { path: '/users', label: 'Applications', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { path: '/items', label: 'Manage Jobs', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  ]

  return (
    <div className="admin-layout">
      <div className="sidebar" style={{ width: isOpen ? 'var(--sidebar-w)' : 'var(--sidebar-collapsed)' }}>
        <div className="sidebar-top">
          {isOpen && (
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">💼</div>
              <span>JobPortal</span>
            </div>
          )}
          <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>

        <div className="sidebar-nav">
          {navItems.map(item => (
            <div key={item.path} className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={!isOpen ? item.label : ''}>
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </div>
          ))}

          <div className="sidebar-divider" />

          <div className="sidebar-item" onClick={() => { localStorage.clear(); navigate('/login') }} title={!isOpen ? 'Logout' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {isOpen && <span>Logout</span>}
          </div>
        </div>

        {isOpen && (
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="admin-avatar">
                {adminImage ? <img src={adminImage} alt={adminName} /> : getInitials(adminName)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminName}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Administrator</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  )
}

export default Drawer
