import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

export default function ParticipantLayout({ children }: Props) {
    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="group flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
                            <ShieldCheck className="h-5 w-5" />
                        </span>
                        <span className="font-heading text-xl font-bold tracking-tight text-slate-950">
                            LDKD <span className="text-indigo-600">Care</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-3 sm:flex">
                        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-700">
                            Assessment Flow
                        </span>
                        <Link
                            href="/"
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                            Beranda
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>

            <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} LDKD Care. Literasi Digital dan Keamanan Digital.
            </footer>
        </div>
    );
}
