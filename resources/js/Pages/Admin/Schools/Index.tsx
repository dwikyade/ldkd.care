import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import type { Paginated, School } from '@/types';
import { Edit2, Layers3, MapPin, Plus, School as SchoolIcon, Trash2, Users } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
    schools: Paginated<School>;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ schools, flash }: Props) {
    const handleDelete = (school: School) => {
        if (confirm(`Hapus sekolah ${school.name}?`)) {
            router.delete(route('admin.schools.destroy', school.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Sekolah" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Master Data</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Sekolah dan Kelas</h1>
                    <p className="mt-1 text-[#667085]">Kelola institusi peserta dan hubungkan data siswa atau guru ke sekolah yang tepat.</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href={route('admin.schools.create')}>
                        <Plus className="h-4 w-4" />
                        Tambah Sekolah
                    </Link>
                </Button>
            </div>

            {flash?.success && <Alert tone="success">{flash.success}</Alert>}
            {flash?.error && <Alert tone="danger">{flash.error}</Alert>}

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[880px] text-left text-sm">
                        <thead className="border-b border-[#E8ECF3] bg-[#F8FAFC] text-xs uppercase tracking-[0.12em] text-[#667085]">
                            <tr>
                                <th className="px-5 py-4">Nama Institusi / Sekolah</th>
                                <th className="px-5 py-4">Alamat / Lokasi</th>
                                <th className="px-5 py-4 text-center">Kelas</th>
                                <th className="px-5 py-4 text-center">Peserta</th>
                                <th className="px-5 py-4 text-center">Status</th>
                                <th className="px-5 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8ECF3]">
                            {schools.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                                <SchoolIcon className="h-6 w-6" />
                                            </div>
                                            <p className="font-bold text-[#172033]">Belum ada sekolah.</p>
                                            <p className="mt-1 text-sm text-[#667085]">Tambahkan sekolah agar peserta bisa dikelompokkan dengan rapi.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {schools.data.map((school) => (
                                <tr key={school.id} className="bg-white transition hover:bg-[#F8FAFC]">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                                <SchoolIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#172033]">{school.name}</p>
                                                <p className="text-xs text-[#667085]">Institusi peserta</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-[#667085]">
                                        <div className="flex max-w-[340px] items-center gap-2">
                                            <MapPin className="h-4 w-4 shrink-0 text-[#98A2B3]" />
                                            <span className="truncate">{school.address || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 font-bold text-[#172033]">
                                            <Layers3 className="h-4 w-4 text-[#98A2B3]" />
                                            {school.classes_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 font-bold text-[#172033]">
                                            <Users className="h-4 w-4 text-[#98A2B3]" />
                                            {school.participants_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <Badge tone={school.is_active ? 'success' : 'muted'}>{school.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild variant="outline" size="sm" className="gap-2">
                                                <Link href={route('admin.schools.edit', school.id)}>
                                                    <Edit2 className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleDelete(school)} className="text-[#F43F5E]">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination meta={schools} />
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

function Pagination({ meta }: { meta: Paginated<School> }) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex flex-col gap-3 border-t border-[#E8ECF3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#667085]">Menampilkan {meta.from || 0}-{meta.to || 0} dari {meta.total} sekolah</p>
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
