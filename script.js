/**
 * ==============================================================================
 * SCRIPT.JS - LOGIKA JENDELA 1 (PUBLIK) & JENDELA 2 (PANEL ADMIN)
 * Dibuat khusus untuk bahan ajar siswa SMK (Rekayasa Perangkat Lunak)
 * Fitur:
 * 1. Manipulasi DOM Vanilla JavaScript (Tanpa Framework)
 * 2. Sinkronisasi Data Real-Time Antar Tab/Jendela via LocalStorage & BroadcastChannel
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
  return dataAwal;
}

/**
 * Menyimpan data ke localStorage.
 * Mengembalikan true jika berhasil, false jika gagal (biasanya karena penyimpanan penuh).
 * Sinyal ke tab lain HANYA dikirim jika data benar-benar tersimpan,
 * supaya halaman utama tidak menampilkan data "semu" yang hilang saat di-refresh.
 */
function simpanDataUMKM(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Gagal menyimpan ke localStorage:", e);
    return false;
  }

  // Kirim sinyal lewat BroadcastChannel ke tab lain
  if (syncChannel) {
    try {
      syncChannel.postMessage({ tipe: 'PERBARUI_TAMPILAN', timestamp: Date.now(), data });
    } catch (e) {}
  }
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
const BATAS_FOTO_TERSIMPAN = 450000;      // Foto tersimpan > ± 330 KB akan dikecilkan otomatis

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

