export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-[15px] font-semibold tracking-wide text-white shadow-md shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:hover:scale-100 ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
