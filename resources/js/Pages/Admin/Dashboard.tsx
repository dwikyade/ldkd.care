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
                    <h1 className="font-heading text-3xl font-bold tracking-[-0.01em] text-[#172033]">Dashboard</h1>
                    <p className="mt-1 text-[#667085]">Rekap evaluasi LDKD Care dari data peserta dan submission.</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E8ECF3] bg-white px-4 py-2 text-sm font-semibold text-[#667085] shadow-sm">
                    <Activity className="h-4 w-4 text-[#5B5FEF]" />
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
                                        <p className="text-sm font-medium text-[#667085]">{item.label}</p>
                                        <h3 className="mt-1 font-heading text-3xl font-bold text-[#172033]">{item.value}</h3>
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
                            <BarChart3 className="h-5 w-5 text-[#5B5FEF]" />
                            <CardTitle>Perbandingan Rata-rata Pre-Test vs Post-Test</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF3" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        formatter={(value: number) => [`${value}%`, '']}
                                        contentStyle={{ borderRadius: '14px', border: '1px solid #E8ECF3', boxShadow: '0 20px 44px -32px rgb(23 32 51 / 0.45)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="literasi" name="Literasi Digital" fill="#5B5FEF" radius={[8, 8, 0, 0]} isAnimationActive={!reduceMotion} />
                                    <Bar dataKey="keamanan" name="Keamanan Digital" fill="#38BDF8" radius={[8, 8, 0, 0]} isAnimationActive={!reduceMotion} />
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
                                    <p className="rounded-xl border border-[#E8ECF3] bg-[#F8FAFC] p-4 text-sm text-[#667085]">
                                    Belum ada submission terbaru.
                                </p>
                            )}

                            {recentActivities.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.test_type === 'pre_test' ? 'bg-indigo-500' : 'bg-cyan-500'}`} />
                                    <div>
                                        <p className="text-sm font-semibold leading-6 text-[#172033]">
                                            {item.participant} menyelesaikan {item.test_type === 'pre_test' ? 'Pre-Test' : 'Post-Test'}
                                        </p>
                                        <p className="text-xs text-[#667085]">{item.submitted_at}</p>
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
        indigo: 'border-l-[#5B5FEF]',
        cyan: 'border-l-[#38BDF8]',
        emerald: 'border-l-[#10B981]',
        amber: 'border-l-[#F59E0B]',
        slate: 'border-l-[#98A2B3]',
    };

    return map[tone] || map.slate;
}

function toneIcon(tone: string) {
    const map: Record<string, string> = {
        indigo: 'bg-[#F1F3FF] text-[#5B5FEF]',
        cyan: 'bg-[#ECFEFF] text-[#0891B2]',
        emerald: 'bg-[#ECFDF5] text-[#10B981]',
        amber: 'bg-[#FFFBEB] text-[#F59E0B]',
        slate: 'bg-[#F3F7FC] text-[#667085]',
    };

    return map[tone] || map.slate;
}
