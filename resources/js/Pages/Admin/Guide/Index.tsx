import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { AdminGuideButton, adminGuides, type AdminGuideKey } from '@/Components/admin/AdminGuide';
import { BookOpen, CheckCircle2, Compass, FileQuestion, ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';

const moduleOrder: AdminGuideKey[] = [
    'dashboard',
    'activities',
    'schools',
    'participants',
    'questions',
    'scoring',
    'results',
    'comparisons',
    'export',
    'audit',
];

const quickFlow = [
    'Buat kegiatan aktif.',
    'Siapkan sekolah dan kelas.',
    'Cek peserta dan kode peserta.',
    'Pastikan instrumen soal, pilar, skala, dan kategori sudah benar.',
    'Pantau hasil completed dan perbandingan Pre-Test/Post-Test.',
    'Export laporan hanya setelah data sudah diverifikasi.',
];

export default function Index() {
    return (
        <AdminLayout>
            <Head title="Panduan Admin" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Help Center</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Panduan Admin LDKD Care</h1>
                    <p className="mt-1 max-w-3xl text-[#667085]">
                        Pusat bantuan untuk memahami urutan kerja, istilah penting, dampak perubahan, dan hubungan antarmodul dashboard admin.
                    </p>
                </div>
                <AdminGuideButton module="helpCenter" />
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <Card className="border-[#D9DDFF] bg-[#F9FAFF]">
                    <CardContent className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                            <Compass className="h-6 w-6" />
                        </div>
                        <h2 className="font-heading text-xl font-bold text-[#172033]">Urutan Kerja Utama</h2>
                        <ol className="mt-5 space-y-3">
                            {quickFlow.map((item, index) => (
                                <li key={item} className="flex gap-3 text-sm leading-6 text-[#667085]">
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#5B5FEF]">
                                        {index + 1}
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
                        <Summary icon={<CheckCircle2 className="h-5 w-5" />} title="Data valid" text="Gunakan completed untuk laporan akhir." />
                        <Summary icon={<FileQuestion className="h-5 w-5" />} title="Instrumen aman" text="Gunakan versi dan snapshot agar hasil lama tidak rusak." />
                        <Summary icon={<ShieldAlert className="h-5 w-5" />} title="Aksi berisiko" text="Cek ulang sebelum hapus, ubah kode, atau ubah scoring." />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {moduleOrder.map((key) => {
                    const guide = adminGuides[key];

                    return (
                        <Card key={key} className="h-full">
                            <CardContent className="flex h-full flex-col p-6">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5B5FEF]">{guide.eyebrow}</p>
                                <h2 className="mt-2 font-heading text-xl font-bold text-[#172033]">{guide.title}</h2>
                                <p className="mt-3 flex-1 text-sm leading-6 text-[#667085]">{guide.intro}</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    <AdminGuideButton module={key} label="Buka Panduan" autoWalkthrough={false} />
                                    {guide.related?.[0] && (
                                        <Link
                                            href={guide.related[0].href}
                                            className="inline-flex h-10 items-center rounded-xl border border-[#E8ECF3] px-3 text-sm font-bold text-[#667085] transition hover:border-[#D9DDFF] hover:text-[#5B5FEF]"
                                        >
                                            Ke Modul
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </AdminLayout>
    );
}

function Summary({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
    return (
        <div className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#5B5FEF]">{icon}</div>
            <p className="font-bold text-[#172033]">{title}</p>
            <p className="mt-1 text-sm leading-6 text-[#667085]">{text}</p>
        </div>
    );
}
