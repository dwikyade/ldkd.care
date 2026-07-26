# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## LDKD Care — Web Kuesioner Literasi Digital dan Keamanan Digital

**Versi:** 2.1 Final  
**Jenis Produk:** Aplikasi web  
**Target Pengguna:** Siswa, guru, dan tim pengabdian  
**Bahasa:** Bahasa Indonesia dan Bahasa Inggris  
**Model Akses:** Peserta tanpa login, admin wajib login  

### Tech Stack Final

- **Backend:** Laravel 12, PHP 8.2+
- **Frontend:** React + TypeScript
- **Bridge:** Inertia.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui atau Radix UI
- **Animation:** Framer Motion
- **Database:** MySQL 8
- **Database Management:** phpMyAdmin / HeidiSQL
- **Charts:** Recharts
- **Export:** Laravel Excel dan DomPDF
- **Hosting:** Hostinger Business/Cloud atau VPS

---

# 1. Ringkasan Produk

LDKD Care adalah aplikasi web untuk mengukur tingkat **Literasi Digital** dan **Keamanan Digital** peserta melalui kuesioner terstruktur.

Struktur sisi publik menggunakan pola pengalaman yang mirip dengan SDQ Care:

1. Pengguna membuka landing page.
2. Pengguna membaca penjelasan sistem.
3. Pengguna memahami dua area penilaian.
4. Pengguna menekan tombol untuk mulai mengisi kuesioner.
5. Pengguna memilih jenis tes.
6. Pengguna memilih peran.
7. Pengguna memasukkan kode peserta.
8. Pengguna mengisi kuesioner.
9. Sistem menghitung skor.
10. Pengguna melihat hasil dan rekomendasi.

Peserta tidak perlu membuat akun. Setiap peserta menggunakan **kode peserta unik** agar hasil pre-test dan post-test dapat dihubungkan secara akurat meskipun penulisan nama berbeda.

Admin memiliki dashboard untuk mengelola kegiatan, peserta, soal, bobot, kategori, hasil, perbandingan pre-test dan post-test, serta laporan.

---

# 2. Tujuan Produk

LDKD Care dikembangkan untuk:

1. Mempermudah siswa dan guru mengisi pre-test dan post-test.
2. Menjelaskan Literasi Digital dan Keamanan Digital melalui landing page.
3. Mengukur skor kedua modul secara otomatis.
4. Menentukan kategori hasil secara otomatis.
5. Memberikan rekomendasi edukatif berdasarkan hasil.
6. Menghubungkan pre-test dan post-test peserta yang sama.
7. Menampilkan perubahan skor setiap peserta.
8. Menyediakan dashboard evaluasi bagi tim pengabdian.
9. Menyediakan export Excel, CSV, dan PDF.
10. Menyediakan UI modern, responsif, dan interaktif.
11. Memberikan animasi halus tanpa mengurangi performa.
12. Menjaga aksesibilitas dan kenyamanan pengguna.

---

# 3. Prinsip Desain

- **Mudah dipahami:** fungsi sistem langsung terlihat dari landing page.
- **Tanpa hambatan:** peserta tidak diwajibkan membuat akun.
- **Terarah:** proses pengisian dibagi dalam langkah yang jelas.
- **Modern:** menggunakan kartu, ilustrasi, whitespace, dan animasi halus.
- **Responsif:** nyaman digunakan di ponsel, tablet, dan desktop.
- **Aksesibel:** informasi tidak hanya disampaikan melalui warna.
- **Cepat:** animasi tidak menghambat interaksi utama.
- **Konsisten:** seluruh komponen mengikuti satu design system.

---

# 4. Ruang Lingkup Produk

## 4.1 Fitur Peserta

