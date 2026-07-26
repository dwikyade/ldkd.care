# Prompt Revisi Sistem Kode Peserta dan Penyimpanan Sesi LDKD Care

Lakukan revisi pada modul identifikasi peserta dan alur pengisian kuesioner LDKD Care.

## Konteks Sistem

- Backend: Laravel.
- Frontend: React + TypeScript.
- Bridge: Inertia.js.
- Database: MySQL.
- Peserta tidak memiliki akun dan tidak melakukan login.
- Sistem memiliki dua jenis pengisian: Pre-Test dan Post-Test.
- Setiap peserta harus dapat melanjutkan pengisian yang belum selesai menggunakan kode peserta.
- Jangan mengubah fitur, desain, scoring, modul kuesioner, dashboard, dan fungsi lain yang tidak berhubungan dengan revisi ini.

---

# 1. Masalah Sistem Saat Ini

Saat ini kode peserta dibuat oleh panitia dan harus dibagikan kepada seluruh responden.

Alur tersebut menimbulkan beberapa masalah:

- Panitia harus membuat kode terlebih dahulu.
- Panitia harus membagikan kode satu per satu.
- Proses pengisian menjadi lebih lambat.
- Peserta dapat kehilangan atau lupa kode yang diberikan.
- Pelaksanaan Pre-Test dapat tertunda karena peserta menunggu kode.

Ubah sistem agar peserta dapat membuat kode sendiri saat pertama kali mengisi Pre-Test.

---

# 2. Format Kode Peserta

Gunakan format kode berikut:

```text
LDKD-XXXXX
```

Ketentuan:

- Prefix `LDKD-` dibuat otomatis oleh sistem.
- Peserta hanya mengisi bagian setelah prefix.
- Bagian kode yang dibuat peserta terdiri dari 4 sampai 5 karakter.
- Karakter yang diperbolehkan hanya huruf dan angka.
- Huruf otomatis diubah menjadi uppercase.
- Spasi dan simbol tidak diperbolehkan.
- Kode bersifat case-insensitive.
- Kode lengkap harus unik pada kegiatan yang sama.

Contoh kode valid:

```text
LDKD-A7K9
LDKD-R25A
LDKD-B9X21
```

Contoh kode tidak valid:

```text
LDKD-AB
LDKD-ABCDEFG
LDKD-A@12
LDKD-A 12
```

Gunakan validasi backend Laravel:

```php
'suffix' => [
    'required',
    'string',
    'regex:/^[A-Z0-9]{4,5}$/',
],
```

Backend harus membentuk kode final:

```php
$participantCode = 'LDKD-' . strtoupper($request->suffix);
```

Jangan mempercayai prefix yang dikirim frontend. Prefix harus selalu dibentuk ulang oleh backend Laravel.

Tambahkan unique constraint MySQL:

```sql
UNIQUE KEY unique_activity_participant_code (
    activity_id,
    participant_code
);
```

---

# 3. UI Pembuatan Kode pada Pre-Test

Ketika peserta memilih Pre-Test, tampilkan dua pilihan:

1. **Buat Kode Baru**
2. **Lanjutkan Pengisian Sebelumnya**

Jika memilih **Buat Kode Baru**, tampilkan halaman berikut.

## Judul

```text
Buat Kode Peserta
```

## Deskripsi

```text
Buat kode yang akan digunakan untuk menyimpan progres dan menghubungkan hasil Pre-Test dengan Post-Test Anda.
```

## Tampilan Input

```text
[ LDKD- ] [ A7K92 ]
```

Ketentuan UI:

- Prefix `LDKD-` tampil sebagai elemen tetap dan tidak dapat diedit.
- Peserta hanya mengetik 4–5 huruf atau angka.
- Input otomatis uppercase.
- Tampilkan jumlah karakter, misalnya `3/5`.
- Tolak spasi dan simbol saat peserta mengetik.
- Sediakan tombol untuk membuat kode acak.
- Lakukan pengecekan ketersediaan kode setelah peserta berhenti mengetik.
- Pengecekan frontend hanya membantu UX.
- Backend tetap menjadi validasi utama.

Teks bantuan:

