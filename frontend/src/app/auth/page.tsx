'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth-context';
import { Activity, Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap, Shield, Brain, BarChart3 } from 'lucide-react';

const AuthScene = dynamic(() => import('@/components/three/AuthScene'), {
  ssr: false,
  loading: () => null,
});

const stats = [
  { value: '97.3%', label: 'Accuracy' },
  { value: '<10s', label: 'Inference' },
  { value: '50K+', label: 'Scans' },
  { value: '24/7', label: 'Available' },
];

const features = [
  { icon: Brain, title: 'ResNet50 Backbone', desc: 'Transfer learning on ImageNet with fine-tuned pneumonia layers' },
  { icon: Zap, title: 'Real-Time Grad-CAM', desc: 'Explainable AI heatmaps highlight regions of concern' },
  { icon: Shield, title: 'HIPAA-Aware', desc: 'Client-side processing — images never leave your browser' },
  { icon: BarChart3, title: 'Clinical Reports', desc: 'Export PDF diagnostic reports with full patient metadata' },
];

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = mode === 'signin'
        ? await login(email, password)
        : await signup(name, email, password);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Something went wrong.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [mode, name, email, password, login, signup, router]);

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-void">
      {/* Left Panel — Showcase */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <AuthScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-void/40 via-transparent to-void/80" />
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center">
              <Activity size={20} className="text-cyan" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Pneumo<span className="text-cyan">Vision</span>
            </span>
          </motion.div>

          {/* Center Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md"
          >
            <h1 className="font-display text-4xl xl:text-5xl font-bold leading-[1.1] mb-4">
              AI-Powered
              <br />
              <span className="bg-gradient-to-r from-cyan via-teal to-neon-blue bg-clip-text text-transparent">
                Chest X-Ray
              </span>
              <br />
              Diagnostics
            </h1>
            <p className="text-muted text-base leading-relaxed">
              Clinical-grade pneumonia screening with explainable AI.
              Upload a chest radiograph and get instant results with
              Grad-CAM localization heatmaps.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex flex-col"
              >
                <span className="text-2xl font-display font-bold text-cyan text-glow-cyan">{stat.value}</span>
                <span className="text-xs font-mono text-muted uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-abyss via-void to-ink" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan/20 to-transparent hidden lg:block" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center">
              <Activity size={20} className="text-cyan" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Pneumo<span className="text-cyan">Vision</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 p-1 rounded-xl bg-ink/80 border border-line/50">
            {(['signin', 'signup'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(''); }}
                className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  mode === tab ? 'text-bright' : 'text-muted hover:text-secondary'
                }`}
              >
                {mode === tab && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-lg bg-slate border border-cyan/20 shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab === 'signin' ? 'Sign In' : 'Sign Up'}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-cyan transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      required={mode === 'signup'}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-ink border border-line/70 text-bright placeholder:text-muted/50 focus:border-cyan/50 focus:shadow-[0_0_20px_rgba(0,240,255,0.08)] transition-all duration-300 outline-none text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-cyan transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-ink border border-line/70 text-bright placeholder:text-muted/50 focus:border-cyan/50 focus:shadow-[0_0_20px_rgba(0,240,255,0.08)] transition-all duration-300 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-cyan transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-ink border border-line/70 text-bright placeholder:text-muted/50 focus:border-cyan/50 focus:shadow-[0_0_20px_rgba(0,240,255,0.08)] transition-all duration-300 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-bright transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-signal-red text-xs font-mono px-1"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan via-teal to-cyan text-void font-display font-semibold text-sm tracking-wide flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 rounded-full border-2 border-void border-t-transparent animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-line/50" />
            <span className="text-xs font-mono text-muted">or continue with</span>
            <div className="flex-1 h-px bg-line/50" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-ink border border-line/50 hover:border-cyan/30 text-muted hover:text-bright flex items-center justify-center gap-2 text-sm transition-all duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex-1 py-3 rounded-xl bg-ink border border-line/50 hover:border-cyan/30 text-muted hover:text-bright flex items-center justify-center gap-2 text-sm transition-all duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Features (Mobile) */}
          <div className="mt-10 lg:hidden grid grid-cols-2 gap-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-3 rounded-xl bg-ink/50 border border-line/30">
                  <Icon size={16} className="text-cyan mb-1.5" />
                  <p className="text-xs font-medium text-bright">{f.title}</p>
                  <p className="text-[10px] text-muted mt-0.5 leading-snug">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted/60 mt-8 font-mono">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
