import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, CheckCircle2, CircleHelp, ExternalLink, Info, Route, ShieldAlert, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/Components/ui/Button';

export type AdminGuideKey =
    | 'dashboard'
    | 'activities'
    | 'activityForm'
    | 'schools'
    | 'schoolForm'
    | 'participants'
    | 'participantForm'
    | 'questions'
    | 'questionForm'
    | 'scoring'
    | 'results'
    | 'comparisons'
    | 'export'
    | 'audit'
    | 'helpCenter';

export interface AdminGuideContent {
    title: string;
    eyebrow: string;
    intro: string;
    workflow: string[];
    keyPoints: string[];
    warnings: string[];
    terms: Array<{ term: string; description: string }>;
    related?: Array<{ label: string; href: string }>;
}

export const adminGuides: Record<AdminGuideKey, AdminGuideContent> = {
    dashboard: {
        eyebrow: 'Ringkasan Sistem',
        title: 'Panduan Dashboard',
        intro: 'Dashboard menampilkan gambaran cepat kondisi pengisian LDKD Care. Gunakan halaman ini untuk melihat apakah kegiatan berjalan, peserta sudah lengkap, dan skor umum mulai terbentuk.',
        workflow: [
            'Pastikan kegiatan aktif sudah dibuat.',
            'Cek jumlah peserta, draft, pre-test, post-test, dan peserta lengkap.',
            'Gunakan grafik untuk membaca perbedaan umum antara Pre-Test dan Post-Test.',
            'Buka Hasil atau Perbandingan jika membutuhkan detail per peserta.',
        ],
        keyPoints: [
            'Draft berarti peserta sudah mulai mengisi tetapi belum submit.',
            'Completed berarti peserta sudah submit dan datanya boleh masuk laporan.',
            'Rata-rata dashboard memakai data completed saja.',
        ],
        warnings: [
            'Jangan menarik kesimpulan dari draft karena skor belum final.',
            'Jika Post-Test rendah jumlahnya, cek apakah peserta memakai kode yang sama dengan Pre-Test.',
        ],
        terms: [
            { term: 'Draft', description: 'Submission yang sedang berjalan dan masih bisa dilanjutkan peserta.' },
            { term: 'Completed', description: 'Submission yang sudah dikirim dan masuk perhitungan hasil.' },
            { term: 'Peserta lengkap', description: 'Peserta yang sudah memiliki Pre-Test dan Post-Test completed.' },
        ],
        related: [
            { label: 'Hasil Kuesioner', href: '/admin/results' },
            { label: 'Perbandingan', href: '/admin/comparisons' },
        ],
    },
    activities: {
        eyebrow: 'Master Data',
        title: 'Panduan Kegiatan',
        intro: 'Kegiatan adalah wadah utama untuk mengelompokkan peserta, pre-test, post-test, hasil, dan laporan.',
        workflow: [
            'Buat kegiatan sebelum peserta mulai mengisi.',
            'Isi nama, tema, periode, dan status aktif.',
            'Gunakan satu kegiatan untuk satu program atau sesi evaluasi yang ingin dilaporkan bersama.',
            'Nonaktifkan kegiatan lama jika tidak ingin dipilih untuk pengisian baru.',
        ],
        keyPoints: [
            'Peserta terhubung ke satu kegiatan.',
            'Kode peserta unik di dalam konteks kegiatan.',
            'Filter hasil dan export banyak bergantung pada kegiatan.',
        ],
        warnings: [
            'Menghapus kegiatan dapat mengganggu data peserta dan hasil yang terhubung.',
            'Jangan membuat kegiatan ganda untuk sesi yang sama jika ingin laporan tetap rapi.',
        ],
        terms: [
            { term: 'Kegiatan aktif', description: 'Kegiatan yang tersedia untuk pengisian baru dan pengelolaan peserta.' },
            { term: 'Periode', description: 'Rentang tanggal pelaksanaan kegiatan edukasi atau evaluasi.' },
        ],
        related: [
            { label: 'Peserta', href: '/admin/participants' },
            { label: 'Export', href: '/admin/export' },
        ],
    },
    activityForm: {
        eyebrow: 'Form Kegiatan',
        title: 'Panduan Form Kegiatan',
        intro: 'Form ini digunakan untuk menambah atau memperbarui kegiatan. Data kegiatan menjadi konteks laporan dan filter utama admin.',
        workflow: [
            'Isi nama kegiatan yang mudah dikenali.',
            'Tentukan tanggal mulai dan selesai.',
            'Tambahkan tema singkat agar laporan mudah dipahami.',
            'Simpan sebagai aktif jika kegiatan masih digunakan.',
        ],
        keyPoints: [
            'Nama kegiatan sebaiknya unik dan jelas.',
            'Tema membantu membedakan fokus edukasi, misalnya OTP, phishing, atau verifikasi informasi.',
        ],
        warnings: [
            'Mengubah nama kegiatan akan memengaruhi label di hasil dan export, tetapi tidak mengubah jawaban peserta.',
        ],
        terms: [
            { term: 'Tema', description: 'Catatan ringkas tentang fokus edukasi pada kegiatan.' },
            { term: 'Aktif', description: 'Status yang membuat kegiatan dapat dipakai dalam pengisian baru.' },
        ],
    },
    schools: {
        eyebrow: 'Master Data',
        title: 'Panduan Sekolah dan Kelas',
        intro: 'Modul ini mengatur daftar sekolah/institusi dan kelas agar peserta dapat dikelompokkan dengan rapi.',
        workflow: [
            'Tambahkan sekolah terlebih dahulu.',
            'Buka edit sekolah untuk menambah kelas.',
            'Pastikan nama sekolah tidak duplikat.',
            'Gunakan filter sekolah di peserta, hasil, dan export.',
        ],
        keyPoints: [
            'Kelas hanya tersedia setelah sekolah disimpan.',
            'Guru boleh tidak memiliki kelas.',
            'Sekolah nonaktif tidak disarankan untuk peserta baru.',
        ],
        warnings: [
            'Menghapus sekolah/kelas yang sudah dipakai peserta dapat mengganggu filter laporan.',
        ],
        terms: [
            { term: 'Institusi', description: 'Sekolah atau lembaga asal peserta.' },
            { term: 'Kelas aktif', description: 'Kelas yang dapat dipilih ketika peserta dibuat atau diedit.' },
        ],
        related: [
            { label: 'Peserta', href: '/admin/participants' },
            { label: 'Hasil', href: '/admin/results' },
        ],
    },
    schoolForm: {
        eyebrow: 'Form Sekolah',
        title: 'Panduan Form Sekolah',
        intro: 'Form ini menyimpan data institusi dan mengelola kelas di dalamnya.',
        workflow: [
            'Simpan nama sekolah terlebih dahulu.',
            'Setelah tersimpan, tambahkan kelas jika dibutuhkan.',
            'Nonaktifkan kelas yang tidak dipakai lagi daripada menghapusnya.',
        ],
        keyPoints: [
            'Nama sekolah dipakai pada biodata peserta dan export.',
            'Jumlah peserta di kelas membantu mengecek apakah data sudah terhubung.',
        ],
        warnings: [
            'Hapus kelas hanya jika yakin tidak dibutuhkan lagi.',
        ],
        terms: [
            { term: 'Sekolah aktif', description: 'Sekolah yang tersedia untuk data peserta baru.' },
            { term: 'Kelas', description: 'Subkelompok peserta, biasanya untuk siswa.' },
        ],
    },
    participants: {
        eyebrow: 'Master Data',
        title: 'Panduan Peserta',
        intro: 'Modul peserta digunakan untuk melihat dan mengelola data identitas, kode, peran, sekolah, dan status peserta.',
        workflow: [
            'Filter peserta berdasarkan kegiatan, sekolah, atau peran.',
            'Gunakan import CSV jika data peserta sudah tersedia.',
            'Pastikan kode peserta tetap sesuai format LDKD-XXXX.',
            'Cek jumlah submission untuk melihat aktivitas pengisian peserta.',
        ],
        keyPoints: [
            'Kode peserta menghubungkan Pre-Test dan Post-Test.',
            'Peserta dapat dibuat oleh admin atau oleh peserta saat Pre-Test.',
            'Data peserta menjadi dasar hasil dan perbandingan.',
        ],
        warnings: [
            'Jangan mengganti kode peserta jika sudah dipakai mengisi, kecuali benar-benar diperlukan.',
            'Menghapus peserta dapat memutus hubungan ke submission dan hasil.',
        ],
        terms: [
            { term: 'Kode peserta', description: 'Kode unik seperti LDKD-A7K9 yang dipakai peserta untuk mengisi dan melanjutkan.' },
            { term: 'Merge', description: 'Penggabungan data peserta yang terduplikasi. Tindakan ini berisiko dan harus dicek sebelum dijalankan.' },
        ],
        related: [
            { label: 'Perbandingan', href: '/admin/comparisons' },
            { label: 'Export', href: '/admin/export' },
        ],
    },
    participantForm: {
        eyebrow: 'Form Peserta',
        title: 'Panduan Form Peserta',
        intro: 'Form ini dipakai admin untuk membuat atau memperbarui data peserta secara manual.',
        workflow: [
            'Pilih kegiatan yang benar.',
            'Kosongkan kode jika ingin dibuat otomatis.',
            'Isi nama lengkap, peran, sekolah, dan kelas jika siswa.',
            'Simpan status aktif agar kode dapat digunakan.',
        ],
        keyPoints: [
            'Guru boleh tidak punya kelas.',
            'Kode manual harus mengikuti format LDKD-XXXX.',
            'Nama lengkap membantu pencarian dan pencocokan laporan.',
        ],
        warnings: [
            'Kode yang salah dapat membuat peserta gagal melanjutkan Post-Test.',
        ],
        terms: [
            { term: 'Peran', description: 'Siswa atau Guru. Peran dapat digunakan sebagai filter laporan.' },
            { term: 'Peserta aktif', description: 'Peserta yang boleh menggunakan kode untuk mengisi kuesioner.' },
        ],
    },
    questions: {
        eyebrow: 'Instrumen',
        title: 'Panduan Bank Soal',
        intro: 'Bank soal mengelola instrumen kuesioner. Setiap soal harus terhubung ke modul, pilar Kominfo, skala jawaban, dan jika ada, kompetensi UNESCO.',
        workflow: [
            'Pilih modul Literasi Digital atau Keamanan Digital.',
            'Filter pilar dan versi instrumen untuk mengecek cakupan soal.',
            'Tambah atau edit soal melalui form soal.',
            'Pastikan soal aktif hanya untuk instrumen yang siap dipakai.',
        ],
        keyPoints: [
            'Literasi Digital berisi Digital Skill, Digital Ethics, dan Digital Culture.',
            'Keamanan Digital berisi Digital Safety.',
            'Submission lama aman karena teks soal, opsi, dan bobot disimpan sebagai snapshot.',
        ],
        warnings: [
            'Mengubah soal aktif dapat memengaruhi draft baru. Buat versi baru jika perubahan besar.',
            'Jangan menghapus soal yang masih dibutuhkan untuk analisis historis.',
        ],
        terms: [
            { term: 'Pilar Kominfo', description: 'Empat area pengukuran: Digital Skill, Digital Ethics, Digital Safety, Digital Culture.' },
            { term: 'Kompetensi UNESCO', description: 'Kode pemetaan kompetensi digital yang membantu validasi cakupan soal.' },
            { term: 'Versioning', description: 'Cara menjaga agar perubahan instrumen tidak merusak hasil lama.' },
        ],
        related: [
            { label: 'Bobot dan Kategori', href: '/admin/scoring' },
            { label: 'Hasil', href: '/admin/results' },
        ],
    },
    questionForm: {
        eyebrow: 'Form Instrumen',
        title: 'Panduan Form Soal',
        intro: 'Form soal menentukan bagaimana pertanyaan tampil, masuk pilar mana, memakai skala apa, dan apakah ikut dihitung ke skor.',
        workflow: [
            'Pilih versi instrumen.',
            'Pilih modul dan pilar yang sesuai.',
            'Pilih skala jawaban 1-5 sesuai pilar.',
            'Isi teks pertanyaan dan opsi jawaban.',
            'Aktifkan included in score jika butir harus masuk scoring.',
        ],
        keyPoints: [
            'Digital Skill dan Digital Safety memakai skala kemampuan.',
            'Digital Ethics dan Digital Culture memakai skala persetujuan.',
            'Reverse scoring hanya untuk pertanyaan yang maknanya berlawanan.',
        ],
        warnings: [
            'Salah memilih pilar akan membuat skor pilar tidak akurat.',
            'Reverse scoring yang salah dapat membalik hasil peserta.',
            'Bobot opsi harus konsisten 1 sampai 5 untuk self-assessment.',
        ],
        terms: [
            { term: 'Included in score', description: 'Jika aktif, jawaban pada soal ini ikut dihitung dalam skor.' },
            { term: 'Reverse scoring', description: 'Bobot dibalik saat perhitungan. Dipakai untuk kalimat negatif atau risiko.' },
            { term: 'Response scale', description: 'Skala jawaban yang menentukan pilihan dan bobot.' },
        ],
    },
    scoring: {
        eyebrow: 'Scoring',
        title: 'Panduan Bobot dan Kategori',
        intro: 'Halaman ini mengatur ambang kategori hasil dan tips edukasi. Bobot setiap pilihan jawaban tetap dikelola dari Bank Soal.',
        workflow: [
            'Gunakan rentang 1.00 sampai 5.00 untuk kategori operasional.',
            'Pastikan rentang Rendah, Sedang, dan Tinggi tidak saling tumpang tindih.',
            'Tulis tips yang edukatif dan tidak memberi label negatif pada peserta.',
            'Simpan perubahan setelah semua modul dicek.',
        ],
        keyPoints: [
            'Kategori LDKD Care bersifat operasional, bukan klasifikasi resmi Kominfo atau UNESCO.',
            'Rentang default: Rendah 1.00-2.33, Sedang 2.34-3.66, Tinggi 3.67-5.00.',
            'Tips ditampilkan otomatis di halaman hasil peserta.',
        ],
        warnings: [
            'Mengubah threshold akan memengaruhi label kategori hasil yang dihitung setelahnya.',
            'Tips jangan berupa diagnosis atau penilaian negatif.',
        ],
        terms: [
            { term: 'Threshold', description: 'Batas angka yang menentukan kategori Rendah, Sedang, atau Tinggi.' },
            { term: 'Skor 1-5', description: 'Skor rata-rata dari jawaban yang masuk perhitungan.' },
            { term: 'Tips edukasi', description: 'Saran pembelajaran yang muncul berdasarkan kategori hasil.' },
        ],
        related: [
            { label: 'Bank Soal', href: '/admin/questions' },
            { label: 'Hasil', href: '/admin/results' },
        ],
    },
    results: {
        eyebrow: 'Analitik',
        title: 'Panduan Hasil',
        intro: 'Halaman hasil menampilkan submission completed dari peserta. Gunakan filter untuk mencari data berdasarkan kegiatan, sekolah, atau jenis tes.',
        workflow: [
            'Filter data sesuai kebutuhan laporan.',
            'Cek skor literasi, keamanan, kategori, dan waktu submit.',
            'Export CSV jika data akan diolah di spreadsheet.',
        ],
        keyPoints: [
            'Hanya completed yang tampil di hasil.',
            'Draft tidak masuk laporan akhir.',
            'Skor final berasal dari scoring backend.',
        ],
        warnings: [
            'Jangan membandingkan peserta berbeda hanya dari nama. Gunakan kode peserta.',
            'Perubahan instrumen baru tidak mengubah snapshot hasil lama.',
        ],
        terms: [
            { term: 'Completed', description: 'Pengisian sudah dikirim dan nilainya final.' },
            { term: 'Kategori', description: 'Label operasional LDKD Care berdasarkan rentang skor.' },
        ],
        related: [
            { label: 'Perbandingan', href: '/admin/comparisons' },
            { label: 'Export', href: '/admin/export' },
        ],
    },
    comparisons: {
        eyebrow: 'Evaluasi',
        title: 'Panduan Perbandingan',
        intro: 'Perbandingan menunjukkan perubahan Pre-Test dan Post-Test untuk peserta yang sama berdasarkan participant_id dan kode peserta.',
        workflow: [
            'Filter berdasarkan kegiatan, sekolah, peran, atau status kelengkapan.',
            'Cek peserta lengkap untuk melihat selisih Pre-Test dan Post-Test.',
            'Gunakan export untuk laporan peningkatan.',
        ],
        keyPoints: [
            'Pre-Test dan Post-Test harus completed agar status lengkap.',
            'Selisih positif berarti nilai Post-Test lebih tinggi daripada Pre-Test.',
            'Kode peserta yang sama menjaga data tetap terhubung.',
        ],
        warnings: [
            'Jika peserta membuat kode baru saat Post-Test, datanya tidak akan terhubung.',
            'Jangan gabungkan data manual tanpa verifikasi identitas peserta.',
        ],
        terms: [
            { term: 'Selisih', description: 'Skor Post-Test dikurangi skor Pre-Test.' },
            { term: 'Belum lengkap', description: 'Peserta belum memiliki salah satu dari Pre-Test atau Post-Test completed.' },
        ],
        related: [
            { label: 'Peserta', href: '/admin/participants' },
            { label: 'Hasil', href: '/admin/results' },
        ],
    },
    export: {
        eyebrow: 'Laporan',
        title: 'Panduan Export',
        intro: 'Modul export digunakan untuk mengunduh data peserta, hasil, dan perbandingan dalam CSV untuk laporan atau analisis lanjutan.',
        workflow: [
            'Pilih filter yang dibutuhkan.',
            'Unduh data peserta, hasil kuesioner, atau perbandingan.',
            'Buka CSV di Excel/Spreadsheet dan cek jumlah baris.',
        ],
        keyPoints: [
            'Export peserta berisi identitas dan jumlah submission.',
            'Export hasil berisi skor dan kategori.',
            'Export perbandingan berisi pre, post, dan selisih.',
        ],
        warnings: [
            'Data export dapat berisi data personal. Simpan di tempat aman.',
            'Jangan membagikan file export ke pihak yang tidak berkepentingan.',
        ],
        terms: [
            { term: 'CSV', description: 'File tabel yang bisa dibuka di Excel, Google Sheets, atau aplikasi spreadsheet lain.' },
            { term: 'Filter export', description: 'Batasan data yang ikut diunduh, misalnya kegiatan atau sekolah tertentu.' },
        ],
        related: [
            { label: 'Audit Log', href: '/admin/audit-logs' },
        ],
    },
    audit: {
        eyebrow: 'Keamanan Sistem',
        title: 'Panduan Audit Log',
        intro: 'Audit log membantu melacak aktivitas admin seperti login, perubahan data, hapus data, dan export laporan.',
        workflow: [
            'Gunakan filter aksi atau entity untuk mencari aktivitas tertentu.',
            'Buka detail Old/New untuk melihat perubahan data.',
            'Gunakan audit log saat terjadi kesalahan konfigurasi atau data berubah tanpa diketahui.',
        ],
        keyPoints: [
            'Audit log membantu akuntabilitas admin.',
            'Old adalah data sebelum perubahan, New adalah data setelah perubahan.',
            'IP dan user agent membantu investigasi teknis.',
        ],
        warnings: [
            'Audit log bukan tempat mengedit data. Gunakan modul asal untuk memperbaiki data.',
            'Jangan mengabaikan aktivitas export yang tidak dikenal.',
        ],
        terms: [
            { term: 'Entity', description: 'Jenis data yang berubah, misalnya Question, Participant, atau Submission.' },
            { term: 'Old/New', description: 'Perbandingan nilai sebelum dan sesudah aksi admin.' },
        ],
    },
    helpCenter: {
        eyebrow: 'Help Center',
        title: 'Panduan Admin LDKD Care',
        intro: 'Help center mengumpulkan panduan seluruh modul admin dalam satu halaman.',
        workflow: [
            'Baca urutan kerja umum sebelum menjalankan kegiatan.',
            'Pilih modul yang ingin dipahami.',
            'Gunakan tombol Panduan Modul di setiap halaman untuk bantuan kontekstual.',
        ],
        keyPoints: [
            'Mulai dari Kegiatan, Sekolah/Kelas, Peserta, Soal, lalu cek Scoring.',
            'Hasil dan Perbandingan baru valid setelah peserta submit completed.',
        ],
        warnings: [
            'Perubahan instrumen dan peserta dapat berdampak ke laporan. Baca peringatan modul sebelum menyimpan.',
        ],
        terms: [
            { term: 'Panduan Modul', description: 'Drawer bantuan yang muncul di halaman admin sesuai konteks modul.' },
        ],
    },
};

