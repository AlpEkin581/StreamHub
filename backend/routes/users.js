const router = require('express').Router();
const pool = require('../db');
const { auth, optionalAuth } = require('../middleware/auth');

// Get channel profile
router.get('/:username', optionalAuth, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, username, avatar_url, bio, subscribers_count, created_at FROM users WHERE username=$1',
      [req.params.username]
    );
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Kanal bulunamadı.' });

    const user = userResult.rows[0];

    const videosResult = await pool.query(
      'SELECT * FROM videos WHERE user_id=$1 AND is_public=true ORDER BY created_at DESC',
      [user.id]
    );

    let isSubscribed = false;
    if (req.user) {
      const subResult = await pool.query(
        'SELECT id FROM subscriptions WHERE subscriber_id=$1 AND channel_id=$2',
        [req.user.id, user.id]
      );
      isSubscribed = subResult.rows.length > 0;
    }

    res.json({ ...user, videos: videosResult.rows, isSubscribed });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// Subscribe / unsubscribe
router.post('/:id/subscribe', auth, async (req, res) => {
  if (req.user.id === req.params.id) return res.status(400).json({ error: 'Kendinize abone olamazsınız.' });

  try {
    const existing = await pool.query(
      'SELECT id FROM subscriptions WHERE subscriber_id=$1 AND channel_id=$2',
      [req.user.id, req.params.id]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM subscriptions WHERE subscriber_id=$1 AND channel_id=$2', [req.user.id, req.params.id]);
      await pool.query('UPDATE users SET subscribers_count = subscribers_count - 1 WHERE id=$1', [req.params.id]);
      return res.json({ subscribed: false });
    }

    await pool.query('INSERT INTO subscriptions (subscriber_id, channel_id) VALUES ($1, $2)', [req.user.id, req.params.id]);
    await pool.query('UPDATE users SET subscribers_count = subscribers_count + 1 WHERE id=$1', [req.params.id]);
    res.json({ subscribed: true });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// Get subscriptions feed
router.get('/feed/subscriptions', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, u.username, u.avatar_url
      FROM videos v
      JOIN users u ON v.user_id = u.id
      JOIN subscriptions s ON s.channel_id = v.user_id
      WHERE s.subscriber_id = $1 AND v.is_public = true
      ORDER BY v.created_at DESC
      LIMIT 20
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

module.exports = router;
