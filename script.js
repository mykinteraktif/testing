/**
 * ==============================================================================
 * SCRIPT.JS — WEBSITE SEBLAK UMKM (VERSI SIMPEL + FIREBASE)
 * Dipakai oleh index.html (halaman utama + Panel Kelola di dalam halaman)
 * dan admin.html (Panel Kelola terpisah).
 *
 * ALUR DATA (inti program):
 *   1. Admin mengubah isian di Panel Kelola
 *   2. Data dikirim ke Firebase Firestore   → dokToko.set(data)
 *   3. Semua perangkat "mendengarkan" dokumen yang sama → dokToko.onSnapshot(...)
 *   4. Begitu dokumen berubah, halaman utama di SEMUA perangkat ikut berubah
 *
 * Seluruh data toko (teks, warna, 6 produk, foto) disimpan dalam 1 dokumen:
 *   koleksi "umkm" → dokumen TOKO_ID (lihat firebase-config.js)
 * ==============================================================================
 */

// =============================================================================
// 1. DATA AWAL (dipakai sebelum ada data di Firebase / saat Reset)
// =============================================================================
const DEFAULT_DATA = {
  // Identitas usaha & teks beranda
  namaUsaha: "Seblak UMKM",
  labelKecil: "Seblak Prasmanan & Pedas Gurih Khas Singosari",
  slogan: "Pedasnya Pas, Gurihnya Bikin Nagih",
  pemilik: "Siti Fatimah",
  tahunBerdiri: "2021",
  karyawan: "4 orang",
  alamat: "Jl. Raya Singosari No. 45, Singosari, Malang, Jawa Timur",
  noWaTampil: "0812-3456-7890",
  noWa: "6281234567890",
  jamBuka: "Setiap hari, 10.00 - 21.00 WIB",
  medsos: "@seblakumkm",
  linkMaps: "https://maps.google.com",
  namaKelompok: "Siswa SMK PGRI Singosari",
  fotoHero: "img/seblak-hero.jpg",

  // Fakta singkat, cerita & keunggulan
  fakta1: "Pilihan topping prasmanan lengkap",
  fakta2: "Level pedas dan rempah cikur asli",
  fakta3: "Bahan higienis dan fresh setiap hari",
  cerita: "Seblak UMKM menyajikan hidangan seblak khas dengan racikan rempah cikur pilihan dan tingkat kepedasan yang bisa disesuaikan. Berawal dari kecintaan pada kuliner tradisional nusantara, kami berkomitmen menghadirkan rasa gurih mantap yang ramah di kantong pelajar dan keluarga.",
  keunggulan1: "Bumbu rempah cikur alami tanpa pengawet",
  keunggulan2: "Pilihan topping prasmanan melimpah",
  keunggulan3: "Kuah gurih kental berlevel pedas bebas pilih",

  // Tema warna & animasi latar
  warnaUtama: "#C82333",
  warnaAksen: "#E65100",
  warnaLatar: "#FFF8F0",
  warnaHarga: "#B71C1C",
  animasiBg: "bubbles", // 'none' | 'bubbles' | 'gradient' | 'pulse'

  // Katalog 6 produk
  produk: [
    { id: 1, nama: "Seblak Original Komplit", porsi: "1 porsi", harga: "Rp 15.000", deskripsi: "Perpaduan kerupuk kenyal, makaroni, telur orak-arik, dan kuah kencur pedas gurih khas.", foto: "img/seblak-1.jpg" },
    { id: 2, nama: "Seblak Ceker Mercon", porsi: "1 porsi", harga: "Rp 18.000", deskripsi: "Olahan ceker empuk bumbu mercon berpadu kuah merah pedas dengan topping kerupuk kenyal.", foto: "img/seblak-2.jpg" },
    { id: 3, nama: "Seblak Bakso Sosis", porsi: "1 porsi", harga: "Rp 17.000", deskripsi: "Isian melimpah irisan bakso sapi kenyal, sosis bakar, telur, dan kerupuk khas Sunda.", foto: "img/seblak-3.jpg" },
    { id: 4, nama: "Seblak Dumpling Keju", porsi: "1 porsi", harga: "Rp 20.000", deskripsi: "Sensasi dumpling keju lumer di mulut berpadu kuah seblak pedas gurih yang kental dan sedap.", foto: "img/seblak-4.jpg" },
    { id: 5, nama: "Seblak Seafood Spesial", porsi: "1 porsi", harga: "Rp 22.000", deskripsi: "Aneka olahan seafood seperti chikuwa, crabstick, fish roll dengan kuah rempah aromatik.", foto: "img/seblak-5.jpg" },
    { id: 6, nama: "Seblak Mie Kuah Pedas", porsi: "1 porsi", harga: "Rp 16.000", deskripsi: "Kombinasi mie kenyal, aneka kerupuk basah, sayuran segar, dan kuah cikur pedas membakar lidah.", foto: "img/seblak-6.jpg" }
  ]
};

