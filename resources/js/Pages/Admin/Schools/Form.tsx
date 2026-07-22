import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import type { Classroom, School } from '@/types';
import { ArrowLeft, Plus, Save, School as SchoolIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

interface Props {
    school?: School;
    flash?: {
        success?: string;
        error?: string;
    };
}

interface SchoolFormData {
    name: string;
    address: string;
    is_active: boolean;
}

export default function Form({ school, flash }: Props) {
    const isEditing = Boolean(school);
    const [classDrafts, setClassDrafts] = useState<Record<number, { name: string; is_active: boolean }>>({});

    const form = useForm<SchoolFormData>({
        name: school?.name || '',
        address: school?.address || '',
        is_active: school?.is_active ?? true,
    });

    const classForm = useForm({
        name: '',
        is_active: true,
    });

    useEffect(() => {
        const drafts: Record<number, { name: string; is_active: boolean }> = {};
        school?.classes?.forEach((classroom) => {
            drafts[classroom.id] = {
                name: classroom.name,
                is_active: classroom.is_active ?? true,
            };
        });
        setClassDrafts(drafts);
    }, [school?.classes]);

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (school) {
            form.put(route('admin.schools.update', school.id));
        } else {
            form.post(route('admin.schools.store'));
        }
    };

    const submitClass = (event: FormEvent) => {
        event.preventDefault();
        if (!school) return;

        classForm.post(route('admin.schools.classes.store', school.id), {
            preserveScroll: true,
            onSuccess: () => classForm.reset(),
        });
    };

    const updateClassDraft = (classroom: Classroom, field: 'name' | 'is_active', value: string | boolean) => {
        setClassDrafts((current) => ({
            ...current,
            [classroom.id]: {
                name: current[classroom.id]?.name ?? classroom.name,
                is_active: current[classroom.id]?.is_active ?? classroom.is_active ?? true,
                [field]: value,
            },
        }));
    };

    const updateClassroom = (classroom: Classroom) => {
        if (!school) return;

        router.put(route('admin.schools.classes.update', [school.id, classroom.id]), classDrafts[classroom.id], {
            preserveScroll: true,
        });
    };

    const deleteClassroom = (classroom: Classroom) => {
        if (!school || !confirm(`Hapus kelas ${classroom.name}?`)) return;

        router.delete(route('admin.schools.classes.destroy', [school.id, classroom.id]), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Edit Sekolah' : 'Tambah Sekolah'} />

            <div className="mb-8">
                <Link href={route('admin.schools.index')} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#667085] hover:text-[#5B5FEF]">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Sekolah
                </Link>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Master Data</p>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">
                    {isEditing ? 'Edit Sekolah' : 'Tambah Sekolah'}
                </h1>
                <p className="mt-1 text-[#667085]">Data sekolah digunakan untuk mengelompokkan peserta, kelas, dan hasil evaluasi.</p>
            </div>

            {flash?.success && <Alert tone="success">{flash.success}</Alert>}
            {flash?.error && <Alert tone="danger">{flash.error}</Alert>}

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <form onSubmit={submit}>
                    <Card>
                        <CardContent className="space-y-6 p-6 md:p-8">
                            <div className="flex items-center gap-3 border-b border-[#E8ECF3] pb-5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                    <SchoolIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-heading text-xl font-bold text-[#172033]">Informasi Sekolah</h2>
                                    <p className="text-sm text-[#667085]">Pastikan nama institusi mudah dikenali oleh admin saat filter data.</p>
                                </div>
                            </div>

                            <Field label="Nama Institusi / Sekolah" error={form.errors.name}>
                                <input
                                    value={form.data.name}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    className={inputClass}
                                    placeholder="Contoh: SMAN 1 Jakarta"
                                    autoFocus
                                />
                            </Field>

                            <Field label="Alamat / Lokasi" error={form.errors.address} hint="Opsional, cukup isi alamat ringkas atau area sekolah.">
                                <textarea
                                    value={form.data.address}
                                    onChange={(event) => form.setData('address', event.target.value)}
                                    rows={4}
                                    className={`${inputClass} h-auto py-3`}
                                    placeholder="Contoh: Jl. Pendidikan No. 1, Jakarta"
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
                                    <span className="block font-bold text-[#172033]">Sekolah aktif</span>
                                    <span className="text-sm text-[#667085]">Sekolah aktif dapat dipakai saat membuat atau mengimpor peserta.</span>
                                </span>
                            </label>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href={route('admin.schools.index')}>Batal</Link>
                        </Button>
                        <Button type="submit" disabled={form.processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {form.processing ? 'Menyimpan...' : 'Simpan Sekolah'}
                        </Button>
                    </div>
                </form>

                <Card className={!school ? 'opacity-70' : ''}>
                    <CardContent className="space-y-6 p-6 md:p-8">
                        <div className="border-b border-[#E8ECF3] pb-5">
                            <h2 className="font-heading text-xl font-bold text-[#172033]">Kelas</h2>
                            <p className="mt-1 text-sm text-[#667085]">
                                {school ? 'Kelola kelas yang terhubung dengan sekolah ini.' : 'Simpan sekolah terlebih dahulu untuk menambahkan kelas.'}
                            </p>
                        </div>

                        {school && (
                            <>
                                <form onSubmit={submitClass} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                                    <input
                                        value={classForm.data.name}
                                        onChange={(event) => classForm.setData('name', event.target.value)}
                                        className={inputClass}
                                        placeholder="Contoh: XI RPL 1"
                                        required
                                    />
                                    <label className="flex h-11 items-center gap-2 rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm font-bold text-[#667085]">
                                        <input
                                            type="checkbox"
                                            checked={classForm.data.is_active}
                                            onChange={(event) => classForm.setData('is_active', event.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                                        />
                                        Aktif
                                    </label>
                                    <Button type="submit" disabled={classForm.processing} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Tambah
                                    </Button>
                                </form>

                                {classForm.errors.name && <p className="text-sm font-semibold text-[#F43F5E]">{classForm.errors.name}</p>}

                                <div className="space-y-3">
                                    {school.classes?.length === 0 && (
                                        <div className="rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-6 text-center text-sm text-[#667085]">
                                            Belum ada kelas pada sekolah ini.
                                        </div>
                                    )}

                                    {school.classes?.map((classroom) => {
                                        const draft = classDrafts[classroom.id] || {
                                            name: classroom.name,
                                            is_active: classroom.is_active ?? true,
                                        };

                                        return (
                                            <div key={classroom.id} className="grid gap-3 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] p-4 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
                                                <input
                                                    value={draft.name}
                                                    onChange={(event) => updateClassDraft(classroom, 'name', event.target.value)}
                                                    className={inputClass}
                                                />
                                                <label className="flex h-11 items-center gap-2 rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm font-bold text-[#667085]">
                                                    <input
                                                        type="checkbox"
                                                        checked={draft.is_active}
                                                        onChange={(event) => updateClassDraft(classroom, 'is_active', event.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                                                    />
                                                    Aktif
                                                </label>
                                                <span className="rounded-full bg-white px-3 py-2 text-center text-xs font-bold text-[#667085]">
                                                    {classroom.participants_count || 0} peserta
                                                </span>
                                                <div className="flex justify-end gap-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={() => updateClassroom(classroom)}>
                                                        Simpan
                                                    </Button>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => deleteClassroom(classroom)} className="text-[#F43F5E]">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
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

function Alert({ children, tone }: { children: ReactNode; tone: 'success' | 'danger' }) {
    return (
        <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${tone === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>
            {children}
        </div>
    );
}
