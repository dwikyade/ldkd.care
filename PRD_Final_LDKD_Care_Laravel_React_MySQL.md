# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## LDKD Care — Laravel, React, TypeScript, dan MySQL

**Versi:** 2.0 Final  
**Jenis Produk:** Aplikasi web  
**Status Dokumen:** Final  
**Target Pengguna:** Siswa, guru, dan tim pengabdian  
**Platform:** Desktop, tablet, dan perangkat seluler  
**Bahasa:** Bahasa Indonesia dan Bahasa Inggris  
**Model Akses:** Peserta tanpa login, admin wajib login  
**Backend:** PHP Laravel  
**Frontend:** React + TypeScript melalui Inertia.js  
**Database:** MySQL  
**Pengelolaan Database:** phpMyAdmin / HeidiSQL / MySQL Workbench  

---

# 1. Ringkasan Produk

LDKD Care adalah aplikasi berbasis web untuk mengukur tingkat **Literasi Digital** dan **Keamanan Data** peserta melalui kuesioner terstruktur.

Peserta terdiri atas siswa dan guru. Peserta dapat mengisi kuesioner tanpa membuat akun, tetapi setiap peserta memiliki **kode peserta unik** untuk menghubungkan hasil pre-test dan post-test milik orang yang sama.

Sistem menghitung skor secara otomatis, menentukan kategori hasil, menampilkan tips edukasi, dan menyediakan dashboard admin untuk:

- Mengelola kegiatan.
- Mengelola peserta.
- Mengelola soal.
- Mengatur bobot dan kategori.
- Melihat hasil pengisian.
- Membandingkan pre-test dan post-test.
- Mendeteksi kemungkinan data ganda.
- Mengekspor laporan CSV dan PDF.

Aplikasi dibangun menggunakan Laravel sebagai backend, React dan TypeScript sebagai frontend, Inertia.js sebagai penghubung frontend-backend, serta MySQL sebagai database.

---

# 2. Latar Belakang

Program sosialisasi literasi digital dan keamanan data membutuhkan evaluasi untuk mengetahui:

1. Tingkat pemahaman peserta sebelum sosialisasi.
2. Tingkat pemahaman peserta setelah sosialisasi.
3. Perubahan skor setiap peserta.
4. Perubahan rata-rata berdasarkan sekolah, kelas, dan peran.
5. Materi yang masih kurang dipahami.
6. Efektivitas kegiatan pengabdian.

Proses manual berisiko menimbulkan:

- Kesalahan penghitungan.
- Duplikasi peserta.
- Kesulitan mencocokkan pre-test dan post-test.
- Inkonsistensi data.
- Proses rekap dan laporan yang lambat.

LDKD Care mengotomatisasi proses identifikasi peserta, pengisian kuesioner, penghitungan skor, pencocokan pre-test dan post-test, analisis hasil, serta pembuatan laporan.

---

# 3. Tujuan Produk

LDKD Care bertujuan untuk:

1. Mempermudah siswa dan guru mengisi pre-test dan post-test.
2. Mengukur literasi digital peserta.
3. Mengukur pemahaman keamanan data peserta.
4. Menghitung skor dan kategori secara otomatis.
5. Memberikan tips edukasi berdasarkan hasil.
6. Menghubungkan pre-test dan post-test milik peserta yang sama.
7. Menampilkan perubahan skor setiap peserta.
8. Menyediakan rekap berdasarkan sekolah, kelas, peran, dan waktu.
9. Membantu tim pengabdian menyusun laporan dan artikel ilmiah.
10. Mendukung antarmuka Bahasa Indonesia dan Inggris.
11. Menjaga integritas hasil lama ketika soal atau bobot diperbarui.
12. Menyediakan tampilan modern, responsif, dan mudah digunakan.

---

# 4. Sasaran Keberhasilan

Produk dianggap berhasil apabila:

- Peserta dapat mengisi tanpa membuat akun.
- Setiap peserta dapat dikenali dengan kode unik.
- Pre-test dan post-test dapat dipasangkan secara akurat.
- Nama bukan identitas utama untuk pencocokan data.
- Skor kedua modul dihitung dengan benar.
- Admin dapat melihat perubahan skor setiap orang.
- Admin dapat melihat ringkasan keseluruhan.
- Sistem dapat mencegah pengisian ganda.
- Data dapat diekspor ke CSV dan PDF.
- Perubahan soal tidak merusak hasil lama.
- Aplikasi nyaman digunakan melalui ponsel.
- Antarmuka tersedia dalam dua bahasa.

---

# 5. Ruang Lingkup Produk

## 5.1 Termasuk dalam sistem

### Fitur peserta

- Landing page.
- Pemilihan bahasa.
- Pemilihan Pre-Test atau Post-Test.
- Pemilihan peran Siswa atau Guru.
- Input kode peserta.
- Pemindaian QR peserta.
- Konfirmasi identitas.
- Kuesioner Modul Literasi Digital.
- Kuesioner Modul Keamanan Data.
- Indikator progres.
- Penyimpanan jawaban sementara.
- Penghitungan skor otomatis.
- Kategori Rendah, Sedang, atau Tinggi.
- Tips edukasi.
- Halaman hasil.

### Fitur admin

- Login admin.
- Dashboard rekap.
- Manajemen kegiatan.
- Manajemen sekolah dan kelas.
- Manajemen peserta.
- Import peserta dari CSV atau Excel.
- Pembuatan kode peserta.
- Pembuatan QR peserta.
- Manajemen soal.
- Penonaktifan soal.
- Pengaturan bobot.
- Pengaturan kategori.
- Manajemen tips.
- Rekap hasil.
- Perbandingan individu.
- Perbandingan agregat.
- Deteksi kemungkinan data ganda.
- Merge data peserta.
- Export CSV.
- Export PDF.
- Audit log.

## 5.2 Tidak termasuk dalam sistem

