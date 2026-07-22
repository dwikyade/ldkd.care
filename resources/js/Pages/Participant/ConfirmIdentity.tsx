import { Head, Link, useForm } from '@inertiajs/react';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowRight, UserCheck, RefreshCcw } from 'lucide-react';

interface Participant {
    id: number;
    full_name: string;
    participant_code: string;
    role: string;
    school: { name: string };
    classroom?: { name: string };
}

interface Props {
    participant: Participant;
    test_type: string;
}

export default function ConfirmIdentity({ participant, test_type }: Props) {
    return (
        <ParticipantLayout>
            <Head title="Konfirmasi Identitas" />
            
            <div className="flex-1 flex flex-col items-center justify-center py-8 w-full max-w-lg mx-auto text-center space-y-8">
                
                <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mx-auto">
                    <UserCheck className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Halo, {participant.full_name.split(' ')[0]}!</h1>
                    <p className="text-slate-600 dark:text-slate-300">Pastikan data di bawah ini benar sebelum memulai pengisian.</p>
                </div>

                <Card className="w-full text-left">
                    <CardContent className="p-6">
                        <dl className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="flex flex-col pt-2">
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Nama Lengkap</dt>
                                <dd className="mt-1 font-semibold text-slate-900 dark:text-white">{participant.full_name}</dd>
                            </div>
                            <div className="flex flex-col pt-4">
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Kode Peserta</dt>
                                <dd className="mt-1 font-semibold text-indigo-600 dark:text-indigo-400 font-mono">{participant.participant_code}</dd>
                            </div>
                            <div className="flex flex-col pt-4">
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Peran & Sekolah</dt>
                                <dd className="mt-1 font-semibold text-slate-900 dark:text-white">
                                    {participant.role === 'student' ? 'Siswa' : 'Guru'} di {participant.school.name}
                                </dd>
                            </div>
                            {participant.classroom && (
                                <div className="flex flex-col pt-4">
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Kelas</dt>
                                    <dd className="mt-1 font-semibold text-slate-900 dark:text-white">{participant.classroom.name}</dd>
                                </div>
                            )}
                            <div className="flex flex-col pt-4">
                                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Jenis Tes</dt>
                                <dd className="mt-1">
                                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase">
                                        {test_type === 'pre_test' ? 'Pre-Test' : 'Post-Test'}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                    <Link href={route('participant.identify', { mode: test_type, role: participant.role })} className="flex-1">
                        <Button variant="outline" className="w-full" size="lg">
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Bukan Saya
                        </Button>
                    </Link>
                    <Link href={route('participant.questionnaire')} className="flex-1">
                        <Button className="w-full group" size="lg">
                            Data Benar, Lanjutkan
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </ParticipantLayout>
    );
}
