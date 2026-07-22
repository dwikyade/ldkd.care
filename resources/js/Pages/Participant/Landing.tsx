import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    ArrowRight,
    BookOpenCheck,
    CheckCircle2,
    ChevronUp,
    ClipboardCheck,
    Globe2,
    GraduationCap,
    Laptop,
    LockKeyhole,
    Menu,
    MousePointerClick,
    QrCode,
    ScanLine,
    ShieldCheck,
    Sparkles,
    UserRoundCheck,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    activity?: {
        id: number;
        name: string;
        theme: string | null;
        description: string | null;
    } | null;
}

type Language = 'id' | 'en';

const copy = {
    id: {
        nav: ['Beranda', 'Tentang', 'Literasi Digital', 'Keamanan Digital', 'Cara Kerja'],
        badge: 'Digital Literacy & Data Security Assessment',
        title: 'Kenali Tingkat Literasi Digital dan Keamanan Digital Anda',
        description:
            'LDKD Care membantu siswa dan guru mengukur pemahaman mengenai penggunaan teknologi digital serta perlindungan data melalui pre-test dan post-test yang terstruktur.',
        noLogin: 'Peserta tidak perlu login. Cukup gunakan kode peserta unik.',
        start: 'Isi Kuesioner Sekarang',
        learn: 'Pelajari Sistem',
        stats: [
            ['2', 'Modul Penilaian'],
            ['2', 'Mode Tes'],
            ['100%', 'Skor Otomatis'],
            ['0', 'Akun Peserta'],
        ],
        aboutTitle: 'Tentang LDKD Care',
        aboutText:
            'LDKD Care adalah aplikasi web untuk membantu kegiatan evaluasi literasi digital dan keamanan digital. Sistem ini menghubungkan hasil pre-test dan post-test peserta melalui kode unik, sehingga perubahan pemahaman dapat dianalisis lebih akurat.',
        aboutPoints: [
            'Dapat digunakan siswa dan guru tanpa membuat akun.',
            'Hasil skor dan kategori muncul otomatis setelah submit.',
            'Admin dapat mengelola kegiatan, soal, bobot, dan laporan.',
        ],
        literacyTitle: 'Literasi Digital',
        literacyText:
            'Mengukur kemampuan mengakses, memahami, memverifikasi, dan menggunakan informasi digital secara bertanggung jawab.',
        literacyItems: ['Akses informasi', 'Verifikasi sumber', 'Etika komunikasi', 'Penggunaan teknologi sehat'],
        securityTitle: 'Keamanan Digital',
        securityText:
            'Mengukur kesiapan melindungi akun, data pribadi, OTP, kata sandi, dan privasi saat memakai layanan digital.',
        securityItems: ['Kata sandi kuat', 'OTP aman', 'Kenali phishing', 'Privasi data pribadi'],
        testTitle: 'Pre-Test dan Post-Test',
        pre: ['Pre-Test', 'Dilakukan sebelum sosialisasi untuk mengukur pemahaman awal dan menjadi dasar evaluasi.'],
        post: ['Post-Test', 'Dilakukan setelah sosialisasi untuk melihat perubahan skor dan dampak edukasi.'],
        processTitle: 'Cara Kerja',
        process: [
            'Pilih jenis pengisian',
            'Pilih peran peserta',
            'Masukkan kode unik',
            'Isi dua modul',
            'Lihat skor dan tips',
        ],
        strengthsTitle: 'Keunggulan Sistem',
        strengths: ['Tanpa login peserta', 'Data pre-test dan post-test terhubung', 'Dwibahasa', 'Responsif', 'Aman dan terstruktur', 'Rekomendasi edukatif'],
        ctaTitle: 'Siap mengetahui tingkat Literasi Digital dan Keamanan Digital Anda?',
        backTop: 'Kembali ke Atas',
        contact: 'Kontak tim pengabdian',
        privacy: 'Kebijakan privasi',
        version: 'Versi 2.1',
    },
    en: {
        nav: ['Home', 'About', 'Digital Literacy', 'Digital Security', 'How It Works'],
        badge: 'Digital Literacy & Data Security Assessment',
        title: 'Discover Your Digital Literacy and Digital Security Level',
        description:
            'LDKD Care helps students and teachers measure their understanding of digital technology use and data protection through structured pre-tests and post-tests.',
        noLogin: 'No participant account is required. Use your unique participant code.',
        start: 'Fill Questionnaire Now',
        learn: 'Learn the System',
        stats: [
            ['2', 'Assessment Modules'],
            ['2', 'Test Modes'],
            ['100%', 'Automatic Score'],
            ['0', 'Participant Accounts'],
        ],
        aboutTitle: 'About LDKD Care',
        aboutText:
            'LDKD Care is a web app for evaluating digital literacy and digital security. It links pre-test and post-test results through a unique participant code, making learning changes easier to analyze.',
        aboutPoints: [
            'Students and teachers can participate without creating accounts.',
            'Scores and result categories appear automatically after submission.',
            'Admins can manage activities, questions, weights, and reports.',
        ],
        literacyTitle: 'Digital Literacy',
        literacyText:
            'Measures the ability to access, understand, verify, and use digital information responsibly.',
        literacyItems: ['Access information', 'Verify sources', 'Ethical communication', 'Healthy technology use'],
        securityTitle: 'Digital Security',
        securityText:
            'Measures readiness to protect accounts, personal data, OTP codes, passwords, and privacy while using digital services.',
        securityItems: ['Strong passwords', 'Safe OTP use', 'Phishing awareness', 'Personal data privacy'],
        testTitle: 'Pre-Test and Post-Test',
        pre: ['Pre-Test', 'Completed before the session to measure initial understanding and create an evaluation baseline.'],
        post: ['Post-Test', 'Completed after the session to observe score changes and education impact.'],
        processTitle: 'How It Works',
        process: [
            'Choose test mode',
            'Choose participant role',
            'Enter unique code',
            'Complete two modules',
            'View scores and tips',
        ],
        strengthsTitle: 'System Advantages',
        strengths: ['No participant login', 'Linked pre-test and post-test data', 'Bilingual', 'Responsive', 'Secure and structured', 'Educational recommendations'],
        ctaTitle: 'Ready to discover your Digital Literacy and Digital Security level?',
        backTop: 'Back to Top',
        contact: 'Community service team contact',
        privacy: 'Privacy policy',
        version: 'Version 2.1',
    },
};

