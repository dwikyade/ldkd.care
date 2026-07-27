import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import ModernSelect from '@/Components/ui/ModernSelect';
import { AdminGuideButton } from '@/Components/admin/AdminGuide';
import type { Activity, Paginated, School } from '@/types';
import {
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    Download,
    Search,
    UserRoundCheck,
    UserRoundX,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

interface ComparisonRow {
    id: number;
    participant_code: string;
    full_name: string;
    role: 'student' | 'teacher';
    school?: string | null;
    classroom?: string | null;
    pre_digital_literacy?: number | string | null;
    post_digital_literacy?: number | string | null;
    digital_literacy_diff?: number | string | null;
    pre_data_security?: number | string | null;
    post_data_security?: number | string | null;
    data_security_diff?: number | string | null;
    status: 'complete' | 'incomplete';
}

interface Props {
    comparisons: Paginated<ComparisonRow>;
    filters: {
        search?: string;
        activity_id?: string;
        school_id?: string;
        role?: string;
        status?: string;
    };
    activities: Pick<Activity, 'id' | 'name'>[];
    schools: Pick<School, 'id' | 'name'>[];
    summary: {
        total: number;
        complete: number;
        incomplete: number;
        avg_digital_literacy_diff: number;
        avg_data_security_diff: number;
    };
}

export default function Index({ comparisons, filters, activities, schools, summary }: Props) {
    const filterForm = useForm({
        search: filters.search || '',
        activity_id: filters.activity_id || '',
        school_id: filters.school_id || '',
        role: filters.role || '',
        status: filters.status || '',
    });

    const applyFilters = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('admin.comparisons.index'), filterForm.data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Perbandingan Hasil" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Evaluasi</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Perbandingan Pre-Test dan Post-Test</h1>
                    <p className="mt-1 text-[#667085]">Bandingkan peningkatan literasi digital dan keamanan digital berdasarkan kode peserta yang sama.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <AdminGuideButton module="comparisons" />
                    <Button asChild className="gap-2">
                        <a href={route('admin.comparisons.export', filterForm.data)}>
                            <Download className="h-4 w-4" />
                            Export CSV
                        </a>
                    </Button>
                </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <SummaryCard label="Total Peserta" value={summary.total} icon={<BarChart3 className="h-5 w-5" />} tone="indigo" />
                <SummaryCard label="Data Lengkap" value={summary.complete} icon={<UserRoundCheck className="h-5 w-5" />} tone="success" />
                <SummaryCard label="Belum Lengkap" value={summary.incomplete} icon={<UserRoundX className="h-5 w-5" />} tone="amber" />
                <SummaryCard label="Rata-rata Literasi" value={formatDiff(summary.avg_digital_literacy_diff)} icon={<ArrowUpRight className="h-5 w-5" />} tone="cyan" />
                <SummaryCard label="Rata-rata Keamanan" value={formatDiff(summary.avg_data_security_diff)} icon={<CheckCircle2 className="h-5 w-5" />} tone="violet" />
            </div>

            <Card className="mb-6">
                <CardContent className="p-5">
                    <form onSubmit={applyFilters} className="grid gap-3 xl:grid-cols-[1.35fr_1fr_1fr_0.8fr_0.9fr_auto]">
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
                        <Select value={filterForm.data.role} onChange={(value) => filterForm.setData('role', value)}>
                            <option value="">Semua peran</option>
                            <option value="student">Siswa</option>
                            <option value="teacher">Guru</option>
                        </Select>
                        <Select value={filterForm.data.status} onChange={(value) => filterForm.setData('status', value)}>
                            <option value="">Semua status</option>
                            <option value="complete">Lengkap</option>
                            <option value="incomplete">Belum lengkap</option>
                        </Select>
                        <Button type="submit">Terapkan</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1120px] text-left text-sm">
                        <thead className="border-b border-[#E8ECF3] bg-[#F8FAFC] text-xs uppercase tracking-[0.12em] text-[#667085]">
                            <tr>
                                <th className="px-5 py-4">Peserta</th>
                                <th className="px-5 py-4">Kode</th>
                                <th className="px-5 py-4">Sekolah/Kelas</th>
                                <th className="px-5 py-4">Peran</th>
                                <th className="px-5 py-4">Literasi Digital</th>
                                <th className="px-5 py-4">Keamanan Digital</th>
                                <th className="px-5 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8ECF3]">
                            {comparisons.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                                <BarChart3 className="h-6 w-6" />
                                            </div>
                                            <p className="font-bold text-[#172033]">Belum ada data perbandingan sesuai filter.</p>
                                            <p className="mt-1 text-sm text-[#667085]">Pastikan peserta memiliki data pre-test dan post-test untuk melihat selisih.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {comparisons.data.map((row) => (
                                <tr key={row.id} className="bg-white transition hover:bg-[#F8FAFC]">
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-[#172033]">{row.full_name}</p>
                                        <p className="text-xs text-[#667085]">{row.status === 'complete' ? 'Pre-test dan post-test tersedia' : 'Menunggu salah satu tes'}</p>
                                    </td>
                                    <td className="px-5 py-4 font-mono font-bold text-[#5B5FEF]">{row.participant_code}</td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-[#172033]">{row.school || '-'}</p>
                                        <p className="text-xs text-[#667085]">{row.classroom || '-'}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge>{row.role === 'student' ? 'Siswa' : 'Guru'}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <ScoreCompare pre={row.pre_digital_literacy} post={row.post_digital_literacy} diff={row.digital_literacy_diff} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <ScoreCompare pre={row.pre_data_security} post={row.post_data_security} diff={row.data_security_diff} />
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <Badge tone={row.status === 'complete' ? 'success' : 'muted'}>
                                            {row.status === 'complete' ? 'Lengkap' : 'Belum lengkap'}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination meta={comparisons} />
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

function SummaryCard({ label, value, icon, tone }: { label: string; value: ReactNode; icon: ReactNode; tone: 'indigo' | 'cyan' | 'violet' | 'success' | 'amber' }) {
    const toneClasses = {
        indigo: 'bg-[#F1F3FF] text-[#5B5FEF]',
        cyan: 'bg-[#ECFEFF] text-[#0891B2]',
        violet: 'bg-[#F5F3FF] text-[#8B7CF6]',
        success: 'bg-[#ECFDF5] text-[#10B981]',
        amber: 'bg-[#FFFBEB] text-[#F59E0B]',
    };

    return (
        <Card>
            <CardContent className="flex items-center justify-between p-5">
                <div>
                    <p className="text-sm font-semibold text-[#667085]">{label}</p>
                    <p className="mt-1 font-heading text-2xl font-bold text-[#172033]">{value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

function ScoreCompare({ pre, post, diff }: { pre?: number | string | null; post?: number | string | null; diff?: number | string | null }) {
    return (
        <div className="min-w-[210px]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <ScoreMini label="Pre" value={pre} />
                <span className="text-[#98A2B3]" aria-hidden="true">-&gt;</span>
                <ScoreMini label="Post" value={post} align="right" />
            </div>
            <div className="mt-2">
                <DiffBadge value={diff} />
            </div>
        </div>
    );
}

function ScoreMini({ label, value, align = 'left' }: { label: string; value?: number | string | null; align?: 'left' | 'right' }) {
    return (
        <div className={align === 'right' ? 'text-right' : ''}>
            <p className="text-xs font-semibold text-[#667085]">{label}</p>
            <p className="font-heading text-lg font-bold text-[#172033]">{formatScore(value)}</p>
        </div>
    );
}

function DiffBadge({ value }: { value?: number | string | null }) {
    if (value === undefined || value === null || value === '') {
        return <Badge tone="muted">Selisih belum tersedia</Badge>;
    }

    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
        return <Badge tone="muted">{value}</Badge>;
    }

    const tone = numeric > 0 ? 'success' : numeric < 0 ? 'danger' : 'muted';
    return <Badge tone={tone}>{formatDiff(numeric)}</Badge>;
}

function Badge({ children, tone = 'indigo' }: { children: ReactNode; tone?: 'indigo' | 'success' | 'muted' | 'danger' }) {
    const classes = {
        indigo: 'bg-[#F1F3FF] text-[#5B5FEF]',
        success: 'bg-[#ECFDF5] text-[#10B981]',
        muted: 'bg-[#F3F7FC] text-[#667085]',
        danger: 'bg-[#FFF1F2] text-[#F43F5E]',
    };

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${classes[tone]}`}>{children}</span>;
}

function Pagination({ meta }: { meta: Paginated<ComparisonRow> }) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex flex-col gap-3 border-t border-[#E8ECF3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#667085]">Menampilkan {meta.from || 0}-{meta.to || 0} dari {meta.total} peserta</p>
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

function formatDiff(value?: number | string | null) {
    if (value === undefined || value === null || value === '') return '-';

    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
        return `${value}%`;
    }

    const sign = numeric > 0 ? '+' : '';
    return `${sign}${numeric.toFixed(2).replace(/\.00$/, '')}%`;
}
