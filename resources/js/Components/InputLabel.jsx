export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs sm:text-[13px] font-bold tracking-wide text-slate-700 dark:text-slate-300 uppercase mb-2 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
