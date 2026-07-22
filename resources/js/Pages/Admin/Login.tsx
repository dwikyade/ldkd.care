import { useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Shield } from 'lucide-react';

export default function Login() {
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.login.post'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-4">
            <Head title="Admin Login" />
            
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg mx-auto mb-4">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">LDKD Care Admin</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Masuk untuk mengelola sistem</p>
                </div>

                <div className="p-8">
                    <form onSubmit={submit} className="space-y-5">
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none dark:bg-slate-800 dark:text-white ${
                                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                }`}
                                placeholder="admin@ldkdcare.id"
                                required
                                autoFocus
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none dark:bg-slate-800 dark:text-white ${
                                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                                }`}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                                Ingat saya
                            </label>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={processing}>
                            {processing ? 'Masuk...' : 'Masuk ke Dashboard'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
