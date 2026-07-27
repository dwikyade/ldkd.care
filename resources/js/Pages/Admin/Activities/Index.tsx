import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { AdminGuideButton } from '@/Components/admin/AdminGuide';
import type { Activity, Paginated } from '@/types';
import { Calendar, Edit2, FileText, Plus, Trash2, Users } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
    activities: Paginated<Activity>;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ activities, flash }: Props) {
    const handleDelete = (activity: Activity) => {
        if (confirm(`Hapus kegiatan ${activity.name}?`)) {
            router.delete(route('admin.activities.destroy', activity.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Kegiatan" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Master Data</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Manajemen Kegiatan</h1>
                    <p className="mt-1 text-[#667085]">Kelola periode kegiatan edukasi, tema, dan status pengisian LDKD Care.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <AdminGuideButton module="activities" />
                    <Button asChild className="gap-2">
                        <Link href={route('admin.activities.create')}>
                            <Plus className="h-4 w-4" />
                            Tambah Kegiatan
                        </Link>
                    </Button>
                </div>
            </div>

            {flash?.success && <Alert tone="success">{flash.success}</Alert>}
            {flash?.error && <Alert tone="danger">{flash.error}</Alert>}

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left text-sm">
                        <thead className="border-b border-[#E8ECF3] bg-[#F8FAFC] text-xs uppercase tracking-[0.12em] text-[#667085]">
                            <tr>
                                <th className="px-5 py-4">Nama Kegiatan</th>
                                <th className="px-5 py-4">Tema</th>
                                <th className="px-5 py-4">Periode</th>
                                <th className="px-5 py-4 text-center">Peserta</th>
                                <th className="px-5 py-4 text-center">Status</th>
                                <th className="px-5 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8ECF3]">
                            {activities.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                                <Calendar className="h-6 w-6" />
                                            </div>
                                            <p className="font-bold text-[#172033]">Belum ada kegiatan.</p>
                                            <p className="mt-1 text-sm text-[#667085]">Tambahkan kegiatan untuk mulai mengelola pre-test dan post-test.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {activities.data.map((activity) => (
                                <tr key={activity.id} className="bg-white transition hover:bg-[#F8FAFC]">
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-[#172033]">{activity.name}</p>
                                        <p className="text-xs text-[#667085]">{activity.location || 'Lokasi belum diisi'}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex max-w-[260px] items-center gap-2 text-[#667085]">
                                            <FileText className="h-4 w-4 shrink-0 text-[#98A2B3]" />
                                            <span className="truncate">{activity.theme || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-[#667085]">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-[#98A2B3]" />
                                            <span>{formatDate(activity.start_date)} - {formatDate(activity.end_date)}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 font-bold text-[#172033]">
                                            <Users className="h-4 w-4 text-[#98A2B3]" />
                                            {activity.participants_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <Badge tone={activity.is_active ? 'success' : 'muted'}>{activity.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild variant="outline" size="sm" className="gap-2">
                                                <Link href={route('admin.activities.edit', activity.id)}>
                                                    <Edit2 className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleDelete(activity)} className="text-[#F43F5E]" title="Hati-hati: menghapus kegiatan dapat memengaruhi data yang terhubung.">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination meta={activities} />
            </Card>
        </AdminLayout>
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

function Alert({ children, tone }: { children: ReactNode; tone: 'success' | 'danger' }) {
    return (
        <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${tone === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>
            {children}
        </div>
    );
}

function Pagination({ meta }: { meta: Paginated<Activity> }) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex flex-col gap-3 border-t border-[#E8ECF3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#667085]">Menampilkan {meta.from || 0}-{meta.to || 0} dari {meta.total} kegiatan</p>
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

function formatDate(value?: string | null) {
    if (! value) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}
