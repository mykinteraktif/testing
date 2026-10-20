# 🌶️ Seblak UMKM - Website Profil & Panel Admin

Website profil UMKM satu halaman (*Single-Page Application*) lengkap dengan **Panel Kelola (Admin) Dua Jendela** menggunakan HTML, CSS, dan JavaScript murni (*Vanilla*) tanpa framework atau backend. Dibuat sebagai modul proyek tugas kejuruan siswa SMK Rekayasa Perangkat Lunak (RPL).

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
   - **Akses Fleksibel**: Dapat dibuka langsung di dalam Halaman Utama (`index.html`) melalui tombol floating **⚙️ Jendela 2**, tombol navigasi atas, maupun via file terpisah `admin.html`.
   - **Bebas Masalah Browser**: Karena terintegrasi langsung di halaman utama, pengaturan tersimpan di `localStorage` secara instan dan langsung ter-update di layar secara real-time tanpa kendala isolasi berkas lokal `file://` di Firefox/Chrome!
   - **Proteksi Kata Sandi**: Modal login pintu masuk dengan kata sandi: `makansantai`.
   - **Kelola Seluruh Konten**: Mengubah identitas usaha, nama pemilik, tahun berdiri, jumlah karyawan, jam buka, cerita, 3 fakta singkat, dan 3 keunggulan.
   - **Kelola 6 Produk Seblak**: Mengubah foto produk, nama, harga, porsi, dan deskripsi produk secara fleksibel.
   - **Pengaturan Warna Tema**: Pengubah warna dinamis (`--warna-utama`, `--warna-aksen`, `--warna-latar`, `--warna-harga`) dengan *Color Picker*.
   - **Reset ke Data Awal**: Fitur mengembalikan seluruh pengaturan ke setelan default awal jika terjadi kesalahan.

---

## 📁 Struktur Berkas

```text
seblak-umkm/
│
├── index.html        # Jendela 1: Halaman publik utama
├── admin.html        # Jendela 2: Panel kelola admin (Password: makansantai)
├── style.css         # Lembar gaya terpadu (CSS Variables, Flexbox, Grid, Media Queries)
├── script.js         # Logika JavaScript murni, LocalStorage, sinkron GitHub & Firebase
├── data.json         # DATABASE website (dibaca semua perangkat, diperbarui dari Panel Kelola)
├── firebase-config.js# Pengaturan Firebase (opsional, untuk sinkron instan)
├── firestore.rules   # Aturan keamanan Firebase (opsional)
├── .nojekyll         # Agar GitHub Pages memproses file apa adanya (lebih cepat)
├── README.md         # Dokumentasi proyek untuk GitHub
└── img/              # Folder aset foto
    ├── seblak-hero.jpg
    ├── seblak-1.jpg ... seblak-6.jpg
    └── upload/       # Dibuat otomatis: foto yang diupload dari Panel Kelola
```

> ⚠️ File `.nojekyll` diawali titik sehingga bisa tersembunyi di File Explorer. Pastikan ikut terupload (tidak wajib, tapi mempercepat pembaruan website).

---

## 🚀 Cara Menjalankan di Komputer / Laptop

1. Unduh atau clone repositori ini:
   ```bash
   git clone https://github.com/USERNAME/seblak-umkm.git
   cd seblak-umkm
   ```
2. Buka berkas `index.html` dengan klik dua kali di penjelajah berkas (*file manager*) atau buka menggunakan browser kesayangan Anda (Google Chrome, Firefox, Edge).
3. Untuk membuka panel admin, buka `admin.html` atau klik tombol **⚙️ Kelola Toko** di bilah navigasi (header) atas.
4. Masukkan kata sandi: `makansantai`. Jika Firebase sudah diaktifkan, gunakan kata sandi akun admin Firebase.

---

## 🔄 Sinkronisasi Panel Kelola ↔ Halaman Utama

Website ini punya tiga mode penyimpanan. Mode yang aktif dipilih otomatis dan terlihat di badge bagian atas Panel Kelola.

| Mode | Badge | Perubahan tampil di | Persiapan |
|---|---|---|---|
| **GitHub** (`data.json`) ⭐ | 🌐 Database GitHub (data.json) | **Semua perangkat**, ±1 menit setelah dipublikasikan | Upload ke GitHub + token (sekali) |
| **Firebase** (opsional) | ☁️ Sinkron ke Semua Perangkat | **Semua perangkat**, instan (real-time) | Daftar & atur Firebase |
| **Lokal** | 💻 Mode Lokal: hanya perangkat ini | Browser yang sama saja | Tidak ada (misal dibuka dengan klik dua kali) |

> **Mengapa HP tidak ikut berubah di mode lokal?** Data disimpan di `localStorage`, yaitu memori milik masing-masing browser. HP dan laptop punya `localStorage` sendiri-sendiri. Karena itu perubahan harus disimpan di tempat yang bisa dibaca semua perangkat: file `data.json` di GitHub, atau database Firebase.

Catatan lain:
- Foto yang dipilih dari laptop/HP **diperkecil otomatis** (foto utama maks. 1400 px, foto produk maks. 800 px).
- Jika badge menampilkan **"⚠️ Gagal Tersimpan: Penyimpanan Penuh"**, perubahan belum tersimpan. Gunakan foto yang lebih kecil, isi path dari folder `img/`, atau klik **Reset ke Data Awal**.
- **Pengguna Firefox (mode lokal):** jika website dibuka dengan klik dua kali (alamat diawali `file://`), `admin.html` dan `index.html` tidak bisa berbagi data. Gunakan tombol **⚙️ Kelola Toko** di halaman utama, atau jalankan lewat **Live Server** (VS Code) / GitHub Pages.

