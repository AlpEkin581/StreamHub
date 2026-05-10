import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CATEGORIES = ['Eğitim', 'Eğlence', 'Spor', 'Müzik', 'Teknoloji', 'Oyun'];

export default function UploadPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'Eğitim' });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('video', file);
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      const { data } = await axios.post('/api/videos', fd, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: p => setProgress(Math.round(p.loaded * 100 / p.total))
      });
      navigate(`/video/${data.id}`);
    } catch {
      alert('Yükleme başarısız');
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 32 }}>Video Yükle</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <input placeholder="Başlık" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} required
          style={{ padding: '12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />

        <textarea placeholder="Açıklama (isteğe bağlı)" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} rows={4}
          style={{ padding: '12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', resize: 'vertical' }} />

        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
          style={{ padding: '12px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <div style={{ border: '2px dashed #333', borderRadius: 8, padding: 32, textAlign: 'center' }}>
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])}
            style={{ display: 'none' }} id="video-input" />
          <label htmlFor="video-input" style={{ cursor: 'pointer', color: '#aaa' }}>
            {file ? `✓ ${file.name}` : '📁 Video seç (MP4, MOV, AVI)'}
          </label>
        </div>

        {uploading && (
          <div style={{ background: '#222', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: 6, background: '#ff4444', width: `${progress}%`, transition: 'width 0.3s' }} />
            <p style={{ textAlign: 'center', color: '#aaa', fontSize: 13, padding: 8 }}>{progress}%</p>
          </div>
        )}

        <button type="submit" disabled={uploading} style={{
          padding: 14, background: uploading ? '#333' : '#ff4444',
          border: 'none', borderRadius: 8, color: '#fff', fontSize: 16, fontWeight: 700
        }}>{uploading ? 'Yükleniyor...' : 'Yayınla'}</button>
      </form>
    </div>
  );
}
