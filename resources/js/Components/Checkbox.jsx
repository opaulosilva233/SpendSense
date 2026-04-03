export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-md border-slate-300 dark:border-white/20 bg-white/50 dark:bg-slate-900/50 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-colors ' +
                className
            }
        />
    );
}
