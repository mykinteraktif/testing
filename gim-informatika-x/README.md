# Nyalakan Sirkuit! · Gim Informatika Kelas X SMK

Gim edukasi berbasis web untuk mata pelajaran **Informatika Fase E (kelas X SMK, semua konsentrasi keahlian)**. Siswa membantu robot **Bit** menyalakan tujuh chip di papan induk "Kota Digital". Setiap chip berisi satu misi. Setelah semua chip menyala, siswa mengaktifkan prosesor lewat **Ujian Akhir**.

Disusun oleh **Mohammad Yusron Kholish, S.Kom** · SMKS PGRI Singosari · Versi 1.0 (Oktober 2026)

## Isi gim

| Chip | Misi | Elemen CP | Bentuk tugas |
|---|---|---|---|
| U1 | Robot Kurir | Berpikir Komputasional | Menyusun program robot di peta (mudah, sedang, sulit), empat pilar BK, pencarian, pengurutan, queue dan stack |
| U2 | Rakit Komputer | Literasi Digital (sistem komputer) | Input/proses/output/penyimpanan, pasangkan komponen, urutan booting, peran sistem operasi |
| U3 | Jalur Data | Literasi Digital (jaringan & internet) | Perangkat jaringan, alur DNS dan HTTPS, kartu kilat IPv4, sandi Caesar |
| U4 | Kantor Digital | Literasi Digital (TIK perkantoran) | Memilih aplikasi, rumus spreadsheet acak (SUM, AVERAGE, MAX, MIN, COUNTIF, IF), operator mesin pencari |
| U5 | Detektif Data | Analisis Data | Membersihkan tabel data, membaca grafik acak, memilih jenis grafik, privasi data |
| U6 | Pemburu Bug | Algoritma dan Pemrograman | Menebak output Python, mencari baris bug, menyusun kode |
| U7 | Warga Digital | Literasi Digital (etika & keamanan) | Kartu kilat aman/bahaya, jenis lisensi, membaca lateral, HAKI, UU PDP |
| CPU | Ujian Akhir | Semua elemen | 15 soal acak dari seluruh misi (asesmen sumatif) |

Fitur lain:

- **Layar pembuka ala komputer menyala (POST BIOS)** sekitar 4 detik. Layar ini memeriksa ketujuh chip sesuai progres siswa (TUNTAS / SIAP / PADAM) dan menyapa pemain lama dengan namanya, lalu masuk ke layar judul. Bisa dilewati dengan ketuk layar atau Enter.
- **Bekal materi** singkat dan contoh dunia kerja sebelum setiap misi.
- **Umpan balik dan pembahasan** langsung di setiap tugas. Pada Ujian Akhir, pembahasan baru muncul setelah semua soal selesai.
- **Petunjuk** yang boleh dipakai, dengan konsekuensi nilai tugas itu maksimal 80.
- **Skor, bintang, XP, dan 12 lencana.** Yang disimpan adalah skor terbaik, dan soal diacak ulang setiap kali bermain.
- **Rapor** berisi teks laporan dengan kode verifikasi, siap disalin dan dikirim lewat WhatsApp atau LMS.
- **Sertifikat PNG** untuk siswa yang lulus Ujian Akhir.
- **Ruang Guru** (pakai PIN) berisi Mode Demo untuk presentasi, pemeriksa keaslian laporan, saran alur pembelajaran, ringkasan bank soal, dan tombol hapus progres.
- Halaman **Tujuan Pembelajaran**: ringkasan CP, TP 10.1–10.7, kriteria ketercapaian, dan Dimensi Profil Lulusan. Status ketercapaian dihitung otomatis.

## Cara membuka

**Offline (tanpa internet):** klik dua kali `index.html`. File ini mandiri, karena huruf, ikon, dan seluruh kode sudah ada di dalamnya.

**GitHub Pages:**

1. Buka repositori di GitHub, lalu pilih **Settings → Pages**.
2. Pada *Build and deployment*, pilih **Deploy from a branch**, pilih branch-nya, folder `/ (root)`, lalu **Save**.
3. Gim dapat dibuka di `https://<akun>.github.io/<nama-repo>/gim-informatika-x/`.

Progres siswa tersimpan di browser masing-masing (localStorage), tidak dikirim ke server mana pun. Jika satu komputer dipakai bergantian, hapus progres lewat **Ruang Guru → Hapus progres perangkat ini**.

## Untuk guru

- **PIN Ruang Guru bawaan: `1234`.** Ganti sebelum gim dibagikan, di bagian `KONFIG.pinGuru`.
- Semua isi gim dikumpulkan di bagian **`DATA GIM`** di awal `<script>` pada `index.html`:
  - `KONFIG`: KKTP (bawaan 75), syarat membuka chip (bawaan 50), waktu kartu kilat, PIN, nomor WhatsApp guru, nama penyusun.
  - `LEVEL`: materi, cerita, tujuan pembelajaran, dan susunan tugas tiap misi.
  - `BANK`: seluruh soal. Pada soal pilihan ganda, **opsi pertama selalu jawaban benar** (urutan opsi diacak otomatis saat ditampilkan).
- Kisi-kisi, kunci jawaban, dan rubrik penskoran ada di [`untuk-guru/kisi-kisi-dan-kunci.md`](untuk-guru/kisi-kisi-dan-kunci.md). Jika repositori publik dan GitHub Pages aktif, file ini juga bisa dibuka siapa saja. Pindahkan ke tempat lain bila perlu.
- Saran alur: 2 pertemuan × 2 JP (U1–U3, lalu U4–U7 dan Ujian Akhir), atau satu chip sebagai penguatan setelah materi elemen terkait.

## Rujukan dan catatan

- CP: Keputusan Kepala BSKAP Kemendikdasmen Nomor 046/H/KR/2025 tentang Capaian Pembelajaran. Ringkasan CP di dalam gim adalah parafrase. Rumusan TP 10.1–10.7 adalah **rancangan sementara** yang perlu disesuaikan dengan ATP sekolah.
- UU No. 27 Tahun 2022 (Pelindungan Data Pribadi) dan UU No. 28 Tahun 2014 (Hak Cipta).
- Semua data dalam gim adalah data rekaan. Contoh alamat IP memakai rentang privat dan rentang dokumentasi RFC 5737.
- Huruf: Chakra Petch, Atkinson Hyperlegible, dan JetBrains Mono (SIL Open Font License 1.1), disematkan di dalam file.

## Struktur folder

```text
gim-informatika-x/
├── index.html                      # Gim lengkap, satu file, berjalan offline
├── README.md                       # Dokumen ini
└── untuk-guru/
    └── kisi-kisi-dan-kunci.md      # Kisi-kisi, kunci jawaban, rubrik
```
