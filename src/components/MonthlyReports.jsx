import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllReports, getAllMonthKeys } from '../data/store';
import { MONTHS_UZ } from '../utils/excel';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

function fmt(num) {
  return Number(num || 0).toLocaleString('uz-UZ');
}

export default function MonthlyReports() {
  const [monthKeys, setMonthKeys] = useState([]);
  const [allReports, setAllReports] = useState({});
  const [newYear, setNewYear] = useState(CURRENT_YEAR);
  const [newMonth, setNewMonth] = useState(CURRENT_MONTH);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setMonthKeys(getAllMonthKeys());
    setAllReports(getAllReports());
  }

  function goToMonth() {
    // navigate to detail page
    window.location.hash = `#/reports/${newYear}/${String(newMonth).padStart(2, '0')}`;
    window.location.href = `/reports/${newYear}/${String(newMonth).padStart(2, '0')}`;
  }

  const years = [...new Set(monthKeys.map((k) => k.split('-')[0]))].sort().reverse();

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* New Month Selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">📅 Oy tanlang yoki yangi yarating</div>
            <div className="card-subtitle">Mavjud bo'lmagan oy avtomatik yaratiladi</div>
          </div>
        </div>
        <div className="month-selector" style={{ padding: 0, background: 'none', border: 'none' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 120 }}>
            <label className="form-label">Yil</label>
            <select className="form-select" value={newYear} onChange={(e) => setNewYear(Number(e.target.value))}>
              {[2023, 2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 2, minWidth: 160 }}>
            <label className="form-label">Oy</label>
            <select className="form-select" value={newMonth} onChange={(e) => setNewMonth(Number(e.target.value))}>
              {MONTHS_UZ.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <label className="form-label" style={{ opacity: 0 }}>.</label>
            <Link
              to={`/reports/${newYear}/${String(newMonth).padStart(2, '0')}`}
              className="btn btn-primary"
            >
              📂 Ochish
            </Link>
          </div>
        </div>
      </div>

      {/* Months Grid */}
      {monthKeys.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Hali hisobot yo'q</div>
          <div className="empty-desc">Yuqoridan oy tanlang va hisobot yarating</div>
        </div>
      ) : (
        <>
          {years.map((year) => {
            const yearKeys = monthKeys.filter((k) => k.startsWith(year + '-'));
            return (
              <div key={year} style={{ marginBottom: 28 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: 12, paddingLeft: 4,
                }}>
                  📆 {year} - YIL
                </div>
                <div className="month-grid">
                  {yearKeys.map((key) => {
                    const [yr, mn] = key.split('-');
                    const records = allReports[key] || [];
                    const totalRevenue = records.reduce((s, r) => s + (parseFloat(r.jamiSumma) || 0), 0);
                    const totalProfit = records.reduce((s, r) => s + (parseFloat(r.foyda) || 0), 0);

                    return (
                      <Link key={key} to={`/reports/${yr}/${mn}`} className="month-card">
                        <div className="month-card-header">
                          <div>
                            <div className="month-name">{MONTHS_UZ[parseInt(mn) - 1]}</div>
                            <div className="month-year">{yr} - yil</div>
                          </div>
                          <div className="month-count">{records.length} ta</div>
                        </div>
                        <div className="month-stats">
                          <div className="month-stat">
                            <div className="month-stat-label">Jami Summa</div>
                            <div className="month-stat-value blue">{fmt(totalRevenue)}</div>
                          </div>
                          <div className="month-stat">
                            <div className="month-stat-label">Foyda</div>
                            <div className="month-stat-value green">{fmt(totalProfit)}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
