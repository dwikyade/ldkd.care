import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    BookOpenCheck,
    CameraOff,
    Check,
    CheckCircle2,
    ClipboardCheck,
    Copy,
    GraduationCap,
    HelpCircle,
    History,
    Loader2,
    QrCode,
    RefreshCw,
    School2,
    Search,
    ShieldCheck,
    Sparkles,
    UserRound,
    X,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ParticipantStepper from '@/Components/ldkd/ParticipantStepper';

type Language = 'id' | 'en';
type TestMode = 'pre_test' | 'post_test';
type Role = 'student' | 'teacher';
type Intent = 'create_pretest' | 'resume_pretest' | 'posttest';
type Availability = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

interface Classroom {
    id: number;
    school_id: number;
    name: string;
}

interface School {
    id: number;
    name: string;
    classes?: Classroom[];
}

interface Props {
    mode: TestMode;
    role: Role;
    language?: Language;
    activity?: {
        id: number;
        name: string;
        theme?: string | null;
    } | null;
    schools?: School[];
}

interface RecentCode {
    code: string;
    suffix: string;
    test_type: TestMode;
    used_at: string;
}

interface LookupResult {
    status: string;
    message: string;
    participant?: {
        code?: string;
        name?: string;
        role?: Role;
        school?: string | null;
        classroom?: string | null;
    };
    progress?: {
        answered: number;
        total: number;
        percentage: number;
    };
    redirect?: string;
}

type BarcodeDetectorLike = new (options?: { formats?: string[] }) => {
    detect: (source: CanvasImageSource) => Promise<Array<{ rawValue: string }>>;
};

