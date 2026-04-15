'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Camera, Video, Presentation } from 'lucide-react';

interface ReactorCoreProps {
  translations: {
    modules: string;
    systemStatus: string;
    session: string;
    aiGeneration: string;
    voiceAssistant: string;
    smartActions: string;
    downloadAll: string;
  };
  language: 'en' | 'ar';
}

export default function ReactorCore({ translations, language }: ReactorCoreProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [uptime, setUptime] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour12: false }));
      setDate(now.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
      
      // Set greeting based on time
      const h = now.getHours();
      if (language === 'ar') {
        if (h < 12) setGreeting('صباح الخير، سيدي.');
        else if (h < 18) setGreeting('مساء الخير، سيدي.');
        else setGreeting('سعيد بعودتك، سيدي.');
      } else {
        if (h < 12) setGreeting('Good morning, sir.');
        else if (h < 18) setGreeting('Good afternoon, sir.');
        else setGreeting('Good to have you back, sir.');
      }
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

  const quickActions = language === 'ar' ? [
    { label: 'صورة', icon: Camera },
    { label: 'فيديو', icon: Video },
    { label: 'عرض', icon: Presentation },
    { label: 'دردشة', icon: MessageSquare },
  ] : [
    { label: 'IMAGE', icon: Camera },
    { label: 'VIDEO', icon: Video },
    { label: 'SLIDES', icon: Presentation },
    { label: 'CHAT', icon: MessageSquare },
  ];

  const capabilities = language === 'ar' ? [
    { label: 'توليد AI', color: '#00e5ff' },
    { label: 'مساعد صوتي', color: '#0088cc' },
    { label: 'إجراءات ذكية', color: '#a855f7' },
    { label: 'تحميل الكل', color: '#10b981' },
  ] : [
    { label: 'AI Generation', color: '#00e5ff' },
    { label: 'Voice Assistant', color: '#0088cc' },
    { label: 'Smart Actions', color: '#a855f7' },
    { label: 'Download All', color: '#10b981' },
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* JARVIS Title */}
      <div className="flex flex-col items-center gap-3 jarvis-animate-fade-in">
        <div className="jarvis-arc">
          <h1 className="jarvis-text-shimmer text-3xl md:text-5xl font-black tracking-[0.22em]">
            J.A.R.V.I.S
          </h1>
        </div>
        <p className="text-[9px] tracking-widest uppercase" style={{ color: '#90a8cc' }}>
          {language === 'ar' ? 'نظام ذكاء اصطناعي متقدم جداً' : 'Just A Rather Very Intelligent System'}
        </p>
        <div className="jarvis-glow-line w-48 md:w-64" />
      </div>

      {/* Time */}
      <div className="flex flex-col items-center gap-1.5 jarvis-animate-fade-in jarvis-delay-200">
        <div className="text-2xl md:text-4xl font-mono tracking-[0.15em]" style={{ color: '#d0e4f8' }}>
          {mounted ? time : '--:--:--'}
        </div>
        <p className="text-[11px] jarvis-cursor-blink" style={{ color: '#90a8cc' }}>
          {mounted ? greeting : '...'}
        </p>
        <p className="text-[9px] tracking-wider" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
          {mounted ? date : '...'}
        </p>
      </div>

      {/* Reactor HUD Card */}
      <div className="jarvis-hud-card p-4 md:p-6 w-full max-w-[360px] jarvis-animate-slide-up jarvis-delay-300">
        {/* Top data flow line */}
        <div className="jarvis-data-flow mb-4 rounded-full" />

        {/* Reactor */}
        <div className="jarvis-reactor my-4">
          <div className="jarvis-reactor-ring jarvis-reactor-ring-1" />
          <div className="jarvis-reactor-ring jarvis-reactor-ring-2" />
          <div className="jarvis-reactor-ring jarvis-reactor-ring-3" />
          <div className="jarvis-reactor-ring jarvis-reactor-ring-4" />
          <div className="jarvis-reactor-core">
            <div className="jarvis-reactor-core-inner" />
          </div>
          {/* Orbiting dots */}
          <div className="jarvis-orbit-dot jarvis-orbit-dot-1" style={{ top: '50%', left: '50%' }} />
          <div className="jarvis-orbit-dot jarvis-orbit-dot-2" style={{ top: '50%', left: '50%' }} />
          <div className="jarvis-orbit-dot jarvis-orbit-dot-3" style={{ top: '50%', left: '50%' }} />
        </div>

        {/* Rotating status text */}
        <div className="flex justify-center -mt-1 mb-3">
          <div className="relative w-[200px] h-[20px] overflow-hidden">
            <div className="jarvis-rotating-text flex items-center justify-center text-[7px] tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ color: 'rgba(0, 229, 255, 0.4)' }}>
              <span>SYSTEM • ACTIVE • READY • SYSTEM • ACTIVE • READY • SYSTEM • ACTIVE • READY •</span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <div className="jarvis-badge" style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.15)', color: '#00e5ff' }}>
            <MessageSquare size={10} />
            <span>24 msgs</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(124, 92, 255, 0.08)', border: '1px solid rgba(124, 92, 255, 0.15)', color: '#7c5cff' }}>
            <Camera size={10} />
            <span>128 images</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Video size={10} />
            <span>12 videos</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Presentation size={10} />
            <span>8 slides</span>
          </div>
        </div>

        {/* Session uptime */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[8px] tracking-wider uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.session}</span>
          <span className="text-[11px] tracking-wider" style={{ color: '#d0e4f8' }}>{formatUptime(uptime)}</span>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            const colors = ['#00e5ff', '#7c5cff', '#f59e0b', '#00e5ff'];
            return (
              <div key={idx} className="jarvis-quick-action" style={{ color: colors[idx] }}>
                <Icon size={16} />
                <span>{action.label}</span>
              </div>
            );
          })}
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-2 gap-2">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="jarvis-capability">
              <div className="w-2 h-2 rounded-full" style={{ background: cap.color, boxShadow: `0 0 4px ${cap.color}40` }} />
              <span style={{ color: '#d0e4f8' }}>{cap.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom data flow line */}
        <div className="jarvis-data-flow mt-4 rounded-full" />
      </div>
    </div>
  );
}
