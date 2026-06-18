import { useState } from 'react';

const CORRECT_USER = 'vegas';
const CORRECT_PASS = 'vegas19ya';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (username === CORRECT_USER && password === CORRECT_PASS) {
      localStorage.setItem('auth_token', 'logged_in');
      onLogin();
    } else {
      setError("Login yoki parol noto'g'ri!");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-card">
        <div className="login-logo-wrap">
          <div className="login-logo">✈️</div>
          <div>
            <div className="login-title">Tur Operator</div>
            <div className="login-subtitle">Hisobot Boshqaruv Tizimi</div>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Foydalanuvchi nomi</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">👤</span>
              <input
                className="login-input"
                type="text"
                placeholder="Login kiriting"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Parol</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔒</span>
              <input
                className="login-input"
                type="password"
                placeholder="Parol kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? '⏳ Kirish...' : '🚀 Kirish'}
          </button>
        </form>
      </div>
    </div>
  );
}