// Pasangan: ID kolom di Panel Kelola ↔ nama data.
// Dipakai untuk MENGISI formulir dan MEMBACA formulir, jadi cukup ditulis sekali.
const KOLOM_FORM = {
  'adm-nama-usaha': 'namaUsaha',
  'adm-label-kecil': 'labelKecil',
  'adm-slogan': 'slogan',
  'adm-pemilik': 'pemilik',
  'adm-tahun-berdiri': 'tahunBerdiri',
  'adm-karyawan': 'karyawan',
  'adm-foto-hero': 'fotoHero',
  'adm-alamat': 'alamat',
  'adm-no-wa-tampil': 'noWaTampil',
  'adm-no-wa': 'noWa',
  'adm-jam-buka': 'jamBuka',
  'adm-medsos': 'medsos',
  'adm-link-maps': 'linkMaps',
  'adm-nama-kelompok': 'namaKelompok',
  'adm-fakta-1': 'fakta1',
  'adm-fakta-2': 'fakta2',
  'adm-fakta-3': 'fakta3',
  'adm-cerita': 'cerita',
  'adm-keunggulan-1': 'keunggulan1',
  'adm-keunggulan-2': 'keunggulan2',
  'adm-keunggulan-3': 'keunggulan3',
  'adm-warna-utama': 'warnaUtama',
  'adm-warna-aksen': 'warnaAksen',
  'adm-warna-latar': 'warnaLatar',
  'adm-warna-harga': 'warnaHarga',
  'adm-animasi-bg': 'animasiBg'
};

// =============================================================================
// 2. KONEKSI FIREBASE
// =============================================================================
const firebaseDiatur =
  typeof firebase !== 'undefined' &&
  typeof FIREBASE_CONFIG !== 'undefined' &&
  Boolean(FIREBASE_CONFIG.apiKey);

let auth = null;
let dokToko = null; // Alamat dokumen data toko di Firestore

if (firebaseDiatur) {
  firebase.initializeApp(FIREBASE_CONFIG);
  auth = firebase.auth();
  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION); // login berlaku selama tab terbuka
  dokToko = firebase.firestore().collection('umkm').doc(TOKO_ID);
}

// Data yang sedang tampil. Diawali dari cadangan terakhir di browser (agar cepat tampil),
// lalu diganti data terbaru dari Firebase.
let dataToko = bacaCadangan();

// "Janji" yang terpenuhi saat data pertama dari Firebase sudah diterima.
// Panel Kelola menunggu ini agar formulir selalu berisi data terbaru, bukan data lama.
let tandaiDataSiap;
const dataSiap = new Promise((selesai) => { tandaiDataSiap = selesai; });

// =============================================================================
// 3. FUNGSI BANTUAN
// =============================================================================
const $ = (id) => document.getElementById(id);

