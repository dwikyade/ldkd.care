import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Activity } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
    activity?: Activity;
}

export default function Form({ activity }: Props) {
    const isEditing = !!activity;
    
    // Format dates for input type="date"
    const formatDateForInput = (dateString?: string) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toISOString().split('T')[0];
    };

    const { data, setData, post, put, processing, errors } = useForm({
        name: activity?.name || '',
        start_date: formatDateForInput(activity?.start_date) || '',
        end_date: formatDateForInput(activity?.end_date) || '',
        theme: activity?.theme || '',
        is_active: activity?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('admin.activities.update', activity.id));
        } else {
            post(route('admin.activities.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? "Edit Kegiatan" : "Tambah Kegiatan"} />

            <div className="mb-8">
                <Link href={route('admin.activities.index')} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali ke Daftar
                </Link>
                <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    {isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Silakan isi formulir di bawah ini dengan lengkap.</p>
            </div>

            <div className="max-w-2xl">
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Nama Kegiatan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white ${
                                        errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                    }`}
                                    placeholder="Contoh: Sosialisasi Literasi Digital 2024"
                                />
                                {errors.name && <p className="text-sm text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tanggal Mulai <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white ${
                                            errors.start_date ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.start_date && <p className="text-sm text-rose-500">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tanggal Selesai <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white ${
                                            errors.end_date ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.end_date && <p className="text-sm text-rose-500">{errors.end_date}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Tema / Deskripsi Singkat
                                </label>
                                <textarea
                                    value={data.theme || ''}
                                    onChange={e => setData('theme', e.target.value)}
                                    rows={3}
                                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white ${
                                        errors.theme ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                    }`}
                                    placeholder="Opsional. Deskripsi singkat tentang kegiatan ini yang akan muncul di halaman awal peserta."
                                />
                                {errors.theme && <p className="text-sm text-rose-500">{errors.theme}</p>}
                            </div>

                            <div className="flex items-center gap-3 py-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center h-5">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="is_active" className="font-medium text-slate-700 dark:text-slate-300">
                                        Status Aktif
                                    </label>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Hanya kegiatan aktif yang akan muncul di halaman pendaftaran peserta.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Link href={route('admin.activities.index')}>
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                                <Button type="submit" className="gap-2" disabled={processing}>
                                    <Save className="w-4 h-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
