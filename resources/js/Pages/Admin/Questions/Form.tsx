import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import ModernSelect from '@/Components/ui/ModernSelect';
import { AdminGuideButton, AdminTooltip } from '@/Components/admin/AdminGuide';
import type { AnswerOption, Question, QuestionnaireVersion, ResponseScale } from '@/types';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

type ModuleKey = 'digital_literacy' | 'data_security';
type PillarKey = 'digital_skill' | 'digital_ethics' | 'digital_safety' | 'digital_culture';

interface Props {
    question?: Question & { answer_options: AnswerOption[] };
    defaultModule?: ModuleKey;
    versions: QuestionnaireVersion[];
    responseScales: ResponseScale[];
    pillarOptions: Array<{ value: PillarKey; label: string }>;
}

interface QuestionFormData {
    module: ModuleKey;
    questionnaire_version_id: number | '';
    kominfo_pillar: PillarKey;
    text_id: string;
    text_en: string;
    question_type: string;
    response_scale_id: number | '';
    assessment_type: string;
    difficulty_level: string;
    proficiency_level: string;
    unesco_competence_code: string;
    is_reverse: boolean;
    included_in_score: boolean;
    is_active: boolean;
    answer_options: AnswerOption[];
}

export default function Form({ question, defaultModule, versions, responseScales, pillarOptions }: Props) {
    const isEditing = Boolean(question);
    const module = question?.module || defaultModule || 'digital_literacy';
    const defaultPillar = question?.kominfo_pillar || (module === 'data_security' ? 'digital_safety' : 'digital_skill');
    const defaultScale = question?.response_scale_id || defaultScaleId(responseScales, defaultPillar);
    const activeVersion = versions.find((version) => version.status === 'active') || versions[0];

    const form = useForm<QuestionFormData>({
        module,
        questionnaire_version_id: question?.questionnaire_version_id || activeVersion?.id || '',
        kominfo_pillar: defaultPillar,
        text_id: question?.text_id || '',
        text_en: question?.text_en || '',
        question_type: question?.question_type || 'self_assessment',
        response_scale_id: defaultScale || '',
        assessment_type: question?.assessment_type || 'self_assessment',
        difficulty_level: question?.difficulty_level || '',
        proficiency_level: question?.proficiency_level || '',
        unesco_competence_code: question?.unesco_competence_code || '',
        is_reverse: question?.is_reverse ?? false,
        included_in_score: question?.included_in_score ?? true,
        is_active: question?.is_active ?? true,
        answer_options: question?.answer_options || defaultOptions(defaultPillar),
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

    const handleModuleChange = (nextModule: ModuleKey) => {
        const nextPillar = nextModule === 'data_security'
            ? 'digital_safety'
            : form.data.kominfo_pillar === 'digital_safety'
              ? 'digital_skill'
              : form.data.kominfo_pillar;

        form.setData({
            ...form.data,
            module: nextModule,
            kominfo_pillar: nextPillar,
            response_scale_id: defaultScaleId(responseScales, nextPillar) || form.data.response_scale_id,
        });
    };

    const handlePillarChange = (nextPillar: PillarKey) => {
        form.setData({
            ...form.data,
            kominfo_pillar: nextPillar,
            module: nextPillar === 'digital_safety' ? 'data_security' : 'digital_literacy',
            response_scale_id: defaultScaleId(responseScales, nextPillar) || form.data.response_scale_id,
        });
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
                <div className="mt-4">
                    <AdminGuideButton module="questionForm" />
                </div>
            </div>

            <form onSubmit={submit} className="max-w-5xl space-y-6">
                <Card>
                    <CardContent className="space-y-6 p-6 md:p-8">
                        <div className="border-b border-[#E8ECF3] pb-5">
                            <h2 className="font-heading text-xl font-bold text-[#172033]">Informasi Soal</h2>
                            <p className="mt-1 text-sm text-[#667085]">Pilih modul yang sesuai agar soal muncul di bagian kuesioner yang tepat.</p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label={<LabelWithHelp label="Versi Instrumen" help="Versi mengunci set soal yang dipakai submission. Draft peserta memakai versi saat draft pertama dibuat." />}
                                error={form.errors.questionnaire_version_id}
                            >
                                <ModernSelect
                                    value={form.data.questionnaire_version_id}
                                    onChange={(value) => form.setData('questionnaire_version_id', Number(value) || '')}
                                    className={inputClass}
                                >
                                    <option value="">Versi aktif sistem</option>
                                    {versions.map((version) => (
                                        <option key={version.id} value={version.id}>
                                            {version.name} ({version.code})
                                        </option>
                                    ))}
                                </ModernSelect>
                            </Field>

                            <Field label="Modul Kuesioner" error={form.errors.module}>
                                <ModernSelect
                                    value={form.data.module}
                                    onChange={(value) => handleModuleChange(value as ModuleKey)}
                                    className={inputClass}
                                >
                                    <option value="digital_literacy">Literasi Digital</option>
                                    <option value="data_security">Keamanan Digital</option>
                                </ModernSelect>
                            </Field>

                            <Field
                                label={<LabelWithHelp label="Pilar Kominfo" help="Pilar menentukan skor internal: Digital Skill, Digital Ethics, Digital Safety, atau Digital Culture." />}
                                error={form.errors.kominfo_pillar}
                            >
                                <ModernSelect
                                    value={form.data.kominfo_pillar}
                                    onChange={(value) => handlePillarChange(value as PillarKey)}
                                    className={inputClass}
                                >
                                    {pillarOptions.map((pillar) => (
                                        <option key={pillar.value} value={pillar.value}>
                                            {pillar.label}
                                        </option>
                                    ))}
                                </ModernSelect>
                            </Field>

                            <Field
                                label={<LabelWithHelp label="Skala Jawaban" help="Digital Skill dan Digital Safety memakai skala kemampuan. Digital Ethics dan Digital Culture memakai skala persetujuan." />}
                                error={form.errors.response_scale_id}
                            >
                                <ModernSelect
                                    value={form.data.response_scale_id}
                                    onChange={(value) => form.setData('response_scale_id', Number(value) || '')}
                                    className={inputClass}
                                >
                                    <option value="">Tanpa skala tersimpan</option>
                                    {responseScales.map((scale) => (
                                        <option key={scale.id} value={scale.id}>
                                            {scale.name_id} ({scale.code})
                                        </option>
                                    ))}
                                </ModernSelect>
                            </Field>

                            <Field label="Tipe Pertanyaan" error={form.errors.question_type}>
                                <ModernSelect
                                    value={form.data.question_type}
                                    onChange={(value) => form.setData('question_type', value)}
                                    className={inputClass}
                                >
                                    <option value="self_assessment">Self Assessment</option>
                                    <option value="scenario">Skenario</option>
                                    <option value="knowledge">Pengetahuan</option>
                                </ModernSelect>
                            </Field>

                            <Field label="Assessment Type" error={form.errors.assessment_type}>
                                <ModernSelect
                                    value={form.data.assessment_type}
                                    onChange={(value) => form.setData('assessment_type', value)}
                                    className={inputClass}
                                >
                                    <option value="self_assessment">Self Assessment</option>
                                    <option value="scenario">Skenario</option>
                                    <option value="knowledge">Pengetahuan</option>
                                </ModernSelect>
                            </Field>

                            <Field label="Difficulty Level" error={form.errors.difficulty_level}>
                                <ModernSelect
                                    value={form.data.difficulty_level}
                                    onChange={(value) => form.setData('difficulty_level', value)}
                                    className={inputClass}
                                >
                                    <option value="">Tidak diatur</option>
                                    <option value="basic">Basic</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </ModernSelect>
                            </Field>

                            <Field label="Proficiency Level" error={form.errors.proficiency_level}>
                                <ModernSelect
                                    value={form.data.proficiency_level}
                                    onChange={(value) => form.setData('proficiency_level', value)}
                                    className={inputClass}
                                >
                                    <option value="">Tidak diatur</option>
                                    <option value="foundation">Foundation</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </ModernSelect>
                            </Field>

                            <Field
                                label={<LabelWithHelp label="Kode Kompetensi UNESCO" help="Kode ini membantu memetakan soal ke kerangka UNESCO DLGF. Contoh: 1.2 untuk evaluasi informasi atau 4.2 untuk data pribadi." />}
                                error={form.errors.unesco_competence_code}
                                hint="Contoh: 1.2 atau 4.2. Mapping detail tersimpan pada instrumen."
                            >
                                <input
                                    value={form.data.unesco_competence_code}
                                    onChange={(event) => form.setData('unesco_competence_code', event.target.value)}
                                    className={inputClass}
                                    placeholder="Contoh: 1.2"
                                />
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

                            <label className="flex items-start gap-3 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                                <input
                                    type="checkbox"
                                    checked={form.data.included_in_score}
                                    onChange={(event) => form.setData('included_in_score', event.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                                />
                                <span>
                                    <span className="flex items-center gap-2 font-bold text-[#172033]">
                                        Masuk perhitungan skor
                                        <AdminTooltip content="Jika aktif, jawaban pada soal ini ikut dihitung ke skor pilar dan indeks. Nonaktifkan hanya untuk butir instruksi atau non-skor." />
                                    </span>
                                    <span className="text-sm text-[#667085]">Nonaktifkan hanya untuk butir instruksi atau validasi non-skor.</span>
                                </span>
                            </label>

                            <label className="flex items-start gap-3 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_reverse}
                                    onChange={(event) => form.setData('is_reverse', event.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                                />
                                <span>
                                    <span className="flex items-center gap-2 font-bold text-[#172033]">
                                        Reverse scoring
                                        <AdminTooltip content="Reverse scoring membalik bobot jawaban saat perhitungan. Gunakan hanya untuk pertanyaan negatif atau risiko agar skor tetap searah." />
                                    </span>
                                    <span className="text-sm text-[#667085]">Bobot dibalik saat scoring, tetapi snapshot jawaban tetap tersimpan.</span>
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
                                <p className="mt-1 text-sm text-[#667085]">Gunakan bobot 1-5 sesuai skala instrumen final, kecuali butir non-skor.</p>
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
                                                max="5"
                                                step="0.01"
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

function defaultScaleId(responseScales: ResponseScale[], pillar: PillarKey): number | '' {
    const code = pillar === 'digital_skill' || pillar === 'digital_safety' ? 'ability_1_5' : 'agreement_1_5';

    return responseScales.find((scale) => scale.code === code)?.id || '';
}

function defaultOptions(pillar: PillarKey): AnswerOption[] {
    if (pillar === 'digital_skill' || pillar === 'digital_safety') {
        return [
            { label_id: 'Tidak mengerti', label_en: 'I do not understand', weight: 1 },
            { label_id: 'Tidak pernah melakukan', label_en: 'I have never done this', weight: 2 },
            { label_id: 'Melakukan dengan bantuan', label_en: 'I can do this with help', weight: 3 },
            { label_id: 'Melakukan sendiri', label_en: 'I can do this independently', weight: 4 },
            { label_id: 'Melakukan sendiri dan membantu orang lain', label_en: 'I can do this independently and help others', weight: 5 },
        ];
    }

    return [
        { label_id: 'Sangat Tidak Setuju', label_en: 'Strongly Disagree', weight: 1 },
        { label_id: 'Tidak Setuju', label_en: 'Disagree', weight: 2 },
        { label_id: 'Ragu-ragu', label_en: 'Unsure', weight: 3 },
        { label_id: 'Setuju', label_en: 'Agree', weight: 4 },
        { label_id: 'Sangat Setuju', label_en: 'Strongly Agree', weight: 5 },
    ];
}

function LabelWithHelp({ label, help }: { label: string; help: string }) {
    return (
        <span className="inline-flex items-center gap-2">
            {label}
            <AdminTooltip content={help} />
        </span>
    );
}

function Field({ label, error, hint, children }: { label: ReactNode; error?: string; hint?: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-[#172033]">{label}</label>
            {children}
            {hint && <p className="text-xs text-[#667085]">{hint}</p>}
            {error && <p className="text-sm font-semibold text-[#F43F5E]">{error}</p>}
        </div>
    );
}