- Landing page informatif.
- Penjelasan LDKD Care.
- Penjelasan Literasi Digital.
- Penjelasan Keamanan Digital.
- Penjelasan pre-test dan post-test.
- Penjelasan cara kerja.
- Tombol **Isi Kuesioner Sekarang**.
- Pilihan Bahasa Indonesia dan Inggris.
- Pilihan Pre-Test atau Post-Test.
- Pilihan peran Siswa atau Guru.
- Input kode peserta.
- Scan QR peserta.
- Konfirmasi identitas.
- Instruksi kuesioner.
- Modul Literasi Digital.
- Modul Keamanan Digital.
- Progress pengisian.
- Penyimpanan jawaban sementara.
- Review jawaban.
- Konfirmasi sebelum submit.
- Penghitungan skor otomatis.
- Halaman hasil.
- Tips edukasi.

## 4.2 Fitur Admin

- Login admin.
- Dashboard rekap.
- Manajemen kegiatan.
- Manajemen sekolah dan kelas.
- Manajemen peserta.
- Import peserta CSV/XLSX.
- Pembuatan kode peserta.
- Pembuatan QR peserta.
- Manajemen soal.
- Pengaturan pilihan jawaban.
- Pengaturan bobot.
- Pengaturan kategori.
- Manajemen tips.
- Rekap hasil.
- Perbandingan individu.
- Perbandingan agregat.
- Deteksi kemungkinan data ganda.
- Merge peserta.
- Export Excel/CSV.
- Export PDF.
- Audit log.

## 4.3 Di Luar MVP

- Login siswa atau guru.
- Forum diskusi.
- E-learning.
- Sertifikat otomatis.
- Pembayaran.
- Chat langsung.
- Integrasi WhatsApp.
- Aplikasi mobile native.
- Penilaian psikologis.
- Fitur SDQ.

---

# 5. Target Pengguna

## 5.1 Siswa

Siswa mengisi pre-test dan post-test untuk mengetahui tingkat pemahaman mengenai literasi digital dan keamanan digital.

## 5.2 Guru

Guru mengikuti alur yang sama, tetapi hasilnya dapat dianalisis secara terpisah.

## 5.3 Admin

Admin adalah tim pengabdian yang mengelola kegiatan, peserta, soal, hasil, dan laporan.

---

# 6. Struktur Hak Akses

| Fitur | Peserta | Admin |
|---|---:|---:|
| Membuka landing page | Ya | Ya |
| Membaca informasi sistem | Ya | Ya |
| Mengisi kuesioner | Ya | Tidak |
| Memilih pre-test/post-test | Ya | Tidak |
| Memasukkan kode peserta | Ya | Tidak |
| Melihat hasil pribadi | Ya | Tidak |
| Login admin | Tidak | Ya |
| Mengelola peserta | Tidak | Ya |
| Mengelola soal dan bobot | Tidak | Ya |
| Melihat seluruh hasil | Tidak | Ya |
| Membandingkan pre/post | Tidak | Ya |
| Export laporan | Tidak | Ya |
| Melihat audit log | Tidak | Ya |

---

# 7. Struktur Landing Page

Landing page menjadi halaman awal yang memperkenalkan sistem sebelum pengguna mengisi kuesioner.

## 7.1 Navbar

Isi:

- Logo LDKD Care.
- Beranda.
- Tentang.
- Literasi Digital.
- Keamanan Digital.
- Cara Kerja.
- Pilihan bahasa.
- Tombol **Isi Kuesioner**.

Perilaku:

- Transparan saat berada di bagian paling atas.
- Berubah menjadi solid dengan backdrop blur ketika di-scroll.
- Sticky di bagian atas.
- Pada mobile berubah menjadi hamburger menu.

## 7.2 Hero Section

Isi:

- Badge kecil: **Digital Literacy & Data Security Assessment**.
- Judul utama.
- Deskripsi singkat.
- Tombol utama **Isi Kuesioner Sekarang**.
- Tombol sekunder **Pelajari Sistem**.
- Ilustrasi modern bertema teknologi, edukasi, dan keamanan.
- Informasi bahwa peserta tidak perlu login.

Contoh judul:

> Kenali Tingkat Literasi Digital dan Keamanan Digital Anda

Contoh deskripsi:

> LDKD Care membantu siswa dan guru mengukur pemahaman mengenai penggunaan teknologi digital serta perlindungan data melalui pre-test dan post-test yang terstruktur.

