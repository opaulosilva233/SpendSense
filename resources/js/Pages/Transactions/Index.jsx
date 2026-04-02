import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ transactions, categories, filters = {} }) {
    const [showModal, setShowModal] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        type: 'expense',
        category_id: '',
        date: today,
        description: '',
    });

    const { data: filterData, setData: setFilterData, get, processing: filterProcessing } = useForm({
        category_id: filters.category_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const applyFilters = (e) => {
        e.preventDefault();
        get(route('transactions.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilterData({
            category_id: '',
            date_from: '',
            date_to: '',
        });
        router.get(route('transactions.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportCsv = () => {
        // Construct the query string from applied filters
        const query = new URLSearchParams();
        if (filterData.category_id) query.append('category_id', filterData.category_id);
        if (filterData.date_from) query.append('date_from', filterData.date_from);
        if (filterData.date_to) query.append('date_to', filterData.date_to);
        
        window.location.href = `${route('transactions.csv')}?${query.toString()}`;
    };

    const openModal = () => {
        reset();
        setData('date', today);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('transactions.store'), {
            onSuccess: () => closeModal(),
        });
    };

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

    // Filter categories based on selected type
    const filteredCategories = categories
        ? categories.filter((c) => c.type === data.type)
        : [];

    // Paginated data
    const transactionList = transactions?.data || [];
    const paginationLinks = transactions?.links || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Transações</h2>
                </div>
            }
        >
            <Head title="Transações" />

            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 space-y-6">
                
                {/* ── Filters & Actions ── */}
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-md shadow-slate-200/50 dark:shadow-gray-900/50 border border-slate-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
                    <form onSubmit={applyFilters} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-wrap">
                        <div>
                            <InputLabel htmlFor="filter-category" value="Categoria" className="dark:text-gray-300" />
                            <select
                                id="filter-category"
                                value={filterData.category_id}
                                onChange={(e) => setFilterData('category_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                            >
                                <option value="">Todas</option>
                                {categories && categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} ({category.type === 'income' ? 'Receita' : 'Despesa'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="filter-date-from" value="Data Inicial" className="dark:text-gray-300" />
                            <TextInput
                                id="filter-date-from"
                                type="date"
                                value={filterData.date_from}
                                onChange={(e) => setFilterData('date_from', e.target.value)}
                                className="mt-1 block w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="filter-date-to" value="Data Final" className="dark:text-gray-300" />
                            <TextInput
                                id="filter-date-to"
                                type="date"
                                value={filterData.date_to}
                                onChange={(e) => setFilterData('date_to', e.target.value)}
                                className="mt-1 block w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                disabled={filterProcessing}
                                className="h-[38px] px-4 rounded-md bg-slate-800 dark:bg-gray-600 text-white text-sm font-medium hover:bg-slate-700 dark:hover:bg-gray-500 transition-colors"
                            >
                                Filtrar
                            </button>
                            {(filterData.category_id || filterData.date_from || filterData.date_to) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="h-[38px] px-4 rounded-md bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                    </form>

                    <button
                        onClick={exportCsv}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-md border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exportar CSV
                    </button>
                </div>

                {/* ── Transactions List ── */}
                <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md shadow-slate-200/50 dark:shadow-gray-900/50 border border-slate-100 dark:border-gray-700 overflow-hidden">
                    {transactionList.length > 0 ? (
                        <>
                            <ul className="divide-y divide-slate-100 dark:divide-gray-700">
                                {transactionList.map((transaction) => (
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

                            {/* Pagination */}
                            {paginationLinks.length > 3 && (
                                <div className="flex flex-wrap items-center justify-center gap-1 border-t border-slate-100 dark:border-gray-700 px-4 py-4">
                                    {paginationLinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium transition-all duration-200 ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                                                    : link.url
                                                        ? 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-700 dark:hover:text-white'
                                                        : 'cursor-not-allowed text-slate-300 dark:text-gray-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-slate-200 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            <p className="text-base font-medium text-slate-500 dark:text-gray-400">Sem transações registadas</p>
                            <p className="mt-1 text-sm text-slate-400 dark:text-gray-500">Clica no botão abaixo para adicionares a primeira transação.</p>
                        </div>
                    )}
                </div>

                {/* ── Floating Action Button (mobile) + Desktop button ── */}
                <button
                    onClick={openModal}
                    id="btn-new-transaction"
                    className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 md:bottom-8 md:right-8 md:h-auto md:w-auto md:rounded-xl md:px-6 md:py-3.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden md:inline md:ml-2 font-semibold text-sm">Nova Transação</span>
                </button>
            </div>

            {/* ── Create Transaction Modal ── */}
            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6 dark:bg-gray-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Nova Transação</h3>

                    <div className="space-y-5">
                        {/* Type Selection */}
                        <div>
                            <InputLabel value="Tipo" />
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('type', 'expense');
                                        setData('category_id', '');
                                    }}
                                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border-2 ${
                                        data.type === 'expense'
                                            ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-md shadow-rose-500/10'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    Despesa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('type', 'income');
                                        setData('category_id', '');
                                    }}
                                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border-2 ${
                                        data.type === 'income'
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-md shadow-emerald-500/10'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                    Receita
                                </button>
                            </div>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        {/* Amount */}
                        <div>
                            <InputLabel htmlFor="transaction-amount" value="Valor (€)" />
                            <TextInput
                                id="transaction-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="0.00"
                                isFocused
                            />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>

                        {/* Category */}
                        <div>
                            <InputLabel htmlFor="transaction-category" value="Categoria" />
                            <select
                                id="transaction-category"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Selecionar categoria...</option>
                                {filteredCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {filteredCategories.length === 0 && (
                                <p className="mt-1 text-xs text-amber-600">
                                    Nenhuma categoria disponível.{' '}
                                    <Link href={route('categories.index')} className="underline font-semibold">
                                        Criar uma categoria
                                    </Link>
                                </p>
                            )}
                            <InputError message={errors.category_id} className="mt-2" />
                        </div>

                        {/* Date */}
                        <div>
                            <InputLabel htmlFor="transaction-date" value="Data" />
                            <TextInput
                                id="transaction-date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.date} className="mt-2" />
                        </div>

                        {/* Description */}
                        <div>
                            <InputLabel htmlFor="transaction-description" value="Descrição (opcional)" />
                            <TextInput
                                id="transaction-description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ex: Almoço, Supermercado..."
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            id="btn-submit-transaction"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-xl disabled:opacity-50"
                        >
                            {processing ? (
                                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : null}
                            Adicionar Transação
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
