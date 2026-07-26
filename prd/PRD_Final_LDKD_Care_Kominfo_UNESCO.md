# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## LDKD Care — Sistem Evaluasi Literasi Digital dan Keamanan Digital

**Versi:** 3.0 Final  
**Status:** Final untuk pengembangan  
**Jenis Produk:** Aplikasi web  
**Target Pengguna:** Siswa, guru, dan tim pengabdian  
**Platform:** Desktop, tablet, dan perangkat seluler  
**Bahasa:** Bahasa Indonesia dan Bahasa Inggris  
**Akses Peserta:** Tanpa login  
**Akses Admin:** Wajib login

---

# 1. Ringkasan Produk

LDKD Care adalah aplikasi web untuk mengukur tingkat literasi digital dan keamanan digital peserta melalui mekanisme Pre-Test dan Post-Test.

Instrumen utama menggunakan indikator yang diadaptasi dari **Indeks Literasi Digital Indonesia 2022 Kominfo**, sedangkan **UNESCO Digital Literacy Global Framework (DLGF)** digunakan sebagai kerangka pengembangan, pemetaan kompetensi, validasi cakupan, serta dasar pengembangan soal berbasis kasus.

Sistem memiliki dua kelompok pengguna:

1. **Peserta**, terdiri atas siswa dan guru yang dapat mengisi kuesioner tanpa membuat akun.
2. **Admin**, yaitu tim pengabdian yang mengelola peserta, soal, bobot, hasil, dashboard, dan laporan.

Setiap peserta membuat kode unik sendiri saat pertama kali mengisi Pre-Test. Kode tersebut digunakan untuk:

- menghubungkan Pre-Test dan Post-Test;
- menyimpan progres pengisian;
- melanjutkan sesi yang belum selesai;
- menghindari pencocokan hanya berdasarkan nama;
- mencegah duplikasi pengisian.

---

# 2. Dasar Konseptual dan Instrumen

## 2.1 Instrumen Utama: Kominfo 2022

LDKD Care menggunakan empat pilar utama:

1. **Digital Skill**
2. **Digital Ethics**
3. **Digital Safety**
4. **Digital Culture**

Keempat pilar tersebut menjadi dasar utama pengukuran.

Pemetaan ke dua modul utama sistem:

```text
Modul Literasi Digital
├── Digital Skill
├── Digital Ethics
└── Digital Culture

Modul Keamanan Digital
└── Digital Safety
```

Walaupun pada sisi peserta sistem ditampilkan dalam dua modul, dashboard admin dan hasil analisis tetap menampilkan skor keempat pilar secara terpisah.

## 2.2 Kerangka Pengembangan: UNESCO DLGF

UNESCO DLGF digunakan untuk memperluas dan memvalidasi cakupan kompetensi, khususnya:

- Devices and Software Operations
- Information and Data Literacy
- Communication and Collaboration
- Digital Content Creation
- Safety
- Problem Solving
- Career-Related Competences

Kerangka UNESCO tidak digunakan sebagai pengganti langsung instrumen Kominfo, tetapi sebagai:

- referensi pemetaan kompetensi;
- dasar pengembangan soal kasus;
- dasar penentuan tingkat kemampuan;
- dasar pengembangan versi lanjutan;
- acuan agar instrumen tetap kontekstual dan tidak hanya berbasis persepsi.

## 2.3 Model Pengukuran

LDKD Care menggunakan dua jenis penilaian:

### A. Self-Assessment

Peserta menilai kemampuan atau kebiasaannya sendiri.

Contoh:

```text
Saya dapat membedakan pesan phishing dengan pesan resmi.
```

### B. Knowledge-Based / Scenario-Based Assessment

Peserta menjawab kasus untuk mengukur pemahaman nyata.

Contoh:

```text
Anda menerima pesan yang meminta kode OTP dan mengatasnamakan pihak sekolah.
Apa tindakan yang paling tepat?
```

Versi MVP dapat memprioritaskan self-assessment berdasarkan Kominfo, sedangkan soal kasus dikembangkan secara bertahap berdasarkan UNESCO DLGF.

---

# 3. Tujuan Produk

LDKD Care bertujuan untuk:

