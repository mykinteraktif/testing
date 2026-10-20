/**
 * ==============================================================================
 * SCRIPT.JS - LOGIKA JENDELA 1 (PUBLIK) & JENDELA 2 (PANEL ADMIN)
 * Dibuat khusus untuk bahan ajar siswa SMK (Rekayasa Perangkat Lunak)
 * Fitur:
 * 1. Manipulasi DOM Vanilla JavaScript (Tanpa Framework)
 * 2. Sinkronisasi Data Real-Time Antar Tab/Jendela via LocalStorage & BroadcastChannel,
 *    dan antar PERANGKAT via database data.json di GitHub (publikasi lewat GitHub API)
 *    atau Firebase Cloud Firestore (jika firebase-config.js diisi)
 * 3. File Chooser (FileReader API ke Base64 Data URL) untuk foto Hero & 6 Menu Produk,
 *    foto diperkecil dulu dengan Canvas agar localStorage tidak penuh
 * 4. Pengubah Seluruh Teks Website & Tema Warna Dinamis (:root CSS Variables)
 * 5. Pilihan Template Animasi Background (Partikel Pedas, Gradasi, Cahaya Berdenyut)
 * 6. Manajemen Kata Sandi Dinamis (Ganti Password Admin, Default: makansantai)
 * ==============================================================================
 */

// KUNCI PENYIMPANAN LOCALSTORAGE BROWSER
const STORAGE_KEY = 'seblak_umkm_data';
const PASSWORD_KEY = 'seblak_admin_password';
const DEFAULT_PASSWORD = 'makansantai';

// NOMOR WHATSAPP DEFAULT SISTEM
const NOMOR_WA_DEFAULT = '6281234567890';

// DATA AWAL (DEFAULT) SESUAI SPESIFIKASI UMKM
const DEFAULT_DATA = {
  // 1. Identitas Usaha & Teks Utama
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

  // 2. Fakta Singkat, Cerita Usaha & 3 Keunggulan
  fakta1: "Pilihan topping prasmanan lengkap",
  fakta2: "Level pedas dan rempah cikur asli",
  fakta3: "Bahan higienis dan fresh setiap hari",
  cerita: "Seblak UMKM menyajikan hidangan seblak khas dengan racikan rempah cikur pilihan dan tingkat kepedasan yang bisa disesuaikan. Berawal dari kecintaan pada kuliner tradisional nusantara, kami berkomitmen menghadirkan rasa gurih mantap yang ramah di kantong pelajar dan keluarga.",
  keunggulan1: "Bumbu rempah cikur alami tanpa pengawet",
  keunggulan2: "Pilihan topping prasmanan melimpah",
  keunggulan3: "Kuah gurih kental berlevel pedas bebas pilih",

  // 3. Tema Warna & Template Animasi Background
  warnaUtama: "#C82333", // Merah cabai
  warnaAksen: "#E65100", // Oranye rempah
  warnaLatar: "#FFF8F0", // Krem lembut
  warnaHarga: "#B71C1C", // Merah pekat
  animasiBg: "bubbles",  // 'none' | 'bubbles' | 'gradient' | 'pulse'

  // 4. Katalog 6 Produk Seblak
  produk: [
    {
      id: 1,
      nama: "Seblak Original Komplit",
      porsi: "1 porsi",
      harga: "Rp 15.000",
      deskripsi: "Perpaduan kerupuk kenyal, makaroni, telur orak-arik, dan kuah kencur pedas gurih khas.",
      foto: "img/seblak-1.jpg"
    },
    {
      id: 2,
      nama: "Seblak Ceker Mercon",
      porsi: "1 porsi",
      harga: "Rp 18.000",
      deskripsi: "Olahan ceker empuk bumbu mercon berpadu kuah merah pedas dengan topping kerupuk kenyal.",
      foto: "img/seblak-2.jpg"
    },
    {
      id: 3,
      nama: "Seblak Bakso Sosis",
      porsi: "1 porsi",
      harga: "Rp 17.000",
      deskripsi: "Isian melimpah irisan bakso sapi kenyal, sosis bakar, telur, dan kerupuk khas Sunda.",
      foto: "img/seblak-3.jpg"
    },
    {
      id: 4,
      nama: "Seblak Dumpling Keju",
      porsi: "1 porsi",
      harga: "Rp 20.000",
      deskripsi: "Sensasi dumpling keju lumer di mulut berpadu kuah seblak pedas gurih yang kental dan sedap.",
      foto: "img/seblak-4.jpg"
    },
    {
      id: 5,
      nama: "Seblak Seafood Spesial",
      porsi: "1 porsi",
      harga: "Rp 22.000",
      deskripsi: "Aneka olahan seafood seperti chikuwa, crabstick, fish roll dengan kuah rempah aromatik.",
      foto: "img/seblak-5.jpg"
    },
    {
      id: 6,
      nama: "Seblak Mie Kuah Pedas",
      porsi: "1 porsi",
      harga: "Rp 16.000",
      deskripsi: "Kombinasi mie kenyal, aneka kerupuk basah, sayuran segar, dan kuah cikur pedas membakar lidah.",
      foto: "img/seblak-6.jpg"
    }
  ]
};

// Saluran BroadcastChannel untuk komunikasi seketika antar jendela/tab
let syncChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    syncChannel = new BroadcastChannel('seblak_umkm_sync_channel');
  }
} catch (e) {
  console.warn("BroadcastChannel tidak aktif pada peramban ini:", e);
}

/**
 * --------------------------------------------------------------------------
 * FUNGSI BANTUAN DATA & LOCALSTORAGE
 * --------------------------------------------------------------------------
 */

// Membuat salinan data yang benar-benar terpisah (deep copy).
// Tujuannya agar DEFAULT_DATA tidak ikut berubah saat formulir admin diedit,
// sehingga tombol "Reset ke Data Awal" selalu kembali ke data asli.
function salinData(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Salinan data terakhir di memori. Dipakai jika localStorage tidak dapat menampung data
// (misalnya pada mode cloud dengan banyak foto), agar tampilan tetap memakai data terbaru.
let dataMemori = null;

function getDataUMKM() {
  const dataAwal = salinData(DEFAULT_DATA);
  try {
    const dataTersimpan = localStorage.getItem(STORAGE_KEY);
    if (dataTersimpan) {
      const dataParsed = JSON.parse(dataTersimpan);
      // Gabungkan dengan default agar properti baru tetap tersedia
      return Object.assign(dataAwal, dataParsed);
    }
  } catch (e) {
    console.error("Gagal membaca dari localStorage:", e);
  }
  if (dataMemori) return Object.assign(dataAwal, salinData(dataMemori));
  return dataAwal;
}

/**
 * Menyimpan data.
 * - Mode lokal : disimpan ke localStorage (hanya browser ini).
 * - Mode cloud : disimpan ke localStorage sebagai cadangan, lalu dikirim ke Firestore
 *                agar tampil di SEMUA perangkat.
 * Mengembalikan true jika berhasil, false jika gagal (biasanya karena penyimpanan penuh).
 * Sinyal ke tab lain HANYA dikirim jika data benar-benar tersimpan,
 * supaya halaman utama tidak menampilkan data "semu" yang hilang saat di-refresh.
 */
function simpanDataUMKM(data) {
  let tersimpanLokal = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Gagal menyimpan ke localStorage:", e);
    tersimpanLokal = false;
    // Pada mode cloud, localStorage hanya cadangan. Cadangan lama dihapus
    // agar tidak menampilkan data basi; data terbaru tetap ada di memori & cloud.
    if (cloud.aktif) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }
  }

  if (!tersimpanLokal && !cloud.aktif) return false;
  dataMemori = salinData(data);

  // Kirim sinyal lewat BroadcastChannel ke tab lain
  if (syncChannel) {
    try {
      syncChannel.postMessage({ tipe: 'PERBARUI_TAMPILAN', timestamp: Date.now(), data });
    } catch (e) {}
  }

  // Kirim juga ke cloud agar perangkat lain ikut berubah
  if (cloud.aktif) jadwalkanSimpanCloud(data);
  return true;
}

// Peringatan penyimpanan penuh cukup muncul sekali selama penyimpanan masih gagal,
// agar tidak muncul berulang-ulang setiap kali mengetik satu huruf
let peringatanPenuhSudahTampil = false;

function tampilkanPeringatanPenyimpananPenuh(paksa = false) {
  if (peringatanPenuhSudahTampil && !paksa) return;
  peringatanPenuhSudahTampil = true;
  alert(
    "⚠️ Perubahan TIDAK tersimpan dan belum tampil di halaman utama.\n\n" +
    "Penyimpanan browser (localStorage) sudah penuh, biasanya karena foto berukuran besar.\n\n" +
    "Solusi:\n" +
    "• Ganti foto dengan file yang lebih kecil, atau\n" +
    "• Isi path foto dari folder img/ (contoh: img/seblak-1.jpg), atau\n" +
    "• Klik \"Reset ke Data Awal\"."
  );
}

/**
 * --------------------------------------------------------------------------
 * PENGOLAHAN FOTO (KOMPRES SEBELUM DISIMPAN)
 * Foto dari HP bisa 2–8 MB. Jika disimpan utuh sebagai Base64, satu foto saja
 * sudah hampir memenuhi localStorage (± 5 MB). Karena itu foto diperkecil dulu.
 * --------------------------------------------------------------------------
 */
const BATAS_UKURAN_FILE_MB = 15;          // Batas file asli yang boleh dipilih
const UKURAN_FOTO_HERO = 1400;            // Sisi terpanjang foto utama (piksel)
const UKURAN_FOTO_PRODUK = 800;           // Sisi terpanjang foto produk (piksel)
const KUALITAS_JPEG = 0.8;                // 0.0 – 1.0
const BATAS_FOTO_TERSIMPAN = 450000;      // Batas ukuran 1 foto (± 330 KB). Lebih dari ini akan dikecilkan
                                          // (aman untuk localStorage & batas 1 MB per dokumen Firestore)

function bacaFileSebagaiDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Memperkecil gambar (Data URL) memakai canvas, lalu menyimpannya sebagai JPEG
function ubahUkuranDataUrl(dataUrl, maksSisi, kualitas) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const skala = Math.min(1, maksSisi / Math.max(img.naturalWidth, img.naturalHeight));
      const lebar = Math.max(1, Math.round(img.naturalWidth * skala));
      const tinggi = Math.max(1, Math.round(img.naturalHeight * skala));

      const canvas = document.createElement('canvas');
      canvas.width = lebar;
      canvas.height = tinggi;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF'; // Latar putih untuk PNG transparan
      ctx.fillRect(0, 0, lebar, tinggi);
      ctx.drawImage(img, 0, 0, lebar, tinggi);

      const hasil = canvas.toDataURL('image/jpeg', kualitas);
      // Pakai hasil kompres hanya jika memang lebih kecil
      resolve(hasil.length < dataUrl.length ? hasil : dataUrl);
    };
    img.onerror = () => reject(new Error('File bukan gambar yang dapat dibaca browser'));
    img.src = dataUrl;
  });
}

