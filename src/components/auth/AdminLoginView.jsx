import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

export const AdminLoginView = ({ onLoginSuccess }) => {
  const { setActiveView, showToast } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFillDemoAdmin = () => {
    setEmail('admin@dailyneeds.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('dns_admin_token', data.token);
        showToast("Admin access verified! Welcome to Console. 🛡️", "success");
        onLoginSuccess();
      } else {
        setErrorMessage(data.message || 'Invalid administrator credentials');
      }
    } catch (err) {
      // Fallback local check
      if (email.trim().toLowerCase() === 'admin@dailyneeds.com' && password === 'admin123') {
        localStorage.setItem('dns_admin_token', `admin-${Date.now()}`);
        showToast("Admin access verified! Welcome to Console. 🛡️", "success");
        onLoginSuccess();
      } else {
        setErrorMessage('Invalid credentials. Use admin@dailyneeds.com / admin123');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-950">
      
      {/* Return to customer store pill */}
      <div className="mb-6">
        <button
          onClick={() => setActiveView('home')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Customer Store</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Portal Emblem */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-400 text-slate-950 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-400/20 font-black">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Admin Authentication</h1>
          <p className="text-xs text-slate-400">
            Sign in to manage catalog, review customer orders, and control inventory.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dailyneeds.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Admin Access Key / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="w-full py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded-xl font-bold text-[11px] border border-amber-400/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Fill Demo Admin (admin@dailyneeds.com / admin123)</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-400/20 transition-all active:scale-98 flex items-center justify-center gap-2 pt-2.5"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Enter Admin Console</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
          Daily Needs Store • Internal Staff & Inventory Control
        </div>

      </div>
    </div>
  );
};