---

## 🐙 Mengaktifkan Sinkron Semua Perangkat — Mode GitHub (Disarankan)

Database website adalah file **`data.json`** yang sudah tersedia di proyek ini. Tidak perlu mendaftar layanan lain.

### A. Upload ke GitHub & aktifkan GitHub Pages
1. Upload **semua file** proyek (termasuk `data.json`) ke repository GitHub, di folder paling luar.
2. Aktifkan GitHub Pages: **Settings › Pages › Branch: `main` / `(root)` › Save** (lihat bagian di bawah).

### B. Buat token GitHub (sekali saja, ± 2 menit)
3. Di GitHub, klik foto profil › **Settings › Developer settings › Personal access tokens › Fine-grained tokens › Generate new token**.
4. Isi **Token name** (misal `panel-seblak`) dan **Expiration** (misal sampai akhir semester).
5. **Repository access** › pilih **Only select repositories** › pilih repository website ini.
6. **Permissions › Repository permissions › Contents** › ubah menjadi **Read and write**.
7. Klik **Generate token**, lalu salin token (diawali `github_pat_...`). Token hanya ditampilkan sekali.

### C. Hubungkan Panel Kelola
8. Buka website hasil GitHub Pages › **⚙️ Kelola Toko** › masuk dengan kata sandi `makansantai`.
9. Di kartu **🐙 Publikasi ke GitHub**, pemilik repo & nama repository biasanya sudah terisi otomatis. Tempel token, lalu klik **💾 Simpan Pengaturan & Tes Koneksi** sampai muncul ✅.

### D. Cara memakai
- Ubah teks/foto seperti biasa (tersimpan di perangkat ini, badge: **📝 Ada perubahan belum dipublikasikan**).
- Klik **🚀 Simpan & Publikasikan ke GitHub**. Panel mengirim `data.json` dan foto (`img/upload/`) dalam satu commit.
- Tunggu ± 1 menit. Badge berubah menjadi **🌐 Sudah tampil di semua perangkat!**, dan HP yang sedang membuka website ikut berubah sendiri.

> 🔐 **Keamanan:** kata sandi `makansantai` hanya membuka tampilan panel. Yang benar-benar bisa mengubah website hanyalah pemegang **token**. Token disimpan di browser perangkat admin saja (tidak di kode), jadi jangan simpan token di komputer umum. Gunakan tombol **🗑️ Hapus Token dari Perangkat Ini** setelah selesai.
>
> ⏱️ GitHub Pages punya batas wajar ± 10 kali pembaruan per jam. Publikasikan setelah semua perubahan selesai, bukan setiap mengubah satu huruf.
>
> 📤 **Tanpa token?** Klik **⬇️ Unduh data.json**, lalu upload file tersebut ke GitHub secara manual (menimpa `data.json` lama).

---

## ☁️ Opsi Lain — Mode Firebase (Sinkron Instan)

Pilih ini jika ingin perubahan tampil **detik itu juga** tanpa menunggu GitHub Pages. Jika `firebase-config.js` diisi, mode Firebase otomatis dipakai menggantikan mode GitHub. Cukup dilakukan **sekali** oleh guru/pengelola. Paket gratis (Spark) sudah cukup untuk website UMKM.

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
   Kata sandi inilah yang dipakai untuk masuk ke Panel Kelola (menggantikan `makansantai`).

### C. Hubungkan website
8. Klik ikon ⚙️ **Project settings** › tab **General** › bagian **Your apps** › klik ikon **Web `</>`**.
9. Beri nama aplikasi (misal `seblak-web`), klik **Register app**. Firebase menampilkan objek `firebaseConfig`.
10. Buka file `firebase-config.js`, salin nilai `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, dan `appId` ke `FIREBASE_CONFIG`.
11. Isi `ADMIN_EMAIL` dengan email admin dari langkah 7 (harus sama dengan email di Rules).
12. Upload ulang semua file ke GitHub. Tunggu 1–2 menit, lalu buka website.

### D. Cek berhasil
- Buka Panel Kelola → badge berubah menjadi **☁️ Sinkron ke Semua Perangkat**.
- Ubah satu teks → badge **⏳ Menyinkronkan...** lalu **☁️ Tersimpan & tampil di semua perangkat**.
- Buka website di HP → perubahan langsung muncul tanpa refresh.

> 🔐 `apiKey` Firebase untuk web memang boleh terlihat publik. Yang menjaga data adalah **Rules** Firestore: pengunjung hanya bisa membaca, sedangkan yang bisa mengubah hanya akun admin.
>
> 👥 Satu project Firebase bisa dipakai beberapa kelompok. Bedakan dengan mengganti `TOKO_ID` di `firebase-config.js` (misal `kelompok-1`, `kelompok-2`).

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
- **Teknologi**: HTML5 Semantik, CSS3 Murni, Vanilla JavaScript (DOM & LocalStorage API)
- **Lisensi**: MIT License (Bebas digunakan dan dikembangkan untuk keperluan edukasi)