// Memperkecil bertahap (ukuran & kualitas) sampai foto di bawah BATAS_FOTO_TERSIMPAN
async function perkecilSampaiAman(dataUrl, maksSisi) {
  let sisi = maksSisi;
  let kualitas = KUALITAS_JPEG;
  let hasil = await ubahUkuranDataUrl(dataUrl, sisi, kualitas);
  while (hasil.length > BATAS_FOTO_TERSIMPAN && sisi > 400) {
    sisi = Math.round(sisi * 0.8);
    kualitas = Math.max(0.6, kualitas - 0.05);
    hasil = await ubahUkuranDataUrl(dataUrl, sisi, kualitas);
  }
  return hasil;
}

async function kompresFileGambar(file, maksSisi) {
  const dataUrlAsli = await bacaFileSebagaiDataUrl(file);
  return perkecilSampaiAman(dataUrlAsli, maksSisi);
}

/**
 * Mengecilkan otomatis foto lama yang sudah terlanjur tersimpan dalam ukuran besar.
 * Ini membersihkan localStorage yang hampir penuh tanpa harus menekan Reset.
 */
async function rampingkanFotoTersimpan() {
  try {
    if (!localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {
    return;
  }
  // Pada mode cloud, hanya admin yang boleh mengubah data
  if (cloud.aktif && !sudahLoginAdmin()) return;

  const data = getDataUMKM();
  const perluDikecilkan = (src) =>
    typeof src === 'string' && src.startsWith('data:image') && src.length > BATAS_FOTO_TERSIMPAN;
  let adaPerubahan = false;

  if (perluDikecilkan(data.fotoHero)) {
    try {
      data.fotoHero = await perkecilSampaiAman(data.fotoHero, UKURAN_FOTO_HERO);
      adaPerubahan = true;
    } catch (e) {}
  }

  for (const item of (data.produk || [])) {
    if (perluDikecilkan(item.foto)) {
      try {
        item.foto = await perkecilSampaiAman(item.foto, UKURAN_FOTO_PRODUK);
        adaPerubahan = true;
      } catch (e) {}
    }
  }

  if (adaPerubahan && simpanDataUMKM(data)) {
    console.info("Foto lama yang terlalu besar sudah dikecilkan otomatis.");
    if (document.getElementById('pub-hero-title')) renderKontenPublik(data);

    // Segarkan formulir admin jika sedang terbuka
    const modalJendela2 = document.getElementById('modal-jendela-2');
    const formSedangTerbuka = document.getElementById('admin-container') ||
      (modalJendela2 && !modalJendela2.classList.contains('tersembunyi'));
    if (formSedangTerbuka) isiFormulirAdmin();
  }
}

/**
 * ==========================================================================
 * SINKRON CLOUD (FIREBASE FIRESTORE) — AGAR TAMPIL DI SEMUA PERANGKAT
 * ==========================================================================
 * localStorage hanya ada di SATU browser. Agar HP & laptop lain ikut berubah,
 * data juga disimpan ke Cloud Firestore, dan setiap halaman "mendengarkan"
 * perubahan dengan onSnapshot (real-time).
 *
 * Struktur database:
 *   umkm/{TOKO_ID}             → semua teks, warna, animasi, dan daftar produk
 *   umkm/{TOKO_ID}/foto/{id}   → foto hasil upload (1 dokumen per foto, karena
 *                                batas 1 dokumen Firestore adalah 1 MB)
 *
 * Jika firebase-config.js belum diisi, website otomatis memakai MODE LOKAL.
 * ==========================================================================
 */
const VERSI_FIREBASE = '10.12.2';

const cloud = {
  aktif: false,      // true jika berhasil terhubung ke Firestore
  siap: null,        // Promise proses persiapan cloud
  galat: '',         // pesan error jika gagal terhubung
  au: null,          // modul Firebase Auth
  fs: null,          // modul Firestore
  auth: null,
  db: null,
  fotoCloud: {},     // { hero: dataUrl, 'produk-1': dataUrl, ... }
  teksTerakhir: null,// dokumen teks terakhir dari cloud
  antrian: null,     // data yang menunggu dikirim ke cloud
  timer: null,
  sedangKirim: false
};

let timerBadgeSync = null;

function firebaseSudahDiisi() {
  return typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG &&
    Boolean(FIREBASE_CONFIG.apiKey) && Boolean(FIREBASE_CONFIG.projectId);
}

function emailAdmin() {
  return (typeof ADMIN_EMAIL !== 'undefined' && ADMIN_EMAIL) ? ADMIN_EMAIL.trim() : '';
}

function idToko() {
  return (typeof TOKO_ID !== 'undefined' && TOKO_ID) ? TOKO_ID : 'seblak-umkm';
}

function refToko() { return cloud.fs.doc(cloud.db, 'umkm', idToko()); }
function refKoleksiFoto() { return cloud.fs.collection(cloud.db, 'umkm', idToko(), 'foto'); }
function refFoto(kunci) { return cloud.fs.doc(cloud.db, 'umkm', idToko(), 'foto', kunci); }

// Batas waktu agar halaman tidak menunggu selamanya saat internet putus
function denganBatasWaktu(promise, ms, pesan) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(pesan)), ms))
  ]);
}

/**
 * Menyiapkan sumber data. Dipanggil sekali; hasilnya dipakai bersama.
 * Hasil Promise: true jika mode cloud aktif, false jika mode lokal.
 */
function siapkanSumberData() {
  if (cloud.siap) return cloud.siap;

  cloud.siap = (async () => {
    // Firebase belum diisi → pakai database data.json di GitHub (atau mode lokal jika tidak ada)
    if (!firebaseSudahDiisi()) return siapkanModeGithub();

    try {
      const url = (nama) => `https://www.gstatic.com/firebasejs/${VERSI_FIREBASE}/${nama}`;
      const [appMod, authMod, fsMod] = await denganBatasWaktu(Promise.all([
        import(url('firebase-app.js')),
        import(url('firebase-auth.js')),
        import(url('firebase-firestore.js'))
      ]), 20000, 'Pustaka Firebase tidak dapat dimuat. Periksa koneksi internet.');

      const app = appMod.initializeApp(FIREBASE_CONFIG);
      cloud.au = authMod;
      cloud.fs = fsMod;
      cloud.auth = authMod.getAuth(app);
      cloud.db = fsMod.getFirestore(app);

      // Login admin hanya berlaku selama tab browser terbuka (seperti sebelumnya)
      await authMod.setPersistence(cloud.auth, authMod.browserSessionPersistence);

      // Tunggu status login sebelumnya selesai dipulihkan
      await new Promise((resolve) => {
        let berhenti = null;
        let selesai = false;
        berhenti = authMod.onAuthStateChanged(cloud.auth, () => {
          if (selesai) return;
          selesai = true;
          resolve();
          setTimeout(() => berhenti && berhenti(), 0);
        });
      });

      // Ambil data awal dari cloud
      const [snapToko, snapFoto] = await denganBatasWaktu(Promise.all([
        fsMod.getDoc(refToko()),
        fsMod.getDocs(refKoleksiFoto())
      ]), 20000, 'Database Firestore tidak merespons.');

      snapFoto.forEach((d) => { cloud.fotoCloud[d.id] = d.data().dataUrl; });
      if (snapToko.exists()) terapkanDataDariCloud(snapToko.data());

      cloud.aktif = true;
      dengarkanPerubahanCloud();
      return true;
    } catch (e) {
      console.error('Gagal terhubung ke Firebase:', e);
      cloud.galat = (e && (e.code || e.message)) || String(e);
      return false;
    }
  })();

  return cloud.siap;
}

// Menggabungkan dokumen teks + dokumen foto menjadi data lengkap
function gabungkanFotoCloud(dataTeks) {
  const data = Object.assign(salinData(DEFAULT_DATA), salinData(dataTeks));
  delete data.diperbarui;

  const ambilFoto = (nilai, cadangan) => {
    if (typeof nilai === 'string' && nilai.startsWith('cloud:')) {
      return cloud.fotoCloud[nilai.slice(6)] || cadangan;
    }
    return nilai;
  };

  data.fotoHero = ambilFoto(data.fotoHero, DEFAULT_DATA.fotoHero);
  data.produk = (data.produk || []).map((p, i) => ({
    ...p,
    foto: ambilFoto(p.foto, (DEFAULT_DATA.produk[i] || DEFAULT_DATA.produk[0]).foto)
  }));
  return data;
}

// Menerapkan data dari cloud ke memori & cadangan localStorage
function terapkanDataDariCloud(dataTeks) {
  cloud.teksTerakhir = dataTeks;
  const data = gabungkanFotoCloud(dataTeks);
  dataMemori = salinData(data);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }
  return data;
}

// Mendengarkan perubahan dari perangkat lain secara real-time
function dengarkanPerubahanCloud() {
  const { onSnapshot } = cloud.fs;
  const adaKirimanTertunda = () => cloud.antrian !== null || cloud.sedangKirim;
  const tampilkan = (data) => {
    if (document.getElementById('pub-hero-title')) renderKontenPublik(data);
  };

  onSnapshot(refKoleksiFoto(), (snap) => {
    // Lewati "gema" dari perubahan yang dibuat perangkat ini sendiri
    if (snap.metadata.hasPendingWrites) return;
    const fotoBaru = {};
    snap.forEach((d) => { fotoBaru[d.id] = d.data().dataUrl; });
    cloud.fotoCloud = fotoBaru;
    if (cloud.teksTerakhir && !adaKirimanTertunda()) {
      tampilkan(terapkanDataDariCloud(cloud.teksTerakhir));
    }
  }, (e) => console.error('Gagal mendengarkan foto dari cloud:', e));

  onSnapshot(refToko(), (snap) => {
    if (snap.metadata.hasPendingWrites || !snap.exists()) return;
    if (adaKirimanTertunda()) {
      // Admin di perangkat ini masih mengetik: perubahan lokal yang akan menang
      cloud.teksTerakhir = snap.data();
      return;
    }
    tampilkan(terapkanDataDariCloud(snap.data()));
  }, (e) => console.error('Gagal mendengarkan data dari cloud:', e));
}

// Menunda pengiriman sebentar agar tidak mengirim ke cloud di setiap ketikan huruf
function jadwalkanSimpanCloud(data) {
  if (!cloud.aktif) return;
  if (!cloud.auth.currentUser) {
    aturBadgeSync('🔒 Masuk sebagai admin agar tersimpan ke cloud', 'gagal');
    return;
  }
  cloud.antrian = salinData(data);
  clearTimeout(cloud.timer);
  cloud.timer = setTimeout(kirimKeCloud, 700);
  aturBadgeSync('⏳ Menyinkronkan ke semua perangkat...', 'tersimpan');
}

