const router = require('express').Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const result = await db.query(`
    SELECT v.*, u.username FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.title ILIKE $1 OR v.description ILIKE $1
    ORDER BY v.views DESC LIMIT 20
  `, [`%${q}%`]);
  res.json(result.rows);
});

module.exports = router;