```text
Gunakan 4–5 huruf atau angka yang mudah Anda ingat.
```

```text
Jangan gunakan NIS, nomor telepon, tanggal lahir, atau informasi pribadi sebagai kode.
```

```text
Contoh: A7K92, B25X, atau R9M21.
```

Tombol:

- Gunakan Kode Ini
- Buatkan Kode Acak
- Kembali

Status validasi:

- Belum cukup karakter.
- Format kode tidak valid.
- Sedang memeriksa kode.
- Kode tersedia.
- Kode sudah digunakan, silakan buat kode lain.
- Gagal memeriksa kode, silakan coba kembali.

Jangan hanya memeriksa kode menggunakan JavaScript. Laravel wajib memeriksa ulang ke database sebelum membuat participant.

---

# 4. Konfirmasi dan Penyimpanan Kode

Setelah kode dinyatakan tersedia, tampilkan konfirmasi:

```text
Kode Peserta Anda
```

Contoh:

```text
LDKD-A7K92
```

Sediakan:

- Tombol salin kode.
- Instruksi untuk screenshot atau mencatat kode.
- Informasi bahwa kode digunakan kembali saat Post-Test.
- Checkbox konfirmasi.

Teks:

```text
Simpan kode ini. Anda membutuhkan kode yang sama untuk melanjutkan pengisian atau mengisi Post-Test.
```

Checkbox:

```text
Saya telah menyimpan dan mengingat kode peserta saya.
```

Tombol melanjutkan hanya aktif setelah checkbox dicentang.

---

# 5. Form Data Personal Setelah Membuat Kode

Setelah peserta menyimpan kode, arahkan ke halaman data peserta.

## Judul

```text
Lengkapi Data Peserta
```

## Deskripsi

```text
Data berikut digunakan untuk mencatat hasil Pre-Test dan Post-Test Anda. Pastikan data yang dimasukkan benar.
```

## Data Siswa

- Nama lengkap.
- Asal sekolah.
- Kelas.
- Jenis kelamin jika diperlukan.
- Data lain yang benar-benar diperlukan dalam kegiatan.

## Data Guru

- Nama lengkap.
- Asal sekolah.
- Jabatan atau mata pelajaran jika diperlukan.

## Instruksi Input

### Nama Lengkap

```text
Masukkan nama lengkap sesuai data sekolah. Jangan menggunakan nama panggilan.
```

### Asal Sekolah

```text
Pilih atau masukkan nama sekolah tempat Anda belajar atau mengajar.
```

### Kelas

```text
Pilih kelas yang sedang ditempuh, misalnya 8A, 9B, atau XII IPA 1.
```

Ketentuan:

- Gunakan label yang selalu terlihat.
- Tampilkan contoh pada helper text, bukan hanya placeholder.
- Beri tanda pada field wajib.
- Error ditampilkan tepat di bawah input.
- Jangan menghapus data yang sudah diisi ketika validasi gagal.
- Tampilkan halaman konfirmasi sebelum memulai kuesioner.

Confirmation card menampilkan:

- Kode peserta.
- Nama lengkap.
- Peran.
- Sekolah.
- Kelas.
- Jenis tes: Pre-Test.

Tombol:

- Data Sudah Benar, Mulai Pre-Test
- Perbaiki Data

---

# 6. Alur Pre-Test Baru

Gunakan alur berikut:

```text
Landing Page
    ↓
Klik Isi Kuesioner
    ↓
Pilih Pre-Test
    ↓
Pilih Peran
    ↓
Pilih Buat Kode Baru atau Lanjutkan Pengisian
    ↓
Buat atau Masukkan Kode Peserta
    ↓
Sistem Memeriksa Kode
    ↓
Simpan dan Konfirmasi Kode
    ↓
Isi Data Personal
    ↓
Konfirmasi Identitas
    ↓
Buat Participant
    ↓
Buat Submission Pre-Test dengan Status Draft
    ↓
Isi Kuesioner
    ↓
Auto-Save Jawaban
    ↓
Submit
    ↓
Status Pre-Test Menjadi Completed
```

Pembuatan participant dan submission draft harus menggunakan database transaction.

