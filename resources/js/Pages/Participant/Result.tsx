import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { BookOpenCheck, CalendarCheck, CheckCircle2, Home, Lightbulb, ShieldCheck } from 'lucide-react';
import ParticipantStepper from '@/Components/ldkd/ParticipantStepper';

type Language = 'id' | 'en';

interface Submission {
    id: number;
    participant: { full_name: string; role: string };
    test_type: 'pre_test' | 'post_test';
    language: Language;
    digital_literacy_percentage: number | string;
    digital_literacy_category: string;
    data_security_percentage: number | string;
    data_security_category: string;
    submitted_at?: string | null;
}

interface Tip {
    content_id: string;
    content_en?: string | null;
}

interface Props {
    submission: Submission;
    tips: {
        digital_literacy: Tip | null;
        data_security: Tip | null;
    };
}

const copy = {
    id: {
        title: 'Pengisian Berhasil',
        subtitle: 'Hasil berikut hanya menampilkan ringkasan skor dan tips edukasi untuk Anda.',
        digital_literacy: 'Literasi Digital',
        data_security: 'Keamanan Digital',
        tip: 'Tips Edukasi',
        date: 'Waktu Pengisian',
        back: 'Kembali ke Beranda',
        done: 'Selesai',
        pre: 'Pre-Test',
        post: 'Post-Test',
        participant: 'Peserta',
        testType: 'Jenis Tes',
        categories: {
            high: 'Tinggi',
            medium: 'Sedang',
            low: 'Rendah',
        },
    },
    en: {
        title: 'Submission Successful',
        subtitle: 'This page only shows your score summary and education tips.',
        digital_literacy: 'Digital Literacy',
        data_security: 'Digital Security',
        tip: 'Education Tip',
        date: 'Submission Time',
        back: 'Back to Home',
        done: 'Done',
        pre: 'Pre-Test',
        post: 'Post-Test',
        participant: 'Participant',
        testType: 'Test Type',
        categories: {
            high: 'High',
            medium: 'Medium',
            low: 'Low',
        },
    },
};

export default function Result({ submission, tips }: Props) {
    const reduceMotion = useReducedMotion();
    const language = submission.language || 'id';
    const t = copy[language];
    const testLabel = submission.test_type === 'pre_test' ? t.pre : t.post;

    const submittedAt = submission.submitted_at
        ? new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          }).format(new Date(submission.submitted_at))
        : '-';

    return (
        <ParticipantLayout>
            <Head title={t.title} />
            <ParticipantStepper current={4} />

            <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="mx-auto flex w-full max-w-5xl flex-1 flex-col py-6"
            >
                <Card className="overflow-hidden border-white/80 bg-white/90 shadow-[0_28px_70px_-48px_rgba(56,104,168,0.7)]">
                    <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#10B981]">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <h1 className="mt-6 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033] sm:text-4xl">
                                    {t.title}
                                </h1>
                                <p className="mt-3 max-w-xl leading-7 text-[#667085]">{t.subtitle}</p>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                <InfoTile label={t.participant} value={submission.participant.full_name} />
                                <InfoTile label={t.testType} value={testLabel} />
                                <InfoTile label={t.date} value={submittedAt} />
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-[#E8ECF3] bg-[#F8FAFC] p-5">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Ringkasan Hasil</p>
                            <div className="mt-5 grid gap-4">
                                <CompactScore
                                    title={t.digital_literacy}
                                    percentage={Number(submission.digital_literacy_percentage)}
                                    category={categoryLabel(t, submission.digital_literacy_category)}
                                    tone="indigo"
                                />
                                <CompactScore
                                    title={t.data_security}
                                    percentage={Number(submission.data_security_percentage)}
                                    category={categoryLabel(t, submission.data_security_category)}
                                    tone="cyan"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <ScoreCard
                        title={t.digital_literacy}
                        percentage={Number(submission.digital_literacy_percentage)}
                        category={submission.digital_literacy_category}
                        categoryLabel={categoryLabel(t, submission.digital_literacy_category)}
                        tipTitle={t.tip}
                        tip={language === 'id' ? tips.digital_literacy?.content_id : tips.digital_literacy?.content_en || tips.digital_literacy?.content_id}
                        icon={BookOpenCheck}
                        tone="indigo"
                        reduceMotion={Boolean(reduceMotion)}
                    />

                    <ScoreCard
                        title={t.data_security}
                        percentage={Number(submission.data_security_percentage)}
                        category={submission.data_security_category}
                        categoryLabel={categoryLabel(t, submission.data_security_category)}
                        tipTitle={t.tip}
                        tip={language === 'id' ? tips.data_security?.content_id : tips.data_security?.content_en || tips.data_security?.content_id}
                        icon={ShieldCheck}
                        tone="cyan"
                        reduceMotion={Boolean(reduceMotion)}
                    />
                </div>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            {t.back}
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/">{t.done}</Link>
                    </Button>
                </div>
            </motion.div>
        </ParticipantLayout>
    );
}

function InfoTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#667085]">{label}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#172033]">{value}</p>
        </div>
    );
}

function CompactScore({ title, percentage, category, tone }: { title: string; percentage: number; category: string; tone: 'indigo' | 'cyan' }) {
    const clamped = clampScore(percentage);

    return (
        <div className="rounded-2xl border border-[#E8ECF3] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-bold text-[#172033]">{title}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone === 'indigo' ? 'bg-[#F1F3FF] text-[#5B5FEF]' : 'bg-[#ECFEFF] text-[#0891B2]'}`}>
                    {category}
                </span>
            </div>
            <div className="flex items-end gap-1">
                <span className="font-heading text-3xl font-bold text-[#172033]">{clamped}</span>
                <span className="pb-1 text-sm font-bold text-[#667085]">%</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                <div className={`h-full rounded-full ${tone === 'indigo' ? 'bg-[#5B5FEF]' : 'bg-[#38BDF8]'}`} style={{ width: `${clamped}%` }} />
            </div>
        </div>
    );
}

function ScoreCard({
    title,
    percentage,
    category,
    categoryLabel,
    tipTitle,
    tip,
    icon: Icon,
    tone,
    reduceMotion,
}: {
    title: string;
    percentage: number;
    category: string;
    categoryLabel: string;
    tipTitle: string;
    tip?: string | null;
    icon: typeof BookOpenCheck;
    tone: 'indigo' | 'cyan';
    reduceMotion: boolean;
}) {
    const clampedPercentage = clampScore(percentage);
    const accent = tone === 'indigo' ? '#5B5FEF' : '#38BDF8';
    const soft = tone === 'indigo' ? 'bg-[#F1F3FF] text-[#5B5FEF]' : 'bg-[#ECFEFF] text-[#0891B2]';

    return (
        <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
            <Card className={`h-full border-[#E8ECF3] bg-white shadow-sm ${tone === 'indigo' ? 'border-t-4 border-t-[#5B5FEF]' : 'border-t-4 border-t-[#38BDF8]'}`}>
                <CardContent className="p-6 sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${soft}`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className={`rounded-full border px-4 py-1.5 text-sm font-bold uppercase tracking-widest ${getCategoryClass(category)}`}>
                            {categoryLabel}
                        </div>
                    </div>

                    <div className="grid items-center gap-6 sm:grid-cols-[150px_1fr]">
                        <div
                            className="mx-auto flex h-36 w-36 items-center justify-center rounded-full"
                            style={{ background: `conic-gradient(${accent} ${clampedPercentage * 3.6}deg, #EEF2F7 0deg)` }}
                        >
                            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                                <span className="font-heading text-4xl font-bold text-[#172033]">{clampedPercentage}</span>
                                <span className="text-xs font-bold text-[#667085]">%</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-heading text-2xl font-bold text-[#172033]">{title}</h3>
                            <p className="mt-3 leading-7 text-[#667085]">
                                {tip || 'Tips edukasi akan tersedia setelah admin mengisi rekomendasi untuk kategori ini.'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#172033]">
                            <Lightbulb className={`h-4 w-4 ${tone === 'indigo' ? 'text-[#5B5FEF]' : 'text-[#0891B2]'}`} />
                            {tipTitle}
                        </div>
                        <p className="text-sm leading-6 text-[#667085]">
                            {tip || 'Tidak ada rekomendasi yang ditampilkan untuk kategori ini.'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function getCategoryClass(category: string) {
    if (category === 'high') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (category === 'medium') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
}

function categoryLabel(t: typeof copy.id | typeof copy.en, category: string) {
    return t.categories[category as keyof typeof t.categories] || category;
}

function clampScore(value: number) {
    return Math.max(0, Math.min(100, Math.round(value || 0)));
}