function salinData(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Lengkapi data dengan DEFAULT_DATA agar tidak ada isian yang kosong
function lengkapiData(data) {
  return Object.assign(salinData(DEFAULT_DATA), data || {});
}

function bacaCadangan() {
  try {
    return lengkapiData(JSON.parse(localStorage.getItem('seblak_cadangan')));
  } catch (e) {
    return lengkapiData(null);
  }
}

function simpanCadangan(data) {
  try { localStorage.setItem('seblak_cadangan', JSON.stringify(data)); } catch (e) {}
}

// Mencegah teks dari formulir dianggap kode HTML saat ditampilkan
function aman(teks) {
  return String(teks ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function setVal(id, nilai) {
  const el = $(id);
  if (el) el.value = nilai ?? '';
}

function getVal(id) {
  const el = $(id);
  return el ? el.value.trim() : '';
}

function setTeks(id, teks) {
  const el = $(id);
  if (el) el.textContent = teks;
}

// Format nomor WhatsApp: 0812... → 62812...
function bersihkanNomorWA(nomor) {
  let bersih = String(nomor || '').replace(/\D/g, '');
  if (bersih.startsWith('0')) bersih = '62' + bersih.substring(1);
  return bersih || DEFAULT_DATA.noWa;
}

function buatLinkWA(nomor, pesan) {
  return `https://wa.me/${bersihkanNomorWA(nomor)}?text=${encodeURIComponent(pesan)}`;
}

// Badge status di Panel Kelola
let timerStatus = null;
function aturStatus(teks, kelas = '', kembaliSetelahMs = 0) {
  const badge = $('sync-status-badge');
  if (!badge) return;
  clearTimeout(timerStatus);
  badge.textContent = teks;
  badge.classList.remove('tersimpan', 'gagal');
  if (kelas) badge.classList.add(kelas);
  if (kembaliSetelahMs) timerStatus = setTimeout(aturStatusAwal, kembaliSetelahMs);
}

function aturStatusAwal() {
  if (firebaseDiatur) aturStatus('☁️ Terhubung ke Firebase');
  else aturStatus('⚠️ Firebase belum diatur', 'gagal');
}

// =============================================================================
// 4. MENAMPILKAN DATA DI HALAMAN UTAMA
// =============================================================================
function terapkanTemaWarna(data) {
  const root = document.documentElement;
  root.style.setProperty('--warna-utama', data.warnaUtama);
  root.style.setProperty('--warna-aksen', data.warnaAksen);
  root.style.setProperty('--warna-latar', data.warnaLatar);
  root.style.setProperty('--warna-harga', data.warnaHarga);
}

function terapkanAnimasiBackground(jenis) {
  const namaKelas = `anim-bg-${jenis || 'none'}`;
  // Jika jenis animasi tidak berubah, jangan dibuat ulang (agar animasi tidak meloncat)
  if (document.body.dataset.animAktif === namaKelas) return;
  document.body.dataset.animAktif = namaKelas;

  document.body.classList.remove('anim-bg-none', 'anim-bg-bubbles', 'anim-bg-gradient', 'anim-bg-pulse');
  document.body.classList.add(namaKelas);

  const wadah = $('bg-animation-container');
  if (!wadah) return;
  wadah.innerHTML = '';
  if (jenis !== 'bubbles') return;

  // Gelembung "partikel pedas" dengan ukuran, posisi, dan kecepatan acak
  for (let i = 0; i < 14; i++) {
    const gelembung = document.createElement('span');
    gelembung.className = 'spicy-bubble';
    const ukuran = Math.floor(Math.random() * 32) + 16;
    gelembung.style.width = `${ukuran}px`;
    gelembung.style.height = `${ukuran}px`;
    gelembung.style.left = `${Math.floor(Math.random() * 96)}%`;
    gelembung.style.animationDuration = `${(Math.random() * 8 + 6).toFixed(1)}s`;
    gelembung.style.animationDelay = `${(Math.random() * 6).toFixed(1)}s`;
    wadah.appendChild(gelembung);
  }
}

// Mengisi seluruh isi halaman utama dari data
function tampilkanData(data) {
  terapkanTemaWarna(data);
  terapkanAnimasiBackground(data.animasiBg);
  if (!$('pub-hero-title')) return; // admin.html tidak punya halaman utama

  document.title = `${data.namaUsaha} - ${data.slogan}`;

  // Teks biasa: ID elemen → isi
  const daftarTeks = {
    'pub-logo-nama': data.namaUsaha,
    'pub-hero-label': `🔥 ${data.labelKecil}`,
    'pub-hero-title': data.namaUsaha,
    'pub-hero-slogan': data.slogan,
    'pub-hero-pemilik': data.pemilik,
    'pub-hero-berdiri': data.tahunBerdiri,
    'pub-hero-karyawan': data.karyawan,
    'pub-fakta-1': data.fakta1,
    'pub-fakta-2': data.fakta2,
    'pub-fakta-3': data.fakta3,
    'pub-tentang-nama': `Tentang ${data.namaUsaha}`,
    'pub-cerita-teks': data.cerita,
    'pub-keunggulan-1': data.keunggulan1,
    'pub-keunggulan-2': data.keunggulan2,
    'pub-keunggulan-3': data.keunggulan3,
    'pub-kontak-alamat': data.alamat,
    'pub-kontak-wa-tampil': data.noWaTampil,
    'pub-kontak-jam': data.jamBuka,
    'pub-kontak-medsos': data.medsos,
    'pub-footer-tahun': new Date().getFullYear(),
    'pub-footer-nama-usaha': data.namaUsaha,
    'pub-footer-kelompok': data.namaKelompok
  };
  Object.entries(daftarTeks).forEach(([id, teks]) => setTeks(id, teks));

  // Foto utama
  const fotoHero = $('pub-hero-img');
  if (fotoHero && fotoHero.getAttribute('src') !== data.fotoHero) fotoHero.src = data.fotoHero;

  // Tautan WhatsApp & Maps
  const tautan = {
    'pub-btn-hero-wa': buatLinkWA(data.noWa, `Halo ${data.namaUsaha}, saya ingin bertanya tentang menu seblak prasmanan hari ini.`),
    'pub-btn-chat-wa': buatLinkWA(data.noWa, `Halo ${data.namaUsaha}, saya ingin tanya lokasi dan menu seblak.`),
    'pub-float-wa': buatLinkWA(data.noWa, `Halo ${data.namaUsaha}, saya ingin memesan seblak sekarang.`),
    'pub-btn-maps': data.linkMaps || 'https://maps.google.com'
  };
  Object.entries(tautan).forEach(([id, href]) => { if ($(id)) $(id).href = href; });

  // Katalog 6 produk
  const wadahProduk = $('pub-produk-container');
  if (wadahProduk) {
    wadahProduk.innerHTML = data.produk.map((item) => {
      const linkWA = buatLinkWA(data.noWa, `Halo ${data.namaUsaha}, saya ingin memesan menu: ${item.nama} (${item.porsi}) - ${item.harga}.`);
      return `
        <article class="produk-card">
          <div class="produk-img-wrapper">
            <img src="${aman(item.foto)}" alt="Foto menu ${aman(item.nama)}" class="produk-img" onerror="this.src='img/seblak-1.jpg'">
            <span class="produk-badge-porsi">${aman(item.porsi)}</span>
          </div>
          <div class="produk-body">
            <h3 class="produk-nama">${aman(item.nama)}</h3>
            <p class="produk-deskripsi">${aman(item.deskripsi)}</p>
            <div class="produk-footer">
              <span class="produk-harga">${aman(item.harga)}</span>
              <a href="${aman(linkWA)}" target="_blank" rel="noopener noreferrer" class="btn-pesan-produk">
                <span>Pesan</span><span>💬</span>
              </a>
            </div>
          </div>
        </article>`;
    }).join('');
  }
}

// =============================================================================
// 5. REAL-TIME: SEMUA PERANGKAT MENDENGARKAN DOKUMEN YANG SAMA
// =============================================================================
function mulaiDengarkanData() {
  if (!dokToko) return tandaiDataSiap();

  dokToko.onSnapshot((snap) => {
    dataToko = lengkapiData(snap.exists ? snap.data() : null);
    simpanCadangan(dataToko);
    tampilkanData(dataToko); // ← halaman utama ikut berubah di sini
    tandaiDataSiap();
  }, (galat) => {
    console.error('Gagal membaca data dari Firebase:', galat);
    aturStatus('⚠️ Gagal membaca data dari Firebase', 'gagal');
    tandaiDataSiap();
  });
}

// =============================================================================
// 6. PANEL KELOLA: MENGISI & MEMBACA FORMULIR
// =============================================================================
function isiFormulirAdmin(data) {
  Object.entries(KOLOM_FORM).forEach(([id, kunci]) => setVal(id, data[kunci]));
  if ($('preview-foto-hero')) $('preview-foto-hero').src = data.fotoHero;

  // Formulir 6 produk
  const wadah = $('admin-form-produk-container');
  if (!wadah) return;
  wadah.innerHTML = data.produk.map((item, i) => `
    <div class="admin-produk-card">
      <div class="admin-produk-header">
        <span>📦 Produk #${i + 1}</span>
        <span style="font-size: 0.8rem; color: #64748B;">ID: ${item.id}</span>
      </div>
      <div class="form-grid-2">
        <div class="form-group">
          <label class="form-label" for="adm-prod-nama-${i}">Nama Menu Seblak</label>
          <input type="text" class="form-input" id="adm-prod-nama-${i}">
        </div>
        <div class="form-group">
          <label class="form-label" for="adm-prod-porsi-${i}">Berat / Porsi</label>
          <input type="text" class="form-input" id="adm-prod-porsi-${i}">
        </div>
      </div>
      <div class="form-grid-2">
        <div class="form-group">
          <label class="form-label" for="adm-prod-harga-${i}">Harga (Contoh: Rp 15.000)</label>
          <input type="text" class="form-input" id="adm-prod-harga-${i}">
        </div>
        <div class="form-group">
          <label class="form-label" for="adm-prod-foto-${i}">URL / Path Foto Produk</label>
          <input type="text" class="form-input" id="adm-prod-foto-${i}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Pilih Foto dari Laptop/HP (otomatis diperkecil)</label>
        <div class="file-upload-box">
          <img id="preview-prod-${i}" alt="Preview" class="file-preview-thumb" onerror="this.src='img/seblak-1.jpg'">
          <div class="file-upload-controls">
            <label class="btn-file-pilih" for="file-prod-${i}">📁 Pilih Berkas Foto...</label>
            <input type="file" id="file-prod-${i}" accept="image/*" onchange="pilihFoto(this, 'adm-prod-foto-${i}', 'preview-prod-${i}')">
            <div class="file-nama-info">Format: JPG, PNG, WEBP.</div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="adm-prod-desc-${i}">Deskripsi Produk (Maks. 25 kata)</label>
        <textarea class="form-textarea" id="adm-prod-desc-${i}"></textarea>
      </div>
    </div>`).join('');

  // Isi nilai lewat JavaScript (aman untuk tanda kutip dan karakter khusus)
  data.produk.forEach((item, i) => {
    setVal(`adm-prod-nama-${i}`, item.nama);
    setVal(`adm-prod-porsi-${i}`, item.porsi);
    setVal(`adm-prod-harga-${i}`, item.harga);
    setVal(`adm-prod-foto-${i}`, item.foto);
    setVal(`adm-prod-desc-${i}`, item.deskripsi);
    $(`preview-prod-${i}`).src = item.foto;
  });
}

function bacaFormulir() {
  const data = salinData(dataToko);
  Object.entries(KOLOM_FORM).forEach(([id, kunci]) => {
    if ($(id)) data[kunci] = getVal(id);
  });
  data.noWa = bersihkanNomorWA(data.noWa);
  data.produk = data.produk.map((item, i) => ({
    id: item.id,
    nama: getVal(`adm-prod-nama-${i}`),
    porsi: getVal(`adm-prod-porsi-${i}`),
    harga: getVal(`adm-prod-harga-${i}`),
    deskripsi: getVal(`adm-prod-desc-${i}`),
    foto: getVal(`adm-prod-foto-${i}`)
  }));
  return data;
}

// =============================================================================
// 7. PANEL KELOLA: MENYIMPAN KE FIREBASE
// =============================================================================
const BATAS_DOKUMEN = 1000000; // Batas 1 dokumen Firestore ± 1 MB
let timerSimpan = null;

// Dipanggil setiap kali admin mengetik / mengganti warna / memilih foto
function simpanOtomatis() {
  const data = bacaFormulir();
  dataToko = data;
  tampilkanData(data); // langsung terlihat di perangkat ini
  aturStatus('⏳ Menyimpan...', 'tersimpan');

  // Tunggu admin berhenti mengetik 0,7 detik, baru kirim (hemat kuota Firebase)
  clearTimeout(timerSimpan);
  timerSimpan = setTimeout(() => kirimKeFirebase(data), 700);
}

async function kirimKeFirebase(data, tampilkanPesan = false) {
  clearTimeout(timerSimpan);

  if (!dokToko) {
    aturStatus('⚠️ Firebase belum diatur', 'gagal');
    if (tampilkanPesan) alert('Firebase belum diatur. Isi file firebase-config.js terlebih dahulu (lihat README.md).');
    return false;
  }
  if (!auth.currentUser) {
    aturStatus('🔒 Masuk sebagai admin dulu', 'gagal');
    return false;
  }
  if (JSON.stringify(data).length > BATAS_DOKUMEN) {
    aturStatus('⚠️ Total foto terlalu besar', 'gagal');
    alert('Total ukuran foto terlalu besar untuk disimpan. Ganti salah satu foto dengan file yang lebih kecil.');
    return false;
  }

  try {
    await dokToko.set(data); // ← kirim ke Firebase; semua perangkat menerima lewat onSnapshot
    aturStatus('✅ Tersimpan & tampil di semua perangkat', 'tersimpan', 2500);
    if (tampilkanPesan) alert('✅ Berhasil! Perubahan sudah tampil di semua perangkat.');
    return true;
  } catch (e) {
    console.error('Gagal menyimpan ke Firebase:', e);
    const pesan = e.code === 'permission-denied'
      ? 'Ditolak Firebase. Periksa ADMIN_EMAIL dan Rules Firestore.'
      : 'Periksa koneksi internet.';
    aturStatus('⚠️ Gagal menyimpan', 'gagal');
    if (tampilkanPesan) alert('⚠️ Gagal menyimpan. ' + pesan);
    return false;
  }
}

// =============================================================================
// 8. FOTO DARI LAPTOP/HP (DIPERKECIL AGAR MUAT DI 1 DOKUMEN)
// =============================================================================
// sisi  = sisi terpanjang foto (piksel)
// batas = ukuran maksimal hasil (karakter Base64): hero ± 180 KB, produk ± 70 KB
const UKURAN_FOTO = {
  hero: { sisi: 1200, batas: 250000 },
  produk: { sisi: 600, batas: 100000 }
};

function perkecilFoto(file, sisiMaks, batas) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let sisi = sisiMaks;
      let kualitas = 0.8;
      let hasil;
      // Perkecil terus sampai ukurannya di bawah batas
      do {
        const skala = Math.min(1, sisi / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.naturalWidth * skala);
        canvas.height = Math.round(img.naturalHeight * skala);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; // latar putih untuk PNG transparan
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        hasil = canvas.toDataURL('image/jpeg', kualitas);
        sisi = Math.round(sisi * 0.8);
        kualitas = Math.max(0.5, kualitas - 0.1);
      } while (hasil.length > batas && sisi > 200);
      URL.revokeObjectURL(img.src);
      resolve(hasil);
    };
    img.onerror = () => reject(new Error('File bukan gambar'));
    img.src = URL.createObjectURL(file);
  });
}