Jangan membuat participant hanya dari proses pengecekan kode. Participant dibuat setelah kode dan data personal valid.

---

# 7. Status Submission

Tambahkan status pada tabel `submissions`.

Gunakan status:

```text
draft
completed
```

Tambahkan kolom:

```sql
status VARCHAR(20) NOT NULL DEFAULT 'draft',
current_step VARCHAR(50) NULL,
current_question_id BIGINT UNSIGNED NULL,
started_at TIMESTAMP NULL,
last_activity_at TIMESTAMP NULL,
completed_at TIMESTAMP NULL
```

Aturan:

- `draft`: pengisian belum selesai.
- `completed`: seluruh jawaban sudah divalidasi, skor dihitung, dan hasil disimpan.
- Hanya submission `completed` yang dianggap sebagai Pre-Test atau Post-Test selesai.
- Submission draft tidak dimasukkan ke perhitungan skor final dashboard.
- Dashboard boleh menampilkan jumlah draft secara terpisah.

Gunakan unique constraint:

```sql
UNIQUE KEY unique_participant_test (
    activity_id,
    participant_id,
    test_type
);
```

Constraint berlaku untuk submission draft maupun completed.

---

# 8. Penyimpanan Sesi dan Jawaban

Peserta dapat tidak sengaja:

- Menutup browser.
- Refresh halaman.
- Kembali ke landing page.
- Kehilangan koneksi.
- Berpindah perangkat.

Progres harus disimpan berdasarkan participant dan kode peserta di database MySQL.

Jangan hanya mengandalkan localStorage.

Server harus menjadi sumber data utama.

Simpan:

- Submission ID.
- Participant ID.
- Jenis tes.
- Status.
- Modul aktif.
- Pertanyaan terakhir.
- Seluruh jawaban yang sudah dipilih.
- Waktu aktivitas terakhir.

Gunakan tabel `submission_answers` dengan unique constraint:

```sql
UNIQUE KEY unique_submission_question (
    submission_id,
    question_id
);
```

Jawaban disimpan menggunakan update-or-create atau upsert.

Contoh:

```php
SubmissionAnswer::updateOrCreate(
    [
        'submission_id' => $submission->id,
        'question_id' => $question->id,
    ],
    [
        'answer_option_id' => $request->answer_option_id,
        'weight_snapshot' => $answerOption->weight,
        'question_text_snapshot' => $question->text_id,
    ]
);
```

Auto-save dilakukan:

- Setiap peserta memilih jawaban.
- Ketika menekan tombol berikutnya.
- Ketika menekan tombol sebelumnya.
- Ketika berpindah modul.
- Saat browser akan ditutup jika memungkinkan.
- Menggunakan debounce sekitar 500–1000 milidetik.

Tampilkan status:

```text
Menyimpan...
Jawaban tersimpan
Gagal menyimpan, mencoba kembali
```

Simpan juga `current_step` dan `current_question_id`.

---

# 9. Riwayat Kode pada Perangkat

Tambahkan fitur riwayat kode pada form input kode peserta.

## Tujuan

- Membantu peserta menemukan kode yang pernah digunakan.
- Mempermudah peserta melanjutkan Pre-Test atau Post-Test.
- Mengurangi risiko lupa kode.
- Riwayat hanya sebagai bantuan input, bukan autentikasi.

## Kapan Kode Disimpan

Simpan kode ke riwayat hanya setelah:

1. Format kode valid.
2. Kode berhasil diverifikasi Laravel.
3. Kode benar-benar digunakan untuk:
   - Membuat peserta baru.
   - Memulai Pre-Test.
   - Melanjutkan Pre-Test.
   - Memulai Post-Test.
   - Melanjutkan Post-Test.

Jangan menyimpan:

- Kode belum lengkap.
- Kode dengan format salah.
- Kode yang tidak ditemukan.
- Kode yang gagal diverifikasi.
- Input sementara saat peserta mengetik.

## Media Penyimpanan

Gunakan localStorage atau IndexedDB untuk menyimpan riwayat kode pada perangkat dan browser yang sama.

MySQL tetap menjadi sumber utama untuk:

