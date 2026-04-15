'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Camera, Video, Mic, Presentation, Images, Settings, Sparkles, Zap, Shield, Cpu, Globe } from 'lucide-react';
import ArcReactorLogo from './ArcReactorLogo';

interface HomeViewProps {
  onNavigate: (tab: string, data?: { prompt?: string; topic?: string }) => void;
  translations: {
    welcomeToJarvis: string;
    welcomeSub: string;
    aiChat: string;
    photoStudio: string;
    videoEngine: string;
    voiceAssistant: string;
    slidesBuilder: string;
    mediaGallery: string;
    settings: string;
    quickActions: string;
    systemStatus: string;
    online: string;
    capabilities: string;
  };
  language: 'en' | 'ar';
}

export default function HomeView({ onNavigate, translations, language }: HomeViewProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour12: false }));
      setDate(now.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getGreeting = () => {
    if (language === 'ar') {
      const h = new Date().getHours();
      if (h < 12) return 'صباح الخير';
      if (h < 18) return 'مساء الخير';
      return 'مرحباً بك';
    }
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Welcome Back';
  };

  const modules = [
    { id: 'chat', icon: MessageSquare, color: '#00e5ff', label: translations.aiChat, desc: language === 'ar' ? 'محادثة ذكية' : 'Smart Chat' },
    { id: 'photo', icon: Camera, color: '#7c5cff', label: translations.photoStudio, desc: language === 'ar' ? 'إنشاء الصور' : 'Create Images' },
    { id: 'video', icon: Video, color: '#f59e0b', label: translations.videoEngine, desc: language === 'ar' ? 'إنشاء الفيديو' : 'Create Videos' },
    { id: 'voice', icon: Mic, color: '#0088cc', label: translations.voiceAssistant, desc: language === 'ar' ? 'تفاعل صوتي' : 'Voice Interaction' },
    { id: 'slides', icon: Presentation, color: '#10b981', label: translations.slidesBuilder, desc: language === 'ar' ? 'عروض تقديمية' : 'Presentations' },
    { id: 'gallery', icon: Images, color: '#a855f7', label: translations.mediaGallery, desc: language === 'ar' ? 'معرض الوسائط' : 'Media Gallery' },
  ];

  const capabilities = [
    { icon: Cpu, label: language === 'ar' ? 'معالجة AI' : 'AI Processing', color: '#00e5ff' },
    { icon: Zap, label: language === 'ar' ? 'سرعة فائقة' : 'Ultra Fast', color: '#f59e0b' },
    { icon: Shield, label: language === 'ar' ? 'آمن ومحمي' : 'Secure', color: '#10b981' },
    { icon: Globe, label: language === 'ar' ? 'متعدد اللغات' : 'Multi-language', color: '#7c5cff' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        {/* Arc Reactor Logo */}
        <div className="mb-4 relative">
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'scale(2.5)', opacity: 0.3 }}>
            <ArcReactorLogo size={80} />
          </div>
          <ArcReactorLogo size={120} />
        </div>

        {/* Title */}
        <h1 className="jarvis-text-shimmer text-2xl md:text-4xl font-black tracking-[0.2em] mb-2">
          J.A.R.V.I.S
        </h1>
        <p className="text-[9px] md:text-[10px] tracking-widest uppercase mb-1" style={{ color: '#90a8cc' }}>
          {language === 'ar' ? 'نظام ذكاء اصطناعي متقدم جداً' : 'Just A Rather Very Intelligent System'}
        </p>

        {/* Time & Greeting */}
        <div className="flex flex-col items-center mt-4 mb-6">
          <div className="text-3xl md:text-5xl font-mono tracking-[0.15em] mb-1" style={{ color: '#d0e4f8' }}>
            {time}
          </div>
          <p className="text-[13px] mb-1" style={{ color: '#00e5ff' }}>{getGreeting()}</p>
          <p className="text-[10px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{date}</p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
            <span className="text-[10px] tracking-wider uppercase" style={{ color: '#10b981' }}>{translations.online}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
            <span className="text-[10px] tracking-wider" style={{ color: '#90a8cc' }}>Session:</span>
            <span className="text-[10px] font-mono" style={{ color: '#00e5ff' }}>{formatUptime(uptime)}</span>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={12} style={{ color: '#00e5ff' }} />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
            {language === 'ar' ? 'الوحدات النمطية' : 'Modules'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {modules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => onNavigate(module.id)}
                className="jarvis-mod-card text-left jarvis-animate-fade-in group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${module.color}15`, border: `1px solid ${module.color}30` }}
                  >
                    <Icon size={16} style={{ color: module.color }} />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: module.color, boxShadow: `0 0 4px ${module.color}40` }} />
                </div>
                <h3 className="text-[11px] font-bold mb-0.5" style={{ color: '#d0e4f8' }}>{module.label}</h3>
                <p className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{module.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Capabilities */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={12} style={{ color: '#f59e0b' }} />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
            {translations.capabilities}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-xl transition-all hover:scale-105"
                style={{ background: `${cap.color}08`, border: `1px solid ${cap.color}15` }}
              >
                <Icon size={14} style={{ color: cap.color }} />
                <span className="text-[10px]" style={{ color: '#90a8cc' }}>{cap.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-24 md:pb-6">
        <div className="jarvis-hud-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.systemStatus}
            </span>
            <div className="jarvis-live">
              <div className="jarvis-live-dot" />
              <span>{translations.online}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-lg font-bold" style={{ color: '#00e5ff' }}>24</div>
              <div className="text-[8px] uppercase" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                {language === 'ar' ? 'رسائل' : 'Messages'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: '#7c5cff' }}>128</div>
              <div className="text-[8px] uppercase" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                {language === 'ar' ? 'صور' : 'Images'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>12</div>
              <div className="text-[8px] uppercase" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                {language === 'ar' ? 'فيديو' : 'Videos'}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: '#10b981' }}>8</div>
              <div className="text-[8px] uppercase" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                {language === 'ar' ? 'عروض' : 'Slides'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