// Dipanggil saat admin memilih file foto (foto utama maupun foto produk)
async function pilihFoto(input, idKolom, idPreview) {
  const file = input.files[0];
  input.value = ''; // agar file yang sama bisa dipilih ulang
  if (!file) return;

  const ukuran = idKolom === 'adm-foto-hero' ? UKURAN_FOTO.hero : UKURAN_FOTO.produk;
  try {
    const dataUrl = await perkecilFoto(file, ukuran.sisi, ukuran.batas);
    setVal(idKolom, dataUrl);
    $(idPreview).src = dataUrl;
    simpanOtomatis();
  } catch (e) {
    alert('Foto tidak dapat dibaca. Gunakan format JPG, PNG, atau WEBP.');
  }
}

// =============================================================================
// 9. LOGIN ADMIN, GANTI KATA SANDI, RESET (FIREBASE AUTHENTICATION)
// =============================================================================
// Mengembalikan '' jika berhasil, atau pesan kesalahan jika gagal
async function masukAdmin(sandi) {
  if (!firebaseDiatur) return 'Firebase belum diatur. Isi file firebase-config.js terlebih dahulu.';
  try {
    await auth.signInWithEmailAndPassword(ADMIN_EMAIL, sandi);
    return '';
  } catch (e) {
    if (e.code === 'auth/network-request-failed') return 'Tidak ada koneksi internet.';
    if (e.code === 'auth/too-many-requests') return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.';
    return 'Kata sandi salah! Akses ditolak.';
  }
}