- Data peserta.
- Status Pre-Test.
- Status Post-Test.
- Jawaban.
- Progres.
- Hasil.

Gunakan storage key berdasarkan kegiatan:

```text
ldkd_recent_codes_{activity_id}
```

Contoh:

```text
ldkd_recent_codes_12
```

## Struktur Data Riwayat

```json
[
  {
    "code": "LDKD-A7K92",
    "last_used_at": "2026-07-23T09:30:00",
    "last_test_type": "pre_test"
  },
  {
    "code": "LDKD-B8M21",
    "last_used_at": "2026-07-22T13:15:00",
    "last_test_type": "post_test"
  }
]
```

Jangan menyimpan data personal lengkap dalam riwayat browser.

Data yang dilarang disimpan:

- Nama lengkap.
- Sekolah.
- Kelas.
- Jenis kelamin.
- Jawaban.
- Skor.
- Nomor telepon.
- Alamat.

## Aturan Riwayat

- Maksimal simpan 5 kode terakhir.
- Urutkan berdasarkan penggunaan terbaru.
- Jangan menyimpan kode yang sama dua kali.
- Jika kode digunakan kembali, pindahkan ke urutan paling atas.
- Hapus kode paling lama jika jumlah melebihi 5.
- Riwayat hanya berlaku pada perangkat dan browser yang sama.
- Jika data browser dihapus, riwayat ikut hilang.
- Riwayat tidak tersinkronisasi otomatis ke perangkat lain.

Contoh TypeScript:

```ts
type RecentParticipantCode = {
    code: string;
    lastUsedAt: string;
    lastTestType: 'pre_test' | 'post_test';
};

function saveRecentCode(
    activityId: number,
    item: RecentParticipantCode
): void {
    const storageKey = `ldkd_recent_codes_${activityId}`;

    let current: RecentParticipantCode[] = [];

    try {
        current = JSON.parse(
            localStorage.getItem(storageKey) ?? '[]'
        );
    } catch {
        current = [];
    }

    const normalizedCode = item.code.trim().toUpperCase();

    const withoutDuplicate = current.filter(
        history => history.code.toUpperCase() !== normalizedCode
    );

    const updated = [
        {
            ...item,
            code: normalizedCode,
        },
        ...withoutDuplicate,
    ].slice(0, 5);

    localStorage.setItem(storageKey, JSON.stringify(updated));
}
```

---

# 10. UI Riwayat Kode

Pada halaman input kode tampilkan section:

```text
Kode yang Pernah Digunakan di Perangkat Ini
```

Tampilkan hanya jika terdapat riwayat.

Contoh:

```text
LDKD-A7K92
Terakhir digunakan untuk Pre-Test

LDKD-B8M21
Terakhir digunakan untuk Post-Test
```

Setiap item memiliki:

- Kode peserta.
- Waktu terakhir digunakan.
- Jenis tes terakhir.
- Tombol Gunakan Kode.
- Tombol Hapus.

Tambahkan tombol:

- Gunakan Kode.
- Hapus.
- Hapus Semua Riwayat.

Ketika peserta menekan **Gunakan Kode**:

1. Isi otomatis field kode.
2. Jangan langsung masuk ke kuesioner.
3. Kirim kode ke backend untuk verifikasi.
4. Tampilkan status peserta berdasarkan hasil backend.
5. Arahkan ke sesi yang benar.

Tambahkan teks:

```text
Riwayat ini hanya tersimpan pada browser dan perangkat yang sedang digunakan.
```

Peringatan:

```text
Jika Anda menggunakan perangkat bersama, hapus riwayat kode setelah selesai.
```

Dialog hapus semua:

## Judul

```text
Hapus Semua Riwayat Kode?
```

## Deskripsi

```text
Riwayat kode pada perangkat ini akan dihapus. Data jawaban yang sudah tersimpan di server tidak akan ikut terhapus.
```

Tombol:

- Batal.
- Ya, Hapus Riwayat.

---

# 11. Auto-Fill Riwayat Kode

Jika hanya ada satu kode di riwayat:

- Jangan langsung membuka sesi.
- Tampilkan sebagai rekomendasi utama.
- Peserta tetap menekan tombol Gunakan Kode.
- Setelah itu lakukan verifikasi backend.