const sectionLinks = ['#home', '#about', '#literacy', '#security', '#process'];

export default function Landing({ activity }: Props) {
    const [language, setLanguage] = useState<Language>('id');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const reduceMotion = useReducedMotion();
    const t = copy[language];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 16);
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const reveal = useMemo(
        () => ({
            hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
            visible: { opacity: 1, y: 0 },
        }),
        [reduceMotion],
    );

    const stagger = {
        visible: {
            transition: {
                staggerChildren: reduceMotion ? 0 : 0.1,
            },
        },
    };

    const questionnaireHref = route('participant.select-mode', { lang: language });
    const heroMetrics = [
        { icon: Laptop, title: t.literacyTitle, value: '84%', tone: 'bg-indigo-50 text-indigo-700' },
        { icon: ShieldCheck, title: t.securityTitle, value: '86%', tone: 'bg-cyan-50 text-cyan-700' },
        { icon: QrCode, title: 'LDKD-A7K92', value: language === 'id' ? 'Kode unik' : 'Unique code', tone: 'bg-amber-50 text-amber-700' },
        { icon: ClipboardCheck, title: language === 'id' ? 'Tips edukasi' : 'Education tips', value: language === 'id' ? 'Otomatis' : 'Automatic', tone: 'bg-emerald-50 text-emerald-700' },
    ];

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Head title="LDKD Care" />

            <motion.header
                initial={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'border-b border-slate-200/80 bg-white/88 shadow-sm backdrop-blur-xl'
                        : 'border-b border-transparent bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <a href="#home" className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <ShieldCheck className="h-5 w-5" />
                        </span>
                        <span className="font-heading text-xl font-bold tracking-tight">
                            LDKD <span className="text-indigo-600">Care</span>
                        </span>
                    </a>

                    <nav className="hidden items-center gap-6 lg:flex">
                        {t.nav.map((item, index) => (
                            <a
                                key={item}
                                href={sectionLinks[index]}
                                className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <button
                            type="button"
                            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                            <Globe2 className="h-4 w-4" />
                            {language.toUpperCase()}
                        </button>
                        <Link href={questionnaireHref} className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4">
                            {language === 'id' ? 'Isi Kuesioner' : 'Questionnaire'}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(true)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </motion.header>

            {isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/40"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu overlay"
                    />
                    <motion.aside
                        initial={{ x: reduceMotion ? 0 : 320, opacity: reduceMotion ? 1 : 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 320, opacity: 0 }}
                        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <span className="font-heading text-lg font-bold">LDKD Care</span>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {t.nav.map((item, index) => (
                                <a
                                    key={item}
                                    href={sectionLinks[index]}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold"
                            >
                                <Globe2 className="h-4 w-4" />
                                {language.toUpperCase()}
                            </button>
                            <Link href={questionnaireHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white">
                                {language === 'id' ? 'Mulai' : 'Start'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.aside>
                </div>
            )}

            <main id="home">
                <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-28">
                    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:px-8">
                        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
                            <motion.div variants={reveal} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                                <Sparkles className="h-4 w-4" />
                                {t.badge}
                            </motion.div>
                            <motion.h1 variants={reveal} transition={{ duration: 0.6 }} className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
                                {t.title}
                            </motion.h1>
                            <motion.p variants={reveal} transition={{ duration: 0.5 }} className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                                {activity?.theme || t.description}
                            </motion.p>
                            <motion.div variants={reveal} transition={{ duration: 0.4 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link href={questionnaireHref} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-base font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-indigo-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4">
                                    {t.start}
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <a href="#about" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-base font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4">
                                    {t.learn}
                                    <MousePointerClick className="h-5 w-5" />
                                </a>
                            </motion.div>
                            <motion.p variants={reveal} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                <UserRoundCheck className="h-4 w-4" />
                                {t.noLogin}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: reduceMotion ? 0 : 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-950/20">
                                <div className="rounded-2xl bg-white p-5">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Assessment Flow</p>
                                            <p className="font-heading text-xl font-bold text-slate-950">LDKD Care</p>
                                        </div>
                                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">Live</span>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {heroMetrics.map(({ icon: IconComponent, title, value, tone }) => {
                                            return (
                                                <motion.div
                                                    key={title}
                                                    animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                                                    transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                                >
                                                    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                                                        <IconComponent className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-500">{title}</p>
                                                    <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                                            <span>{language === 'id' ? 'Progress Pengisian' : 'Completion Progress'}</span>
                                            <span>75%</span>
                                        </div>
                                        <div className="h-3 overflow-hidden rounded-full bg-white">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '75%' }}
                                                transition={{ duration: reduceMotion ? 0 : 1.1, delay: 0.3 }}
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="border-b border-slate-200 bg-slate-50 py-8">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
                        {t.stats.map(([value, label]) => (
                            <motion.div
                                key={label}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.4 }}
                                variants={reveal}
                                className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
                            >
                                <p className="text-3xl font-bold text-indigo-600">{value}</p>
                                <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <InfoSection id="about" title={t.aboutTitle} text={t.aboutText} reveal={reveal}>
                    <div className="space-y-3">
                        {t.aboutPoints.map((point) => (
                            <div key={point} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                <p className="text-sm font-medium leading-6 text-slate-600">{point}</p>
                            </div>
                        ))}
                    </div>
                </InfoSection>

                <ModuleSection
                    id="literacy"
                    title={t.literacyTitle}
                    text={t.literacyText}
                    items={t.literacyItems}
                    icon={BookOpenCheck}
                    tone="indigo"
                    reveal={reveal}
                />

                <ModuleSection
                    id="security"
                    title={t.securityTitle}
                    text={t.securityText}
                    items={t.securityItems}
                    icon={LockKeyhole}
                    tone="cyan"
                    reveal={reveal}
                />

                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Evaluation Mode</p>
                            <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{t.testTitle}</h2>
                        </motion.div>
                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            {[t.pre, t.post].map(([title, text], index) => (
                                <motion.div
                                    key={title}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={reveal}
                                    transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                                    className={`rounded-2xl border p-6 shadow-sm ${index === 0 ? 'border-indigo-100 bg-indigo-50/60' : 'border-cyan-100 bg-cyan-50/60'}`}
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-800 shadow-sm">
                                        {index === 0 ? <ScanLine className="h-6 w-6 text-indigo-600" /> : <GraduationCap className="h-6 w-6 text-cyan-700" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-950">{title}</h3>
                                    <p className="mt-3 leading-7 text-slate-600">{text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="process" className="border-y border-slate-200 bg-slate-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-bold uppercase tracking-widest text-cyan-700">Guided Flow</p>
                            <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{t.processTitle}</h2>
                        </motion.div>
                        <div className="relative mt-12 grid gap-4 md:grid-cols-5">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: reduceMotion ? 0 : 0.8 }}
                                className="absolute left-[10%] right-[10%] top-8 hidden h-1 origin-left rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 md:block"
                            />
                            {t.process.map((step, index) => (
                                <motion.div
                                    key={step}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.4 }}
                                    variants={reveal}
                                    transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                                    className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                                        {index + 1}
                                    </span>
                                    <p className="font-bold leading-6 text-slate-800">{step}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>
                            <h2 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{t.strengthsTitle}</h2>
                            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {t.strengths.map((item) => (
                                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        <span className="font-semibold text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="bg-slate-950 py-16 text-white">
                    <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">LDKD Care</p>
                            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-normal sm:text-4xl">{t.ctaTitle}</h2>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Link href={questionnaireHref} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-bold text-slate-950 transition hover:bg-cyan-50">
                                {t.start}
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <button type="button" onClick={scrollToTop} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-base font-bold text-white transition hover:bg-white/10">
                                {t.backTop}
                                <ChevronUp className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white py-10">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 text-sm text-slate-600 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <span className="font-heading text-lg font-bold text-slate-950">LDKD Care</span>
                        </div>
                        <p className="max-w-md leading-7">{t.description}</p>
                    </div>
                    <div>
                        <p className="mb-3 font-bold text-slate-950">Navigasi</p>
                        <div className="space-y-2">
                            {t.nav.map((item, index) => (
                                <a key={item} href={sectionLinks[index]} className="block hover:text-indigo-600">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="mb-3 font-bold text-slate-950">{t.contact}</p>
                        <div className="space-y-2">
                            <p>{t.privacy}</p>
                            <p>{t.version}</p>
                            <p>&copy; {new Date().getFullYear()} LDKD Care</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function InfoSection({
    id,
    title,
    text,
    children,
    reveal,
}: {
    id: string;
    title: string;
    text: string;
    children: ReactNode;
    reveal: Variants;
}) {
    return (
        <section id={id} className="bg-white py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Overview</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{title}</h2>
                    <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{text}</p>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>
                    {children}
                </motion.div>
            </div>
        </section>
    );
}

function ModuleSection({
    id,
    title,
    text,
    items,
    icon: Icon,
    tone,
    reveal,
}: {
    id: string;
    title: string;
    text: string;
    items: string[];
    icon: typeof Laptop;
    tone: 'indigo' | 'cyan';
    reveal: Variants;
}) {
    const toneClasses =
        tone === 'indigo'
            ? 'border-indigo-100 bg-indigo-50 text-indigo-700'
            : 'border-cyan-100 bg-cyan-50 text-cyan-700';

    return (
        <section id={id} className="border-t border-slate-200 bg-slate-50 py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${toneClasses}`}>
                        <Icon className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{title}</h2>
                    <p className="mt-5 leading-8 text-slate-600">{text}</p>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} className="grid gap-3 sm:grid-cols-2">
                    {items.map((item) => (
                        <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md">
                            <CheckCircle2 className="mb-4 h-5 w-5 text-emerald-600" />
                            <p className="font-bold leading-6 text-slate-800">{item}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
