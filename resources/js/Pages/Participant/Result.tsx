import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { BookOpenCheck, CalendarCheck, CheckCircle2, Lightbulb, ShieldCheck } from 'lucide-react';
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
        title: 'Hasil Evaluasi',
        thanks: 'Terima Kasih',
        done: 'Anda telah menyelesaikan kuesioner',
        digital_literacy: 'Literasi Digital',
        data_security: 'Keamanan Digital',
        tip: 'Tips Edukasi',
        date: 'Tanggal Pengisian',
        back: 'Kembali ke Beranda',
        pre: 'Pre-Test',
        post: 'Post-Test',
        categories: {
            high: 'Tinggi',
            medium: 'Sedang',
            low: 'Rendah',
        },
    },
    en: {
        title: 'Evaluation Result',
        thanks: 'Thank You',
        done: 'You have completed the',
        digital_literacy: 'Digital Literacy',
        data_security: 'Digital Security',
        tip: 'Education Tip',
        date: 'Submission Date',
        back: 'Back to Home',
        pre: 'Pre-Test',
        post: 'Post-Test',
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
        ? new Date(submission.submitted_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : '-';

    return (
        <ParticipantLayout>
            <Head title={t.title} />
            <ParticipantStepper current={4} />

            <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mx-auto flex w-full max-w-5xl flex-1 flex-col py-6"
            >
                <div className="mb-10 space-y-4 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="font-heading text-3xl font-bold tracking-normal text-slate-950">
                            {t.thanks}, {submission.participant.full_name.split(' ')[0]}!
                        </h1>
                        <p className="mt-2 text-slate-600">
                            {t.done} {testLabel}.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                        <CalendarCheck className="h-4 w-4 text-indigo-600" />
                        {t.date}: {submittedAt}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <ScoreCard
                        title={t.digital_literacy}
                        percentage={Number(submission.digital_literacy_percentage)}
                        category={submission.digital_literacy_category}
                        categoryLabel={t.categories[submission.digital_literacy_category as keyof typeof t.categories] || submission.digital_literacy_category}
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
                        categoryLabel={t.categories[submission.data_security_category as keyof typeof t.categories] || submission.data_security_category}
                        tipTitle={t.tip}
                        tip={language === 'id' ? tips.data_security?.content_id : tips.data_security?.content_en || tips.data_security?.content_id}
                        icon={ShieldCheck}
                        tone="cyan"
                        reduceMotion={Boolean(reduceMotion)}
                    />
                </div>

                <div className="mt-10 flex justify-center">
                    <Link href="/">
                        <Button variant="outline" size="lg" className="rounded-xl">
                            {t.back}
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </ParticipantLayout>
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
    const clampedPercentage = Math.max(0, Math.min(100, Math.round(percentage || 0)));
    const categoryClass = getCategoryClass(category);
    const accent = tone === 'indigo' ? 'text-indigo-600 bg-indigo-100' : 'text-cyan-700 bg-cyan-100';
    const progress = tone === 'indigo' ? 'from-indigo-600 to-blue-500' : 'from-cyan-500 to-emerald-500';

    return (
        <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
            <Card className={`h-full !border-slate-200 !bg-white border-t-4 shadow-sm ${tone === 'indigo' ? 'border-t-indigo-500' : 'border-t-cyan-500'}`}>
                <CardContent className="p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className={`rounded-full border px-4 py-1.5 text-sm font-bold uppercase tracking-widest ${categoryClass}`}>
                            {categoryLabel}
                        </div>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-slate-950">{title}</h3>
                    <div className="mt-6 flex items-end gap-1">
                        <span className="font-heading text-6xl font-bold text-slate-950">{clampedPercentage}</span>
                        <span className="pb-2 text-2xl font-bold text-slate-400">%</span>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${clampedPercentage}%` }}
                            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${progress}`}
                        />
                    </div>

                    {tip && (
                        <motion.div
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: reduceMotion ? 0 : 0.2 }}
                            className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4"
                        >
                            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Lightbulb className={`h-4 w-4 ${tone === 'indigo' ? 'text-indigo-500' : 'text-cyan-500'}`} />
                                {tipTitle}
                            </div>
                            <p className="text-sm leading-6 text-slate-600">{tip}</p>
                        </motion.div>
                    )}
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