- Login siswa atau guru.
- Akun pribadi peserta.
- Sistem pembelajaran atau e-learning.
- Forum diskusi.
- Pembayaran.
- Sertifikat otomatis.
- Chat dengan admin.
- Penilaian psikologis.
- Sistem SDQ.
- Aplikasi Android/iOS native.
- Integrasi WhatsApp pada versi MVP.

---

# 6. Pengguna Sistem

## 6.1 Siswa

Siswa mengisi pre-test dan post-test untuk mengukur pemahaman mengenai literasi digital dan keamanan data.

Siswa tidak perlu login. Identitas peserta dikenali menggunakan kode unik.

## 6.2 Guru

Guru mengisi kuesioner dengan alur yang sama seperti siswa. Data guru dipisahkan agar dapat dianalisis berdasarkan peran.

Guru tidak perlu login.

## 6.3 Admin

Admin merupakan anggota tim pengabdian yang memiliki hak untuk:

- Mengelola kegiatan.
- Mengelola peserta.
- Mengelola soal.
- Mengatur bobot dan kategori.
- Melihat seluruh hasil.
- Membandingkan pre-test dan post-test.
- Menggabungkan data peserta.
- Mengekspor laporan.

Admin wajib login.

---

# 7. Struktur Hak Akses

| Fitur | Peserta | Admin |
|---|---:|---:|
| Membuka landing page | Ya | Ya |
| Memilih bahasa | Ya | Ya |
| Memilih pre-test/post-test | Ya | Tidak diperlukan |
| Memilih peran | Ya | Tidak |
| Memasukkan kode peserta | Ya | Tidak |
| Mengisi kuesioner | Ya | Tidak |
| Melihat hasil pribadi | Ya | Tidak |
| Login admin | Tidak | Ya |
| Mengelola kegiatan | Tidak | Ya |
| Mengelola sekolah dan kelas | Tidak | Ya |
| Mengelola peserta | Tidak | Ya |
| Mengelola soal | Tidak | Ya |
| Mengatur bobot dan kategori | Tidak | Ya |
| Melihat seluruh hasil | Tidak | Ya |
| Membandingkan pre-test/post-test | Tidak | Ya |
| Merge peserta | Tidak | Ya |
| Export CSV/PDF | Tidak | Ya |
| Melihat audit log | Tidak | Ya |

---

# 8. Kebutuhan Fungsional Peserta

## FR-01 — Landing Page

Landing page menampilkan:

- Nama dan logo LDKD Care.
- Penjelasan singkat aplikasi.
- Penjelasan Literasi Digital.
- Penjelasan Keamanan Data.
- Informasi bahwa peserta tidak perlu login.
- Tombol **Mulai Pengisian**.
- Pilihan bahasa.

### Acceptance Criteria

- Halaman dapat dibuka tanpa login.
- Responsif pada ponsel, tablet, dan desktop.
- Pilihan bahasa tersimpan selama proses pengisian.
- Tombol mulai mengarah ke halaman pemilihan mode.

---

## FR-02 — Pilihan Mode Pengisian

Peserta memilih:

- Pre-Test.
- Post-Test.

### Acceptance Criteria

- Peserta hanya dapat memilih satu mode.
- Peserta tidak dapat melanjutkan sebelum memilih.
- Mode disimpan sampai proses selesai.
- Mode disimpan pada data hasil.

---

## FR-03 — Pilihan Peran

Peserta memilih:

- Siswa.
- Guru.

### Acceptance Criteria

- Peserta hanya dapat memilih satu peran.
- Peran harus sesuai dengan data peserta.
- Admin dapat memfilter hasil berdasarkan peran.

---

## FR-04 — Identitas Unik Peserta

Setiap peserta memiliki kode unik, misalnya:

```text
LDKD-A7K92
```

Kode peserta dapat dimasukkan secara manual atau dipindai melalui QR.

### Alur

1. Peserta memasukkan kode.
2. Laravel memvalidasi kode melalui server.
3. Sistem mencari data peserta di MySQL.
4. Sistem menampilkan nama, sekolah, kelas, dan peran.
5. Peserta mengonfirmasi identitas.
6. Peserta melanjutkan ke kuesioner.

### Acceptance Criteria

- Kode peserta unik dalam satu kegiatan.
- Nama tidak digunakan sebagai identitas utama.
- Pre-test dan post-test dipasangkan menggunakan `participant_id`.
- Kode yang tidak ditemukan menghasilkan pesan yang jelas.
- Peserta dapat membatalkan apabila identitas tidak sesuai.
- Sistem tidak menampilkan daftar peserta lain.
- Sistem mencegah satu peserta mengisi jenis tes yang sama dua kali.

---

## FR-05 — Identitas Peserta

### Data siswa

- Nama lengkap.
- Sekolah.
- Kelas.
- Jenis kelamin jika diperlukan.
- Kode peserta.

### Data guru

- Nama lengkap.
- Sekolah.
- Jabatan atau mata pelajaran jika diperlukan.
- Kode peserta.

### Acceptance Criteria

- Data wajib memiliki validasi.
- Peserta dapat memeriksa identitas sebelum mengisi.
- Nama tidak digunakan untuk pencocokan pre-test dan post-test.
- Peserta memberikan persetujuan pemrosesan data untuk evaluasi kegiatan.

---

## FR-06 — Modul Literasi Digital

Modul berisi pernyataan yang mengukur kemampuan peserta dalam:

- Menggunakan teknologi digital.
- Memahami informasi digital.
- Memverifikasi sumber.
- Membedakan fakta dan opini.
- Berinteraksi secara bertanggung jawab di ruang digital.

Setiap soal memiliki:

- Teks Bahasa Indonesia.
- Teks Bahasa Inggris.
- Pilihan jawaban.
- Bobot jawaban.
- Urutan.
- Status aktif atau nonaktif.

---

## FR-07 — Modul Keamanan Data

