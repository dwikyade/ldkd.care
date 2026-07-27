import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { AdminGuideButton, AdminTooltip } from '@/Components/admin/AdminGuide';
import type { CategoryThreshold, EducationalTip } from '@/types';
import { BookOpenCheck, Save, Scale, ShieldCheck } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

interface ModuleSetting {
    key: 'digital_literacy' | 'data_security';
    label: string;
    thresholds: CategoryThreshold[];
    tips: EducationalTip[];
}

interface Props {
    modules: ModuleSetting[];
    flash?: {
        success?: string;
        error?: string;
    };
}

interface ScoringFormData {
    thresholds: Array<{
        id: number;
        minimum_percentage: string;
        maximum_percentage: string;
        is_active: boolean;
    }>;
    tips: Array<{
        id: number;
        content_id: string;
        content_en: string;
        is_active: boolean;
    }>;
}

const categoryLabels = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
};

export default function Index({ modules, flash }: Props) {
    const form = useForm<ScoringFormData>({
        thresholds: modules.flatMap((module) =>
            module.thresholds.map((threshold) => ({
                id: threshold.id,
                minimum_percentage: String(threshold.minimum_percentage),
                maximum_percentage: String(threshold.maximum_percentage),
                is_active: threshold.is_active,
            })),
        ),
        tips: modules.flatMap((module) =>
            module.tips.map((tip) => ({
                id: tip.id,
                content_id: tip.content_id,
                content_en: tip.content_en || '',
                is_active: tip.is_active,
            })),
        ),
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(route('admin.scoring.update'), { preserveScroll: true });
    };

    const thresholdIndex = (id: number) => form.data.thresholds.findIndex((threshold) => threshold.id === id);
    const tipIndex = (id: number) => form.data.tips.findIndex((tip) => tip.id === id);

    const updateThreshold = (id: number, field: keyof ScoringFormData['thresholds'][number], value: string | boolean) => {
        const index = thresholdIndex(id);
        if (index < 0) return;

        const next = [...form.data.thresholds];
        next[index] = { ...next[index], [field]: value };
        form.setData('thresholds', next);
    };

    const updateTip = (id: number, field: keyof ScoringFormData['tips'][number], value: string | boolean) => {
        const index = tipIndex(id);
        if (index < 0) return;

        const next = [...form.data.tips];
        next[index] = { ...next[index], [field]: value };
        form.setData('tips', next);
    };

    const formThreshold = (id: number) => form.data.thresholds[thresholdIndex(id)];
    const formTip = (id: number) => form.data.tips[tipIndex(id)];

    return (
        <AdminLayout>
            <Head title="Bobot dan Kategori" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Pengaturan Skor</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Bobot dan Kategori</h1>
                    <p className="mt-1 max-w-3xl text-[#667085]">
                        Kelola ambang kategori hasil dan tips edukasi. Bobot jawaban tiap opsi tetap dikelola dari Bank Soal.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <AdminGuideButton module="scoring" />
                    <Button type="submit" form="scoring-form" disabled={form.processing} className="gap-2">
                        <Save className="h-4 w-4" />
                        {form.processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </Button>
                </div>
            </div>

            {flash?.success && <Alert tone="success">{flash.success}</Alert>}
            {flash?.error && <Alert tone="danger">{flash.error}</Alert>}
            {form.errors.thresholds && <Alert tone="danger">{form.errors.thresholds}</Alert>}

            <form id="scoring-form" onSubmit={submit} className="space-y-6">
                <Card className="border-[#D9DDFF] bg-[#F9FAFF]">
                    <CardContent className="grid gap-4 p-5 md:grid-cols-3">
                        <SummaryItem icon={<Scale className="h-5 w-5" />} label="Rumus skor" value="Tetap dari bobot opsi jawaban" />
                        <SummaryItem icon={<BookOpenCheck className="h-5 w-5" />} label="Kategori aktif" value="Low, medium, high per modul" />
                        <SummaryItem icon={<ShieldCheck className="h-5 w-5" />} label="Tips edukasi" value="Ditampilkan otomatis pada halaman hasil" />
                    </CardContent>
                </Card>

                {modules.map((module) => {
                    const Icon = module.key === 'digital_literacy' ? BookOpenCheck : ShieldCheck;
                    const tone = module.key === 'digital_literacy' ? 'indigo' : 'cyan';

                    return (
                        <Card key={module.key}>
                            <CardContent className="space-y-6 p-6">
                                <div className="flex flex-col gap-4 border-b border-[#E8ECF3] pb-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone === 'indigo' ? 'bg-[#F1F3FF] text-[#5B5FEF]' : 'bg-[#ECFEFF] text-[#0891B2]'}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="font-heading text-xl font-bold text-[#172033]">{module.label}</h2>
                                            <p className="text-sm text-[#667085]">Ambang kategori dan rekomendasi untuk modul ini.</p>
                                        </div>
                                    </div>
                                    <Badge>{module.thresholds.length} kategori</Badge>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-3">
                                    {module.thresholds.map((threshold) => {
                                        const item = formThreshold(threshold.id);

                                        return (
                                            <div key={threshold.id} className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="font-heading text-lg font-bold text-[#172033]">{categoryLabels[threshold.category]}</p>
                                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">{threshold.category}</p>
                                                    </div>
                                                    <Toggle
                                                        checked={item?.is_active ?? false}
                                                        onChange={(checked) => updateThreshold(threshold.id, 'is_active', checked)}
                                                        label="Aktif"
                                                        help="Jika nonaktif, rentang kategori ini tidak dipakai saat sistem mencari kategori skor."
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Field label={<LabelWithHelp label="Min" help="Batas skor terendah untuk kategori ini. Instrumen final memakai rentang 1.00 sampai 5.00." />}>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="5"
                                                            step="0.01"
                                                            value={item?.minimum_percentage || ''}
                                                            onChange={(event) => updateThreshold(threshold.id, 'minimum_percentage', event.target.value)}
                                                            className={inputClass}
                                                        />
                                                    </Field>
                                                    <Field label={<LabelWithHelp label="Max" help="Batas skor tertinggi untuk kategori ini. Pastikan tidak tumpang tindih dengan kategori lain." />}>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="5"
                                                            step="0.01"
                                                            value={item?.maximum_percentage || ''}
                                                            onChange={(event) => updateThreshold(threshold.id, 'maximum_percentage', event.target.value)}
                                                            className={inputClass}
                                                        />
                                                    </Field>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid gap-4 lg:grid-cols-3">
                                    {module.tips.map((tip) => {
                                        const item = formTip(tip.id);

                                        return (
                                            <div key={tip.id} className="rounded-2xl border border-[#E8ECF3] bg-white p-4">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="font-heading text-lg font-bold text-[#172033]">Tips {categoryLabels[tip.category]}</p>
                                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">{tip.category}</p>
                                                    </div>
                                                    <Toggle checked={item?.is_active ?? false} onChange={(checked) => updateTip(tip.id, 'is_active', checked)} label="Aktif" help="Jika aktif, tips ini dapat muncul di halaman hasil peserta sesuai kategori." />
                                                </div>
                                                <Field label="Bahasa Indonesia">
                                                    <textarea
                                                        value={item?.content_id || ''}
                                                        onChange={(event) => updateTip(tip.id, 'content_id', event.target.value)}
                                                        rows={4}
                                                        className={textareaClass}
                                                    />
                                                </Field>
                                                <Field label="English">
                                                    <textarea
                                                        value={item?.content_en || ''}
                                                        onChange={(event) => updateTip(tip.id, 'content_en', event.target.value)}
                                                        rows={4}
                                                        className={textareaClass}
                                                    />
                                                </Field>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </form>
        </AdminLayout>
    );
}

const inputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';
const textareaClass = 'mt-2 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 py-3 text-sm leading-6 text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';

function SummaryItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="flex gap-3 rounded-2xl border border-[#E8ECF3] bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F3FF] text-[#5B5FEF]">{icon}</div>
            <div>
                <p className="font-bold text-[#172033]">{label}</p>
                <p className="mt-1 text-sm text-[#667085]">{value}</p>
            </div>
        </div>
    );
}

function LabelWithHelp({ label, help }: { label: string; help: string }) {
    return (
        <span className="inline-flex items-center gap-2">
            {label}
            <AdminTooltip content={help} />
        </span>
    );
}

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
    return (
        <label className="block text-sm font-bold text-[#172033]">
            {label}
            {children}
        </label>
    );
}

function Toggle({ checked, onChange, label, help }: { checked: boolean; onChange: (checked: boolean) => void; label: string; help?: string }) {
    return (
        <label className="inline-flex items-center gap-2 text-xs font-bold text-[#667085]">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
            />
            {label}
            {help && <AdminTooltip content={help} />}
        </label>
    );
}

function Badge({ children }: { children: ReactNode }) {
    return <span className="inline-flex rounded-full bg-[#F1F3FF] px-3 py-1 text-xs font-bold text-[#5B5FEF]">{children}</span>;
}

function Alert({ children, tone }: { children: ReactNode; tone: 'success' | 'danger' }) {
    return (
        <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${tone === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>
            {children}
        </div>
    );
}