Jika terdapat lebih dari satu kode:

- Jangan memilih otomatis.
- Peserta harus memilih kode yang sesuai.
- Urutkan dari penggunaan terbaru.

Input kode tetap dapat diedit manual.

Jika peserta mengetik kode yang sudah ada di riwayat:

- Jangan membuat duplikat.
- Perbarui waktu penggunaan setelah kode berhasil diverifikasi dan digunakan.

---

# 12. Melanjutkan Pre-Test

Jika peserta memilih **Lanjutkan Pengisian**, peserta dapat:

- Memilih kode dari riwayat.
- Mengetik kode secara manual.

Laravel memeriksa:

1. Apakah kode ditemukan.
2. Apakah participant aktif.
3. Apakah submission Pre-Test tersedia.
4. Apakah statusnya draft atau completed.

## Kode Tidak Ditemukan

```text
Kode peserta tidak ditemukan. Pastikan kode yang dimasukkan benar atau buat kode baru untuk memulai Pre-Test.
```

## Pre-Test Berstatus Draft

```text
Pre-Test Anda belum selesai. Jawaban terakhir telah tersimpan dan dapat dilanjutkan.
```

Tampilkan:

- Kode peserta.
- Nama yang disamarkan jika diperlukan.
- Modul terakhir.
- Persentase progres.
- Waktu terakhir mengisi.

Tombol:

```text
Lanjutkan Pre-Test
```

Setelah ditekan:

- Muat jawaban dari database.
- Buka modul dan pertanyaan terakhir.
- Tandai jawaban yang telah dipilih.
- Jangan memulai dari awal.

## Pre-Test Berstatus Completed

```text
Pre-Test dengan kode ini sudah selesai.
```

Arahan:

```text
Gunakan kode yang sama ketika jadwal Post-Test telah dimulai.
```

Jangan mengizinkan Pre-Test kedua dengan kode yang sama.

---

# 13. Alur dan Rule Post-Test

Peserta tidak membuat kode baru saat Post-Test.

Pada halaman Post-Test tampilkan:

## Judul

```text
Masukkan Kode Peserta Pre-Test
```

## Deskripsi

```text
Gunakan kode yang sama dengan yang Anda buat saat mengisi Pre-Test.
```

Tampilan input:

```text
[ LDKD- ] [ A7K92 ]
```

Tampilkan juga riwayat kode yang pernah digunakan pada perangkat tersebut.

Backend Laravel wajib memeriksa kondisi berikut.

## Kondisi A — Kode Tidak Ditemukan

Jangan izinkan Post-Test.

Tampilkan:

```text
Kode peserta tidak ditemukan.
```

```text
Untuk mengisi Post-Test, Anda harus menggunakan kode yang sama dengan Pre-Test.
```

Tombol:

- Periksa Kembali Kode.
- Mulai Pre-Test.

## Kondisi B — Participant Ditemukan, tetapi Pre-Test Tidak Ada

Jangan izinkan Post-Test.

Tampilkan:

```text
Data Pre-Test untuk kode ini belum ditemukan.
```

```text
Anda harus menyelesaikan Pre-Test terlebih dahulu sebelum mengisi Post-Test.
```

Tombol:

```text
Mulai Pre-Test
```

## Kondisi C — Pre-Test Masih Draft

Jangan izinkan Post-Test.

Tampilkan:

```text
Pre-Test Anda belum selesai.
```

```text
Selesaikan seluruh pertanyaan Pre-Test terlebih dahulu sebelum melanjutkan ke Post-Test.
```

Tampilkan progres Pre-Test.

Tombol:

```text
Lanjutkan Pre-Test
```

Saat ditekan, arahkan ke pertanyaan terakhir Pre-Test.

## Kondisi D — Pre-Test Completed dan Post-Test Belum Ada

Izinkan peserta memulai Post-Test.

Tampilkan confirmation card:

- Kode peserta.
- Nama.
- Sekolah.
- Kelas.
- Status Pre-Test: Selesai.
- Status Post-Test: Belum dimulai.

Tombol:

