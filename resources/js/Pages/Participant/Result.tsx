import { Head, Link } from '@inertiajs/react';
import ParticipantLayout from '@/Layouts/ParticipantLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { CheckCircle2, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';

interface Submission {
    id: number;
    participant: { full_name: string; role: string };
    test_type: string;
    digital_literacy_percentage: number;
    digital_literacy_category: string;
    data_security_percentage: number;
    data_security_category: string;
}

interface Tip {
    content_id: string;
}

interface Props {
    submission: Submission;
    tips: {
        digital_literacy: Tip | null;
        data_security: Tip | null;
    };
}

export default function Result({ submission, tips }: Props) {
    
    const getCategoryColor = (category: string) => {
        if (category === 'high') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (category === 'medium') return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-rose-600 bg-rose-50 border-rose-200';
    };

    const getCategoryLabel = (category: string) => {
        if (category === 'high') return 'Tinggi';
        if (category === 'medium') return 'Sedang';
        return 'Rendah';
    };

    return (
        <ParticipantLayout>
            <Head title="Hasil Evaluasi" />
            
            <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto py-8">
                
                <div className="text-center mb-10 space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Terima Kasih, {submission.participant.full_name.split(' ')[0]}!</h1>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">Anda telah menyelesaikan kuesioner {submission.test_type === 'pre_test' ? 'Pre-Test' : 'Post-Test'}.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Digital Literacy Result */}
                    <Card className="border-t-4 border-t-indigo-500 shadow-md">
                        <CardContent className="p-8">
                            <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider text-center">Literasi Digital</h3>
                            
                            <div className="flex flex-col items-center justify-center mb-6">
                                <div className="text-6xl font-bold font-heading text-slate-900 dark:text-white">
                                    {Math.round(submission.digital_literacy_percentage)}<span className="text-3xl text-slate-400 dark:text-slate-500">%</span>
                                </div>
                                <div className={`mt-4 px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-widest ${getCategoryColor(submission.digital_literacy_category)}`}>
                                    {getCategoryLabel(submission.digital_literacy_category)}
                                </div>
                            </div>

                            {tips.digital_literacy && (
                                <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex gap-3 border border-slate-100 dark:border-slate-700">
                                    <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0" />
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {tips.digital_literacy.content_id}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Data Security Result */}
                    <Card className="border-t-4 border-t-cyan-500 shadow-md">
                        <CardContent className="p-8">
                            <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider text-center">Keamanan Data</h3>
                            
                            <div className="flex flex-col items-center justify-center mb-6">
                                <div className="text-6xl font-bold font-heading text-slate-900 dark:text-white">
                                    {Math.round(submission.data_security_percentage)}<span className="text-3xl text-slate-400 dark:text-slate-500">%</span>
                                </div>
                                <div className={`mt-4 px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-widest ${getCategoryColor(submission.data_security_category)}`}>
                                    {getCategoryLabel(submission.data_security_category)}
                                </div>
                            </div>

                            {tips.data_security && (
                                <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex gap-3 border border-slate-100 dark:border-slate-700">
                                    <Lightbulb className="w-5 h-5 text-cyan-500 shrink-0" />
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {tips.data_security.content_id}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                <div className="flex justify-center mt-4">
                    <Link href="/">
                        <Button variant="outline" size="lg" className="rounded-full">
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </div>
                
            </div>
        </ParticipantLayout>
    );
}