## 7.3 Statistik Singkat

- 2 modul penilaian.
- 2 mode tes.
- Skor otomatis.
- Tanpa akun peserta.

## 7.4 Tentang LDKD Care

Menjelaskan:

- Apa itu LDKD Care.
- Mengapa sistem dibuat.
- Siapa yang dapat menggunakannya.
- Hasil apa yang diperoleh.

Layout dua kolom: ilustrasi dan teks manfaat.

## 7.5 Section Literasi Digital

Menjelaskan kemampuan untuk:

- Mengakses informasi.
- Memahami informasi.
- Memverifikasi sumber.
- Menggunakan teknologi secara bertanggung jawab.
- Berkomunikasi secara etis di ruang digital.

Aksen visual menggunakan biru atau indigo.

## 7.6 Section Keamanan Digital

Menjelaskan kemampuan untuk:

- Melindungi akun.
- Membuat kata sandi kuat.
- Menjaga OTP.
- Mengenali phishing.
- Mengatur privasi.
- Melindungi data pribadi.

Aksen visual menggunakan cyan atau teal.

## 7.7 Perbedaan Pre-Test dan Post-Test

### Pre-Test

- Dilakukan sebelum sosialisasi.
- Mengukur pemahaman awal.
- Menjadi dasar evaluasi.

### Post-Test

- Dilakukan setelah sosialisasi.
- Mengukur perubahan pemahaman.
- Dibandingkan dengan hasil pre-test.

## 7.8 Cara Kerja

1. Pilih jenis pengisian.
2. Pilih peran.
3. Masukkan kode peserta.
4. Isi dua modul.
5. Lihat skor dan rekomendasi.

Desktop menggunakan timeline horizontal, sedangkan mobile menggunakan timeline vertikal.

## 7.9 Keunggulan Sistem

- Tanpa login peserta.
- Hasil otomatis.
- Data pre-test dan post-test terhubung.
- Responsif.
- Dwibahasa.
- Aman dan terstruktur.

## 7.10 Call to Action

Teks:

> Siap mengetahui tingkat Literasi Digital dan Keamanan Digital Anda?

Tombol:

- **Mulai Isi Kuesioner**.
- **Kembali ke Atas**.

## 7.11 Footer

- Logo.
- Deskripsi singkat.
- Navigasi.
- Kontak tim pengabdian.
- Kebijakan privasi.
- Hak cipta.
- Versi sistem.

### Acceptance Criteria Landing Page

- Dapat dibuka tanpa login.
- Semua section dapat diakses melalui navbar.
- CTA mengarah ke pemilihan mode.
- Responsif di semua ukuran layar.
- Animasi tidak mengganggu performa.
- Konten tersedia dalam dua bahasa.
- Mobile navigation berfungsi.
- Semua tombol memiliki hover dan focus state.

---

# 8. Alur Peserta

```text
Landing Page
    ↓
Klik Isi Kuesioner
    ↓
Pilih Pre-Test atau Post-Test
    ↓
Pilih Siswa atau Guru
    ↓
Masukkan Kode Peserta / Scan QR
    ↓
Konfirmasi Identitas
    ↓
Baca Instruksi
    ↓
Isi Modul Literasi Digital
    ↓
Isi Modul Keamanan Digital
    ↓
Review Jawaban
    ↓
Submit
    ↓
Laravel Menghitung Skor
    ↓
Hasil dan Tips Edukasi
```

---

# 9. Kebutuhan Fungsional Peserta

## FR-01 — Pilihan Jenis Pengisian

Pengguna memilih Pre-Test atau Post-Test melalui dua kartu besar.

### Acceptance Criteria

- Hanya satu mode dapat dipilih.
- Tombol lanjut aktif setelah memilih.
- Pilihan tersimpan selama sesi.
- Status terpilih terlihat jelas.

## FR-02 — Pilihan Peran

Pengguna memilih Siswa atau Guru.

### Acceptance Criteria

- Hanya satu peran dipilih.
- Peran divalidasi dengan data peserta.
- Error ditampilkan jika tidak sesuai.

