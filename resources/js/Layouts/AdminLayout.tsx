import React, { useEffect, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    CalendarDays, 
    School, 
    Users, 
    FileQuestion, 
    LogOut, 
    Menu,
    X,
    BarChart3,
    Download,
    ClipboardList,
    Scale,
    History,
    Globe2
} from 'lucide-react';
import BrandMark from '@/Components/ldkd/BrandMark';

interface Props {
    children: React.ReactNode;
}

type AdminLanguage = 'id' | 'en';

const adminCopy = {
    id: {
        dashboard: 'Dashboard',
        activities: 'Kegiatan',
        schools: 'Sekolah dan Kelas',
        participants: 'Peserta',
        questions: 'Soal',
        scoring: 'Bobot dan Kategori',
        results: 'Hasil',
        comparisons: 'Perbandingan',
        export: 'Export',
        audit: 'Audit Log',
        admin: 'Administrator',
        logout: 'Keluar',
        closeMenu: 'Tutup menu admin',
        openMenu: 'Buka menu admin',
    },
    en: {
        dashboard: 'Dashboard',
        activities: 'Activities',
        schools: 'Schools and Classes',
        participants: 'Participants',
        questions: 'Questions',
        scoring: 'Weights and Categories',
        results: 'Results',
        comparisons: 'Comparisons',
        export: 'Export',
        audit: 'Audit Log',
        admin: 'Administrator',
        logout: 'Logout',
        closeMenu: 'Close admin menu',
        openMenu: 'Open admin menu',
    },
};

export default function AdminLayout({ children }: Props) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [language, setLanguage] = useState<AdminLanguage>(() => {
        if (typeof window === 'undefined') {
            return 'id';
        }

        return window.localStorage.getItem('ldkd_admin_language') === 'en' ? 'en' : 'id';
    });
    const t = adminCopy[language];

    const navItems = [
        { name: t.dashboard, href: route('admin.dashboard'), icon: LayoutDashboard },
        { name: t.activities, href: route('admin.activities.index'), icon: CalendarDays },
        { name: t.schools, href: route('admin.schools.index'), icon: School },
        { name: t.participants, href: route('admin.participants.index'), icon: Users },
        { name: t.questions, href: route('admin.questions.index'), icon: FileQuestion },
        { name: t.scoring, href: route('admin.scoring.index'), icon: Scale },
        { name: t.results, href: route('admin.results.index'), icon: ClipboardList },
        { name: t.comparisons, href: route('admin.comparisons.index'), icon: BarChart3 },
        { name: t.export, href: route('admin.export.index'), icon: Download },
        { name: t.audit, href: route('admin.audit-logs.index'), icon: History },
    ];

    useEffect(() => {
        window.localStorage.setItem('ldkd_admin_language', language);
        window.dispatchEvent(new CustomEvent('ldkd-admin-language-change', { detail: language }));
    }, [language]);

    const handleLogout = () => {
        router.post(route('admin.logout'));
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] text-[#172033]">
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-[#172033]/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-72 border-r border-[#E8ECF3] bg-white
                transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex h-16 items-center px-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                        <BrandMark className="h-9 w-9 transition-transform group-hover:scale-105" />
                        <span className="font-heading text-lg font-bold text-[#172033]">
                            LDKD <span className="text-[#5B5FEF]">Admin</span>
                        </span>
                    </Link>
                    <button 
                        className="ml-auto text-[#667085] hover:text-[#172033] lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-label={t.closeMenu}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="space-y-1 px-4 py-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href !== '#' && url.startsWith(new URL(item.href, 'http://localhost').pathname);
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                                    isActive 
                                    ? 'bg-[#F1F3FF] text-[#5B5FEF]' 
                                    : 'text-[#667085] hover:bg-[#F8FAFC] hover:text-[#172033]'
                                }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-[#5B5FEF]' : 'text-[#98A2B3]'}`} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-0 w-full border-t border-[#E8ECF3] p-4">
                    <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-[#F43F5E] transition-colors hover:bg-rose-50"
                        aria-label={t.logout}
                    >
                        <LogOut className="w-5 h-5 text-rose-500" />
                        {t.logout}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 items-center justify-between border-b border-[#E8ECF3] bg-white px-4 lg:px-8">
                    <button 
                        className="text-[#667085] hover:text-[#172033] lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                        aria-label={t.openMenu}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <div className="ml-auto flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E8ECF3] bg-white px-3 text-xs font-bold text-[#667085] shadow-sm transition hover:border-[#D9DDFF] hover:text-[#5B5FEF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B5FEF]"
                            aria-label="Switch admin language"
                        >
                            <Globe2 className="h-4 w-4" />
                            {language.toUpperCase()}
                        </button>
                        <div className="text-sm font-semibold text-[#667085]">
                            {t.admin}
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9DDFF] bg-[#F1F3FF] font-bold text-[#5B5FEF]">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
