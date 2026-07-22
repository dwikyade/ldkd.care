import { useEffect } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, KeyRound, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import CloudDecor from '@/Components/ldkd/CloudDecor';

export default function Login() {
    const reduceMotion = useReducedMotion();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('admin.login.post'));
    };

    return (
        <div className="ldkd-sky relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-[#172033]">
            <Head title="Ruang Pengelola" />
            <CloudDecor variant="hero" />

            <div className="ldkd-container relative z-10 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.45 }}
                    className="mx-auto max-w-xl text-center lg:text-left"
                >
                    <Link href={route('participant.landing')} className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/80 px-4 py-2 text-sm font-bold text-[#667085] shadow-sm transition hover:-translate-y-0.5 hover:text-[#5B5FEF]">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Link>

                    <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-[#5B5FEF] shadow-sm lg:mx-0">
                        <Sparkles className="h-4 w-4" />
                        Portal internal LDKD Care
                    </div>

                    <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-[-0.01em] text-[#172033] sm:text-5xl">
                        Ruang Pengelola Evaluasi Digital
                    </h1>
                    <p className="mt-5 text-base leading-8 text-[#667085]">
                        Area ini digunakan admin untuk mengelola kegiatan, peserta, bank soal, hasil pre-test, post-test, dan export laporan.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {['Data peserta', 'Hasil otomatis', 'Export laporan'].map((item) => (
                            <div key={item} className="rounded-2xl border border-white/80 bg-white/75 p-4 text-sm font-bold text-[#172033] shadow-sm backdrop-blur">
                                <ShieldCheck className="mb-3 h-5 w-5 text-[#5B5FEF]" />
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.08 }}
                    className="mx-auto w-full max-w-md"
                >
                    <div className="rounded-[28px] border border-white/80 bg-white/88 p-3 shadow-[0_32px_80px_-45px_rgba(56,104,168,0.75)] backdrop-blur">
                        <div className="overflow-hidden rounded-[24px] border border-[#E8ECF3] bg-white">
                            <div className="border-b border-[#E8ECF3] bg-[#F8FAFC] p-6 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F3FF] text-[#5B5FEF]">
                                    <LockKeyhole className="h-7 w-7" />
                                </div>
                                <h2 className="font-heading text-2xl font-bold text-[#172033]">Akses Pengelola</h2>
                                <p className="mt-2 text-sm leading-6 text-[#667085]">Gunakan akun admin yang sudah terdaftar.</p>
                            </div>

                            <form onSubmit={submit} className="space-y-5 p-6">
                                <Field label="Email" error={errors.email} icon={<Mail className="h-4 w-4" />}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        className={fieldClass(Boolean(errors.email))}
                                        placeholder="admin@ldkdcare.id"
                                        required
                                        autoFocus
                                    />
                                </Field>

                                <Field label="Password" error={errors.password} icon={<KeyRound className="h-4 w-4" />}>
                                    <input
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        className={fieldClass(Boolean(errors.password))}
                                        placeholder="********"
                                        required
                                    />
                                </Field>

                                <label className="flex items-center gap-3 rounded-2xl border border-[#E8ECF3] bg-[#F8FAFC] px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(event) => setData('remember', event.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-[#5B5FEF] focus:ring-[#5B5FEF]"
                                    />
                                    <span className="text-sm font-semibold text-[#667085]">Ingat akses di perangkat ini</span>
                                </label>

                                <Button type="submit" className="w-full gap-2" size="lg" disabled={processing}>
                                    <ShieldCheck className="h-4 w-4" />
                                    {processing ? 'Membuka...' : 'Buka Dashboard'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function Field({ label, error, icon, children }: { label: string; error?: string; icon: ReactNode; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-[#172033]">{label}</label>
            <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[#98A2B3]">
                    {icon}
                </span>
                {children}
            </div>
            {error && <p className="text-sm font-semibold text-[#F43F5E]">{error}</p>}
        </div>
    );
}

function fieldClass(hasError: boolean) {
    return `h-12 w-full rounded-xl border bg-white pl-11 pr-3 text-sm text-[#172033] focus:outline-none focus:ring-2 ${
        hasError ? 'border-[#F43F5E] focus:ring-[#F43F5E]' : 'border-[#E8ECF3] focus:ring-[#5B5FEF]'
    }`;
}
