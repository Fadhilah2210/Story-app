# 📖 Story App

**Story App** adalah aplikasi Single-Page Application (SPA) yang memungkinkan pengguna untuk melihat dan membagikan cerita sehari-hari melalui gambar, deskripsi, dan lokasi. Aplikasi ini dibangun dengan arsitektur **MVP (Model-View-Presenter)** dan menerapkan standar modern seperti **PWA**, **IndexedDB**, dan **Push Notification**.

---

## 🌐 Live Demo

👉 [Kunjungi Story App](https://storyappcodingcamp2025.netlify.app/)

---

## 📌 Fitur Utama

### ✅ Submission 1 (Dasar SPA)

- 🔗 **Menggunakan API dari Dicoding** sebagai sumber data utama.
- 🔀 **Routing berbasis hash (`#/`)** untuk navigasi antar halaman.
- 🧱 **Arsitektur MVP (Model - View - Presenter)** untuk pemisahan logika dan tampilan.
- 🖼️ **Menampilkan daftar cerita**:
  - Gambar cerita
  - Nama pengguna
  - Deskripsi cerita
  - Lokasi (dengan peta dan marker)
  - Tanggal posting
- ➕ **Menambahkan cerita baru**:
  - Ambil gambar dari kamera langsung
  - Pilih lokasi dari peta (dengan klik map)
  - Input deskripsi cerita
- ♿ **Aksesibilitas**:
  - Skip to content
  - Label terasosiasi dengan input
  - Gambar memiliki `alt`
  - Struktur semantik dengan elemen `main`, `section`, `header`, dsb.
- ✨ **Transisi halus antar halaman** dengan View Transition API

---

### ✅ Submission 2 (PWA & Lanjutan)

- 📬 **Push Notification**:
  - Berlangganan notifikasi melalui API
  - Menggunakan **VAPID Public Key**
- 📲 **PWA (Progressive Web App)**:
  - Installable ke homescreen
  - Offline support (Application Shell)
  - Manifest & Service Worker sudah diterapkan
- 💾 **IndexedDB**:
  - Menyimpan data cerita lokal dari API
  - Menampilkan kembali saat offline
  - Dapat dihapus secara manual
- 🌍 **Deploy ke platform publik** seperti:
  - GitHub Pages / Netlify / Firebase

---

## 🚀 Teknologi yang Digunakan

- HTML5 + CSS3
- Vanilla JavaScript (ES Modules)
- Webpack 5
- Leaflet.js (untuk peta interaktif)
- Service Worker (Workbox / manual)
- IndexedDB (via idb library / native)
- Camera API
- Push API

---


---

## ⚙️ Cara Menjalankan Secara Lokal

npm install
npm run build 
npm run dev


