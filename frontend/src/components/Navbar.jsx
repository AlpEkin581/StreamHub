import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${query}`);
  };

  return (
    <nav style={{
      background: '#111', borderBottom: '1px solid #222',
      padding: '12px 24px', display: 'flex',
      alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100
    }}>
      <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: '#ff4444' }}>
        ▶ StreamHub
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Video ara..."
          style={{
            flex: 1, maxWidth: 500, padding: '8px 14px',
            background: '#222', border: '1px solid #333',
            borderRadius: 20, color: '#fff', outline: 'none'
          }}
        />
        <button type="submit" style={{
          padding: '8px 16px', background: '#333',
          border: 'none', borderRadius: 20, color: '#fff'
        }}>Ara</button>
      </form>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/upload" style={{
              padding: '8px 16px', background: '#ff4444',
              borderRadius: 20, fontSize: 14, fontWeight: 600
            }}>+ Yükle</Link>
            <span style={{ color: '#aaa', fontSize: 14 }}>{user.username}</span>
            <button onClick={logout} style={{
              padding: '6px 12px', background: 'transparent',
              border: '1px solid #444', borderRadius: 20,
              color: '#aaa', fontSize: 13
            }}>Çıkış</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#aaa', fontSize: 14 }}>Giriş</Link>
            <Link to="/register" style={{
              padding: '8px 16px', background: '#ff4444',
              borderRadius: 20, fontSize: 14, fontWeight: 600
            }}>Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}
