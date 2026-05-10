import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">▶</span>
        StreamHub
      </Link>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Video ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>

      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/upload" className="btn btn-primary">+ Yükle</Link>
            <Link to={`/channel/${user.username}`} className="avatar-link">
              {user.avatar_url
                ? <img src={user.avatar_url} alt={user.username} className="avatar-sm" />
                : <div className="avatar-placeholder">{user.username[0].toUpperCase()}</div>
              }
            </Link>
            <button className="btn btn-ghost" onClick={logout}>Çıkış</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Giriş</Link>
            <Link to="/register" className="btn btn-primary">Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}
