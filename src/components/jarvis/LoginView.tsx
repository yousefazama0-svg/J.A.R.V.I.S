'use client';

import React, { useState, useCallback } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import ArcReactorLogo from './ArcReactorLogo';

interface LoginViewProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
  language: 'en' | 'ar';
  translations: {
    welcomeBack: string;
    loginToContinue: string;
    email: string;
    password: string;
    signIn: string;
    signUp: string;
    noAccount: string;
    hasAccount: string;
    name: string;
    createAccount: string;
    orContinueAs: string;
    guest: string;
    loggingIn: string;
    loginSuccess: string;
    loginError: string;
    forgotPassword: string;
  };
}

type AuthMode = 'login' | 'register';

export default function LoginView({ isOpen, onClose, onLogin, language, translations }: LoginViewProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال الاسم' : 'Please enter your name');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo, accept any valid email format
    if (email.includes('@') && password.length >= 4) {
      setSuccess(translations.loginSuccess);
      setTimeout(() => {
        onLogin({ 
          name: name || email.split('@')[0], 
          email 
        });
        onClose();
      }, 1000);
    } else {
      setError(translations.loginError);
    }

    setIsLoading(false);
  }, [email, password, name, mode, language, translations, onLogin, onClose]);

  const handleGuestLogin = useCallback(() => {
    onLogin({ 
      name: 'Guest', 
      email: 'guest@jarvis.ai' 
    });
    onClose();
  }, [onLogin, onClose]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    setSuccess(null);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    resetForm();
  }, [resetForm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md jarvis-animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md jarvis-hud-card p-6 md:p-8 jarvis-animate-slide-up"
        style={{ borderRadius: '24px' }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-all hover:bg-[#0e1a3a]"
        >
          <X size={18} style={{ color: '#90a8cc' }} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            <ArcReactorLogo size={60} />
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: '#d0e4f8' }}>
            {translations.welcomeBack}
          </h2>
          <p className="text-[11px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
            {translations.loginToContinue}
          </p>
        </div>

        {/* Error/Success messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg jarvis-animate-fade-in" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertCircle size={14} style={{ color: '#ef4444' }} />
            <span className="text-[11px]" style={{ color: '#ef4444' }}>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg jarvis-animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle size={14} style={{ color: '#10b981' }} />
            <span className="text-[11px]" style={{ color: '#10b981' }}>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(144, 168, 204, 0.5)' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={translations.name}
                className="w-full py-3 pl-10 pr-4 rounded-xl text-[13px] outline-none transition-all"
                style={{ 
                  background: 'rgba(0, 229, 255, 0.04)', 
                  border: '1px solid rgba(0, 229, 255, 0.1)',
                  color: '#d0e4f8'
                }}
              />
            </div>
          )}
          
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(144, 168, 204, 0.5)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translations.email}
              className="w-full py-3 pl-10 pr-4 rounded-xl text-[13px] outline-none transition-all"
              style={{ 
                background: 'rgba(0, 229, 255, 0.04)', 
                border: '1px solid rgba(0, 229, 255, 0.1)',
                color: '#d0e4f8'
              }}
            />
          </div>
          
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(144, 168, 204, 0.5)' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={translations.password}
              className="w-full py-3 pl-10 pr-4 rounded-xl text-[13px] outline-none transition-all"
              style={{ 
                background: 'rgba(0, 229, 255, 0.04)', 
                border: '1px solid rgba(0, 229, 255, 0.1)',
                color: '#d0e4f8'
              }}
            />
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="text-[10px] transition-colors hover:text-[#00e5ff]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.forgotPassword}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
            style={{
              background: isLoading ? 'rgba(0, 229, 255, 0.1)' : 'linear-gradient(135deg, #00e5ff, #7c5cff)',
              color: '#060a14',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: isLoading ? 'none' : '0 0 30px rgba(0, 229, 255, 0.3)'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {translations.loggingIn}
              </>
            ) : (
              <>
                {mode === 'login' ? translations.signIn : translations.createAccount}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-4 text-center">
          <button
            onClick={toggleMode}
            className="text-[11px] transition-colors hover:text-[#00e5ff]"
            style={{ color: 'rgba(144, 168, 204, 0.5)' }}
          >
            {mode === 'login' ? translations.noAccount : translations.hasAccount}
            <span className="ml-1 font-bold" style={{ color: '#00e5ff' }}>
              {mode === 'login' ? translations.signUp : translations.signIn}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent)' }} />
          <span className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>
            {translations.orContinueAs}
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2), transparent)' }} />
        </div>

        {/* Guest login */}
        <button
          onClick={handleGuestLogin}
          className="w-full py-3 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all"
          style={{
            background: 'rgba(0, 229, 255, 0.06)',
            border: '1px solid rgba(0, 229, 255, 0.15)',
            color: '#90a8cc'
          }}
        >
          {translations.guest}
        </button>
      </div>
    </div>
  );
}