## FR-03 — Identifikasi Peserta

Peserta memasukkan kode, misalnya:

```text
LDKD-A7K92
```

### Acceptance Criteria

- Kode divalidasi oleh Laravel.
- Sistem tidak menampilkan daftar peserta.
- Kode salah menghasilkan pesan yang jelas.
- Data peserta ditampilkan untuk konfirmasi.
- Nama bukan identitas utama.

## FR-04 — Konfirmasi Identitas

Menampilkan:

- Nama.
- Sekolah.
- Kelas.
- Peran.
- Jenis tes.
- Tombol **Ya, Ini Data Saya**.
- Tombol **Bukan Saya**.

## FR-05 — Instruksi Kuesioner

Menampilkan:

- Jumlah modul.
- Perkiraan waktu.
- Penjelasan skala jawaban.
- Informasi seluruh soal wajib dijawab.
- Informasi jawaban tidak dapat diubah setelah submit.
- Checkbox persetujuan.

## FR-06 — Modul Literasi Digital

Setiap pertanyaan ditampilkan pada kartu dengan nomor, teks, pilihan jawaban, progress, dan navigasi.

## FR-07 — Modul Keamanan Digital

Menggunakan struktur yang sama dengan modul Literasi Digital.

### Acceptance Criteria Kedua Modul

- Semua soal wajib dijawab.
- Jawaban tidak hilang saat berpindah langkah.
- Peserta dapat kembali ke soal sebelumnya.
- Bahasa mengikuti pilihan aktif.
- Hanya soal aktif yang ditampilkan.

## FR-08 — Review Jawaban

Menampilkan:

- Status setiap modul.
- Jumlah soal dijawab.
- Daftar soal belum dijawab.
- Tombol edit.
- Tombol submit.

## FR-09 — Submit dan Scoring

Laravel melakukan:

1. Validasi peserta.
2. Pemeriksaan pengisian ganda.
3. Validasi seluruh jawaban.
4. Pengambilan bobot.
5. Penghitungan skor.
6. Penentuan kategori.
7. Penyimpanan dengan database transaction.
8. Pembuatan token hasil.

## FR-10 — Halaman Hasil

Menampilkan:

- Nama.
- Jenis tes.
- Skor dan kategori Literasi Digital.
- Skor dan kategori Keamanan Digital.
- Tips edukasi.
- Tanggal pengisian.

Visual menggunakan dua kartu skor, progress ring/bar, badge kategori, dan ikon modul.

---

# 10. Identitas Peserta

- Setiap peserta memiliki satu `participant_id`.
- Setiap peserta memiliki kode unik.
- Nama boleh berbeda penulisan.
- Pre-test dan post-test disimpan sebagai dua submission.
- Keduanya dihubungkan melalui `participant_id`.

Constraint MySQL:

```sql
UNIQUE KEY unique_activity_code (
    activity_id,
    participant_code
);
```

```sql
UNIQUE KEY unique_participant_test (
    activity_id,
    participant_id,
    test_type
);
```

---

# 11. Dashboard Admin

## 11.1 Layout

- Sidebar collapsible.
- Topbar.
- Breadcrumb.
- Filter kegiatan.
- Content area.
- Toast notification.
- User menu.

## 11.2 Summary Cards

- Total peserta.
- Total pre-test.
- Total post-test.
- Peserta lengkap.
- Peserta belum lengkap.
- Rata-rata Literasi Digital.
- Rata-rata Keamanan Digital.
- Jumlah sekolah.

## 11.3 Grafik

- Pre-test vs post-test.
- Distribusi kategori.
- Hasil per sekolah.
- Hasil per kelas.
- Tren pengisian.
- Persentase peningkatan.

## 11.4 Tabel Perbandingan Individu

| Peserta | Pre Literasi | Post Literasi | Selisih | Pre Keamanan | Post Keamanan | Selisih | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| Rizal Afandi | 62 | 84 | +22 | 65 | 86 | +21 | Lengkap |

---

# 12. Kebutuhan Admin

