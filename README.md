# 🌶️ Seblak UMKM - Website Profil & Panel Admin

Website profil UMKM satu halaman (*Single-Page Application*) lengkap dengan **Panel Kelola (Admin)** menggunakan HTML, CSS, dan JavaScript murni (*Vanilla*) dengan database **Firebase Cloud Firestore**. Dibuat sebagai modul proyek tugas kejuruan siswa SMK Rekayasa Perangkat Lunak (RPL).

![Preview Website Seblak UMKM](img/seblak-hero.jpg)

---

## 🌟 Fitur Utama

1. **Jendela 1 (Halaman Publik - `index.html`)**:
   - Desain modern ala website kuliner besar dengan efek *glassmorphism*, tipografi Google Fonts (*Plus Jakarta Sans* & *Inter*), serta skema warna hangat.
   - **Responsif Penuh**: Tampilan rapi mulai dari layar HP (lebar 360 px) hingga laptop tanpa scroll horizontal.
   - **Katalog 6 Produk Seblak**: Format kartu terstruktur (Foto, Nama, Porsi, Harga, Deskripsi maks 25 kata) dengan tombol pemesanan WhatsApp otomatis.
   - **Jendela Masuk Pelanggan**: Modal selamat datang interaktif untuk personalisasi nama pemesan WhatsApp layaknya aplikasi besar.
   - **Live Kitchen Order Toast**: Notifikasi pop-up simulasi pesanan dapur yang telah selesai dimasak secara berkala layaknya aplikasi restoran besar.
   - **Kontak & Lokasi**: Tabel jam operasional terstruktur, tautan WhatsApp dinamis, placeholder peta Google Maps, dan tombol mengambang (*floating WhatsApp button*).

2. **Jendela 2 (Panel Kelola / Admin - Terpadu di `index.html` & `admin.html`)**:
   - **Akses Fleksibel**: Dapat dibuka langsung di dalam Halaman Utama (`index.html`) melalui tombol **⚙️ Kelola Toko** di bilah navigasi, maupun via file terpisah `admin.html`.
   - **Sinkron Real-Time ke Semua Perangkat**: Setiap perubahan tersimpan otomatis ke Firebase dan langsung tampil di halaman utama pada semua HP & laptop, tanpa perlu refresh.
   - **Login Admin Aman**: Masuk memakai akun admin Firebase Authentication. Pengunjung hanya bisa membaca data.
   - **Kelola Seluruh Konten**: Mengubah identitas usaha, nama pemilik, tahun berdiri, jumlah karyawan, jam buka, cerita, 3 fakta singkat, dan 3 keunggulan.
   - **Kelola 6 Produk Seblak**: Mengubah foto produk (langsung dari laptop/HP, otomatis diperkecil), nama, harga, porsi, dan deskripsi produk.
   - **Pengaturan Warna Tema**: Pengubah warna dinamis (`--warna-utama`, `--warna-aksen`, `--warna-latar`, `--warna-harga`) dengan *Color Picker*.
   - **Reset ke Data Awal**: Fitur mengembalikan seluruh pengaturan ke setelan default awal jika terjadi kesalahan.

---

## 📁 Struktur Berkas

```text
seblak-umkm/
│
├── index.html          # Jendela 1: Halaman publik utama (+ Panel Kelola di dalam halaman)
├── admin.html          # Jendela 2: Panel Kelola terpisah
├── style.css           # Lembar gaya terpadu (CSS Variables, Flexbox, Grid, Media Queries)
├── script.js           # Logika JavaScript: tampilan, Panel Kelola, Firebase real-time
├── firebase-config.js  # Pengaturan project Firebase (WAJIB diisi)
├── firestore.rules     # Aturan keamanan database (tempel di Firebase Console)
├── README.md           # Dokumentasi proyek untuk GitHub
└── img/                # Folder aset foto
    ├── seblak-hero.jpg
    └── seblak-1.jpg ... seblak-6.jpg
```

---

## 🔄 Alur Data (Cara Kerja Sinkron)

```text
 Panel Kelola (laptop admin)                Firebase Firestore                 Halaman Utama (semua HP & laptop)
 ───────────────────────────                ──────────────────                 ─────────────────────────────────
 Admin mengetik di formulir  ──set()──►  dokumen umkm/seblak-umkm  ──onSnapshot()──►  tampilkanData() → halaman berubah
```

Inti kodenya di `script.js` hanya dua perintah Firebase:

```js
// Menyimpan (Panel Kelola)
dokToko.set(data);

// Mendengarkan perubahan (setiap perangkat)
dokToko.onSnapshot((snap) => tampilkanData(snap.data()));
```

