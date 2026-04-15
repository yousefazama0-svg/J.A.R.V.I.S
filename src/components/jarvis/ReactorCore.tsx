/* eslint-disable react-hooks/set-state-in-effect */
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
  const [time, setTime] = useState('--:--:--');
  const [date, setDate] = useState('...');
  const [uptime, setUptime] = useState(0);
  const [greeting, setGreeting] = useState('...');
  const [isClient, setIsClient] = useState(false);

  // Set client after mount - valid pattern for hydration detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
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
  }, [language, isClient]);

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
    { label: 'توليد AI', color: '#00b4ff' },
    { label: 'مساعد صوتي', color: '#0096ff' },
    { label: 'إجراءات ذكية', color: '#00d4ff' },
    { label: 'تحميل الكل', color: '#00a8ff' },
  ] : [
    { label: 'AI Generation', color: '#00b4ff' },
    { label: 'Voice Assistant', color: '#0096ff' },
    { label: 'Smart Actions', color: '#00d4ff' },
    { label: 'Download All', color: '#00a8ff' },
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
          {time}
        </div>
        <p className="text-[11px] jarvis-cursor-blink" style={{ color: '#90a8cc' }}>
          {greeting}
        </p>
        <p className="text-[9px] tracking-wider" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
          {date}
        </p>
      </div>

      {/* Reactor HUD Card */}
      <div className="jarvis-hud-card p-4 md:p-6 w-full max-w-[400px] jarvis-animate-slide-up jarvis-delay-300">
        {/* Top data flow line */}
        <div className="jarvis-data-flow mb-4 rounded-full" />

        {/* Enhanced Reactor - Tony Stark Style */}
        <div className="jarvis-reactor my-6">
          {/* Outer rotating ring 1 */}
          <div className="jarvis-reactor-ring jarvis-reactor-ring-1" />
          
          {/* Segmented ring 2 */}
          <div className="jarvis-reactor-ring jarvis-reactor-ring-2" />
          
          {/* Energy ring 3 */}
          <div className="jarvis-reactor-ring jarvis-reactor-ring-3" />
          
          {/* Core frame ring 4 */}
          <div className="jarvis-reactor-ring jarvis-reactor-ring-4" />
          
          {/* Main core */}
          <div className="jarvis-reactor-core">
            <div className="jarvis-reactor-core-inner" />
          </div>
          
          {/* Orbiting particles with enhanced effects */}
          <div className="jarvis-orbit-dot jarvis-orbit-dot-1" style={{ top: '50%', left: '50%' }} />
          <div className="jarvis-orbit-dot jarvis-orbit-dot-2" style={{ top: '50%', left: '50%' }} />
          <div className="jarvis-orbit-dot jarvis-orbit-dot-3" style={{ top: '50%', left: '50%' }} />
        </div>

        {/* Rotating status text */}
        <div className="flex justify-center -mt-2 mb-4">
          <div className="relative w-[240px] h-[20px] overflow-hidden">
            <div className="jarvis-rotating-text flex items-center justify-center text-[7px] tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ color: 'rgba(0, 180, 255, 0.5)' }}>
              <span>ARC REACTOR • ONLINE • POWER STABLE • ARC REACTOR • ONLINE • POWER STABLE • ARC REACTOR • ONLINE • POWER STABLE •</span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <div className="jarvis-badge" style={{ background: 'rgba(0, 180, 255, 0.1)', border: '1px solid rgba(0, 180, 255, 0.2)', color: '#00b4ff' }}>
            <MessageSquare size={10} />
            <span>24 msgs</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 150, 255, 0.1)', border: '1px solid rgba(0, 150, 255, 0.2)', color: '#0096ff' }}>
            <Camera size={10} />
            <span>128 images</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 200, 255, 0.1)', border: '1px solid rgba(0, 200, 255, 0.2)', color: '#00c8ff' }}>
            <Video size={10} />
            <span>12 videos</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 168, 255, 0.1)', border: '1px solid rgba(0, 168, 255, 0.2)', color: '#00a8ff' }}>
            <Presentation size={10} />
            <span>8 slides</span>
          </div>
        </div>

        {/* Session uptime */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[8px] tracking-wider uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.session}</span>
          <span className="text-[11px] tracking-wider font-mono" style={{ color: '#00b4ff' }}>{formatUptime(uptime)}</span>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            const colors = ['#00b4ff', '#0096ff', '#00d4ff', '#00a8ff'];
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
              <div className="w-2 h-2 rounded-full" style={{ background: cap.color, boxShadow: `0 0 6px ${cap.color}60` }} />
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