- **FR-11:** Login admin menggunakan Laravel Breeze/Fortify.
- **FR-12:** Manajemen kegiatan.
- **FR-13:** Manajemen sekolah dan kelas.
- **FR-14:** Manajemen peserta dan import CSV/XLSX.
- **FR-15:** Manajemen soal bilingual.
- **FR-16:** Pengaturan pilihan dan bobot.
- **FR-17:** Pengaturan kategori.
- **FR-18:** Manajemen tips edukasi.
- **FR-19:** Perbandingan pre-test dan post-test.
- **FR-20:** Deteksi kemungkinan data ganda.
- **FR-21:** Merge peserta setelah verifikasi admin.
- **FR-22:** Export CSV, Excel, dan PDF.
- **FR-23:** Audit log.

---

# 13. Instruksi UI/UX

## 13.1 Gaya Visual

- Modern.
- Bersih.
- Edukatif.
- Profesional tetapi tetap ramah untuk siswa.
- Tidak terlalu banyak warna.
- Rounded corner 12–20 px.
- Shadow lembut.
- Border tipis.
- Whitespace luas.
- Gradien halus.
- Ikon outline.
- Ilustrasi flat atau 3D ringan.
- Pola abstrak lembut di background.

## 13.2 Tipografi

- Heading: Plus Jakarta Sans atau Manrope.
- Body: Inter.
- Hero desktop: 48–72 px.
- Hero mobile: 34–44 px.
- Body text: 16–18 px.
- Line height: 1.5–1.7.

## 13.3 Warna

| Fungsi | Warna |
|---|---|
| Primary | Indigo |
| Secondary | Cyan |
| Literasi Digital | Blue/Indigo |
| Keamanan Digital | Teal/Cyan |
| Success | Emerald |
| Warning | Amber |
| Danger | Rose |
| Background | Slate 50 / Off-white |
| Text | Slate 900 |

Contoh:

```text
Primary: #4F46E5
Secondary: #06B6D4
Success: #10B981
Warning: #F59E0B
Danger: #F43F5E
Background: #F8FAFC
Text: #0F172A
```

## 13.4 Komponen Utama

- Navbar sticky.
- Hero section.
- Feature cards.
- Module cards.
- Timeline.
- CTA banner.
- Stepper.
- Progress bar.
- Selectable cards.
- Input dengan label jelas.
- Modal konfirmasi.
- Toast notification.
- Skeleton loading.
- Empty state.
- Data table.
- Chart cards.
- Badge status.

---

# 14. Instruksi Animasi Modern

Gunakan **Framer Motion**.

## 14.1 Prinsip Animasi

- Halus dan tidak berlebihan.
- Durasi umum 200–600 ms.
- Gunakan easing natural.
- Animasi hanya mendukung hierarki dan feedback.
- Tidak boleh menghambat proses pengisian.
- Wajib mendukung `prefers-reduced-motion`.

## 14.2 Navbar

- Fade in dari atas saat pertama dimuat.
- Background berubah transparan menjadi semi-solid saat scroll.
- Backdrop blur aktif setelah scroll.
- Menu mobile slide dari kanan.

## 14.3 Hero

Urutan animasi:

1. Badge fade + slide-up.
2. Judul muncul per baris.
3. Deskripsi muncul setelah judul.
4. Tombol scale-up ringan.
5. Ilustrasi fade dari kanan.
6. Dekorasi bergerak perlahan.

Rekomendasi durasi:

```text
Badge: 0.4 detik
Judul: 0.6 detik
Deskripsi: 0.5 detik
Button: 0.4 detik
Illustration: 0.8 detik
```

## 14.4 Floating Elements

```text
translateY: 0 → -10 → 0
duration: 4–6 detik
repeat: infinite
```

Gunakan maksimal beberapa elemen agar tampilan tidak ramai.

## 14.5 Section Reveal

Saat masuk viewport:

- Opacity 0 ke 1.
- Translate Y 30 px ke 0.
- Stagger kartu 80–120 ms.

## 14.6 Cards

Hover:

- Translate Y -4 px.
- Shadow meningkat sedikit.
- Border berubah ke warna primary.
- Ikon scale 1 ke 1.05.
- Durasi 180–250 ms.

