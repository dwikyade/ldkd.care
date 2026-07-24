import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpenCheck, Check, CheckCircle2, Copy, Home, Lightbulb, Minus, ShieldCheck } from 'lucide-react';
import ParticipantStepper from '@/Components/ldkd/ParticipantStepper';
import { useState } from 'react';

type Language = 'id' | 'en';

interface Submission {
    id: number;
    participant: {
        full_name: string;
        participant_code: string;
        role: 'student' | 'teacher';
        school?: { name: string } | null;
        classroom?: { name: string } | null;
    };
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

interface ComparisonMetric {
    pre: number;
    post: number;
    diff: number;
    pre_category: string;
    post_category: string;
}

interface Comparison {
    digital_literacy: ComparisonMetric;
    data_security: ComparisonMetric;
    average_diff: number;
    pre_submitted_at?: string | null;
    post_submitted_at?: string | null;
}

interface Props {
    submission: Submission;
    comparison?: Comparison | null;
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
        resultSummary: 'Ringkasan Hasil',
        tip: 'Tips Edukasi',
        noTipShort: 'Tidak ada rekomendasi yang ditampilkan untuk kategori ini.',
        noTipLong: 'Tips edukasi akan tersedia setelah admin mengisi rekomendasi untuk kategori ini.',
        date: 'Waktu Pengisian',
        back: 'Kembali ke Beranda',
        done: 'Selesai',
        pre: 'Pre-Test',
        post: 'Post-Test',
        participant: 'Peserta',
        code: 'Kode Peserta',
        school: 'Sekolah',
        class: 'Kelas',
        testType: 'Jenis Tes',
        saveCode: 'Simpan kode ini',
        saveCodeText: 'Gunakan kode yang sama saat mengisi Post-Test agar hasil Pre-Test dan Post-Test terhubung.',
        copied: 'Kode disalin',
        copy: 'Salin',
        startPost: 'Lanjut ke Post-Test',
        comparisonTitle: 'Perbandingan Pre-Test dan Post-Test',
        comparisonSubtitle: 'Ringkasan ini menunjukkan perubahan skor setelah kegiatan edukasi. Angka positif berarti pemahaman meningkat dibanding pengisian awal.',
        averageChange: 'Rata-rata perubahan',
        before: 'Pre-Test',
        after: 'Post-Test',
        point: 'poin',
        improved: 'Meningkat',
        decreased: 'Menurun',
        stable: 'Tetap',
        comparisonReady: 'Post-Test selesai',
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
        resultSummary: 'Result Summary',
        tip: 'Education Tip',
        noTipShort: 'No recommendation is displayed for this category.',
        noTipLong: 'Education tips will be available after the admin adds recommendations for this category.',
        date: 'Submission Time',
        back: 'Back to Home',
        done: 'Done',
        pre: 'Pre-Test',
        post: 'Post-Test',
        participant: 'Participant',
        code: 'Participant Code',
        school: 'School',
        class: 'Class',
        testType: 'Test Type',
        saveCode: 'Save this code',
        saveCodeText: 'Use the same code for the Post-Test so Pre-Test and Post-Test results stay connected.',
        copied: 'Code copied',
        copy: 'Copy',
        startPost: 'Continue to Post-Test',
        comparisonTitle: 'Pre-Test and Post-Test Comparison',
        comparisonSubtitle: 'This summary shows score changes after the education activity. A positive number means understanding improved compared with the initial assessment.',
        averageChange: 'Average change',
        before: 'Pre-Test',
        after: 'Post-Test',
        point: 'points',
        improved: 'Improved',
        decreased: 'Decreased',
        stable: 'Stable',
        comparisonReady: 'Post-Test complete',
        categories: {
            high: 'High',
            medium: 'Medium',
            low: 'Low',
        },
    },
};

