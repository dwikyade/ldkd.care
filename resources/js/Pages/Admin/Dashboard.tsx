import { Head } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import {
    Activity,
    BarChart3,
    BookOpen,
    CheckCircle2,
    FileQuestion,
    School,
    ShieldCheck,
    UserX,
    Users,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Stats {
    total_participants: number;
    total_pre_test: number;
    total_post_test: number;
    complete_participants: number;
    incomplete_participants: number;
    avg_digital_literacy: number;
    avg_data_security: number;
    total_schools: number;
    active_activities: number;
}

interface ChartRow {
    name: string;
    literasi: number;
    keamanan: number;
}

interface RecentActivity {
    id: number;
    participant: string;
    test_type: 'pre_test' | 'post_test';
    submitted_at: string;
}

interface Props {
    stats: Stats;
    chartData: ChartRow[];
    recentActivities: RecentActivity[];
}

export default function Dashboard({ stats, chartData, recentActivities }: Props) {
    const reduceMotion = useReducedMotion();
    const cards = [
        { label: 'Total Peserta', value: stats.total_participants, icon: Users, tone: 'indigo' },
        { label: 'Total Pre-Test', value: stats.total_pre_test, icon: FileQuestion, tone: 'cyan' },
        { label: 'Total Post-Test', value: stats.total_post_test, icon: CheckCircle2, tone: 'emerald' },
        { label: 'Peserta Lengkap', value: stats.complete_participants, icon: CheckCircle2, tone: 'emerald' },
        { label: 'Belum Lengkap', value: stats.incomplete_participants, icon: UserX, tone: 'amber' },
        { label: 'Rata-rata Literasi', value: `${stats.avg_digital_literacy}%`, icon: BookOpen, tone: 'indigo' },
        { label: 'Rata-rata Keamanan', value: `${stats.avg_data_security}%`, icon: ShieldCheck, tone: 'cyan' },
        { label: 'Jumlah Sekolah', value: stats.total_schools, icon: School, tone: 'slate' },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Rekap evaluasi LDKD Care dari data peserta dan submission.</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    <Activity className="h-4 w-4 text-indigo-600" />
                    {stats.active_activities} kegiatan aktif
                </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: reduceMotion ? 0 : index * 0.04 }}
                        >
                            <Card className={`border-l-4 ${toneBorder(item.tone)}`}>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                                        <h3 className="mt-1 font-heading text-3xl font-bold text-slate-900 dark:text-white">{item.value}</h3>
                                    </div>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneIcon(item.tone)}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                            <CardTitle>Perbandingan Rata-rata Pre-Test vs Post-Test</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        formatter={(value: number) => [`${value}%`, '']}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 12px 24px -16px rgb(15 23 42 / 0.35)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="literasi" name="Literasi Digital" fill="#4f46e5" radius={[6, 6, 0, 0]} isAnimationActive={!reduceMotion} />
                                    <Bar dataKey="keamanan" name="Keamanan Digital" fill="#06b6d4" radius={[6, 6, 0, 0]} isAnimationActive={!reduceMotion} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {recentActivities.length === 0 && (
                                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
                                    Belum ada submission terbaru.
                                </p>
                            )}

                            {recentActivities.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.test_type === 'pre_test' ? 'bg-indigo-500' : 'bg-cyan-500'}`} />
                                    <div>
                                        <p className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                                            {item.participant} menyelesaikan {item.test_type === 'pre_test' ? 'Pre-Test' : 'Post-Test'}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.submitted_at}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

function toneBorder(tone: string) {
    const map: Record<string, string> = {
        indigo: 'border-l-indigo-500',
        cyan: 'border-l-cyan-500',
        emerald: 'border-l-emerald-500',
        amber: 'border-l-amber-500',
        slate: 'border-l-slate-500',
    };

    return map[tone] || map.slate;
}

function toneIcon(tone: string) {
    const map: Record<string, string> = {
        indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300',
        cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
        emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
        slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    };

    return map[tone] || map.slate;
}