Modul berisi pernyataan mengenai:

- Kata sandi.
- OTP.
- Privasi data.
- Phishing.
- Izin aplikasi.
- Keamanan akun.
- Perlindungan informasi pribadi.

### Acceptance Criteria kedua modul

- Hanya soal aktif yang ditampilkan.
- Seluruh soal wajib dijawab.
- Soal ditampilkan sesuai urutan.
- Jawaban tidak hilang ketika berpindah langkah.
- Sistem menampilkan progres.
- Sistem meminta konfirmasi sebelum submit.
- Teks mengikuti bahasa yang dipilih.

---

## FR-08 — Progress Pengisian

Tahapan:

1. Mode.
2. Peran.
3. Identitas.
4. Literasi Digital.
5. Keamanan Data.
6. Konfirmasi.
7. Hasil.

### Acceptance Criteria

- Tahap aktif ditandai dengan jelas.
- Jumlah soal terjawab ditampilkan.
- Tombol kembali tidak menghapus jawaban.
- Progress responsif pada layar kecil.

---

## FR-09 — Penyimpanan Jawaban Sementara

Jawaban sementara dapat disimpan di browser menggunakan local storage atau session storage.

### Acceptance Criteria

- Draft berlaku pada perangkat dan browser yang sama.
- Draft memiliki waktu kedaluwarsa.
- Draft dihapus setelah submit berhasil.
- Data tidak disimpan lebih lama dari yang diperlukan.

---

## FR-10 — Submit Kuesioner

React mengirim jawaban melalui request ke route Laravel.

Laravel wajib:

1. Memvalidasi identitas peserta.
2. Memastikan jenis tes belum pernah diisi.
3. Memvalidasi seluruh jawaban.
4. Mengambil bobot aktif dari MySQL.
5. Menghitung skor di server.
6. Menyimpan submission dan jawaban dalam database transaction.
7. Mengembalikan token hasil.

### Acceptance Criteria

- Skor tidak dihitung hanya di frontend.
- Data tidak tersimpan sebagian.
- Double click tidak menghasilkan submission ganda.
- Kesalahan server menampilkan pesan yang dapat dipahami.
- Submit menggunakan perlindungan CSRF.

---

## FR-11 — Penghitungan Skor

Sistem menghitung:

- Skor Literasi Digital.
- Skor Keamanan Data.
- Skor maksimum setiap modul.
- Persentase setiap modul.

Rumus:

```text
Persentase = (Skor diperoleh / Skor maksimum) × 100%
```

### Acceptance Criteria

- Penghitungan dilakukan di service Laravel.
- Hasil menggunakan bobot saat submit.
- Bobot disimpan sebagai snapshot.
- Hasil yang sama harus menghasilkan skor yang konsisten.

---

## FR-12 — Penentuan Kategori

Kategori:

- Rendah.
- Sedang.
- Tinggi.

Contoh konfigurasi awal:

| Persentase | Kategori |
|---:|---|
| 0–49% | Rendah |
| 50–74% | Sedang |
| 75–100% | Tinggi |

### Acceptance Criteria

- Setiap modul memiliki kategori tersendiri.
- Rentang tidak tumpang tindih.
- Tidak terdapat celah nilai.
- Perubahan kategori hanya berlaku untuk submission baru.
- Kategori lama tersimpan sebagai snapshot.

---

## FR-13 — Halaman Hasil

Halaman menampilkan:

- Nama peserta.
- Mode pengisian.
- Peran.
- Skor dan persentase Literasi Digital.
- Kategori Literasi Digital.
- Skor dan persentase Keamanan Data.
- Kategori Keamanan Data.
- Tips edukasi.
- Waktu pengisian.

### Acceptance Criteria

- Hasil hanya dapat diakses melalui token yang aman.
- Peserta tidak dapat melihat hasil peserta lain.
- Kategori ditampilkan dengan warna, teks, dan ikon.
- Peserta tidak dapat mengubah hasil.
- Terdapat tombol kembali ke landing page.

---

## FR-14 — Tips Edukasi

Tips ditentukan berdasarkan modul dan kategori.

| Modul | Kategori | Contoh Tips |
|---|---|---|
| Literasi Digital | Rendah | Pelajari cara memverifikasi sumber sebelum membagikan informasi. |
| Literasi Digital | Sedang | Tingkatkan kemampuan membedakan fakta, opini, dan informasi menyesatkan. |
| Literasi Digital | Tinggi | Pertahankan kebiasaan memeriksa sumber dan bantu mengedukasi orang lain. |
| Keamanan Data | Rendah | Gunakan kata sandi kuat dan jangan membagikan OTP. |
| Keamanan Data | Sedang | Aktifkan autentikasi dua faktor dan periksa izin aplikasi. |
| Keamanan Data | Tinggi | Lakukan pemeriksaan keamanan akun secara berkala. |

---

## FR-15 — Tampilan Dwibahasa

Antarmuka tersedia dalam:

- Bahasa Indonesia.
- Bahasa Inggris.

Bagian yang diterjemahkan:

- Navigasi.
- Instruksi.
- Formulir.
- Soal.
- Pilihan jawaban.
- Pesan validasi.
- Kategori.
- Hasil.
- Tips.

Implementasi dapat menggunakan file translation Laravel dan data bilingual pada tabel soal.

---

# 9. Kebutuhan Fungsional Admin

## FR-16 — Login Admin

Admin login menggunakan email dan kata sandi.

### Teknologi

- Laravel Breeze atau Laravel Fortify.
- Session-based authentication.
- Middleware `auth`.
- Password hashing bawaan Laravel.

### Acceptance Criteria

- Hanya admin aktif yang dapat login.
- Kata sandi tidak disimpan dalam bentuk teks.
- Route admin dilindungi middleware.
- Tersedia logout.
- Login gagal tidak membocorkan status email.
- Session diperbarui setelah login.

