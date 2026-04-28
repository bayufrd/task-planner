# PestaKami Fullstack Backend

Backend Express.js + MySQL yang cukup untuk tugas dosen.

## Scope

- auth dasar
- CRUD event
- CRUD media
- 1 transaksi kompleks `POST /media/confirm`

## Install

```bash
npm install
```

## Setup

1. salin `.env.example` menjadi `.env`
2. buat database MySQL `pestakami_db`
3. import file SQL pada `database/schema.sql`

## Run

```bash
npm run dev
```

## Endpoint

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /events`
- `GET /events`
- `GET /events/:id`
- `PATCH /events/:id`
- `DELETE /events/:id`
- `GET /events/public/:slug`
- `POST /media/upload-url`
- `POST /media/confirm`
- `GET /events/:id/media`
- `GET /media/:id`
- `DELETE /media/:id`

## Transaksi Kompleks

Route yang dipakai untuk kebutuhan transaksi kompleks:

```text
POST /media/confirm
```

Proses:

1. cek event
2. cek status active
3. cek expired
4. cek storage owner event
5. insert media
6. update `users.storage_used`
7. commit atau rollback

## Struktur

```text
src/
  config/
  controllers/
  middlewares/
  routes/
  services/
  utils/
```
