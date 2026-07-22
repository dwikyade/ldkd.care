import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { School } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
    school?: School;
}

export default function Form({ school }: Props) {
    const isEditing = !!school;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: school?.name || '',
        address: school?.address || '',
        is_active: school?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('admin.schools.update', school.id));
        } else {
            post(route('admin.schools.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? "Edit Sekolah" : "Tambah Sekolah"} />

            <div className="mb-8">
                <Link href={route('admin.schools.index')} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali ke Daftar
                </Link>
                <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    {isEditing ? 'Edit Data Sekolah' : 'Tambah Sekolah Baru'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Silakan isi formulir di bawah ini dengan lengkap.</p>
            </div>

            <div className="max-w-2xl">
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Nama Institusi / Sekolah <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white ${
                                        errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                    }`}
                                    placeholder="Contoh: SMAN 1 Jakarta"
                                    autoFocus
                                />
                                {errors.name && <p className="text-sm text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Alamat / Lokasi
                                </label>
                                <textarea
                                    value={data.address || ''}
                                    onChange={e => setData('address', e.target.value)}
                                    rows={3}
                                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:outline-none bg-white dark:bg-slate-900 dark:text-white ${
                                        errors.address ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                    }`}
                                    placeholder="Contoh: Jl. Pendidikan No. 1, Jakarta"
                                />
                                {errors.address && <p className="text-sm text-rose-500">{errors.address}</p>}
                            </div>

                            <div className="flex items-center gap-3 py-2 border-t border-slate-100 dark:border-slate-800">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                                />
                                <label htmlFor="is_active" className="font-medium text-slate-700 dark:text-slate-300">
                                    Sekolah Aktif
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <Link href={route('admin.schools.index')}>
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
