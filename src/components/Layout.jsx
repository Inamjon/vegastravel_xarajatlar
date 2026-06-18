import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Umumiy ko\'rinish va statistika' },
  '/reports': { title: 'Oylik Hisobotlar', subtitle: 'Barcha oylik daromad hisobotlari' },
  '/expenses': { title: 'Oylik Xarajatlar', subtitle: 'Barcha oylik xarajatlar ro\'yxati' },
  '/backup': { title: 'Zaxira / Import', subtitle: 'Ma\'lumotlarni eksport va import qilish' },
};

function getPageInfo(pathname) {
  if (pathname.startsWith('/reports/')) return { title: 'Hisobot Tafsilotlari', subtitle: 'Oy bo\'yicha batafsil hisobot' };
  if (pathname.startsWith('/expenses/')) return { title: 'Xarajatlar Tafsilotlari', subtitle: 'Oy bo\'yicha batafsil xarajatlar' };
  return PAGE_TITLES[pathname] || { title: 'Sahifa', subtitle: '' };
}

export default function Layout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { title, subtitle } = getPageInfo(location.pathname);
  const now = new Date();

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menyu">
              ☰
            </button>
            <div>
              <div className="page-title">{title}</div>
              {subtitle && <div className="page-subtitle">{subtitle}</div>}
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-date">
              📅 {now.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="user-chip">
              <div className="user-avatar">V</div>
              Vegas
            </div>
          </div>
        </header>

        <div className="page-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