async function kirimKeCloud() {
  if (cloud.sedangKirim) {
    cloud.timer = setTimeout(kirimKeCloud, 300);
    return;
  }
  const data = cloud.antrian;
  cloud.antrian = null;
  if (!data) return;

  cloud.sedangKirim = true;
  const { setDoc, deleteDoc, serverTimestamp } = cloud.fs;

  try {
    // Pisahkan foto Base64 ke dokumen tersendiri; di dokumen teks diganti "cloud:kunci"
    const dataTeks = salinData(data);
    const fotoBaru = [];
    const fotoDipakai = new Set();
    const pisahkanFoto = (kunci, nilai) => {
      if (typeof nilai === 'string' && nilai.startsWith('data:image')) {
        fotoDipakai.add(kunci);
        if (cloud.fotoCloud[kunci] !== nilai) fotoBaru.push([kunci, nilai]);
        return 'cloud:' + kunci;
      }
      return nilai;
    };
    dataTeks.fotoHero = pisahkanFoto('hero', dataTeks.fotoHero);
    dataTeks.produk = (dataTeks.produk || []).map((p) => ({ ...p, foto: pisahkanFoto('produk-' + p.id, p.foto) }));
    const fotoDihapus = Object.keys(cloud.fotoCloud).filter((k) => !fotoDipakai.has(k));

    // 1) Kirim foto lebih dulu, agar perangkat lain tidak sempat melihat foto kosong
    await Promise.all(fotoBaru.map(([kunci, url]) =>
      setDoc(refFoto(kunci), { dataUrl: url, diperbarui: serverTimestamp() })
    ));
    fotoBaru.forEach(([kunci, url]) => { cloud.fotoCloud[kunci] = url; });

    // 2) Kirim data teks
    await setDoc(refToko(), { ...dataTeks, diperbarui: serverTimestamp() });
    cloud.teksTerakhir = dataTeks;

    // 3) Hapus foto lama yang sudah tidak dipakai
    await Promise.all(fotoDihapus.map((kunci) => deleteDoc(refFoto(kunci))));
    fotoDihapus.forEach((kunci) => { delete cloud.fotoCloud[kunci]; });

    if (!cloud.antrian) aturBadgeSync('☁️ Tersimpan & tampil di semua perangkat', 'tersimpan', 1800);
  } catch (e) {
    console.error('Gagal menyimpan ke cloud:', e);
    const ditolak = e && (e.code === 'permission-denied' || /permission/i.test(String(e.message)));
    aturBadgeSync(
      ditolak ? '⚠️ Ditolak cloud: cek email admin & Rules Firestore' : '⚠️ Gagal sinkron cloud, mencoba lagi...',
      'gagal'
    );
    // Coba kirim ulang jika masalahnya koneksi (bukan karena izin)
    if (!ditolak && !cloud.antrian) {
      cloud.antrian = data;
      cloud.timer = setTimeout(kirimKeCloud, 5000);
    }
  } finally {
    cloud.sedangKirim = false;
  }
}

/**
 * ==========================================================================
 * MODE GITHUB — DATABASE BERUPA FILE data.json DI REPOSITORY
 * ==========================================================================
 * Cocok untuk website yang di-hosting di GitHub Pages tanpa layanan lain.
 * - Semua pengunjung membaca file data.json dari website (dicek berkala).
 * - Admin menekan "Simpan & Publikasikan" → Panel Kelola mengirim data.json
 *   dan foto (folder img/upload/) ke repository lewat GitHub API dalam 1 commit.
 * - GitHub Pages memperbarui website ±1 menit kemudian → semua perangkat ikut berubah.
 * Token GitHub hanya disimpan di browser perangkat admin (localStorage), tidak di kode.
 * ==========================================================================
 */
const GH_SETTING_KEY = 'seblak_github_setting';
const GH_DRAFT_KEY = 'seblak_ada_draft';
const INTERVAL_CEK_DATA_JSON = 15000; // Pengunjung mengecek data.json setiap 15 detik

const githubDb = {
  aktif: false,        // true jika data.json berhasil dibaca dari website
  sedangTerbit: false,
  timerDeploy: null
};

