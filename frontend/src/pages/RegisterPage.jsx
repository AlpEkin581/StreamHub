import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt başarısız');
    }
  };

  const fields = [
    { name: 'username', type: 'text', placeholder: 'Kullanıcı adı' },
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Şifre' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Hesap Oluştur</h1>
        <p style={{ color: '#aaa', marginBottom: 32 }}>
          Zaten hesabın var mı? <Link to="/login" style={{ color: '#ff4444' }}>Giriş yap</Link>
        </p>
        {error && <p style={{ color: '#ff4444', marginBottom: 16 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields.map(f => (
            <input key={f.name} type={f.type} placeholder={f.placeholder}
              value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              required style={{ padding: '12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 15, outline: 'none' }} />
          ))}
          <button type="submit" style={{ padding: 13, background: '#ff4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 16, fontWeight: 700 }}>Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
}