1. Mengukur tingkat literasi digital peserta.
2. Mengukur tingkat keamanan digital peserta.
3. Mengetahui kondisi peserta sebelum sosialisasi.
4. Mengukur perubahan pemahaman setelah sosialisasi.
5. Membandingkan hasil Pre-Test dan Post-Test setiap peserta.
6. Menampilkan skor keempat pilar secara terpisah.
7. Menyediakan hasil yang mudah dipahami.
8. Memberikan rekomendasi edukatif berdasarkan hasil.
9. Membantu tim pengabdian menyusun laporan.
10. Menyediakan sistem yang modern, responsif, dan mudah digunakan.
11. Menjaga validitas data lama ketika instrumen diperbarui.
12. Mengembangkan asesmen yang lebih kontekstual dan berbasis kasus.

---

# 4. Sasaran Keberhasilan

Produk dianggap berhasil apabila:

- peserta dapat mengisi tanpa akun;
- peserta dapat membuat kode sendiri;
- Pre-Test dan Post-Test terhubung dengan peserta yang sama;
- peserta dapat melanjutkan sesi yang belum selesai;
- Post-Test tidak dapat diisi sebelum Pre-Test selesai;
- skor empat pilar dapat dihitung;
- sistem dapat menampilkan hasil per modul dan per pilar;
- dashboard dapat membandingkan nilai Pre-Test dan Post-Test;
- instrumen dapat dikelola dan diberi versi;
- soal dapat dipetakan ke Kominfo dan UNESCO DLGF;
- data dapat diekspor ke Excel, CSV, dan PDF;
- tampilan berjalan baik di ponsel.

---

# 5. Tech Stack Final

| Lapisan | Teknologi |
|---|---|
| Backend Framework | Laravel 12 |
| Backend Language | PHP 8.2+ |
| Frontend Framework | React |
| Frontend Language | TypeScript |
| Bridge | Inertia.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui atau Radix UI |
| Animation | Framer Motion |
| Database | MySQL 8 |
| Database Management | phpMyAdmin / HeidiSQL |
| Authentication | Laravel Breeze / Fortify |
| Forms | React Hook Form |
| Frontend Validation | Zod |
| Backend Validation | Laravel Form Request |
| Charts | Recharts |
| Tables | TanStack Table |
| Excel/CSV Export | Laravel Excel |
| PDF Export | DomPDF |
| QR Code | Simple QrCode |
| Backend Testing | Pest / PHPUnit |
| Frontend Testing | Vitest |
| E2E Testing | Playwright |
| Hosting | Hostinger Business/Cloud atau VPS |

---

# 6. Pengguna Sistem

## 6.1 Siswa

Siswa mengisi Pre-Test dan Post-Test untuk mengukur tingkat literasi digital dan keamanan digital.

## 6.2 Guru

Guru mengisi instrumen yang sama atau versi yang disesuaikan untuk guru.

## 6.3 Admin

Admin adalah tim pengabdian yang memiliki hak untuk:

- mengelola kegiatan;
- mengelola sekolah dan kelas;
- mengelola peserta;
- mengelola soal;
- mengelola versi instrumen;
- mengatur bobot;
- melihat hasil;
- membandingkan Pre-Test dan Post-Test;
- mengekspor laporan;
- melakukan merge data peserta;
- membuka ulang sesi bila diperlukan.

---

# 7. Struktur Hak Akses

| Fitur | Peserta | Admin |
|---|---:|---:|
| Membuka landing page | Ya | Ya |
| Membaca informasi sistem | Ya | Ya |
| Membuat kode peserta | Ya | Tidak |
| Mengisi data personal | Ya | Tidak |
| Mengisi Pre-Test | Ya | Tidak |
| Mengisi Post-Test | Ya | Tidak |
| Melanjutkan sesi | Ya | Tidak |
| Melihat hasil pribadi | Ya | Tidak |
| Login admin | Tidak | Ya |
| Mengelola peserta | Tidak | Ya |
| Mengelola soal | Tidak | Ya |
| Mengelola versi instrumen | Tidak | Ya |
| Melihat seluruh hasil | Tidak | Ya |
| Membandingkan Pre/Post | Tidak | Ya |
| Merge peserta | Tidak | Ya |
| Export laporan | Tidak | Ya |
| Audit log | Tidak | Ya |

---

# 8. Struktur Landing Page

Landing page menjadi halaman awal dan memiliki struktur visual modern.

## 8.1 Navbar

Isi:

- logo LDKD Care;
- Beranda;
- Tentang;
- Literasi Digital;
- Keamanan Digital;
- Cara Kerja;
- FAQ;
- pilihan bahasa;
- Login Admin;
- tombol Isi Kuesioner.

## 8.2 Hero Section

**Judul:**