// Mengambil data.json terbaru dari website (tanpa cache)
async function ambilDataJson() {
  if (location.protocol === 'file:') return null;
  const res = await fetch(`data.json?v=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return (data && typeof data === 'object' && data.namaUsaha !== undefined) ? data : null;
}

// Versi data yang sedang dipakai di perangkat ini (-1 jika belum ada data sama sekali)
function versiLokal() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return Number(JSON.parse(s).versi) || 0;
  } catch (e) {}
  return dataMemori ? (Number(dataMemori.versi) || 0) : -1;
}

/**
 * Menerapkan data dari data.json HANYA jika lebih baru dari data di perangkat ini.
 * Dengan begitu draft admin yang belum dipublikasikan tidak tertimpa data lama.
 */
function terapkanDataGithub(remote, paksa = false) {
  const vRemote = Number(remote.versi) || 0;
  if (!paksa && vRemote <= versiLokal()) return null;
  const data = Object.assign(salinData(DEFAULT_DATA), remote);
  dataMemori = salinData(data);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  return data;
}

async function siapkanModeGithub() {
  try {
    const remote = await denganBatasWaktu(ambilDataJson(), 10000, 'data.json tidak merespons');
    if (!remote) return false;
    githubDb.aktif = true;
    terapkanDataGithub(remote);

    // Pantau data.json berkala & saat tab kembali dibuka
    const cek = async () => {
      if (document.hidden || githubDb.sedangTerbit) return;
      try {
        const terbaru = await ambilDataJson();
        const data = terbaru && terapkanDataGithub(terbaru);
        if (data && document.getElementById('pub-hero-title')) renderKontenPublik(data);
      } catch (e) {}
    };
    setInterval(cek, INTERVAL_CEK_DATA_JSON);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) cek(); });
    return true;
  } catch (e) {
    return false;
  }
}

// --- Pengaturan repository & token (disimpan di perangkat admin) ---
function tebakRepoDariAlamat() {
  const cocok = location.hostname.match(/^([a-z0-9-]+)\.github\.io$/i);
  if (!cocok) return { owner: '', repo: '', folder: '' };
  const owner = cocok[1];
  const segmen = location.pathname.split('/').filter(Boolean);
  if (segmen.length && segmen[segmen.length - 1].includes('.')) segmen.pop(); // buang index.html/admin.html
  if (!segmen.length) return { owner, repo: `${owner}.github.io`, folder: '' };
  return { owner, repo: segmen[0], folder: segmen.slice(1).join('/') };
}

function settingGithub() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(GH_SETTING_KEY)) || {}; } catch (e) {}
  const tebakan = tebakRepoDariAlamat();
  return {
    owner: s.owner || tebakan.owner,
    repo: s.repo || tebakan.repo,
    branch: s.branch || '',
    folder: (s.folder !== undefined ? s.folder : tebakan.folder) || '',
    token: s.token || ''
  };
}

function simpanSettingGithub(s) {
  try { localStorage.setItem(GH_SETTING_KEY, JSON.stringify(s)); } catch (e) {}
}

function adaDraftBelumTerbit() {
  try { return localStorage.getItem(GH_DRAFT_KEY) === '1'; } catch (e) { return false; }
}

function tandaiDraft(ada) {
  try {
    if (ada) localStorage.setItem(GH_DRAFT_KEY, '1');
    else localStorage.removeItem(GH_DRAFT_KEY);
  } catch (e) {}
}

// Hash sederhana (FNV-1a) untuk memberi nama file foto yang sama setiap kali isinya sama
function hashTeks(teks) {
  let h1 = 0x811c9dc5;
  let h2 = 0x9747b28c;
  for (let i = 0; i < teks.length; i++) {
    const c = teks.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619);
    h2 = Math.imul(h2 ^ c, 2246822519);
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

// Pemanggil GitHub REST API
async function ghApi(s, metode, jalur, isi) {
  const res = await fetch(`https://api.github.com/repos/${s.owner}/${s.repo}${jalur}`, {
    method: metode,
    headers: Object.assign({
      'Authorization': `Bearer ${s.token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }, isi ? { 'Content-Type': 'application/json' } : {}),
    body: isi ? JSON.stringify(isi) : undefined
  });
  if (!res.ok) {
    let pesan = '';
    try { pesan = (await res.json()).message || ''; } catch (e) {}
    const galat = new Error(`${res.status} ${pesan}`.trim());
    galat.status = res.status;
    throw galat;
  }
  return res.status === 204 ? null : res.json();
}

function pesanGalatGithub(e) {
  const status = e && e.status;
  if (status === 401) return 'Token salah atau sudah kedaluwarsa. Buat token baru di GitHub.';
  if (status === 403) return 'Token tidak punya izin "Contents: Read and write" untuk repository ini.';
  if (status === 404) return 'Repository/branch tidak ditemukan, atau token belum diberi akses ke repository ini.';
  if (status === 409) return 'Repository masih kosong. Upload file website ke GitHub terlebih dahulu.';
  if (status === 422) return 'Data ditolak GitHub (' + e.message + '). Coba publikasikan ulang.';
  return 'Tidak dapat menghubungi GitHub (' + ((e && e.message) || e) + '). Periksa koneksi internet.';
}

async function tesKoneksiGithub(s) {
  const info = await ghApi(s, 'GET', '');
  const branch = s.branch || info.default_branch;
  await ghApi(s, 'GET', `/git/ref/heads/${branch}`);
  // Uji izin tulis dengan membuat blob kecil (tidak mengubah isi repository)
  await ghApi(s, 'POST', '/git/blobs', { content: 'tes izin tulis', encoding: 'utf-8' });
  return { namaRepo: info.full_name, branch };
}

/**
 * Mengirim data.json + foto baru ke repository dalam SATU commit (Git Data API).
 * Foto Base64 diubah menjadi file img/upload/<kunci>-<hash>.jpg.
 * Mengembalikan versi data yang dipublikasikan.
 */
async function kirimKeGithub(s, data) {
  const info = await ghApi(s, 'GET', '');
  const branch = s.branch || info.default_branch;
  const awalan = s.folder ? s.folder.replace(/^\/+|\/+$/g, '') + '/' : '';

  const ref = await ghApi(s, 'GET', `/git/ref/heads/${branch}`);
  const commitInduk = await ghApi(s, 'GET', `/git/commits/${ref.object.sha}`);

  // Daftar foto upload yang sudah ada di repository
  let fotoAda = [];
  try {
    const isiFolder = await ghApi(s, 'GET', `/contents/${awalan}img/upload?ref=${encodeURIComponent(branch)}`);
    if (Array.isArray(isiFolder)) fotoAda = isiFolder.filter((f) => f.type === 'file').map((f) => f.path);
  } catch (e) {
    if (e.status !== 404) throw e; // 404 = folder belum ada (wajar saat pertama kali)
  }

  const entri = [];
  const fotoDipakai = new Set();

  const ubahFotoJadiFile = async (kunci, nilai) => {
    if (typeof nilai === 'string' && nilai.startsWith('data:image')) {
      const ekstensi = nilai.startsWith('data:image/png') ? 'png' : (nilai.startsWith('data:image/webp') ? 'webp' : 'jpg');
      const relatif = `img/upload/${kunci}-${hashTeks(nilai)}.${ekstensi}`;
      const penuh = awalan + relatif;
      fotoDipakai.add(penuh);
      if (!fotoAda.includes(penuh)) {
        const blob = await ghApi(s, 'POST', '/git/blobs', { content: nilai.split(',')[1], encoding: 'base64' });
        entri.push({ path: penuh, mode: '100644', type: 'blob', sha: blob.sha });
      }
      return relatif;
    }
    if (typeof nilai === 'string' && nilai.startsWith('img/upload/')) fotoDipakai.add(awalan + nilai);
    return nilai;
  };

  const terbit = salinData(data);
  terbit.versi = Number(terbit.versi) || Date.now();
  terbit.fotoHero = await ubahFotoJadiFile('hero', terbit.fotoHero);
  for (const p of (terbit.produk || [])) {
    p.foto = await ubahFotoJadiFile('produk-' + p.id, p.foto);
  }

  // Hapus foto upload lama yang sudah tidak dipakai
  fotoAda.filter((path) => !fotoDipakai.has(path)).forEach((path) => {
    entri.push({ path, mode: '100644', type: 'blob', sha: null });
  });

  // File database utama
  entri.push({ path: awalan + 'data.json', mode: '100644', type: 'blob', content: JSON.stringify(terbit, null, 2) + '\n' });

  const pohonBaru = await ghApi(s, 'POST', '/git/trees', { base_tree: commitInduk.tree.sha, tree: entri });
  const commitBaru = await ghApi(s, 'POST', '/git/commits', {
    message: `Perbarui konten website dari Panel Kelola (${new Date().toLocaleString('id-ID')})`,
    tree: pohonBaru.sha,
    parents: [ref.object.sha]
  });
  await ghApi(s, 'PATCH', `/git/refs/heads/${branch}`, { sha: commitBaru.sha });
  return terbit.versi;
}

// Dipanggil oleh tombol "Simpan & Publikasikan"
async function publikasikanKeGithub() {
  if (githubDb.sedangTerbit) return false;
  const s = settingGithub();
  if (!s.owner || !s.repo || !s.token) {
    bukaKartuGithub();
    alert("Isi dulu kartu \"🐙 Publikasi ke GitHub\" (pemilik repo, nama repo, dan token), lalu klik Simpan Pengaturan & Tes Koneksi.");
    return false;
  }

  githubDb.sedangTerbit = true;
  const tombolSimpan = document.getElementById('btn-simpan-semua');
  if (tombolSimpan) tombolSimpan.disabled = true;
  aturBadgeSync('🚀 Mengirim ke GitHub...', 'tersimpan');

  try {
    const data = getDataUMKM();
    let versi;
    try {
      versi = await kirimKeGithub(s, data);
    } catch (e) {
      // Branch berubah di tengah proses (misalnya ada commit lain) → coba sekali lagi
      if (e.status === 422 || e.status === 409) versi = await kirimKeGithub(s, data);
      else throw e;
    }
    tandaiDraft(false);
    perbaruiTeksAwalBadge();
    aturBadgeSync('⏳ Menunggu GitHub Pages memperbarui website (±1 menit)...', 'tersimpan');
    alert("✅ Berhasil dipublikasikan ke GitHub!\n\nSemua perangkat akan melihat perubahan dalam ±1 menit, setelah GitHub Pages selesai memperbarui website.");
    pantauHasilDeploy(versi);
    return true;
  } catch (e) {
    console.error('Gagal publikasi ke GitHub:', e);
    aturBadgeSync('⚠️ Gagal publikasi ke GitHub', 'gagal');
    alert("⚠️ Gagal publikasi ke GitHub.\n\n" + pesanGalatGithub(e));
    return false;
  } finally {
    githubDb.sedangTerbit = false;
    if (tombolSimpan) tombolSimpan.disabled = false;
  }
}

// Mengecek data.json di website sampai versi baru benar-benar tampil
function pantauHasilDeploy(versi) {
  clearInterval(githubDb.timerDeploy);
  let percobaan = 0;
  githubDb.timerDeploy = setInterval(async () => {
    percobaan++;
    try {
      const remote = await ambilDataJson();
      if (remote && Number(remote.versi) === Number(versi)) {
        clearInterval(githubDb.timerDeploy);
        githubDb.aktif = true;
        // Ganti foto Base64 di perangkat ini dengan path file (lebih hemat), jika belum ada edit baru
        if (versiLokal() === Number(versi)) terapkanDataGithub(remote, true);
        aturBadgeSync('🌐 Sudah tampil di semua perangkat!', 'tersimpan', 6000);
        return;
      }
    } catch (e) {}
    if (percobaan >= 60) { // ± 5 menit
      clearInterval(githubDb.timerDeploy);
      aturBadgeSync('⏳ GitHub Pages belum selesai. Cek tab "Actions" di repository.', 'gagal');
    }
  }, 5000);
}

// Unduh data.json untuk diupload manual ke GitHub (tanpa token)
function unduhDataJson() {
  const data = getDataUMKM();
  data.versi = Number(data.versi) || Date.now();
  const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// Kartu pengaturan GitHub di Panel Kelola (dibuat otomatis oleh JavaScript)
function pasangKartuGithub() {
  document.querySelectorAll('.kartu-github').forEach((el) => el.remove());
  if (cloud.aktif) return; // Mode Firebase tidak memerlukan kartu ini

  const s = settingGithub();
  const wadah = document.querySelector('.admin-wrapper');
  if (!wadah) return;

  const kartu = document.createElement('details');
  kartu.className = 'admin-card kartu-github';
  kartu.open = !s.token;
  kartu.innerHTML = `
    <summary class="admin-card-title">
      <span>🐙</span>
      <span>Publikasi ke GitHub (Database data.json)</span>
      <span class="kartu-github-status">${s.token ? '✅ Token tersimpan' : '⚠️ Belum diatur'}</span>
    </summary>
    <p class="kartu-github-info">
      Perubahan disimpan ke file <code>data.json</code> dan folder <code>img/upload/</code> di repository GitHub,
      lalu tampil di <strong>semua perangkat ±1 menit</strong> setelah tombol <strong>🚀 Simpan &amp; Publikasikan</strong> ditekan.
      Token hanya disimpan di browser perangkat ini. Jangan simpan token di komputer umum.
    </p>
    <div class="form-grid-3">
      <div class="form-group">
        <label class="form-label" for="gh-owner">Pemilik Repo (username GitHub)</label>
        <input type="text" id="gh-owner" class="form-input no-autosave" placeholder="contoh: ykinteraktif">
      </div>
      <div class="form-group">
        <label class="form-label" for="gh-repo">Nama Repository</label>
        <input type="text" id="gh-repo" class="form-input no-autosave" placeholder="contoh: seblak-umkm">
      </div>
      <div class="form-group">
        <label class="form-label" for="gh-branch">Branch (kosong = otomatis)</label>
        <input type="text" id="gh-branch" class="form-input no-autosave" placeholder="main">
      </div>
    </div>
    <div class="form-grid-2">
      <div class="form-group">
        <label class="form-label" for="gh-folder">Folder Website di Repo (kosong = paling luar)</label>
        <input type="text" id="gh-folder" class="form-input no-autosave" placeholder="contoh: seblak-umkm">
      </div>
      <div class="form-group">
        <label class="form-label" for="gh-token">Token GitHub (Fine-grained, Contents: Read and write)</label>
        <input type="password" id="gh-token" class="form-input no-autosave" placeholder="github_pat_..." autocomplete="off">
      </div>
    </div>
    <div class="kartu-github-aksi">
      <button type="button" class="btn btn-wa" id="btn-gh-tes" style="padding: 8px 18px; font-size: 0.88rem;">💾 Simpan Pengaturan &amp; Tes Koneksi</button>
      <button type="button" class="btn btn-outline" id="btn-gh-hapus" style="padding: 8px 18px; font-size: 0.88rem;">🗑️ Hapus Token dari Perangkat Ini</button>
      <button type="button" class="btn btn-outline" id="btn-gh-unduh" style="padding: 8px 18px; font-size: 0.88rem;">⬇️ Unduh data.json (upload manual)</button>
    </div>
    <div class="file-nama-info" id="gh-status" style="margin-top: 10px;"></div>
  `;
  wadah.prepend(kartu);

  setVal('gh-owner', s.owner);
  setVal('gh-repo', s.repo);
  setVal('gh-branch', s.branch);
  setVal('gh-folder', s.folder);
  setVal('gh-token', s.token);

  const tulisStatus = (teks, warna) => {
    const el = document.getElementById('gh-status');
    if (el) { el.textContent = teks; el.style.color = warna || ''; }
  };

  document.getElementById('btn-gh-tes').addEventListener('click', async () => {
    const baru = {
      owner: getVal('gh-owner'),
      repo: getVal('gh-repo'),
      branch: getVal('gh-branch'),
      folder: getVal('gh-folder').replace(/^\/+|\/+$/g, ''),
      token: getVal('gh-token')
    };
    simpanSettingGithub(baru);
    if (!baru.owner || !baru.repo || !baru.token) {
      tulisStatus('Lengkapi pemilik repo, nama repository, dan token.', '#B91C1C');
      return;
    }
    tulisStatus('⏳ Menguji koneksi ke GitHub...');
    try {
      const hasil = await tesKoneksiGithub(baru);
      tulisStatus(`✅ Terhubung ke ${hasil.namaRepo} (branch ${hasil.branch}). Token punya izin menulis. Siap dipublikasikan.`, '#15803D');
      const status = kartu.querySelector('.kartu-github-status');
      if (status) status.textContent = '✅ Token tersimpan';
      perbaruiTombolSimpan();
    } catch (e) {
      tulisStatus('❌ ' + pesanGalatGithub(e), '#B91C1C');
    }
  });

  document.getElementById('btn-gh-hapus').addEventListener('click', () => {
    const lama = settingGithub();
    simpanSettingGithub(Object.assign(lama, { token: '' }));
    setVal('gh-token', '');
    tulisStatus('Token dihapus dari perangkat ini.');
    const status = kartu.querySelector('.kartu-github-status');
    if (status) status.textContent = '⚠️ Belum diatur';
    perbaruiTombolSimpan();
  });

  document.getElementById('btn-gh-unduh').addEventListener('click', unduhDataJson);
}

function bukaKartuGithub() {
  const kartu = document.querySelector('.kartu-github');
  if (kartu) {
    kartu.open = true;
    kartu.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Label tombol Simpan menyesuaikan mode
function perbaruiTombolSimpan() {
  const tombol = document.getElementById('btn-simpan-semua');
  if (!tombol) return;
  if (!tombol.dataset.labelAwal) tombol.dataset.labelAwal = tombol.innerHTML;
  const modeGithub = !cloud.aktif && (githubDb.aktif || settingGithub().token);
  tombol.innerHTML = modeGithub ? '<span>🚀 Simpan &amp; Publikasikan ke GitHub</span>' : tombol.dataset.labelAwal;

  // Keterangan di bar aksi bawah panel ikut menyesuaikan mode
  document.querySelectorAll('.admin-actions-bar > div > span, .modal-jendela2-footer > div > span').forEach((el) => {
    if (!el.dataset.teksAwal) el.dataset.teksAwal = el.innerHTML;
    if (cloud.aktif) {
      el.textContent = 'Setiap perubahan otomatis tersimpan ke Firebase dan langsung tampil di semua perangkat.';
    } else if (modeGithub) {
      el.textContent = 'Perubahan tersimpan di perangkat ini. Tekan 🚀 Simpan & Publikasikan agar tampil di semua perangkat (±1 menit).';
    } else {
      el.innerHTML = el.dataset.teksAwal;
    }
  });
}

// Teks dasar badge status sesuai mode yang aktif
function perbaruiTeksAwalBadge() {
  const badge = document.getElementById('sync-status-badge');
  if (!badge) return;
  let teks = '💻 Mode Lokal: hanya perangkat ini';
  let gagal = true;
  if (cloud.aktif) {
    teks = '☁️ Sinkron ke Semua Perangkat';
    gagal = false;
  } else if (firebaseSudahDiisi()) {
    teks = '⚠️ Cloud gagal terhubung (mode lokal)';
  } else if (adaDraftBelumTerbit() && (githubDb.aktif || settingGithub().token)) {
    teks = '📝 Ada perubahan belum dipublikasikan';
  } else if (githubDb.aktif) {
    teks = '🌐 Database GitHub (data.json)';
    gagal = false;
  }
  badge.dataset.teksAwal = teks;
  badge.textContent = teks;
  badge.classList.remove('tersimpan', 'gagal');
  if (gagal) badge.classList.add('gagal');
}

// Dipanggil tombol "Simpan" di Panel Kelola
async function tombolSimpanDiklik() {
  if (!cloud.aktif && (githubDb.aktif || settingGithub().token)) {
    if (simpanPerubahanDariAdmin(false)) await publikasikanKeGithub();
    return;
  }
  simpanPerubahanDariAdmin(true);
}

// Status login admin
function sudahLoginAdmin() {
  if (cloud.aktif) return Boolean(cloud.auth.currentUser);
  return sessionStorage.getItem('seblak_admin_auth') === 'true';
}

// Memeriksa kata sandi: mode cloud memakai Firebase Auth, mode lokal memakai sandi di browser
async function verifikasiKataSandi(sandi) {
  await siapkanSumberData();

  if (cloud.aktif) {
    if (!emailAdmin()) {
      return { ok: false, pesan: 'ADMIN_EMAIL di firebase-config.js belum diisi.' };
    }
    try {
      await cloud.au.signInWithEmailAndPassword(cloud.auth, emailAdmin(), sandi);
      return { ok: true };
    } catch (e) {
      console.error('Login Firebase gagal:', e);
      const kode = e && e.code;
      if (kode === 'auth/network-request-failed') return { ok: false, pesan: 'Tidak ada koneksi internet.' };
      if (kode === 'auth/too-many-requests') return { ok: false, pesan: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' };
      return { ok: false, pesan: 'Kata sandi salah! Akses ditolak.' };
    }
  }

  return sandi === getKataSandiAdmin()
    ? { ok: true }
    : { ok: false, pesan: 'Kata sandi salah! Akses ditolak.' };
}

// Mengatur teks badge status sinkron (sementara jika durasiMs diisi)
function aturBadgeSync(teks, kelas = '', durasiMs = 0) {
  const badge = document.getElementById('sync-status-badge');
  if (!badge) return;
  if (!badge.dataset.teksAwal) badge.dataset.teksAwal = badge.textContent;

  clearTimeout(timerBadgeSync);
  badge.textContent = teks;
  badge.classList.remove('tersimpan', 'gagal');
  if (kelas) badge.classList.add(kelas);

  if (durasiMs) {
    timerBadgeSync = setTimeout(() => {
      badge.textContent = badge.dataset.teksAwal;
      badge.classList.remove('tersimpan', 'gagal');
    }, durasiMs);
  }
}

// Menyesuaikan tulisan di panel sesuai mode (Firebase / GitHub / lokal)
function sesuaikanTampilanMode() {
  perbaruiTeksAwalBadge();
  perbaruiTombolSimpan();

  if (cloud.aktif) {
    document.querySelectorAll('.login-hint').forEach((el) => {
      el.innerHTML = '💡 <strong>Mode cloud:</strong> gunakan kata sandi akun admin yang dibuat di Firebase Authentication.';
    });
    const kartuSandi = document.getElementById('btn-ganti-password');
    const keterangan = kartuSandi && kartuSandi.closest('.admin-card') && kartuSandi.closest('.admin-card').querySelector('p');
    if (keterangan) {
      keterangan.textContent = 'Mode cloud: kata sandi ini adalah kata sandi akun admin Firebase (minimal 6 karakter) dan berlaku di semua perangkat.';
    }
  }

  pasangKartuGithub();
  tampilkanCatatanSinkron();
}

// Catatan di Panel Kelola agar pengelola tahu ke mana perubahan disimpan
function tampilkanCatatanSinkron() {
  document.querySelectorAll('.catatan-sinkron').forEach((el) => el.remove());
  if (cloud.aktif || githubDb.aktif) return;

  let isi;
  if (firebaseSudahDiisi()) {
    isi = '<strong>⚠️ Tidak dapat terhubung ke Firebase</strong> (' + cloud.galat + '). ' +
      'Perubahan sementara hanya tersimpan di perangkat ini. Periksa koneksi internet dan isi firebase-config.js.';
  } else {
    isi = '<strong>💻 Mode lokal aktif.</strong> Perubahan hanya tersimpan di browser ini, ' +
      'sehingga HP atau laptop lain tetap melihat data lama. Agar tampil di <strong>semua perangkat</strong>, ' +
      'upload website ke GitHub lalu isi token di kartu <strong>🐙 Publikasi ke GitHub</strong> ' +
      '(atau aktifkan Firebase). Panduan lengkap ada di README.md.';

    // Firefox memperlakukan setiap file lokal (file://) sebagai origin terpisah,
    // sehingga admin.html dan index.html yang dibuka dengan klik dua kali tidak saling sinkron.
    if (location.protocol === 'file:' && /firefox/i.test(navigator.userAgent) && document.getElementById('admin-container')) {
      isi += '<br><strong>Firefox:</strong> admin.html yang dibuka langsung dari folder tidak bisa mengirim perubahan ke index.html. ' +
        'Gunakan tombol <strong>⚙️ Kelola Toko</strong> di halaman utama, atau jalankan lewat <em>Live Server</em> / GitHub Pages.';
    }
  }

  document.querySelectorAll('.admin-wrapper').forEach((wadah) => {
    const catatan = document.createElement('div');
    catatan.className = 'catatan-sinkron';
    catatan.innerHTML = isi;
    wadah.prepend(catatan);
  });
}

// Manajemen Kata Sandi Pengelola
function getKataSandiAdmin() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
}

function setKataSandiAdmin(baru) {
  localStorage.setItem(PASSWORD_KEY, baru);
}

// Bantuan Format Nomor WhatsApp
function bersihkanNomorWA(nomor) {
  if (!nomor) return NOMOR_WA_DEFAULT;
  let bersih = String(nomor).replace(/\D/g, '');
  if (bersih.startsWith('0')) {
    bersih = '62' + bersih.substring(1);
  }
  return bersih || NOMOR_WA_DEFAULT;
}

// Format Tautan WhatsApp Otomatis: https://wa.me/NOMOR_WA?text=PESAN
function buatLinkWA(nomor, pesan) {
  const nomorBersih = bersihkanNomorWA(nomor);
  const pesanEncoded = encodeURIComponent(pesan);
  return `https://wa.me/${nomorBersih}?text=${pesanEncoded}`;
}

// Penerapan Variabel Warna CSS ke :root
function terapkanTemaWarna(data) {
  const root = document.documentElement;
  if (data.warnaUtama) root.style.setProperty('--warna-utama', data.warnaUtama);
  if (data.warnaAksen) root.style.setProperty('--warna-aksen', data.warnaAksen);
  if (data.warnaLatar) root.style.setProperty('--warna-latar', data.warnaLatar);
  if (data.warnaHarga) root.style.setProperty('--warna-harga', data.warnaHarga);
}

// Penerapan Template Animasi Background Website
function terapkanAnimasiBackground(jenis) {
  const body = document.body;
  const container = document.getElementById('bg-animation-container');
  if (!body) return;

  const namaKelas = `anim-bg-${jenis || 'none'}`;

  // Jika jenis animasi tidak berubah, jangan buat ulang gelembungnya.
  // Tanpa ini, animasi latar "meloncat" setiap kali admin mengetik satu huruf.
  if (body.dataset.animAktif === namaKelas) return;
  body.dataset.animAktif = namaKelas;

  // Hapus kelas animasi sebelumnya
  body.classList.remove('anim-bg-none', 'anim-bg-bubbles', 'anim-bg-gradient', 'anim-bg-pulse');
  body.classList.add(namaKelas);

  if (container) {
    container.innerHTML = '';
    // Jika animasi partikel pedas aktif, tambahkan gelembung dinamis
    if (jenis === 'bubbles') {
      const jumlahGelembung = 14;
      for (let i = 0; i < jumlahGelembung; i++) {
        const bubble = document.createElement('span');
        bubble.className = 'spicy-bubble';
        const ukuran = Math.floor(Math.random() * 32) + 16; // 16px - 48px
        const posisiKiri = Math.floor(Math.random() * 96);   // 0% - 96%
        const durasi = (Math.random() * 8 + 6).toFixed(1);   // 6s - 14s
        const jeda = (Math.random() * 6).toFixed(1);          // 0s - 6s

        bubble.style.width = `${ukuran}px`;
        bubble.style.height = `${ukuran}px`;
        bubble.style.left = `${posisiKiri}%`;
        bubble.style.animationDuration = `${durasi}s`;
        bubble.style.animationDelay = `${jeda}s`;
        container.appendChild(bubble);
      }
    }
  }
}

// Helper untuk membaca & mengisi nilai elemen form
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = (val !== undefined && val !== null) ? val : '';
}

/**
 * ==========================================================================
 * LOGIKA JENDELA 1: HALAMAN PUBLIK (index.html)
 * ==========================================================================
 */
function renderKontenPublik(data) {
  // 1. Terapkan Tema Warna & Animasi Latar
  terapkanTemaWarna(data);
  terapkanAnimasiBackground(data.animasiBg || 'bubbles');

  // 2. Judul Tab Dokumen Browser
  if (data.namaUsaha && data.slogan) {
    document.title = `${data.namaUsaha} - ${data.slogan}`;
  }

  // 3. Header & Logo Teks
  const elemLogo = document.getElementById('pub-logo-nama');
  if (elemLogo) elemLogo.textContent = data.namaUsaha;

  // 4. Bagian Beranda (Hero Section)
  const elemLabel = document.getElementById('pub-hero-label');
  const elemJudul = document.getElementById('pub-hero-title');
  const elemSlogan = document.getElementById('pub-hero-slogan');
  const elemPemilik = document.getElementById('pub-hero-pemilik');
  const elemBerdiri = document.getElementById('pub-hero-berdiri');
  const elemKaryawan = document.getElementById('pub-hero-karyawan');
  const elemFotoHero = document.getElementById('pub-hero-img');
  const btnHeroWa = document.getElementById('pub-btn-hero-wa');

  if (elemLabel) elemLabel.textContent = `🔥 ${data.labelKecil}`;
  if (elemJudul) elemJudul.textContent = data.namaUsaha;
  if (elemSlogan) elemSlogan.textContent = data.slogan;
  if (elemPemilik) elemPemilik.textContent = data.pemilik;
  if (elemBerdiri) elemBerdiri.textContent = data.tahunBerdiri;
  if (elemKaryawan) elemKaryawan.textContent = data.karyawan;

  if (elemFotoHero) {
    elemFotoHero.src = data.fotoHero;
    elemFotoHero.alt = `Sajian khas ${data.namaUsaha}`;
  }

  if (btnHeroWa) {
    const pesanHero = `Halo ${data.namaUsaha}, saya ingin bertanya tentang menu seblak prasmanan hari ini.`;
    btnHeroWa.href = buatLinkWA(data.noWa, pesanHero);
  }

  // 5. 3 Fakta Singkat
  const elemFakta1 = document.getElementById('pub-fakta-1');
  const elemFakta2 = document.getElementById('pub-fakta-2');
  const elemFakta3 = document.getElementById('pub-fakta-3');
  if (elemFakta1) elemFakta1.textContent = data.fakta1;
  if (elemFakta2) elemFakta2.textContent = data.fakta2;
  if (elemFakta3) elemFakta3.textContent = data.fakta3;

  // 6. Bagian Tentang Usaha & 3 Keunggulan
  const elemTentangNama = document.getElementById('pub-tentang-nama');
  const elemCerita = document.getElementById('pub-cerita-teks');
  const elemKeunggulan1 = document.getElementById('pub-keunggulan-1');
  const elemKeunggulan2 = document.getElementById('pub-keunggulan-2');
  const elemKeunggulan3 = document.getElementById('pub-keunggulan-3');

  if (elemTentangNama) elemTentangNama.textContent = `Tentang ${data.namaUsaha}`;
  if (elemCerita) elemCerita.textContent = data.cerita;
  if (elemKeunggulan1) elemKeunggulan1.textContent = data.keunggulan1;
  if (elemKeunggulan2) elemKeunggulan2.textContent = data.keunggulan2;
  if (elemKeunggulan3) elemKeunggulan3.textContent = data.keunggulan3;

  // 7. Katalog 6 Produk Seblak (Kartu Semantik)
  const containerProduk = document.getElementById('pub-produk-container');
  if (containerProduk && data.produk) {
    containerProduk.innerHTML = '';
    data.produk.forEach((item) => {
      const pesanWA = `Halo ${data.namaUsaha}, saya ingin memesan menu: ${item.nama} (${item.porsi}) - ${item.harga}.`;
      const linkWA = buatLinkWA(data.noWa, pesanWA);

      const kartu = document.createElement('article');
      kartu.className = 'produk-card';
      kartu.innerHTML = `
        <div class="produk-img-wrapper">
          <img 
            src="${item.foto}" 
            alt="Foto menu ${item.nama}" 
            class="produk-img" 
            onerror="this.src='img/seblak-1.jpg'"
          >
          <span class="produk-badge-porsi">${item.porsi}</span>
        </div>
        <div class="produk-body">
          <h3 class="produk-nama">${item.nama}</h3>
          <p class="produk-deskripsi">${item.deskripsi}</p>
          <div class="produk-footer">
            <span class="produk-harga">${item.harga}</span>
            <a href="${linkWA}" target="_blank" rel="noopener noreferrer" class="btn-pesan-produk">
              <span>Pesan</span>
              <span>💬</span>
            </a>
          </div>
        </div>
      `;
      containerProduk.appendChild(kartu);
    });
  }

  // 8. Kontak dan Lokasi
  const elemAlamat = document.getElementById('pub-kontak-alamat');
  const elemWaTampil = document.getElementById('pub-kontak-wa-tampil');
  const btnChatWa = document.getElementById('pub-btn-chat-wa');
  const elemJamBuka = document.getElementById('pub-kontak-jam');
  const elemMedsos = document.getElementById('pub-kontak-medsos');
  const btnMaps = document.getElementById('pub-btn-maps');
  const btnFloatWa = document.getElementById('pub-float-wa');

  if (elemAlamat) elemAlamat.textContent = data.alamat;
  if (elemWaTampil) elemWaTampil.textContent = data.noWaTampil;
  if (btnChatWa) {
    const pesanChat = `Halo ${data.namaUsaha}, saya ingin tanya lokasi dan menu seblak.`;
    btnChatWa.href = buatLinkWA(data.noWa, pesanChat);
  }
  if (elemJamBuka) elemJamBuka.textContent = data.jamBuka;
  if (elemMedsos) elemMedsos.textContent = data.medsos;
  if (btnMaps) btnMaps.href = data.linkMaps || 'https://maps.google.com';
  if (btnFloatWa) {
    const pesanFloat = `Halo ${data.namaUsaha}, saya ingin memesan seblak sekarang.`;
    btnFloatWa.href = buatLinkWA(data.noWa, pesanFloat);
  }

  // 9. Footer
  const elemFooterTahun = document.getElementById('pub-footer-tahun');
  const elemFooterNamaUsaha = document.getElementById('pub-footer-nama-usaha');
  const elemFooterKelompok = document.getElementById('pub-footer-kelompok');

  if (elemFooterTahun) elemFooterTahun.textContent = new Date().getFullYear();
  if (elemFooterNamaUsaha) elemFooterNamaUsaha.textContent = data.namaUsaha;
  if (elemFooterKelompok) elemFooterKelompok.textContent = data.namaKelompok || "Siswa SMK PGRI Singosari";
}

// Inisialisasi awal Halaman Publik
function inisialisasiHalamanPublik() {
  const data = getDataUMKM();
  renderKontenPublik(data);

  // Toggle Navigasi Menu Responsif di Layar HP
  const navToggle = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('nav-menu-list');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('buka');
      navToggle.textContent = navMenu.classList.contains('buka') ? '✕ Tutup' : '☰ Menu';
    });

    // Otomatis menutup menu setelah salah satu link diklik
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('buka');
        navToggle.textContent = '☰ Menu';
      });
    });
  }

  // Multi-layer Sinkronisasi Real-Time (Jendela 1 langsung berubah saat Jendela 2 disimpan)
  if (syncChannel) {
    syncChannel.onmessage = (e) => {
      if (e.data && e.data.data) {
        renderKontenPublik(e.data.data);
      } else {
        renderKontenPublik(getDataUMKM());
      }
    };
  }

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      renderKontenPublik(getDataUMKM());
    }
  });

  window.addEventListener('focus', () => {
    renderKontenPublik(getDataUMKM());
  });

  // Fallback Polling jika dibuka lewat protokol file://
  let snapshotTerakhir = localStorage.getItem(STORAGE_KEY) || '';
  setInterval(() => {
    const snapshotSekarang = localStorage.getItem(STORAGE_KEY) || '';
    if (snapshotSekarang !== snapshotTerakhir) {
      snapshotTerakhir = snapshotSekarang;
      renderKontenPublik(getDataUMKM());
    }
  }, 500);

  // Hubungkan ke cloud (jika firebase-config.js sudah diisi).
  // Tampilan di atas muncul dulu dari data lokal, lalu diganti data dari cloud.
  siapkanSumberData().then((aktif) => {
    if (aktif) renderKontenPublik(getDataUMKM());
    sesuaikanTampilanMode();
    rampingkanFotoTersimpan();
  });
}

