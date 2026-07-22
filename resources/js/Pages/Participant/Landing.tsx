import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    BookOpenCheck,
    Check,
    CheckCircle2,
    ChevronUp,
    ClipboardCheck,
    FileCheck2,
    Globe2,
    GraduationCap,
    HelpCircle,
    LineChart,
    LockKeyhole,
    Menu,
    Minus,
    MousePointerClick,
    Plus,
    QrCode,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    UserRoundCheck,
    Users,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import CloudDecor from '@/Components/ldkd/CloudDecor';

interface Props {
    activity?: {
        id: number;
        name: string;
        theme: string | null;
        description: string | null;
    } | null;
}

type Language = 'id' | 'en';
type TabKey = 'student' | 'teacher' | 'team';

const copy = {
    id: {
        nav: ['Beranda', 'Tentang', 'Literasi Digital', 'Keamanan Digital', 'Cara Kerja', 'FAQ'],
        badge: 'Digital Literacy & Digital Security Assessment',
        title: 'Kenali Tingkat Literasi Digital dan Keamanan Digital Anda',
        description:
            'LDKD Care membantu siswa dan guru mengukur pemahaman sebelum dan sesudah kegiatan edukasi melalui pre-test dan post-test yang terstruktur.',
        start: 'Isi Kuesioner Sekarang',
        learn: 'Pelajari Cara Kerja',
        note: 'Tanpa registrasi akun • Hasil otomatis • Data pre-test dan post-test terhubung',
        admin: 'Login Admin',
        highlights: ['Tanpa login peserta', 'Dua modul penilaian', 'Skor otomatis', 'Pre-test dan post-test', 'Dwibahasa', 'Responsif'],
        areasTitle: 'Dua Area Penting dalam Kehidupan Digital',
        areasText: 'LDKD Care mengevaluasi pemahaman peserta melalui dua modul utama yang saling melengkapi.',
        aboutTitle: 'Dirancang untuk Evaluasi Edukasi Digital',
        aboutText:
            'Sistem ini dibuat agar kegiatan edukasi digital dapat dievaluasi dengan lebih terarah, mudah digunakan, dan tetap menjaga alur peserta tanpa hambatan akun.',
        tabs: {
            student: 'Untuk Siswa',
            teacher: 'Untuk Guru',
            team: 'Untuk Tim Pengabdian',
        },
        tabText: {
            student: 'Siswa mengisi kuesioner dengan kode peserta, melihat skor, dan mendapatkan tips edukasi yang mudah dipahami.',
            teacher: 'Guru mengikuti alur yang sama, sehingga hasil dapat dianalisis terpisah dari peserta siswa.',
            team: 'Tim pengabdian dapat melihat rekap, perbandingan pre-test dan post-test, serta data kegiatan.',
        },
        benefits: [
            'Mudah digunakan siswa dan guru.',
            'Tidak membutuhkan akun peserta.',
            'Hasil dihitung otomatis.',
            'Pre-test dan post-test terhubung melalui kode peserta.',
            'Data dapat dianalisis oleh tim pengabdian.',
        ],
        prePostTitle: 'Evaluasi Sebelum dan Sesudah Edukasi',
        preText: 'Pre-Test mengukur pemahaman awal sebelum kegiatan edukasi dimulai.',
        postText: 'Post-Test membantu melihat perubahan pemahaman setelah kegiatan selesai.',
        stepsTitle: 'Pengisian Mudah dalam Beberapa Langkah',
        steps: [
            'Pilih Pre-Test atau Post-Test',
            'Pilih peran Siswa atau Guru',
            'Masukkan kode peserta',
            'Isi modul Literasi Digital',
            'Isi modul Keamanan Digital',
            'Lihat hasil dan rekomendasi',
        ],
        valueTitle: 'Memberikan Manfaat bagi Peserta dan Tim Pengabdian',
        valueText: 'LDKD Care membantu tim membandingkan skor awal dan akhir setiap peserta secara akurat.',
        resultTitle: 'Hasil yang Mudah Dipahami',
        faqTitle: 'Pertanyaan yang Sering Diajukan',
        finalTitle: 'Mulai Evaluasi Literasi Digital Anda',
        finalText:
            'Isi kuesioner dengan jujur dan temukan pemahaman Anda mengenai penggunaan teknologi serta keamanan data.',
        footerInfo: 'Aplikasi evaluasi Literasi Digital dan Keamanan Digital untuk kegiatan edukasi.',
        privacy: 'Kebijakan privasi',
        version: 'Versi 2.1',
        contact: 'Kontak tim',
        backTop: 'Kembali ke atas',
    },
    en: {
        nav: ['Home', 'About', 'Digital Literacy', 'Digital Security', 'How It Works', 'FAQ'],
        badge: 'Digital Literacy & Digital Security Assessment',
        title: 'Discover Your Digital Literacy and Digital Security Level',
        description:
            'LDKD Care helps students and teachers measure understanding before and after education activities through structured pre-tests and post-tests.',
        start: 'Fill Questionnaire Now',
        learn: 'See How It Works',
        note: 'No account registration • Automatic results • Connected pre-test and post-test data',
        admin: 'Admin Login',
        highlights: ['No participant login', 'Two assessment modules', 'Automatic scoring', 'Pre-test and post-test', 'Bilingual', 'Responsive'],
        areasTitle: 'Two Important Areas in Digital Life',
        areasText: 'LDKD Care evaluates participants through two complementary modules.',
        aboutTitle: 'Designed for Digital Education Evaluation',
        aboutText:
            'The system helps digital education activities become easier to evaluate, simple to use, and accessible without participant accounts.',
        tabs: {
            student: 'For Students',
            teacher: 'For Teachers',
            team: 'For Service Team',
        },
        tabText: {
            student: 'Students complete the questionnaire with a participant code, view scores, and receive clear education tips.',
            teacher: 'Teachers follow the same flow so results can be analyzed separately from student participants.',
            team: 'The team can view summaries, pre-test/post-test comparisons, and activity data.',
        },
        benefits: [
            'Easy for students and teachers.',
            'No participant account required.',
            'Results are calculated automatically.',
            'Pre-test and post-test are linked by participant code.',
            'Data can be analyzed by the service team.',
        ],
        prePostTitle: 'Evaluation Before and After Education',
        preText: 'The Pre-Test measures initial understanding before the education activity begins.',
        postText: 'The Post-Test shows understanding changes after the activity ends.',
        stepsTitle: 'Complete the Questionnaire in a Few Steps',
        steps: [
            'Choose Pre-Test or Post-Test',
            'Choose Student or Teacher role',
            'Enter participant code',
            'Complete Digital Literacy module',
            'Complete Digital Security module',
            'View results and recommendations',
        ],
        valueTitle: 'Useful for Participants and the Service Team',
        valueText: 'LDKD Care helps compare initial and final scores for every participant accurately.',
        resultTitle: 'Results That Are Easy to Understand',
        faqTitle: 'Frequently Asked Questions',
        finalTitle: 'Start Your Digital Literacy Evaluation',
        finalText:
            'Answer honestly and discover your understanding of technology use and data security.',
        footerInfo: 'A Digital Literacy and Digital Security evaluation app for education activities.',
        privacy: 'Privacy policy',
        version: 'Version 2.1',
        contact: 'Team contact',
        backTop: 'Back to top',
    },
};