function sudahLogin() {
  return Boolean(auth && auth.currentUser);
}

async function ubahKataSandiAdmin() {
  const lama = getVal('adm-pass-lama');
  const baru = getVal('adm-pass-baru');
  const konfirmasi = getVal('adm-pass-konfirmasi');

  if (!lama || !baru || !konfirmasi) return alert('Harap isi semua kolom untuk mengganti kata sandi.');
  if (baru.length < 6) return alert('Kata sandi baru minimal 6 karakter.');
  if (baru !== konfirmasi) return alert('Kata sandi baru dan konfirmasi tidak cocok!');
  if (!sudahLogin()) return alert('Sesi admin berakhir. Silakan masuk ulang.');

  try {
    const pengguna = auth.currentUser;
    const kredensial = firebase.auth.EmailAuthProvider.credential(pengguna.email, lama);
    await pengguna.reauthenticateWithCredential(kredensial); // pastikan sandi lama benar
    await pengguna.updatePassword(baru);
    ['adm-pass-lama', 'adm-pass-baru', 'adm-pass-konfirmasi'].forEach((id) => setVal(id, ''));
    alert('🎉 Kata sandi admin berhasil diperbarui!');
  } catch (e) {
    console.error('Gagal mengganti kata sandi:', e);
    alert(String(e.code).includes('password') || String(e.code).includes('credential')
      ? 'Kata sandi lama salah! Perubahan kata sandi dibatalkan.'
      : 'Gagal mengganti kata sandi. Periksa koneksi internet.');
  }
}

