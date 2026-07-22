import { Head, Link, usePage } from '@inertiajs/react';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { ArrowLeft, User, GraduationCap } from 'lucide-react';

export default function SelectRole() {
    // Get mode from query string parameter
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const mode = searchParams.get('mode') || 'pre_test';
    
    return (
        <ParticipantLayout>
            <Head title="Pilih Peran" />
            
            <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full pt-8">
                
                <Link href={route('participant.select-mode')} className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </Link>
                
                <div className="space-y-2 mb-10 text-center">
                    <div className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">
                        {mode === 'pre_test' ? 'Pre-Test' : 'Post-Test'}
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Apakah Anda Siswa atau Guru?</h1>
                    <p className="text-slate-600 dark:text-slate-300">Pilih peran Anda dalam kegiatan ini.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Link href={route('participant.identify', { mode, role: 'student' })} className="block group">
                        <Card className="h-full border-2 border-transparent group-hover:border-indigo-400 group-hover:shadow-indigo-100 dark:group-hover:shadow-indigo-900/20 transition-all duration-300">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-indigo-100 dark:bg-slate-800 dark:group-hover:bg-indigo-900/50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    <User className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100">Siswa</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={route('participant.identify', { mode, role: 'teacher' })} className="block group">
                        <Card className="h-full border-2 border-transparent group-hover:border-indigo-400 group-hover:shadow-indigo-100 dark:group-hover:shadow-indigo-900/20 transition-all duration-300">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-indigo-100 dark:bg-slate-800 dark:group-hover:bg-indigo-900/50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100">Guru</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
                
            </div>
        </ParticipantLayout>
    );
}
