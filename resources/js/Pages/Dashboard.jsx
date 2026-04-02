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
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-6">
                
                {/* ── Bento Grid Top Level ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Heroes Card - Saldo */}
                    <div className="md:col-span-2 rounded-[2rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-800 p-8 sm:p-10 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden group">
                        {/* Decorative glow inside card */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 blur-3xl rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                        
                        <div className="absolute bottom-0 right-0 p-8 opacity-[0.08] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <p className="text-indigo-100/80 font-semibold text-lg mb-1 tracking-wide">Saldo Atual</p>
                                <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter drop-shadow-sm mb-6">
                                    {formatCurrency(balance)}
                                </h2>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                                <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/10">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-100/70 font-medium">Receitas deste Mês</p>
                                        <p className="font-bold text-white tracking-wide">{formatCurrency(monthlyIncome)}</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/10">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-400/20 text-rose-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-100/70 font-medium">Despesas deste Mês</p>
                                        <p className="font-bold text-white tracking-wide">{formatCurrency(monthlyExpenses)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access / CTA */}
                    <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl flex flex-col justify-center items-center text-center group transition-all duration-300 hover:shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Adicionar Registo</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Regista uma nova transação rapidamente para manter as contas em dia.</p>
                        <Link
                            href={route('transactions.index')}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold py-3 px-6 rounded-xl w-full transition-colors shadow-sm"
                        >
                            Nova Transação
                        </Link>
                    </div>
                </div>

                {/* ── Charts Section ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Income vs Expenses Bar Chart */}
                    <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8">Evolução Mensal</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `€${value}`} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
                                        contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '13px', fontWeight: 600, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500 }} />
                                    <Bar dataKey="Receitas" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={45} />
                                    <Bar dataKey="Despesas" fill="#f43f5e" radius={[8, 8, 0, 0]} maxBarSize={45} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Spending by Category Pie Chart */}
                    <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8">Despesas por Categoria</h3>
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
                                            contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', color: 'white', fontWeight: 600, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ color: '#f8fafc' }}
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
                <div className="mt-8 rounded-[2rem] bg-white dark:bg-slate-900/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Orçamentos Ativos</h3>
                    {budgets.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {budgets.map(budget => (
                                <div key={budget.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-6 border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[15px] font-bold text-slate-800 dark:text-white">{budget.category_name}</span>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">
                                            {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                                                budget.percentage >= 100 ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                                                budget.percentage >= 80 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                            }`}
                                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                            title={`${budget.percentage.toFixed(0)}%`}
                                        ></div>
                                    </div>
                                    <p className="mt-3 text-xs font-medium text-right text-slate-500 dark:text-slate-400">
                                        {budget.percentage >= 100 ? 'Orçamento excedido' : `${(100 - budget.percentage).toFixed(0)}% disponível`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-8 text-center border border-slate-100 dark:border-slate-700/50">
                            <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium">Nenhum orçamento definido para este mês.</p>
                        </div>
                    )}
                </div>

                {/* ── Recent Transactions ── */}
                <div className="mt-8 rounded-[2rem] bg-white dark:bg-slate-900/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Transações Recentes</h3>
                        <Link
                            href={route('transactions.index')}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full"
                        >
                            Ver Todas
                        </Link>
                    </div>

                    <div className="overflow-hidden">
                        {recentTransactions && recentTransactions.length > 0 ? (
                            <ul className="space-y-3">
                                {recentTransactions.map((transaction) => (
                                    <li
                                        key={transaction.id}
                                        className="flex items-center justify-between px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-sm ${
                                                transaction.type === 'income' ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' : 'bg-gradient-to-br from-rose-400 to-red-500 text-white'
                                            }`}>
                                                {transaction.type === 'income' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[15px] font-bold text-slate-800 dark:text-white truncate">
                                                    {transaction.description || 'Sem descrição'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        {formatDate(transaction.date)}
                                                    </span>
                                                    {transaction.category && (
                                                        <>
                                                            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                                                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                                                {transaction.category.name}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <span className={`text-[15px] font-extrabold whitespace-nowrap ml-3 ${
                                            transaction.type === 'income'
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-slate-800 dark:text-white'
                                        }`}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-zinc-400 dark:text-zinc-500">
                                <p className="text-sm">Ainda não tens transações</p>
                                <Link
                                    href={route('transactions.index')}
                                    className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline transition-colors"
                                >
                                    Adicionar a primeira &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
