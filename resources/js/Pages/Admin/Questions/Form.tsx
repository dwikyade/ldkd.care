import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import type { AnswerOption, Question } from '@/types';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

interface Props {
    question?: Question & { answer_options: AnswerOption[] };
    defaultModule?: 'digital_literacy' | 'data_security';
}

interface QuestionFormData {
    module: 'digital_literacy' | 'data_security';
    text_id: string;
    text_en: string;
    is_active: boolean;
    answer_options: AnswerOption[];
}

export default function Form({ question, defaultModule }: Props) {
    const isEditing = Boolean(question);
    const form = useForm<QuestionFormData>({
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

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (question) {
            form.put(route('admin.questions.update', question.id));
        } else {
            form.post(route('admin.questions.store'));
        }
    };

    const addOption = () => {
        form.setData('answer_options', [...form.data.answer_options, { label_id: '', label_en: '', weight: 0 }]);
    };

    const removeOption = (index: number) => {
        if (form.data.answer_options.length <= 2) {
            alert('Minimal harus ada 2 opsi jawaban.');
            return;
        }

        const nextOptions = [...form.data.answer_options];
        nextOptions.splice(index, 1);
        form.setData('answer_options', nextOptions);
    };

    const updateOption = (index: number, field: keyof AnswerOption, value: string | number) => {
        const nextOptions = [...form.data.answer_options];
        nextOptions[index] = { ...nextOptions[index], [field]: value };
        form.setData('answer_options', nextOptions);
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Edit Soal' : 'Tambah Soal'} />

            <div className="mb-8">
                <Link href={route('admin.questions.index', { module: form.data.module })} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#5B5FEF]">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Bank Soal
                </Link>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Kuesioner</p>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">
                    {isEditing ? 'Edit Soal' : 'Tambah Soal'}
                </h1>
                <p className="mt-1 text-[#667085]">Kelola pertanyaan dan bobot jawaban tanpa mengubah mekanisme perhitungan skor.</p>
            </div>

            <form onSubmit={submit} className="max-w-5xl space-y-6">
                <Card>
                    <CardContent className="space-y-6 p-6 md:p-8">
                        <div className="border-b border-[#E8ECF3] pb-5">
                            <h2 className="font-heading text-xl font-bold text-[#172033]">Informasi Soal</h2>
                            <p className="mt-1 text-sm text-[#667085]">Pilih modul yang sesuai agar soal muncul di bagian kuesioner yang tepat.</p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Modul Kuesioner" error={form.errors.module}>
                                <select
                                    value={form.data.module}
                                    onChange={(event) => form.setData('module', event.target.value as QuestionFormData['module'])}
                                    className={inputClass}
                                >
                                    <option value="digital_literacy">Literasi Digital</option>
                                    <option value="data_security">Keamanan Digital</option>
                                </select>
                            </Field>

                            <label className="flex items-start gap-3 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(event) => form.setData('is_active', event.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                                />
                                <span>
                                    <span className="block font-bold text-[#172033]">Soal aktif</span>
                                    <span className="text-sm text-[#667085]">Soal aktif ditampilkan ke peserta saat modul diisi.</span>
                                </span>
                            </label>
                        </div>

                        <Field label="Pertanyaan Bahasa Indonesia" error={form.errors.text_id}>
                            <textarea
                                value={form.data.text_id}
                                onChange={(event) => form.setData('text_id', event.target.value)}
                                rows={4}
                                className={textareaClass}
                                placeholder="Tuliskan pertanyaan utama dalam Bahasa Indonesia."
                            />
                        </Field>

                        <Field label="Pertanyaan Bahasa Inggris" error={form.errors.text_en} hint="Opsional untuk mode English.">
                            <textarea
                                value={form.data.text_en}
                                onChange={(event) => form.setData('text_en', event.target.value)}
                                rows={3}
                                className={textareaClass}
                                placeholder="Optional English version."
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-6 p-6 md:p-8">
                        <div className="flex flex-col gap-3 border-b border-[#E8ECF3] pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-heading text-xl font-bold text-[#172033]">Opsi Jawaban dan Bobot</h2>
                                <p className="mt-1 text-sm text-[#667085]">Minimal dua opsi jawaban, dengan bobot sesuai skema penilaian yang sudah berjalan.</p>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Opsi
                            </Button>
                        </div>

                        {Object.keys(form.errors).some((key) => key.startsWith('answer_options')) && (
                            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                                Mohon periksa kembali opsi jawaban dan bobot skor.
                            </div>
                        )}

                        <div className="space-y-4">
                            {form.data.answer_options.map((option, index) => (
                                <div key={option.id || index} className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F3FF] font-bold text-[#5B5FEF]">
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#172033]">Opsi {index + 1}</p>
                                                <p className="text-xs text-[#667085]">Label peserta dan bobot skor</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-white text-[#F43F5E] transition hover:bg-rose-50"
                                            aria-label={`Hapus opsi ${index + 1}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_120px]">
                                        <Field label="Label Indonesia">
                                            <input
                                                value={option.label_id}
                                                onChange={(event) => updateOption(index, 'label_id', event.target.value)}
                                                className={inputClass}
                                                placeholder="Contoh: Sangat setuju"
                                                required
                                            />
                                        </Field>
                                        <Field label="Label English">
                                            <input
                                                value={option.label_en || ''}
                                                onChange={(event) => updateOption(index, 'label_en', event.target.value)}
                                                className={inputClass}
                                                placeholder="Optional"
                                            />
                                        </Field>
                                        <Field label="Bobot">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={option.weight}
                                                onChange={(event) => updateOption(index, 'weight', Number(event.target.value) || 0)}
                                                className={`${inputClass} text-center font-bold`}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button asChild variant="outline" size="lg">
                        <Link href={route('admin.questions.index', { module: form.data.module })}>Batal</Link>
                    </Button>
                    <Button type="submit" size="lg" disabled={form.processing} className="gap-2">
                        <Save className="h-4 w-4" />
                        {form.processing ? 'Menyimpan...' : 'Simpan Soal'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}

const inputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';
const textareaClass = 'w-full rounded-xl border border-[#E8ECF3] bg-white px-3 py-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-[#172033]">{label}</label>
            {children}
            {hint && <p className="text-xs text-[#667085]">{hint}</p>}
            {error && <p className="text-sm font-semibold text-[#F43F5E]">{error}</p>}
        </div>
    );
}
