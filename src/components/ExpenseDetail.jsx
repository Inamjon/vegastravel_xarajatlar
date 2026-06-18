import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getMonthExpenses, addExpense, updateExpense, deleteExpense,
} from '../data/store';
import { exportExpensesToExcel, MONTHS_UZ } from '../utils/excel';

function fmt(num) {
  return Number(num || 0).toLocaleString('uz-UZ');
}

const EXPENSE_CATEGORIES = [
  'Ofis ijarasi', 'Kommunal xarajatlar', 'Xodimlar maoshi', 'Marketing va reklama',
  'Transport xarajatlari', 'Mehmonxona to\'lovi', 'Ovqatlanish', 'Aloqa xarajatlari',
  'Kompyuter va texnika', 'Dasturiy ta\'minot', 'Bank xarajatlari', 'Soliqlar',
  'Vizalar va rasmiyatlar', 'Sugʻurta', 'Boshqa xarajatlar',
];

const EMPTY_FORM = { sana: new Date().toISOString().slice(0, 10), sabab: '', kategoriya: '', summa: '', izoh: '' };

export default function ExpenseDetail() {
  const { year, month } = useParams();
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const monthName = MONTHS_UZ[parseInt(month) - 1];

  useEffect(() => {
    refresh();
  }, [year, month]);

  function refresh() {
    setRecords(getMonthExpenses(year, month));
  }

  function openAdd() {
    setForm({ ...EMPTY_FORM, sana: new Date().toISOString().slice(0, 10) });
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(rec) {
    setForm({ ...rec });
    setEditId(rec.id);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  function handleSave() {
    if (!form.sabab || !form.summa) return;
    if (editId) {
      updateExpense(year, month, editId, form);
    } else {
      addExpense(year, month, form);
    }
    refresh();
    closeModal();
  }

  function handleDelete(id) {
    deleteExpense(year, month, id);
    setDeleteConfirm(null);
    refresh();
  }

  const filtered = records.filter((r) =>
    r.sabab?.toLowerCase().includes(search.toLowerCase()) ||
    r.kategoriya?.toLowerCase().includes(search.toLowerCase()) ||
    r.izoh?.toLowerCase().includes(search.toLowerCase())
  );

  const totalExp = filtered.reduce((s, r) => s + (parseFloat(r.summa) || 0), 0);

  // Group by category for summary
  const byCategory = {};
  filtered.forEach((r) => {
    const cat = r.kategoriya || 'Boshqa';
    byCategory[cat] = (byCategory[cat] || 0) + (parseFloat(r.summa) || 0);
  });
  const maxCat = Math.max(...Object.values(byCategory), 1);

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/expenses" className="breadcrumb-link">💸 Xarajatlar</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">📅 {monthName} {year}</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">💸 {monthName} {year} — Xarajatlar</div>
          <div className="page-header-subtitle">{records.length} ta xarajat yozuvi</div>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-success"
            onClick={() => exportExpensesToExcel(records, year, month)}
            disabled={records.length === 0}
          >
            📥 Excel yuklab olish
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            ＋ Xarajat qo'shish
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="summary-strip" style={{ gridColumn: '1' }}>
          <div className="summary-item" style={{ flex: 'none', width: '100%' }}>
            <div className="summary-item-label">Jami Xarajat (UZS)</div>
            <div className="summary-item-value" style={{ color: '#f87171', fontSize: 24 }}>{fmt(totalExp)}</div>
          </div>
          <div className="summary-item" style={{ flex: 'none', width: '48%' }}>
            <div className="summary-item-label">Yozuvlar soni</div>
            <div className="summary-item-value">{filtered.length}</div>
          </div>
          <div className="summary-item" style={{ flex: 'none', width: '48%' }}>
            <div className="summary-item-label">O'rtacha</div>
            <div className="summary-item-value" style={{ color: '#fcd34d' }}>
              {filtered.length > 0 ? fmt(Math.round(totalExp / filtered.length)) : '0'}
            </div>
          </div>
        </div>

        {/* Category chart */}
        {Object.keys(byCategory).length > 0 && (
          <div className="card" style={{ gridColumn: '2' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
              📊 Kategoriyalar bo'yicha
            </div>
            <div className="chart-bar-wrap">
              {Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([cat, val]) => (
                  <div key={cat} className="chart-bar-item">
                    <div className="chart-bar-label" style={{ fontSize: 11, width: 90 }}>{cat}</div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill"
                        style={{
                          width: `${(val / maxCat) * 100}%`,
                          background: 'linear-gradient(90deg, #ef4444, #f87171)',
                        }}
                      />
                    </div>
                    <div className="chart-bar-val">{fmt(val)}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <input
          className="form-input"
          placeholder="🔍 Sabab yoki kategoriya bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{search ? '🔍' : '💸'}</div>
          <div className="empty-title">{search ? 'Natija topilmadi' : 'Hali xarajat yo\'q'}</div>
          <div className="empty-desc">
            {search ? 'Qidiruv so\'zini o\'zgartiring' : '+ Xarajat qo\'shish tugmasini bosing'}
          </div>
          {!search && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={openAdd}>
              ＋ Xarajat qo'shish
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Sana</th>
                <th>Kategoriya</th>
                <th>Sabab / Tavsif</th>
                <th>Summa (UZS)</th>
                <th>Izoh</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, i) => (
                <tr key={rec.id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    📅 {rec.sana}
                  </td>
                  <td>
                    {rec.kategoriya ? (
                      <span className="badge badge-orange">🏷️ {rec.kategoriya}</span>
                    ) : '—'}
                  </td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ fontWeight: 600 }}>{rec.sabab}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#f87171' }}>{fmt(rec.summa)}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 180 }}>
                    {rec.izoh || '—'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-secondary btn-sm btn-icon"
                        title="Tahrirlash"
                        onClick={() => openEdit(rec)}
                      >✏️</button>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        title="O'chirish"
                        onClick={() => setDeleteConfirm(rec.id)}
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} style={{ color: 'var(--accent-3)' }}>JAMI XARAJAT</td>
                <td style={{ color: '#f87171' }}>{fmt(totalExp)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editId ? '✏️ Xarajatni tahrirlash' : '➕ Yangi xarajat qo\'shish'}</div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">📅 Sana *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.sana}
                    onChange={(e) => setForm((p) => ({ ...p, sana: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🏷️ Kategoriya</label>
                  <select
                    className="form-select"
                    value={form.kategoriya}
                    onChange={(e) => setForm((p) => ({ ...p, kategoriya: e.target.value }))}
                  >
                    <option value="">Tanlang...</option>
                    {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">📝 Sabab / Tavsif *</label>
                <input
                  className="form-input"
                  placeholder="Xarajat sababi yoki tavsifi"
                  value={form.sabab}
                  onChange={(e) => setForm((p) => ({ ...p, sabab: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">💴 Summa (UZS) *</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0"
                  value={form.summa}
                  onChange={(e) => setForm((p) => ({ ...p, summa: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">💬 Qo'shimcha izoh</label>
                <textarea
                  className="form-textarea"
                  placeholder="Qo'shimcha ma'lumot (ixtiyoriy)"
                  value={form.izoh}
                  onChange={(e) => setForm((p) => ({ ...p, izoh: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Bekor</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!form.sabab || !form.summa}
              >
                {editId ? '💾 Saqlash' : '➕ Qo\'shish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <div className="modal-title">🗑️ O'chirishni tasdiqlang</div>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Bu xarajatni o'chirishni xohlaysizmi?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Bekor</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                🗑️ O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