```text
Kenali Tingkat Literasi Digital dan Keamanan Digital Anda
```

**Deskripsi:**

```text
LDKD Care membantu siswa dan guru mengukur pemahaman digital sebelum dan sesudah kegiatan edukasi melalui Pre-Test dan Post-Test yang terstruktur.
```

CTA:

- Isi Kuesioner Sekarang
- Pelajari Cara Kerja

Informasi tambahan:

```text
Tanpa registrasi akun • Hasil otomatis • Progres tersimpan
```

## 8.3 Tentang LDKD Care

Menjelaskan fungsi sistem, sasaran pengguna, manfaat Pre-Test dan Post-Test, serta hasil yang diberikan.

## 8.4 Literasi Digital

Menjelaskan kemampuan menggunakan perangkat, mencari informasi, mengevaluasi sumber, berkomunikasi secara etis, dan memahami budaya digital.

## 8.5 Keamanan Digital

Menjelaskan perlindungan perangkat, data pribadi, kata sandi, phishing, OTP, privasi, dan kesehatan digital.

## 8.6 Cara Kerja

1. Pilih Pre-Test atau Post-Test.
2. Pilih peran.
3. Buat atau masukkan kode.
4. Isi data personal.
5. Isi kuesioner.
6. Lihat hasil.

## 8.7 FAQ

- Apakah peserta harus login?
- Bagaimana cara membuat kode?
- Bagaimana jika lupa kode?
- Apakah progres tersimpan?
- Mengapa Post-Test tidak dapat dibuka?
- Apakah hasil langsung muncul?
- Apakah data aman?

---

# 9. Identitas Peserta dan Kode Mandiri

## 9.1 Format Kode

Format:

```text
LDKD-XXXXX
```

Ketentuan:

- prefix `LDKD-` dibuat otomatis oleh backend;
- peserta hanya mengisi 4–5 karakter terakhir;
- karakter hanya huruf dan angka;
- huruf otomatis uppercase;
- kode unik dalam satu kegiatan.

Contoh:

```text
LDKD-A7K9
LDKD-B9X21
```

## 9.2 Validasi Laravel

```php
'suffix' => [
    'required',
    'string',
    'regex:/^[A-Z0-9]{4,5}$/',
],
```

Backend:

```php
$participantCode = 'LDKD-' . strtoupper($request->suffix);
```

## 9.3 Pembuatan Kode pada Pre-Test

Peserta memilih:

- Buat Kode Baru
- Lanjutkan Pengisian Sebelumnya

Jika membuat kode baru, sistem:

1. memvalidasi format;
2. memeriksa ketersediaan;
3. menampilkan kode lengkap;
4. meminta peserta menyimpan kode;
5. mengarahkan ke form data personal.

## 9.4 Riwayat Kode Browser

Kode yang berhasil digunakan disimpan dalam localStorage atau IndexedDB.

Riwayat hanya menyimpan:

- kode;
- waktu penggunaan terakhir;
- jenis tes terakhir.

Tidak boleh menyimpan data personal, jawaban, atau skor.

Maksimal lima kode terakhir per kegiatan.

Server tetap menjadi sumber utama.

---

# 10. Form Data Personal

## 10.1 Siswa

- nama lengkap;
- asal sekolah;
- kelas;
- jenis kelamin jika diperlukan.

## 10.2 Guru

- nama lengkap;
- asal sekolah;
- jabatan atau mata pelajaran jika diperlukan.

Instruksi:

```text
Masukkan nama lengkap sesuai data sekolah. Jangan menggunakan nama panggilan.
```

```text
Pilih atau masukkan asal sekolah dengan benar.
```

Sebelum mulai Pre-Test, tampilkan konfirmasi data.

---

# 11. Alur Pre-Test

```text
Landing Page
    ↓
Pilih Pre-Test
    ↓
Pilih Peran
    ↓
Buat Kode Baru / Lanjutkan
    ↓
Validasi Kode
    ↓
Isi Data Personal
    ↓
Konfirmasi Identitas
    ↓
Buat Participant
    ↓
Buat Submission Draft
    ↓
Isi Kuesioner
    ↓
Auto-Save
    ↓
Submit
    ↓
Status Completed
```

---

# 12. Alur Post-Test

Peserta tidak membuat kode baru dan wajib menggunakan kode yang sama dengan Pre-Test.

Backend memeriksa:

