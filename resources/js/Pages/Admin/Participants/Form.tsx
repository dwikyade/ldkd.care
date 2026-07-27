import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import ModernSelect from '@/Components/ui/ModernSelect';
import { AdminGuideButton } from '@/Components/admin/AdminGuide';
import { Activity, Participant, School } from '@/types';
import { ArrowLeft, Mail, Save, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import type { FormEvent, ReactNode } from 'react';

interface Props {
    participant?: Participant;
    activities: Pick<Activity, 'id' | 'name'>[];
    schools: School[];
}

export default function Form({ participant, activities, schools }: Props) {
    const isEditing = Boolean(participant);
    const form = useForm({
        activity_id: participant?.activity_id ? String(participant.activity_id) : '',
        participant_code: participant?.participant_code || '',
        full_name: participant?.full_name || '',
        email: participant?.email || '',
        role: participant?.role || 'student',
        school_id: participant?.school_id ? String(participant.school_id) : '',
        class_id: participant?.class_id ? String(participant.class_id) : '',
        gender: participant?.gender || '',
        position: participant?.position || '',
        is_active: participant?.is_active ?? true,
    });

    const selectedSchool = useMemo(
        () => schools.find((school) => String(school.id) === String(form.data.school_id)),
        [schools, form.data.school_id],
    );

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (participant) {
            form.put(route('admin.participants.update', participant.id));
        } else {
            form.post(route('admin.participants.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Edit Peserta' : 'Tambah Peserta'} />

            <div className="mb-8">
                <Link href={route('admin.participants.index')} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#5B5FEF]">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Peserta
                </Link>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Master Data</p>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">
                    {isEditing ? 'Edit Peserta' : 'Tambah Peserta'}
                </h1>
                <p className="mt-1 text-[#667085]">Kode peserta dapat diisi manual atau dikosongkan untuk dibuat otomatis.</p>
                <div className="mt-4">
                    <AdminGuideButton module="participantForm" />
                </div>
            </div>

            <form onSubmit={submit} className="max-w-4xl">
                <Card>
                    <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                        <Field label="Kegiatan" error={form.errors.activity_id}>
                            <ModernSelect value={form.data.activity_id} onChange={(value) => form.setData('activity_id', value)} className={inputClass}>
                                <option value="">Pilih kegiatan</option>
                                {activities.map((activity) => (
                                    <option key={activity.id} value={activity.id}>{activity.name}</option>
                                ))}
                            </ModernSelect>
                        </Field>

                        <Field label="Kode Peserta" error={form.errors.participant_code} hint={!isEditing ? 'Kosongkan untuk generate otomatis.' : undefined}>
                            <div className="relative">
                                <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                                <input
                                    value={form.data.participant_code}
                                    onChange={(event) => form.setData('participant_code', event.target.value.toUpperCase())}
                                    className={`${inputClass} pl-10 font-mono uppercase tracking-wide`}
                                    placeholder="LDKD-A7K92"
                                />
                            </div>
                        </Field>

                        <Field label="Nama Lengkap" error={form.errors.full_name}>
                            <input value={form.data.full_name} onChange={(event) => form.setData('full_name', event.target.value)} className={inputClass} placeholder="Nama peserta" />
                        </Field>

                        <Field label="Email Sertifikat" error={form.errors.email} hint="Opsional untuk data admin, tetapi wajib diisi peserta saat membuat kode dari halaman responden.">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                                <input
                                    type="email"
                                    value={form.data.email || ''}
                                    onChange={(event) => form.setData('email', event.target.value.toLowerCase())}
                                    className={`${inputClass} pl-10`}
                                    placeholder="nama@email.com"
                                    autoComplete="email"
                                />
                            </div>
                        </Field>

                        <Field label="Peran" error={form.errors.role}>
                            <ModernSelect value={form.data.role} onChange={(value) => form.setData('role', value as 'student' | 'teacher')} className={inputClass}>
                                <option value="student">Siswa</option>
                                <option value="teacher">Guru</option>
                            </ModernSelect>
                        </Field>

                        <Field label="Sekolah" error={form.errors.school_id}>
                            <ModernSelect
                                value={form.data.school_id}
                                onChange={(value) => {
                                    form.setData('school_id', value);
                                    form.setData('class_id', '');
                                }}
                                className={inputClass}
                            >
                                <option value="">Pilih sekolah</option>
                                {schools.map((school) => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </ModernSelect>
                        </Field>

                        <Field label="Kelas" error={form.errors.class_id}>
                            <ModernSelect value={form.data.class_id || ''} onChange={(value) => form.setData('class_id', value)} className={inputClass}>
                                <option value="">Tidak ada / Guru</option>
                                {selectedSchool?.classes?.map((classroom) => (
                                    <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
                                ))}
                            </ModernSelect>
                        </Field>

                        <Field label="Jenis Kelamin" error={form.errors.gender}>
                            <ModernSelect value={form.data.gender || ''} onChange={(value) => form.setData('gender', value)} className={inputClass}>
                                <option value="">Opsional</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </ModernSelect>
                        </Field>

                        <Field label="Jabatan / Posisi" error={form.errors.position}>
                            <input value={form.data.position || ''} onChange={(event) => form.setData('position', event.target.value)} className={inputClass} placeholder="Opsional untuk guru" />
                        </Field>

                        <label className="flex items-start gap-3 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4 md:col-span-2">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(event) => form.setData('is_active', event.target.checked)}
                                className="mt-1 h-5 w-5 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                            />
                            <span>
                                <span className="block font-bold text-[#172033]">Peserta aktif</span>
                                <span className="text-sm text-[#667085]">Peserta aktif dapat menggunakan kode untuk mengisi kuesioner.</span>
                            </span>
                        </label>
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end gap-3">
                    <Link href={route('admin.participants.index')}>
                        <Button type="button" variant="outline">Batal</Button>
                    </Link>
                    <Button type="submit" disabled={form.processing} className="gap-2">
                        <Save className="h-4 w-4" />
                        {form.processing ? 'Menyimpan...' : 'Simpan Peserta'}
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
