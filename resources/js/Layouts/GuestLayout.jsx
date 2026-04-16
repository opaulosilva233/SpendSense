import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { CircleDollarSign } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 relative overflow-hidden font-sans flex flex-col items-center justify-center pt-6 sm:pt-0">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-500/10 pointer-events-none" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full px-4 sm:max-w-md sm:px-6">
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/30 text-white hover:scale-105 transition-transform duration-300">
                                <CircleDollarSign className="h-7 w-7" strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
                                SpendSense
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="w-full overflow-hidden bg-white/60 dark:bg-slate-900/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white dark:border-white/5 backdrop-blur-2xl rounded-3xl px-5 py-8 sm:px-8 sm:py-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