```text
Mulai Post-Test
```

Saat ditekan:

- Gunakan participant yang sama.
- Jangan membuat participant baru.
- Buat submission Post-Test dengan status draft.
- Jangan meminta peserta mengisi data personal dari awal.
- Minta peserta hanya mengonfirmasi data.

Sediakan tombol:

```text
Data Saya Berubah
```

Jika dipilih, peserta boleh memperbarui data tertentu sesuai aturan admin.

## Kondisi E — Post-Test Sudah Draft

Jangan membuat submission baru.

Tampilkan:

```text
Post-Test Anda belum selesai.
```

```text
Jawaban sebelumnya sudah tersimpan.
```

Tombol:

```text
Lanjutkan Post-Test
```

Muat pertanyaan terakhir dan seluruh jawaban tersimpan.

## Kondisi F — Post-Test Completed

Jangan izinkan pengisian ulang.

Tampilkan:

```text
Post-Test dengan kode ini sudah selesai.
```

Tampilkan waktu penyelesaian.

Pengisian ulang hanya dapat dibuka oleh admin.

---

# 14. State Machine

Gunakan state:

```text
NEW_CODE
    ↓
PROFILE_REQUIRED
    ↓
PRETEST_DRAFT
    ↓
PRETEST_COMPLETED
    ↓
POSTTEST_DRAFT
    ↓
POSTTEST_COMPLETED
```

Perpindahan yang diizinkan:

```text
NEW_CODE → PROFILE_REQUIRED
PROFILE_REQUIRED → PRETEST_DRAFT
PRETEST_DRAFT → PRETEST_COMPLETED
PRETEST_COMPLETED → POSTTEST_DRAFT
POSTTEST_DRAFT → POSTTEST_COMPLETED
```

Perpindahan yang dilarang:

```text
NEW_CODE → POSTTEST_DRAFT
PROFILE_REQUIRED → POSTTEST_DRAFT
PRETEST_DRAFT → POSTTEST_DRAFT
POSTTEST_COMPLETED → POSTTEST_DRAFT
```

Seluruh pemeriksaan wajib dilakukan di backend Laravel.

---

# 15. Service Backend

Buat service terpisah:

```text
ParticipantCodeService
ParticipantRegistrationService
QuestionnaireSessionService
QuestionnaireDraftService
PreTestEligibilityService
PostTestEligibilityService
ScoringService
```

## ParticipantCodeService

Tanggung jawab:

- Normalisasi suffix.
- Membentuk kode `LDKD-XXXXX`.
- Memeriksa format.
- Memeriksa ketersediaan.
- Membuat suffix acak.

## QuestionnaireDraftService

Tanggung jawab:

- Membuat draft.
- Menyimpan jawaban.
- Memperbarui posisi terakhir.
- Memuat progres.
- Menyelesaikan submission.

## PostTestEligibilityService

Mengembalikan status:

```text
CODE_NOT_FOUND
PRETEST_NOT_FOUND
PRETEST_INCOMPLETE
POSTTEST_AVAILABLE
POSTTEST_INCOMPLETE
POSTTEST_COMPLETED
```

Frontend menampilkan UI berdasarkan status tersebut.

---

# 16. Route yang Direkomendasikan

```php
Route::post('/participant-code/check', ...);
Route::post('/participant-code/generate', ...);
Route::post('/participants/register', ...);

Route::post('/pretest/resume/check', ...);
Route::post('/posttest/eligibility', ...);

Route::post('/questionnaire/start', ...);
Route::post('/questionnaire/{submission}/answers', ...);
Route::patch('/questionnaire/{submission}/progress', ...);
Route::get('/questionnaire/{submission}/resume', ...);
Route::post('/questionnaire/{submission}/complete', ...);
```

Gunakan signed token atau public submission token.

Jangan mengekspos ID database mentah jika tidak diperlukan.

---

# 17. Keamanan dan Privasi

Karena kode dibuat peserta sendiri dan digunakan tanpa login:

