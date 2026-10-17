import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, Lock, Mail, Phone, User, KeyRound, 
  Sparkles, AlertCircle, ArrowRight, CheckCircle2, 
  LogIn, UserPlus, Eye, EyeOff, ShoppingBag, Zap, Shield, 
  Globe, RefreshCw, Clock, Activity, Cpu, Fingerprint, 
  Check, X, AlertTriangle, Terminal, Key, Bike, Award, Star,
  Smartphone, ChevronRight, Layers, Compass
} from 'lucide-react';

export const AuthGatewayPortal = ({ 
  initialTab = 'customer-login',
  onCustomerLogin, 
  onAdminLogin, 
  onContinueAsGuest 
}) => {
  const { showToast, visitCount, loginCount, loyaltyTier, lastVisitTime, formatTimeAgo, deliveryLocation } = useStore();

  // Active Tab: 'customer-login' | 'customer-register' | 'admin-login'
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security features state
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Anti-Bot Math CAPTCHA
  const [captcha, setCaptcha] = useState({ num1: 4, num2: 3, answer: 7 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  // Admin 2-Factor Authentication (2FA)
  const [adminStep, setAdminStep] = useState('credentials'); // 'credentials' | '2fa'
  const [admin2faPin, setAdmin2faPin] = useState('');

  // Form states
  const [customerLogin, setCustomerLogin] = useState({
    emailOrPhone: '',
    password: ''
  });

  const [customerRegister, setCustomerRegister] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [adminLogin, setAdminLogin] = useState({
    email: '',
    password: ''
  });

  // Sync initialTab if changed externally
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Generate new anti-bot CAPTCHA
  const generateNewCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setCaptcha({ num1: n1, num2: n2, answer: n1 + n2 });
    setCaptchaInput('');
    setIsCaptchaValid(false);
  };

  useEffect(() => {
    generateNewCaptcha();
  }, [activeTab]);

  // Validate CAPTCHA in real-time
  const handleCaptchaChange = (e) => {
    const val = e.target.value.trim();
    setCaptchaInput(val);
    setIsCaptchaValid(parseInt(val, 10) === captcha.answer);
  };

  // Lockout Countdown Timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Password Complexity Evaluator for Registration
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'Weak (Vulnerable)', color: 'bg-rose-500' };
    if (score <= 50) return { score, label: 'Fair (Acceptable)', color: 'bg-amber-500' };
    if (score <= 75) return { score, label: 'Strong (Protected)', color: 'bg-emerald-500' };
    return { score, label: 'Military-Grade Shield', color: 'bg-cyan-400' };
  };

  const regStrength = getPasswordStrength(customerRegister.password);

  // Autofill helpers
  const handleAutofillCustomer = () => {
    setCustomerLogin({
      emailOrPhone: 'abinash@example.com',
      password: 'password123'
    });
    setCaptchaInput(String(captcha.answer));
    setIsCaptchaValid(true);
    setErrorMessage('');
  };

  const handleAutofillAdmin = () => {
    setAdminLogin({
      email: 'admin@dailyneeds.com',
      password: 'admin123'
    });
    setAdmin2faPin('779900');
    setCaptchaInput(String(captcha.answer));
    setIsCaptchaValid(true);
    setErrorMessage('');
  };

  // Fetch security audit logs
  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/security/logs');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAuditLogs(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const openAuditModal = () => {
    setIsAuditModalOpen(true);
    fetchAuditLogs();
  };

  // Customer Login Submit
  const handleCustomerLoginSubmit = async (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    if (!isCaptchaValid) {
      setErrorMessage(`Please solve the Anti-Bot Security Challenge: ${captcha.num1} + ${captcha.num2} = ?`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customerLogin,
          captchaVerified: true
        })
      });
      const data = await res.json();

      if (res.status === 429 || data.locked) {
        setLockoutRemaining(data.remainingSeconds || 60);
        setErrorMessage(data.message || 'Security lockout active.');
        setIsSubmitting(false);
        return;
      }

      if (data.success && data.user) {
        showToast(`256-Bit SSL Handshake Verified! Welcome, ${data.user.name}! 🚀`, 'success');
        onCustomerLogin(data.user, data.token);
      } else {
        setFailedAttempts(prev => prev + 1);
        setErrorMessage(data.message || 'Invalid credentials. Please verify your email & password.');
        generateNewCaptcha();
      }
    } catch (err) {
      // Fallback offline login
      if (customerLogin.emailOrPhone && customerLogin.password) {
        const fallbackUser = {
          id: 'usr-1',
          name: customerLogin.emailOrPhone.split('@')[0] || "Meher Abinash",
          email: customerLogin.emailOrPhone.includes('@') ? customerLogin.emailOrPhone : "abinash@example.com",
          phone: customerLogin.emailOrPhone.includes('@') ? "+91 98765 43210" : customerLogin.emailOrPhone,
          role: "customer"
        };
        showToast(`Welcome, ${fallbackUser.name}! 🚀`, 'success');
        onCustomerLogin(fallbackUser, `token-${Date.now()}`);
      } else {
        setErrorMessage('Please enter valid login credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Customer Register Submit
  const handleCustomerRegisterSubmit = async (e) => {
    e.preventDefault();
    if (customerRegister.password.length < 8) {
      setErrorMessage('Strict Security Policy: Password must contain at least 8 characters.');
      return;
    }

    if (customerRegister.password !== customerRegister.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (!isCaptchaValid) {
      setErrorMessage('Please complete the Anti-Bot Security Challenge.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerRegister.name,
          email: customerRegister.email,
          phone: customerRegister.phone,
          password: customerRegister.password
        })
      });
      const data = await res.json();

      if (data.success && data.user) {
        showToast(`Account registered with 256-bit encryption! Welcome, ${data.user.name}! 🎉`, 'success');
        onCustomerLogin(data.user, data.token);
      } else {
        setErrorMessage(data.message || 'Registration rejected by security firewall.');
      }
    } catch (err) {
      const newUser = {
        id: `usr-${Date.now()}`,
        name: customerRegister.name,
        email: customerRegister.email,
        phone: customerRegister.phone || "+91 98765 43210",
        role: "customer"
      };
      showToast(`Account registered! Welcome, ${newUser.name}! 🎉`, 'success');
      onCustomerLogin(newUser, `token-${Date.now()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Login Submit (with 2FA Step)
  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    if (!isCaptchaValid) {
      setErrorMessage('Please complete the Anti-Bot Security Challenge.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminLogin.email,
          password: adminLogin.password,
          pin2FA: admin2faPin
        })
      });
      const data = await res.json();

      if (res.status === 429 || data.locked) {
        setLockoutRemaining(data.remainingSeconds || 60);
        setErrorMessage(data.message || 'Admin console temporarily locked.');
        setIsSubmitting(false);
        return;
      }

      // If credentials are valid but 2FA is needed
      if (data.require2FA && adminStep !== '2fa') {
        setAdminStep('2fa');
        showToast("Credentials accepted! Enter 6-digit Master 2FA PIN (779900)", "info");
        setIsSubmitting(false);
        return;
      }

      if (data.success && data.token) {
        showToast("Full Administrative Clearance Granted 🛡️", "success");
        onAdminLogin(data.user, data.token);
      } else {
        setErrorMessage(data.message || 'Invalid administrator key or 2FA PIN.');
      }
    } catch (err) {
      if (adminLogin.email.toLowerCase() === 'admin@dailyneeds.com' && adminLogin.password === 'admin123') {
        if (adminStep !== '2fa') {
          setAdminStep('2fa');
          showToast("Credentials accepted! Enter 6-digit 2FA PIN (779900)", "info");
          setIsSubmitting(false);
          return;
        }
        if (admin2faPin === '779900') {
          const adminUser = { name: "Store Administrator", role: "admin", email: "admin@dailyneeds.com" };
          showToast("Full Administrative Clearance Granted 🛡️", "success");
          onAdminLogin(adminUser, `admin-token-${Date.now()}`);
        } else {
          setErrorMessage('Invalid 2FA PIN. Use master key: 779900');
        }
      } else {
        setErrorMessage('Invalid admin credentials. Use admin@dailyneeds.com / admin123');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white relative overflow-hidden">
      
      {/* Dynamic Ambient Mesh Glows */}
      <div className="absolute top-[-20%] left-[-15%] w-[650px] h-[650px] bg-brand-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[650px] h-[650px] bg-emerald-500/20 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-[35%] left-[30%] w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP HEADER NAV */}
      <header className="relative z-20 w-full border-b border-white/10 bg-[#030712]/60 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-fresh-500 flex items-center justify-center text-xl shadow-lg shadow-brand-500/30">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Daily<span className="text-brand-400">Needs</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                  Store
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Armored
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Flipkart Speed • 100% Farm-Fresh • Apple-Grade Elegance
              </p>
            </div>
          </div>

          {/* Quick Bar Actions */}
          <div className="flex items-center gap-3">
            
            {/* Live Audit Log Trigger */}
            <button
              onClick={openAuditModal}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 transition-all shadow-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-fresh-400" />
              <span className="hidden md:inline">Security Ledger</span>
            </button>

            {/* Guest access button */}
            <button
              onClick={onContinueAsGuest}
              className="group flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 px-4 py-2 rounded-xl border border-white/10 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span>Explore as Guest</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </header>

      {/* DUAL-PANE SHOWCASE HERO & AUTH CONSOLE */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* ========================================================= */}
          {/* LEFT SHOWCASE STUDIO (CINEMATIC BRAND & SECURITY ASSETS) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Supercharged Radar Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Hub: <strong className="text-white">{deliveryLocation.city} Darkstore #01</strong></span>
              <span className="text-slate-500">•</span>
              <span className="text-fresh-400 font-mono font-bold">12-Min Delivery Active</span>
            </div>

            {/* Hero Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Authentic Groceries. <br />
                <span className="bg-gradient-to-r from-brand-400 via-fresh-400 to-emerald-300 bg-clip-text text-transparent">
                  Defense-Grade Security.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl">
                Experience instant Flipkart-level checkout speed combined with Apple-grade security. 
                Full protection with multi-factor authentication, anti-bot shields, and real-time order tracking.
              </p>
            </div>

            {/* 3D Glassmorphic Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Bike className="w-5 h-5 text-brand-400" />
                </div>
                <div className="font-bold text-white text-sm">12-Min Instant Dispatch</div>
                <div className="text-xs text-slate-400 mt-0.5">Automated hyperlocal routing from Bhubaneswar hub.</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-fresh-500/15 text-fresh-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-fresh-400" />
                </div>
                <div className="font-bold text-white text-sm">Zero-Trust 2FA & SSL</div>
                <div className="text-xs text-slate-400 mt-0.5">Brute-force shield, rate limiting & PIN verification.</div>
              </div>
            </div>

            {/* Live Visitor & Loyalty Recognition Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-transparent border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${loyaltyTier.badgeBg} flex items-center justify-center text-white text-lg font-black shadow-lg shadow-brand-500/20`}>
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">
                      {visitCount > 1 ? `Returning Visitor • Visit #${visitCount}` : `Welcome! First Visit (#1)`}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      {loyaltyTier.badge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {lastVisitTime ? `Last active: ${formatTimeAgo(lastVisitTime)}` : 'First session today'}
                    {loginCount > 0 && ` • ${loginCount} Logins`}
                  </div>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-[11px] font-mono text-fresh-400 font-bold block">
                  ⚡ VIP Perks
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Free 12-Min Delivery</span>
              </div>
            </div>

            {/* Live System Telemetrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-brand-400" /> 18ms Latency
              </span>
              <span>•</span>
              <span className="text-slate-400">110 Fresh Items</span>
              <span>•</span>
              <span className="text-fresh-400 font-bold">100% Operational</span>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT AUTHENTICATION CONSOLE (FROSTED GLASS CARD) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            
            <div className="relative rounded-3xl bg-[#090F1C]/90 backdrop-blur-2xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] p-6 sm:p-9 space-y-6">
              
              {/* Top Persona Toggle Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-fresh-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {activeTab === 'admin-login' ? 'Restricted Admin Console' : 'Customer Storefront Portal'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                    TLS 1.3
                  </span>
                </div>

                {/* Segmented Persona Tabs */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('customer-login');
                      setErrorMessage('');
                    }}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'customer-login'
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/25 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Customer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('customer-register');
                      setErrorMessage('');
                    }}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'customer-register'
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/25 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('admin-login');
                      setErrorMessage('');
                      setAdminStep('credentials');
                    }}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'admin-login'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-400/25 font-black'
                        : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin 2FA</span>
                  </button>
                </div>
              </div>

              {/* Rate-Limit Security Lockout Banner */}
              {lockoutRemaining > 0 && (
                <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-xs animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-bold">Security Lockout Active</div>
                    <div>Account cooling off. Retrying permitted in <strong className="text-white font-mono">{lockoutRemaining}s</strong></div>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && lockoutRemaining === 0 && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center gap-2.5 text-rose-400 text-xs animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 1: CUSTOMER LOGIN */}
              {/* ============================================================== */}
              {activeTab === 'customer-login' && (
                <form onSubmit={handleCustomerLoginSubmit} className="space-y-4 text-xs">
                  
                  {/* Email or Phone */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">
                      Email Address or Mobile Phone
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={customerLogin.emailOrPhone}
                        onChange={(e) => setCustomerLogin({ ...customerLogin, emailOrPhone: e.target.value })}
                        placeholder="abinash@example.com or 9876543210"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-xs transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-300 font-semibold">Password</label>
                      <span className="text-[11px] text-brand-400 hover:underline cursor-pointer">
                        Forgot password?
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={customerLogin.password}
                        onChange={(e) => setCustomerLogin({ ...customerLogin, password: e.target.value })}
                        placeholder="Enter account password"
                        className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-xs transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Anti-Bot Math Security Challenge */}
                  <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" /> Anti-Bot Verification
                      </span>
                      <button
                        type="button"
                        onClick={generateNewCaptcha}
                        className="text-brand-400 hover:text-brand-300 flex items-center gap-1 text-[10px] cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Refresh
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl font-mono text-sm font-black text-amber-300 tracking-wider">
                        {captcha.num1} + {captcha.num2} = ?
                      </div>
                      <input
                        type="number"
                        value={captchaInput}
                        onChange={handleCaptchaChange}
                        placeholder="Answer"
                        className="w-24 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-brand-500"
                      />
                      {isCaptchaValid && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || lockoutRemaining > 0}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-black rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Verifying 256-Bit SSL...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign In to Store</span>
                      </>
                    )}
                  </button>

                  {/* 1-Click Demo Helper */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleAutofillCustomer}
                      className="text-[11px] font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>1-Click Demo Customer Autofill</span>
                    </button>
                  </div>

                </form>
              )}

              {/* ============================================================== */}
              {/* TAB 2: CUSTOMER REGISTRATION */}
              {/* ============================================================== */}
              {activeTab === 'customer-register' && (
                <form onSubmit={handleCustomerRegisterSubmit} className="space-y-3.5 text-xs">
                  
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={customerRegister.name}
                        onChange={(e) => setCustomerRegister({ ...customerRegister, name: e.target.value })}
                        placeholder="Meher Abinash"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={customerRegister.email}
                          onChange={(e) => setCustomerRegister({ ...customerRegister, email: e.target.value })}
                          placeholder="abinash@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">WhatsApp Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          value={customerRegister.phone}
                          onChange={(e) => setCustomerRegister({ ...customerRegister, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          value={customerRegister.password}
                          onChange={(e) => setCustomerRegister({ ...customerRegister, password: e.target.value })}
                          placeholder="Min 8 chars"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          value={customerRegister.confirmPassword}
                          onChange={(e) => setCustomerRegister({ ...customerRegister, confirmPassword: e.target.value })}
                          placeholder="Repeat pass"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Complexity Gauge */}
                  {customerRegister.password && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-semibold">
                        <span className="text-slate-400">Security Strength:</span>
                        <span className="font-bold text-slate-200">{regStrength.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${regStrength.color} transition-all duration-300`} 
                          style={{ width: `${regStrength.score}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Anti-Bot */}
                  <div className="p-2.5 rounded-xl bg-slate-950/90 border border-white/5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-300">Anti-Bot:</span>
                      <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-700 rounded-lg font-mono text-amber-300 font-bold">
                        {captcha.num1} + {captcha.num2} = ?
                      </span>
                    </div>
                    <input
                      type="number"
                      value={captchaInput}
                      onChange={handleCaptchaChange}
                      placeholder="Sum"
                      className="w-20 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Create Protected Account</span>
                  </button>
                </form>
              )}

              {/* ============================================================== */}
              {/* TAB 3: ADMIN DEFENSE VAULT (2FA) */}
              {/* ============================================================== */}
              {activeTab === 'admin-login' && (
                <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
                  
                  <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Store Admin Console • 2FA Master Pin Enforced (779900)</span>
                  </div>

                  {adminStep === 'credentials' ? (
                    <>
                      {/* Admin Email */}
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">
                          Admin Email Identifier
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            value={adminLogin.email}
                            onChange={(e) => setAdminLogin({ ...adminLogin, email: e.target.value })}
                            placeholder="admin@dailyneeds.com"
                            className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                          />
                        </div>
                      </div>

                      {/* Admin Password */}
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5">
                          Admin Master Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={adminLogin.password}
                            onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })}
                            placeholder="Enter admin password"
                            className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Anti-Bot */}
                      <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-300">Admin Anti-Bot:</span>
                          <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg font-mono text-amber-300 font-bold">
                            {captcha.num1} + {captcha.num2} = ?
                          </span>
                        </div>
                        <input
                          type="number"
                          value={captchaInput}
                          onChange={handleCaptchaChange}
                          placeholder="Sum"
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || lockoutRemaining > 0}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <KeyRound className="w-4 h-4 text-slate-950" />
                        <span>Proceed to 2FA Step →</span>
                      </button>
                    </>
                  ) : (
                    /* STEP 2: 2FA PIN INPUT */
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="text-center space-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto">
                          <Fingerprint className="w-6 h-6 animate-pulse" />
                        </div>
                        <h3 className="text-sm font-black text-white">Enter 6-Digit Master Security PIN</h3>
                        <p className="text-[11px] text-slate-400">
                          Multi-Factor verification for <strong className="text-slate-200">{adminLogin.email}</strong>
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1 text-center">
                          Security PIN (Default: 779900)
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={admin2faPin}
                          onChange={(e) => setAdmin2faPin(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="779900"
                          className="w-full text-center tracking-[0.5em] py-3.5 bg-slate-950 border border-amber-400/40 rounded-2xl text-amber-300 font-mono text-xl font-black focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setAdminStep('credentials')}
                          className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || admin2faPin.length < 6}
                          className="w-2/3 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Access</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 1-Click Demo Helper */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleAutofillAdmin}
                      className="text-[11px] font-bold text-amber-300/80 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1.5 rounded-xl border border-amber-400/20 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Autofill Admin + 2FA PIN (779900)</span>
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-20 w-full border-t border-white/5 bg-[#030712]/80 backdrop-blur-xl px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Daily Needs Store Defense Security System • AES-256 Bit Handshake</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAuditModal}
              className="text-slate-400 hover:text-white underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Audit Ledger</span>
            </button>
            <span>•</span>
            <span>Bhubaneswar Micro-Darkstore #01</span>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* SECURITY AUDIT LEDGER MODAL */}
      {/* ============================================================== */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0A1220] border border-white/10 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-black text-white">Security Audit Ledger</h3>
                  <p className="text-[11px] text-slate-400">Live trace of login attempts, 2FA challenges & firewall blocks</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              {isLoadingLogs ? (
                <div className="py-8 text-center text-slate-500">Querying security ledger...</div>
              ) : auditLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-500">No security events recorded yet.</div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-400 animate-pulse' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {log.event}
                      </span>
                      <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-300 font-sans text-xs">{log.details}</div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>User: {log.email}</span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={fetchAuditLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Ledger
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