## 14.7 Timeline

- Garis tumbuh dari kiri ke kanan pada desktop.
- Garis tumbuh dari atas ke bawah pada mobile.
- Langkah muncul berurutan.

## 14.8 Counter

Statistik dapat menghitung dari 0 ketika masuk viewport. Animasi hanya dimainkan sekali.

## 14.9 CTA

- Gradient bergerak sangat lambat.
- Tombol memiliki glow lembut saat hover.
- Hindari efek neon berlebihan.

## 14.10 Page Transition Kuesioner

- Halaman lama fade out 150 ms.
- Halaman baru slide 20 px dari kanan dan fade in 250 ms.
- Saat kembali, halaman masuk dari kiri.

## 14.11 Selectable Card

Saat dipilih:

- Border dan background berubah.
- Checkmark muncul.
- Scale 1 → 1.02 → 1.

## 14.12 Progress Bar

- Lebar berubah dengan spring ringan.
- Angka progress menggunakan fade transition.

## 14.13 Validation Error

- Input shake ringan satu kali.
- Pesan error fade + slide-down.
- Tidak menggunakan shake berulang.

## 14.14 Submit Button

Saat submit:

- Tombol menjadi loading.
- Spinner muncul.
- Teks menjadi **Menyimpan Jawaban**.
- Tombol disabled.
- Setelah berhasil muncul checkmark.

## 14.15 Halaman Hasil

- Kartu skor masuk dengan stagger.
- Progress ring bergerak dari 0 ke nilai hasil.
- Badge kategori scale-in.
- Tips fade-in setelah skor.
- Animasi dimainkan sekali.

## 14.16 Dashboard Admin

- Sidebar collapse dengan smooth transition.
- Summary cards stagger ringan.
- Grafik menggunakan animasi sekali.
- Filter panel slide-down.
- Modal fade + scale.
- Toast slide dari kanan.
- Tabel tidak menggunakan animasi berat.

## 14.17 Motion Accessibility

- Gunakan `useReducedMotion()`.
- Nonaktifkan parallax jika reduced motion aktif.
- Gunakan opacity transition sederhana.
- Hindari flashing.
- Hindari gerakan besar berulang.
- Semua fungsi harus tetap berjalan tanpa animasi.

---

# 15. Responsivitas

## Mobile

- Navbar menjadi hamburger.
- Hero satu kolom.
- Ilustrasi berada di bawah teks.
- Timeline vertikal.
- CTA full width.
- Form satu kolom.
- Sidebar admin menjadi drawer.

## Tablet

- Hero dua kolom bila ruang cukup.
- Kartu dua kolom.
- Dashboard grid fleksibel.

## Desktop

- Hero dua kolom.
- Feature cards tiga kolom.
- Sidebar admin permanen.
- Grafik dua kolom.
- Tabel penuh.

---

# 16. Struktur Database MySQL

Tabel utama:

- `users`
- `activities`
- `schools`
- `classes`
- `participants`
- `questions`
- `answer_options`
- `category_thresholds`
- `educational_tips`
- `submissions`
- `submission_answers`
- `audit_logs`

## 16.1 Tabel `participants`

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

## 16.2 Tabel `submissions`

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

---

# 17. Struktur Backend Laravel

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

---

# 18. Struktur Frontend React + TypeScript

```text
resources/js/
├── Components/
│   ├── ui/
│   ├── landing/
│   ├── questionnaire/
│   ├── charts/
│   └── tables/
├── Layouts/
├── Pages/
│   ├── Public/
│   ├── Participant/
│   └── Admin/
├── Hooks/
├── Types/
├── Utils/
├── Motion/
└── app.tsx
```

Folder `Motion` berisi animation variants, page transition, stagger, reduced-motion helper, dan scroll reveal.

---

# 19. Tech Stack Final

