import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function Index({ debts, filters = {}, summary }) {
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [editingDebt, setEditingDebt] = useState(null);
    const [selectedDebt, setSelectedDebt] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        counterparty_name: '',
        type: 'payable',
        amount: '',
        issue_date: today,
        due_date: '',
        description: '',
    });

    const {
        data: paymentData,
        setData: setPaymentData,
        post: postPayment,
        processing: paymentProcessing,
        errors: paymentErrors,
        reset: resetPayment,
        clearErrors: clearPaymentErrors,
    } = useForm({
        amount: '',
        date: today,
        note: '',
    });

    const {
        data: filterData,
        setData: setFilterData,
        get,
        processing: filterProcessing,
    } = useForm({
        type: filters.type || '',
        status: filters.status || '',
        q: filters.q || '',
    });

    const applyFilters = (e) => {
        e.preventDefault();
        get(route('debts.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilterData({
            type: '',
            status: '',
            q: '',
        });

        router.get(route('debts.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openCreateModal = () => {
        setEditingDebt(null);
        clearErrors();
        reset();
        setData('issue_date', today);
        setShowDebtModal(true);
    };

    const openEditModal = (debt) => {
        setEditingDebt(debt);
        clearErrors();
        setData({
            counterparty_name: debt.counterparty_name,
            type: debt.type,
            amount: debt.amount,
            issue_date: debt.issue_date,
            due_date: debt.due_date || '',
            description: debt.description || '',
        });
        setShowDebtModal(true);
    };

    const closeDebtModal = () => {
        setShowDebtModal(false);
        setEditingDebt(null);
        reset();
    };

    const openPaymentModal = (debt) => {
        setSelectedDebt(debt);
        clearPaymentErrors();
        resetPayment();
        setPaymentData('date', today);
        setShowPaymentModal(true);
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedDebt(null);
        resetPayment();
    };

    const submitDebt = (e) => {
        e.preventDefault();

        if (editingDebt) {
            put(route('debts.update', editingDebt.id), {
                onSuccess: () => closeDebtModal(),
            });
            return;
        }

        post(route('debts.store'), {
            onSuccess: () => closeDebtModal(),
        });
    };

    const submitPayment = (e) => {
        e.preventDefault();

        if (!selectedDebt) {
            return;
        }

        postPayment(route('debts.payments.store', selectedDebt.id), {
            onSuccess: () => closePaymentModal(),
        });
    };

    const deleteDebt = (debtId) => {
        if (confirm('Tens a certeza que queres apagar este registo de dívida/crédito?')) {
            router.delete(route('debts.destroy', debtId));
        }
    };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('pt-PT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) + ' €';
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'Sem data';
        }

        const date = new Date(dateString);

        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const debtList = debts?.data || [];
    const paginationLinks = debts?.links || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between mt-4">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Dívidas e Créditos</h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-4 sm:px-5 py-2.5 text-sm sm:text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="h-5 w-5" strokeWidth={2.5} />
                        Novo Registo
                    </button>
                </div>
            }
        >
            <Head title="Dívidas e Créditos" />

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-3xl bg-white dark:bg-slate-900/40 p-6 border border-slate-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Eu Devo</p>
                        <p className="mt-2 text-3xl font-extrabold text-rose-600 dark:text-rose-400">{formatCurrency(summary.open_payables)}</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Total em aberto para pagar</p>
                    </div>
                    <div className="rounded-3xl bg-white dark:bg-slate-900/40 p-6 border border-slate-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Devem-me</p>
                        <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.open_receivables)}</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Total em aberto para receber</p>
                    </div>
                    <div className="rounded-3xl bg-white dark:bg-slate-900/40 p-6 border border-slate-200/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Posição Líquida</p>
                        <p className={`mt-2 text-3xl font-extrabold ${summary.net_position >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {formatCurrency(summary.net_position)}
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Registos em atraso: {summary.overdue_count}</p>
                    </div>
                </div>

                <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                    <form onSubmit={applyFilters} className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                        <div className="lg:col-span-2">
                            <InputLabel htmlFor="debt-search" value="Pesquisar" className="dark:text-zinc-400" />
                            <TextInput
                                id="debt-search"
                                value={filterData.q}
                                onChange={(e) => setFilterData('q', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Nome da pessoa ou descrição"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="debt-type-filter" value="Tipo" className="dark:text-zinc-400" />
                            <select
                                id="debt-type-filter"
                                value={filterData.type}
                                onChange={(e) => setFilterData('type', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm"
                            >
                                <option value="">Todos</option>
                                <option value="payable">Eu devo</option>
                                <option value="receivable">Devem-me</option>
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="debt-status-filter" value="Estado" className="dark:text-zinc-400" />
                            <select
                                id="debt-status-filter"
                                value={filterData.status}
                                onChange={(e) => setFilterData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm"
                            >
                                <option value="">Todos</option>
                                <option value="open">Aberto</option>
                                <option value="overdue">Em atraso</option>
                                <option value="settled">Liquidado</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={filterProcessing}
                                className="h-[34px] sm:h-[38px] px-4 sm:px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                Filtrar
                            </button>
                            {(filterData.type || filterData.status || filterData.q) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="h-[34px] sm:h-[38px] px-4 sm:px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl overflow-hidden p-4 sm:p-8">
                    {debtList.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {debtList.map((debt) => {
                                    const remaining = Number(debt.amount) - Number(debt.paid_amount);
                                    const progress = Number(debt.amount) > 0 ? (Number(debt.paid_amount) / Number(debt.amount)) * 100 : 0;
                                    const isPayable = debt.type === 'payable';
                                    const statusMap = {
                                        open: 'Aberto',
                                        overdue: 'Em atraso',
                                        settled: 'Liquidado',
                                    };

                                    return (
                                        <div
                                            key={debt.id}
                                            className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 p-5"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                <div className="space-y-2 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${isPayable ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'}`}>
                                                            {isPayable ? 'Eu devo' : 'Devem-me'}
                                                        </span>
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                                                            debt.status === 'settled'
                                                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                                                                : debt.status === 'overdue'
                                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                                                                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                                        }`}>
                                                            {statusMap[debt.status] || debt.status}
                                                        </span>
                                                    </div>

                                                    <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{debt.counterparty_name}</p>

                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        Emissão: {formatDate(debt.issue_date)}
                                                        {debt.due_date ? ` • Vencimento: ${formatDate(debt.due_date)}` : ' • Sem vencimento'}
                                                    </p>

                                                    {debt.description && (
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{debt.description}</p>
                                                    )}
                                                </div>

                                                <div className="w-full lg:w-80 space-y-3">
                                                    <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                        <span>Total: {formatCurrency(debt.amount)}</span>
                                                        <span>Em aberto: {formatCurrency(remaining)}</span>
                                                    </div>

                                                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        ></div>
                                                    </div>

                                                    <div className="flex flex-wrap justify-end gap-2">
                                                        {debt.status !== 'settled' && (
                                                            <button
                                                                onClick={() => openPaymentModal(debt)}
                                                                className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
                                                            >
                                                                Registar Liquidação
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => openEditModal(debt)}
                                                            className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => deleteDebt(debt.id)}
                                                            className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30"
                                                        >
                                                            Apagar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {debt.payments?.length > 0 && (
                                                <div className="mt-4 border-t border-slate-200/70 dark:border-slate-700/60 pt-4">
                                                    <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">Últimas liquidações</p>
                                                    <ul className="space-y-1.5">
                                                        {debt.payments.slice(0, 5).map((payment) => (
                                                            <li key={payment.id} className="text-sm text-slate-600 dark:text-slate-300 flex items-center justify-between">
                                                                <span>{formatDate(payment.date)}{payment.note ? ` • ${payment.note}` : ''}</span>
                                                                <span className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(payment.amount)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {paginationLinks.length > 3 && (
                                <div className="mt-6 flex flex-wrap items-center justify-center gap-0.5 sm:gap-1 border-t border-slate-100 dark:border-zinc-800 pt-5">
                                    {paginationLinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`inline-flex h-8 sm:h-9 min-w-[32px] sm:min-w-[36px] items-center justify-center rounded-lg px-2 sm:px-3 text-xs sm:text-sm font-medium transition-all duration-200 ${
                                                link.active
                                                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                                                    : link.url
                                                        ? 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                                                        : 'cursor-not-allowed text-zinc-300 dark:text-zinc-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 dark:text-zinc-500">
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Sem registos de dívidas ou créditos</p>
                            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">Cria o primeiro registo para começares a acompanhar valores em aberto.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showDebtModal} onClose={closeDebtModal} maxWidth="md">
                <form onSubmit={submitDebt} className="p-4 sm:p-6 dark:bg-[#0a0a0a]">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                        {editingDebt ? 'Editar Registo' : 'Novo Registo de Dívida/Crédito'}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="debt-counterparty" value="Pessoa / Entidade" />
                            <TextInput
                                id="debt-counterparty"
                                value={data.counterparty_name}
                                onChange={(e) => setData('counterparty_name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ex: João Silva"
                                isFocused
                            />
                            <InputError message={errors.counterparty_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Tipo" />
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'payable')}
                                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border ${
                                        data.type === 'payable'
                                            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900 scale-[1.02]'
                                            : 'border-slate-200 bg-white text-zinc-600 hover:border-slate-300 dark:border-zinc-800 dark:bg-[#0a0a0a] dark:text-zinc-400 dark:hover:border-zinc-700'
                                    }`}
                                >
                                    Eu devo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'receivable')}
                                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border ${
                                        data.type === 'receivable'
                                            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900 scale-[1.02]'
                                            : 'border-slate-200 bg-white text-zinc-600 hover:border-slate-300 dark:border-zinc-800 dark:bg-[#0a0a0a] dark:text-zinc-400 dark:hover:border-zinc-700'
                                    }`}
                                >
                                    Devem-me
                                </button>
                            </div>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="debt-amount" value="Valor Total (€)" />
                            <TextInput
                                id="debt-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="0.00"
                            />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="debt-issue-date" value="Data de Emissão" />
                                <TextInput
                                    id="debt-issue-date"
                                    type="date"
                                    value={data.issue_date}
                                    onChange={(e) => setData('issue_date', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.issue_date} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="debt-due-date" value="Data de Vencimento" />
                                <TextInput
                                    id="debt-due-date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.due_date} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="debt-description" value="Descrição (Opcional)" />
                            <textarea
                                id="debt-description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm"
                                rows={3}
                                placeholder="Notas sobre este acordo"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={closeDebtModal}
                            className="w-full sm:w-auto rounded-xl px-5 py-2.5 sm:py-3 text-sm sm:text-[15px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-6 py-2.5 sm:py-3 text-sm sm:text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {editingDebt ? 'Guardar Alterações' : 'Criar Registo'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal show={showPaymentModal} onClose={closePaymentModal} maxWidth="md">
                <form onSubmit={submitPayment} className="p-4 sm:p-6 dark:bg-[#0a0a0a]">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Registar Liquidação</h3>
                    {selectedDebt && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            {selectedDebt.counterparty_name} • Em aberto: {formatCurrency(Number(selectedDebt.amount) - Number(selectedDebt.paid_amount))}
                        </p>
                    )}

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="payment-amount" value="Valor Liquidado (€)" />
                            <TextInput
                                id="payment-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={paymentData.amount}
                                onChange={(e) => setPaymentData('amount', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="0.00"
                                isFocused
                            />
                            <InputError message={paymentErrors.amount} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="payment-date" value="Data" />
                            <TextInput
                                id="payment-date"
                                type="date"
                                value={paymentData.date}
                                onChange={(e) => setPaymentData('date', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={paymentErrors.date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="payment-note" value="Nota (Opcional)" />
                            <TextInput
                                id="payment-note"
                                value={paymentData.note}
                                onChange={(e) => setPaymentData('note', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ex: Transferência MB Way"
                            />
                            <InputError message={paymentErrors.note} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={closePaymentModal}
                            className="w-full sm:w-auto rounded-xl px-5 py-2.5 sm:py-3 text-sm sm:text-[15px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={paymentProcessing}
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 px-6 py-2.5 sm:py-3 text-sm sm:text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            Confirmar Liquidação
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
