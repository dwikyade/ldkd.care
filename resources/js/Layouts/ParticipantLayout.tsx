import React from 'react';
import { Link } from '@inertiajs/react';
import { Shield } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

export default function ParticipantLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden flex flex-col">
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/20 dark:border-slate-800/50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                            <Shield className="w-6 h-6" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight text-slate-800 dark:text-white">
                            LDKD <span className="text-indigo-600 dark:text-indigo-400">Care</span>
                        </span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        {/* We could add language toggle here later */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl flex flex-col">
                {children}
            </main>
            
            {/* Footer */}
            <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                &copy; {new Date().getFullYear()} LDKD Care. Aplikasi Evaluasi Literasi Digital dan Keamanan Data.
            </footer>
        </div>
    );
}