| Lapisan | Teknologi |
|---|---|
| Backend | Laravel 12 |
| Backend Language | PHP 8.2+ |
| Frontend | React |
| Frontend Language | TypeScript |
| Bridge | Inertia.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Library | shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Form | React Hook Form |
| Validation Frontend | Zod |
| Validation Backend | Laravel Form Request |
| Database | MySQL 8 |
| Database Management | phpMyAdmin |
| Chart | Recharts |
| Table | TanStack Table |
| Export Excel | Laravel Excel |
| Export PDF | DomPDF |
| QR | Simple QrCode |
| Testing | Pest, Vitest, Playwright |
| Hosting | Hostinger |

---

# 20. Arsitektur Sistem

```text
Browser
   ↓
React + TypeScript + Framer Motion
   ↓
Inertia.js
   ↓
Laravel Routes dan Controllers
   ↓
Form Request / Middleware / Policy
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
phpMyAdmin
```

---

# 21. Acceptance Criteria MVP

MVP dinyatakan selesai apabila:

1. Landing page menjelaskan LDKD Care.
2. Landing page menjelaskan Literasi Digital.
3. Landing page menjelaskan Keamanan Digital.
4. Landing page memiliki CTA pengisian.
5. Landing page responsif.
6. Landing page memiliki animasi modern.
7. Peserta dapat memilih pre-test atau post-test.
8. Peserta dapat memilih peran.
9. Peserta dapat memasukkan kode.
10. Sistem memvalidasi identitas.
11. Peserta dapat mengisi dua modul.
12. Laravel menghitung skor.
13. Sistem menentukan kategori.
14. Sistem menampilkan tips.
15. Admin dapat login.
16. Admin dapat mengelola peserta.
17. Admin dapat mengelola soal.
18. Admin dapat mengatur bobot.
19. Dashboard menampilkan rekap.
20. Dashboard membandingkan pre-test dan post-test.
21. Sistem mencegah pengisian ganda.
22. Data dapat diekspor.
23. Sistem dapat dijalankan di Hostinger.
24. Animasi mendukung reduced motion.
25. Performa tetap baik pada perangkat mobile.

---

# 22. Tahapan Pengembangan

## Fase 1 — Fondasi

- Setup Laravel.
- Setup React, TypeScript, dan Inertia.
- Setup Tailwind dan shadcn/ui.
- Setup Framer Motion.
- Setup MySQL.
- Design system.
- Autentikasi admin.

## Fase 2 — Landing Page

- Navbar.
- Hero.
- Tentang LDKD.
- Literasi Digital.
- Keamanan Digital.
- Pre-Test dan Post-Test.
- Cara kerja.
- Keunggulan.
- CTA.
- Footer.
- Animasi scroll dan hover.

## Fase 3 — Peserta

- Pilihan mode.
- Pilihan peran.
- Identifikasi.
- Konfirmasi.
- Instruksi.
- Kuesioner.
- Review.
- Submit.
- Hasil.

## Fase 4 — Admin

- Dashboard.
- Kegiatan.
- Sekolah.
- Kelas.
- Peserta.
- Soal.
- Bobot.
- Kategori.
- Tips.

## Fase 5 — Analisis

- Perbandingan individu.
- Perbandingan agregat.
- Deteksi duplikat.
- Merge peserta.
- Audit log.

## Fase 6 — Export dan Deployment

- Excel.
- CSV.
- PDF.
- Testing.
- Optimasi.
- Deployment Hostinger.

---

# 23. Keputusan Final

Sisi publik LDKD Care menggunakan landing page informatif dengan pola alur seperti SDQ Care, tetapi seluruh konten dan identitas visual dibuat khusus untuk Literasi Digital dan Keamanan Digital.

Alur final:

```text
Landing Page Informatif
        ↓
Isi Kuesioner
        ↓
Pilih Pre-Test/Post-Test
        ↓
Pilih Peran
        ↓
Masukkan Kode Peserta
        ↓
Isi Dua Modul
        ↓
Hasil dan Tips
```

Tech stack final:

```text
Laravel 12
PHP 8.2+
React
TypeScript
Inertia.js
Tailwind CSS
shadcn/ui
Framer Motion
MySQL
phpMyAdmin
Hostinger
```
