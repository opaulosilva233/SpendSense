import Dropdown from '@/Components/Dropdown';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const navItems = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                </svg>
            ),
        },
        {
            name: 'Transações',
            href: route('transactions.index'),
            active: route().current('transactions.*'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            ),
        },
        {
            name: 'Categorias',
            href: route('categories.index'),
            active: route().current('categories.*'),
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-500/10 pointer-events-none" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            {/* ── Desktop Sidebar (hidden on mobile) ── */}
            <aside className="hidden md:fixed md:inset-y-4 md:left-4 md:flex md:w-[260px] md:flex-col z-40">
                <div className="flex flex-1 flex-col rounded-3xl bg-white/60 dark:bg-slate-900/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white dark:border-white/5 backdrop-blur-2xl overflow-hidden">
                    {/* Logo / Brand */}
                    <div className="flex h-24 items-center gap-4 px-8">
                        <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/30 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
                            SpendSense
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-8 space-y-2.5">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-semibold transition-all duration-300 group ${
                                    item.active
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span className={`transition-colors duration-300 ${item.active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Dropdown (bottom of sidebar) */}
                    <div className="border-t border-slate-200/50 dark:border-white/10 p-4 flex items-center justify-between bg-white/20 dark:bg-slate-950/20 backdrop-blur-md">
                        <div className="flex-1 min-w-0 pr-2">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/5">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white shadow-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="bottom-left" contentClasses="py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                                    <Dropdown.Link href={route('profile.edit')} className="hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
                                        Perfil
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
                                        Terminar Sessão
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                        <DarkModeToggle className="shrink-0 p-2 rounded-xl text-slate-500 bg-white/50 hover:bg-white hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-all" />
                    </div>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <div className="md:pl-[280px]">
                {/* Mobile Top Bar */}
                <div className="sticky top-0 z-30 flex items-center justify-between bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-5 py-4 border-b border-white/20 dark:border-white/10 md:hidden">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
                            SpendSense
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <DarkModeToggle className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
                        
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-[15px] font-bold text-white shadow-sm hover:opacity-90">
                                    {user.name.charAt(0).toUpperCase()}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="py-1 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl">
                                <Dropdown.Link href={route('profile.edit')} className="hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
                                    Perfil
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
                                    Terminar Sessão
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                {/* Page Header */}
                {header && (
                    <header className="bg-transparent mb-2">
                        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 lg:px-8">
                            <div className="*:text-zinc-900 dark:*:text-zinc-100">
                                {header}
                            </div>
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className="pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* ── Mobile Bottom Navigation Bar (visible only on mobile) ── */}
            <nav className="fixed inset-x-0 bottom-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/10 md:hidden">
                <div className="flex items-center justify-around px-2 py-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-300 relative ${
                                item.active
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            <span className={`transition-transform duration-300 ${item.active ? 'scale-110' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="text-[11px] font-bold tracking-wide">
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