export default function Result({ submission, comparison, tips }: Props) {
    const reduceMotion = useReducedMotion();
    const [isCopied, setIsCopied] = useState(false);
    const language = submission.language || 'id';
    const t = copy[language];
    const testLabel = submission.test_type === 'pre_test' ? t.pre : t.post;
    const postTestHref = route('participant.identify', {
        mode: 'post_test',
        role: submission.participant.role,
        lang: language,
    });

    const submittedAt = submission.submitted_at
        ? new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          }).format(new Date(submission.submitted_at))
        : '-';

    const copyParticipantCode = async () => {
        await navigator.clipboard?.writeText(submission.participant.participant_code);
        setIsCopied(true);
        window.setTimeout(() => setIsCopied(false), 1500);
    };

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
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">{t.resultSummary}</p>
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

                <Card className="mt-6 overflow-hidden border-[#D9DDFF] bg-gradient-to-br from-[#F1F3FF] via-white to-[#ECFEFF] shadow-sm">
                    <CardContent className="grid gap-5 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">{t.saveCode}</p>
                            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="w-fit rounded-2xl border border-white/80 bg-white px-4 py-3 font-mono text-2xl font-bold tracking-wide text-[#172033] shadow-sm">
                                    {submission.participant.participant_code}
                                </div>
                                <Button type="button" variant="outline" className="gap-2" onClick={copyParticipantCode}>
                                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {isCopied ? t.copied : t.copy}
                                </Button>
                            </div>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
                                {submission.test_type === 'pre_test' ? t.saveCodeText : `${t.code}: ${submission.participant.participant_code}`}
                            </p>
                            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                                <MiniInfo label={t.school} value={submission.participant.school?.name || '-'} />
                                <MiniInfo label={t.class} value={submission.participant.classroom?.name || '-'} />
                                <MiniInfo label={t.testType} value={testLabel} />
                            </div>
                        </div>

                        {submission.test_type === 'pre_test' && (
                            <Button asChild size="lg" className="gap-2 lg:min-w-52">
                                <Link href={postTestHref}>
                                    {t.startPost}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {comparison && (
                    <ComparisonSection
                        comparison={comparison}
                        t={t}
                        reduceMotion={Boolean(reduceMotion)}
                    />
                )}

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
                        noTipShort={t.noTipShort}
                        noTipLong={t.noTipLong}
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
                        noTipShort={t.noTipShort}
                        noTipLong={t.noTipLong}
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

function MiniInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/80 bg-white/70 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#98A2B3]">{label}</p>
            <p className="mt-1 font-semibold text-[#172033]">{value}</p>
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

function ComparisonSection({ comparison, t, reduceMotion }: { comparison: Comparison; t: typeof copy.id | typeof copy.en; reduceMotion: boolean }) {
    const averageDiff = roundScore(comparison.average_diff);
    const averageTone = diffTone(averageDiff);

    return (
        <motion.section
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            className="mt-6"
        >
            <Card className="overflow-hidden border-[#D9DDFF] bg-white shadow-[0_28px_70px_-52px_rgba(91,95,239,0.55)]">
                <CardContent className="p-0">
                    <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="bg-gradient-to-br from-[#EEF7FF] via-[#F8FAFC] to-[#F1F3FF] p-6 lg:p-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#5B5FEF] shadow-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                {t.comparisonReady}
                            </div>
                            <h2 className="mt-5 font-heading text-2xl font-bold tracking-[-0.01em] text-[#172033] sm:text-3xl">
                                {t.comparisonTitle}
                            </h2>
                            <p className="mt-3 leading-7 text-[#667085]">{t.comparisonSubtitle}</p>

                            <div className="mt-7 rounded-[24px] border border-white/80 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#667085]">{t.averageChange}</p>
                                        <div className="mt-2 flex items-end gap-1">
                                            <span className={`font-heading text-4xl font-bold ${averageTone.text}`}>
                                                {formatDiff(averageDiff)}
                                            </span>
                                            <span className="pb-1 text-sm font-bold text-[#667085]">{t.point}</span>
                                        </div>
                                    </div>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${averageTone.soft}`}>
                                        <averageTone.icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm font-semibold text-[#667085]">
                                    {averageDiff > 0 ? t.improved : averageDiff < 0 ? t.decreased : t.stable}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 p-6 lg:p-8">
                            <ComparisonMetricCard
                                title={t.digital_literacy}
                                metric={comparison.digital_literacy}
                                tone="indigo"
                                icon={BookOpenCheck}
                                t={t}
                            />
                            <ComparisonMetricCard
                                title={t.data_security}
                                metric={comparison.data_security}
                                tone="cyan"
                                icon={ShieldCheck}
                                t={t}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.section>
    );
}

function ComparisonMetricCard({
    title,
    metric,
    tone,
    icon: Icon,
    t,
}: {
    title: string;
    metric: ComparisonMetric;
    tone: 'indigo' | 'cyan';
    icon: typeof BookOpenCheck;
    t: typeof copy.id | typeof copy.en;
}) {
    const pre = clampScore(metric.pre);
    const post = clampScore(metric.post);
    const diff = roundScore(metric.diff);
    const toneClass = tone === 'indigo'
        ? {
              icon: 'bg-[#F1F3FF] text-[#5B5FEF]',
              preBar: 'bg-[#C7D2FE]',
              postBar: 'bg-[#5B5FEF]',
              ring: 'border-[#D9DDFF]',
          }
        : {
              icon: 'bg-[#ECFEFF] text-[#0891B2]',
              preBar: 'bg-[#BAE6FD]',
              postBar: 'bg-[#38BDF8]',
              ring: 'border-[#BAE6FD]',
          };
    const currentTone = diffTone(diff);

    return (
        <div className={`rounded-[24px] border bg-[#F8FAFC] p-5 ${toneClass.ring}`}>
            <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClass.icon}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-heading text-lg font-bold text-[#172033]">{title}</h3>
                        <p className="mt-1 text-xs font-semibold text-[#667085]">
                            {categoryLabel(t, metric.pre_category)} → {categoryLabel(t, metric.post_category)}
                        </p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${currentTone.badge}`}>
                    <currentTone.icon className="h-3.5 w-3.5" />
                    {formatDiff(diff)}
                </span>
            </div>

            <div className="space-y-4">
                <ComparisonBar label={t.before} value={pre} className={toneClass.preBar} />
                <ComparisonBar label={t.after} value={post} className={toneClass.postBar} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <ValueTile label={t.before} value={`${pre}%`} />
                <ValueTile label={t.after} value={`${post}%`} highlighted />
            </div>
        </div>
    );
}

function ComparisonBar({ label, value, className }: { label: string; value: number; className: string }) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#667085]">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white">
                <motion.div
                    className={`h-full rounded-full ${className}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

function ValueTile({ label, value, highlighted = false }: { label: string; value: string; highlighted?: boolean }) {
    return (
        <div className={`rounded-2xl border p-3 ${highlighted ? 'border-[#D9DDFF] bg-white' : 'border-white/80 bg-white/70'}`}>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#98A2B3]">{label}</p>
            <p className="mt-1 font-heading text-2xl font-bold text-[#172033]">{value}</p>
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
    noTipShort,
    noTipLong,
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
    noTipShort: string;
    noTipLong: string;
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
                                {tip || noTipLong}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#172033]">
                            <Lightbulb className={`h-4 w-4 ${tone === 'indigo' ? 'text-[#5B5FEF]' : 'text-[#0891B2]'}`} />
                            {tipTitle}
                        </div>
                        <p className="text-sm leading-6 text-[#667085]">
                            {tip || noTipShort}
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

function roundScore(value: number) {
    return Math.round((Number(value) || 0) * 100) / 100;
}

function formatDiff(value: number) {
    const rounded = roundScore(value);

    return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

function diffTone(value: number) {
    if (value > 0) {
        return {
            text: 'text-emerald-600',
            soft: 'bg-emerald-50 text-emerald-700',
            badge: 'bg-emerald-50 text-emerald-700',
            icon: ArrowUpRight,
        };
    }

    if (value < 0) {
        return {
            text: 'text-rose-600',
            soft: 'bg-rose-50 text-rose-700',
            badge: 'bg-rose-50 text-rose-700',
            icon: ArrowDownRight,
        };
    }

    return {
        text: 'text-[#667085]',
        soft: 'bg-[#F3F7FC] text-[#667085]',
        badge: 'bg-[#F3F7FC] text-[#667085]',
        icon: Minus,
    };
}