1. apakah kode ditemukan;
2. apakah participant ada;
3. apakah Pre-Test ada;
4. apakah Pre-Test completed;
5. apakah Post-Test sudah ada;
6. apakah Post-Test draft atau completed.

## Rule

- Pre-Test tidak ada: Post-Test ditolak.
- Pre-Test masih draft: Post-Test ditolak dan peserta diarahkan melanjutkan Pre-Test.
- Pre-Test completed, Post-Test belum ada: Post-Test dapat dimulai.
- Post-Test draft: peserta melanjutkan dari pertanyaan terakhir.
- Post-Test completed: pengisian ulang ditolak.

---

# 13. Penyimpanan Sesi

Status submission:

```text
draft
completed
```

Kolom:

```sql
status VARCHAR(20) NOT NULL DEFAULT 'draft',
current_step VARCHAR(50) NULL,
current_question_id BIGINT UNSIGNED NULL,
started_at TIMESTAMP NULL,
last_activity_at TIMESTAMP NULL,
completed_at TIMESTAMP NULL
```

Jawaban disimpan setiap peserta memilih jawaban, berpindah soal, berpindah modul, atau saat browser akan ditutup jika memungkinkan.

Sumber utama adalah MySQL. localStorage hanya sebagai backup sementara.

---

# 14. Struktur Instrumen

## 14.1 Empat Pilar

### Digital Skill

Mengukur pengoperasian perangkat, pencarian informasi, pengelolaan data, evaluasi sumber, dan interaksi digital.

### Digital Ethics

Mengukur etika komunikasi, izin sebelum membagikan konten, privasi orang lain, dan perilaku di media sosial.

### Digital Safety

Mengukur keamanan akun, privasi, kata sandi, malware, backup, phishing, dan perlindungan perangkat.

### Digital Culture

Mengukur keberagaman, komunikasi inklusif, hak cipta, budaya Indonesia, dan tanggung jawab sosial.

## 14.2 Kompetensi UNESCO

Setiap soal dapat dipetakan ke satu atau lebih kompetensi UNESCO.

| Soal | Pilar Kominfo | Kompetensi UNESCO |
|---|---|---|
| Memeriksa kebenaran informasi | Digital Skill | 1.2 Evaluating data and information |
| Membuat kata sandi aman | Digital Safety | 4.2 Personal data and privacy |
| Mencantumkan sumber saat repost | Digital Culture | 3.3 Copyright and licences |
| Menyelesaikan masalah perangkat | Digital Skill | 5.1 Solving technical problems |

---

# 15. Jenis Soal

Sistem harus mendukung:

- skala kemampuan;
- skala persetujuan;
- pilihan ganda;
- benar/salah;
- soal kasus;
- pilihan tindakan terbaik.

Kolom penting:

```text
question_type
response_scale_id
assessment_type
difficulty_level
proficiency_level
kominfo_pillar
unesco_competence_code
is_reverse
included_in_score
questionnaire_version_id
```

---

# 16. Skala Jawaban

## 16.1 Skala Kemampuan

Digunakan untuk Digital Skill dan Digital Safety.

| Skor | Pilihan |
|---:|---|
| 1 | Tidak mengerti |
| 2 | Tidak pernah melakukan |
| 3 | Melakukan dengan bantuan |
| 4 | Melakukan sendiri |
| 5 | Melakukan sendiri dan membantu orang lain |

## 16.2 Skala Persetujuan

Digunakan untuk Digital Ethics dan Digital Culture.

| Skor | Pilihan |
|---:|---|
| 1 | Sangat Tidak Setuju |
| 2 | Tidak Setuju |
| 3 | Ragu-ragu |
| 4 | Setuju |
| 5 | Sangat Setuju |

## 16.3 Soal Kasus

Soal kasus menggunakan jawaban benar/salah atau pilihan terbaik. Scoring disimpan terpisah agar tidak bercampur dengan self-assessment.

---

# 17. Perhitungan Skor

## 17.1 Skor Pilar

```text
Skor Pilar = Total Skor Item Pilar ÷ Jumlah Item yang Masuk Perhitungan
```

## 17.2 Indeks Total

```text
Indeks Total =
(Digital Skill + Digital Ethics + Digital Safety + Digital Culture) ÷ 4
```

Setiap pilar memiliki bobot yang sama.

## 17.3 Ringkasan Dua Modul

```text
Literasi Digital = Rata-rata Digital Skill, Digital Ethics, dan Digital Culture
```

```text
Keamanan Digital = Digital Safety
```

## 17.4 Perbandingan Pre-Test dan Post-Test

