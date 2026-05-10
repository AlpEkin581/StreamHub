import { useState, useEffect } from 'react';
import api from '../api';
import VideoCard from '../components/VideoCard';
import './Home.css';

const CATEGORIES = ['Hepsi', 'Oyun', 'Müzik', 'Eğitim', 'Teknoloji', 'Spor', 'Eğlence', 'Vlog'];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/videos', { params: { category: category || undefined } })
      .then(res => setVideos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="home">
      <div className="categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-btn ${(cat === 'Hepsi' ? '' : cat) === category ? 'active' : ''}`}
            onClick={() => setCategory(cat === 'Hepsi' ? '' : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Videolar yükleniyor...</div>
      ) : videos.length === 0 ? (
        <div className="empty">
          <p>Henüz video yok.</p>
          <p>İlk videoyu yükleyen sen ol! 🎬</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
}
