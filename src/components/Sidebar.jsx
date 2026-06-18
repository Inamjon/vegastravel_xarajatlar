import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', icon: '📊', label: 'Dashboard', exact: true },
  { section: 'Hisobotlar' },
  { to: '/reports', icon: '📋', label: 'Oylik Hisobotlar' },
  { to: '/expenses', icon: '💸', label: 'Oylik Xarajatlar' },
  { section: 'Ma\'lumotlar' },
  { to: '/backup', icon: '💾', label: 'Zaxira / Import' },
];

export default function Sidebar({ onLogout, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const now = new Date();

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <div className="logo-icon">✈️</div>
            <div>
              <div className="logo-text">Tur Operator</div>
              <div className="logo-sub">Hisobot Tizimi</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item, i) => {
            if (item.section) {
              return <div key={i} className="nav-section-label">{item.section}</div>;
            }
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && item.to !== '/';

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, padding: '0 4px' }}>
            {now.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span> Chiqish
          </button>
        </div>
      </aside>
    </>
  );
}
