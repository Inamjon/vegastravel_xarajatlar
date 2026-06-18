import { useRef, useState } from 'react';
import { exportAllData, importAllData } from '../data/store';

export default function Backup() {
  const [importStatus, setImportStatus] = useState(null);
  const fileRef = useRef();

  function handleExport() {
    exportAllData();
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importAllData(ev.target.result);
      setImportStatus(ok ? 'success' : 'error');
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function clearAll() {
    if (window.confirm('Barcha ma\'lumotlarni o\'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo\'lmaydi!')) {
      localStorage.removeItem('tourReports');
      localStorage.removeItem('tourExpenses');
      window.location.reload();
    }
  }

  return (
    <div style={{ animation: 'slideUp 0.3s ease', maxWidth: 700 }}>
      <div className="page-header">
        <div>
          <div className="page-header-title">💾 Ma'lumotlar Boshqaruvi</div>
          <div className="page-header-subtitle">Zaxira nusxa olish va tiklash</div>
        </div>
      </div>

      {importStatus && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 16,
          background: importStatus === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${importStatus === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
          color: importStatus === 'success' ? '#34d399' : '#f87171',
          fontWeight: 600, fontSize: 14,
        }}>
          {importStatus === 'success'
            ? '✅ Ma\'lumotlar muvaffaqiyatli import qilindi! Sahifani yangilang.'
            : '❌ Import xatosi. JSON fayl formatini tekshiring.'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Export */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📤 Eksport (Zaxira nusxa)</div>
              <div className="card-subtitle">Barcha ma'lumotlarni JSON faylga saqlash</div>
            </div>
            <span style={{ fontSize: 32 }}>📥</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Barcha hisobotlar va xarajatlar ma'lumotlari JSON formatda yuklab olinadi.
            Bu faylni xavfsiz joyda saqlang va kerak bo'lganda import qiling.
          </p>
          <button className="btn btn-success" onClick={handleExport}>
            📥 JSON Zaxira Yuklab Olish
          </button>
        </div>

        {/* Import */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📂 Import (Tiklash)</div>
              <div className="card-subtitle">Zaxira fayldan ma'lumotlarni tiklash</div>
            </div>
            <span style={{ fontSize: 32 }}>📤</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Avval olingan zaxira JSON faylini yuklang. <strong style={{ color: '#f87171' }}>
            Diqqat:</strong> Bu mavjud ma'lumotlarni almashtiradi!
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <button className="btn btn-secondary" onClick={() => fileRef.current.click()}>
            📂 JSON Fayl Tanlash
          </button>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
          <div className="card-header">
            <div>
              <div className="card-title" style={{ color: '#f87171' }}>⚠️ Xavfli Zona</div>
              <div className="card-subtitle">Bu amalni qaytarib bo'lmaydi</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Barcha hisobotlar va xarajatlarni butunlay o'chirish. Bu amalni bajarishdan oldin
            albatta zaxira nusxa oling!
          </p>
          <button className="btn btn-danger" onClick={clearAll}>
            🗑️ Barcha Ma'lumotlarni O'chirish
          </button>
        </div>

        {/* Info */}
        <div className="card" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <div className="card-title" style={{ marginBottom: 12 }}>ℹ️ Ma'lumotlar haqida</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['💾 Saqlash joyi', 'Brauzer LocalStorage'],
              ['🔄 Sinxronlash', 'Faqat shu qurilmada'],
              ['🔒 Xavfsizlik', 'Parol bilan himoyalangan'],
              ['📊 Format', 'JSON (matn ko\'rinish)'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)', width: 140 }}>{k}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
