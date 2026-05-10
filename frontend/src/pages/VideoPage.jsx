import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Istanbul'
  });
}

export default function VideoPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    axios.get(`/api/videos/${id}`).then(r => setVideo(r.data));
    axios.get(`/api/comments/${id}`).then(r => setComments(r.data));
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Giriş yapman gerekiyor');
    const { data } = await axios.post(`/api/videos/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLiked(data.liked);
    setVideo(v => ({ ...v, likes: parseInt(v.likes) + (data.liked ? 1 : -1) }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Giriş yapman gerekiyor');
    const { data } = await axios.post(`/api/comments/${id}`, { content: comment }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments([{ ...data, username: user.username }, ...comments]);
    setComment('');
  };

  if (!video) return <p style={{ padding: 40, color: '#666' }}>Yükleniyor...</p>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <video controls src={video.video_url} style={{ width: '100%', borderRadius: 10, background: '#000' }} />

      <div style={{ marginTop: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{video.title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div style={{ color: '#aaa', fontSize: 14 }}>
            <span>{video.username}</span> · <span>{video.views} görüntülenme</span> · <span>{formatDate(video.created_at)}</span>
          </div>
          <button onClick={handleLike} style={{
            padding: '8px 20px', borderRadius: 20, border: 'none',
            background: liked ? '#ff4444' : '#222', color: '#fff', fontWeight: 600
          }}>👍 {video.likes}</button>
        </div>
        {video.description && <p style={{ marginTop: 12, color: '#ccc', lineHeight: 1.6 }}>{video.description}</p>}
      </div>

      <div style={{ marginTop: 32, borderTop: '1px solid #222', paddingTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>{comments.length} Yorum</h2>
        {user && (
          <form onSubmit={handleComment} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <input value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Yorum yaz..." required
              style={{ flex: 1, padding: '10px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />
            <button type="submit" style={{ padding: '10px 18px', background: '#ff4444', border: 'none', borderRadius: 8, color: '#fff' }}>Gönder</button>
          </form>
        )}
        {comments.map(c => (
          <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px solid #1a1a1a' }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{c.username}</span>
            <span style={{ color: '#555', fontSize: 11, marginLeft: 8 }}>{formatDate(c.created_at)}</span>
            <p style={{ marginTop: 4, color: '#ccc', fontSize: 14 }}>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