interface PageProps extends Record<string, unknown> {
    auth?: {
        user?: {
            id?: number;
            name?: string;
            email?: string;
        } | null;
    };
}

export function AdminGuideButton({
    module,
    label = 'Panduan Modul',
    className = '',
    autoWalkthrough = true,
}: {
    module: AdminGuideKey;
    label?: string;
    className?: string;
    autoWalkthrough?: boolean;
}) {
    const guide = adminGuides[module];
    const reduceMotion = useReducedMotion();
    const page = usePage<PageProps>();
    const userId = page.props.auth?.user?.id ?? 'guest';
    const storageKey = `ldkd_admin_guide_seen:${userId}:${module}`;
    const [open, setOpen] = useState(false);
    const [firstTime, setFirstTime] = useState(false);

    useEffect(() => {
        if (!autoWalkthrough || typeof window === 'undefined') {
            return;
        }

        const seen = window.localStorage.getItem(storageKey) === '1';

        if (!seen) {
            const timer = window.setTimeout(() => {
                setFirstTime(true);
                setOpen(true);
            }, 450);

            return () => window.clearTimeout(timer);
        }
    }, [autoWalkthrough, storageKey]);

    const close = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(storageKey, '1');
        }

        setOpen(false);
        setFirstTime(false);
    };

    return (
        <>
            <Button type="button" variant="outline" onClick={() => setOpen(true)} className={`gap-2 ${className}`}>
                <CircleHelp className="h-4 w-4" />
                {label}
            </Button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-[70] bg-[#172033]/30 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.18 }}
                            onClick={close}
                        />
                        <motion.aside
                            className="fixed right-0 top-0 z-[80] flex h-screen w-full max-w-xl flex-col overflow-hidden border-l border-[#E8ECF3] bg-white shadow-[0_28px_70px_-34px_rgba(23,32,51,0.45)]"
                            initial={{ x: reduceMotion ? 0 : '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: reduceMotion ? 0 : '100%' }}
                            transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
                            role="dialog"
                            aria-modal="true"
                            aria-label={guide.title}
                        >
                            <div className="flex items-start justify-between gap-4 border-b border-[#E8ECF3] p-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F1F3FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#5B5FEF]">
                                        <BookOpen className="h-4 w-4" />
                                        {firstTime ? 'Walkthrough Pertama' : guide.eyebrow}
                                    </div>
                                    <h2 className="mt-4 font-heading text-2xl font-bold tracking-[-0.01em] text-[#172033]">{guide.title}</h2>
                                    <p className="mt-2 leading-7 text-[#667085]">{guide.intro}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={close}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8ECF3] text-[#667085] transition hover:bg-[#F8FAFC] hover:text-[#172033] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5FEF]"
                                    aria-label="Tutup panduan"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
                                {firstTime && (
                                    <div className="rounded-2xl border border-[#D9DDFF] bg-[#F9FAFF] p-4 text-sm font-semibold leading-6 text-[#5B5FEF]">
                                        Panduan ini otomatis muncul satu kali untuk modul ini. Setelah ditutup, kamu tetap bisa membukanya lagi dari tombol Panduan Modul.
                                    </div>
                                )}

                                <GuideBlock icon={<Route className="h-5 w-5" />} title="Urutan kerja yang disarankan" items={guide.workflow} />
                                <GuideBlock icon={<CheckCircle2 className="h-5 w-5" />} title="Hal penting" items={guide.keyPoints} />
                                <GuideBlock icon={<ShieldAlert className="h-5 w-5" />} title="Perlu hati-hati" items={guide.warnings} tone="warning" />

                                {guide.terms.length > 0 && (
                                    <section className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-5">
                                        <h3 className="font-heading text-lg font-bold text-[#172033]">Istilah yang perlu dipahami</h3>
                                        <div className="mt-4 space-y-3">
                                            {guide.terms.map((term) => (
                                                <div key={term.term} className="rounded-xl border border-white bg-white p-4">
                                                    <p className="font-bold text-[#172033]">{term.term}</p>
                                                    <p className="mt-1 text-sm leading-6 text-[#667085]">{term.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {guide.related && guide.related.length > 0 && (
                                    <section className="rounded-2xl border border-[#E8ECF3] bg-white p-5">
                                        <h3 className="font-heading text-lg font-bold text-[#172033]">Modul terkait</h3>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {guide.related.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-[#E8ECF3] px-3 py-2 text-sm font-bold text-[#667085] transition hover:border-[#D9DDFF] hover:text-[#5B5FEF]"
                                                    onClick={close}
                                                >
                                                    {item.label}
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="border-t border-[#E8ECF3] p-5">
                                <Button type="button" onClick={close} className="w-full gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Saya Mengerti
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function GuideBlock({ icon, title, items, tone = 'default' }: { icon: ReactNode; title: string; items: string[]; tone?: 'default' | 'warning' }) {
    return (
        <section className={`rounded-2xl border p-5 ${tone === 'warning' ? 'border-amber-100 bg-amber-50' : 'border-[#E8ECF3] bg-white'}`}>
            <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-[#F1F3FF] text-[#5B5FEF]'}`}>
                    {icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-[#172033]">{title}</h3>
            </div>
            <ol className="space-y-3">
                {items.map((item, index) => (
                    <li key={`${title}-${index}`} className="flex gap-3 text-sm leading-6 text-[#667085]">
                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${tone === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-[#F1F3FF] text-[#5B5FEF]'}`}>
                            {index + 1}
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export function AdminTooltip({ content, children }: { content: string; children?: ReactNode }) {
    const [open, setOpen] = useState(false);
    const label = useMemo(() => children || <Info className="h-3.5 w-3.5" />, [children]);

    return (
        <span
            className="relative inline-flex"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
        >
            <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#D9DDFF] bg-[#F8FAFC] text-[#5B5FEF] transition hover:bg-[#F1F3FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5FEF]"
                aria-label="Lihat bantuan"
            >
                {label}
            </button>
            {open && (
                <span className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-xl border border-[#E8ECF3] bg-white px-3 py-2 text-left text-xs font-semibold leading-5 text-[#667085] shadow-[0_20px_44px_-28px_rgba(23,32,51,0.45)]">
                    {content}
                </span>
            )}
        </span>
    );
}