/**
 * ==========================================================================
 * LOGIKA JENDELA 2: PANEL ADMIN & FORMULIR LENGKAP
 * ==========================================================================
 */

// Membuka modal Jendela 2 di dalam index.html
async function bukaJendela2() {
  const modalLoginAdmin = document.getElementById('modal-login-admin');
  const modalJendela2 = document.getElementById('modal-jendela-2');
  const inputPass = document.getElementById('input-pass-admin-modal');
  const pesanError = document.getElementById('login-admin-error');

  // Pastikan koneksi cloud (jika ada) sudah siap sebelum memeriksa status login
  await siapkanSumberData();

  if (sudahLoginAdmin()) {
    if (modalLoginAdmin) modalLoginAdmin.classList.add('tersembunyi');
    if (modalJendela2) {
      modalJendela2.classList.remove('tersembunyi');
      isiFormulirAdmin();
    }
  } else {
    if (pesanError) pesanError.style.display = 'none';
    if (inputPass) {
      inputPass.value = '';
      setTimeout(() => inputPass.focus(), 100);
    }
    if (modalLoginAdmin) modalLoginAdmin.classList.remove('tersembunyi');
  }
}

function tutupModalAdminLogin() {
  const modalLoginAdmin = document.getElementById('modal-login-admin');
  if (modalLoginAdmin) modalLoginAdmin.classList.add('tersembunyi');
}

