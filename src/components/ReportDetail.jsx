import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getMonthReports, addReport, updateReport, deleteReport,
} from '../data/store';
import { exportReportsToExcel, MONTHS_UZ } from '../utils/excel';

function fmt(num) {
  return Number(num || 0).toLocaleString('uz-UZ');
}

const EMPTY_FORM = {
  davlat: '', summa: '', jamiSumma: '', turOperator: '', foyda: '', jammiSumda: '',
};

const COUNTRIES = [
  'Turkiya', 'BAA (Dubai)', 'Misr', 'Tailand', 'Hindiston', 'Italiya',
  'Fransiya', 'Ispaniya', 'Gretsiya', 'Xitoy', 'Malayziya', 'Indoneziya',
  'Maldiv', 'Singapur', 'Yaponiya', 'Bali', 'Qozog\'iston', 'Rossiya',
  'Germaniya', 'Britaniya', 'Boshqa',
];

export default function ReportDetail() {
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
    setRecords(getMonthReports(year, month));
  }

  function openAdd() {
    setForm(EMPTY_FORM);
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
    if (!form.davlat || !form.summa) return;
    if (editId) {
      updateReport(year, month, editId, form);
    } else {
      addReport(year, month, form);
    }
    refresh();
    closeModal();
  }

  function handleDelete(id) {
    deleteReport(year, month, id);
    setDeleteConfirm(null);
    refresh();
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const filtered = records.filter((r) =>
    r.davlat?.toLowerCase().includes(search.toLowerCase()) ||
    r.turOperator?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSumma = filtered.reduce((s, r) => s + (parseFloat(r.summa) || 0), 0);
  const totalJamiSumma = filtered.reduce((s, r) => s + (parseFloat(r.jamiSumma) || 0), 0);
  const totalFoyda = filtered.reduce((s, r) => s + (parseFloat(r.foyda) || 0), 0);
  const totalJammiSumda = filtered.reduce((s, r) => s + (parseFloat(r.jammiSumda) || 0), 0);

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/reports" className="breadcrumb-link">📋 Hisobotlar</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">📅 {monthName} {year}</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📅 {monthName} {year} — Hisobot</div>
          <div className="page-header-subtitle">{records.length} ta yozuv</div>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-success"
            onClick={() => exportReportsToExcel(records, year, month)}
            disabled={records.length === 0}
          >
            📥 Excel yuklab olish
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            ＋ Yozuv qo'shish
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-strip">
        <div className="summary-item">
          <div className="summary-item-label">Jami Summa</div>
          <div className="summary-item-value" style={{ color: 'var(--accent-3)' }}>{fmt(totalJamiSumma)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Foyda</div>
          <div className="summary-item-value" style={{ color: '#34d399' }}>{fmt(totalFoyda)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Summa</div>
          <div className="summary-item-value" style={{ color: '#fcd34d' }}>{fmt(totalSumma)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Jami Sumda</div>
          <div className="summary-item-value" style={{ color: '#c4b5fd' }}>{fmt(totalJammiSumda)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Yozuvlar</div>
          <div className="summary-item-value" style={{ color: 'var(--text-primary)' }}>{filtered.length}</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 14 }}>
        <input
          className="form-input"
          placeholder="🔍 Davlat yoki operator bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{search ? '🔍' : '📋'}</div>
          <div className="empty-title">{search ? 'Natija topilmadi' : 'Hali yozuv yo\'q'}</div>
          <div className="empty-desc">
            {search ? 'Qidiruv so\'zini o\'zgartiring' : '+ Yozuv qo\'shish tugmasini bosing'}
          </div>
          {!search && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={openAdd}>
              ＋ Yozuv qo'shish
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Davlat</th>
                <th>Summa</th>
                <th>Jami Summa</th>
                <th>Tur Operator</th>
                <th>Foyda</th>
                <th>Jami Sumda</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, i) => (
                <tr key={rec.id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                  <td>
                    <span className="badge badge-blue">🌍 {rec.davlat}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{fmt(rec.summa)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-3)' }}>{fmt(rec.jamiSumma)}</td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>🏢 {rec.turOperator || '—'}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#34d399' }}>{fmt(rec.foyda)}</td>
                  <td style={{ fontWeight: 600, color: '#c4b5fd' }}>{fmt(rec.jammiSumda)}</td>
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
                <td colSpan={2} style={{ color: 'var(--accent-3)' }}>JAMI</td>
                <td>{fmt(totalSumma)}</td>
                <td>{fmt(totalJamiSumma)}</td>
                <td></td>
                <td>{fmt(totalFoyda)}</td>
                <td>{fmt(totalJammiSumda)}</td>
                <td></td>
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
              <div className="modal-title">{editId ? '✏️ Yozuvni tahrirlash' : '➕ Yangi yozuv qo\'shish'}</div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">🌍 Davlat *</label>
                  <select
                    className="form-select"
                    value={form.davlat}
                    onChange={(e) => handleFormChange('davlat', e.target.value)}
                  >
                    <option value="">Tanlang...</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">🏢 Tur Operator</label>
                  <input
                    className="form-input"
                    placeholder="Operator nomi"
                    value={form.turOperator}
                    onChange={(e) => handleFormChange('turOperator', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">💵 Summa</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="0"
                    value={form.summa}
                    onChange={(e) => handleFormChange('summa', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">💰 Jami Summa</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="0"
                    value={form.jamiSumma}
                    onChange={(e) => handleFormChange('jamiSumma', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">📈 Foyda</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="0"
                    value={form.foyda}
                    onChange={(e) => handleFormChange('foyda', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🇺🇿 Jami Sumda (UZS)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="0"
                    value={form.jammiSumda}
                    onChange={(e) => handleFormChange('jammiSumda', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Bekor</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!form.davlat || !form.summa}
              >
                {editId ? '💾 Saqlash' : '➕ Qo\'shish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <div className="modal-title">🗑️ O'chirishni tasdiqlang</div>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Bu yozuvni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
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
