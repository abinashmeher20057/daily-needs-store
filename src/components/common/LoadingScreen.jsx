import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Zap, ShieldCheck, ShoppingBag, Sparkles, Bike, Check, 
  MapPin, Clock, Award, Star, Activity, ArrowRight, Radio
} from 'lucide-react';

export const LoadingScreen = ({ onFinished, duration = 2400 }) => {
  const { visitCount, loginCount, lastVisitTime, loyaltyTier, formatTimeAgo, deliveryLocation } = useStore();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Connecting to Hyperlocal Micro-Fulfillment Grid...');
  const [currentStep, setCurrentStep] = useState(1);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Stepper milestones
  const steps = [
    { id: 1, label: 'Micro-Hub Connect', threshold: 25 },
    { id: 2, label: '15 Aisle Catalogs', threshold: 50 },
    { id: 3, label: 'Live Stock & WhatsApp', threshold: 75 },
    { id: 4, label: '256-Bit SSL Ready', threshold: 100 }
  ];

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 25; // ms

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (currentProgress < 25) {
        setStatusText('Connecting to nearest micro-fulfillment hub & routing nodes...');
        setCurrentStep(1);
      } else if (currentProgress < 50) {
        setStatusText('Syncing 15 authentic daily categories with farm-fresh produce...');
        setCurrentStep(2);
      } else if (currentProgress < 75) {
        setStatusText('Verifying live inventory, MRP discounts & WhatsApp dispatch...');
        setCurrentStep(3);
      } else if (currentProgress < 100) {
        setStatusText('Securing 256-bit encrypted checkout & 12-minute delivery promise...');
        setCurrentStep(4);
      } else {
        setStatusText('Store ready! Welcome to Daily Needs Store 🛒');
        clearInterval(timer);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onFinished) onFinished();
          }, 650);
        }, 350);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, onFinished]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinished) onFinished();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#030712] text-white p-5 sm:p-8 overflow-hidden select-none transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none filter blur-sm' : 'opacity-100 scale-100 filter blur-0'
      }`}
    >
      {/* Background Ambient Glowing Meshes */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] bg-fresh-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[15%] w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating 3D Grocery Elements with Physics Glow */}
      <div className="absolute top-12 left-10 md:left-24 hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl shadow-brand-500/10 animate-bounce duration-[4000ms]">
        <span className="text-2xl">🌾</span>
        <div className="text-left">
          <div className="text-[10px] font-bold text-slate-300">Daawat Basmati</div>
          <div className="text-[9px] text-fresh-400 font-mono">₹145/kg • 100% Pure</div>
        </div>
      </div>

      <div className="absolute bottom-16 left-8 md:left-28 hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl shadow-fresh-500/10 animate-bounce duration-[5000ms]">
        <span className="text-2xl">🥛</span>
        <div className="text-left">
          <div className="text-[10px] font-bold text-slate-300">Amul Taaza Milk</div>
          <div className="text-[9px] text-fresh-400 font-mono">Fresh Stock • Chilled</div>
        </div>
      </div>

      <div className="absolute top-20 right-8 md:right-28 hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl shadow-amber-500/10 animate-bounce duration-[4500ms]">
        <span className="text-2xl">🍎</span>
        <div className="text-left">
          <div className="text-[10px] font-bold text-slate-300">Shimla Apples</div>
          <div className="text-[9px] text-amber-400 font-mono">Farm Crisp • 4.8★</div>
        </div>
      </div>

      <div className="absolute bottom-20 right-10 md:right-32 hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl shadow-brand-500/10 animate-bounce duration-[3800ms]">
        <span className="text-2xl">🪔</span>
        <div className="text-left">
          <div className="text-[10px] font-bold text-slate-300">Pooja Essentials</div>
          <div className="text-[9px] text-amber-300 font-mono">Pure Camphor & Diya</div>
        </div>
      </div>

      {/* TOP HEADER BAR */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Hyperlocal Radar Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">Hub:</span>
            <span className="text-white font-bold">{deliveryLocation.city} Express</span>
            <span className="text-slate-500">•</span>
            <span className="text-fresh-400 font-mono font-bold">12-Min ETA</span>
          </div>
        </div>

        {/* Skip Intro Pill */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-sm cursor-pointer shadow-sm active:scale-95"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* CENTERPIECE: ULTRA-PREMIUM GLASS CONTAINER */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center my-auto px-2">
        
        {/* Glow Ring Behind Logo */}
        <div className="relative mb-6">
          <div className="absolute -inset-6 bg-gradient-to-r from-brand-500 via-fresh-500 to-amber-500 rounded-full blur-2xl opacity-40 animate-pulse" />
          
          {/* Main 3D Cart Emblem */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-white/20 to-white/5 p-[1px] shadow-2xl shadow-brand-500/25">
            <div className="w-full h-full bg-[#0B1120]/90 backdrop-blur-2xl rounded-[23px] flex flex-col items-center justify-center p-3 border border-white/10">
              <span className="text-5xl sm:text-6xl filter drop-shadow-lg transform transition-transform hover:scale-110 duration-300">
                🛒
              </span>
            </div>
          </div>

          {/* Animated Satellites orbiting */}
          <div className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-brand-500/20 backdrop-blur-md border border-brand-400/40 flex items-center justify-center text-base shadow-lg animate-pulse">
            ⚡
          </div>
          <div className="absolute -bottom-2 -left-2 w-9 h-9 rounded-2xl bg-fresh-500/20 backdrop-blur-md border border-fresh-400/40 flex items-center justify-center text-base shadow-lg animate-pulse delay-200">
            🌱
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              Daily<span className="text-brand-400">Needs</span>
            </h1>
            <span className="text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-brand-500 to-fresh-500 text-white px-2.5 py-0.5 rounded-lg shadow-md shadow-brand-500/30">
              STORE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
            Flipkart Speed • 100% Farm-Fresh • Apple-Grade Elegance
          </p>
        </div>

        {/* VISITOR & LOGIN RECOGNITION BADGE (User Visit Counter) */}
        <div className="w-full max-w-md mb-6 p-3 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${loyaltyTier.badgeBg} flex items-center justify-center text-white font-black text-sm shadow-md`}>
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {visitCount > 1 ? `Welcome Back! Visit #${visitCount}` : `Welcome! First Visit (#1)`}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {loyaltyTier.badge}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {lastVisitTime ? `Last opened: ${formatTimeAgo(lastVisitTime)}` : 'First time exploring our store today'}
                {loginCount > 0 && ` • ${loginCount} Logins`}
              </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono text-fresh-400 font-bold flex items-center gap-1 justify-end">
              <Zap className="w-3 h-3 text-fresh-400" /> Fast-Track
            </div>
            <div className="text-[10px] text-slate-400 font-medium">12-Min Delivery</div>
          </div>
        </div>

        {/* PROGRESS BAR & LIVE STEP STATUS */}
        <div className="w-full max-w-md space-y-3">
          
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <span className="text-slate-300 font-medium text-left truncate max-w-[300px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-fresh-400 animate-spin" />
              {statusText}
            </span>
            <span className="font-mono text-fresh-400 font-black text-sm tracking-tight">
              {progress}%
            </span>
          </div>

          {/* Glowing Track */}
          <div className="w-full h-3 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 via-fresh-500 to-emerald-400 rounded-full transition-all duration-150 relative shadow-[0_0_15px_rgba(16,185,129,0.7)]"
              style={{ width: `${progress}%` }}
            >
              {/* Pulsing leading bead */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_10px_#ffffff] animate-ping" />
            </div>
          </div>

          {/* 4-Step Milestone Checklist */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {steps.map(step => {
              const isPassed = progress >= step.threshold;
              return (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                    isPassed 
                      ? 'bg-fresh-500/10 border-fresh-500/30 text-fresh-300' 
                      : 'bg-white/[0.02] border-white/5 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                    {isPassed ? (
                      <Check className="w-3 h-3 text-fresh-400 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    )}
                    <span className="hidden sm:inline truncate">{step.label}</span>
                    <span className="sm:hidden">{step.id}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* FOOTER BAR */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-Bit SSL Encrypted Micro-Fulfillment & WhatsApp Integration</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>🌾 15 Indian Essentials Categories</span>
          <span>•</span>
          <span>⚡ 12-Minute Free Delivery Over ₹499</span>
        </div>
      </div>

    </div>
  );
};