async function resetKeDataDefault() {
  if (!confirm('Kembalikan seluruh data dan tampilan ke pengaturan awal di semua perangkat?')) return;
  const dataAwal = salinData(DEFAULT_DATA);
  dataToko = dataAwal;
  isiFormulirAdmin(dataAwal);
  tampilkanData(dataAwal);
  if (await kirimKeFirebase(dataAwal)) alert('🔄 Data berhasil dikembalikan ke pengaturan awal.');
}

// Catatan di Panel Kelola jika firebase-config.js belum diisi
function tampilkanCatatanFirebase() {
  if (firebaseDiatur) return;
  document.querySelectorAll('.admin-wrapper').forEach((wadah) => {
    const catatan = document.createElement('div');
    catatan.className = 'catatan-sinkron';
    catatan.innerHTML = '<strong>⚠️ Firebase belum diatur.</strong> Perubahan tidak bisa disimpan. ' +
      'Isi file <code>firebase-config.js</code> mengikuti panduan di README.md.';
    wadah.prepend(catatan);
  });
}

// Simpan otomatis setiap kali isian Panel Kelola berubah
function pasangSimpanOtomatis() {
  document.querySelectorAll('.admin-wrapper').forEach((wadah) => {
    wadah.addEventListener('input', (e) => {
      if (e.target.matches('input:not([type="password"]):not([type="file"]):not([type="color"]), textarea')) simpanOtomatis();
    });
    wadah.addEventListener('change', (e) => {
      if (e.target.matches('input[type="color"], select')) simpanOtomatis();
    });
  });

  if ($('file-foto-hero')) {
    $('file-foto-hero').addEventListener('change', function () {
      pilihFoto(this, 'adm-foto-hero', 'preview-foto-hero');
    });
  }
  if ($('btn-simpan-semua')) $('btn-simpan-semua').addEventListener('click', () => kirimKeFirebase(bacaFormulir(), true));
  if ($('btn-reset-default')) $('btn-reset-default').addEventListener('click', resetKeDataDefault);
  if ($('btn-ganti-password')) $('btn-ganti-password').addEventListener('click', ubahKataSandiAdmin);
}

