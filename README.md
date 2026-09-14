# 📊 SENSUS 100 - BPS Edition

Aplikasi kuis interaktif *real-time* bergaya **Family 100**, dirancang khusus untuk sesi Games Literasi pada acara Hari Statistik Nasional (HSN) Badan Pusat Statistik.

Dibangun menggunakan **Node.js**, **Express**, dan **Socket.io**.

---

## 🚀 Persiapan & Instalasi

1. Pastikan komputer sudah terinstal **Node.js**.
2. Buka Terminal / Command Prompt, arahkan ke folder proyek ini.
3. Instal *dependencies* yang dibutuhkan:
   ```bash
   npm install
   ```

## 🖥️ Cara Menjalankan Aplikasi

1. Nyalakan server dengan menjalankan file utama:
   ```bash
   node server.js
   ```
2. Pastikan muncul pesan di terminal: **"Server SENSUS 100 Berjalan!"**

## 🎮 Panduan Operator (Game Master)

Aplikasi ini berjalan di **dua layar terpisah** yang saling tersinkronisasi secara real-time.

| Layar | Alamat | Keterangan |
|---|---|---|
| 🖥️ **Proyektor** (Penonton) | `http://localhost:3000` | Ditampilkan ke penonton via proyektor |
| 🎛️ **Kendali** (Admin) | `http://localhost:3000/admin.html` | Dipakai tertutup oleh Game Master |

> ⚠️ **Penting:** Saat pertama kali membuka Layar Proyektor, lakukan **klik kiri satu kali** di sembarang tempat pada halaman tersebut. Ini wajib dilakukan agar browser mengizinkan pemutaran efek suara (MP3).

### Fitur Kendali Admin

- **Navigasi Soal**
  Gunakan tombol **« Soal Sebelumnya** dan **Soal Selanjutnya »** untuk berpindah antar pertanyaan.

- **Membuka Jawaban**
  Jika tim berhasil menebak, klik **Buka Jawaban** pada pilihan yang sesuai. Layar proyektor otomatis menampilkan jawaban tersebut disertai efek suara benar.

- **Jawaban Salah (TETOT)**
  Klik tombol **❌ SALAH - TIM A** atau **❌ SALAH - TIM B**. Silang merah raksasa akan muncul di layar proyektor beserta suara *buzzer*, dan indikator strike (❌) tim tersebut otomatis bertambah.

- **Skor Tim**
  Ketik angka poin pada kotak skor tim yang sesuai, lalu tekan tombol **+** (tambah) atau **−** (kurang).

- **Reset**
  - 🔄 **Reset Strike** — menghapus tanda ❌ di layar proyektor.
  - 🗑️ **Reset Skor** — mengembalikan poin kedua tim menjadi 0.

## 📁 Struktur File Utama

```
├── serverjs                  # Routing Express & komunikasi real-time Socket.io
└── public/
    ├── admin.html            # Dashboard kontrol untuk Game Master
    ├── index.html            # Papan kuis untuk layar proyektor
    ├── benar.mp3              # Efek suara jawaban benar
    ├── tetot.mp3               # Efek suara jawaban salah
    └── pop up salah.png        # Aset gambar animasi silang merah
```
