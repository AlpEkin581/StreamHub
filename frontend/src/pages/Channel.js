import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import './Channel.css';

export default function Channel() {
  const { username } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/users/${username}`)
      .then(res => setChannel(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  const handleSubscribe = async () => {
    if (!user) return alert('Abone olmak için giriş yapın.');
    try {
      const res = await api.post(`/users/${channel.id}/subscribe`);
      setChannel(c => ({
        ...c,
        isSubscribed: res.data.subscribed,
        subscribers_count: c.subscribers_count + (res.data.subscribed ? 1 : -1),
      }));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading">Kanal yükleniyor...</div>;
  if (!channel) return <div className="loading">Kanal bulunamadı.</div>;

  return (
    <div className="channel-page">
      <div className="channel-banner">
        <div className="channel-header">
          <div className="channel-avatar-lg">
            {channel.avatar_url
              ? <img src={channel.avatar_url} alt={channel.username} />
              : <span>{channel.username?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div className="channel-info">
            <h1>{channel.username}</h1>
            <p>{channel.subscribers_count} abone • {channel.videos?.length} video</p>
            {channel.bio && <p className="channel-bio">{channel.bio}</p>}
          </div>
          {user?.username !== channel.username && (
            <button
              className={`btn ${channel.isSubscribed ? 'btn-ghost' : 'btn-primary'}`}
              onClick={handleSubscribe}
            >
              {channel.isSubscribed ? '✓ Abone' : 'Abone Ol'}
            </button>
          )}
        </div>
      </div>

      <div className="channel-videos">
        <h2>Videolar</h2>
        {channel.videos?.length === 0 ? (
          <p className="no-videos">Henüz video yok.</p>
        ) : (
          <div className="video-grid">
            {channel.videos?.map(v => <VideoCard key={v.id} video={{ ...v, username: channel.username, avatar_url: channel.avatar_url }} />)}
          </div>
        )}
      </div>
    </div>
  );
}
