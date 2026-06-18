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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('auth_token') === 'logged_in';
  });

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
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
