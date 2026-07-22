import { Head, Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowRight, RefreshCcw, UserCheck } from 'lucide-react';

type Language = 'id' | 'en';

interface Participant {
    id: number;
    full_name: string;
    participant_code: string;
    role: string;
    school: { name: string };
    classroom?: { name: string } | null;
}

interface Props {
    participant: Participant;
    test_type: 'pre_test' | 'post_test';
    language?: Language;
}

const copy = {
    id: {
        hello: 'Halo',
        title: 'Pastikan data di bawah ini benar sebelum memulai pengisian.',
        fullName: 'Nama Lengkap',
        code: 'Kode Peserta',
        roleSchool: 'Peran & Sekolah',
        class: 'Kelas',
        testType: 'Jenis Tes',
        student: 'Siswa',
        teacher: 'Guru',
        at: 'di',
        pre: 'Pre-Test',
        post: 'Post-Test',
        wrong: 'Bukan Saya',
        correct: 'Ya, Ini Data Saya',
    },
    en: {
        hello: 'Hello',
        title: 'Make sure the data below is correct before starting.',
        fullName: 'Full Name',
        code: 'Participant Code',
        roleSchool: 'Role & School',
        class: 'Class',
        testType: 'Test Type',
        student: 'Student',
        teacher: 'Teacher',
        at: 'at',
        pre: 'Pre-Test',
        post: 'Post-Test',
        wrong: 'Not Me',
        correct: 'Yes, This Is My Data',
    },
};

export default function ConfirmIdentity({ participant, test_type, language = 'id' }: Props) {
    const reduceMotion = useReducedMotion();
    const t = copy[language];

    return (
        <ParticipantLayout>
            <Head title={language === 'id' ? 'Konfirmasi Identitas' : 'Confirm Identity'} />

            <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center py-6 text-center"
            >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
                    <UserCheck className="h-10 w-10" />
                </div>

                <div className="mt-8 space-y-2">
                    <h1 className="font-heading text-3xl font-bold tracking-normal text-slate-950">
                        {t.hello}, {participant.full_name.split(' ')[0]}!
                    </h1>
                    <p className="leading-7 text-slate-600">{t.title}</p>
                </div>

                <Card className="mt-8 w-full !border-slate-200 !bg-white !shadow-sm text-left">
                    <CardContent className="p-6">
                        <dl className="space-y-4 divide-y divide-slate-100">
                            <DataRow label={t.fullName} value={participant.full_name} />
                            <DataRow label={t.code} value={participant.participant_code} valueClassName="font-mono text-indigo-600 dark:text-indigo-400" />
                            <DataRow
                                label={t.roleSchool}
                                value={`${participant.role === 'student' ? t.student : t.teacher} ${t.at} ${participant.school.name}`}
                            />
                            {participant.classroom && <DataRow label={t.class} value={participant.classroom.name} />}
                            <div className="flex flex-col pt-4">
                                <dt className="text-sm font-medium text-slate-500">{t.testType}</dt>
                                <dd className="mt-1">
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-slate-800">
                                        {test_type === 'pre_test' ? t.pre : t.post}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row">
                    <Link href={route('participant.identify', { mode: test_type, role: participant.role, lang: language })} className="flex-1">
                        <Button variant="outline" className="w-full" size="lg">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            {t.wrong}
                        </Button>
                    </Link>
                    <Link href={route('participant.questionnaire')} className="flex-1">
                        <Button className="w-full group" size="lg">
                            {t.correct}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </ParticipantLayout>
    );
}

function DataRow({ label, value, valueClassName = '' }: { label: string; value: string; valueClassName?: string }) {
    return (
        <div className="flex flex-col pt-4 first:pt-0">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className={`mt-1 font-semibold text-slate-950 ${valueClassName}`}>{value}</dd>
        </div>
    );
}