---

## FR-17 — Dashboard Admin

Dashboard menampilkan:

- Total peserta.
- Total pengisian.
- Total pre-test.
- Total post-test.
- Total siswa.
- Total guru.
- Rata-rata Literasi Digital.
- Rata-rata Keamanan Data.
- Peserta dengan data lengkap.
- Peserta yang belum mengisi salah satu tes.
- Jumlah sekolah.

### Grafik

- Perbandingan rata-rata pre-test dan post-test.
- Distribusi kategori Literasi Digital.
- Distribusi kategori Keamanan Data.
- Jumlah peserta per sekolah.
- Jumlah peserta per kelas.
- Tren pengisian.
- Persentase data lengkap.

Grafik dibuat menggunakan Recharts pada komponen React.

---

## FR-18 — Filter Dashboard

Filter:

- Kegiatan.
- Sekolah.
- Kelas.
- Peran.
- Jenis tes.
- Rentang tanggal.
- Kategori Literasi Digital.
- Kategori Keamanan Data.
- Status pasangan data.

### Acceptance Criteria

- Filter dapat digunakan bersamaan.
- Filter menggunakan query parameter.
- Grafik, kartu, tabel, dan export mengikuti filter.
- Terdapat tombol reset.

---

## FR-19 — Manajemen Kegiatan

Data kegiatan:

- Nama kegiatan.
- Tema.
- Lokasi.
- Tanggal mulai.
- Tanggal selesai.
- Deskripsi.
- Status aktif.

### Acceptance Criteria

- Setiap participant dan submission terhubung ke satu kegiatan.
- Kegiatan lama tidak dihapus permanen.
- Admin dapat mengaktifkan atau menonaktifkan kegiatan.

---

## FR-20 — Manajemen Sekolah dan Kelas

Admin dapat:

- Menambah sekolah.
- Mengubah sekolah.
- Menonaktifkan sekolah.
- Menambah kelas.
- Mengubah kelas.
- Menghubungkan kelas dengan sekolah.

---

## FR-21 — Manajemen Peserta

Admin dapat:

- Menambah peserta.
- Mengubah peserta.
- Menonaktifkan peserta.
- Mencari dan memfilter peserta.
- Melihat status pre-test dan post-test.
- Membuat kode unik.
- Membuat QR.
- Mencetak daftar peserta.
- Mengimpor peserta.
- Mengekspor daftar peserta.

### Acceptance Criteria

- Nama boleh sama.
- Kode tidak boleh sama dalam kegiatan yang sama.
- Peserta yang memiliki hasil tidak boleh dihapus permanen.
- Status pengisian terlihat dengan badge.

---

## FR-22 — Import Peserta

Format yang didukung:

- CSV.
- XLSX.

Contoh kolom:

```text
full_name, role, school, class_name, participant_code
```

Jika kode kosong, sistem membuat kode otomatis.

### Acceptance Criteria

- Sistem menampilkan preview.
- Sistem memvalidasi kolom wajib.
- Sistem mendeteksi kode ganda.
- Import menggunakan database transaction.
- Sistem menampilkan jumlah berhasil dan gagal.
- Kesalahan dapat diunduh.

Implementasi menggunakan Laravel Excel.

---

## FR-23 — Kode Peserta dan QR

Contoh kode:

```text
LDKD-A7K92
```

QR dapat berisi URL dengan token identifikasi peserta.

### Acceptance Criteria

- QR tidak menyimpan informasi pribadi dalam teks terbuka.
- Token sulit ditebak.
- Admin dapat mengunduh atau mencetak QR.
- Input manual tetap tersedia.

---

## FR-24 — Manajemen Soal

Admin dapat:

- Menambah soal.
- Mengubah soal.
- Menentukan modul.
- Mengisi teks Indonesia dan Inggris.
- Mengatur urutan.
- Mengaktifkan soal.
- Menonaktifkan soal.

### Aturan

Soal yang telah digunakan tidak boleh dihapus permanen.

### Acceptance Criteria

- Soal nonaktif tidak tampil pada submission baru.
- Snapshot soal lama tetap dapat dilihat.
- Perubahan dicatat di audit log.

---

## FR-25 — Pengaturan Pilihan dan Bobot

Admin dapat menentukan pilihan dan bobot.

Contoh:

| Pilihan | Bobot |
|---|---:|
| Sangat Tidak Setuju | 1 |
| Tidak Setuju | 2 |
| Setuju | 3 |
| Sangat Setuju | 4 |

### Acceptance Criteria

- Bobot harus numerik.
- Perubahan hanya berlaku pada pengisian baru.
- Bobot lama disimpan sebagai snapshot.
- Sistem meminta konfirmasi sebelum menyimpan.

---

## FR-26 — Pengaturan Kategori

Admin mengatur batas kategori Rendah, Sedang, dan Tinggi.

### Acceptance Criteria

- Rentang tidak tumpang tindih.
- Tidak terdapat celah.
- Seluruh persentase 0–100 tercakup.
- Konfigurasi memiliki versi.
- Perubahan hanya berlaku pada submission baru.

---

## FR-27 — Manajemen Tips Edukasi

Admin dapat:

- Menambah tips.
- Mengubah tips.
- Menentukan modul.
- Menentukan kategori.
- Mengisi dua bahasa.
- Mengaktifkan atau menonaktifkan tips.

---

## FR-28 — Data Hasil Peserta

Tabel menampilkan:

- Kode peserta.
- Nama.
- Peran.
- Sekolah.
- Kelas.
- Jenis tes.
- Skor kedua modul.
- Kategori kedua modul.
- Waktu pengisian.

Admin dapat membuka detail seluruh jawaban.

---

## FR-29 — Perbandingan Individu

Pencocokan menggunakan:

```text
participant_id + activity_id
```

Contoh:

