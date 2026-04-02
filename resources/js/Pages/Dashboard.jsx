import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ balance, monthlyExpenses, monthlyIncome, recentTransactions, spendingByCategory = [], budgets = [] }) {
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
            textColor: 'text-emerald-600 dark:text-emerald-400',
        },
    ];

    // Data for the Bar Chart
    const barData = [
        {
            name: 'Resumo do Mês',
            Receitas: monthlyIncome,
            Despesas: monthlyExpenses,
        },
    ];

    // Colors for Pie Chart
    const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
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
                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md shadow-slate-200/50 dark:shadow-gray-900/50 border border-slate-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {/* Decorative gradient blob */}
                            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${card.bgGlow} blur-2xl transition-transform duration-500 group-hover:scale-150`} />

                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{card.label}</p>
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

                {/* ── Charts Section ── */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Income vs Expenses Bar Chart */}
                    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md shadow-slate-200/50 dark:shadow-gray-900/50 border border-slate-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Receitas vs Despesas</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `€${value}`} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                    <Bar dataKey="Despesas" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Spending by Category Pie Chart */}
                    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md shadow-slate-200/50 dark:shadow-gray-900/50 border border-slate-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Despesas por Categoria</h3>
                        {spendingByCategory.length > 0 ? (
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={spendingByCategory}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {spendingByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => formatCurrency(value)}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex h-72 flex-col items-center justify-center text-slate-400 dark:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-slate-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                                <p className="text-sm font-medium">Sem dados de despesas neste mês</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Budgets Progress ── */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Orçamentos Ativos</h3>
                    {budgets.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {budgets.map(budget => (
                                <div key={budget.id} className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-slate-100 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-semibold text-slate-700 dark:text-gray-200">{budget.category_name}</span>
                                        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
                                            {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${
                                                budget.percentage >= 100 ? 'bg-rose-500' :
                                                budget.percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}
                                            style={{ width: `${budget.percentage}%` }}
                                            title={`${budget.percentage.toFixed(0)}%`}
                                        ></div>
                                    </div>
                                    <p className="mt-2 text-xs text-right text-slate-500 dark:text-gray-400">
                                        {budget.percentage >= 100 ? 'Orçamento excedido' : `${(100 - budget.percentage).toFixed(0)}% disponível`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-slate-100 dark:border-gray-700 text-center">
                            <p className="text-slate-500 dark:text-gray-400 text-sm">Nenhum orçamento definido para este mês.</p>
                        </div>
                    )}
                </div>

                {/* ── Recent Transactions ── */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Transações Recentes</h3>
                        <Link
                            href={route('transactions.index')}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                        >
                            Ver Todas →
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md shadow-slate-200/50 dark:shadow-gray-900/50 border border-slate-100 dark:border-gray-700 overflow-hidden">
                        {recentTransactions && recentTransactions.length > 0 ? (
                            <ul className="divide-y divide-slate-100 dark:divide-gray-700">
                                {recentTransactions.map((transaction) => (
                                    <li
                                        key={transaction.id}
                                        className="flex items-center justify-between px-4 py-4 md:px-6 transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-gray-700/50"
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
                                                <p className="text-sm font-semibold text-slate-800 dark:text-gray-200 truncate">
                                                    {transaction.description || 'Sem descrição'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-slate-400 dark:text-gray-500">
                                                        {formatDate(transaction.date)}
                                                    </span>
                                                    {transaction.category && (
                                                        <>
                                                            <span className="text-xs text-slate-300 dark:text-gray-600">•</span>
                                                            <span className="text-xs font-medium text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
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
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-slate-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
