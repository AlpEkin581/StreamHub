import { Link } from 'react-router-dom';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Istanbul'
  });
}

export default function VideoCard({ video }) {
  return (
    <Link to={`/video/${video.id}`} style={{ display: 'block' }}>
      <div style={{ borderRadius: 10, overflow: 'hidden', background: '#1a1a1a' }}>
        <div style={{ aspectRatio: '16/9', background: '#222', position: 'relative' }}>
          {video.thumbnail_url
            ? <img src={video.thumbnail_url} alt={video.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'center', height: '100%', fontSize: 40 }}>▶</div>
          }
        </div>
        <div style={{ padding: 12 }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {video.title}
          </p>
          <p style={{ color: '#aaa', fontSize: 12 }}>{video.username}</p>
          <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
            {video.views} görüntülenme · {video.likes} beğeni
          </p>
          <p style={{ color: '#555', fontSize: 11, marginTop: 2 }}>
            {formatDate(video.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}