| Peserta | Pre Literasi | Post Literasi | Selisih | Pre Keamanan | Post Keamanan | Selisih | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| Rizal Afandi | 62 | 84 | +22 | 65 | 86 | +21 | Lengkap |
| Siti Aisyah | 71 | - | - | 73 | - | - | Belum Post-Test |

Rumus:

```text
Selisih = Skor Post-Test - Skor Pre-Test
```

```text
Persentase Perubahan =
((Post-Test - Pre-Test) / Pre-Test) × 100%
```

Jika pre-test bernilai 0, persentase tidak dihitung.

### Acceptance Criteria

- Sistem tidak mencocokkan menggunakan nama.
- Peserta yang belum memiliki pasangan tetap ditampilkan.
- Selisih dihitung oleh backend Laravel.
- Data dapat difilter dan diekspor.

---

## FR-30 — Perbandingan Agregat

Sistem menampilkan:

- Rata-rata pre-test.
- Rata-rata post-test.
- Selisih rata-rata.
- Persentase peningkatan.
- Perbandingan per modul.
- Perbandingan per sekolah.
- Perbandingan per kelas.
- Perbandingan siswa dan guru.

---

## FR-31 — Pencegahan Pengisian Ganda

Satu peserta hanya boleh memiliki:

- Satu pre-test per kegiatan.
- Satu post-test per kegiatan.

Constraint MySQL:

```sql
UNIQUE KEY unique_participant_test (
    activity_id,
    participant_id,
    test_type
)
```

### Acceptance Criteria

- Backend menolak submission ganda.
- Database menjadi lapisan perlindungan terakhir.
- Peserta menerima pesan yang jelas.
- Admin dapat membuka ulang melalui tindakan khusus.
- Tindakan tersebut dicatat.

---

## FR-32 — Deteksi Kemungkinan Data Ganda

Sistem dapat memberikan rekomendasi berdasarkan:

- Kemiripan nama.
- Sekolah yang sama.
- Kelas yang sama.
- Peran yang sama.

Sistem tidak melakukan merge otomatis.

---

## FR-33 — Merge Peserta

Admin dapat menggabungkan dua peserta yang terbukti sama.

### Acceptance Criteria

- Admin melihat preview.
- Admin memilih data utama.
- Submission dipindahkan menggunakan database transaction.
- Sistem mencegah konflik pre-test atau post-test ganda.
- Data sumber ditandai sebagai merged.
- Aktivitas dicatat di audit log.

---

## FR-34 — Export CSV dan Excel

Export mengikuti filter aktif dan dapat memuat:

- Kode peserta.
- Nama.
- Peran.
- Sekolah.
- Kelas.
- Skor pre-test.
- Skor post-test.
- Selisih.
- Kategori.
- Status kelengkapan.

Implementasi menggunakan Laravel Excel.

---

## FR-35 — Export PDF

PDF memuat:

- Judul kegiatan.
- Periode.
- Filter aktif.
- Jumlah peserta.
- Jumlah pre-test dan post-test.
- Rata-rata skor.
- Grafik.
- Distribusi kategori.
- Tabel ringkasan.

Implementasi menggunakan DomPDF atau Snappy PDF.

---

## FR-36 — Audit Log

Audit log mencatat:

- Login admin.
- Perubahan soal.
- Perubahan bobot.
- Perubahan kategori.
- Import peserta.
- Pembukaan ulang tes.
- Merge peserta.
- Export data.

Data yang dicatat:

- Admin.
- Aksi.
- Objek.
- Nilai sebelum.
- Nilai sesudah.
- Waktu.
- IP jika diperlukan.

---

# 10. Alur Sistem

## 10.1 Alur Peserta

```text
Landing Page
    ↓
Pilih Bahasa
    ↓
Pilih Pre-Test atau Post-Test
    ↓
Pilih Peran
    ↓
Masukkan Kode / Scan QR
    ↓
Laravel Memvalidasi Peserta
    ↓
Konfirmasi Identitas
    ↓
Isi Literasi Digital
    ↓
Isi Keamanan Data
    ↓
Konfirmasi Jawaban
    ↓
Laravel Menghitung dan Menyimpan
    ↓
Hasil dan Tips
```

## 10.2 Alur Admin

```text
Login Admin
    ↓
Dashboard
    ├── Kegiatan
    ├── Sekolah dan Kelas
    ├── Peserta
    ├── Import Peserta
    ├── Kode dan QR
    ├── Soal dan Bobot
    ├── Kategori dan Tips
    ├── Hasil
    ├── Perbandingan Pre/Post
    ├── Deteksi Duplikat
    ├── Merge Peserta
    └── Export
```

---

# 11. Struktur Halaman

## 11.1 Halaman Peserta

```text
/
├── /pilih-mode
├── /pilih-peran
├── /identifikasi
├── /konfirmasi-peserta
├── /kuesioner/literasi-digital
├── /kuesioner/keamanan-data
├── /konfirmasi-jawaban
└── /hasil/{token}
```

## 11.2 Halaman Admin

```text
/admin/login
/admin/dashboard
/admin/kegiatan
/admin/sekolah
/admin/kelas
/admin/peserta
/admin/peserta/import
/admin/peserta/{id}
/admin/soal
/admin/bobot
/admin/kategori
/admin/tips
/admin/hasil
/admin/perbandingan
/admin/duplikat
/admin/export
/admin/audit-log
```

---

# 12. Rancangan Database MySQL

## 12.1 Standar Database

- Database engine: MySQL 8.0 atau MariaDB versi kompatibel.
- Character set: `utf8mb4`.
- Collation: `utf8mb4_unicode_ci`.
- Primary key: `BIGINT UNSIGNED AUTO_INCREMENT`.
- Foreign key menggunakan InnoDB.
- Timestamp mengikuti konfigurasi timezone aplikasi.
- Soft delete digunakan pada data penting.

## 12.2 Tabel `users`

