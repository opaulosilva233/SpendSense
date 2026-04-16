import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart3, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

export default function Index({ budgets, categories }) {
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const { data, setData, post, put, processing, errors, reset } = useForm({
        category_id: '',
        amount: '',
        month: currentMonth,
        year: currentYear,
    });

    const openCreateModal = () => {
        reset();
        setEditingBudget(null);
        setShowModal(true);
    };

    const openEditModal = (budget) => {
        setEditingBudget(budget);
        setData({
            category_id: budget.category_id,
            amount: budget.amount,
            month: budget.month,
            year: budget.year,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBudget(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingBudget) {
            put(route('budgets.update', editingBudget.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('budgets.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteBudget = (id) => {
        if (confirm('Tens a certeza que queres apagar este orçamento?')) {
            router.delete(route('budgets.destroy', id));
        }
    };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('pt-PT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) + ' €';
    };

    const translateMonth = (monthNum) => {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return months[monthNum - 1] || monthNum;
    };

    // Helper arrays for selects
    const monthsArray = Array.from({ length: 12 }, (_, i) => i + 1);
    const yearsArray = [currentYear - 1, currentYear, currentYear + 1];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between mt-4">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Orçamentos</h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-4 sm:px-5 py-2.5 text-sm sm:text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="h-5 w-5" strokeWidth={2.5} />
                        Novo Orçamento
                    </button>
                </div>
            }
        >
            <Head title="Orçamentos" />

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
                <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                    {budgets.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {budgets.map((budget) => (
                                <div
                                    key={budget.id}
                                    className="group flex flex-col justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-5 border border-slate-100 dark:border-slate-700/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm text-slate-600 dark:text-white border border-slate-200/50 dark:border-slate-600">
                                                <BarChart3 className="h-5 w-5" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <span className="block text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white">
                                                    {budget.category?.name || 'Categoria Removida'}
                                                </span>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="block text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {formatCurrency(budget.amount)}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 rounded-lg">
                                                        {translateMonth(budget.month)} {budget.year}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => openEditModal(budget)}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:shadow-sm dark:hover:bg-slate-700 dark:hover:text-white transition-all"
                                            >
                                                <Pencil className="h-4 w-4" strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => deleteBudget(budget.id)}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:shadow-sm hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-8 text-center border border-slate-100 dark:border-slate-700/50">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhum orçamento criado.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Create / Edit Modal ── */}
            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-4 sm:p-6 dark:bg-[#0a0a0a]">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                        {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
                    </h3>

                    <div className="space-y-4">
                        {/* Category */}
                        <div>
                            <InputLabel htmlFor="budget-category" value="Categoria" />
                            <select
                                id="budget-category"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Selecionar categoria</option>
                                {categories && categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.category_id} className="mt-2" />
                        </div>

                        {/* Amount */}
                        <div>
                            <InputLabel htmlFor="budget-amount" value="Limite Máximo (€)" />
                            <TextInput
                                id="budget-amount"
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="0.00"
                            />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>

                        {/* Month and Year */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="budget-month" value="Mês" />
                                <select
                                    id="budget-month"
                                    value={data.month}
                                    onChange={(e) => setData('month', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {monthsArray.map((m) => (
                                        <option key={m} value={m}>{translateMonth(m)}</option>
                                    ))}
                                </select>
                                <InputError message={errors.month} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="budget-year" value="Ano" />
                                <select
                                    id="budget-year"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {yearsArray.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <InputError message={errors.year} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="w-full sm:w-auto rounded-xl px-5 py-2.5 sm:py-3 text-sm sm:text-[15px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-6 py-2.5 sm:py-3 text-sm sm:text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}
                            {editingBudget ? 'Guardar' : 'Criar Orçamento'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
