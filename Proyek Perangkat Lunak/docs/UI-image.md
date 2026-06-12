# UI Image Optimization

## Ringkasan

Optimasi aset gambar pada aplikasi [`Proyek Perangkat Lunak`](Proyek%20Perangkat%20Lunak) difokuskan untuk mengurangi ukuran file runtime dan menjaga tampilan UI tetap konsisten.

## Hasil Audit

### Aset yang tetap memakai PNG

Aset berikut sengaja tetap memakai PNG karena dipakai sebagai identitas visual utama dan perlu menjaga kesamaan tampilan dengan sumber asli:

- Navbar public di [`src/app/(public)/layout.tsx`](Proyek%20Perangkat%20Lunak/src/app/%28public%29/layout.tsx)
- Navbar landing di [`src/app/(public)/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/%28public%29/page.tsx)
- Header shared di [`src/components/layout/Header.tsx`](Proyek%20Perangkat%20Lunak/src/components/layout/Header.tsx)
- Header signin di [`src/app/auth/signin/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/auth/signin/page.tsx)
- Header signup di [`src/app/auth/signup/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/auth/signup/page.tsx)
- Landing legacy/navbar di [`src/app/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/page.tsx)
- Footer public di [`src/app/(public)/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/%28public%29/page.tsx)

Semua area di atas memakai sumber asli [`public/opt-logo/logo3.png`](Proyek%20Perangkat%20Lunak/public/opt-logo/logo3.png).

### Aset yang dipindah ke WebP

Aset berikut dipindah ke WebP untuk mengurangi ukuran file saat dirender:

- Hero landing legacy: [`public/opt-hero/1.webp`](Proyek%20Perangkat%20Lunak/public/opt-hero/1.webp)
- Hero dashboard: [`public/opt-hero/2.webp`](Proyek%20Perangkat%20Lunak/public/opt-hero/2.webp)
- Hero overview: [`public/opt-hero/3.webp`](Proyek%20Perangkat%20Lunak/public/opt-hero/3.webp)
- Koleksi slider: [`public/collection/*.webp`](Proyek%20Perangkat%20Lunak/public/collection)
- Avatar leveling: [`public/leveling/*.webp`](Proyek%20Perangkat%20Lunak/public/leveling)
- Poster video public: [`/logo1.webp`](Proyek%20Perangkat%20Lunak/src/app/%28public%29/page.tsx:170)

## Perubahan Kode

### 1. Gambar hero diubah ke WebP

- [`src/app/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/page.tsx) memakai [`/opt-hero/1.webp`](Proyek%20Perangkat%20Lunak/src/app/page.tsx)
- [`src/app/(protected)/dashboard/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/%28protected%29/dashboard/page.tsx) memakai [`/opt-hero/2.webp`](Proyek%20Perangkat%20Lunak/src/app/%28protected%29/dashboard/page.tsx)
- [`src/app/(protected)/overview/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/%28protected%29/overview/page.tsx) memakai [`/opt-hero/3.webp`](Proyek%20Perangkat%20Lunak/src/app/%28protected%29/overview/page.tsx)

### 2. Slider koleksi diubah ke WebP dan [`next/image`](Proyek%20Perangkat%20Lunak/src/components/CollectionSlider.tsx:1)

Pada [`src/components/CollectionSlider.tsx`](Proyek%20Perangkat%20Lunak/src/components/CollectionSlider.tsx), referensi koleksi diubah dari PNG ke WebP, lalu render gambar diganti dari tag HTML biasa ke [`Image`](Proyek%20Perangkat%20Lunak/src/components/CollectionSlider.tsx:1) agar:

- mendapat optimasi ukuran bawaan Next.js
- mendukung lazy loading pada slide non-aktif
- mengurangi beban transfer saat slider pertama kali dibuka

### 3. Overview animal image diubah ke [`next/image`](Proyek%20Perangkat%20Lunak/src/app/%28protected%29/overview/page.tsx:4)

Di [`src/app/(protected)/overview/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/%28protected%29/overview/page.tsx), gambar level hewan tetap memakai sumber WebP yang sudah ada, tetapi render-nya dipindahkan ke [`Image`](Proyek%20Perangkat%20Lunak/src/app/%28protected%29/overview/page.tsx:4) dengan lazy loading agar lebih ringan.

### 4. Landing legacy memakai [`next/image`](Proyek%20Perangkat%20Lunak/src/app/page.tsx:3)

Di [`src/app/page.tsx`](Proyek%20Perangkat%20Lunak/src/app/page.tsx), hero preview tidak lagi memakai tag `<img>` biasa, tetapi memakai [`Image`](Proyek%20Perangkat%20Lunak/src/app/page.tsx:3) untuk optimasi responsif.

## File WebP Baru

File baru yang dibuat:

- [`public/opt-hero/1.webp`](Proyek%20Perangkat%20Lunak/public/opt-hero/1.webp)
- [`public/opt-hero/2.webp`](Proyek%20Perangkat%20Lunak/public/opt-hero/2.webp)
- [`public/opt-hero/3.webp`](Proyek%20Perangkat%20Lunak/public/opt-hero/3.webp)
- [`public/opt-hero/4.webp`](Proyek%20Perangkat%20Lunak/public/opt-hero/4.webp)
- [`public/collection/62shots_so.webp`](Proyek%20Perangkat%20Lunak/public/collection/62shots_so.webp)
- [`public/collection/356shots_so.webp`](Proyek%20Perangkat%20Lunak/public/collection/356shots_so.webp)
- [`public/collection/400shots_so.webp`](Proyek%20Perangkat%20Lunak/public/collection/400shots_so.webp)
- [`public/collection/554shots_so.webp`](Proyek%20Perangkat%20Lunak/public/collection/554shots_so.webp)
- [`public/collection/594shots_so.webp`](Proyek%20Perangkat%20Lunak/public/collection/594shots_so.webp)
- [`public/collection/632shots_so.webp`](Proyek%20Perangkat%20Lunak/public/collection/632shots_so.webp)
- [`public/collection/635shots_so.webp`](Proyek%20Perangkat%20Lunak/public/collection/635shots_so.webp)
- [`public/collection/767shots_so.webp`](Proyek%20Perangkat%20Lunak/public/collection/767shots_so.webp)
- [`public/opt-logo/logo3.webp`](Proyek%20Perangkat%20Lunak/public/opt-logo/logo3.webp)

## Catatan Visual

- Logo navbar tidak dipaksa pindah ke WebP.
- Referensi logo utama dan logo kartu auth memakai aset asli di [`public/opt-logo/logo3.png`](Proyek%20Perangkat%20Lunak/public/opt-logo/logo3.png) dan [`public/opt-logo/logo1.png`](Proyek%20Perangkat%20Lunak/public/opt-logo/logo1.png).
- WebP untuk logo tetap dibuat sebagai aset alternatif, tetapi tidak dipakai pada area brand utama sebelum ada validasi visual lanjutan.

## Dampak Optimasi

- Hero image lebih ringan karena memakai WebP.
- Slider koleksi lebih hemat bandwidth.
- Gambar overview dan landing lebih smooth karena memakai optimasi [`next/image`](Proyek%20Perangkat%20Lunak/src/app/%28protected%29/overview/page.tsx:4).
- Konsistensi visual logo tetap terjaga pada navbar, header, signin, dan signup.