Digunakan untuk akun admin Laravel.

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| name | VARCHAR(150) |
| email | VARCHAR(191) UNIQUE |
| password | VARCHAR(255) |
| is_active | TINYINT(1) |
| remember_token | VARCHAR(100) NULL |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## 12.3 Tabel `activities`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| name | VARCHAR(191) |
| description | TEXT NULL |
| location | VARCHAR(191) NULL |
| start_date | DATE |
| end_date | DATE |
| is_active | TINYINT(1) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
| deleted_at | TIMESTAMP NULL |

## 12.4 Tabel `schools`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| name | VARCHAR(191) |
| address | TEXT NULL |
| is_active | TINYINT(1) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
| deleted_at | TIMESTAMP NULL |

## 12.5 Tabel `classes`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| school_id | BIGINT UNSIGNED |
| name | VARCHAR(100) |
| is_active | TINYINT(1) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
| deleted_at | TIMESTAMP NULL |

## 12.6 Tabel `participants`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| activity_id | BIGINT UNSIGNED |
| participant_code | VARCHAR(50) |
| full_name | VARCHAR(191) |
| role | VARCHAR(20) |
| school_id | BIGINT UNSIGNED |
| class_id | BIGINT UNSIGNED NULL |
| gender | VARCHAR(20) NULL |
| position | VARCHAR(150) NULL |
| is_active | TINYINT(1) |
| merged_into_id | BIGINT UNSIGNED NULL |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
| deleted_at | TIMESTAMP NULL |

Unique index:

```sql
UNIQUE KEY unique_activity_code (
    activity_id,
    participant_code
)
```

## 12.7 Tabel `questions`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| module | VARCHAR(30) |
| text_id | TEXT |
| text_en | TEXT |
| display_order | INT UNSIGNED |
| is_active | TINYINT(1) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |
| deleted_at | TIMESTAMP NULL |

## 12.8 Tabel `answer_options`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| question_id | BIGINT UNSIGNED |
| label_id | VARCHAR(191) |
| label_en | VARCHAR(191) |
| weight | DECIMAL(8,2) |
| display_order | INT UNSIGNED |
| is_active | TINYINT(1) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## 12.9 Tabel `category_thresholds`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| module | VARCHAR(30) |
| category | VARCHAR(20) |
| minimum_percentage | DECIMAL(5,2) |
| maximum_percentage | DECIMAL(5,2) |
| version | INT UNSIGNED |
| is_active | TINYINT(1) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## 12.10 Tabel `educational_tips`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| module | VARCHAR(30) |
| category | VARCHAR(20) |
| content_id | TEXT |
| content_en | TEXT |
| is_active | TINYINT(1) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## 12.11 Tabel `submissions`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| activity_id | BIGINT UNSIGNED |
| participant_id | BIGINT UNSIGNED |
| result_token | CHAR(64) UNIQUE |
| test_type | VARCHAR(20) |
| language | VARCHAR(5) |
| digital_literacy_score | DECIMAL(10,2) |
| digital_literacy_max_score | DECIMAL(10,2) |
| digital_literacy_percentage | DECIMAL(5,2) |
| digital_literacy_category | VARCHAR(20) |
| data_security_score | DECIMAL(10,2) |
| data_security_max_score | DECIMAL(10,2) |
| data_security_percentage | DECIMAL(5,2) |
| data_security_category | VARCHAR(20) |
| submitted_at | TIMESTAMP |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Unique index:

```sql
UNIQUE KEY unique_participant_test (
    activity_id,
    participant_id,
    test_type
)
```

## 12.12 Tabel `submission_answers`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| submission_id | BIGINT UNSIGNED |
| question_id | BIGINT UNSIGNED |
| question_text_snapshot | TEXT |
| option_label_snapshot | VARCHAR(191) |
| weight_snapshot | DECIMAL(8,2) |
| module | VARCHAR(30) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

## 12.13 Tabel `audit_logs`

| Kolom | Tipe |
|---|---|
| id | BIGINT UNSIGNED |
| user_id | BIGINT UNSIGNED NULL |
| action | VARCHAR(100) |
| entity_type | VARCHAR(100) |
| entity_id | BIGINT UNSIGNED NULL |
| old_value | JSON NULL |
| new_value | JSON NULL |
| ip_address | VARCHAR(45) NULL |
| user_agent | TEXT NULL |
| created_at | TIMESTAMP |

---

# 13. Relasi Database

```text
activities
   ├── participants
   └── submissions

schools
   ├── classes
   └── participants

participants
   ├── pre-test submission
   └── post-test submission

questions
   └── answer_options

submissions
   └── submission_answers

users
   └── audit_logs
```

---

# 14. Struktur Backend Laravel

Struktur yang direkomendasikan:

```text
app/
├── Actions/
├── Enums/
├── Http/
│   ├── Controllers/
│   │   ├── Participant/
│   │   └── Admin/
│   ├── Middleware/
│   └── Requests/
├── Models/
├── Policies/
├── Services/
│   ├── ParticipantCodeService.php
│   ├── ScoringService.php
│   ├── ComparisonService.php
│   ├── DuplicateDetectionService.php
│   ├── ParticipantMergeService.php
│   └── ExportService.php
└── Support/
```

## Prinsip backend

- Controller tetap tipis.
- Validasi menggunakan Form Request.
- Logika skor berada di service.
- Merge menggunakan database transaction.
- Hak akses menggunakan middleware dan policy.
- Query rekap menggunakan query builder atau Eloquent.
- Export menggunakan job jika data besar.
- Queue dapat menggunakan database driver pada MVP.

---

# 15. Struktur Frontend React + TypeScript

```text
resources/js/
├── Components/
│   ├── ui/
│   ├── forms/
│   ├── charts/
│   └── tables/
├── Layouts/
├── Pages/
│   ├── Participant/
│   └── Admin/
├── Hooks/
├── Types/
├── Utils/
└── app.tsx
```