async function prosesLoginAdmin() {
  const inputPass = document.getElementById('input-pass-admin-modal');
  const pesanError = document.getElementById('login-admin-error');
  const tombol = document.getElementById('btn-submit-admin-login');
  const sandiInput = inputPass ? inputPass.value.trim() : '';

  if (tombol) tombol.disabled = true;
  const hasil = await verifikasiKataSandi(sandiInput);
  if (tombol) tombol.disabled = false;

  if (hasil.ok) {
    sessionStorage.setItem('seblak_admin_auth', 'true');
    tutupModalAdminLogin();
    const modalJendela2 = document.getElementById('modal-jendela-2');
    if (modalJendela2) {
      modalJendela2.classList.remove('tersembunyi');
      isiFormulirAdmin();
    }
  } else {
    if (pesanError) {
      pesanError.textContent = hasil.pesan;
      pesanError.style.display = 'block';
    }
    if (inputPass) {
      inputPass.value = '';
      inputPass.focus();
    }
  }
}

function tutupJendela2() {
  const modalJendela2 = document.getElementById('modal-jendela-2');
  if (modalJendela2) modalJendela2.classList.add('tersembunyi');
  renderKontenPublik(getDataUMKM());
}

/**
 * Membaca file gambar dari laptop, MENGECILKANNYA dulu, lalu mengubahnya ke Base64.
 * Disimpan langsung ke input URL & preview thumbnail.
 */
