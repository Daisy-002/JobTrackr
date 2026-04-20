import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  MdDashboard, MdWork, MdAddCircleOutline,
  MdBarChart, MdMenu, MdClose, MdLogout,
} from 'react-icons/md'
import { useAppCtx } from '../../context/ApplicationContext.jsx'

const links = [
  { to: '/dashboard',        icon: <MdDashboard />,       label: 'Dashboard' },
  { to: '/applications',     icon: <MdWork />,            label: 'Applications' },
  { to: '/applications/new', icon: <MdAddCircleOutline />, label: 'Add Job' },
  { to: '/analytics',        icon: <MdBarChart />,         label: 'Analytics' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { userName, setUserName } = useAppCtx()

  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : 'U'

  function handleLogout() {
    setUserName('')
  }

  const navContent = (
    <nav className="sidebar-nav">
      <p className="nav-label">Menu</p>
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={() => setOpen(false)}
        >
          {l.icon}
          {l.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">💼</div>
          <span className="logo-name">Job<span>Trackr</span></span>
        </div>
        {navContent}
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar">{avatarLetter}</div>
            <div>
              <div className="user-name">{userName || 'User'}</div>
              <div className="user-role">Job Seeker</div>
            </div>
            <button 
              className="btn btn-ghost btn-icon" 
              onClick={handleLogout}
              title="Logout"
            >
              <MdLogout size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-bar">
        <div className="flex-center gap-2">
          <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 14 }}>💼</div>
          <span className="logo-name" style={{ fontSize: 15 }}>Job<span>Trackr</span></span>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={() => setOpen(o => !o)}>
          {open ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mobile-drawer">
          {navContent}
          {userName && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{userName}</div>
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => {
                  handleLogout()
                  setOpen(false)
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MdLogout size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
