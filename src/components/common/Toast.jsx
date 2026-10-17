import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold text-white ${
        toast.type === 'success'
          ? 'bg-slate-900 border-emerald-500/40 text-white'
          : toast.type === 'error'
          ? 'bg-rose-900 border-rose-500/40 text-white'
          : 'bg-slate-900 border-slate-700 text-white'
      }`}>
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-brand-400 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
