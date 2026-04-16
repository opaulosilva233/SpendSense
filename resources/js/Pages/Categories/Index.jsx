import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowDown,
    ArrowUp,
    Briefcase,
    Car,
    ChartColumn,
    Gamepad2,
    GraduationCap,
    HeartPulse,
    Home,
    Laptop,
    Loader2,
    Pencil,
    Plus,
    ShoppingBag,
    Tag,
    Trash2,
    Trophy,
    UserRound,
    Utensils,
    Wallet,
    Zap,
} from 'lucide-react';

const ICON_OPTIONS = [
    { value: 'tag', label: 'Etiqueta' },
    { value: 'food', label: 'Talheres' },
    { value: 'car', label: 'Carro' },
    { value: 'home', label: 'Casa' },
    { value: 'health', label: 'Saude' },
    { value: 'education', label: 'Educacao' },
    { value: 'entertainment', label: 'Entretenimento' },
    { value: 'shopping', label: 'Compras' },
    { value: 'utilities', label: 'Utilidades' },
    { value: 'personal', label: 'Pessoal' },
    { value: 'briefcase', label: 'Trabalho' },
    { value: 'laptop', label: 'Freelance' },
    { value: 'chart', label: 'Investimentos' },
    { value: 'trophy', label: 'Bonus' },
    { value: 'cash', label: 'Dinheiro' },
];

const LEGACY_ICON_MAP = {
    '🍽️': 'food',
    '🚗': 'car',
    '🏠': 'home',
    '🩺': 'health',
    '🎓': 'education',
    '🎮': 'entertainment',
    '👗': 'shopping',
    '⚡': 'utilities',
    '🧖': 'personal',
    '❓': 'tag',
    '👨‍💼': 'briefcase',
    '💻': 'laptop',
    '📊': 'chart',
    '🏆': 'trophy',
    '💵': 'cash',
};

const hasIconOption = (icon) => ICON_OPTIONS.some((option) => option.value === icon);

const normalizeIcon = (icon, type) => {
    if (hasIconOption(icon)) {
        return icon;
    }

    if (icon && LEGACY_ICON_MAP[icon]) {
        return LEGACY_ICON_MAP[icon];
    }

    return type === 'income' ? 'cash' : 'tag';
};

const getCategoryIcon = (icon) => {
    switch (icon) {
        case 'food':
            return Utensils;
        case 'car':
            return Car;
        case 'home':
            return Home;
        case 'health':
            return HeartPulse;
        case 'education':
            return GraduationCap;
        case 'entertainment':
            return Gamepad2;
        case 'shopping':
            return ShoppingBag;
        case 'utilities':
            return Zap;
        case 'personal':
            return UserRound;
        case 'briefcase':
            return Briefcase;
        case 'laptop':
            return Laptop;
        case 'chart':
            return ChartColumn;
        case 'trophy':
            return Trophy;
        case 'cash':
            return Wallet;
        case 'tag':
        default:
            return Tag;
    }
};

