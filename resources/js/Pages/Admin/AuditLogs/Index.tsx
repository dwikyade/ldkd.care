import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { Card } from '@/Components/ui/Card';
import ModernSelect from '@/Components/ui/ModernSelect';
import { AdminGuideButton } from '@/Components/admin/AdminGuide';
import type { AuditLog, Paginated } from '@/types';
import { History, Search } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

interface Props {
    logs: Paginated<AuditLog>;
    filters: {
        search?: string;
        action?: string;
        entity_type?: string;
    };
    actions: string[];
    entityTypes: string[];
}

export default function Index({ logs, filters, actions, entityTypes }: Props) {
    const filterForm = useForm({
        search: filters.search || '',
        action: filters.action || '',
        entity_type: filters.entity_type || '',
    });

    const applyFilters = (event: FormEvent) => {
        event.preventDefault();
        router.get(route('admin.audit-logs.index'), filterForm.data, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Audit Log" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B5FEF]">Keamanan Sistem</p>
                    <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Audit Log</h1>
                    <p className="mt-1 text-[#667085]">Pantau aktivitas admin seperti login, perubahan data, dan export laporan.</p>
                </div>
                <AdminGuideButton module="audit" />
            </div>

            <Card className="mb-6">
                <form onSubmit={applyFilters} className="grid gap-3 p-5 lg:grid-cols-[1.35fr_1fr_1fr_auto]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                        <input
                            value={filterForm.data.search}
                            onChange={(event) => filterForm.setData('search', event.target.value)}
                            className={searchInputClass}
                            placeholder="Cari aksi, entity, nama, atau email admin"
                        />
                    </div>
                    <Select value={filterForm.data.action} onChange={(value) => filterForm.setData('action', value)}>
                        <option value="">Semua aksi</option>
                        {actions.map((action) => (
                            <option key={action} value={action}>{action}</option>
                        ))}
                    </Select>
                    <Select value={filterForm.data.entity_type} onChange={(value) => filterForm.setData('entity_type', value)}>
                        <option value="">Semua entity</option>
                        {entityTypes.map((entityType) => (
                            <option key={entityType} value={entityType}>{entityType}</option>
                        ))}
                    </Select>
                    <Button type="submit">Terapkan</Button>
                </form>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1080px] text-left text-sm">
                        <thead className="border-b border-[#E8ECF3] bg-[#F8FAFC] text-xs uppercase tracking-[0.12em] text-[#667085]">
                            <tr>
                                <th className="px-5 py-4">Waktu</th>
                                <th className="px-5 py-4">Admin</th>
                                <th className="px-5 py-4">Aksi</th>
                                <th className="px-5 py-4">Entity</th>
                                <th className="px-5 py-4">Perubahan</th>
                                <th className="px-5 py-4">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8ECF3]">
                            {logs.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                                <History className="h-6 w-6" />
                                            </div>
                                            <p className="font-bold text-[#172033]">Belum ada audit log sesuai filter.</p>
                                            <p className="mt-1 text-sm text-[#667085]">Aktivitas admin akan tampil setelah fitur digunakan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {logs.data.map((log) => (
                                <tr key={log.id} className="bg-white transition hover:bg-[#F8FAFC]">
                                    <td className="px-5 py-4 text-[#667085]">{formatDate(log.created_at)}</td>
                                    <td className="px-5 py-4">
                                        <p className="font-bold text-[#172033]">{log.user?.name || 'System'}</p>
                                        <p className="text-xs text-[#667085]">{log.user?.email || '-'}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge>{formatAction(log.action)}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-[#172033]">{log.entity_type || '-'}</p>
                                        <p className="font-mono text-xs text-[#667085]">{log.entity_id ? `#${log.entity_id}` : '-'}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="grid max-w-[380px] gap-2">
                                            <JsonPreview label="Old" value={log.old_value} />
                                            <JsonPreview label="New" value={log.new_value} />
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-mono text-xs text-[#667085]">{log.ip_address || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination meta={logs} />
            </Card>
        </AdminLayout>
    );
}

const inputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white px-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';
const searchInputClass = 'h-11 w-full rounded-xl border border-[#E8ECF3] bg-white pl-10 pr-3 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]';

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
    return (
        <ModernSelect value={value} onChange={onChange} className={inputClass}>
            {children}
        </ModernSelect>
    );
}

function Badge({ children }: { children: ReactNode }) {
    return <span className="inline-flex rounded-full bg-[#F1F3FF] px-3 py-1 text-xs font-bold text-[#5B5FEF]">{children}</span>;
}

function JsonPreview({ label, value }: { label: string; value?: Record<string, unknown> | unknown[] | null }) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return <span className="text-xs font-semibold text-[#CBD5E1]">{label}: -</span>;
    }

    return (
        <details className="rounded-xl border border-[#E8ECF3] bg-white px-3 py-2">
            <summary className="cursor-pointer text-xs font-bold text-[#667085]">{label}</summary>
            <pre className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-[#172033]">
                {JSON.stringify(value, null, 2)}
            </pre>
        </details>
    );
}

function Pagination({ meta }: { meta: Paginated<AuditLog> }) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex flex-col gap-3 border-t border-[#E8ECF3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#667085]">Menampilkan {meta.from || 0}-{meta.to || 0} dari {meta.total} log</p>
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

function formatDate(value: string) {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function formatAction(value: string) {
    return value.replace(/_/g, ' ');
}
