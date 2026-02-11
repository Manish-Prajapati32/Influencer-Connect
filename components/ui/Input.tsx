import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-slate-700 tracking-tight">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    className={cn(
                        'w-full px-4 py-2.5 bg-white border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/10',
                        error
                            ? 'border-red-500 text-red-900 placeholder:text-red-300 focus:border-red-500'
                            : 'border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-indigo focus:ring-brand-indigo/20',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="flex items-center gap-1 text-[13px] font-medium text-red-600 animate-in fade-in slide-in-from-top-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
                    {error}
                </p>
            )}
        </div>
    );
}