```text
Selisih = Skor Post-Test - Skor Pre-Test
```

```text
Persentase Perubahan = ((Post-Test - Pre-Test) / Pre-Test) × 100%
```

Jika Pre-Test bernilai 0, persentase tidak dihitung.

---

# 18. Kategori Hasil

Kategori yang digunakan harus disebut sebagai kategori operasional LDKD Care.

| Skor | Kategori |
|---:|---|
| 1.00–2.33 | Rendah |
| 2.34–3.66 | Sedang |
| 3.67–5.00 | Tinggi |

Catatan wajib:

```text
Kategori ini merupakan kategori operasional LDKD Care dan bukan klasifikasi resmi Kominfo atau UNESCO.
```

---

# 19. Versioning Instrumen

Setiap instrumen memiliki versi.

Tabel `questionnaire_versions` berisi:

- id;
- name;
- code;
- description;
- source_reference;
- status;
- active_from;
- active_until;
- created_at.

Aturan:

- submission draft tetap menggunakan versi saat pertama dibuat;
- perubahan soal tidak mengubah submission lama;
- teks soal, pilihan, dan bobot disimpan sebagai snapshot;
- hanya satu versi aktif untuk satu kegiatan dan jenis responden.

---

# 20. Halaman Hasil Peserta

Menampilkan:

- nama;
- kode peserta;
- jenis tes;
- Digital Skill;
- Digital Ethics;
- Digital Safety;
- Digital Culture;
- skor Literasi Digital;
- skor Keamanan Digital;
- indeks total;
- kategori;
- tips edukasi;
- waktu pengisian.

Jika tersedia soal kasus, hasil dapat menampilkan skor self-assessment, skor pengetahuan, dan catatan perbedaan keduanya.

---

# 21. Dashboard Admin

## 21.1 Summary Cards

- total peserta;
- total Pre-Test;
- total Post-Test;
- peserta lengkap;
- peserta belum lengkap;
- rata-rata empat pilar;
- indeks total;
- rata-rata skor kasus.

## 21.2 Grafik

- Pre-Test vs Post-Test;
- skor per pilar;
- distribusi kategori;
- hasil per sekolah;
- hasil per kelas;
- tren pengisian;
- indikator terendah;
- indikator dengan peningkatan tertinggi.

## 21.3 Filter

- kegiatan;
- sekolah;
- kelas;
- peran;
- jenis tes;
- versi instrumen;
- pilar;
- kompetensi UNESCO;
- kategori;
- status submission.

---

# 22. Struktur Database MySQL

Tabel utama:

- `users`
- `activities`
- `schools`
- `classes`
- `participants`
- `questionnaire_versions`
- `competency_frameworks`
- `competencies`
- `questions`
- `question_competencies`
- `response_scales`
- `answer_options`
- `category_thresholds`
- `educational_tips`
- `submissions`
- `submission_answers`
- `audit_logs`

## 22.1 `participants`

Kolom penting:

```text
id
activity_id
participant_code
full_name
role
school_id
class_id
gender
position
is_active
merged_into_id
created_at
updated_at
deleted_at
```

## 22.2 `questions`

Kolom penting:

```text
id
questionnaire_version_id
kominfo_pillar
question_type
assessment_type
text_id
text_en
response_scale_id
difficulty_level
proficiency_level
is_reverse
included_in_score
display_order
is_active
created_at
updated_at
deleted_at
```

## 22.3 `competencies`

Kolom penting:

```text
id
framework
code
name
description
parent_id
```

## 22.4 `question_competencies`

```text
question_id
competency_id
mapping_type
```

## 22.5 `submissions`

Kolom penting:

```text
id
activity_id
participant_id
questionnaire_version_id
result_token
test_type
language
status
current_step
current_question_id
digital_skill_score
digital_ethics_score
digital_safety_score
digital_culture_score
literacy_score
security_score
total_index
knowledge_score
started_at
last_activity_at
completed_at
created_at
updated_at
```

---

# 23. UI/UX

## 23.1 Gaya Visual

- modern educational platform;
- biru langit, indigo, cyan;
- floating navbar;
- card putih;
- border tipis;
- shadow lembut;
- rounded corner;
- whitespace luas;
- responsif.

## 23.2 Animasi

Gunakan Framer Motion:

- fade-up;
- stagger card;
- smooth page transition;
- progress bar animation;
- selectable card animation;
- loading state;
- success state;
- accordion animation.

Wajib mendukung `prefers-reduced-motion`.

