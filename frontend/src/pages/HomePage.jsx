import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import axios from 'axios';

const CATEGORIES = ['Tümü', 'Eğitim', 'Eğlence', 'Spor', 'Müzik', 'Teknoloji', 'Oyun'];

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState('Tümü');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = category !== 'Tümü' ? `?category=${category}` : '';
    axios.get(`/api/videos${params}`)
      .then(r => setVideos(r.data))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '6px 16px', borderRadius: 20, border: 'none',
            background: category === cat ? '#ff4444' : '#222',
            color: '#fff', fontSize: 13, fontWeight: category === cat ? 600 : 400
          }}>{cat}</button>
        ))}
      </div>

      {loading ? <p style={{ color: '#666' }}>Yükleniyor...</p> : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20
        }}>
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
          {videos.length === 0 && <p style={{ color: '#666' }}>Henüz video yok.</p>}
        </div>
      )}
    </div>
  );
}
