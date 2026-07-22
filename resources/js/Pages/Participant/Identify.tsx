import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, Search, QrCode } from 'lucide-react';

interface Props {
    mode: string;
    role: string;
}

export default function Identify({ mode, role }: Props) {
    // Basic setup for activity ID, we would usually fetch this from active activity
    // But for MVP, we can assume activity_id = 1 is the active one if not passed
    const activeActivityId = 1; 

    const { data, setData, post, processing, errors } = useForm({
        participant_code: '',
        test_type: mode,
        role: role,
        activity_id: activeActivityId,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('participant.verify'));
    };

    return (
        <ParticipantLayout>
            <Head title="Identifikasi Peserta" />
            
            <div className="flex-1 flex flex-col max-w-lg mx-auto w-full pt-8">
                
                <Link href={route('participant.select-role', { mode })} className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </Link>
                
                <div className="space-y-2 mb-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                            {mode === 'pre_test' ? 'Pre-Test' : 'Post-Test'}
                        </span>
                        <span className="rounded-full bg-cyan-50 dark:bg-cyan-900/50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                            {role === 'student' ? 'Siswa' : 'Guru'}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Masukkan Kode Peserta</h1>
                    <p className="text-slate-600 dark:text-slate-300">Kode ini digunakan untuk menghubungkan hasil Pre-Test dan Post-Test Anda.</p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="space-y-2">
                                <label htmlFor="participant_code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Kode Unik
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        id="participant_code"
                                        name="participant_code"
                                        value={data.participant_code}
                                        onChange={(e) => setData('participant_code', e.target.value.toUpperCase())}
                                        placeholder="Contoh: LDKD-A7K92"
                                        className={`block w-full pl-10 pr-3 py-3 border ${errors.participant_code ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white'} rounded-xl shadow-sm focus:outline-none focus:ring-2 sm:text-lg uppercase placeholder:normal-case`}
                                        autoFocus
                                    />
                                </div>
                                {errors.participant_code && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errors.participant_code}</p>
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full" 
                                size="lg" 
                                disabled={processing || !data.participant_code}
                            >
                                {processing ? 'Memverifikasi...' : 'Lanjutkan'}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Atau gunakan kode QR yang diberikan oleh panitia</p>
                            <Button variant="outline" type="button" className="gap-2 dark:text-slate-300 dark:border-slate-600">
                                <QrCode className="w-4 h-4" />
                                Scan QR Code (Segera Hadir)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                
            </div>
        </ParticipantLayout>
    );
}
