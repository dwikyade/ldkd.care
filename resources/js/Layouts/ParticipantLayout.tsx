import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import CloudDecor from '@/Components/ldkd/CloudDecor';
import BrandMark from '@/Components/ldkd/BrandMark';

interface Props {
    children: React.ReactNode;
}

export default function ParticipantLayout({ children }: Props) {
    return (
        <div className="ldkd-sky relative flex min-h-screen flex-col overflow-hidden text-[#172033]">
            <CloudDecor variant="compact" />
            <header className="sticky top-3 z-40 w-full px-4">
                <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between rounded-2xl border border-white/80 bg-white/88 px-4 shadow-[0_16px_40px_-34px_rgba(23,32,51,0.45)] backdrop-blur-xl sm:px-5">
                    <Link href="/" className="group flex items-center gap-3">
                        <BrandMark className="h-9 w-9 transition-transform group-hover:scale-105" />
                        <span className="font-heading text-lg font-bold tracking-tight text-[#172033]">
                            LDKD <span className="text-[#5B5FEF]">Care</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-3 sm:flex">
                        <span className="rounded-full border border-[#D9DDFF] bg-[#F1F3FF] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#5B5FEF]">
                            Assessment Flow
                        </span>
                        <Link
                            href="/"
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E8ECF3] bg-white px-4 text-sm font-semibold text-[#667085] shadow-sm transition hover:border-[#D9DDFF] hover:bg-[#F8FAFC] hover:text-[#5B5FEF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5FEF]"
                        >
                            Beranda
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>

            <footer className="relative z-10 border-t border-white/80 bg-white/80 py-6 text-center text-sm text-[#667085] backdrop-blur">
                &copy; {new Date().getFullYear()} LDKD Care. Literasi Digital dan Keamanan Digital.
            </footer>
        </div>
    );
}
