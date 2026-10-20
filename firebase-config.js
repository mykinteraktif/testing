/**
 * ==============================================================================
 * FIREBASE-CONFIG.JS — PENGATURAN SINKRON KE SEMUA PERANGKAT
 * ==============================================================================
 *
 * Tanpa Firebase, data website disimpan di localStorage (memori browser).
 * Akibatnya perubahan dari Panel Kelola HANYA tampil di browser/perangkat
 * yang sama. HP atau laptop lain tetap melihat data lama.
 *
 * Isi bagian di bawah ini agar perubahan tersimpan di database online
 * (Cloud Firestore) dan langsung tampil di SEMUA perangkat secara real-time.
 * Langkah lengkapnya ada di README.md bagian "Mengaktifkan Sinkron Semua Perangkat".
 *
 * Catatan keamanan:
 * - apiKey Firebase untuk web memang boleh terlihat publik.
 * - Yang menjaga data adalah "Rules" Firestore (lihat file firestore.rules),
 *   sehingga hanya akun admin yang boleh mengubah data.
 * ==============================================================================
 */

// 1. Tempel konfigurasi dari Firebase Console
//    (Project settings > General > Your apps > Web app > SDK setup and configuration)
//    Biarkan kosong ("") jika belum memakai Firebase → website berjalan dalam mode lokal.
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// 2. Email akun admin yang dibuat di Firebase Authentication (Email/Password).
//    Kata sandi akun ini dipakai untuk masuk ke Panel Kelola.
//    Email ini harus SAMA dengan email yang ditulis di firestore.rules.
const ADMIN_EMAIL = "";

// 3. ID toko di database. Ganti jika satu project Firebase dipakai beberapa kelompok
//    (contoh: "kelompok-1", "kelompok-2"), agar data tiap kelompok tidak tercampur.
const TOKO_ID = "seblak-umkm";
