import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Plus, Edit2, Trash2, MapPin, Users, School as SchoolIcon } from 'lucide-react';
import { School } from '@/types';

interface Props {
    schools: {
        data: School[];
        current_page: number;
        last_page: number;
        total: number;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

export default function Index({ schools, flash }: Props) {
    
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data sekolah ini?')) {
            router.delete(route('admin.schools.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Sekolah" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Manajemen Sekolah</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola daftar sekolah / institusi peserta.</p>
                </div>
                <Link href={route('admin.schools.create')}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Sekolah
                    </Button>
                </Link>
            </div>

            {flash.success && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    {flash.success}
                </div>
            )}
            
            {flash.error && (
                <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg">
                    {flash.error}
                </div>
            )}

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nama Institusi / Sekolah</th>
                                <th className="px-6 py-4 font-semibold">Alamat / Lokasi</th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-center">Jml Peserta</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            {schools.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        Belum ada data sekolah.
                                    </td>
                                </tr>
                            ) : (
                                schools.data.map((school) => (
                                    <tr key={school.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    <SchoolIcon className="w-4 h-4" />
                                                </div>
                                                {school.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                            {school.address || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            school.is_active
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                        }`}>
                                            {school.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                        <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center justify-center gap-1">
                                                <Users className="w-4 h-4 text-slate-400" />
                                                {school.participants_count || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route('admin.schools.edit', school.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="h-8 w-8 p-0 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/50"
                                                    onClick={() => handleDelete(school.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
