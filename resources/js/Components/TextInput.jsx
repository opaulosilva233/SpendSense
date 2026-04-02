import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-slate-200 dark:border-zinc-800 dark:bg-[#0a0a0a] dark:text-zinc-100 focus:border-zinc-900 focus:ring-zinc-900 dark:focus:border-white dark:focus:ring-white rounded-lg shadow-sm transition-colors ' +
                className
            }
            ref={localRef}
        />
    );
});
