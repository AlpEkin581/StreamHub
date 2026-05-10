# StreamHub

YouTube benzeri video paylaşım platformu.

## Kurulum

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # .env dosyasını düzenle
node models/schema.sql | psql $DATABASE_URL  # ya da psql ile elle çalıştır
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Gereksinimler

- Node.js 18+
- PostgreSQL
- Cloudinary hesabı (ücretsiz) → https://cloudinary.com

## Deploy

- **Backend** → [Railway](https://railway.app) veya [Render](https://render.com)
- **Frontend** → [Vercel](https://vercel.com)

## API Endpointleri

| Method | URL | Açıklama |
|--------|-----|----------|
| POST | /api/auth/register | Kayıt ol |
| POST | /api/auth/login | Giriş yap |
| GET | /api/videos | Tüm videolar |
| GET | /api/videos/:id | Tek video |
| POST | /api/videos | Video yükle (auth) |
| POST | /api/videos/:id/like | Beğen (auth) |
| GET | /api/comments/:videoId | Yorumlar |
| POST | /api/comments/:videoId | Yorum ekle (auth) |
| GET | /api/search?q=... | Arama |
