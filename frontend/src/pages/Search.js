import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import VideoCard from '../components/VideoCard';
import './Home.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api.get('/videos', { params: { q } })
      .then(res => setVideos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="home">
      <h2 style={{ marginBottom: 20, fontSize: 18 }}>
        "{q}" için arama sonuçları
      </h2>
      {loading ? (
        <div className="loading">Aranıyor...</div>
      ) : videos.length === 0 ? (
        <div className="empty">
          <p>Sonuç bulunamadı.</p>
          <p>Farklı bir arama deneyin.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
}
