import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { AdminGuideButton } from '@/Components/admin/AdminGuide';
import type { Activity } from '@/types';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

interface Props {
    activity?: Activity;
}

interface ActivityFormData {
    name: string;
    start_date: string;
    end_date: string;
    theme: string;
    is_active: boolean;
}

export default function Form({ activity }: Props) {
    const isEditing = Boolean(activity);

    const form = useForm<ActivityFormData>({
        name: activity?.name || '',
        start_date: formatDateForInput(activity?.start_date),
        end_date: formatDateForInput(activity?.end_date),
        theme: activity?.theme || '',
        is_active: activity?.is_active ?? true,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (activity) {
            form.put(route('admin.activities.update', activity.id));
        } else {
            form.post(route('admin.activities.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan'} />

            <div className="mb-8">
                <Link href={route('admin.activities.index')} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#5B5FEF]">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Kegiatan
                </Link>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Master Data</p>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">
                    {isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
                </h1>
                <p className="mt-1 text-[#667085]">Atur periode kegiatan yang akan digunakan untuk peserta dan hasil kuesioner.</p>
                <div className="mt-4">
                    <AdminGuideButton module="activityForm" />
                </div>
            </div>

            <form onSubmit={submit} className="max-w-3xl">
                <Card>
                    <CardContent className="space-y-6 p-6 md:p-8">
                        <div className="flex items-center gap-3 border-b border-[#E8ECF3] pb-5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-heading text-xl font-bold text-[#172033]">Informasi Kegiatan</h2>
                                <p className="text-sm text-[#667085]">Nama dan tanggal ini menjadi konteks utama data pengisian.</p>
                            </div>
                        </div>

                        <Field label="Nama Kegiatan" error={form.errors.name}>
                            <input
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                className={inputClass}
                                placeholder="Contoh: Edukasi Literasi Digital Semester Ganjil"
                                autoFocus
                            />
                        </Field>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Tanggal Mulai" error={form.errors.start_date}>
                                <input
                                    type="date"
                                    value={form.data.start_date}
                                    onChange={(event) => form.setData('start_date', event.target.value)}
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Tanggal Selesai" error={form.errors.end_date}>
                                <input
                                    type="date"
                                    value={form.data.end_date}
                                    onChange={(event) => form.setData('end_date', event.target.value)}
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        <Field label="Tema / Deskripsi Singkat" error={form.errors.theme} hint="Opsional, digunakan sebagai catatan konteks kegiatan.">
                            <textarea
                                value={form.data.theme}
                                onChange={(event) => form.setData('theme', event.target.value)}
                                rows={4}
                                className={`${inputClass} h-auto py-3`}
                                placeholder="Contoh: Penguatan keamanan akun, OTP, dan verifikasi informasi digital."
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
                                <span className="block font-bold text-[#172033]">Kegiatan aktif</span>
                                <span className="text-sm text-[#667085]">Kegiatan aktif dapat dipilih untuk peserta dan pengisian baru.</span>
                            </span>
                        </label>
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end gap-3">
                    <Button asChild variant="outline">
                        <Link href={route('admin.activities.index')}>Batal</Link>
                    </Button>
                    <Button type="submit" disabled={form.processing} className="gap-2">
                        <Save className="h-4 w-4" />
                        {form.processing ? 'Menyimpan...' : 'Simpan Kegiatan'}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}

const inputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-[#172033]">{label}</label>
            {children}
            {hint && <p className="text-xs text-[#667085]">{hint}</p>}
            {error && <p className="text-sm font-semibold text-[#F43F5E]">{error}</p>}
        </div>
    );
}

function formatDateForInput(value?: string | null) {
    if (! value) return '';

    return value.slice(0, 10);
}