async function kompresFileGambar(file, maksSisi) {
  const dataUrlAsli = await bacaFileSebagaiDataUrl(file);
  return ubahUkuranDataUrl(dataUrlAsli, maksSisi, KUALITAS_JPEG);
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

  const data = getDataUMKM();
  const perluDikecilkan = (src) =>
    typeof src === 'string' && src.startsWith('data:image') && src.length > BATAS_FOTO_TERSIMPAN;
  let adaPerubahan = false;

  if (perluDikecilkan(data.fotoHero)) {
    try {
      data.fotoHero = await ubahUkuranDataUrl(data.fotoHero, UKURAN_FOTO_HERO, KUALITAS_JPEG);
      adaPerubahan = true;
    } catch (e) {}
  }

  for (const item of (data.produk || [])) {
    if (perluDikecilkan(item.foto)) {
      try {
        item.foto = await ubahUkuranDataUrl(item.foto, UKURAN_FOTO_PRODUK, KUALITAS_JPEG);
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
}

/**
 * ==========================================================================
 * LOGIKA JENDELA 2: PANEL ADMIN & FORMULIR LENGKAP
 * ==========================================================================
 */

// Membuka modal Jendela 2 di dalam index.html
function bukaJendela2() {
  const modalLoginAdmin = document.getElementById('modal-login-admin');
  const modalJendela2 = document.getElementById('modal-jendela-2');
  const inputPass = document.getElementById('input-pass-admin-modal');
  const pesanError = document.getElementById('login-admin-error');

  const sudahLogin = sessionStorage.getItem('seblak_admin_auth');
  if (sudahLogin === 'true') {
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

function prosesLoginAdmin() {
  const inputPass = document.getElementById('input-pass-admin-modal');
  const pesanError = document.getElementById('login-admin-error');
  const sandiInput = inputPass ? inputPass.value.trim() : '';
  const sandiValid = getKataSandiAdmin();

  if (sandiInput === sandiValid) {
    sessionStorage.setItem('seblak_admin_auth', 'true');
    tutupModalAdminLogin();
    const modalJendela2 = document.getElementById('modal-jendela-2');
    if (modalJendela2) {
      modalJendela2.classList.remove('tersembunyi');
      isiFormulirAdmin();
    }
  } else {
    if (pesanError) {
      pesanError.textContent = "Kata sandi salah! Akses ditolak.";
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

// Menyimpan seluruh formulir Admin ke LocalStorage
// Mengembalikan true jika tersimpan, false jika gagal
let timerBadgeSync = null;

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

  // Simpan permanen ke localStorage
  const berhasil = simpanDataUMKM(data);

  // Badge status: tampilkan hasil yang SEBENARNYA (berhasil / gagal)
  const badgeSync = document.getElementById('sync-status-badge');
  if (badgeSync && !badgeSync.dataset.teksAwal) {
    badgeSync.dataset.teksAwal = badgeSync.textContent;
  }

  if (!berhasil) {
    if (badgeSync) {
      clearTimeout(timerBadgeSync);
      badgeSync.textContent = "⚠️ Gagal Tersimpan: Penyimpanan Penuh";
      badgeSync.classList.remove('tersimpan');
      badgeSync.classList.add('gagal');
    }
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

  // Efek badge tersimpan
  if (badgeSync) {
    clearTimeout(timerBadgeSync);
    badgeSync.textContent = "⚡ Perubahan Tersimpan & Tampil!";
    badgeSync.classList.remove('gagal');
    badgeSync.classList.add('tersimpan');
    timerBadgeSync = setTimeout(() => {
      badgeSync.textContent = badgeSync.dataset.teksAwal;
      badgeSync.classList.remove('tersimpan');
    }, 1200);
  }

  if (denganAlert) {
    alert("✅ Berhasil! Semua perubahan data, foto, warna, dan animasi telah disimpan dan langsung aktif di website.");
  }
  return true;
}

// Reset data ke pengaturan awal (default)
function resetKeDataDefault() {
  const yakin = confirm("Apakah Anda yakin ingin mengembalikan seluruh data dan tampilan ke pengaturan default awal?");
  if (yakin) {
    const dataAwal = salinData(DEFAULT_DATA);
    simpanDataUMKM(dataAwal);
    peringatanPenuhSudahTampil = false;
    setKataSandiAdmin(DEFAULT_PASSWORD);
    isiFormulirAdmin();
    terapkanTemaWarna(dataAwal);
    terapkanAnimasiBackground(dataAwal.animasiBg);

    if (document.getElementById('pub-hero-title')) {
      renderKontenPublik(dataAwal);
    }
    alert("🔄 Seluruh data berhasil direset ke pengaturan awal! Kata sandi dikembalikan ke 'makansantai'.");
  }
}

// Fitur Mengubah Kata Sandi Admin
function ubahKataSandiAdmin() {
  const sandiLama = getVal('adm-pass-lama');
  const sandiBaru = getVal('adm-pass-baru');
  const sandiKonfirmasi = getVal('adm-pass-konfirmasi');
  const sandiSekarang = getKataSandiAdmin();

  if (!sandiLama || !sandiBaru || !sandiKonfirmasi) {
    alert("Harap isi semua kolom untuk mengganti kata sandi.");
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
      if (e.target.matches('input:not([type="password"]):not([type="file"]), textarea')) {
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

// Firefox memperlakukan setiap file lokal (file://) sebagai origin terpisah,
// sehingga admin.html dan index.html yang dibuka dengan klik dua kali
// memakai localStorage yang BERBEDA dan tidak bisa saling sinkron.
function tampilkanCatatanFirefoxFileLokal() {
  const diFirefox = /firefox/i.test(navigator.userAgent);
  if (location.protocol !== 'file:' || !diFirefox) return;

  const wadah = document.querySelector('main.admin-wrapper');
  if (!wadah) return;

  const catatan = document.createElement('div');
  catatan.className = 'catatan-sinkron';
  catatan.innerHTML =
    '<strong>⚠️ Perubahan dari halaman ini tidak akan sampai ke index.html.</strong> ' +
    'Di Firefox, file yang dibuka langsung dari folder (klik dua kali) tidak bisa berbagi data. ' +
    'Gunakan tombol <strong>⚙️ Kelola Toko</strong> di halaman utama, atau jalankan website lewat ' +
    '<em>Live Server</em> (VS Code) / GitHub Pages.';
  wadah.prepend(catatan);
}

function inisialisasiHalamanAdmin() {
  tampilkanCatatanFirefoxFileLokal();

  const modalOverlay = document.getElementById('login-modal-overlay');
  const inputSandi = document.getElementById('input-password-admin');
  const btnMasuk = document.getElementById('btn-masuk-admin');
  const pesanError = document.getElementById('login-error-pesan');
  const btnLogout = document.getElementById('btn-logout-admin');

  const sudahLogin = sessionStorage.getItem('seblak_admin_auth');
  if (sudahLogin === 'true') {
    if (modalOverlay) modalOverlay.classList.add('tersembunyi');
  } else {
    if (modalOverlay) modalOverlay.classList.remove('tersembunyi');
  }

  function cekKataSandi() {
    const sandiInput = inputSandi ? inputSandi.value.trim() : '';
    const sandiValid = getKataSandiAdmin();

    if (sandiInput === sandiValid) {
      sessionStorage.setItem('seblak_admin_auth', 'true');
      if (pesanError) pesanError.style.display = 'none';
      if (modalOverlay) modalOverlay.classList.add('tersembunyi');
      isiFormulirAdmin();
    } else {
      if (pesanError) {
        pesanError.textContent = "Kata sandi salah! Akses ditolak.";
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
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('seblak_admin_auth');
      window.location.reload();
    });
  }

  isiFormulirAdmin();

  // Tombol Simpan & Reset
  const btnSimpan = document.getElementById('btn-simpan-semua');
  if (btnSimpan) {
    btnSimpan.addEventListener('click', () => simpanPerubahanDariAdmin(true));
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
  rampingkanFotoTersimpan();
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
      btnSimpanSemua.addEventListener('click', () => simpanPerubahanDariAdmin(true));
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
    rampingkanFotoTersimpan();

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
