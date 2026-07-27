import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import ModernSelect from '@/Components/ui/ModernSelect';
import { AdminGuideButton } from '@/Components/admin/AdminGuide';
import type { Activity, Paginated, School, SubmissionResult } from '@/types';
import {
    BookOpen,
    CheckCircle2,
    ClipboardList,
    Download,
    Search,
    ShieldCheck,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

interface Props {
    results: Paginated<SubmissionResult>;
    filters: {
        search?: string;
        activity_id?: string;
        school_id?: string;
        test_type?: string;
    };
    activities: Pick<Activity, 'id' | 'name'>[];
    schools: Pick<School, 'id' | 'name'>[];
    summary: {
        total: number;
        avg_digital_literacy: number;
        avg_data_security: number;
    };
}

export default function Index({ results, filters, activities, schools, summary }: Props) {
    const filterForm = useForm({
        search: filters.search || '',
        activity_id: filters.activity_id || '',
        school_id: filters.school_id || '',
        test_type: filters.test_type || '',
    });

    const applyFilters = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('admin.results.index'), filterForm.data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Hasil Kuesioner" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Analitik</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Hasil Kuesioner</h1>
                    <p className="mt-1 text-[#667085]">Pantau skor literasi digital dan keamanan digital dari pre-test maupun post-test.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <AdminGuideButton module="results" />
                    <Button asChild className="gap-2">
                        <a href={route('admin.results.export', filterForm.data)}>
                            <Download className="h-4 w-4" />
                            Export CSV
                        </a>
                    </Button>
                </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-3">
                <SummaryCard label="Total Submission" value={summary.total} icon={<ClipboardList className="h-5 w-5" />} tone="indigo" />
                <SummaryCard label="Rata-rata Literasi" value={`${summary.avg_digital_literacy}%`} icon={<BookOpen className="h-5 w-5" />} tone="cyan" />
                <SummaryCard label="Rata-rata Keamanan" value={`${summary.avg_data_security}%`} icon={<ShieldCheck className="h-5 w-5" />} tone="violet" />
            </div>

            <Card className="mb-6">
                <CardContent className="p-5">
                    <form onSubmit={applyFilters} className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr_auto]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                            <input
                                value={filterForm.data.search}
                                onChange={(event) => filterForm.setData('search', event.target.value)}
                                className={searchInputClass}
                                placeholder="Cari nama atau kode peserta"
                            />
                        </div>
                        <Select value={filterForm.data.activity_id} onChange={(value) => filterForm.setData('activity_id', value)}>
                            <option value="">Semua kegiatan</option>
                            {activities.map((activity) => (
                                <option key={activity.id} value={activity.id}>{activity.name}</option>
                            ))}
                        </Select>
                        <Select value={filterForm.data.school_id} onChange={(value) => filterForm.setData('school_id', value)}>
                            <option value="">Semua sekolah</option>
                            {schools.map((school) => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </Select>
                        <Select value={filterForm.data.test_type} onChange={(value) => filterForm.setData('test_type', value)}>
                            <option value="">Semua tes</option>
                            <option value="pre_test">Pre-Test</option>
                            <option value="post_test">Post-Test</option>
                        </Select>
                        <Button type="submit">Terapkan</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] text-left text-sm">
                        <thead className="border-b border-[#E8ECF3] bg-[#F8FAFC] text-xs uppercase tracking-[0.12em] text-[#667085]">
                            <tr>
                                <th className="px-5 py-4">Peserta</th>
                                <th className="px-5 py-4">Kode</th>
                                <th className="px-5 py-4">Kegiatan</th>
                                <th className="px-5 py-4">Tes</th>
                                <th className="px-5 py-4">Literasi Digital</th>
                                <th className="px-5 py-4">Keamanan Digital</th>
                                <th className="px-5 py-4">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8ECF3]">
                            {results.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                                <ClipboardList className="h-6 w-6" />
                                            </div>
                                            <p className="font-bold text-[#172033]">Belum ada hasil sesuai filter.</p>
                                            <p className="mt-1 text-sm text-[#667085]">Data akan muncul setelah peserta menyelesaikan kuesioner.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {results.data.map((result) => (
                                <tr key={result.id} className="bg-white transition hover:bg-[#F8FAFC]">
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-[#172033]">{result.participant?.full_name || '-'}</p>
                                        <p className="text-xs text-[#667085]">
                                            {result.participant?.school?.name || '-'}{result.participant?.classroom?.name ? ` / ${result.participant.classroom.name}` : ''}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4 font-mono font-bold text-[#5B5FEF]">{result.participant?.participant_code || '-'}</td>
                                    <td className="px-5 py-4 text-[#667085]">{result.activity?.name || '-'}</td>
                                    <td className="px-5 py-4">
                                        <Badge tone={result.test_type === 'pre_test' ? 'cyan' : 'violet'}>
                                            {result.test_type === 'pre_test' ? 'Pre-Test' : 'Post-Test'}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <ScoreBar value={result.digital_literacy_percentage} category={result.digital_literacy_category} color="#5B5FEF" />
                                    </td>
                                    <td className="px-5 py-4">
                                        <ScoreBar value={result.data_security_percentage} category={result.data_security_category} color="#38BDF8" />
                                    </td>
                                    <td className="px-5 py-4 text-[#667085]">{formatDate(result.submitted_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination meta={results} />
            </Card>
        </AdminLayout>
    );
}

const inputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';
const searchInputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white pl-10 pr-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
    return (
        <ModernSelect value={value} onChange={onChange} className={inputClass}>
            {children}
        </ModernSelect>
    );
}

function SummaryCard({ label, value, icon, tone }: { label: string; value: ReactNode; icon: ReactNode; tone: 'indigo' | 'cyan' | 'violet' }) {
    const toneClasses = {
        indigo: 'bg-[#F1F3FF] text-[#5B5FEF]',
        cyan: 'bg-[#ECFEFF] text-[#0891B2]',
        violet: 'bg-[#F5F3FF] text-[#8B7CF6]',
    };

    return (
        <Card>
            <CardContent className="flex items-center justify-between p-5">
                <div>
                    <p className="text-sm font-semibold text-[#667085]">{label}</p>
                    <p className="mt-1 font-heading text-3xl font-bold text-[#172033]">{value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

function Badge({ children, tone = 'indigo' }: { children: ReactNode; tone?: 'indigo' | 'cyan' | 'violet' | 'success' | 'muted' }) {
    const classes = {
        indigo: 'bg-[#F1F3FF] text-[#5B5FEF]',
        cyan: 'bg-[#ECFEFF] text-[#0891B2]',
        violet: 'bg-[#F5F3FF] text-[#8B7CF6]',
        success: 'bg-[#ECFDF5] text-[#10B981]',
        muted: 'bg-[#F3F7FC] text-[#667085]',
    };

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${classes[tone]}`}>{children}</span>;
}

function ScoreBar({ value, category, color }: { value: number | string; category?: string | null; color: string }) {
    const numeric = Number(value || 0);
    const width = Math.max(0, Math.min(100, Number.isNaN(numeric) ? 0 : numeric));

    return (
        <div className="min-w-[180px]">
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-heading text-lg font-bold text-[#172033]">{formatScore(value)}</span>
                <Badge tone="muted">{category || '-'}</Badge>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${width}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

function Pagination({ meta }: { meta: Paginated<SubmissionResult> }) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex flex-col gap-3 border-t border-[#E8ECF3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#667085]">Menampilkan {meta.from || 0}-{meta.to || 0} dari {meta.total} hasil</p>
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

function formatScore(value?: number | string | null) {
    if (value === undefined || value === null || value === '') return '-';

    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
        return `${value}%`;
    }

    return `${numeric.toFixed(2).replace(/\.00$/, '')}%`;
}

function formatDate(value?: string | null) {
    if (! value) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}