// =============================================================================
// 10. HALAMAN UTAMA (index.html) + PANEL KELOLA DI DALAM HALAMAN
// =============================================================================
async function bukaJendela2() {
  if (sudahLogin()) {
    await dataSiap; // pastikan formulir berisi data terbaru dari Firebase
    $('modal-login-admin').classList.add('tersembunyi');
    $('modal-jendela-2').classList.remove('tersembunyi');
    isiFormulirAdmin(dataToko);
  } else {
    $('login-admin-error').style.display = 'none';
    setVal('input-pass-admin-modal', '');
    $('modal-login-admin').classList.remove('tersembunyi');
    setTimeout(() => $('input-pass-admin-modal').focus(), 100);
  }
}

function tutupModalAdminLogin() {
  $('modal-login-admin').classList.add('tersembunyi');
}

function tutupJendela2() {
  $('modal-jendela-2').classList.add('tersembunyi');
}

async function prosesLoginAdmin() {
  $('btn-submit-admin-login').disabled = true;
  const pesanGagal = await masukAdmin(getVal('input-pass-admin-modal'));
  $('btn-submit-admin-login').disabled = false;

  if (pesanGagal) {
    $('login-admin-error').textContent = pesanGagal;
    $('login-admin-error').style.display = 'block';
    setVal('input-pass-admin-modal', '');
    return;
  }
  bukaJendela2();
}

