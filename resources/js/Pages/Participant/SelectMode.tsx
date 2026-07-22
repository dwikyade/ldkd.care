import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, History } from 'lucide-react';
import { useMemo, useState } from 'react';

type Language = 'id' | 'en';
type TestMode = 'pre_test' | 'post_test';

const copy = {
    id: {
        back: 'Kembali',
        title: 'Pilih Mode Pengisian',
        description: 'Pilih tahapan kuesioner yang akan Anda isi saat ini.',
        preTitle: 'Pre-Test',
        preText: 'Diisi sebelum kegiatan sosialisasi atau pelatihan dimulai untuk mengukur pemahaman awal.',
        postTitle: 'Post-Test',
        postText: 'Diisi setelah kegiatan selesai untuk melihat perubahan pemahaman dan dampak edukasi.',
        continue: 'Lanjut Pilih Peran',
        helper: 'Pilih salah satu mode untuk melanjutkan.',
    },
    en: {
        back: 'Back',
        title: 'Choose Test Mode',
        description: 'Select the questionnaire stage you want to complete now.',
        preTitle: 'Pre-Test',
        preText: 'Completed before the education session to measure initial understanding.',
        postTitle: 'Post-Test',
        postText: 'Completed after the session to measure learning changes and education impact.',
        continue: 'Continue to Role',
        helper: 'Choose one mode to continue.',
    },
};

export default function SelectMode() {
    const { url } = usePage();
    const query = new URLSearchParams(url.split('?')[1] || '');
    const language = (query.get('lang') === 'en' ? 'en' : 'id') as Language;
    const [selectedMode, setSelectedMode] = useState<TestMode | null>(null);
    const reduceMotion = useReducedMotion();
    const t = copy[language];

    const options = useMemo(
        () => [
            {
                value: 'pre_test' as TestMode,
                title: t.preTitle,
                text: t.preText,
                icon: Clock,
                tone: 'indigo',
            },
            {
                value: 'post_test' as TestMode,
                title: t.postTitle,
                text: t.postText,
                icon: History,
                tone: 'cyan',
            },
        ],
        [t],
    );

    const continueToRole = () => {
        if (!selectedMode) {
            return;
        }

        router.visit(route('participant.select-role', { mode: selectedMode, lang: language }));
    };

    return (
        <ParticipantLayout>
            <Head title={t.title} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col pt-4">
                <Link href={route('participant.landing')} className="mb-8 inline-flex items-center text-sm text-slate-500 transition-colors hover:text-indigo-600">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.back}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mx-auto w-full"
                >
                    <div className="mb-10 space-y-3 text-center">
                        <p className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">LDKD Care</p>
                        <h1 className="font-heading text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">{t.title}</h1>
                        <p className="mx-auto max-w-2xl leading-7 text-slate-600">{t.description}</p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {options.map((option) => {
                            const Icon = option.icon;
                            const isSelected = selectedMode === option.value;
                            const selectedClasses =
                                option.tone === 'indigo'
                                    ? 'border-indigo-500 bg-indigo-50/70 shadow-indigo-100'
                                    : 'border-cyan-500 bg-cyan-50/70 shadow-cyan-100';

                            return (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setSelectedMode(option.value)}
                                    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                                    animate={isSelected && !reduceMotion ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                                    className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4"
                                >
                                    <Card className={`h-full !bg-white !shadow-sm border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${isSelected ? selectedClasses : '!border-slate-200'}`}>
                                        <CardContent className="flex h-full flex-col p-7">
                                            <div className="mb-6 flex items-center justify-between">
                                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${option.tone === 'indigo' ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-100 text-cyan-700'}`}>
                                                    <Icon className="h-7 w-7" />
                                                </div>
                                                {isSelected && <CheckCircle2 className={`h-6 w-6 ${option.tone === 'indigo' ? 'text-indigo-600' : 'text-cyan-600'}`} />}
                                            </div>
                                            <h2 className="font-heading text-2xl font-bold text-slate-950">{option.title}</h2>
                                            <p className="mt-3 flex-1 leading-7 text-slate-600">{option.text}</p>
                                        </CardContent>
                                    </Card>
                                </motion.button>
                            );
                        })}
                    </div>

                    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-medium text-slate-500">{t.helper}</p>
                            <Button type="button" size="lg" onClick={continueToRole} disabled={!selectedMode} className="gap-2">
                                {t.continue}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </ParticipantLayout>
    );
}
