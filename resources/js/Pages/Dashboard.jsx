import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ balance, monthlyExpenses, monthlyIncome, recentTransactions }) {
    const formatCurrency = (value) => {
        return Number(value).toLocaleString('pt-PT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) + ' €';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const cards = [
        {
            id: 'balance',
            label: 'Saldo Atual',
            value: balance,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            gradient: 'from-blue-500 to-indigo-600',
            bgGlow: 'bg-blue-500/10',
            textColor: balance >= 0 ? 'text-emerald-600' : 'text-red-500',
        },
        {
            id: 'expenses',
            label: 'Despesas do Mês',
            value: monthlyExpenses,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            ),
            gradient: 'from-rose-500 to-pink-600',
            bgGlow: 'bg-rose-500/10',
            textColor: 'text-rose-600',
        },
        {
            id: 'income',
            label: 'Receitas do Mês',
            value: monthlyIncome,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            gradient: 'from-emerald-500 to-teal-600',
            bgGlow: 'bg-emerald-500/10',
            textColor: 'text-emerald-600',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold text-slate-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            id={`card-${card.id}`}
                            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-md shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {/* Decorative gradient blob */}
                            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${card.bgGlow} blur-2xl transition-transform duration-500 group-hover:scale-150`} />

                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                    <p className={`mt-2 text-2xl font-bold tracking-tight ${card.textColor}`}>
                                        {formatCurrency(card.value)}
                                    </p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Recent Transactions ── */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Transações Recentes</h3>
                        <Link
                            href={route('transactions.index')}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                        >
                            Ver Todas →
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white shadow-md shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        {recentTransactions && recentTransactions.length > 0 ? (
                            <ul className="divide-y divide-slate-100">
                                {recentTransactions.map((transaction) => (
                                    <li
                                        key={transaction.id}
                                        className="flex items-center justify-between px-4 py-4 md:px-6 transition-colors duration-150 hover:bg-slate-50/80"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Type indicator */}
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                transaction.type === 'income'
                                                    ? 'bg-emerald-50 text-emerald-500'
                                                    : 'bg-rose-50 text-rose-500'
                                            }`}>
                                                {transaction.type === 'income' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate">
                                                    {transaction.description || 'Sem descrição'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-slate-400">
                                                        {formatDate(transaction.date)}
                                                    </span>
                                                    {transaction.category && (
                                                        <>
                                                            <span className="text-xs text-slate-300">•</span>
                                                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                                {transaction.category.name}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <span className={`text-sm font-bold whitespace-nowrap ml-3 ${
                                            transaction.type === 'income'
                                                ? 'text-emerald-600'
                                                : 'text-rose-600'
                                        }`}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-sm font-medium">Ainda não tens transações</p>
                                <Link
                                    href={route('transactions.index')}
                                    className="mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    Adicionar a primeira →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