## Library frontend

- React.
- TypeScript.
- Inertia.js.
- Tailwind CSS.
- shadcn/ui atau komponen berbasis Radix UI.
- React Hook Form.
- Zod.
- Recharts.
- TanStack Table.
- Lucide React.

## Catatan Vue

Vue 3 + TypeScript tetap dapat digunakan sebagai alternatif. Namun dokumen final ini memilih **React + TypeScript** agar:

- Kompatibel dengan shadcn/ui.
- Pilihan komponen dashboard lebih luas.
- Recharts mudah digunakan.
- Struktur TypeScript konsisten.

Apabila tim lebih menguasai Vue, React dapat diganti dengan Vue 3 dan komponen seperti shadcn-vue tanpa mengubah kebutuhan backend maupun database.

---

# 16. Konsep UI/UX

## 16.1 Arah visual

- Modern educational platform.
- Bersih dan profesional.
- Mobile-first.
- Whitespace cukup.
- Sudut komponen membulat secara moderat.
- Animasi halus.
- Ikon sederhana.
- Tidak terlalu banyak dekorasi.

## 16.2 Palet

| Fungsi | Rekomendasi |
|---|---|
| Primary | Indigo atau royal blue |
| Secondary | Cyan atau teal |
| Success | Hijau |
| Warning | Amber |
| Danger | Merah |
| Background | Off-white |
| Surface | Putih |
| Text | Slate gelap |

## 16.3 UI peserta

- Layout satu kolom.
- Kartu pertanyaan berukuran nyaman.
- Pilihan jawaban berbentuk selectable card.
- Progress bar.
- Tombol lanjut besar.
- Pesan validasi dekat input.
- Konfirmasi submit.
- Skeleton atau loading state.
- Optimal pada ponsel.

## 16.4 UI admin

- Sidebar collapsible.
- Header kegiatan aktif.
- Summary cards.
- Filter bar.
- Grafik interaktif.
- Tabel dengan pagination.
- Search dan sorting.
- Empty state.
- Toast notification.
- Modal konfirmasi.
- Badge status.

## 16.5 Aksesibilitas

- Navigasi keyboard.
- Label input yang jelas.
- Focus indicator.
- Kontras memadai.
- Informasi tidak hanya mengandalkan warna.
- Target sentuh cukup besar.
- Pesan kesalahan mudah dipahami.
- Elemen utama mendukung pembaca layar.

---

# 17. Kebutuhan Nonfungsional

## 17.1 Performa

- Landing page ditargetkan terbuka kurang dari 3 detik.
- Submit ditargetkan kurang dari 3 detik.
- Dashboard menggunakan pagination.
- Query memiliki index yang sesuai.
- Grafik menggunakan data agregat.
- Asset frontend dikompilasi menggunakan Vite.

## 17.2 Keamanan

- HTTPS wajib pada production.
- Admin menggunakan session authentication.
- CSRF protection Laravel.
- Password hashing bawaan Laravel.
- Validasi client dan server.
- Rate limiting pada submit dan login.
- Route admin dilindungi middleware.
- Query menggunakan Eloquent atau parameter binding.
- Output di-escape untuk mencegah XSS.
- Peserta tidak dapat membaca data peserta lain.
- Token hasil harus acak dan tidak mudah ditebak.
- Export hanya dapat dilakukan admin.
- Tindakan penting masuk audit log.

## 17.3 Integritas data

- Soal menggunakan soft delete.
- Bobot dan teks soal disimpan sebagai snapshot.
- Kategori hasil disimpan pada submission.
- Submit menggunakan transaction.
- Merge menggunakan transaction.
- Unique index mencegah pengisian ganda.
- Backup database dilakukan secara berkala.

## 17.4 Privasi

- Data hanya dikumpulkan sesuai kebutuhan.
- Peserta memperoleh informasi tujuan pengumpulan data.
- Terdapat checkbox persetujuan.
- Akses data dibatasi untuk admin.
- File export harus disimpan dan dibagikan secara aman.
- Retensi data ditentukan sebelum produksi.

## 17.5 Kompatibilitas

- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.
- Safari modern.
- Browser Android dan iOS modern.

---

# 18. Rekomendasi Tech Stack Final

| Lapisan | Teknologi |
|---|---|
| Backend Framework | Laravel 12 |
| Bahasa Backend | PHP 8.2 atau lebih baru |
| Frontend Framework | React |
| Bahasa Frontend | TypeScript |
| Bridge | Inertia.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui / Radix UI |
| Database | MySQL 8.0 |
| DB Management | phpMyAdmin / HeidiSQL |
| Authentication | Laravel Breeze / Fortify |
| Form | React Hook Form |
| Validation Frontend | Zod |
| Validation Backend | Laravel Form Request |
| Grafik | Recharts |
| Tabel | TanStack Table |
| Export Excel/CSV | Laravel Excel |
| Export PDF | DomPDF |
| QR Code | Simple QrCode |
| Testing Backend | Pest / PHPUnit |
| Testing Frontend | Vitest |
| End-to-End Test | Playwright |
| Cache/Queue MVP | Database driver |
| Web Server | Nginx atau Apache |
| Hosting | Hostinger Business/Cloud atau VPS |
| Monitoring | Laravel Log + Sentry opsional |

---

# 19. Arsitektur Sistem

```text
Browser
   ↓
React + TypeScript
   ↓
Inertia.js
   ↓
Laravel Routes dan Controllers
   ↓
Form Requests / Middleware / Policies
   ↓
Application Services
   ├── ParticipantCodeService
   ├── ScoringService
   ├── ComparisonService
   ├── DuplicateDetectionService
   ├── ParticipantMergeService
   └── ExportService
   ↓
Eloquent ORM
   ↓
MySQL
   ↓
phpMyAdmin untuk administrasi database
```

## Model deployment

