import { Head, Link } from '@inertiajs/react';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, Clock, History } from 'lucide-react';

export default function SelectMode() {
    return (
        <ParticipantLayout>
            <Head title="Pilih Mode Pengisian" />
            
            <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full pt-8">
                
                <Link href={route('participant.landing')} className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </Link>
                
                <div className="space-y-2 mb-10 text-center">
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Pilih Mode Pengisian</h1>
                    <p className="text-slate-600 dark:text-slate-300">Pilih tahapan kuesioner yang akan Anda isi saat ini.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Link href={route('participant.select-role', { mode: 'pre_test' })} className="block group">
                        <Card className="h-full border-2 border-transparent group-hover:border-indigo-400 group-hover:shadow-indigo-100 dark:group-hover:shadow-indigo-900/20 transition-all duration-300">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-indigo-100 dark:bg-slate-800 dark:group-hover:bg-indigo-900/50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100">Pre-Test</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                        Diisi <strong className="text-indigo-600 dark:text-indigo-400 font-medium">sebelum</strong> kegiatan sosialisasi atau pelatihan dimulai.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={route('participant.select-role', { mode: 'post_test' })} className="block group">
                        <Card className="h-full border-2 border-transparent group-hover:border-cyan-400 group-hover:shadow-cyan-100 dark:group-hover:shadow-cyan-900/20 transition-all duration-300">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-cyan-100 dark:bg-slate-800 dark:group-hover:bg-cyan-900/50 flex items-center justify-center text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    <History className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100">Post-Test</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                        Diisi <strong className="text-cyan-600 dark:text-cyan-400 font-medium">setelah</strong> kegiatan sosialisasi atau pelatihan selesai.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
                
            </div>
        </ParticipantLayout>
    );
}
