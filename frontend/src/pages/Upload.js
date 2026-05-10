import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Upload.css';

const CATEGORIES = ['Oyun', 'Müzik', 'Eğitim', 'Teknoloji', 'Spor', 'Eğlence', 'Vlog', 'Diğer'];

export default function Upload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return setError('Lütfen bir video seçin.');
    if (!form.title.trim()) return setError('Başlık zorunlu.');

    const data = new FormData();
    data.append('video', videoFile);
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('category', form.category);
    if (thumbFile) data.append('thumbnail', thumbFile);

    setUploading(true);
    setError('');

    try {
      const res = await api.post('/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      navigate(`/watch/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Yükleme başarısız.');
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1>Video Yükle</h1>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="upload-dropzone" onClick={() => document.getElementById('videoInput').click()}>
            {videoFile ? (
              <div className="file-selected">
                <span>🎬</span>
                <span>{videoFile.name}</span>
                <span className="file-size">({(videoFile.size / 1024 / 1024).toFixed(1)} MB)</span>
              </div>
            ) : (
              <>
                <span className="drop-icon">📁</span>
                <p>Video dosyasını seç veya sürükle</p>
                <p className="drop-hint">MP4, MOV, AVI, WEBM • Maks 500MB</p>
              </>
            )}
            <input
              id="videoInput"
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={e => setVideoFile(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Başlık *</label>
            <input
              type="text"
              placeholder="Videonun başlığını girin"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              rows={4}
              placeholder="Videonuzun açıklaması..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="select-input"
            >
              <option value="">Kategori seç</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Kapak Görseli (opsiyonel)</label>
            <input type="file" accept="image/*" onChange={e => setThumbFile(e.target.files[0])} />
          </div>

          {uploading && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <span>{progress}%</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary upload-submit" disabled={uploading}>
            {uploading ? `Yükleniyor... ${progress}%` : 'Videoyu Yükle'}
          </button>
        </form>
      </div>
    </div>
  );
}