async function prosesPilihFileFoto(inputElement, idInputUrl, idPreview) {
  if (!inputElement.files || !inputElement.files[0]) return;
  const file = inputElement.files[0];
  inputElement.value = ''; // Agar file yang sama bisa dipilih ulang

  if (file.type && !file.type.startsWith('image/')) {
    alert("File yang dipilih bukan gambar. Gunakan format JPG, PNG, atau WEBP.");
    return;
  }

  // Foto akan dikecilkan otomatis, jadi batasnya bisa lebih longgar dari sebelumnya
  if (file.size > BATAS_UKURAN_FILE_MB * 1024 * 1024) {
    alert(`Ukuran file foto terlalu besar (maksimal ${BATAS_UKURAN_FILE_MB} MB). Silakan pilih foto lain.`);
    return;
  }

  const inputUrl = document.getElementById(idInputUrl);
  const imgPreview = document.getElementById(idPreview);
  const fotoLama = inputUrl ? inputUrl.value : '';
  const maksSisi = idInputUrl === 'adm-foto-hero' ? UKURAN_FOTO_HERO : UKURAN_FOTO_PRODUK;

  let dataUrl;
  try {
    dataUrl = await kompresFileGambar(file, maksSisi);
  } catch (e) {
    alert("Foto tidak dapat dibaca browser. Gunakan format JPG, PNG, atau WEBP.");
    return;
  }

  if (inputUrl) inputUrl.value = dataUrl;
  if (imgPreview) imgPreview.src = dataUrl;

  // Simpan otomatis ke localStorage
  const berhasil = simpanPerubahanDariAdmin(false, false);

  if (!berhasil) {
    // Kembalikan ke foto lama. Jika tidak, foto yang gagal ini akan ikut terbawa
    // di setiap penyimpanan berikutnya sehingga SEMUA perubahan lain ikut gagal.
    if (inputUrl) inputUrl.value = fotoLama;
    if (imgPreview) imgPreview.src = fotoLama;
    alert(
      "⚠️ Foto gagal disimpan karena penyimpanan browser sudah penuh.\n\n" +
      "Coba foto lain yang lebih kecil, atau isi path foto dari folder img/ (contoh: img/seblak-2.jpg)."
    );
  }
}

// Mengisi data yang ada ke seluruh kolom formulir Admin
function isiFormulirAdmin() {
  const data = getDataUMKM();

  // 1. Identitas Usaha & Teks Beranda
  setVal('adm-nama-usaha', data.namaUsaha);
  setVal('adm-label-kecil', data.labelKecil);
  setVal('adm-slogan', data.slogan);
  setVal('adm-pemilik', data.pemilik);
  setVal('adm-tahun-berdiri', data.tahunBerdiri);
  setVal('adm-karyawan', data.karyawan);
  setVal('adm-foto-hero', data.fotoHero);
  setVal('adm-alamat', data.alamat);
  setVal('adm-no-wa-tampil', data.noWaTampil);
  setVal('adm-no-wa', data.noWa);
  setVal('adm-jam-buka', data.jamBuka);
  setVal('adm-medsos', data.medsos);
  setVal('adm-link-maps', data.linkMaps);
  setVal('adm-nama-kelompok', data.namaKelompok);

  const previewHero = document.getElementById('preview-foto-hero');
  if (previewHero) previewHero.src = data.fotoHero;

  // 2. Fakta Singkat & Cerita Usaha
  setVal('adm-fakta-1', data.fakta1);
  setVal('adm-fakta-2', data.fakta2);
  setVal('adm-fakta-3', data.fakta3);
  setVal('adm-cerita', data.cerita);
  setVal('adm-keunggulan-1', data.keunggulan1);
  setVal('adm-keunggulan-2', data.keunggulan2);
  setVal('adm-keunggulan-3', data.keunggulan3);

  // 3. Tema Warna & Animasi Latar Belakang
  setVal('adm-warna-utama', data.warnaUtama);
  setVal('adm-warna-aksen', data.warnaAksen);
  setVal('adm-warna-latar', data.warnaLatar);
  setVal('adm-warna-harga', data.warnaHarga);
  setVal('adm-animasi-bg', data.animasiBg || 'bubbles');

  terapkanTemaWarna(data);
  terapkanAnimasiBackground(data.animasiBg || 'bubbles');

  // 4. Katalog 6 Menu Seblak
  const containerFormProduk = document.getElementById('admin-form-produk-container');
  if (containerFormProduk && data.produk) {
    containerFormProduk.innerHTML = '';
    data.produk.forEach((item, index) => {
      const formCard = document.createElement('div');
      formCard.className = 'admin-produk-card';
      formCard.innerHTML = `
        <div class="admin-produk-header">
          <span>📦 Produk #${index + 1}: ${item.nama}</span>
          <span style="font-size: 0.8rem; color: #64748B;">ID: ${item.id}</span>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Nama Menu Seblak</label>
            <input type="text" class="form-input auto-sync-input" id="adm-prod-nama-${index}" value="${item.nama}">
          </div>
          <div class="form-group">
            <label class="form-label">Berat / Porsi</label>
            <input type="text" class="form-input auto-sync-input" id="adm-prod-porsi-${index}" value="${item.porsi}">
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Harga (Contoh: Rp 15.000)</label>
            <input type="text" class="form-input auto-sync-input" id="adm-prod-harga-${index}" value="${item.harga}">
          </div>
          <div class="form-group">
            <label class="form-label">URL / Path Foto Produk</label>
            <input type="text" class="form-input auto-sync-input" id="adm-prod-foto-${index}" value="${item.foto}">
          </div>
        </div>
        
        <!-- Pilihan File Foto Langsung dari Laptop -->
        <div class="form-group">
          <label class="form-label">Pilih Foto dari Laptop (Langsung Ganti Foto Produk)</label>
          <div class="file-upload-box">
            <img src="${item.foto}" id="preview-prod-${index}" alt="Preview" class="file-preview-thumb" onerror="this.src='img/seblak-1.jpg'">
            <div class="file-upload-controls">
              <label class="btn-file-pilih" for="file-prod-${index}">
                📁 Pilih Berkas Foto...
              </label>
              <input type="file" id="file-prod-${index}" accept="image/*" onchange="prosesPilihFileFoto(this, 'adm-prod-foto-${index}', 'preview-prod-${index}')">
              <div class="file-nama-info">Format: JPG, PNG, WEBP. Otomatis tersimpan ke browser.</div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Deskripsi Produk (Maks. 25 kata)</label>
          <textarea class="form-textarea auto-sync-input" id="adm-prod-desc-${index}">${item.deskripsi}</textarea>
        </div>
      `;
      containerFormProduk.appendChild(formCard);
    });

    // Pasang auto-sync pada input ketikan katalog produk
    const inputsProduk = containerFormProduk.querySelectorAll('.auto-sync-input');
    inputsProduk.forEach(inp => {
      inp.addEventListener('input', () => simpanPerubahanDariAdmin(false));
    });
  }
}

// Menyimpan seluruh formulir Admin (ke localStorage, dan ke cloud jika aktif)
// Mengembalikan true jika tersimpan, false jika gagal
function simpanPerubahanDariAdmin(denganAlert = false, peringatkanJikaGagal = true) {
  const data = getDataUMKM();

  // Helper membaca input jika elemen ada
  const bacaInput = (id, defaultVal) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : defaultVal;
  };

  // 1. Identitas Usaha & Beranda
  data.namaUsaha = bacaInput('adm-nama-usaha', data.namaUsaha);
  data.labelKecil = bacaInput('adm-label-kecil', data.labelKecil);
  data.slogan = bacaInput('adm-slogan', data.slogan);
  data.pemilik = bacaInput('adm-pemilik', data.pemilik);
  data.tahunBerdiri = bacaInput('adm-tahun-berdiri', data.tahunBerdiri);
  data.karyawan = bacaInput('adm-karyawan', data.karyawan);
  data.fotoHero = bacaInput('adm-foto-hero', data.fotoHero);
  data.alamat = bacaInput('adm-alamat', data.alamat);
  data.noWaTampil = bacaInput('adm-no-wa-tampil', data.noWaTampil);
  data.noWa = bersihkanNomorWA(bacaInput('adm-no-wa', data.noWa));
  data.jamBuka = bacaInput('adm-jam-buka', data.jamBuka);
  data.medsos = bacaInput('adm-medsos', data.medsos);
  data.linkMaps = bacaInput('adm-link-maps', data.linkMaps);
  data.namaKelompok = bacaInput('adm-nama-kelompok', data.namaKelompok);

  // 2. Fakta Singkat & Cerita Usaha
  data.fakta1 = bacaInput('adm-fakta-1', data.fakta1);
  data.fakta2 = bacaInput('adm-fakta-2', data.fakta2);
  data.fakta3 = bacaInput('adm-fakta-3', data.fakta3);
  data.cerita = bacaInput('adm-cerita', data.cerita);
  data.keunggulan1 = bacaInput('adm-keunggulan-1', data.keunggulan1);
  data.keunggulan2 = bacaInput('adm-keunggulan-2', data.keunggulan2);
  data.keunggulan3 = bacaInput('adm-keunggulan-3', data.keunggulan3);

  // 3. Tema Warna & Animasi Latar Belakang
  data.warnaUtama = bacaInput('adm-warna-utama', data.warnaUtama);
  data.warnaAksen = bacaInput('adm-warna-aksen', data.warnaAksen);
  data.warnaLatar = bacaInput('adm-warna-latar', data.warnaLatar);
  data.warnaHarga = bacaInput('adm-warna-harga', data.warnaHarga);
  data.animasiBg = bacaInput('adm-animasi-bg', data.animasiBg || 'bubbles');

  // 4. Katalog 6 Produk
  data.produk = data.produk.map((item, index) => {
    return {
      id: item.id,
      nama: bacaInput(`adm-prod-nama-${index}`, item.nama),
      porsi: bacaInput(`adm-prod-porsi-${index}`, item.porsi),
      harga: bacaInput(`adm-prod-harga-${index}`, item.harga),
      deskripsi: bacaInput(`adm-prod-desc-${index}`, item.deskripsi),
      foto: bacaInput(`adm-prod-foto-${index}`, item.foto)
    };
  });

  // Versi = waktu perubahan. Dipakai mode GitHub agar data.json lama tidak menimpa draft terbaru
  data.versi = Date.now();

  // Simpan (localStorage + cloud jika aktif)
  const berhasil = simpanDataUMKM(data);

  // Badge status: tampilkan hasil yang SEBENARNYA (berhasil / gagal)
  if (!berhasil) {
    aturBadgeSync("⚠️ Gagal Tersimpan: Penyimpanan Penuh", 'gagal');
    if (peringatkanJikaGagal) tampilkanPeringatanPenyimpananPenuh(denganAlert);
    return false;
  }

  peringatanPenuhSudahTampil = false;
  terapkanTemaWarna(data);
  terapkanAnimasiBackground(data.animasiBg);

  // Jika sedang di index.html, update DOM halaman utama seketika!
  if (document.getElementById('pub-hero-title')) {
    renderKontenPublik(data);
  }

  // Pada mode cloud, badge diatur oleh proses kirim ke cloud (⏳ → ☁️)
  if (!cloud.aktif) {
    // Mode GitHub: tandai ada draft yang belum dipublikasikan
    if (githubDb.aktif || settingGithub().token) {
      tandaiDraft(true);
      perbaruiTeksAwalBadge();
    }
    aturBadgeSync("⚡ Tersimpan di perangkat ini", 'tersimpan', 1200);
  }

  if (denganAlert) {
    alert(cloud.aktif
      ? "✅ Berhasil! Perubahan disimpan dan sedang dikirim ke semua perangkat (lihat status di bagian atas panel)."
      : "✅ Tersimpan di perangkat ini.\n\nCatatan: mode lokal aktif, jadi perubahan belum tampil di HP/laptop lain. Isi firebase-config.js agar tampil di semua perangkat.");
  }
  return true;
}