const copy = {
    id: {
        back: 'Kembali',
        titleCreate: 'Buat Kode Peserta Pre-Test',
        titleLookup: 'Masukkan Kode Peserta',
        descriptionCreate: 'Buat kode pendek milik Anda, simpan baik-baik, lalu gunakan kode yang sama untuk Post-Test.',
        descriptionLookup: 'Gunakan kode yang sama agar data Pre-Test dan Post-Test tetap terhubung.',
        activeActivity: 'Kegiatan aktif',
        noActivityTitle: 'Belum Ada Kegiatan Aktif',
        noActivityText: 'Admin perlu mengaktifkan kegiatan sebelum peserta dapat mengisi kuesioner.',
        pre: 'Pre-Test',
        post: 'Post-Test',
        student: 'Siswa',
        teacher: 'Guru',
        createPretest: 'Buat kode baru',
        resumePretest: 'Lanjutkan Pre-Test',
        posttest: 'Isi Post-Test',
        codeLabel: 'Kode Peserta',
        suffixHint: 'Isi 4-5 huruf atau angka. Sistem akan menambahkan prefix LDKD.',
        generate: 'Buat Otomatis',
        checking: 'Mengecek...',
        available: 'Kode tersedia.',
        taken: 'Kode sudah digunakan.',
        invalid: 'Kode harus 4-5 huruf atau angka.',
        confirmCode: 'Saya sudah mencatat kode peserta ini.',
        copied: 'Kode disalin.',
        copy: 'Salin',
        profileTitle: 'Lengkapi Profil Peserta',
        profileText: 'Data ini hanya digunakan untuk mengelompokkan hasil evaluasi kegiatan.',
        fullName: 'Nama lengkap',
        school: 'Sekolah',
        chooseSchool: 'Pilih sekolah',
        otherSchool: 'Sekolah lainnya',
        writeSchool: 'Tulis nama sekolah',
        classroom: 'Kelas',
        chooseClass: 'Pilih kelas',
        otherClass: 'Kelas lainnya',
        writeClass: 'Tulis nama kelas',
        gender: 'Jenis kelamin',
        position: 'Jabatan',
        male: 'Laki-laki',
        female: 'Perempuan',
        optionalTeacher: 'Contoh: Guru BK, Wali Kelas',
        register: 'Mulai Pre-Test',
        registering: 'Menyiapkan draft...',
        lookup: 'Cek Kode',
        lookupPost: 'Cek Kelayakan Post-Test',
        startPost: 'Mulai Post-Test',
        continueFill: 'Lanjutkan Pengisian',
        processing: 'Memproses...',
        recent: 'Kode terakhir di browser ini',
        noRecent: 'Belum ada riwayat kode di browser ini.',
        clearRecent: 'Hapus riwayat',
        qrHint: 'Pindai QR jika panitia memberikan kode peserta.',
        scan: 'Scan QR',
        scanning: 'Arahkan kamera ke QR peserta',
        stopScan: 'Tutup Scanner',
        unsupported: 'Browser ini belum mendukung scan QR langsung. Masukkan kode secara manual.',
        cameraDenied: 'Kamera tidak dapat diakses. Periksa izin kamera atau masukkan kode manual.',
        pretestCompleted: 'Pre-Test dengan kode ini sudah selesai. Gunakan kode yang sama untuk Post-Test.',
        requiredProfile: 'Nama dan sekolah wajib diisi. Untuk siswa, kelas juga perlu diisi.',
        useCode: 'Gunakan',
        codeShort: 'Kode',
        name: 'Nama',
        answered: 'terjawab',
        guideTitle: 'Panduan singkat',
        guideCreate: 'Belum punya kode? Tetap di halaman ini, buat kode peserta, lengkapi profil, lalu mulai Pre-Test. Setelah selesai, simpan kode tersebut.',
        guideResume: 'Jika Pre-Test belum selesai, masukkan kode yang sudah pernah dibuat untuk melanjutkan dari jawaban terakhir.',
        guidePost: 'Post-Test hanya untuk peserta yang sudah menyelesaikan Pre-Test. Masukkan kode peserta yang sama dengan Pre-Test.',
        noCodeTitle: 'Belum punya kode peserta?',
        noCodeText: 'Jangan mulai dari Post-Test. Kembali ke Pre-Test terlebih dahulu untuk membuat kode dan mengisi pemahaman awal.',
        startPretest: 'Mulai dari Pre-Test',
    },
    en: {
        back: 'Back',
        titleCreate: 'Create Pre-Test Participant Code',
        titleLookup: 'Enter Participant Code',
        descriptionCreate: 'Create your short code, keep it safely, then use the same code for the Post-Test.',
        descriptionLookup: 'Use the same code so your Pre-Test and Post-Test data stay connected.',
        activeActivity: 'Active activity',
        noActivityTitle: 'No Active Activity',
        noActivityText: 'An admin must activate an activity before participants can complete the questionnaire.',
        pre: 'Pre-Test',
        post: 'Post-Test',
        student: 'Student',
        teacher: 'Teacher',
        createPretest: 'Create new code',
        resumePretest: 'Resume Pre-Test',
        posttest: 'Take Post-Test',
        codeLabel: 'Participant Code',
        suffixHint: 'Enter 4-5 letters or numbers. The system adds the LDKD prefix.',
        generate: 'Generate',
        checking: 'Checking...',
        available: 'Code is available.',
        taken: 'Code is already used.',
        invalid: 'Code must be 4-5 letters or numbers.',
        confirmCode: 'I have saved this participant code.',
        copied: 'Code copied.',
        copy: 'Copy',
        profileTitle: 'Complete Participant Profile',
        profileText: 'This data is only used to group activity evaluation results.',
        fullName: 'Full name',
        school: 'School',
        chooseSchool: 'Choose school',
        otherSchool: 'Other school',
        writeSchool: 'Type school name',
        classroom: 'Class',
        chooseClass: 'Choose class',
        otherClass: 'Other class',
        writeClass: 'Type class name',
        gender: 'Gender',
        position: 'Position',
        male: 'Male',
        female: 'Female',
        optionalTeacher: 'Example: Counselor, Homeroom Teacher',
        register: 'Start Pre-Test',
        registering: 'Preparing draft...',
        lookup: 'Check Code',
        lookupPost: 'Check Post-Test Eligibility',
        startPost: 'Start Post-Test',
        continueFill: 'Continue',
        processing: 'Processing...',
        recent: 'Recent codes in this browser',
        noRecent: 'No code history in this browser yet.',
        clearRecent: 'Clear history',
        qrHint: 'Scan QR if the organizer provides a participant code.',
        scan: 'Scan QR',
        scanning: 'Point your camera to the participant QR',
        stopScan: 'Close Scanner',
        unsupported: 'This browser does not support direct QR scanning yet. Enter the code manually.',
        cameraDenied: 'Camera access failed. Check camera permission or enter the code manually.',
        pretestCompleted: 'Pre-Test with this code is complete. Use the same code for Post-Test.',
        requiredProfile: 'Name and school are required. Students also need to enter a class.',
        useCode: 'Use',
        codeShort: 'Code',
        name: 'Name',
        answered: 'answered',
        guideTitle: 'Quick guide',
        guideCreate: 'No code yet? Stay on this page, create a participant code, complete your profile, then start the Pre-Test. Save the code after finishing.',
        guideResume: 'If your Pre-Test is not complete yet, enter the code you created earlier to resume from the last saved answer.',
        guidePost: 'Post-Test is only for participants who have completed the Pre-Test. Enter the same participant code used in the Pre-Test.',
        noCodeTitle: 'Do not have a participant code?',
        noCodeText: 'Do not start from the Post-Test. Go back to the Pre-Test first to create a code and complete the initial assessment.',
        startPretest: 'Start with Pre-Test',
    },
};

const emptyProfile = {
    full_name: '',
    school_id: '',
    school_name: '',
    class_id: '',
    class_name: '',
    gender: '',
    position: '',
};