- Terapkan rate limit pada pengecekan kode.
- Terapkan rate limit pada endpoint resume.
- Jangan mengembalikan seluruh data personal hanya dari pengecekan kode.
- Jangan mengekspos jawaban tanpa validasi sesi.
- Gunakan CSRF protection.
- Gunakan random public token untuk submission.
- Jangan menggunakan participant code sebagai primary key.
- Jangan menyimpan jawaban pada riwayat browser.
- Normalisasi kode menjadi uppercase sebelum query.
- Validasi seluruh tahapan di backend.

Sebelum sesi terverifikasi, samarkan data:

```text
Rizal A****
SMP N**** Surabaya
```

Riwayat browser bukan mekanisme login atau otorisasi.

---

# 18. Copywriting agar Tidak Membingungkan

## Halaman Pre-Test

### Judul

```text
Buat Kode Peserta Anda
```

### Deskripsi

```text
Kode ini berfungsi untuk menyimpan jawaban dan menghubungkan hasil Pre-Test dengan Post-Test.
```

### Helper

```text
Buat 4–5 huruf atau angka. Contoh: A7K92.
```

### Peringatan

```text
Simpan kode Anda. Gunakan kode yang sama saat mengisi Post-Test.
```

## Halaman Lanjutkan Pre-Test

### Judul

```text
Lanjutkan Pre-Test
```

### Deskripsi

```text
Pilih kode yang pernah digunakan atau masukkan kode secara manual. Jawaban terakhir akan dimuat secara otomatis.
```

## Halaman Post-Test

### Judul

```text
Masukkan Kode Pre-Test
```

### Deskripsi

```text
Post-Test hanya dapat diisi setelah Pre-Test selesai. Gunakan kode yang sama.
```

## Pre-Test Belum Selesai

### Judul

```text
Selesaikan Pre-Test Terlebih Dahulu
```

### Deskripsi

```text
Sebagian jawaban Anda sudah tersimpan. Lanjutkan dari pertanyaan terakhir sebelum mengisi Post-Test.
```

## Sesi Ditemukan

### Judul

```text
Progres Sebelumnya Ditemukan
```

### Deskripsi

```text
Jawaban terakhir Anda tersimpan pada sistem. Anda dapat melanjutkan tanpa mengulang dari awal.
```

---

# 19. Status Auto-Save

Tampilkan indikator kecil pada card kuesioner:

```text
Menyimpan...
Tersimpan pukul 09.42
Gagal menyimpan
Mencoba kembali...
```

Ketika koneksi terputus:

```text
Jawaban belum tersimpan karena koneksi terputus. Jangan tutup halaman. Sistem akan mencoba kembali.
```

Gunakan localStorage hanya sebagai backup sementara.

Ketika koneksi kembali:

- Sinkronkan jawaban lokal dengan server.
- Gunakan timestamp atau version number.
- Setelah berhasil, hapus draft lokal yang sudah tersinkronisasi.

---

# 20. Dashboard Admin

Tambahkan status peserta:

- Belum memulai.
- Pre-Test belum selesai.
- Pre-Test selesai.
- Post-Test belum selesai.
- Lengkap.

Tabel peserta:

| Kode | Nama | Sekolah | Pre-Test | Post-Test | Aktivitas Terakhir |
|---|---|---|---|---|---|

Admin dapat:

- Melihat draft tanpa memasukkannya ke skor akhir.
- Membuka detail progres.
- Menghapus draft rusak dengan konfirmasi.
- Membuka ulang tes completed jika diperlukan.
- Melihat audit log pembukaan ulang.

Dashboard statistik final hanya menggunakan submission `completed`.

---

# 21. Migration yang Diperlukan

Tabel `participants`:

```sql
participant_code VARCHAR(20) NOT NULL
```

Tabel `submissions`:

```sql
status VARCHAR(20) NOT NULL DEFAULT 'draft',
current_step VARCHAR(50) NULL,
current_question_id BIGINT UNSIGNED NULL,
started_at TIMESTAMP NULL,
last_activity_at TIMESTAMP NULL,
completed_at TIMESTAMP NULL
```

Tabel `submission_answers`:

```sql
UNIQUE KEY unique_submission_question (
    submission_id,
    question_id
)
```

Tambahkan index:

```sql
INDEX idx_submission_status (
    activity_id,
    participant_id,
    test_type,
    status
)
```

