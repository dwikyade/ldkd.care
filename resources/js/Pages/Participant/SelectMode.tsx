import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, HelpCircle, History } from 'lucide-react';
import { useMemo, useState } from 'react';
import ParticipantStepper from '@/Components/ldkd/ParticipantStepper';
import BrandMark from '@/Components/ldkd/BrandMark';

type Language = 'id' | 'en';
type TestMode = 'pre_test' | 'post_test';

const copy = {
    id: {
        back: 'Kembali',
        title: 'Pilih Mode Pengisian',
        description: 'Pilih tahapan kuesioner yang akan Anda isi saat ini.',
        preTitle: 'Pre-Test',
        preText: 'Diisi sebelum kegiatan sosialisasi atau pelatihan dimulai untuk mengukur pemahaman awal.',
        preBadge: 'Belum punya kode? Mulai di sini',
        postTitle: 'Post-Test',
        postText: 'Diisi setelah kegiatan selesai untuk melihat perubahan pemahaman dan dampak edukasi.',
        postBadge: 'Sudah punya kode Pre-Test',
        continue: 'Lanjut Pilih Peran',
        helper: 'Pilih salah satu mode untuk melanjutkan.',
        guideTitle: 'Bingung mulai dari mana?',
        guideText: 'Jika Anda belum pernah mengisi dan belum punya kode peserta, pilih Pre-Test. Setelah Pre-Test selesai, simpan kode peserta yang muncul. Kode yang sama dipakai lagi untuk Post-Test setelah kegiatan edukasi selesai.',
    },
    en: {
        back: 'Back',
        title: 'Choose Test Mode',
        description: 'Select the questionnaire stage you want to complete now.',
        preTitle: 'Pre-Test',
        preText: 'Completed before the education session to measure initial understanding.',
        preBadge: 'No code yet? Start here',
        postTitle: 'Post-Test',
        postText: 'Completed after the session to measure learning changes and education impact.',
        postBadge: 'Already have a Pre-Test code',
        continue: 'Continue to Role',
        helper: 'Choose one mode to continue.',
        guideTitle: 'Not sure where to start?',
        guideText: 'If you have never filled the questionnaire and do not have a participant code, choose Pre-Test. After completing the Pre-Test, save the participant code shown. Use the same code again for the Post-Test after the education activity.',
    },
};

export default function SelectMode() {
    const { url } = usePage();
    const query = new URLSearchParams(url.split('?')[1] || '');
    const language = (query.get('lang') === 'en' ? 'en' : 'id') as Language;
    const activityId = query.get('activity_id');
    const activityQuery = activityId ? { activity_id: activityId } : {};
    const [selectedMode, setSelectedMode] = useState<TestMode | null>(null);
    const reduceMotion = useReducedMotion();
    const t = copy[language];

    const options = useMemo(
        () => [
            {
                value: 'pre_test' as TestMode,
                title: t.preTitle,
                text: t.preText,
                badge: t.preBadge,
                icon: Clock,
                tone: 'indigo',
            },
            {
                value: 'post_test' as TestMode,
                title: t.postTitle,
                text: t.postText,
                badge: t.postBadge,
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

        router.visit(route('participant.select-role', { mode: selectedMode, lang: language, ...activityQuery }));
    };

    return (
        <ParticipantLayout>
            <Head title={t.title} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col pt-4">
                <ParticipantStepper current={0} />
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
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#D9DDFF] bg-[#F1F3FF] px-3 py-1 text-sm font-bold text-[#5B5FEF]">
                            <BrandMark className="h-6 w-6 rounded-lg" />
                            LDKD Care
                        </p>
                        <h1 className="font-heading text-3xl font-bold tracking-normal text-[#172033] sm:text-4xl">{t.title}</h1>
                        <p className="mx-auto max-w-2xl leading-7 text-[#667085]">{t.description}</p>
                    </div>

                    <div className="mb-6 rounded-3xl border border-[#D9DDFF] bg-white/90 p-5 shadow-[0_18px_45px_-35px_rgba(91,95,239,0.45)]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                <HelpCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-heading text-lg font-bold text-[#172033]">{t.guideTitle}</h2>
                                <p className="mt-2 text-sm leading-7 text-[#667085]">{t.guideText}</p>
                            </div>
                        </div>
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
                                    <Card className={`h-full !bg-white !shadow-sm border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${isSelected ? selectedClasses : '!border-[#E8ECF3]'}`}>
                                        <CardContent className="flex h-full flex-col p-7">
                                            <div className="mb-6 flex items-center justify-between">
                                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${option.tone === 'indigo' ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-100 text-cyan-700'}`}>
                                                    <Icon className="h-7 w-7" />
                                                </div>
                                                {isSelected && <CheckCircle2 className={`h-6 w-6 ${option.tone === 'indigo' ? 'text-indigo-600' : 'text-cyan-600'}`} />}
                                            </div>
                                            <h2 className="font-heading text-2xl font-bold text-slate-950">{option.title}</h2>
                                            <p className={`mt-2 w-fit rounded-full px-3 py-1 text-xs font-bold ${option.tone === 'indigo' ? 'bg-[#F1F3FF] text-[#5B5FEF]' : 'bg-[#ECFEFF] text-[#0891B2]'}`}>
                                                {option.badge}
                                            </p>
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