```text
Domain
   ↓
Hostinger
   ├── Laravel
   ├── React build melalui Vite
   ├── MySQL
   └── phpMyAdmin
```

Aplikasi dapat berada dalam satu hosting sehingga frontend, backend, dan database lebih sederhana untuk dikelola.

---

# 20. Aturan Bisnis

1. Peserta tidak perlu login.
2. Setiap peserta memiliki kode unik.
3. Nama bukan primary identifier.
4. Pre-test dan post-test dipasangkan berdasarkan `participant_id`.
5. Satu peserta hanya boleh memiliki satu pre-test dan satu post-test per kegiatan.
6. Soal yang pernah digunakan tidak boleh dihapus permanen.
7. Perubahan bobot tidak mengubah hasil lama.
8. Perubahan kategori tidak mengubah hasil lama.
9. Merge hanya dapat dilakukan admin.
10. Sistem tidak melakukan merge otomatis.
11. Seluruh tindakan penting dicatat.
12. Export mengikuti filter aktif.
13. Scoring dilakukan di backend Laravel.
14. Peserta hanya dapat melihat hasil miliknya.
15. Semua proses submit penting menggunakan database transaction.

---

# 21. Acceptance Criteria MVP

MVP dinyatakan selesai apabila:

1. Peserta dapat membuka sistem tanpa login.
2. Sistem tersedia dalam dua bahasa.
3. Peserta dapat memilih pre-test atau post-test.
4. Peserta dapat memilih siswa atau guru.
5. Peserta dapat memasukkan kode.
6. Sistem menemukan identitas peserta.
7. Peserta dapat mengisi dua modul.
8. Laravel menghitung skor otomatis.
9. Sistem menentukan kategori.
10. Sistem menampilkan tips.
11. Admin dapat login.
12. Admin dapat mengelola kegiatan.
13. Admin dapat mengelola sekolah dan kelas.
14. Admin dapat menambah dan mengimpor peserta.
15. Sistem dapat membuat kode dan QR.
16. Admin dapat mengelola soal.
17. Admin dapat mengatur bobot dan kategori.
18. Dashboard menampilkan rekap.
19. Dashboard menampilkan pre-test dan post-test per peserta.
20. Sistem menghitung selisih skor.
21. Sistem menunjukkan peserta yang belum lengkap.
22. Sistem mencegah pengisian ganda.
23. Admin dapat mendeteksi dan merge peserta.
24. Data dapat diekspor ke CSV/Excel.
25. Laporan dapat diekspor ke PDF.
26. Sistem responsif.
27. Hasil lama tetap valid setelah konfigurasi berubah.
28. Sistem dapat di-deploy di Hostinger dengan MySQL.

---

# 22. Tahapan Pengembangan

## Fase 1 — Fondasi

- Setup Laravel.
- Setup React, TypeScript, Inertia, dan Vite.
- Setup Tailwind dan komponen UI.
- Setup MySQL.
- Membuat migration.
- Membuat autentikasi admin.
- Membuat layout dan design system.

## Fase 2 — Master Data

- Kegiatan.
- Sekolah.
- Kelas.
- Peserta.
- Import peserta.
- Kode dan QR.

## Fase 3 — Sisi Peserta

- Landing page.
- Pilihan mode.
- Pilihan peran.
- Identifikasi peserta.
- Dua modul.
- Progress.
- Submit transaction.
- Scoring.
- Hasil.
- Tips.
- Dwibahasa.

## Fase 4 — Dashboard Admin

- Summary cards.
- Grafik.
- Filter.
- Manajemen soal.
- Bobot.
- Kategori.
- Tips.
- Detail hasil.

## Fase 5 — Perbandingan dan Kualitas Data

- Perbandingan individu.
- Perbandingan agregat.
- Status data lengkap.
- Pencegahan duplikasi.
- Deteksi data ganda.
- Merge peserta.
- Audit log.

## Fase 6 — Pelaporan

- Export CSV/Excel.
- Export PDF.
- Grafik laporan.

## Fase 7 — Pengujian dan Deployment

- Unit test scoring.
- Test pencocokan peserta.
- Test unique constraint.
- Test hak akses.
- Test responsivitas.
- Test dwibahasa.
- User acceptance testing.
- Deployment Hostinger.
- Konfigurasi cron, queue, backup, dan log.

---

# 23. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Peserta lupa kode | Pre/post tidak terhubung | QR, kartu kode, bantuan admin |
| Peserta memakai kode orang lain | Data salah | Konfirmasi identitas |
| Nama peserta berbeda | Dianggap orang berbeda | Gunakan participant ID |
| Pengisian ganda | Nilai bias | Validasi backend dan unique index |
| Bobot berubah | Hasil lama tidak konsisten | Snapshot bobot |
| Soal dihapus | Histori rusak | Soft delete |
| Merge salah | Data tercampur | Preview, konfirmasi, audit log |
| Koneksi terputus | Jawaban hilang | Draft lokal dan retry |
| Import gagal sebagian | Data tidak lengkap | Transaction dan laporan error |
| Database rusak | Kehilangan data | Backup rutin |
| Shared hosting terbatas | Fitur lambat | Optimasi query atau upgrade VPS |

---

# 24. Keputusan Final

Stack utama:

```text
Laravel 12
PHP 8.2+
React
TypeScript
Inertia.js
Vite
Tailwind CSS
shadcn/ui
MySQL 8.0
phpMyAdmin
Recharts
Laravel Excel
DomPDF
Hostinger
```

Skema identitas:

```text
Kode peserta unik
      ↓
participants.id
      ↓
Pre-Test Submission
      ↓
Post-Test Submission
      ↓
Dashboard membandingkan skor setiap peserta
```

Dengan rancangan ini, peserta tetap mengisi tanpa login, sementara backend Laravel dan database MySQL dapat menghubungkan pre-test dengan post-test secara akurat meskipun nama peserta ditulis berbeda.