---

# 22. Edge Cases

Tangani kasus:

1. Dua peserta membuat kode sama secara bersamaan.
   - Unique constraint harus mencegah duplikasi.
   - Peserta kedua diminta memilih kode lain.

2. Peserta menutup browser setelah memilih jawaban.
   - Auto-save dan local backup mengurangi kehilangan data.

3. Peserta membuka kode sama pada dua perangkat.
   - Gunakan `updated_at` atau version number.
   - Tampilkan peringatan sesi aktif lain jika diperlukan.

4. Peserta mencoba membuat Pre-Test kedua.
   - Tolak dan arahkan ke sesi yang sudah ada.

5. Peserta langsung membuka URL Post-Test.
   - Backend tetap memeriksa status Pre-Test.

6. Peserta memanipulasi request.
   - Laravel memvalidasi participant, activity, test type, dan status.

7. Soal berubah ketika peserta masih draft.
   - Simpan versi kuesioner saat draft dibuat.

8. Peserta sudah menyelesaikan Pre-Test tetapi jadwal Post-Test belum dibuka.
   - Periksa periode Post-Test.
   - Tampilkan arahan waktu dari panitia.

9. Kode ada di riwayat tetapi gagal karena gangguan jaringan.
   - Jangan menghapus riwayat.
   - Bedakan error jaringan dan kode tidak ditemukan.

10. Perangkat digunakan bersama oleh beberapa peserta.
    - Jangan memilih kode otomatis.
    - Sediakan tombol hapus riwayat perangkat.

---

# 23. Acceptance Criteria

Revisi selesai apabila:

1. Peserta dapat membuat kode sendiri saat Pre-Test.
2. Prefix selalu `LDKD-`.
3. Suffix terdiri dari 4–5 huruf atau angka.
4. Kode unik dalam satu kegiatan.
5. Peserta mengisi data personal setelah kode tersedia.
6. Instruksi pengisian mudah dipahami.
7. Participant dibuat setelah kode dan data personal valid.
8. Pre-Test dibuat sebagai draft.
9. Jawaban tersimpan otomatis ke server.
10. Peserta dapat keluar dan melanjutkan menggunakan kode.
11. Jawaban lama tidak perlu diulang.
12. Kode valid otomatis masuk riwayat browser.
13. Kode invalid tidak masuk riwayat.
14. Riwayat dipisahkan berdasarkan kegiatan.
15. Maksimal lima kode tersimpan.
16. Kode yang sama tidak diduplikasi.
17. Peserta dapat memilih kode dari riwayat.
18. Pemilihan riwayat tetap diverifikasi Laravel.
19. Peserta dapat menghapus satu atau seluruh riwayat.
20. Penghapusan riwayat tidak menghapus jawaban server.
21. Post-Test ditolak jika kode tidak ditemukan.
22. Post-Test ditolak jika Pre-Test belum ada.
23. Post-Test ditolak jika Pre-Test masih draft.
24. Peserta diarahkan menyelesaikan Pre-Test.
25. Post-Test memakai participant yang sama.
26. Post-Test draft dapat dilanjutkan.
27. Post-Test completed tidak dapat diulang.
28. Dashboard hanya menghitung submission completed.
29. Seluruh rule tetap berlaku saat request dimanipulasi.
30. TypeScript tidak memiliki error.
31. Migration MySQL tidak merusak data lama.
32. Tampilan tetap mengikuti design system LDKD Care.

---

# 24. Output Implementasi yang Diharapkan

Hasilkan implementasi lengkap berupa:

- Migration Laravel.
- Model dan relasi Eloquent.
- Form Request validation.
- Service kode peserta.
- Service sesi dan draft.
- Controller.
- Route.
- React TypeScript pages.
- Komponen input kode.
- Komponen riwayat kode.
- Komponen konfirmasi identitas.
- Komponen indikator auto-save.
- UI resume Pre-Test.
- UI validasi Post-Test.
- Loading, error, empty, dan success state.
- Unit test.
- Feature test.
- Penanganan edge case.
- Jangan menggunakan data dummy pada integrasi akhir.
