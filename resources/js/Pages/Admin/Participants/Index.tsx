import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import ModernSelect from '@/Components/ui/ModernSelect';
import { AdminGuideButton } from '@/Components/admin/AdminGuide';
import { Activity, Paginated, Participant, School } from '@/types';
import { FileUp, Plus, Search, Trash2, UserRoundPen } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

interface Props {
    participants: Paginated<Participant>;
    filters: {
        search?: string;
        activity_id?: string;
        school_id?: string;
        role?: string;
    };
    activities: Pick<Activity, 'id' | 'name'>[];
    schools: Pick<School, 'id' | 'name'>[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Index({ participants, filters, activities, schools, flash }: Props) {
    const filterForm = useForm({
        search: filters.search || '',
        activity_id: filters.activity_id || '',
        school_id: filters.school_id || '',
        role: filters.role || '',
    });

    const importForm = useForm<{
        activity_id: string;
        school_id: string;
        file: File | null;
    }>({
        activity_id: filters.activity_id || '',
        school_id: filters.school_id || '',
        file: null,
    });

    const applyFilters = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('admin.participants.index'), filterForm.data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const importParticipants = (event: FormEvent) => {
        event.preventDefault();
        importForm.post(route('admin.participants.import'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const deleteParticipant = (participant: Participant) => {
        if (confirm(`Hapus peserta ${participant.full_name}?`)) {
            router.delete(route('admin.participants.destroy', participant.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Peserta" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Master Data</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Manajemen Peserta</h1>
                    <p className="mt-1 text-[#667085]">Kelola kode peserta, peran, sekolah, kelas, dan status pengisian.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <AdminGuideButton module="participants" />
                    <Link href={route('admin.participants.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Peserta
                        </Button>
                    </Link>
                </div>
            </div>

            {flash?.success && <Alert tone="success">{flash.success}</Alert>}
            {flash?.error && <Alert tone="danger">{flash.error}</Alert>}

            <Card className="mb-6">
                <CardContent className="p-5">
                    <form onSubmit={applyFilters} className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr_auto]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                            <input
                                value={filterForm.data.search}
                                onChange={(event) => filterForm.setData('search', event.target.value)}
                                className="h-11 w-full rounded-xl border border-[#E8ECF3] bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]"
                                placeholder="Cari nama, email, atau kode peserta"
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
                        <Button type="submit">Terapkan</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="p-5">
                    <form onSubmit={importParticipants} className="grid gap-3 lg:grid-cols-[1fr_1fr_1.4fr_auto]">
                        <Select value={importForm.data.activity_id} onChange={(value) => importForm.setData('activity_id', value)}>
                            <option value="">Kegiatan import</option>
                            {activities.map((activity) => (
                                <option key={activity.id} value={activity.id}>{activity.name}</option>
                            ))}
                        </Select>
                        <Select value={importForm.data.school_id} onChange={(value) => importForm.setData('school_id', value)}>
                            <option value="">Sekolah import</option>
                            {schools.map((school) => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </Select>
                        <input
                            type="file"
                            accept=".csv,text/csv"
                            onChange={(event) => importForm.setData('file', event.target.files?.[0] || null)}
                            className="h-11 rounded-xl border border-[#E8ECF3] bg-white px-3 py-2 text-sm text-[#667085] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F1F3FF] file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-[#5B5FEF]"
                        />
                        <Button type="submit" variant="outline" disabled={importForm.processing} className="gap-2">
                            <FileUp className="h-4 w-4" />
                            Import CSV
                        </Button>
                    </form>
                    <p className="mt-3 text-xs text-[#667085]">Format kolom: full_name/nama, email/surel opsional, role/peran, class/kelas, participant_code/kode opsional.</p>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left text-sm">
                        <thead className="border-b border-[#E8ECF3] bg-[#F8FAFC] text-xs uppercase tracking-[0.12em] text-[#667085]">
                            <tr>
                                <th className="px-5 py-4">Peserta</th>
                                <th className="px-5 py-4">Kode</th>
                                <th className="px-5 py-4">Kegiatan</th>
                                <th className="px-5 py-4">Sekolah/Kelas</th>
                                <th className="px-5 py-4">Peran</th>
                                <th className="px-5 py-4 text-center">Submission</th>
                                <th className="px-5 py-4 text-center">Status</th>
                                <th className="px-5 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8ECF3]">
                            {participants.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-[#667085]">Belum ada peserta sesuai filter.</td>
                                </tr>
                            )}
                            {participants.data.map((participant) => (
                                <tr key={participant.id} className="bg-white transition hover:bg-[#F8FAFC]">
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-[#172033]">{participant.full_name}</p>
                                        <p className="text-xs text-[#667085]">{participant.email || 'Email belum diisi'}</p>
                                    </td>
                                    <td className="px-5 py-4 font-mono font-bold text-[#5B5FEF]">{participant.participant_code}</td>
                                    <td className="px-5 py-4 text-[#667085]">{participant.activity?.name || '-'}</td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-[#172033]">{participant.school?.name || '-'}</p>
                                        <p className="text-xs text-[#667085]">{participant.classroom?.name || '-'}</p>
                                    </td>
                                    <td className="px-5 py-4"><Badge>{participant.role === 'student' ? 'Siswa' : 'Guru'}</Badge></td>
                                    <td className="px-5 py-4 text-center font-bold text-[#172033]">{participant.submissions_count || 0}</td>
                                    <td className="px-5 py-4 text-center">
                                        <Badge tone={participant.is_active ? 'success' : 'muted'}>{participant.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('admin.participants.edit', participant.id)}>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <UserRoundPen className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button type="button" variant="outline" size="sm" onClick={() => deleteParticipant(participant)} className="gap-2 text-[#F43F5E]" title="Hati-hati: menghapus peserta dapat memutus hubungan ke hasil dan perbandingan.">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination meta={participants} />
            </Card>
        </AdminLayout>
    );
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
    return (
        <ModernSelect
            value={value}
            onChange={onChange}
            className="h-11 rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]"
        >
            {children}
        </ModernSelect>
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

function Pagination({ meta }: { meta: Paginated<Participant> }) {
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
