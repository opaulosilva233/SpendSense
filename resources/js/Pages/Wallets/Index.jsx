import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ wallets }) {
    const [showModal, setShowModal] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        balance: '0.00',
    });

    const openCreateModal = () => {
        reset();
        setEditingWallet(null);
        setShowModal(true);
    };

    const openEditModal = (wallet) => {
        setEditingWallet(wallet);
        setData({
            name: wallet.name,
            balance: wallet.balance,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingWallet(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingWallet) {
            put(route('wallets.update', editingWallet.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('wallets.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteWallet = (id) => {
        if (confirm('Tens a certeza que queres apagar esta carteira/conta? As transações associadas perdem a associação.')) {
            router.delete(route('wallets.destroy', id));
        }
    };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('pt-PT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) + ' €';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between mt-4">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Carteiras e Contas</h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-5 py-2.5 text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Nova Carteira
                    </button>
                </div>
            }
        >
            <Head title="Carteiras" />

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
                <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                    {wallets.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {wallets.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="group flex flex-col justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-5 border border-slate-100 dark:border-slate-700/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm text-slate-600 dark:text-white border border-slate-200/50 dark:border-slate-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="block text-[15px] font-bold text-slate-900 dark:text-white">{wallet.name}</span>
                                                <span className="block text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                                                    {formatCurrency(wallet.balance)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => openEditModal(wallet)}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:shadow-sm dark:hover:bg-slate-700 dark:hover:text-white transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => deleteWallet(wallet.id)}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:shadow-sm hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-8 text-center border border-slate-100 dark:border-slate-700/50">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhuma carteira criada.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Create / Edit Modal ── */}
            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6 dark:bg-[#0a0a0a]">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                        {editingWallet ? 'Editar Carteira' : 'Nova Carteira'}
                    </h3>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <InputLabel htmlFor="wallet-name" value="Nome (ex: Banco X, Dinheiro Vivo)" />
                            <TextInput
                                id="wallet-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Nome da carteira"
                                isFocused
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Balance */}
                        <div>
                            <InputLabel htmlFor="wallet-balance" value="Saldo Inicial / Atual (€)" />
                            <TextInput
                                id="wallet-balance"
                                type="number"
                                step="0.01"
                                value={data.balance}
                                onChange={(e) => setData('balance', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="0.00"
                            />
                            <InputError message={errors.balance} className="mt-2" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-xl px-5 py-3 text-[15px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-6 py-3 text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? (
                                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : null}
                            {editingWallet ? 'Guardar' : 'Criar Carteira'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