const sectionLinks = ['#home', '#about', '#literacy', '#security', '#process', '#faq'];

export default function Landing({ activity }: Props) {
    const [language, setLanguage] = useState<Language>('id');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('student');
    const [openFaq, setOpenFaq] = useState(0);
    const reduceMotion = useReducedMotion();
    const t = copy[language];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 12);
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const reveal = useMemo<Variants>(
        () => ({
            hidden: { opacity: 0, y: reduceMotion ? 0 : 26 },
            visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' } },
        }),
        [reduceMotion],
    );

    const questionnaireHref = route('participant.select-mode', { lang: language });

    const assessmentCards = [
        {
            title: language === 'id' ? 'Literasi Digital' : 'Digital Literacy',
            icon: BookOpenCheck,
            tone: 'indigo',
            points:
                language === 'id'
                    ? ['Memahami informasi digital', 'Memverifikasi sumber', 'Membedakan fakta dan opini', 'Menggunakan teknologi bertanggung jawab']
                    : ['Understand digital information', 'Verify sources', 'Separate facts and opinions', 'Use technology responsibly'],
        },
        {
            title: language === 'id' ? 'Keamanan Digital' : 'Digital Security',
            icon: ShieldCheck,
            tone: 'cyan',
            points:
                language === 'id'
                    ? ['Melindungi akun', 'Membuat kata sandi kuat', 'Menjaga OTP', 'Mengenali phishing']
                    : ['Protect accounts', 'Create strong passwords', 'Keep OTP safe', 'Recognize phishing'],
        },
        {
            title: language === 'id' ? 'Evaluasi Pre-Test dan Post-Test' : 'Pre-Test and Post-Test Evaluation',
            icon: TrendingUp,
            tone: 'violet',
            points:
                language === 'id'
                    ? ['Mengukur pemahaman awal', 'Membandingkan hasil edukasi', 'Menampilkan peningkatan skor', 'Membantu evaluasi program']
                    : ['Measure initial understanding', 'Compare education results', 'Show score improvement', 'Support program evaluation'],
        },
    ];

    const resultCards = [
        [BookOpenCheck, language === 'id' ? 'Skor Literasi Digital' : 'Digital Literacy Score', '84%', 'indigo'],
        [ShieldCheck, language === 'id' ? 'Skor Keamanan Digital' : 'Digital Security Score', '86%', 'cyan'],
        [CheckCircle2, language === 'id' ? 'Kategori Hasil' : 'Result Category', language === 'id' ? 'Tinggi' : 'High', 'violet'],
        [Sparkles, language === 'id' ? 'Tips Edukasi' : 'Education Tips', language === 'id' ? 'Otomatis' : 'Automatic', 'sky'],
    ] as const;

    const faqItems =
        language === 'id'
            ? [
                  ['Apakah peserta harus membuat akun?', 'Tidak. Peserta cukup menggunakan kode peserta unik yang diberikan oleh admin atau panitia.'],
                  ['Apa perbedaan pre-test dan post-test?', 'Pre-test dilakukan sebelum edukasi, sedangkan post-test dilakukan setelah edukasi untuk melihat perubahan pemahaman.'],
                  ['Bagaimana sistem mengenali peserta yang sama?', 'Sistem menghubungkan data melalui participant_id dan kode peserta unik, bukan hanya nama.'],
                  ['Apakah hasil langsung muncul?', 'Ya. Skor, kategori, dan tips edukasi muncul otomatis setelah jawaban dikirim.'],
                  ['Apakah data peserta aman?', 'Data tidak ditampilkan ke peserta lain dan akses pengelolaan hanya tersedia untuk admin.'],
                  ['Apakah kuesioner dapat diisi melalui ponsel?', 'Ya. Seluruh halaman dibuat responsif untuk ponsel, tablet, dan desktop.'],
                  ['Apa yang dilakukan jika kode peserta hilang?', 'Peserta perlu menghubungi admin atau tim kegiatan agar kode dapat dicek kembali.'],
              ]
            : [
                  ['Do participants need an account?', 'No. Participants only need the unique code provided by the admin or organizer.'],
                  ['What is the difference between pre-test and post-test?', 'Pre-test is completed before education, while post-test is completed after education to observe changes.'],
                  ['How does the system recognize the same participant?', 'The system links records through participant_id and unique participant codes, not names alone.'],
                  ['Do results appear immediately?', 'Yes. Scores, categories, and education tips appear automatically after submission.'],
                  ['Is participant data secure?', 'Results are not shown to other participants and management access is admin-only.'],
                  ['Can the questionnaire be completed on mobile?', 'Yes. The public flow is responsive for mobile, tablet, and desktop.'],
                  ['What if a participant code is lost?', 'The participant should contact the activity admin or team to check the code.'],
              ];

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#172033]">
            <Head title="LDKD Care" />

            <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mx-auto flex h-14 max-w-[1120px] items-center justify-between rounded-2xl border px-4 transition-all duration-300 ${
                        isScrolled
                            ? 'border-[#E8ECF3] bg-white/92 shadow-[0_18px_44px_-32px_rgba(23,32,51,0.45)] backdrop-blur-xl'
                            : 'border-white/70 bg-white/78 shadow-[0_16px_40px_-34px_rgba(23,32,51,0.38)] backdrop-blur-md'
                    }`}
                >
                    <a href="#home" className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5B5FEF] text-white">
                            <ShieldCheck className="h-4 w-4" />
                        </span>
                        <span className="font-heading text-base font-bold text-[#172033]">LDKD Care</span>
                    </a>

                    <nav className="hidden items-center gap-6 lg:flex">
                        {t.nav.map((item, index) => (
                            <a key={item} href={sectionLinks[index]} className="group text-xs font-semibold text-[#667085] transition hover:text-[#5B5FEF]">
                                {item}
                                <span className="mx-auto mt-1 block h-0.5 w-0 rounded-full bg-[#5B5FEF] transition-all group-hover:w-4" />
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 lg:flex">
                        <button type="button" onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E8ECF3] bg-white px-3 text-xs font-bold text-[#667085] transition hover:text-[#5B5FEF]">
                            <Globe2 className="h-4 w-4" />
                            {language.toUpperCase()}
                        </button>
                        <Link href={route('admin.login')} className="inline-flex h-9 items-center rounded-xl border border-[#E8ECF3] bg-white px-3 text-xs font-bold text-[#172033] transition hover:text-[#5B5FEF]">
                            {t.admin}
                        </Link>
                        <Link href={questionnaireHref} className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#172033] px-4 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#5B5FEF]">
                            {language === 'id' ? 'Isi Kuesioner' : 'Questionnaire'}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8ECF3] bg-white lg:hidden" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                        <Menu className="h-5 w-5" />
                    </button>
                </motion.div>
            </header>

            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[60] bg-[#172033]/20 p-4 backdrop-blur-sm lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: reduceMotion ? 0 : -18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="mx-auto max-w-md rounded-3xl border border-[#E8ECF3] bg-white p-4 shadow-2xl"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="font-heading font-bold">LDKD Care</span>
                                <button type="button" onClick={() => setIsMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8ECF3]" aria-label="Close menu">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="grid gap-1">
                                {t.nav.map((item, index) => (
                                    <a key={item} href={sectionLinks[index]} onClick={() => setIsMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-[#667085] hover:bg-[#F8FAFC] hover:text-[#5B5FEF]">
                                        {item}
                                    </a>
                                ))}
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button type="button" onClick={() => setLanguage(language === 'id' ? 'en' : 'id')} className="rounded-xl border border-[#E8ECF3] px-3 py-3 text-sm font-bold">
                                    {language.toUpperCase()}
                                </button>
                                <Link href={route('admin.login')} className="rounded-xl border border-[#E8ECF3] px-3 py-3 text-center text-sm font-bold">
                                    {t.admin}
                                </Link>
                                <Link href={questionnaireHref} className="col-span-2 rounded-xl bg-[#5B5FEF] px-3 py-3 text-center text-sm font-bold text-white">
                                    {t.start}
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <main id="home">
                <section className="ldkd-sky relative overflow-hidden pt-28 sm:pt-32">
                    <CloudDecor variant="hero" />
                    <div className="ldkd-container relative z-10 text-center">
                        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }} className="mx-auto max-w-4xl">
                            <motion.div variants={reveal} className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-[#5B5FEF] shadow-sm">
                                <Sparkles className="h-4 w-4" />
                                {t.badge}
                            </motion.div>
                            <motion.h1 variants={reveal} className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.01em] text-[#172033] sm:text-5xl lg:text-6xl">
                                {t.title}
                            </motion.h1>
                            <motion.p variants={reveal} className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#667085] sm:text-lg">
                                {activity?.theme || t.description}
                            </motion.p>
                            <motion.div variants={reveal} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link href={questionnaireHref} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#5B5FEF] px-7 text-base font-bold text-white shadow-[0_18px_38px_-24px_rgba(91,95,239,0.9)] transition hover:-translate-y-0.5 hover:bg-[#494DDB]">
                                    {t.start}
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <a href="#process" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/80 px-7 text-base font-bold text-[#172033] shadow-sm transition hover:-translate-y-0.5 hover:text-[#5B5FEF]">
                                    {t.learn}
                                    <MousePointerClick className="h-5 w-5" />
                                </a>
                            </motion.div>
                            <motion.p variants={reveal} className="mt-5 text-sm font-medium text-[#667085]">{t.note}</motion.p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.75, delay: 0.25 }} className="mx-auto mt-12 max-w-5xl pb-16">
                            <AppPreview />
                        </motion.div>
                    </div>
                </section>

                <section className="border-y border-[#E8ECF3] bg-white py-6">
                    <div className="ldkd-container flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        {t.highlights.map((item, index) => (
                            <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#667085]">
                                {index % 3 === 0 ? <UserRoundCheck className="h-4 w-4 text-[#5B5FEF]" /> : index % 3 === 1 ? <ClipboardCheck className="h-4 w-4 text-[#38BDF8]" /> : <CheckCircle2 className="h-4 w-4 text-[#10B981]" />}
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                <section id="literacy" className="ldkd-section bg-[#F8FAFC]">
                    <div className="ldkd-container">
                        <SectionHeading kicker="Assessment Areas" title={t.areasTitle} text={t.areasText} reveal={reveal} />
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="mt-12 grid gap-5 lg:grid-cols-3">
                            {assessmentCards.map((card) => (
                                <AssessmentCard key={card.title} {...card} reveal={reveal} />
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section id="about" className="ldkd-section bg-white">
                    <div className="ldkd-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal}>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">LDKD Care</p>
                            <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033] sm:text-4xl">{t.aboutTitle}</h2>
                            <p className="mt-5 max-w-xl leading-8 text-[#667085]">{t.aboutText}</p>
                            <div className="mt-7 space-y-3 border-l border-[#E8ECF3] pl-5">
                                {t.benefits.map((item) => (
                                    <div key={item} className="flex gap-3">
                                        <span className="mt-2 h-2 w-2 rounded-full bg-[#5B5FEF]" />
                                        <p className="font-medium leading-7 text-[#667085]">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {(Object.keys(t.tabs) as TabKey[]).map((tab) => (
                                    <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${activeTab === tab ? 'border-[#5B5FEF] bg-[#F1F3FF] text-[#5B5FEF]' : 'border-[#E8ECF3] bg-white text-[#667085] hover:text-[#5B5FEF]'}`}>
                                        {t.tabs[tab]}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="rounded-[28px] border border-[#E8ECF3] bg-[#F8FAFC] p-4 shadow-[0_22px_60px_-42px_rgba(23,32,51,0.55)]">
                            <AnimatePresence mode="wait">
                                <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-3xl bg-white p-5">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7CF6]">{t.tabs[activeTab]}</p>
                                            <h3 className="mt-1 font-heading text-2xl font-bold text-[#172033]">{language === 'id' ? 'Preview Alur' : 'Flow Preview'}</h3>
                                        </div>
                                        <span className="rounded-full bg-[#ECFEFF] px-3 py-1 text-xs font-bold text-[#0891B2]">Live</span>
                                    </div>
                                    <p className="mb-5 leading-7 text-[#667085]">{t.tabText[activeTab]}</p>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <MiniPanel icon={QrCode} title="LDKD-A7K92" value={language === 'id' ? 'Kode peserta' : 'Participant code'} tone="indigo" />
                                        <MiniPanel icon={FileCheck2} title={language === 'id' ? 'Kuesioner' : 'Questionnaire'} value="2 modul" tone="cyan" />
                                        <MiniPanel icon={BarChart3} title={language === 'id' ? 'Skor' : 'Score'} value="84%" tone="violet" />
                                        <MiniPanel icon={Sparkles} title={language === 'id' ? 'Tips' : 'Tips'} value={language === 'id' ? 'Edukasi' : 'Education'} tone="sky" />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>

                <section id="security" className="ldkd-section bg-[#F8FAFC]">
                    <div className="ldkd-container">
                        <SectionHeading kicker="Pre & Post" title={t.prePostTitle} text={language === 'id' ? 'Hasil pre-test dan post-test peserta yang sama dapat dibandingkan dengan akurat.' : 'Pre-test and post-test results from the same participant can be compared accurately.'} reveal={reveal} />
                        <div className="mt-12 grid gap-5 lg:grid-cols-2">
                            <FlowCard icon={ClipboardCheck} label={language === 'id' ? 'Sebelum Edukasi' : 'Before Education'} title="Pre-Test" text={t.preText} tone="indigo" />
                            <FlowCard icon={LineChart} label={language === 'id' ? 'Setelah Edukasi' : 'After Education'} title="Post-Test" text={t.postText} tone="violet" />
                        </div>
                        <div className="mt-8 grid gap-3 rounded-3xl border border-[#E8ECF3] bg-white p-4 shadow-sm md:grid-cols-4">
                            {['Pre-Test', language === 'id' ? 'Kegiatan Edukasi' : 'Education Activity', 'Post-Test', language === 'id' ? 'Perbandingan Hasil' : 'Result Comparison'].map((item, index) => (
                                <div key={item} className="relative rounded-2xl bg-[#F8FAFC] p-4 text-center text-sm font-bold text-[#667085]">
                                    {item}
                                    {index < 3 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-[#8B7CF6] md:block" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="process" className="ldkd-section bg-white">
                    <div className="ldkd-container">
                        <SectionHeading kicker="Guided Flow" title={t.stepsTitle} text={language === 'id' ? 'Alur dibuat pendek, jelas, dan nyaman digunakan di ponsel.' : 'The flow is short, clear, and comfortable on mobile.'} reveal={reveal} />
                        <div className="relative mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {t.steps.map((step, index) => (
                                <motion.div key={step} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={reveal} transition={{ delay: reduceMotion ? 0 : index * 0.06 }} className="rounded-3xl border border-[#E8ECF3] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D9DDFF]">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3FF] text-sm font-bold text-[#5B5FEF]">{index + 1}</span>
                                    <p className="mt-5 text-sm font-bold leading-6 text-[#172033]">{step}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="ldkd-section bg-[#F8FAFC]">
                    <div className="ldkd-container grid gap-5 lg:grid-cols-[1.1fr_1.4fr]">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="rounded-[28px] border border-[#D9DDFF] bg-white p-8 shadow-sm">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Impact</p>
                            <h2 className="mt-4 font-heading text-3xl font-bold text-[#172033]">{t.valueTitle}</h2>
                            <div className="mt-8 rounded-3xl bg-[#F1F3FF] p-6">
                                <BarChart3 className="mb-5 h-8 w-8 text-[#5B5FEF]" />
                                <h3 className="font-heading text-2xl font-bold text-[#172033]">{language === 'id' ? 'Evaluasi yang Lebih Terukur' : 'More Measurable Evaluation'}</h3>
                                <p className="mt-3 leading-7 text-[#667085]">{t.valueText}</p>
                            </div>
                        </motion.div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            {[
                                [UserRoundCheck, language === 'id' ? 'Pengisian tanpa login' : 'No-login filling'],
                                [QrCode, language === 'id' ? 'Data peserta tetap terhubung' : 'Participant data stays linked'],
                                [Sparkles, language === 'id' ? 'Hasil otomatis' : 'Automatic results'],
                                [FileCheck2, language === 'id' ? 'Laporan mudah diekspor' : 'Reports are easier to export'],
                            ].map(([Icon, title]) => (
                                <motion.div key={title as string} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="rounded-3xl border border-[#E8ECF3] bg-white p-6 shadow-sm">
                                    <Icon className="h-7 w-7 text-[#5B5FEF]" />
                                    <h3 className="mt-5 font-heading text-xl font-bold text-[#172033]">{title as string}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="ldkd-section bg-white">
                    <div className="ldkd-container">
                        <SectionHeading kicker="Results" title={t.resultTitle} text={language === 'id' ? 'Hasil ditampilkan dalam bentuk skor, kategori, dan tips edukatif.' : 'Results are shown as scores, categories, and education tips.'} reveal={reveal} />
                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {resultCards.map(([Icon, title, value, tone], index) => (
                                <div key={title} className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 ${index === 1 ? 'border-[#5B5FEF] ring-4 ring-[#F1F3FF]' : 'border-[#E8ECF3]'}`}>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneBg(tone)}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <p className="mt-6 text-sm font-semibold text-[#667085]">{title}</p>
                                    <p className="mt-2 font-heading text-3xl font-bold text-[#172033]">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="faq" className="ldkd-section bg-[#F8FAFC]">
                    <div className="ldkd-container">
                        <SectionHeading kicker="FAQ" title={t.faqTitle} text={language === 'id' ? 'Jawaban singkat untuk pertanyaan umum peserta dan guru.' : 'Short answers for common participant and teacher questions.'} reveal={reveal} />
                        <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-2">
                            {faqItems.map(([question, answer], index) => (
                                <div key={question} className="rounded-3xl border border-[#E8ECF3] bg-white shadow-sm">
                                    <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-heading text-base font-bold text-[#172033]">
                                        {question}
                                        {openFaq === index ? <Minus className="h-5 w-5 text-[#5B5FEF]" /> : <Plus className="h-5 w-5 text-[#667085]" />}
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openFaq === index && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <p className="px-5 pb-5 leading-7 text-[#667085]">{answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="ldkd-sky relative overflow-hidden py-20">
                    <CloudDecor variant="section" />
                    <div className="ldkd-container relative z-10 text-center">
                        <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033] sm:text-4xl">{t.finalTitle}</h2>
                        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#667085]">{t.finalText}</p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link href={questionnaireHref} className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#5B5FEF] px-7 text-base font-bold text-white shadow-[0_18px_38px_-24px_rgba(91,95,239,0.9)] transition hover:-translate-y-0.5 hover:bg-[#494DDB]">
                                {t.start}
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <a href="#process" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/80 px-7 text-base font-bold text-[#172033] shadow-sm transition hover:-translate-y-0.5 hover:text-[#5B5FEF]">
                                {t.learn}
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white py-12">
                <div className="ldkd-container grid gap-8 text-sm text-[#667085] md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
                    <div>
                        <div className="mb-4 flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B5FEF] text-white">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <span className="font-heading text-lg font-bold text-[#172033]">LDKD Care</span>
                        </div>
                        <p className="max-w-sm leading-7">{t.footerInfo}</p>
                        <p className="mt-6">&copy; {new Date().getFullYear()} LDKD Care.</p>
                    </div>
                    <FooterColumn title="Navigasi" items={t.nav.map((item, index) => [item, sectionLinks[index]])} />
                    <FooterColumn title={language === 'id' ? 'Informasi Sistem' : 'System Info'} items={[[t.version, '#home'], [t.privacy, '#home']]} />
                    <div>
                        <p className="mb-4 font-heading font-bold text-[#172033]">{t.contact}</p>
                        <p className="leading-7">{language === 'id' ? 'Tim pengabdian LDKD Care' : 'LDKD Care service team'}</p>
                        <button type="button" onClick={scrollToTop} className="mt-5 inline-flex items-center gap-2 font-bold text-[#5B5FEF]">
                            {t.backTop}
                            <ChevronUp className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function AppPreview() {
    return (
        <div className="rounded-[28px] border border-white/75 bg-white/82 p-3 shadow-[0_32px_80px_-42px_rgba(56,104,168,0.75)] backdrop-blur">
            <div className="overflow-hidden rounded-3xl border border-[#E8ECF3] bg-white">
                <div className="grid min-h-[360px] grid-cols-[84px_1fr] sm:grid-cols-[150px_1fr]">
                    <aside className="border-r border-[#E8ECF3] bg-[#F8FAFC] p-3 sm:p-4">
                        <div className="mb-6 flex items-center gap-2">
                            <span className="h-7 w-7 rounded-lg bg-[#5B5FEF]" />
                            <span className="hidden text-sm font-bold text-[#172033] sm:block">LDKD</span>
                        </div>
                        {['Ringkasan', 'Hasil', 'Tips', 'Laporan'].map((item, index) => (
                            <div key={item} className={`mb-2 rounded-xl px-3 py-2 text-xs font-bold ${index === 0 ? 'bg-[#F1F3FF] text-[#5B5FEF]' : 'text-[#98A2B3]'}`}>
                                {item}
                            </div>
                        ))}
                    </aside>
                    <div className="p-4 sm:p-6">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8B7CF6]">Pengisian selesai</p>
                                <h3 className="mt-1 font-heading text-2xl font-bold text-[#172033]">Ringkasan Hasil</h3>
                            </div>
                            <span className="w-fit rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-bold text-[#10B981]">Kategori Tinggi</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <MiniStat title="Rizal Afandi" value="Pre-Test" />
                            <MiniStat title="Literasi Digital" value="84%" accent="indigo" />
                            <MiniStat title="Keamanan Digital" value="86%" accent="cyan" />
                        </div>
                        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="rounded-2xl border border-[#E8ECF3] bg-white p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm font-bold text-[#172033]">Pre-Test vs Post-Test</p>
                                    <span className="rounded-full bg-[#F1F3FF] px-2 py-1 text-xs font-bold text-[#5B5FEF]">+22</span>
                                </div>
                                <div className="flex h-32 items-end gap-3">
                                    {[46, 62, 58, 74, 68, 86].map((height, index) => (
                                        <div key={index} className="flex flex-1 items-end rounded-t-xl bg-[#F1F5F9]">
                                            <div className={`w-full rounded-t-xl ${index % 2 === 0 ? 'bg-[#8B7CF6]' : 'bg-[#38BDF8]'}`} style={{ height: `${height}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[12px] border-[#E1F3FF] border-t-[#5B5FEF] bg-white">
                                    <div>
                                        <p className="text-center font-heading text-3xl font-bold text-[#172033]">86%</p>
                                        <p className="text-center text-xs font-bold text-[#667085]">Selesai</p>
                                    </div>
                                </div>
                                <div className="mt-4 rounded-xl bg-white p-3 text-center text-xs font-bold text-[#667085]">Tips edukasi siap dibaca</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionHeading({ kicker, title, text, reveal }: { kicker: string; title: string; text: string; reveal: Variants }) {
    return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">{kicker}</p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033] sm:text-4xl">{title}</h2>
            <p className="mt-4 leading-8 text-[#667085]">{text}</p>
        </motion.div>
    );
}

function AssessmentCard({ title, icon: Icon, points, tone, reveal }: { title: string; icon: typeof BookOpenCheck; points: string[]; tone: string; reveal: Variants }) {
    return (
        <motion.div variants={reveal} className="group h-full rounded-[28px] border border-[#E8ECF3] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D9DDFF] hover:shadow-[0_24px_60px_-42px_rgba(23,32,51,0.55)]">
            <div className={`mb-6 rounded-3xl p-4 ${toneSurface(tone)}`}>
                <div className="mb-6 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneBg(tone)}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="h-12 w-24 rounded-2xl bg-white/80 p-2">
                        <div className="mb-2 h-2 rounded-full bg-[#E8ECF3]" />
                        <div className={`h-2 w-2/3 rounded-full ${toneLine(tone)}`} />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {[35, 62, 48, 76].map((height, index) => (
                        <div key={index} className="flex h-20 items-end rounded-lg bg-white/65">
                            <div className={`w-full rounded-lg ${toneLine(tone)}`} style={{ height: `${height}%` }} />
                        </div>
                    ))}
                </div>
            </div>
            <h3 className="font-heading text-xl font-bold text-[#172033]">{title}</h3>
            <div className="mt-4 space-y-2">
                {points.map((point) => (
                    <p key={point} className="flex gap-2 text-sm font-medium leading-6 text-[#667085]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                        {point}
                    </p>
                ))}
            </div>
        </motion.div>
    );
}

function FlowCard({ icon: Icon, label, title, text, tone }: { icon: typeof ClipboardCheck; label: string; title: string; text: string; tone: string }) {
    return (
        <div className="rounded-[28px] border border-[#E8ECF3] bg-white p-6 shadow-sm">
            <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${toneBg(tone)}`}>
                <Icon className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#667085]">{label}</p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-[#172033]">{title}</h3>
            <p className="mt-3 leading-7 text-[#667085]">{text}</p>
        </div>
    );
}

function MiniPanel({ icon: Icon, title, value, tone }: { icon: typeof QrCode; title: string; value: string; tone: string }) {
    return (
        <div className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${toneBg(tone)}`}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-[#172033]">{title}</p>
            <p className="mt-1 text-xs font-semibold text-[#667085]">{value}</p>
        </div>
    );
}

function MiniStat({ title, value, accent = 'slate' }: { title: string; value: string; accent?: string }) {
    return (
        <div className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold text-[#667085]">{title}</p>
            <p className={`mt-2 font-heading text-xl font-bold ${accent === 'indigo' ? 'text-[#5B5FEF]' : accent === 'cyan' ? 'text-[#0891B2]' : 'text-[#172033]'}`}>{value}</p>
        </div>
    );
}

function FooterColumn({ title, items }: { title: string; items: string[][] }) {
    return (
        <div>
            <p className="mb-4 font-heading font-bold text-[#172033]">{title}</p>
            <div className="space-y-3">
                {items.map(([label, href]) => (
                    <a key={label} href={href} className="block hover:text-[#5B5FEF]">
                        {label}
                    </a>
                ))}
            </div>
        </div>
    );
}

function toneBg(tone: string) {
    const map: Record<string, string> = {
        indigo: 'bg-[#F1F3FF] text-[#5B5FEF]',
        cyan: 'bg-[#ECFEFF] text-[#0891B2]',
        violet: 'bg-[#F5F3FF] text-[#8B7CF6]',
        sky: 'bg-[#EFF8FF] text-[#38BDF8]',
    };
    return map[tone] || 'bg-[#F8FAFC] text-[#667085]';
}

function toneSurface(tone: string) {
    const map: Record<string, string> = {
        indigo: 'bg-[#F1F3FF]',
        cyan: 'bg-[#ECFEFF]',
        violet: 'bg-[#F5F3FF]',
    };
    return map[tone] || 'bg-[#F8FAFC]';
}

function toneLine(tone: string) {
    const map: Record<string, string> = {
        indigo: 'bg-[#5B5FEF]',
        cyan: 'bg-[#38BDF8]',
        violet: 'bg-[#8B7CF6]',
    };
    return map[tone] || 'bg-[#CBD5E1]';
}