---

# 24. Keamanan dan Privasi

- HTTPS wajib;
- CSRF protection;
- session authentication untuk admin;
- rate limit pada pengecekan kode;
- kode bukan primary key;
- token publik acak untuk resume;
- data peserta tidak ditampilkan penuh sebelum verifikasi;
- scoring dilakukan di backend;
- jawaban tidak dapat dimanipulasi dari frontend;
- audit log untuk perubahan penting;
- backup database berkala;
- persetujuan pemrosesan data sebelum pengisian.

---

# 25. Acceptance Criteria MVP

MVP selesai apabila:

1. Landing page tersedia.
2. Peserta dapat memilih Pre-Test atau Post-Test.
3. Peserta dapat membuat kode `LDKD-XXXX`.
4. Kode unik dan tervalidasi.
5. Riwayat kode tersimpan di browser.
6. Peserta dapat melanjutkan sesi.
7. Peserta mengisi data personal.
8. Sistem mendukung empat pilar Kominfo.
9. Setiap soal dapat dipetakan ke UNESCO DLGF.
10. Sistem mendukung minimal dua skala jawaban.
11. Pre-Test tersimpan sebagai draft.
12. Jawaban auto-save.
13. Post-Test ditolak jika Pre-Test belum selesai.
14. Post-Test menggunakan participant yang sama.
15. Hasil menampilkan empat pilar.
16. Dashboard membandingkan Pre-Test dan Post-Test.
17. Instrumen memiliki versioning.
18. Perubahan soal tidak merusak hasil lama.
19. Data dapat diekspor.
20. Sistem responsif dan mobile-first.
21. Admin dapat mengelola instrumen.
22. Admin dapat melihat mapping kompetensi.
23. Sistem dapat di-deploy di Hostinger.

---

# 26. Tahapan Pengembangan

## Fase 1 — Fondasi

- Laravel, React, TypeScript, Inertia;
- MySQL;
- autentikasi admin;
- design system;
- migration database.

## Fase 2 — Landing Page dan Peserta

- landing page;
- kode mandiri;
- riwayat kode;
- form identitas;
- sesi draft;
- resume.

## Fase 3 — Instrumen Kominfo

- empat pilar;
- skala kemampuan;
- skala persetujuan;
- scoring;
- hasil.

## Fase 4 — Dashboard

- rekap;
- filter;
- grafik;
- perbandingan individu;
- export.

## Fase 5 — UNESCO DLGF

- tabel kompetensi;
- mapping soal;
- soal kasus;
- proficiency level;
- analisis self-assessment vs knowledge.

## Fase 6 — Validasi dan Deployment

- expert judgment;
- pilot test;
- validitas;
- reliabilitas;
- UAT;
- deployment Hostinger;
- backup dan monitoring.

---

# 27. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Peserta lupa kode | Riwayat browser dan instruksi simpan kode |
| Kode sama | Unique constraint |
| Pre-Test dan Post-Test tidak terhubung | participant_id dan kode yang sama |
| Self-assessment terlalu subjektif | Tambahkan soal kasus |
| Instrumen berubah | Versioning dan snapshot |
| Soal terlalu panjang | Uji keterbacaan |
| Data draft masuk laporan | Dashboard hanya menghitung completed |
| Peserta langsung ke Post-Test | Validasi backend |
| Perangkat bersama | Hapus riwayat kode |
| Scoring tidak konsisten | Scoring service dan unit test |
| Instrumen diklaim resmi | Gunakan label adaptasi berbasis Kominfo dan UNESCO |

---

# 28. Keputusan Final

LDKD Care menggunakan pendekatan berikut:

```text
Instrumen Utama
└── Kominfo 2022

Kerangka Pengembangan
└── UNESCO DLGF

Implementasi
├── Empat pilar
├── Dua modul utama
├── Self-assessment
├── Soal kasus bertahap
├── Pre-Test dan Post-Test
├── Kode peserta mandiri
├── Penyimpanan sesi
└── Dashboard analitik
```

Sistem harus menyatakan bahwa instrumen merupakan:

```text
Instrumen adaptasi berbasis Indeks Literasi Digital Indonesia 2022 dan dipetakan menggunakan UNESCO Digital Literacy Global Framework.
```

Sistem tidak boleh menyatakan bahwa instrumen merupakan salinan resmi Kominfo atau UNESCO apabila terdapat perubahan redaksi, penambahan soal, perubahan skala, atau modifikasi kategori.