function inisialisasiHalamanUtama() {
  // Menu hamburger di HP
  const tombolMenu = $('nav-toggle-btn');
  const daftarMenu = $('nav-menu-list');
  tombolMenu.addEventListener('click', () => {
    daftarMenu.classList.toggle('buka');
    tombolMenu.textContent = daftarMenu.classList.contains('buka') ? '✕ Tutup' : '☰ Menu';
  });
  daftarMenu.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => {
    daftarMenu.classList.remove('buka');
    tombolMenu.textContent = '☰ Menu';
  }));

  // Panel Kelola di dalam halaman
  $('btn-header-admin').addEventListener('click', bukaJendela2);
  $('btn-submit-admin-login').addEventListener('click', prosesLoginAdmin);
  $('input-pass-admin-modal').addEventListener('keypress', (e) => { if (e.key === 'Enter') prosesLoginAdmin(); });
  if (location.hash === '#jendela2' || location.hash === '#admin') setTimeout(bukaJendela2, 300);
}

// =============================================================================
// 11. PANEL KELOLA TERPISAH (admin.html)
// =============================================================================
function inisialisasiHalamanAdmin() {
  const layarLogin = $('login-modal-overlay');

  async function cekKataSandi() {
    $('btn-masuk-admin').disabled = true;
    const pesanGagal = await masukAdmin(getVal('input-password-admin'));
    $('btn-masuk-admin').disabled = false;
    if (pesanGagal) {
      $('login-error-pesan').textContent = pesanGagal;
      $('login-error-pesan').style.display = 'block';
      setVal('input-password-admin', '');
    }
    // Jika berhasil, onAuthStateChanged di bawah yang menutup layar login
  }

  $('btn-masuk-admin').addEventListener('click', cekKataSandi);
  $('input-password-admin').addEventListener('keypress', (e) => { if (e.key === 'Enter') cekKataSandi(); });
  $('btn-logout-admin').addEventListener('click', async () => {
    if (auth) await auth.signOut();
    location.reload();
  });

  isiFormulirAdmin(dataToko);

  // Layar login tampil selama admin belum masuk
  if (auth) {
    auth.onAuthStateChanged(async (pengguna) => {
      if (pengguna) {
        await dataSiap; // pastikan formulir berisi data terbaru dari Firebase
        isiFormulirAdmin(dataToko);
      }
      layarLogin.classList.toggle('tersembunyi', Boolean(pengguna));
    });
  }
}

// =============================================================================
// 12. MULAI SAAT HALAMAN SELESAI DIMUAT
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  tampilkanData(dataToko);   // tampil cepat dari cadangan
  mulaiDengarkanData();      // lalu ikuti data terbaru dari Firebase (real-time)
  pasangSimpanOtomatis();
  tampilkanCatatanFirebase();
  aturStatusAwal();

  if ($('pub-hero-title')) inisialisasiHalamanUtama();
  else if ($('admin-container')) inisialisasiHalamanAdmin();
});
