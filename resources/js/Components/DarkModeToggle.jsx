import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ className = '' }) {
    const [dark, setDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            id="btn-dark-mode-toggle"
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                dark
                    ? 'bg-amber-400/10 text-amber-400 hover:bg-amber-400/20'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            } ${className}`}
            title={dark ? 'Modo Claro' : 'Modo Escuro'}
            aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
            {dark ? (
                <Sun className="h-5 w-5 transition-transform duration-300 rotate-0" strokeWidth={2} />
            ) : (
                <Moon className="h-5 w-5 transition-transform duration-300 rotate-0" strokeWidth={2} />
            )}
        </button>
    );
}
