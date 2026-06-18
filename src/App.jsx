import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MonthlyReports from './components/MonthlyReports';
import ReportDetail from './components/ReportDetail';
import MonthlyExpenses from './components/MonthlyExpenses';
import ExpenseDetail from './components/ExpenseDetail';
import Backup from './components/Backup';
import { initStore } from './data/store';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('auth_token') === 'logged_in';
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initStore().then(() => {
      setIsLoading(false);
    });
  }, []);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          fontSize: 32,
          marginBottom: 16,
          animation: 'spin 1.5s linear infinite',
        }}>🔄</div>
        <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.05em' }}>
          Ma'lumotlar yuklanmoqda...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<MonthlyReports />} />
          <Route path="reports/:year/:month" element={<ReportDetail />} />
          <Route path="expenses" element={<MonthlyExpenses />} />
          <Route path="expenses/:year/:month" element={<ExpenseDetail />} />
          <Route path="backup" element={<Backup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
