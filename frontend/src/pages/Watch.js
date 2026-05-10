import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './Watch.css';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 3);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Watch() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/videos/${id}`),
      api.get(`/videos/${id}/comments`),
    ]).then(([vRes, cRes]) => {
      setVideo(vRes.data);
      setComments(cRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleLike = async (type) => {
    if (!user) return alert('Beğenmek için giriş yapın.');
    try {
      await api.post(`/videos/${id}/like`, { type });
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubscribe = async () => {
    if (!user) return alert('Abone olmak için giriş yapın.');
    try {
      const res = await api.post(`/users/${video.user_id}/subscribe`);
      setSubscribed(res.data.subscribed);
      setVideo(v => ({
        ...v,
        subscribers_count: v.subscribers_count + (res.data.subscribed ? 1 : -1)
      }));
    } catch (err) { console.error(err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Yorum yapmak için giriş yapın.');
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/videos/${id}/comments`, { content: newComment });
      setComments(c => [res.data, ...c]);
      setNewComment('');
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading">Video yükleniyor...</div>;
  if (!video) return <div className="loading">Video bulunamadı.</div>;

  return (
    <div className="watch-page">
      <div className="watch-main">
        <div className="video-player-wrap">
          <video
            src={video.video_url}
            controls
            className="video-player"
            poster={video.thumbnail_url}
          />
        </div>

        <div className="watch-details">
          <h1 className="watch-title">{video.title}</h1>
          <p style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>{formatDate(video.created_at)}</p>

          <div className="watch-meta">
            <div className="channel-info">
              <Link to={`/channel/${video.username}`} className="channel-link">
                {video.avatar_url
                  ? <img src={video.avatar_url} alt={video.username} className="ch-avatar" />
                  : <div className="ch-avatar-placeholder">{video.username?.[0]?.toUpperCase()}</div>
                }
                <div>
                  <span className="ch-name">{video.username}</span>
                  <span className="ch-subs">{video.subscribers_count} abone</span>
                </div>
              </Link>
              <button
                className={`btn ${subscribed ? 'btn-ghost' : 'btn-primary'}`}
                onClick={handleSubscribe}
              >
                {subscribed ? 'Abone' : 'Abone Ol'}
              </button>
            </div>

            <div className="like-btns">
              <button
                className={`like-btn ${video.userLike === 'like' ? 'active' : ''}`}
                onClick={() => handleLike('like')}
              >
                👍 {video.likes_count}
              </button>
              <button
                className={`like-btn ${video.userLike === 'dislike' ? 'active' : ''}`}
                onClick={() => handleLike('dislike')}
              >
                👎 {video.dislikes_count}
              </button>
              <span className="views">{video.views} görüntülenme</span>
            </div>
          </div>

          {video.description && (
            <div className="video-desc">
              <p>{video.description}</p>
            </div>
          )}
        </div>

        <div className="comments-section">
          <h3>{comments.length} Yorum</h3>

          {user && (
            <form onSubmit={handleComment} className="comment-form">
              <input
                type="text"
                placeholder="Yorum ekle..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Gönder</button>
            </form>
          )}

          <div className="comments-list">
            {comments.map(c => (
              <div key={c.id} className="comment">
                <div className="comment-avatar">
                  {c.avatar_url
                    ? <img src={c.avatar_url} alt={c.username} />
                    : <div className="c-placeholder">{c.username?.[0]?.toUpperCase()}</div>
                  }
                </div>
                <div>
                  <span className="comment-user">{c.username}</span>
                  <span style={{ color: '#555', fontSize: 11, marginLeft: 8 }}>{formatDate(c.created_at)}</span>
                  <p className="comment-text">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
