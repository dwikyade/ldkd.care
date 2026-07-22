import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Plus, Edit2, Trash2, Shield, Laptop } from 'lucide-react';
import { Question } from '@/types';

interface Props {
    questions: {
        data: Question[];
        links: any[];
    };
    currentModule: 'digital_literacy' | 'data_security';
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Index({ questions, currentModule, flash }: Props) {
    
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
            router.delete(route('admin.questions.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Soal" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Bank Soal Kuesioner</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola soal untuk modul Literasi Digital dan Keamanan Data.</p>
                </div>
                <Link href={route('admin.questions.create', { module: currentModule })}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Soal Baru
                    </Button>
                </Link>
            </div>

            {flash.success && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    {flash.success}
                </div>
            )}

            {/* Module Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-6 w-full max-w-md">
                <Link 
                    href={route('admin.questions.index', { module: 'digital_literacy' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        currentModule === 'digital_literacy' 
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <Laptop className="w-4 h-4" />
                    Literasi Digital
                </Link>
                <Link 
                    href={route('admin.questions.index', { module: 'data_security' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        currentModule === 'data_security' 
                        ? 'bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <Shield className="w-4 h-4" />
                    Keamanan Data
                </Link>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-16 text-center">No</th>
                                <th className="px-6 py-4 font-semibold">Pertanyaan (ID / EN)</th>
                                <th className="px-6 py-4 font-semibold text-center">Opsi Jawaban</th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            {questions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        Belum ada data soal pada modul ini.
                                    </td>
                                </tr>
                            ) : (
                                questions.data.map((question, index) => (
                                    <tr key={question.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-center font-medium text-slate-500 dark:text-slate-400">
                                            {question.display_order || (index + 1)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white line-clamp-2 leading-relaxed">
                                                {question.text_id}
                                            </div>
                                            {question.text_en && (
                                                <div className="text-slate-500 dark:text-slate-400 italic mt-1 line-clamp-1">
                                                    {question.text_en}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                                                {question.answer_options?.length || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                question.is_active 
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                            }`}>
                                                {question.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route('admin.questions.edit', question.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="h-8 w-8 p-0 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"
                                                    onClick={() => handleDelete(question.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