- Seluruh data toko (teks, warna, 6 produk, dan foto) disimpan dalam **1 dokumen** Firestore.
- Admin cukup mengetik; perubahan dikirim otomatis 0,7 detik setelah berhenti mengetik.
- Foto yang dipilih dari laptop/HP diperkecil otomatis (foto utama maks. 1200 px, foto produk maks. 600 px) agar semua data muat di 1 dokumen (batas Firestore ± 1 MB).

---

## ☁️ Menyiapkan Firebase (Sekali Saja, Gratis)

Paket gratis Firebase (Spark) sudah cukup untuk website UMKM.

### A. Buat project & database
1. Buka [console.firebase.google.com](https://console.firebase.google.com) dan masuk dengan akun Google.
2. Klik **Create a project / Buat project**, beri nama (misal `seblak-umkm`). Google Analytics boleh dimatikan.
3. Di menu kiri pilih **Build › Firestore Database › Create database**.
   - Lokasi: pilih **asia-southeast2 (Jakarta)** (tidak bisa diubah setelahnya).
   - Mode: pilih **production mode**.
4. Buka tab **Rules**, hapus isinya, lalu tempel seluruh isi file `firestore.rules`.
   Ganti `admin@contoh.com` dengan email admin yang akan dibuat di langkah B, lalu klik **Publish**.

### B. Buat akun admin
5. Di menu kiri pilih **Build › Authentication › Get started**.
6. Tab **Sign-in method** › pilih **Email/Password** › aktifkan **Enable** › **Save**.
7. Tab **Users** › **Add user** › isi email admin dan kata sandi (minimal 6 karakter).
   Kata sandi inilah yang dipakai untuk masuk ke Panel Kelola.

### C. Hubungkan website
8. Klik ikon ⚙️ **Project settings** › tab **General** › bagian **Your apps** › klik ikon **Web `</>`**.
9. Beri nama aplikasi (misal `seblak-web`), klik **Register app**. Firebase menampilkan objek `firebaseConfig`.
10. Buka file `firebase-config.js`, salin nilai `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, dan `appId` ke `FIREBASE_CONFIG`.
11. Isi `ADMIN_EMAIL` dengan email admin dari langkah 7 (harus sama dengan email di Rules).
12. Upload semua file ke GitHub (lihat bagian GitHub Pages di bawah).

### D. Cek berhasil
- Buka **⚙️ Kelola Toko** → badge menampilkan **☁️ Terhubung ke Firebase**.
- Masuk dengan kata sandi admin, ubah satu teks → badge **⏳ Menyimpan...** lalu **✅ Tersimpan & tampil di semua perangkat**.
- Buka website di HP → perubahan langsung muncul tanpa refresh.

> 🔐 `apiKey` Firebase untuk web memang boleh terlihat publik. Yang menjaga data adalah **Rules** Firestore: pengunjung hanya bisa membaca, sedangkan yang bisa mengubah hanya akun admin.
>
> 👥 Satu project Firebase bisa dipakai beberapa kelompok. Bedakan dengan mengganti `TOKO_ID` di `firebase-config.js` (misal `kelompok-1`, `kelompok-2`).
>
> ⚠️ Jika `firebase-config.js` belum diisi, halaman utama tetap tampil dengan data awal, tetapi Panel Kelola tidak bisa menyimpan perubahan.

---

## 🚀 Cara Menjalankan di Komputer / Laptop

1. Unduh atau clone repositori ini:
   ```bash
   git clone https://github.com/USERNAME/seblak-umkm.git
   cd seblak-umkm
   ```
2. Pastikan `firebase-config.js` sudah diisi (lihat bagian sebelumnya) dan komputer terhubung ke internet.
3. Buka berkas `index.html` dengan klik dua kali, atau jalankan lewat *Live Server* (VS Code).
4. Untuk membuka panel admin, buka `admin.html` atau klik tombol **⚙️ Kelola Toko** di bilah navigasi atas, lalu masukkan kata sandi akun admin Firebase.

---

## 🌐 Cara Publikasi ke GitHub Pages (Gratis)

Agar website ini dapat diakses oleh siapa saja lewat internet:
1. Buka repositori proyek ini di situs **GitHub**.
2. Masuk ke menu **Settings** > **Pages** (di bilah navigasi sebelah kiri).
3. Pada bagian **Build and deployment** > **Branch**, pilih cabang `main` dan folder `/ (root)`.
4. Klik **Save**.
5. Tunggu 1–2 menit, website Anda akan aktif di alamat:
   `https://USERNAME.github.io/seblak-umkm/`

---

## 👨‍💻 Kontributor

- **Pengembang**: Siswa SMK PGRI Singosari (Jurusan Rekayasa Perangkat Lunak)
- **Teknologi**: HTML5 Semantik, CSS3 Murni, Vanilla JavaScript (DOM API), Firebase Cloud Firestore & Authentication
- **Lisensi**: MIT License (Bebas digunakan dan dikembangkan untuk keperluan edukasi)