export default function Index({ categories }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: 'expense',
        color: '#6366F1',
        icon: 'tag',
    });

    const openCreateModal = () => {
        reset();
        setEditingCategory(null);
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            type: category.type,
            color: category.color || '#6366F1',
            icon: normalizeIcon(category.icon, category.type),
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('categories.update', editingCategory.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteCategory = (id) => {
        if (confirm('Tens a certeza que queres apagar esta categoria?')) {
            router.delete(route('categories.destroy', id));
        }
    };

    const incomeCategories = categories.filter((c) => c.type === 'income');
    const expenseCategories = categories.filter((c) => c.type === 'expense');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between mt-4">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Categorias</h2>
                    <button
                        onClick={openCreateModal}
                        id="btn-new-category"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-4 sm:px-5 py-2.5 text-sm sm:text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="h-5 w-5" strokeWidth={2.5} />
                        Nova Categoria
                    </button>
                </div>
            }
        >
            <Head title="Categorias" />

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
                {/* ── Expense Categories ── */}
                <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-sm">
                            <ArrowDown className="h-5 w-5" strokeWidth={2.5} />
                        </span>
                        Despesas
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded-full">{expenseCategories.length}</span>
                    </h3>

                    {expenseCategories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {expenseCategories.map((category) => {
                                const resolvedIcon = normalizeIcon(category.icon, category.type);
                                const CategoryIcon = getCategoryIcon(resolvedIcon);

                                return (
                                <div
                                    key={category.id}
                                    className="group flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-5 border border-slate-100 dark:border-slate-700/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm border"
                                            style={{
                                                backgroundColor: category.color || '#ffffff',
                                                borderColor: category.color || '#e2e8f0',
                                            }}
                                        >
                                            <CategoryIcon className="h-5 w-5 text-white" strokeWidth={2} />
                                        </div>
                                        <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white">{category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-white hover:shadow-sm dark:hover:bg-slate-700 dark:hover:text-white transition-all"
                                        >
                                            <Pencil className="h-4 w-4" strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category.id)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:shadow-sm hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-8 text-center border border-slate-100 dark:border-slate-700/50">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhuma categoria de despesas criada.</p>
                        </div>
                    )}
                </div>

                {/* ── Income Categories ── */}
                <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm">
                            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
                        </span>
                        Receitas
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded-full">{incomeCategories.length}</span>
                    </h3>

                    {incomeCategories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {incomeCategories.map((category) => {
                                const resolvedIcon = normalizeIcon(category.icon, category.type);
                                const CategoryIcon = getCategoryIcon(resolvedIcon);

                                return (
                                <div
                                    key={category.id}
                                    className="group flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-5 border border-slate-100 dark:border-slate-700/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm border"
                                            style={{
                                                backgroundColor: category.color || '#ffffff',
                                                borderColor: category.color || '#e2e8f0',
                                            }}
                                        >
                                            <CategoryIcon className="h-5 w-5 text-white" strokeWidth={2} />
                                        </div>
                                        <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white">{category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-white hover:shadow-sm dark:hover:bg-slate-700 dark:hover:text-white transition-all"
                                        >
                                            <Pencil className="h-4 w-4" strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category.id)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:shadow-sm hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-8 text-center border border-slate-100 dark:border-slate-700/50">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhuma categoria de receitas criada.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Create / Edit Modal ── */}
            <Modal show={showModal} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-4 sm:p-6 dark:bg-[#0a0a0a]">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                        {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                    </h3>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <InputLabel htmlFor="category-name" value="Nome" />
                            <TextInput
                                id="category-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ex: Alimentação, Salário..."
                                isFocused
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Type */}
                        <div>
                            <InputLabel value="Tipo" />
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'expense')}
                                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border ${
                                        data.type === 'expense'
                                            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900 scale-[1.02]'
                                            : 'border-slate-200 bg-white text-zinc-600 hover:border-slate-300 dark:border-zinc-800 dark:bg-[#0a0a0a] dark:text-zinc-400 dark:hover:border-zinc-700'
                                    }`}
                                >
                                    <ArrowDown className="h-4 w-4" strokeWidth={2} />
                                    Despesa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'income')}
                                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 border ${
                                        data.type === 'income'
                                            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900 scale-[1.02]'
                                            : 'border-slate-200 bg-white text-zinc-600 hover:border-slate-300 dark:border-zinc-800 dark:bg-[#0a0a0a] dark:text-zinc-400 dark:hover:border-zinc-700'
                                    }`}
                                >
                                    <ArrowUp className="h-4 w-4" strokeWidth={2} />
                                    Receita
                                </button>
                            </div>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="category-icon" value="Ícone" />
                                <select
                                    id="category-icon"
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {ICON_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm" style={{ backgroundColor: data.color || '#6366F1', borderColor: data.color || '#6366F1' }}>
                                    {(() => {
                                        const CategoryIcon = getCategoryIcon(normalizeIcon(data.icon, data.type));
                                        return <CategoryIcon className="h-5 w-5 text-white" strokeWidth={2} />;
                                    })()}
                                </div>
                                <InputError message={errors.icon} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="category-color" value="Cor" />
                                <div className="mt-1 flex items-center gap-3">
                                    <input
                                        id="category-color"
                                        type="color"
                                        value={data.color || '#6366F1'}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="h-10 w-14 cursor-pointer rounded-md border border-slate-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900"
                                    />
                                    <TextInput
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="block w-full"
                                        placeholder="#6366F1"
                                    />
                                </div>
                                <InputError message={errors.color} className="mt-2" />
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
                            id="btn-submit-category"
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-6 py-2.5 sm:py-3 text-sm sm:text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}
                            {editingCategory ? 'Guardar Alterações' : 'Criar Categoria'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
