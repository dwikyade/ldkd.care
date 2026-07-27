import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import ParticipantStepper from '@/Components/ldkd/ParticipantStepper';
import BrandMark from '@/Components/ldkd/BrandMark';

type Language = 'id' | 'en';
type Role = 'student' | 'teacher';

const copy = {
    id: {
        back: 'Kembali',
        title: 'Apakah Anda Siswa atau Guru?',
        description: 'Pilih peran Anda dalam kegiatan ini.',
        student: 'Siswa',
        studentText: 'Peserta didik yang mengikuti pre-test atau post-test kegiatan.',
        teacher: 'Guru',
        teacherText: 'Pendidik atau tenaga sekolah yang mengikuti evaluasi kegiatan.',
        continue: 'Lanjut Masukkan Kode',
        helper: 'Peran akan divalidasi dengan kode peserta Anda.',
        pre: 'Pre-Test',
        post: 'Post-Test',
    },
    en: {
        back: 'Back',
        title: 'Are You a Student or Teacher?',
        description: 'Choose your role in this activity.',
        student: 'Student',
        studentText: 'A learner joining the pre-test or post-test activity.',
        teacher: 'Teacher',
        teacherText: 'An educator or school staff member joining the evaluation.',
        continue: 'Continue to Code',
        helper: 'Your role will be validated against your participant code.',
        pre: 'Pre-Test',
        post: 'Post-Test',
    },
};

export default function SelectRole() {
    const { url } = usePage();
    const query = new URLSearchParams(url.split('?')[1] || '');
    const mode = query.get('mode') === 'post_test' ? 'post_test' : 'pre_test';
    const language = (query.get('lang') === 'en' ? 'en' : 'id') as Language;
    const activityId = query.get('activity_id');
    const activityQuery = activityId ? { activity_id: activityId } : {};
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const reduceMotion = useReducedMotion();
    const t = copy[language];

    const options = useMemo(
        () => [
            {
                value: 'student' as Role,
                title: t.student,
                text: t.studentText,
                icon: User,
                tone: 'indigo',
            },
            {
                value: 'teacher' as Role,
                title: t.teacher,
                text: t.teacherText,
                icon: GraduationCap,
                tone: 'cyan',
            },
        ],
        [t],
    );

    const continueToIdentify = () => {
        if (!selectedRole) {
            return;
        }

        router.visit(route('participant.identify', { mode, role: selectedRole, lang: language, ...activityQuery }));
    };

    return (
        <ParticipantLayout>
            <Head title={t.title} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col pt-4">
                <ParticipantStepper current={1} />
                <Link href={route('participant.select-mode', { lang: language, ...activityQuery })} className="mb-8 inline-flex items-center text-sm text-slate-500 transition-colors hover:text-indigo-600">
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
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#D9DDFF] bg-[#F1F3FF] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#5B5FEF]">
                            <BrandMark className="h-6 w-6 rounded-lg" />
                            {mode === 'pre_test' ? t.pre : t.post}
                        </span>
                        <h1 className="font-heading text-3xl font-bold tracking-normal text-[#172033] sm:text-4xl">{t.title}</h1>
                        <p className="mx-auto max-w-2xl leading-7 text-[#667085]">{t.description}</p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {options.map((option) => {
                            const Icon = option.icon;
                            const isSelected = selectedRole === option.value;
                            const selectedClasses =
                                option.tone === 'indigo'
                                    ? 'border-indigo-500 bg-indigo-50/70 shadow-indigo-100'
                                    : 'border-cyan-500 bg-cyan-50/70 shadow-cyan-100';

                            return (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setSelectedRole(option.value)}
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
                            <Button type="button" size="lg" onClick={continueToIdentify} disabled={!selectedRole} className="gap-2">
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
