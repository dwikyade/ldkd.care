import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import type { Activity, School } from '@/types';
import { BarChart3, ClipboardList, Download, FileSpreadsheet, Users } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
    activities: Pick<Activity, 'id' | 'name'>[];
    schools: Pick<School, 'id' | 'name'>[];
    summary: {
        participants: number;
        submissions: number;
        pre_tests: number;
        post_tests: number;
    };
}

export default function Index({ activities, schools, summary }: Props) {
    const form = useForm({
        search: '',
        activity_id: '',
        school_id: '',
        role: '',
        test_type: '',
        status: '',
    });

    const participantFilters = {
        search: form.data.search,
        activity_id: form.data.activity_id,
        school_id: form.data.school_id,
        role: form.data.role,
    };

    const resultFilters = {
        search: form.data.search,
        activity_id: form.data.activity_id,
        school_id: form.data.school_id,
        test_type: form.data.test_type,
    };

    const comparisonFilters = {
        search: form.data.search,
        activity_id: form.data.activity_id,
        school_id: form.data.school_id,
        role: form.data.role,
        status: form.data.status,
    };

    return (
        <AdminLayout>
            <Head title="Export Data" />

            <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Laporan</p>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Export Data</h1>
                <p className="mt-1 text-[#667085]">Pilih filter lalu unduh data peserta, hasil kuesioner, atau perbandingan pre-test dan post-test.</p>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-4">
                <SummaryCard label="Peserta" value={summary.participants} icon={<Users className="h-5 w-5" />} />
                <SummaryCard label="Submission" value={summary.submissions} icon={<ClipboardList className="h-5 w-5" />} />
                <SummaryCard label="Pre-Test" value={summary.pre_tests} icon={<FileSpreadsheet className="h-5 w-5" />} />
                <SummaryCard label="Post-Test" value={summary.post_tests} icon={<BarChart3 className="h-5 w-5" />} />
            </div>

            <Card className="mb-6">
                <CardContent className="grid gap-3 p-5 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_0.9fr]">
                    <input
                        value={form.data.search}
                        onChange={(event) => form.setData('search', event.target.value)}
                        className={inputClass}
                        placeholder="Cari nama atau kode peserta"
                    />
                    <Select value={form.data.activity_id} onChange={(value) => form.setData('activity_id', value)}>
                        <option value="">Semua kegiatan</option>
                        {activities.map((activity) => (
                            <option key={activity.id} value={activity.id}>{activity.name}</option>
                        ))}
                    </Select>
                    <Select value={form.data.school_id} onChange={(value) => form.setData('school_id', value)}>
                        <option value="">Semua sekolah</option>
                        {schools.map((school) => (
                            <option key={school.id} value={school.id}>{school.name}</option>
                        ))}
                    </Select>
                    <Select value={form.data.role} onChange={(value) => form.setData('role', value)}>
                        <option value="">Semua peran</option>
                        <option value="student">Siswa</option>
                        <option value="teacher">Guru</option>
                    </Select>
                    <Select value={form.data.test_type} onChange={(value) => form.setData('test_type', value)}>
                        <option value="">Semua tes</option>
                        <option value="pre_test">Pre-Test</option>
                        <option value="post_test">Post-Test</option>
                    </Select>
                    <Select value={form.data.status} onChange={(value) => form.setData('status', value)}>
                        <option value="">Status perbandingan</option>
                        <option value="complete">Lengkap</option>
                        <option value="incomplete">Belum lengkap</option>
                    </Select>
                </CardContent>
            </Card>

            <div className="grid gap-5 lg:grid-cols-3">
                <ExportCard
                    title="Data Peserta"
                    description="Berisi kode, nama, peran, sekolah, kelas, kegiatan, status, dan jumlah submission."
                    icon={<Users className="h-6 w-6" />}
                    href={route('admin.export.participants', participantFilters)}
                />
                <ExportCard
                    title="Hasil Kuesioner"
                    description="Berisi skor literasi digital, keamanan digital, kategori, jenis tes, dan waktu pengisian."
                    icon={<ClipboardList className="h-6 w-6" />}
                    href={route('admin.results.export', resultFilters)}
                    highlighted
                />
                <ExportCard
                    title="Perbandingan"
                    description="Berisi nilai pre-test, post-test, selisih skor, dan status kelengkapan setiap peserta."
                    icon={<BarChart3 className="h-6 w-6" />}
                    href={route('admin.comparisons.export', comparisonFilters)}
                />
            </div>
        </AdminLayout>
    );
}

const inputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
    return (
        <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
            {children}
        </select>
    );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between p-5">
                <div>
                    <p className="text-sm font-semibold text-[#667085]">{label}</p>
                    <p className="mt-1 font-heading text-3xl font-bold text-[#172033]">{value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">{icon}</div>
            </CardContent>
        </Card>
    );
}

function ExportCard({ title, description, icon, href, highlighted = false }: { title: string; description: string; icon: ReactNode; href: string; highlighted?: boolean }) {
    return (
        <Card className={highlighted ? 'border-[#5B5FEF] ring-4 ring-[#F1F3FF]' : ''}>
            <CardContent className="flex h-full flex-col p-6">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">{icon}</div>
                <h2 className="font-heading text-xl font-bold text-[#172033]">{title}</h2>
                <p className="mt-3 flex-1 leading-7 text-[#667085]">{description}</p>
                <Button asChild className="mt-6 gap-2">
                    <a href={href}>
                        <Download className="h-4 w-4" />
                        Unduh CSV
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
}
