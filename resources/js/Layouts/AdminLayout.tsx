import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    CalendarDays, 
    School, 
    Users, 
    FileQuestion, 
    Tags, 
    LogOut, 
    Menu,
    X,
    ShieldCheck,
    BarChart3,
    Download,
    ClipboardList,
    Scale,
    History
} from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard },
        { name: 'Kegiatan', href: route('admin.activities.index'), icon: CalendarDays },
        { name: 'Sekolah dan Kelas', href: route('admin.schools.index'), icon: School },
        { name: 'Peserta', href: '#', icon: Users },
        { name: 'Soal', href: route('admin.questions.index'), icon: FileQuestion },
        { name: 'Bobot dan Kategori', href: '#', icon: Scale },
        { name: 'Hasil', href: '#', icon: ClipboardList },
        { name: 'Perbandingan', href: '#', icon: BarChart3 },
        { name: 'Export', href: '#', icon: Download },
        { name: 'Audit Log', href: '#', icon: History },
    ];

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
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B5FEF] text-white shadow-sm">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="font-heading text-lg font-bold text-[#172033]">
                            LDKD <span className="text-[#5B5FEF]">Admin</span>
                        </span>
                    </Link>
                    <button 
                        className="ml-auto text-[#667085] hover:text-[#172033] lg:hidden"
                        onClick={() => setSidebarOpen(false)}
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
                    >
                        <LogOut className="w-5 h-5 text-rose-500" />
                        Keluar
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
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <div className="ml-auto flex items-center gap-4">
                        <div className="text-sm font-semibold text-[#667085]">
                            Administrator
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
