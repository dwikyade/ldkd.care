import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Question, AnswerOption } from '@/types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

interface Props {
    question?: Question & { answer_options: AnswerOption[] };
    defaultModule?: 'digital_literacy' | 'data_security';
}

export default function Form({ question, defaultModule }: Props) {
    const isEditing = !!question;
    
    const { data, setData, post, put, processing, errors } = useForm({
        module: question?.module || defaultModule || 'digital_literacy',
        text_id: question?.text_id || '',
        text_en: question?.text_en || '',
        is_active: question?.is_active ?? true,
        answer_options: question?.answer_options || [
            { label_id: '', label_en: '', weight: 4 },
            { label_id: '', label_en: '', weight: 3 },
            { label_id: '', label_en: '', weight: 2 },
            { label_id: '', label_en: '', weight: 1 },
        ],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('admin.questions.update', question.id));
        } else {
            post(route('admin.questions.store'));
        }
    };

    const addOption = () => {
        setData('answer_options', [...data.answer_options, { label_id: '', label_en: '', weight: 0 }]);
    };

    const removeOption = (index: number) => {
        if (data.answer_options.length <= 2) {
            alert('Minimal harus ada 2 opsi jawaban.');
            return;
        }
        const newOptions = [...data.answer_options];
        newOptions.splice(index, 1);
        setData('answer_options', newOptions);
    };

    const updateOption = (index: number, field: string, value: any) => {
        const newOptions = [...data.answer_options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setData('answer_options', newOptions);
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? "Edit Soal" : "Tambah Soal"} />

            <div className="mb-8">
                <Link href={route('admin.questions.index', { module: data.module })} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Soal
                </Link>
                <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    {isEditing ? 'Edit Data Soal' : 'Tambah Soal Baru'}
                </h1>
            </div>

            <form onSubmit={submit} className="max-w-4xl space-y-6">
                <Card>
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Informasi Soal</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Modul Kuesioner <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.module}
                                    onChange={e => setData('module', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
                                >
                                    <option value="digital_literacy">Literasi Digital</option>
                                    <option value="data_security">Keamanan Data</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-8">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                                />
                                <label htmlFor="is_active" className="ml-2 font-medium text-slate-700 dark:text-slate-300">
                                    Soal Aktif (ditampilkan ke peserta)
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Pertanyaan (Bahasa Indonesia) <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    value={data.text_id}
                                    onChange={e => setData('text_id', e.target.value)}
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white ${
                                        errors.text_id ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                    }`}
                                    placeholder="Tuliskan pertanyaan di sini..."
                                />
                                {errors.text_id && <p className="text-sm text-rose-500">{errors.text_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Pertanyaan (Bahasa Inggris) <span className="text-slate-400 font-normal ml-1">Opsional</span>
                                </label>
                                <textarea
                                    value={data.text_en}
                                    onChange={e => setData('text_en', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
                                    placeholder="Translate the question here..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Opsi Jawaban & Skor</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-1">
                                <Plus className="w-4 h-4" /> Tambah Opsi
                            </Button>
                        </div>

                        {/* Note about array validation errors */}
                        {Object.keys(errors).filter(k => k.startsWith('answer_options')).length > 0 && (
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium">
                                Mohon periksa kembali, ada kolom opsi jawaban yang belum terisi.
                            </div>
                        )}

                        <div className="space-y-4">
                            {data.answer_options.map((option, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            value={option.label_id}
                                            onChange={e => updateOption(index, 'label_id', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white text-sm"
                                            placeholder={`Opsi Bahasa Indonesia... (wajib)`}
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={option.label_en || ''}
                                            onChange={e => updateOption(index, 'label_en', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white text-sm"
                                            placeholder={`Opsi Bahasa Inggris... (opsional)`}
                                        />
                                    </div>
                                    <div className="w-24 shrink-0 space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Bobot Skor</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={option.weight}
                                            onChange={e => updateOption(index, 'weight', Number(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white font-bold text-center"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeOption(index)}
                                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors mt-6"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href={route('admin.questions.index', { module: data.module })}>
                        <Button type="button" variant="outline" size="lg">Batal</Button>
                    </Link>
                    <Button type="submit" size="lg" className="gap-2" disabled={processing}>
                        <Save className="w-4 h-4" />
                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
