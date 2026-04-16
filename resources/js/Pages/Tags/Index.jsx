import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Loader2, Pencil, Plus, Tag, Trash2 } from 'lucide-react';

export default function Index({ tags }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
    });

    const openCreateModal = () => {
        reset();
        setEditingTag(null);
        setShowModal(true);
    };

    const openEditModal = (tag) => {
        setEditingTag(tag);
        setData({
            name: tag.name,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTag(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingTag) {
            put(route('tags.update', editingTag.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('tags.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteTag = (id) => {
        if (confirm('Tens a certeza que queres apagar esta tag? As transações não serão apagadas.')) {
            router.delete(route('tags.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between mt-4">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Tags / Etiquetas</h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 px-4 sm:px-5 py-2.5 text-sm sm:text-[15px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="h-5 w-5" strokeWidth={2.5} />
                        Nova Tag
                    </button>
                </div>
            }
        >
            <Head title="Tags" />

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
                <div className="rounded-[2rem] bg-white dark:bg-slate-900/40 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 dark:border-white/5 backdrop-blur-xl">
                    {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="group flex flex-row items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 px-4 py-2 border border-slate-100 dark:border-slate-700/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                                >
                                    <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                                        <Tag className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                                        <span className="text-sm font-bold">{tag.name}</span>
                                    </div>
                                    <div className="flex items-center ml-2 border-l border-slate-200 dark:border-slate-700 pl-2">
                                        <button
                                            onClick={() => openEditModal(tag)}
                                            className="rounded p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                                        </button>
                                        <button
                                            onClick={() => deleteTag(tag.id)}
                                            className="rounded p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-8 text-center border border-slate-100 dark:border-slate-700/50">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhuma tag criada.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Create / Edit Modal ── */}
            <Modal show={showModal} onClose={closeModal} maxWidth="sm">
                <form onSubmit={submit} className="p-4 sm:p-6 dark:bg-[#0a0a0a]">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                        {editingTag ? 'Editar Tag' : 'Nova Tag'}
                    </h3>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <InputLabel htmlFor="tag-name" value="Nome da Etiqueta" />
                            <TextInput
                                id="tag-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ex: Viagem Paris, Fixas..."
                                isFocused
                            />
                            <InputError message={errors.name} className="mt-2" />
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
                            {editingTag ? 'Guardar' : 'Criar Tag'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
