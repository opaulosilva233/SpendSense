import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpenText, Newspaper, PlayCircle, Sparkles } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <header className="mb-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-500/30">
                                <Sparkles className="h-6 w-6" strokeWidth={2.2} />
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight">SpendSense</h1>
                        </div>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="grid gap-6 md:grid-cols-3">
                        <a
                            href="https://laravel.com/docs"
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <BookOpenText className="h-7 w-7 text-indigo-500" strokeWidth={2.2} />
                            <h2 className="mt-4 text-lg font-bold">Documentation</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Lê a documentação oficial do Laravel para dominar os fundamentos.</p>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                Explorar
                                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                            </span>
                        </a>

                        <a
                            href="https://laracasts.com"
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <PlayCircle className="h-7 w-7 text-emerald-500" strokeWidth={2.2} />
                            <h2 className="mt-4 text-lg font-bold">Laracasts</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Vídeos e séries práticas para evoluir com Laravel no dia a dia.</p>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                Ver aulas
                                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                            </span>
                        </a>

                        <a
                            href="https://laravel-news.com"
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                        >
                            <Newspaper className="h-7 w-7 text-rose-500" strokeWidth={2.2} />
                            <h2 className="mt-4 text-lg font-bold">Laravel News</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fica a par de novidades, releases e tendências do ecossistema.</p>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
                                Ler noticias
                                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                            </span>
                        </a>
                    </main>

                    <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
                        Laravel v{laravelVersion} (PHP v{phpVersion})
                    </footer>
                </div>
            </div>
        </>
    );
}
