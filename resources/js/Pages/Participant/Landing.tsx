import { Head, Link } from '@inertiajs/react';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { ArrowRight, ShieldCheck, Laptop } from 'lucide-react';

interface Props {
    activity?: {
        id: number;
        name: string;
        theme: string | null;
        description: string | null;
    } | null;
}

export default function Landing({ activity }: Props) {
    return (
        <ParticipantLayout>
            <Head title="Selamat Datang" />
            
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center max-w-3xl mx-auto space-y-12">
                
                {/* Hero Section */}
                <div className="space-y-6">
                    <div className="inline-flex items-center rounded-full border border-indigo-200 bg-white/50 px-3 py-1 text-sm text-indigo-800 dark:bg-slate-800/50 dark:border-indigo-800 dark:text-indigo-300 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                        {activity ? activity.name : 'Evaluasi Sedang Berlangsung'}
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                        Ukur Tingkat <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">Literasi Digital</span> dan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">Keamanan Data</span>
                    </h1>
                    
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {activity?.theme 
                            ? activity.theme 
                            : 'Kuesioner ini dirancang untuk mengevaluasi pemahaman Anda mengenai penggunaan teknologi digital yang sehat dan cara melindungi data pribadi di era digital.'
                        }
                    </p>
                    
                    <p className="text-sm font-medium text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-800/50 px-4 py-2 rounded-lg inline-block border">
                        Anda tidak perlu login atau membuat akun. Cukup gunakan kode unik Anda.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-6 w-full text-left">
                    <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-indigo-500">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                                <Laptop className="w-6 h-6" />
                            </div>
                            <CardTitle>Literasi Digital</CardTitle>
                            <CardDescription className="mt-2">
                                Kemampuan memahami informasi digital, memverifikasi sumber, membedakan fakta dan opini, serta berinteraksi secara bertanggung jawab.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-cyan-500">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <CardTitle>Keamanan Data</CardTitle>
                            <CardDescription className="mt-2">
                                Pemahaman mengenai perlindungan privasi, penggunaan kata sandi, deteksi phishing, dan pengamanan informasi pribadi secara efektif.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* Call to Action */}
                <div className="pt-8">
                    <Link href={route('participant.select-mode')}>
                        <Button size="lg" className="rounded-full text-lg group px-8">
                            Mulai Pengisian
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </ParticipantLayout>
    );
}
