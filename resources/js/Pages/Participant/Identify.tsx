import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { AlertTriangle, ArrowLeft, CameraOff, QrCode, Search, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import ParticipantStepper from '@/Components/ldkd/ParticipantStepper';

type Language = 'id' | 'en';

interface Props {
    mode: 'pre_test' | 'post_test';
    role: 'student' | 'teacher';
    language?: Language;
    activity?: {
        id: number;
        name: string;
        theme?: string | null;
    } | null;
}

type BarcodeDetectorLike = new (options?: { formats?: string[] }) => {
    detect: (source: CanvasImageSource) => Promise<Array<{ rawValue: string }>>;
};

const copy = {
    id: {
        back: 'Kembali',
        title: 'Masukkan Kode Peserta',
        description: 'Kode ini digunakan untuk menghubungkan hasil Pre-Test dan Post-Test Anda.',
        code: 'Kode Unik',
        placeholder: 'Contoh: LDKD-A7K92',
        submit: 'Lanjutkan',
        processing: 'Memverifikasi...',
        qrHint: 'Atau pindai kode QR yang diberikan oleh panitia.',
        scan: 'Scan QR Code',
        scanning: 'Arahkan kamera ke QR peserta',
        stopScan: 'Tutup Scanner',
        unsupported: 'Browser ini belum mendukung pemindaian QR langsung. Masukkan kode peserta secara manual.',
        cameraDenied: 'Kamera tidak dapat diakses. Periksa izin kamera atau masukkan kode secara manual.',
        noActivityTitle: 'Belum Ada Kegiatan Aktif',
        noActivityText: 'Admin perlu mengaktifkan kegiatan sebelum peserta dapat mengisi kuesioner.',
        activeActivity: 'Kegiatan aktif',
        pre: 'Pre-Test',
        post: 'Post-Test',
        student: 'Siswa',
        teacher: 'Guru',
    },
    en: {
        back: 'Back',
        title: 'Enter Participant Code',
        description: 'This code links your Pre-Test and Post-Test results.',
        code: 'Unique Code',
        placeholder: 'Example: LDKD-A7K92',
        submit: 'Continue',
        processing: 'Verifying...',
        qrHint: 'Or scan the QR code provided by the organizer.',
        scan: 'Scan QR Code',
        scanning: 'Point your camera to the participant QR',
        stopScan: 'Close Scanner',
        unsupported: 'This browser does not support direct QR scanning yet. Enter your participant code manually.',
        cameraDenied: 'Camera access failed. Check camera permission or enter the code manually.',
        noActivityTitle: 'No Active Activity',
        noActivityText: 'An admin must activate an activity before participants can complete the questionnaire.',
        activeActivity: 'Active activity',
        pre: 'Pre-Test',
        post: 'Post-Test',
        student: 'Student',
        teacher: 'Teacher',
    },
};

export default function Identify({ mode, role, language = 'id', activity }: Props) {
    const reduceMotion = useReducedMotion();
    const t = copy[language];
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        participant_code: '',
        test_type: mode,
        role,
        activity_id: activity?.id ?? 0,
        language,
    });

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
                    setData('participant_code', code.toUpperCase());
                    stopScanner();
                }
            }, 700);
        } catch {
            setScanError(t.cameraDenied);
            stopScanner();
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('participant.verify'));
    };

    return (
        <ParticipantLayout>
            <Head title={t.title} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col pt-4">
                <ParticipantStepper current={2} />
                <Link href={route('participant.select-role', { mode, lang: language })} className="mb-8 inline-flex items-center text-sm text-slate-500 transition-colors hover:text-indigo-600">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.back}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <div className="mb-10 space-y-3 text-center">
                        <div className="inline-flex flex-wrap items-center justify-center gap-2">
                            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-700">
                                {mode === 'pre_test' ? t.pre : t.post}
                            </span>
                            <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-700">
                                {role === 'student' ? t.student : t.teacher}
                            </span>
                        </div>
                        <h1 className="font-heading text-3xl font-bold tracking-normal text-slate-950">{t.title}</h1>
                        <p className="leading-7 text-slate-600">{t.description}</p>
                    </div>

                    {!activity && (
                        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
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
                        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                            <p className="font-semibold text-slate-500">{t.activeActivity}</p>
                            <p className="mt-1 font-bold text-slate-950">{activity.name}</p>
                        </div>
                    )}

                    <Card className="!border-slate-200 !bg-white !shadow-sm">
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="participant_code" className="block text-sm font-medium text-slate-700">
                                        {t.code}
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <Search className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="text"
                                            id="participant_code"
                                            name="participant_code"
                                            value={data.participant_code}
                                            onChange={(e) => setData('participant_code', e.target.value.toUpperCase())}
                                            placeholder={t.placeholder}
                                            className={`block w-full rounded-xl border py-3 pl-10 pr-3 font-mono uppercase tracking-wide shadow-sm placeholder:font-sans placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 sm:text-lg ${
                                                errors.participant_code
                                                    ? 'border-rose-300 focus:ring-rose-500'
                                                    : 'border-slate-300 bg-white focus:ring-indigo-500'
                                            }`}
                                            autoFocus
                                            disabled={!activity}
                                        />
                                    </div>
                                    {errors.participant_code && (
                                        <p className="mt-2 text-sm text-rose-600">{errors.participant_code}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" size="lg" disabled={processing || !data.participant_code || !activity}>
                                    {processing ? t.processing : t.submit}
                                </Button>
                            </form>

                            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                                <p className="mb-4 text-sm text-slate-500">{t.qrHint}</p>
                                {scanError && (
                                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                                        <div className="flex gap-2">
                                            <CameraOff className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>{scanError}</span>
                                        </div>
                                    </div>
                                )}

                                {isScanning && (
                                    <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-3 dark:border-slate-700">
                                        <video ref={videoRef} className="aspect-video w-full rounded-xl object-cover" muted playsInline />
                                        <p className="mt-3 text-sm font-semibold text-white">{t.scanning}</p>
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    type="button"
                                    className="gap-2 dark:border-slate-600 dark:text-slate-300"
                                    onClick={isScanning ? stopScanner : startScanner}
                                    disabled={!activity}
                                >
                                    {isScanning ? <X className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
                                    {isScanning ? t.stopScan : t.scan}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </ParticipantLayout>
    );
}
