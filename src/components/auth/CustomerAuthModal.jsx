import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, User, Lock, Mail, Phone, LogIn, UserPlus, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const CustomerAuthModal = ({ isOpen, onClose }) => {
  const { user, setUser, showToast, recordLogin, visitCount, loyaltyTier } = useStore();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleFillDemoCustomer = () => {
    setLoginData({
      emailOrPhone: 'abinash@example.com',
      password: 'password123'
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('dns_user', JSON.stringify(data.user));
        localStorage.setItem('dns_token', data.token);
        recordLogin();
        showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
        onClose();
      } else {
        showToast(data.message || 'Invalid credentials', 'error');
      }
    } catch (err) {
      // Fallback local login if backend is disconnected
      const fallbackUser = {
        name: loginData.emailOrPhone.split('@')[0] || "Meher Abinash",
        email: loginData.emailOrPhone.includes('@') ? loginData.emailOrPhone : "customer@example.com",
        phone: loginData.emailOrPhone.includes('@') ? "+91 98765 43210" : loginData.emailOrPhone,
        role: "customer"
      };
      setUser(fallbackUser);
      localStorage.setItem('dns_user', JSON.stringify(fallbackUser));
      recordLogin();
      showToast(`Welcome back, ${fallbackUser.name}! 👋`, 'success');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('dns_user', JSON.stringify(data.user));
        localStorage.setItem('dns_token', data.token);
        recordLogin();
        showToast(`Account created! Welcome, ${data.user.name}! 🚀`, 'success');
        onClose();
      } else {
        showToast(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      // Fallback
      const newUser = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone || "+91 98765 43210",
        role: "customer"
      };
      setUser(newUser);
      localStorage.setItem('dns_user', JSON.stringify(newUser));
      recordLogin();
      showToast(`Account created! Welcome, ${newUser.name}! 🚀`, 'success');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 text-lg">
              🛒
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {tab === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
              </h2>
              <p className="text-xs text-slate-500">Access orders, delivery addresses & saved lists</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl my-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 rounded-xl transition-all ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 rounded-xl transition-all ${
              tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email or Mobile Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginData.emailOrPhone}
                  onChange={(e) => setLoginData({ ...loginData, emailOrPhone: e.target.value })}
                  placeholder="abinash@example.com or +91 98765 43210"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            {/* Quick Demo Credentials Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFillDemoCustomer}
                className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl font-bold text-[11px] border border-brand-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Fill Demo Customer Credentials (abinash@example.com)</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Account</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  placeholder="e.g. Meher Abinash"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-fresh-600 hover:bg-fresh-700 text-white font-bold rounded-xl shadow-md shadow-fresh-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 pt-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
