import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş başarısız');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Giriş Yap</h1>
        <p style={{ color: '#aaa', marginBottom: 32 }}>
          Hesabın yok mu? <Link to="/register" style={{ color: '#ff4444' }}>Kayıt ol</Link>
        </p>
        {error && <p style={{ color: '#ff4444', marginBottom: 16 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['email', 'password'].map(field => (
            <input key={field} type={field}
              placeholder={field === 'email' ? 'Email' : 'Şifre'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              required
              style={{ padding: '12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 15, outline: 'none' }}
            />
          ))}
          <button type="submit" style={{ padding: '13px', background: '#ff4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 16, fontWeight: 700 }}>Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}