export default function Identify({ mode, role, language = 'id', activity, schools = [] }: Props) {
    const reduceMotion = useReducedMotion();
    const t = copy[language];
    const [intent, setIntent] = useState<Intent>(mode === 'post_test' ? 'posttest' : 'create_pretest');
    const [suffix, setSuffix] = useState('');
    const [availability, setAvailability] = useState<Availability>('idle');
    const [statusText, setStatusText] = useState('');
    const [codeConfirmed, setCodeConfirmed] = useState(false);
    const [profile, setProfile] = useState(emptyProfile);
    const [formError, setFormError] = useState<string | null>(null);
    const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isStartingPost, setIsStartingPost] = useState(false);
    const [copied, setCopied] = useState(false);
    const [recentCodes, setRecentCodes] = useState<RecentCode[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<number | null>(null);
    const checkTimerRef = useRef<number | null>(null);

    const storageKey = activity ? `ldkd_recent_codes_${activity.id}` : 'ldkd_recent_codes';
    const normalizedSuffix = normalizeSuffix(suffix);
    const fullCode = normalizedSuffix ? `LDKD-${normalizedSuffix}` : 'LDKD-';
    const isCreate = intent === 'create_pretest';
    const isPost = intent === 'posttest';
    const selectedSchool = useMemo(
        () => schools.find((school) => String(school.id) === profile.school_id),
        [profile.school_id, schools],
    );
    const classOptions = selectedSchool?.classes || [];
    const selectedClass = useMemo(
        () => classOptions.find((item) => String(item.id) === profile.class_id),
        [classOptions, profile.class_id],
    );

    useEffect(() => {
        setIntent(mode === 'post_test' ? 'posttest' : 'create_pretest');
    }, [mode]);

    useEffect(() => {
        try {
            const saved = JSON.parse(window.localStorage.getItem(storageKey) || '[]') as RecentCode[];
            setRecentCodes(Array.isArray(saved) ? saved.slice(0, 5) : []);
        } catch {
            window.localStorage.removeItem(storageKey);
        }
    }, [storageKey]);

    useEffect(() => {
        if (!activity || !isCreate) {
            return;
        }

        setCodeConfirmed(false);
        setLookupResult(null);

        if (checkTimerRef.current) {
            window.clearTimeout(checkTimerRef.current);
        }

        if (!normalizedSuffix) {
            setAvailability('idle');
            setStatusText('');
            return;
        }

        if (!isValidSuffix(normalizedSuffix)) {
            setAvailability('invalid');
            setStatusText(t.invalid);
            return;
        }

        setAvailability('checking');
        setStatusText(t.checking);

        checkTimerRef.current = window.setTimeout(() => {
            axios
                .post(route('participant.code.check'), {
                    activity_id: activity.id,
                    suffix: normalizedSuffix,
                })
                .then((response) => {
                    setAvailability(response.data.available ? 'available' : 'taken');
                    setStatusText(response.data.available ? t.available : t.taken);
                })
                .catch((error) => {
                    setAvailability('invalid');
                    setStatusText(readError(error, t.invalid, language));
                });
        }, 350);

        return () => {
            if (checkTimerRef.current) {
                window.clearTimeout(checkTimerRef.current);
            }
        };
    }, [activity, isCreate, normalizedSuffix, t.available, t.checking, t.invalid, t.taken]);

    const stopScanner = () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsScanning(false);
    };

    useEffect(() => stopScanner, []);

    const setSuffixFromInput = (value: string) => {
        setSuffix(normalizeSuffix(value));
        setLookupResult(null);
        setFormError(null);
    };

    const saveRecent = (codeOrSuffix: string, testType: TestMode) => {
        if (!activity) {
            return;
        }

        const cleanSuffix = normalizeSuffix(codeOrSuffix);
        if (!isValidSuffix(cleanSuffix)) {
            return;
        }

        const code = `LDKD-${cleanSuffix}`;
        const next = [
            { code, suffix: cleanSuffix, test_type: testType, used_at: new Date().toISOString() },
            ...recentCodes.filter((item) => item.code !== code),
        ].slice(0, 5);

        setRecentCodes(next);
        window.localStorage.setItem(storageKey, JSON.stringify(next));
    };

    const clearRecent = () => {
        setRecentCodes([]);
        window.localStorage.removeItem(storageKey);
    };

    const generateCode = async () => {
        if (!activity) {
            return;
        }

        setIsGenerating(true);
        setFormError(null);

        try {
            const response = await axios.post(route('participant.code.generate'), {
                activity_id: activity.id,
            });
            setSuffix(response.data.suffix);
            setAvailability('available');
            setStatusText(t.available);
            setCodeConfirmed(false);
        } catch (error) {
            setFormError(readError(error, t.invalid, language));
        } finally {
            setIsGenerating(false);
        }
    };

    const copyCode = async () => {
        if (!normalizedSuffix) {
            return;
        }

        await navigator.clipboard?.writeText(fullCode);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    };

    const submitRegistration = async (event: FormEvent) => {
        event.preventDefault();
        setFormError(null);

        if (!activity || availability !== 'available' || !codeConfirmed) {
            setFormError(t.invalid);
            return;
        }

        if (!profile.full_name.trim() || !profile.school_name.trim() || (role === 'student' && !profile.class_name.trim())) {
            setFormError(t.requiredProfile);
            return;
        }

        setIsRegistering(true);

        try {
            const response = await axios.post(route('participant.register'), {
                activity_id: activity.id,
                suffix: normalizedSuffix,
                role,
                language,
                full_name: profile.full_name.trim(),
                school_id: selectedSchool?.id,
                school_name: profile.school_name.trim(),
                class_id: selectedClass?.id,
                class_name: role === 'student' ? profile.class_name.trim() : null,
                gender: profile.gender || null,
                position: role === 'teacher' ? profile.position.trim() || null : null,
            });

            saveRecent(normalizedSuffix, 'pre_test');
            window.location.href = response.data.redirect;
        } catch (error) {
            setFormError(readError(error, t.invalid, language));
        } finally {
            setIsRegistering(false);
        }
    };

    const lookupCode = async () => {
        if (!activity || !isValidSuffix(normalizedSuffix)) {
            setFormError(t.invalid);
            return;
        }

        setIsLookingUp(true);
        setFormError(null);
        setLookupResult(null);

        try {
            const response = await axios.post(route(isPost ? 'participant.posttest.eligibility' : 'participant.pretest.resume'), {
                activity_id: activity.id,
                suffix: normalizedSuffix,
                role,
                language,
            });

            setLookupResult(response.data);

            if (response.data.redirect && ['PRETEST_DRAFT', 'POSTTEST_INCOMPLETE', 'PRETEST_INCOMPLETE'].includes(response.data.status)) {
                saveRecent(normalizedSuffix, isPost ? 'post_test' : 'pre_test');
                window.location.href = response.data.redirect;
            }
        } catch (error) {
            setFormError(readError(error, t.invalid, language));
        } finally {
            setIsLookingUp(false);
        }
    };

    const startPostTest = async () => {
        if (!activity || !isValidSuffix(normalizedSuffix)) {
            setFormError(t.invalid);
            return;
        }

        setIsStartingPost(true);
        setFormError(null);

        try {
            const response = await axios.post(route('participant.posttest.start'), {
                activity_id: activity.id,
                suffix: normalizedSuffix,
                role,
                language,
            });

            saveRecent(normalizedSuffix, 'post_test');
            window.location.href = response.data.redirect;
        } catch (error) {
            setFormError(readError(error, t.invalid, language));
        } finally {
            setIsStartingPost(false);
        }
    };

    const startScanner = async () => {
        const BarcodeDetector = (window as Window & { BarcodeDetector?: BarcodeDetectorLike }).BarcodeDetector;

        if (!BarcodeDetector) {
            setScanError(t.unsupported);
            return;
        }

        setScanError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });

            streamRef.current = stream;
            setIsScanning(true);

            window.setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    void videoRef.current.play();
                }
            }, 0);

            const detector = new BarcodeDetector({ formats: ['qr_code'] });
            intervalRef.current = window.setInterval(async () => {
                if (!videoRef.current || videoRef.current.readyState < 2) {
                    return;
                }

                const results = await detector.detect(videoRef.current);
                const code = results[0]?.rawValue?.trim();

                if (code) {
                    setSuffixFromInput(code);
                    stopScanner();
                }
            }, 700);
        } catch {
            setScanError(t.cameraDenied);
            stopScanner();
        }
    };

    return (
        <ParticipantLayout>
            <Head title={isCreate ? t.titleCreate : t.titleLookup} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col pt-4">
                <ParticipantStepper current={2} />
                <Link href={route('participant.select-role', { mode, lang: language })} className="mb-8 inline-flex items-center text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.back}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                >
                    <section className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex flex-wrap items-center justify-center gap-2">
                            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-700">
                                {mode === 'pre_test' ? t.pre : t.post}
                            </span>
                            <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-700">
                                {role === 'student' ? t.student : t.teacher}
                            </span>
                        </div>
                        <h1 className="mt-4 font-heading text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                            {isCreate ? t.titleCreate : t.titleLookup}
                        </h1>
                        <p className="mt-3 leading-7 text-slate-600">
                            {isCreate ? t.descriptionCreate : t.descriptionLookup}
                        </p>
                    </section>

                    {!activity && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                            <div className="flex gap-3">
                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-bold">{t.noActivityTitle}</p>
                                    <p className="mt-1 text-sm leading-6">{t.noActivityText}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activity && (
                        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 text-sm shadow-[0_18px_45px_-35px_rgba(23,32,51,0.45)] backdrop-blur">
                            <p className="font-semibold text-slate-500">{t.activeActivity}</p>
                            <p className="mt-1 font-bold text-slate-950">{activity.name}</p>
                        </div>
                    )}

                    <Card className="!border-[#D9DDFF] !bg-white/92 !shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                    <HelpCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-heading text-lg font-bold text-[#172033]">{t.guideTitle}</h2>
                                    <p className="mt-2 text-sm leading-7 text-[#667085]">
                                        {intent === 'create_pretest' ? t.guideCreate : intent === 'resume_pretest' ? t.guideResume : t.guidePost}
                                    </p>
                                    {intent === 'posttest' && (
                                        <Button asChild variant="outline" className="mt-4 gap-2">
                                            <Link href={route('participant.identify', { mode: 'pre_test', role, lang: language })}>
                                                {t.startPretest}
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {mode === 'pre_test' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <IntentCard
                                active={intent === 'create_pretest'}
                                icon={<Sparkles className="h-5 w-5" />}
                                title={t.createPretest}
                                description={t.descriptionCreate}
                                onClick={() => {
                                    setIntent('create_pretest');
                                    setLookupResult(null);
                                    setFormError(null);
                                }}
                            />
                            <IntentCard
                                active={intent === 'resume_pretest'}
                                icon={<History className="h-5 w-5" />}
                                title={t.resumePretest}
                                description={t.descriptionLookup}
                                onClick={() => {
                                    setIntent('resume_pretest');
                                    setLookupResult(null);
                                    setFormError(null);
                                }}
                            />
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[1fr_0.82fr]">
                        <div className="space-y-6">
                            <Card className="!bg-white/95">
                                <CardContent className="p-6">
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="font-heading text-xl font-bold text-[#172033]">{t.codeLabel}</h2>
                                            <p className="mt-1 text-sm leading-6 text-[#667085]">{t.suffixHint}</p>
                                        </div>
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                            <ClipboardCheck className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <div className="flex min-h-[54px] flex-1 overflow-hidden rounded-2xl border border-[#E8ECF3] bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#5B5FEF]">
                                            <span className="flex items-center border-r border-[#E8ECF3] bg-[#F8FAFC] px-4 font-mono text-sm font-bold text-[#667085]">
                                                LDKD-
                                            </span>
                                            <input
                                                value={suffix}
                                                onChange={(event) => setSuffixFromInput(event.target.value)}
                                                placeholder="A7K92"
                                                maxLength={5}
                                                className="w-full border-0 bg-white px-4 font-mono text-lg font-bold uppercase tracking-[0.18em] text-[#172033] outline-none placeholder:text-[#CBD5E1]"
                                                disabled={!activity || isRegistering || isLookingUp}
                                            />
                                        </div>

                                        {isCreate ? (
                                            <Button type="button" variant="outline" className="gap-2" onClick={generateCode} disabled={!activity || isGenerating}>
                                                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                                {t.generate}
                                            </Button>
                                        ) : (
                                            <Button type="button" className="gap-2" onClick={lookupCode} disabled={!activity || isLookingUp || !isValidSuffix(normalizedSuffix)}>
                                                {isLookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                                {isPost ? t.lookupPost : t.lookup}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-[#667085]">Preview</p>
                                            <p className="mt-1 font-mono text-xl font-bold tracking-wide text-[#172033]">{fullCode}</p>
                                        </div>
                                        <Button type="button" variant="ghost" className="gap-2" onClick={copyCode} disabled={!normalizedSuffix}>
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            {copied ? t.copied : t.copy}
                                        </Button>
                                    </div>

                                    {isCreate && (
                                        <div className="mt-3">
                                            <StatusPill availability={availability} text={statusText} />
                                            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E8ECF3] bg-white p-4 transition hover:border-[#D9DDFF] hover:bg-[#F8FAFC]">
                                                <input
                                                    type="checkbox"
                                                    checked={codeConfirmed}
                                                    onChange={(event) => setCodeConfirmed(event.target.checked)}
                                                    disabled={availability !== 'available'}
                                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                                                />
                                                <span className="font-medium leading-6 text-[#667085]">{t.confirmCode}</span>
                                            </label>
                                        </div>
                                    )}

                                    {!isCreate && (
                                        <div className="mt-8 border-t border-[#E8ECF3] pt-5">
                                            <p className="mb-3 text-sm text-[#667085]">{t.qrHint}</p>
                                            {scanError && (
                                                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                                    <div className="flex gap-2">
                                                        <CameraOff className="mt-0.5 h-4 w-4 shrink-0" />
                                                        <span>{scanError}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {isScanning && (
                                                <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-3">
                                                    <video ref={videoRef} className="aspect-video w-full rounded-xl object-cover" muted playsInline />
                                                    <p className="mt-3 text-sm font-semibold text-white">{t.scanning}</p>
                                                </div>
                                            )}

                                            <Button
                                                variant="outline"
                                                type="button"
                                                className="gap-2"
                                                onClick={isScanning ? stopScanner : startScanner}
                                                disabled={!activity}
                                            >
                                                {isScanning ? <X className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
                                                {isScanning ? t.stopScan : t.scan}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <AnimatePresence mode="wait">
                                {isCreate && codeConfirmed && availability === 'available' && (
                                    <motion.form
                                        key="profile"
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                                        transition={{ duration: 0.24 }}
                                        onSubmit={submitRegistration}
                                    >
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="mb-6 flex items-start gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFEFF] text-cyan-700">
                                                        {role === 'student' ? <GraduationCap className="h-6 w-6" /> : <UserRound className="h-6 w-6" />}
                                                    </div>
                                                    <div>
                                                        <h2 className="font-heading text-xl font-bold text-[#172033]">{t.profileTitle}</h2>
                                                        <p className="mt-1 text-sm leading-6 text-[#667085]">{t.profileText}</p>
                                                    </div>
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <Field label={t.fullName}>
                                                        <input className={inputClass} value={profile.full_name} onChange={(event) => setProfileValue('full_name', event.target.value)} autoComplete="name" />
                                                    </Field>
                                                    <Field label={t.school}>
                                                        <select className={inputClass} value={profile.school_id} onChange={(event) => setSchoolSelection(event.target.value)}>
                                                            <option value="">{t.chooseSchool}</option>
                                                            {schools.map((school) => (
                                                                <option key={school.id} value={String(school.id)}>
                                                                    {school.name}
                                                                </option>
                                                            ))}
                                                            <option value="__other__">{t.otherSchool}</option>
                                                        </select>
                                                        {(profile.school_id === '__other__' || schools.length === 0) && (
                                                            <input
                                                                className={`${inputClass} mt-3`}
                                                                value={profile.school_name}
                                                                placeholder={t.writeSchool}
                                                                onChange={(event) => setProfileValue('school_name', event.target.value)}
                                                            />
                                                        )}
                                                    </Field>
                                                    {role === 'student' ? (
                                                        <>
                                                            <Field label={t.classroom}>
                                                                {selectedSchool && classOptions.length > 0 ? (
                                                                    <select className={inputClass} value={profile.class_id} onChange={(event) => setClassSelection(event.target.value)}>
                                                                        <option value="">{t.chooseClass}</option>
                                                                        {classOptions.map((item) => (
                                                                            <option key={item.id} value={String(item.id)}>
                                                                                {item.name}
                                                                            </option>
                                                                        ))}
                                                                        <option value="__other__">{t.otherClass}</option>
                                                                    </select>
                                                                ) : null}
                                                                {(profile.class_id === '__other__' || !selectedSchool || classOptions.length === 0) && (
                                                                    <input
                                                                        className={`${inputClass} ${selectedSchool && classOptions.length > 0 ? 'mt-3' : ''}`}
                                                                        value={profile.class_name}
                                                                        placeholder={t.writeClass}
                                                                        onChange={(event) => setProfileValue('class_name', event.target.value)}
                                                                    />
                                                                )}
                                                            </Field>
                                                            <Field label={t.gender}>
                                                                <select className={inputClass} value={profile.gender} onChange={(event) => setProfileValue('gender', event.target.value)}>
                                                                    <option value="">-</option>
                                                                    <option value="male">{t.male}</option>
                                                                    <option value="female">{t.female}</option>
                                                                </select>
                                                            </Field>
                                                        </>
                                                    ) : (
                                                        <Field label={t.position}>
                                                            <input className={inputClass} value={profile.position} placeholder={t.optionalTeacher} onChange={(event) => setProfileValue('position', event.target.value)} />
                                                        </Field>
                                                    )}
                                                </div>

                                                {formError && <ErrorBox message={formError} />}

                                                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <Button type="button" variant="ghost" onClick={() => setCodeConfirmed(false)} disabled={isRegistering}>
                                                        {t.back}
                                                    </Button>
                                                    <Button type="submit" size="lg" className="gap-2" disabled={isRegistering || !activity}>
                                                        {isRegistering ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                                                        {isRegistering ? t.registering : t.register}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {!isCreate && lookupResult && (
                                <LookupStatusCard
                                    result={lookupResult}
                                    t={t}
                                    isPost={isPost}
                                    isStartingPost={isStartingPost}
                                    onContinue={() => {
                                        if (lookupResult.redirect) {
                                            saveRecent(normalizedSuffix, isPost ? 'post_test' : 'pre_test');
                                            window.location.href = lookupResult.redirect;
                                        }
                                    }}
                                    onStartPost={startPostTest}
                                />
                            )}

                            {!isCreate && formError && <ErrorBox message={formError} />}
                        </div>

                        <aside className="space-y-6">
                            <RecentCodesCard
                                title={t.recent}
                                emptyText={t.noRecent}
                                clearText={t.clearRecent}
                                useText={t.useCode}
                                recentCodes={recentCodes}
                                onUse={(item) => setSuffixFromInput(item.suffix)}
                                onClear={clearRecent}
                            />

                            <Card className="overflow-hidden !bg-gradient-to-br from-[#EEF7FF] via-white to-[#F1F3FF]">
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#5B5FEF] shadow-sm">
                                        {isPost ? <ShieldCheck className="h-6 w-6" /> : <BookOpenCheck className="h-6 w-6" />}
                                    </div>
                                    <h3 className="font-heading text-xl font-bold text-[#172033]">
                                        {isPost ? t.posttest : t.createPretest}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-[#667085]">
                                        {isPost ? t.descriptionLookup : t.descriptionCreate}
                                    </p>
                                    {mode === 'pre_test' && (
                                        <Button asChild variant="outline" className="mt-5 w-full">
                                            <Link href={route('participant.identify', { mode: 'post_test', role, lang: language })}>
                                                {t.posttest}
                                            </Link>
                                        </Button>
                                    )}
                                    {mode === 'post_test' && (
                                        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                                            <p className="font-heading font-bold text-amber-900">{t.noCodeTitle}</p>
                                            <p className="mt-2 text-sm leading-6 text-amber-800">{t.noCodeText}</p>
                                            <Button asChild variant="outline" className="mt-4 w-full gap-2 !border-amber-200 !text-amber-900 hover:!bg-white">
                                                <Link href={route('participant.identify', { mode: 'pre_test', role, lang: language })}>
                                                    {t.startPretest}
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </motion.div>
            </div>
        </ParticipantLayout>
    );

    function setSchoolSelection(value: string) {
        if (value === '__other__') {
            setProfile((current) => ({ ...current, school_id: value, school_name: '', class_id: '', class_name: '' }));
            setFormError(null);
            return;
        }

        const school = schools.find((item) => String(item.id) === value);
        setProfile((current) => ({
            ...current,
            school_id: value,
            school_name: school?.name || '',
            class_id: '',
            class_name: '',
        }));
        setFormError(null);
    }

    function setClassSelection(value: string) {
        if (value === '__other__') {
            setProfile((current) => ({ ...current, class_id: value, class_name: '' }));
            setFormError(null);
            return;
        }

        const classroom = classOptions.find((item) => String(item.id) === value);
        setProfile((current) => ({ ...current, class_id: value, class_name: classroom?.name || '' }));
        setFormError(null);
    }

    function setProfileValue(key: keyof typeof emptyProfile, value: string) {
        setProfile((current) => ({ ...current, [key]: value }));
        setFormError(null);
    }
}

function IntentCard({ active, icon, title, description, onClick }: { active: boolean; icon: ReactNode; title: string; description: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group rounded-3xl border p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5FEF] ${
                active
                    ? 'border-[#5B5FEF] bg-white shadow-[0_18px_45px_-35px_rgba(91,95,239,0.8)] ring-4 ring-[#F1F3FF]'
                    : 'border-[#E8ECF3] bg-white/80 hover:-translate-y-0.5 hover:border-[#D9DDFF] hover:bg-white'
            }`}
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-[#5B5FEF] text-white' : 'bg-[#F1F3FF] text-[#5B5FEF]'}`}>{icon}</span>
                {active && <CheckCircle2 className="h-5 w-5 text-[#5B5FEF]" />}
            </div>
            <h3 className="font-heading text-lg font-bold text-[#172033]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#667085]">{description}</p>
        </button>
    );
}

function StatusPill({ availability, text }: { availability: Availability; text: string }) {
    if (!text) {
        return null;
    }

    const className: Record<Availability, string> = {
        idle: 'border-slate-200 bg-slate-50 text-slate-600',
        checking: 'border-sky-200 bg-sky-50 text-sky-700',
        available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        taken: 'border-rose-200 bg-rose-50 text-rose-700',
        invalid: 'border-amber-200 bg-amber-50 text-amber-700',
    };

    return (
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${className[availability]}`}>
            {availability === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : availability === 'available' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {text}
        </div>
    );
}

function LookupStatusCard({ result, t, isPost, isStartingPost, onContinue, onStartPost }: { result: LookupResult; t: typeof copy.id; isPost: boolean; isStartingPost: boolean; onContinue: () => void; onStartPost: () => void }) {
    const isPositive = ['POSTTEST_AVAILABLE', 'PRETEST_DRAFT', 'POSTTEST_INCOMPLETE', 'PRETEST_COMPLETED'].includes(result.status);
    const canContinue = Boolean(result.redirect);
    const canStartPost = isPost && result.status === 'POSTTEST_AVAILABLE';

    return (
        <Card className={isPositive ? '!border-emerald-200 !bg-emerald-50/70' : '!border-amber-200 !bg-amber-50/70'}>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isPositive ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-heading text-xl font-bold text-[#172033]">{statusTitle(result.status, t)}</h2>
                        <p className="mt-2 leading-7 text-[#667085]">{statusMessage(result.status, t, result.message)}</p>
                    </div>
                </div>

                {result.participant && (
                    <div className="mt-5 grid gap-3 rounded-2xl border border-white/80 bg-white/80 p-4 text-sm sm:grid-cols-2">
                        <Info label={t.codeShort} value={result.participant.code || '-'} mono />
                        <Info label={t.name} value={result.participant.name || '-'} />
                        <Info label={t.school} value={result.participant.school || '-'} />
                        <Info label={t.classroom} value={result.participant.classroom || '-'} />
                    </div>
                )}

                {result.progress && (
                    <div className="mt-5 rounded-2xl border border-white/80 bg-white/80 p-4">
                        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#667085]">
                            <span>{result.progress.answered} / {result.progress.total} {t.answered}</span>
                            <span>{result.progress.percentage}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <motion.div className="h-full rounded-full bg-[#5B5FEF]" animate={{ width: `${result.progress.percentage}%` }} />
                        </div>
                    </div>
                )}

                {(canContinue || canStartPost) && (
                    <div className="mt-6 flex justify-end">
                        <Button type="button" className="gap-2" onClick={canStartPost ? onStartPost : onContinue} disabled={isStartingPost}>
                            {isStartingPost ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                            {canStartPost ? t.startPost : t.continueFill}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function RecentCodesCard({ title, emptyText, clearText, useText, recentCodes, onUse, onClear }: { title: string; emptyText: string; clearText: string; useText: string; recentCodes: RecentCode[]; onUse: (item: RecentCode) => void; onClear: () => void }) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                            <History className="h-5 w-5" />
                        </div>
                        <h3 className="font-heading text-lg font-bold text-[#172033]">{title}</h3>
                    </div>
                    {recentCodes.length > 0 && (
                        <button type="button" onClick={onClear} className="text-xs font-bold text-[#667085] transition hover:text-rose-600">
                            {clearText}
                        </button>
                    )}
                </div>

                {recentCodes.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[#DCE2EF] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#667085]">{emptyText}</p>
                ) : (
                    <div className="space-y-3">
                        {recentCodes.map((item) => (
                            <div key={item.code} className="flex items-center justify-between gap-3 rounded-2xl border border-[#E8ECF3] bg-white p-3">
                                <div>
                                    <p className="font-mono text-sm font-bold text-[#172033]">{item.code}</p>
                                    <p className="mt-1 text-xs font-semibold text-[#667085]">{item.test_type === 'pre_test' ? 'Pre-Test' : 'Post-Test'}</p>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => onUse(item)}>
                                    {useText}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#667085]">{label}</span>
            {children}
        </label>
    );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#98A2B3]">{label}</p>
            <p className={`mt-1 font-semibold text-[#172033] ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    );
}

function ErrorBox({ message }: { message: string }) {
    return (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-700">
            <div className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{message}</span>
            </div>
        </div>
    );
}

function normalizeSuffix(value: string): string {
    return value.toUpperCase().replace(/^LDKD-/, '').replace(/[^A-Z0-9]/g, '').slice(0, 5);
}

function isValidSuffix(value: string): boolean {
    return /^[A-Z0-9]{4,5}$/.test(value);
}

function readError(error: unknown, fallback: string, language: Language): string {
    if (!axios.isAxiosError(error)) {
        return fallback;
    }

    const errors = error.response?.data?.errors;
    const first = errors ? Object.values(errors)[0] : null;

    if (Array.isArray(first) && typeof first[0] === 'string') {
        return translateServerMessage(first[0], language);
    }

    return translateServerMessage(error.response?.data?.message || fallback, language);
}

function statusTitle(status: string, t: typeof copy.id): string {
    const isEnglish = t.back === 'Back';
    const map: Record<string, string> = isEnglish
        ? {
              CODE_NOT_FOUND: 'Code not found',
              PRETEST_NOT_FOUND: 'Pre-Test not found',
              PRETEST_INCOMPLETE: 'Pre-Test is not complete',
              PRETEST_DRAFT: t.resumePretest,
              PRETEST_COMPLETED: t.pretestCompleted,
              POSTTEST_AVAILABLE: t.startPost,
              POSTTEST_INCOMPLETE: t.continueFill,
              POSTTEST_COMPLETED: 'Post-Test is already complete',
          }
        : {
              CODE_NOT_FOUND: 'Kode tidak ditemukan',
              PRETEST_NOT_FOUND: 'Pre-Test belum ditemukan',
              PRETEST_INCOMPLETE: 'Pre-Test belum selesai',
              PRETEST_DRAFT: t.resumePretest,
              PRETEST_COMPLETED: t.pretestCompleted,
              POSTTEST_AVAILABLE: t.startPost,
              POSTTEST_INCOMPLETE: t.continueFill,
              POSTTEST_COMPLETED: 'Post-Test sudah selesai',
          };

    return map[status] || (isEnglish ? 'Code status' : 'Status kode');
}

function statusMessage(status: string, t: typeof copy.id, fallback: string): string {
    const isEnglish = t.back === 'Back';
    const map: Record<string, string> = isEnglish
        ? {
              CODE_NOT_FOUND: 'Participant code was not found. Make sure the code is correct, or start from Pre-Test if you do not have a code yet.',
              PRETEST_NOT_FOUND: 'No Pre-Test draft was found for this code.',
              PRETEST_INCOMPLETE: 'Your Pre-Test is not complete yet. Finish all questions before continuing to Post-Test.',
              PRETEST_DRAFT: 'Your Pre-Test is not complete yet. Your last saved answers can be continued.',
              PRETEST_COMPLETED: 'Pre-Test with this code is complete. Use the same code for Post-Test.',
              POSTTEST_AVAILABLE: 'Pre-Test is complete. You can start the Post-Test with the same code.',
              POSTTEST_INCOMPLETE: 'Your Post-Test is not complete yet. Previous answers have been saved.',
              POSTTEST_COMPLETED: 'Post-Test with this code is already complete.',
          }
        : {
              CODE_NOT_FOUND: 'Kode peserta tidak ditemukan. Pastikan kode benar, atau mulai dari Pre-Test jika belum punya kode.',
              PRETEST_NOT_FOUND: 'Draft Pre-Test untuk kode ini belum ditemukan.',
              PRETEST_INCOMPLETE: 'Pre-Test Anda belum selesai. Selesaikan seluruh pertanyaan sebelum melanjutkan Post-Test.',
              PRETEST_DRAFT: 'Pre-Test Anda belum selesai. Jawaban terakhir telah tersimpan dan dapat dilanjutkan.',
              PRETEST_COMPLETED: 'Pre-Test dengan kode ini sudah selesai. Gunakan kode yang sama saat Post-Test.',
              POSTTEST_AVAILABLE: 'Pre-Test selesai. Anda dapat memulai Post-Test dengan kode yang sama.',
              POSTTEST_INCOMPLETE: 'Post-Test Anda belum selesai. Jawaban sebelumnya sudah tersimpan.',
              POSTTEST_COMPLETED: 'Post-Test dengan kode ini sudah selesai.',
          };

    return map[status] || fallback;
}

function translateServerMessage(message: string, language: Language): string {
    if (language === 'id') {
        return message;
    }

    const map: Record<string, string> = {
        'Kode harus terdiri dari 4-5 huruf atau angka.': 'Code must be 4-5 letters or numbers.',
        'Kode sudah digunakan. Pilih kode lain.': 'Code is already used. Choose another code.',
        'Kode sudah digunakan, silakan buat kode lain.': 'Code is already used. Please create another code.',
        'Post-Test belum dapat dimulai.': 'Post-Test cannot be started yet.',
        'Kode peserta tidak ditemukan. Untuk mengisi Post-Test, gunakan kode yang sama dengan Pre-Test.': 'Participant code was not found. To take the Post-Test, use the same code from the Pre-Test.',
        'Data Pre-Test untuk kode ini belum ditemukan. Anda harus menyelesaikan Pre-Test terlebih dahulu.': 'Pre-Test data for this code was not found. You must complete the Pre-Test first.',
        'Pre-Test Anda belum selesai. Selesaikan seluruh pertanyaan sebelum melanjutkan Post-Test.': 'Your Pre-Test is not complete yet. Finish all questions before continuing to Post-Test.',
        'Post-Test dengan kode ini sudah selesai.': 'Post-Test with this code is already complete.',
        'The selected activity id is invalid.': 'The selected activity is invalid.',
    };

    return map[message] || message;
}

const inputClass = 'h-12 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm font-semibold text-[#172033] shadow-sm outline-none transition focus:border-[#5B5FEF] focus:ring-2 focus:ring-[#5B5FEF]/20';