// Reset data ke pengaturan awal (default)
function resetKeDataDefault() {
  const yakin = confirm("Apakah Anda yakin ingin mengembalikan seluruh data dan tampilan ke pengaturan default awal?");
  if (yakin) {
    const dataAwal = salinData(DEFAULT_DATA);
    dataAwal.versi = Date.now();
    simpanDataUMKM(dataAwal);
    peringatanPenuhSudahTampil = false;
    if (!cloud.aktif && (githubDb.aktif || settingGithub().token)) {
      tandaiDraft(true);
      perbaruiTeksAwalBadge();
    }
    // Kata sandi akun Firebase tidak bisa direset dari sini (hanya mode lokal)
    if (!cloud.aktif) setKataSandiAdmin(DEFAULT_PASSWORD);
    isiFormulirAdmin();
    terapkanTemaWarna(dataAwal);
    terapkanAnimasiBackground(dataAwal.animasiBg);

    if (document.getElementById('pub-hero-title')) {
      renderKontenPublik(dataAwal);
    }
    alert(cloud.aktif
      ? "🔄 Seluruh data berhasil direset ke pengaturan awal di semua perangkat. Kata sandi admin Firebase tidak berubah."
      : "🔄 Seluruh data berhasil direset ke pengaturan awal! Kata sandi dikembalikan ke 'makansantai'.");
  }
}

// Fitur Mengubah Kata Sandi Admin
async function ubahKataSandiAdmin() {
  const sandiLama = getVal('adm-pass-lama');
  const sandiBaru = getVal('adm-pass-baru');
  const sandiKonfirmasi = getVal('adm-pass-konfirmasi');
  const sandiSekarang = getKataSandiAdmin();

  if (!sandiLama || !sandiBaru || !sandiKonfirmasi) {
    alert("Harap isi semua kolom untuk mengganti kata sandi.");
    return;
  }

  // Mode cloud: kata sandi = kata sandi akun admin di Firebase Authentication
  if (cloud.aktif) {
    if (sandiBaru.length < 6) {
      alert("Kata sandi baru minimal 6 karakter (aturan Firebase).");
      return;
    }
    if (sandiBaru !== sandiKonfirmasi) {
      alert("Kata sandi baru dan konfirmasi tidak cocok!");
      return;
    }
    const pengguna = cloud.auth.currentUser;
    if (!pengguna) {
      alert("Sesi admin berakhir. Silakan masuk ulang.");
      return;
    }
    try {
      const kredensial = cloud.au.EmailAuthProvider.credential(pengguna.email, sandiLama);
      await cloud.au.reauthenticateWithCredential(pengguna, kredensial);
      await cloud.au.updatePassword(pengguna, sandiBaru);
      setVal('adm-pass-lama', '');
      setVal('adm-pass-baru', '');
      setVal('adm-pass-konfirmasi', '');
      alert("🎉 Kata sandi admin berhasil diperbarui untuk semua perangkat!");
    } catch (e) {
      console.error('Gagal mengganti kata sandi:', e);
      const sandiSalah = e && ['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(e.code);
      alert(sandiSalah
        ? "Kata sandi lama salah! Perubahan kata sandi dibatalkan."
        : "Gagal mengganti kata sandi: " + ((e && (e.code || e.message)) || e));
    }
    return;
  }

  if (sandiLama !== sandiSekarang) {
    alert("Kata sandi lama salah! Perubahan kata sandi dibatalkan.");
    return;
  }

  if (sandiBaru.length < 4) {
    alert("Kata sandi baru terlalu pendek (minimal 4 karakter).");
    return;
  }

  if (sandiBaru !== sandiKonfirmasi) {
    alert("Kata sandi baru dan konfirmasi tidak cocok!");
    return;
  }

  setKataSandiAdmin(sandiBaru);
  setVal('adm-pass-lama', '');
  setVal('adm-pass-baru', '');
  setVal('adm-pass-konfirmasi', '');
  alert("🎉 Kata sandi admin berhasil diperbarui! Silakan gunakan kata sandi baru untuk login berikutnya.");
}

// Memasang auto-save ketika ada ketikan di form admin
function pasangAutoSaveDanListenerWarna() {
  const formContainers = document.querySelectorAll('.admin-wrapper');
  formContainers.forEach(container => {
    container.addEventListener('input', (e) => {
      // Input file tidak ikut di sini karena sudah diproses oleh prosesPilihFileFoto()
      // Isian berkelas .no-autosave (pengaturan GitHub) juga tidak memicu simpan data
      if (e.target.matches('input:not([type="password"]):not([type="file"]):not(.no-autosave), textarea')) {
        simpanPerubahanDariAdmin(false);
      }
    });

    container.addEventListener('change', (e) => {
      if (e.target.matches('input[type="color"], select')) {
        simpanPerubahanDariAdmin(false);
      }
    });
  });
}

/**
 * ==========================================================================
 * LOGIKA STANDALONE admin.html
 * ==========================================================================
 */

function inisialisasiHalamanAdmin() {
  const modalOverlay = document.getElementById('login-modal-overlay');
  const inputSandi = document.getElementById('input-password-admin');
  const btnMasuk = document.getElementById('btn-masuk-admin');
  const pesanError = document.getElementById('login-error-pesan');
  const btnLogout = document.getElementById('btn-logout-admin');

  // Mode cloud: jendela login tetap tampil sampai status login Firebase diketahui
  const sudahLogin = sessionStorage.getItem('seblak_admin_auth');
  if (sudahLogin === 'true' && !firebaseSudahDiisi()) {
    if (modalOverlay) modalOverlay.classList.add('tersembunyi');
  } else {
    if (modalOverlay) modalOverlay.classList.remove('tersembunyi');
  }

  async function cekKataSandi() {
    const sandiInput = inputSandi ? inputSandi.value.trim() : '';

    if (btnMasuk) btnMasuk.disabled = true;
    const hasil = await verifikasiKataSandi(sandiInput);
    if (btnMasuk) btnMasuk.disabled = false;

    if (hasil.ok) {
      sessionStorage.setItem('seblak_admin_auth', 'true');
      if (pesanError) pesanError.style.display = 'none';
      if (modalOverlay) modalOverlay.classList.add('tersembunyi');
      isiFormulirAdmin();
    } else {
      if (pesanError) {
        pesanError.textContent = hasil.pesan;
        pesanError.style.display = 'block';
      }
      if (inputSandi) {
        inputSandi.value = '';
        inputSandi.focus();
      }
    }
  }

  if (btnMasuk) btnMasuk.addEventListener('click', cekKataSandi);

  if (inputSandi) {
    inputSandi.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') cekKataSandi();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      sessionStorage.removeItem('seblak_admin_auth');
      if (cloud.aktif) {
        try { await cloud.au.signOut(cloud.auth); } catch (e) {}
      }
      window.location.reload();
    });
  }

  isiFormulirAdmin();

  // Tombol Simpan & Reset
  const btnSimpan = document.getElementById('btn-simpan-semua');
  if (btnSimpan) {
    btnSimpan.addEventListener('click', tombolSimpanDiklik);
  }

  const btnReset = document.getElementById('btn-reset-default');
  if (btnReset) {
    btnReset.addEventListener('click', resetKeDataDefault);
  }

  // Tombol Ganti Kata Sandi
  const btnGantiPass = document.getElementById('btn-ganti-password');
  if (btnGantiPass) {
    btnGantiPass.addEventListener('click', ubahKataSandiAdmin);
  }

  // File hero listener
  const fileHeroInput = document.getElementById('file-foto-hero');
  if (fileHeroInput) {
    fileHeroInput.addEventListener('change', function() {
      prosesPilihFileFoto(this, 'adm-foto-hero', 'preview-foto-hero');
    });
  }

  pasangAutoSaveDanListenerWarna();

  // Hubungkan ke cloud, lalu isi ulang formulir dengan data terbaru dari cloud
  siapkanSumberData().then(() => {
    sesuaikanTampilanMode();
    if (cloud.aktif) {
      if (sudahLoginAdmin()) {
        if (modalOverlay) modalOverlay.classList.add('tersembunyi');
      } else {
        sessionStorage.removeItem('seblak_admin_auth');
        if (modalOverlay) modalOverlay.classList.remove('tersembunyi');
      }
      isiFormulirAdmin();
    }
    rampingkanFotoTersimpan();
  });
}

/**
 * ==========================================================================
 * DETEKSI OTOMATIS SAAT DOKUMEN DIMUAT (DOM READY)
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Jika pengguna membuka Halaman Utama (index.html)
  if (document.getElementById('pub-hero-title')) {
    inisialisasiHalamanPublik();

    // Tombol Admin Jendela 2 di Header
    const btnHeaderAdmin = document.getElementById('btn-header-admin');
    if (btnHeaderAdmin) btnHeaderAdmin.addEventListener('click', bukaJendela2);

    // Tombol Submit Login Admin Modal
    const btnSubmitAdminLogin = document.getElementById('btn-submit-admin-login');
    if (btnSubmitAdminLogin) {
      btnSubmitAdminLogin.addEventListener('click', prosesLoginAdmin);
    }

    const inputPassAdmin = document.getElementById('input-pass-admin-modal');
    if (inputPassAdmin) {
      inputPassAdmin.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') prosesLoginAdmin();
      });
    }

    // Tombol Aksi di Modal Jendela 2
    const btnSimpanSemua = document.getElementById('btn-simpan-semua');
    if (btnSimpanSemua) {
      btnSimpanSemua.addEventListener('click', tombolSimpanDiklik);
    }

    const btnResetDefault = document.getElementById('btn-reset-default');
    if (btnResetDefault) {
      btnResetDefault.addEventListener('click', resetKeDataDefault);
    }

    const btnGantiPass = document.getElementById('btn-ganti-password');
    if (btnGantiPass) {
      btnGantiPass.addEventListener('click', ubahKataSandiAdmin);
    }

    const fileHeroInput = document.getElementById('file-foto-hero');
    if (fileHeroInput) {
      fileHeroInput.addEventListener('change', function() {
        prosesPilihFileFoto(this, 'adm-foto-hero', 'preview-foto-hero');
      });
    }

    pasangAutoSaveDanListenerWarna();
    // rampingkanFotoTersimpan() dijalankan setelah koneksi cloud siap (di inisialisasiHalamanPublik)

    // Cek jika URL memiliki hash #jendela2
    if (window.location.hash === '#jendela2' || window.location.hash === '#admin') {
      setTimeout(bukaJendela2, 300);
    }
  } 
  // 2. Jika pengguna membuka Panel Admin Terpisah (admin.html)
  else if (document.getElementById('admin-container')) {
    inisialisasiHalamanAdmin();
  }
});
