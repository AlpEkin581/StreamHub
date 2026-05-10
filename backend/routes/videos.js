const router = require('express').Router();
const db = require('../models/db');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { resource_type: 'video', folder: 'streamhub' },
});
const upload = multer({ storage });

// Tüm videoları listele
router.get('/', async (req, res) => {
  const { category } = req.query;
  let query = `
    SELECT v.*, u.username, u.avatar_url,
           COUNT(DISTINCT l.id) AS likes
    FROM videos v
    JOIN users u ON v.user_id = u.id
    LEFT JOIN likes l ON l.video_id = v.id
  `;
  const params = [];
  if (category) { query += ' WHERE v.category = $1'; params.push(category); }
  query += ' GROUP BY v.id, u.username, u.avatar_url ORDER BY v.created_at DESC';
  const result = await db.query(query, params);
  res.json(result.rows);
});

// Tek video
router.get('/:id', async (req, res) => {
  await db.query('UPDATE videos SET views = views + 1 WHERE id = $1', [req.params.id]);
  const result = await db.query(`
    SELECT v.*, u.username, u.avatar_url,
           COUNT(DISTINCT l.id) AS likes
    FROM videos v
    JOIN users u ON v.user_id = u.id
    LEFT JOIN likes l ON l.video_id = v.id
    WHERE v.id = $1
    GROUP BY v.id, u.username, u.avatar_url
  `, [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: 'Video bulunamadı' });
  res.json(result.rows[0]);
});

// Video yükle
router.post('/', authMiddleware, upload.single('video'), async (req, res) => {
  const { title, description, category } = req.body;
  const video_url = req.file.path;
  const thumbnail_url = req.file.path.replace('/upload/', '/upload/so_1/').replace('.mp4', '.jpg');
  const result = await db.query(
    'INSERT INTO videos (title, description, video_url, thumbnail_url, category, user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [title, description, video_url, thumbnail_url, category, req.user.id]
  );
  res.status(201).json(result.rows[0]);
});

// Beğen / beğeniyi geri al
router.post('/:id/like', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const exists = await db.query('SELECT id FROM likes WHERE user_id=$1 AND video_id=$2', [userId, id]);
  if (exists.rows.length) {
    await db.query('DELETE FROM likes WHERE user_id=$1 AND video_id=$2', [userId, id]);
    return res.json({ liked: false });
  }
  await db.query('INSERT INTO likes (user_id, video_id) VALUES ($1,$2)', [userId, id]);
  res.json({ liked: true });
});

module.exports = router;
