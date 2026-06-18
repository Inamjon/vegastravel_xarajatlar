import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../data/store';
import { MONTHS_UZ } from '../utils/excel';

function fmt(num) {
  return Number(num || 0).toLocaleString('uz-UZ');
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getDashboardStats());
  }, []);

  if (!stats) return <div style={{ color: 'var(--text-muted)', padding: 40 }}>Yuklanmoqda...</div>;

  const maxRevenue = Math.max(...stats.monthlyData.map((m) => m.revenue), 1);
  const maxProfit = Math.max(...stats.monthlyData.map((m) => m.profit), 1);

  const recent = stats.monthlyData.slice(-6).reverse();

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon blue">💰</div>
          <div className="stat-label">Jami Daromad</div>
          <div className="stat-value blue">{fmt(stats.totalRevenue)}</div>
          <div className="stat-meta">Barcha oylar bo'yicha</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">📈</div>
          <div className="stat-label">Jami Foyda</div>
          <div className="stat-value green">{fmt(stats.totalProfit)}</div>
          <div className="stat-meta">Sof daromad</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple">💸</div>
          <div className="stat-label">Jami Xarajat</div>
          <div className="stat-value purple">{fmt(stats.totalExpenses)}</div>
          <div className="stat-meta">Barcha xarajatlar</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon orange">📋</div>
          <div className="stat-label">Jami Yozuvlar</div>
          <div className="stat-value orange">{stats.totalRecords}</div>
          <div className="stat-meta">Barcha hisobotlar</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📊 Oylik Daromad</div>
              <div className="card-subtitle">Oylar bo'yicha</div>
            </div>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-icon">📭</div>
              <div className="empty-desc">Hali ma'lumot yo'q</div>
            </div>
          ) : (
            <div className="chart-bar-wrap">
              {recent.map((m) => (
                <div key={m.key} className="chart-bar-item">
                  <div className="chart-bar-label" style={{ fontSize: 11 }}>
                    {MONTHS_UZ[parseInt(m.month) - 1]?.slice(0, 3)} {m.year}
                  </div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{ width: `${(m.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <div className="chart-bar-val">{fmt(m.revenue)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profit Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">💹 Oylik Foyda</div>
              <div className="card-subtitle">Oylar bo'yicha sof foyda</div>
            </div>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-icon">📭</div>
              <div className="empty-desc">Hali ma'lumot yo'q</div>
            </div>
          ) : (
            <div className="chart-bar-wrap">
              {recent.map((m) => (
                <div key={m.key} className="chart-bar-item">
                  <div className="chart-bar-label" style={{ fontSize: 11 }}>
                    {MONTHS_UZ[parseInt(m.month) - 1]?.slice(0, 3)} {m.year}
                  </div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill green"
                      style={{ width: `${(m.profit / maxProfit) * 100}%` }}
                    />
                  </div>
                  <div className="chart-bar-val">{fmt(m.profit)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🗓️ So'nggi Oylar</div>
          <Link to="/reports" className="btn btn-secondary btn-sm">Barchasi →</Link>
        </div>
        {stats.monthlyData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">Hali hisobot yo'q</div>
            <div className="empty-desc">Oylik hisobotlar qo'shishni boshlang</div>
            <Link to="/reports" className="btn btn-primary" style={{ marginTop: 12 }}>
              + Hisobot qo'shish
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.monthlyData.slice(-6).reverse().map((m) => (
              <Link
                key={m.key}
                to={`/reports/${m.year}/${m.month}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.2s', cursor: 'pointer',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(99,102,241,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}>📅</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {MONTHS_UZ[parseInt(m.month) - 1]} {m.year}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {m.records} ta yozuv
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Daromad</div>
                      <div style={{ fontWeight: 700, color: 'var(--accent-3)', fontSize: 14 }}>{fmt(m.revenue)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Foyda</div>
                      <div style={{ fontWeight: 700, color: '#34d399', fontSize: 14 }}>{fmt(m.profit)}</div>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
