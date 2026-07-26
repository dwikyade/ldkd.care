import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import type { Paginated, Question, QuestionnaireVersion } from '@/types';
import { Edit2, Laptop, Plus, Shield, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
    questions: Paginated<Question>;
    currentModule: 'digital_literacy' | 'data_security';
    currentPillar?: string | null;
    currentVersionId?: number | null;
    versions: QuestionnaireVersion[];
    pillarOptions: Array<{ value: string; label: string }>;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ questions, currentModule, currentPillar, currentVersionId, versions, pillarOptions, flash }: Props) {
    const handleDelete = (question: Question) => {
        if (confirm('Hapus soal ini?')) {
            router.delete(route('admin.questions.destroy', question.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Soal" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Kuesioner</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Bank Soal Kuesioner</h1>
                    <p className="mt-1 text-[#667085]">Kelola soal, pilar Kominfo, skala jawaban, dan mapping UNESCO untuk instrumen kuesioner.</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href={route('admin.questions.create', { module: currentModule })}>
                        <Plus className="h-4 w-4" />
                        Tambah Soal
                    </Link>
                </Button>
            </div>

            {flash?.success && <Alert tone="success">{flash.success}</Alert>}
            {flash?.error && <Alert tone="danger">{flash.error}</Alert>}

            <div className="mb-6 grid max-w-xl grid-cols-2 gap-2 rounded-2xl border border-[#E8ECF3] bg-white p-1.5 shadow-[0_14px_35px_-30px_rgba(23,32,51,0.5)]">
                <ModuleTab
                    href={route('admin.questions.index', { module: 'digital_literacy' })}
                    active={currentModule === 'digital_literacy'}
                    icon={<Laptop className="h-4 w-4" />}
                    label="Literasi Digital"
                />
                <ModuleTab
                    href={route('admin.questions.index', { module: 'data_security' })}
                    active={currentModule === 'data_security'}
                    icon={<Shield className="h-4 w-4" />}
                    label="Keamanan Digital"
                />
            </div>

            <Card className="mb-6">
                <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                    <Field label="Filter Pilar">
                        <select
                            value={currentPillar || ''}
                            onChange={(event) => router.get(route('admin.questions.index'), {
                                module: currentModule,
                                pillar: event.target.value || undefined,
                                version_id: currentVersionId || undefined,
                            }, { preserveState: true, preserveScroll: true })}
                            className={inputClass}
                        >
                            <option value="">Semua pilar</option>
                            {pillarOptions.map((pillar) => (
                                <option key={pillar.value} value={pillar.value}>
                                    {pillar.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Filter Versi Instrumen">
                        <select
                            value={currentVersionId || ''}
                            onChange={(event) => router.get(route('admin.questions.index'), {
                                module: currentModule,
                                pillar: currentPillar || undefined,
                                version_id: Number(event.target.value) || undefined,
                            }, { preserveState: true, preserveScroll: true })}
                            className={inputClass}
                        >
                            <option value="">Semua versi</option>
                            {versions.map((version) => (
                                <option key={version.id} value={version.id}>
                                    {version.name} ({version.status})
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1180px] text-left text-sm">
                        <thead className="border-b border-[#E8ECF3] bg-[#F8FAFC] text-xs uppercase tracking-[0.12em] text-[#667085]">
                            <tr>
                                <th className="px-5 py-4 text-center">No</th>
                                <th className="px-5 py-4">Pertanyaan</th>
                                <th className="px-5 py-4">Pilar</th>
                                <th className="px-5 py-4">Skala</th>
                                <th className="px-5 py-4 text-center">Opsi</th>
                                <th className="px-5 py-4 text-center">Status</th>
                                <th className="px-5 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8ECF3]">
                            {questions.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                                {currentModule === 'digital_literacy' ? <Laptop className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                                            </div>
                                            <p className="font-bold text-[#172033]">Belum ada soal pada modul ini.</p>
                                            <p className="mt-1 text-sm text-[#667085]">Tambahkan soal beserta opsi jawaban untuk mulai digunakan peserta.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {questions.data.map((question, index) => (
                                <tr key={question.id} className="bg-white transition hover:bg-[#F8FAFC]">
                                    <td className="px-5 py-4 text-center font-bold text-[#667085]">{question.display_order || index + 1}</td>
                                    <td className="px-5 py-4">
                                        <p className="line-clamp-2 font-semibold leading-6 text-[#172033]">{question.text_id}</p>
                                        {question.text_en && <p className="mt-1 line-clamp-1 text-sm text-[#667085]">{question.text_en}</p>}
                                        {question.unesco_competence_code && (
                                            <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#98A2B3]">
                                                UNESCO {question.unesco_competence_code}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge tone="indigo">{pillarLabel(question.kominfo_pillar)}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-[#172033]">{question.response_scale?.name_id || '-'}</p>
                                        {question.questionnaire_version?.code && <p className="mt-1 text-xs font-semibold text-[#98A2B3]">{question.questionnaire_version.code}</p>}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-[#F1F3FF] px-3 text-sm font-bold text-[#5B5FEF]">
                                            {question.answer_options?.length || 0}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <Badge tone={question.is_active ? 'success' : 'muted'}>{question.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild variant="outline" size="sm" className="gap-2">
                                                <Link href={route('admin.questions.edit', question.id)}>
                                                    <Edit2 className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleDelete(question)} className="text-[#F43F5E]">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination meta={questions} />
            </Card>
        </AdminLayout>
    );
}

function ModuleTab({ href, active, icon, label }: { href: string; active: boolean; icon: ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                active ? 'bg-[#F1F3FF] text-[#5B5FEF]' : 'text-[#667085] hover:bg-[#F8FAFC] hover:text-[#172033]'
            }`}
        >
            {icon}
            {label}
        </Link>
    );
}

function Badge({ children, tone = 'indigo' }: { children: ReactNode; tone?: 'indigo' | 'success' | 'muted' }) {
    const classes = {
        indigo: 'bg-[#F1F3FF] text-[#5B5FEF]',
        success: 'bg-[#ECFDF5] text-[#10B981]',
        muted: 'bg-[#F3F7FC] text-[#667085]',
    };

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${classes[tone]}`}>{children}</span>;
}

const inputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm font-semibold text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-[#172033]">{label}</label>
            {children}
        </div>
    );
}

function pillarLabel(value?: string | null): string {
    const labels: Record<string, string> = {
        digital_skill: 'Digital Skill',
        digital_ethics: 'Digital Ethics',
        digital_safety: 'Digital Safety',
        digital_culture: 'Digital Culture',
    };

    return value ? labels[value] || value : '-';
}

function Alert({ children, tone }: { children: ReactNode; tone: 'success' | 'danger' }) {
    return (
        <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${tone === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>
            {children}
        </div>
    );
}

function Pagination({ meta }: { meta: Paginated<Question> }) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex flex-col gap-3 border-t border-[#E8ECF3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#667085]">Menampilkan {meta.from || 0}-{meta.to || 0} dari {meta.total} soal</p>
            <div className="flex flex-wrap gap-2">
                {meta.links?.map((link, index) => (
                    link.url ? (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url}
                            className={`rounded-xl border px-3 py-2 text-sm font-bold ${link.active ? 'border-[#5B5FEF] bg-[#F1F3FF] text-[#5B5FEF]' : 'border-[#E8ECF3] text-[#667085] hover:text-[#5B5FEF]'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span key={`${link.label}-${index}`} className="rounded-xl border border-[#E8ECF3] px-3 py-2 text-sm font-bold text-[#CBD5E1]" dangerouslySetInnerHTML={{ __html: link.label }} />
                    )
                ))}
            </div>
        </div>
    );
}
