import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import axios from 'axios';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      setLoading(true);
      axios.get(`/api/search?q=${q}`)
        .then(r => setResults(r.data))
        .finally(() => setLoading(false));
    }
  }, [q]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 20, color: '#aaa' }}>"{q}" için sonuçlar</h2>
      {loading ? <p style={{ color: '#666' }}>Aranıyor...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {results.map(v => <VideoCard key={v.id} video={v} />)}
          {results.length === 0 && <p style={{ color: '#666' }}>Sonuç bulunamadı.</p>}
        </div>
      )}
    </div>
  );
}
