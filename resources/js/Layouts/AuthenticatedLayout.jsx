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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* ── Desktop Sidebar (hidden on mobile) ── */}
            <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col z-40">
                <div className="flex flex-1 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 shadow-2xl border-r border-slate-800 dark:border-gray-800">
                    {/* Logo / Brand */}
                    <div className="flex h-20 items-center gap-3 px-6 border-b border-slate-700/50">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                            SpendSense
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                                    item.active
                                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/20'
                                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                }`}
                            >
                                <span className={`transition-colors duration-200 ${item.active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Dropdown (bottom of sidebar) */}
                    <div className="border-t border-slate-700/50 dark:border-gray-800 p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-all duration-200 hover:bg-slate-700/50 dark:hover:bg-gray-800/50">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white shadow-md">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{user.email}</p>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="bottom-left" contentClasses="py-1 bg-white dark:bg-gray-800">
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Perfil
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Terminar Sessão
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                        <DarkModeToggle className="shrink-0 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" />
                    </div>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <div className="md:pl-64">
                {/* Mobile Top Bar */}
                <div className="sticky top-0 z-30 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-4 py-3 shadow-sm border-b border-slate-200/50 dark:border-gray-800 md:hidden">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            SpendSense
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <DarkModeToggle className="dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white border border-slate-200 dark:border-gray-700" />
                        
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="py-1 bg-white dark:bg-gray-800 shadow-xl border border-slate-100 dark:border-gray-700">
                                <Dropdown.Link href={route('profile.edit')}>
                                    Perfil
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Terminar Sessão
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                {/* Page Header */}
                {header && (
                    <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-slate-200/50 dark:border-gray-800">
                        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 lg:px-8">
                            <div className="*:text-slate-800 dark:*:text-white">
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
            <nav className="fixed inset-x-0 bottom-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-slate-200/50 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)] md:hidden">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-all duration-200 relative ${
                                item.active
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-400 dark:text-gray-500 active:text-slate-600 dark:active:text-gray-300'
                            }`}
                        >
                            <span className={`transition-transform duration-200 ${item.active ? 'scale-110' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[11px] font-semibold ${item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-gray-500'}`}>
                                {item.name}
                            </span>
                            {item.active && (
                                <span className="absolute -bottom-0 h-1 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                            )}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
}
