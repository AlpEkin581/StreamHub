const router = require('express').Router();
const db = require('../models/db');
const authMiddleware = require('../middleware/auth');

// Video yorumları
router.get('/:videoId', async (req, res) => {
  const result = await db.query(`
    SELECT c.*, u.username, u.avatar_url
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.video_id = $1
    ORDER BY c.created_at DESC
  `, [req.params.videoId]);
  res.json(result.rows);
});

// Yorum ekle
router.post('/:videoId', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const result = await db.query(
    'INSERT INTO comments (content, user_id, video_id) VALUES ($1,$2,$3) RETURNING *',
    [content, req.user.id, req.params.videoId]
  );
  res.status(201).json(result.rows[0]);
});

// Yorum sil (sadece yorum sahibi)
router.delete('/:id', authMiddleware, async (req, res) => {
  const result = await db.query(
    'DELETE FROM comments WHERE id=$1 AND user_id=$2 RETURNING id',
    [req.params.id, req.user.id]
  );
  if (!result.rows.length) return res.status(403).json({ error: 'Yetki yok' });
  res.json({ deleted: true });
});

module.exports = router;
