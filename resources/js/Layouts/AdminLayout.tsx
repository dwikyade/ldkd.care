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
    Shield
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';

interface Props {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard },
        { name: 'Kegiatan', href: route('admin.activities.index'), icon: CalendarDays },
        { name: 'Sekolah', href: route('admin.schools.index'), icon: School },
        { name: 'Peserta', href: '#', icon: Users },
        { name: 'Soal Kuesioner', href: route('admin.questions.index'), icon: FileQuestion },
        { name: 'Kategori & Tips', href: '#', icon: Tags },
    ];

    const handleLogout = () => {
        router.post(route('admin.logout'));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
                transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shrink-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="font-heading font-bold text-lg text-slate-800 dark:text-white">
                            LDKD <span className="text-indigo-600 dark:text-indigo-400">Admin</span>
                        </span>
                    </Link>
                    <button 
                        className="ml-auto lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href !== '#' && url.startsWith(new URL(item.href, 'http://localhost').pathname);
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                                    isActive 
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                    >
                        <LogOut className="w-5 h-5 text-rose-500" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
                    <button 
                        className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    
                    <div className="ml-auto flex items-center gap-4">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Administrator
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-700">
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
