'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
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

// Empty subscription for client-side detection
const emptySubscribe = () => () => {};

/**
 * Iron Man Arc Reactor Core Component
 * Features a movie-accurate arc reactor with ultra-smooth animations
 */
export default function ReactorCore({ translations, language }: ReactorCoreProps) {
  // Use useSyncExternalStore to detect client-side rendering without setState in effect
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  
  const [time, setTime] = useState('--:--:--');
  const [date, setDate] = useState('...');
  const [uptime, setUptime] = useState(0);
  const [greeting, setGreeting] = useState('...');

  useEffect(() => {
    if (!isClient) return;
    
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour12: false }));
      setDate(now.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
      
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
    { label: 'توليد AI', color: '#00e5ff' },
    { label: 'مساعد صوتي', color: '#00bcd4' },
    { label: 'إجراءات ذكية', color: '#0097a7' },
    { label: 'تحميل الكل', color: '#00acc1' },
  ] : [
    { label: 'AI Generation', color: '#00e5ff' },
    { label: 'Voice Assistant', color: '#00bcd4' },
    { label: 'Smart Actions', color: '#0097a7' },
    { label: 'Download All', color: '#00acc1' },
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
      <div className="jarvis-hud-card p-4 md:p-6 w-full max-w-[420px] jarvis-animate-slide-up jarvis-delay-300">
        {/* Top data flow line */}
        <div className="jarvis-data-flow mb-4 rounded-full" />

        {/* Iron Man Arc Reactor */}
        <div className="jarvis-reactor-iron-man my-6">
          {/* Outer Glow */}
          <div className="reactor-glow-outer" />
          
          {/* Main Reactor SVG */}
          <svg viewBox="0 0 200 200" className="reactor-svg">
            <defs>
              <radialGradient id="coreGradientIronMan" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#e0f8ff" />
                <stop offset="40%" stopColor="#00e5ff" />
                <stop offset="60%" stopColor="#00bcd4" />
                <stop offset="100%" stopColor="#006064" />
              </radialGradient>
              <radialGradient id="coreGlowIronMan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="40%" stopColor="rgba(0,229,255,0.5)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="glowIronMan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="strongGlowIronMan" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Outer Ring - 10 Segments */}
            <g className="reactor-ring-slow" style={{ transformOrigin: '100px 100px' }}>
              {[...Array(10)].map((_, i) => (
                <path
                  key={`outer-${i}`}
                  d="M 100 8 L 104 20 L 96 20 Z"
                  fill="rgba(0, 200, 255, 0.65)"
                  transform={`rotate(${i * 36}, 100, 100)`}
                  filter="url(#glowIronMan)"
                />
              ))}
            </g>
            
            {/* Middle Ring - Counter */}
            <g className="reactor-ring-reverse" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(0,180,255,0.3)" strokeWidth="1.5" />
              {[...Array(10)].map((_, i) => (
                <path
                  key={`mid-${i}`}
                  d="M 100 28 L 103 36 L 97 36 Z"
                  fill="rgba(0, 220, 255, 0.8)"
                  transform={`rotate(${i * 36 + 18}, 100, 100)`}
                  filter="url(#glowIronMan)"
                />
              ))}
            </g>
            
            {/* Inner Ring */}
            <g className="reactor-ring-fast" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="54" fill="none" stroke="rgba(0,180,255,0.4)" strokeWidth="2" filter="url(#glowIronMan)" />
              {[...Array(10)].map((_, i) => (
                <path
                  key={`inner-${i}`}
                  d="M 100 46 L 102 52 L 98 52 Z"
                  fill="rgba(0, 230, 255, 0.85)"
                  transform={`rotate(${i * 36}, 100, 100)`}
                  filter="url(#glowIronMan)"
                />
              ))}
            </g>
            
            {/* Core Frame */}
            <circle cx="100" cy="100" r="36" fill="none" stroke="rgba(0,200,255,0.6)" strokeWidth="2.5" className="reactor-pulse-ring" filter="url(#glowIronMan)" />
            
            {/* Core Outer Glow */}
            <circle cx="100" cy="100" r="28" fill="url(#coreGlowIronMan)" className="reactor-core-glow" />
            
            {/* Main Core */}
            <circle cx="100" cy="100" r="22" fill="url(#coreGradientIronMan)" filter="url(#strongGlowIronMan)" className="reactor-core-pulse" />
            
            {/* Core Center */}
            <circle cx="100" cy="100" r="10" fill="#ffffff" filter="url(#strongGlowIronMan)" />
            
            {/* Core Highlight */}
            <circle cx="96" cy="96" r="4" fill="rgba(255,255,255,0.95)" style={{ filter: 'blur(1px)' }} />
            
            {/* Orbiting Particles */}
            <g className="reactor-particle-1" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="14" r="2.5" fill="#ffffff" filter="url(#strongGlowIronMan)" />
            </g>
            <g className="reactor-particle-2" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="186" cy="100" r="2" fill="#ffffff" filter="url(#strongGlowIronMan)" />
            </g>
            <g className="reactor-particle-3" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="186" r="2" fill="#ffffff" filter="url(#strongGlowIronMan)" />
            </g>
          </svg>
        </div>

        {/* Rotating status text */}
        <div className="flex justify-center -mt-2 mb-4">
          <div className="relative w-[260px] h-[20px] overflow-hidden">
            <div className="jarvis-rotating-text flex items-center justify-center text-[7px] tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ color: 'rgba(0, 180, 255, 0.5)' }}>
              <span>ARC REACTOR • ONLINE • POWER STABLE • STARK INDUSTRIES • ARC REACTOR • ONLINE • POWER STABLE • STARK INDUSTRIES •</span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <div className="jarvis-badge" style={{ background: 'rgba(0, 200, 255, 0.1)', border: '1px solid rgba(0, 200, 255, 0.2)', color: '#00e5ff' }}>
            <MessageSquare size={10} />
            <span>24 msgs</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 188, 212, 0.1)', border: '1px solid rgba(0, 188, 212, 0.2)', color: '#00bcd4' }}>
            <Camera size={10} />
            <span>128 images</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 151, 167, 0.1)', border: '1px solid rgba(0, 151, 167, 0.2)', color: '#0097a7' }}>
            <Video size={10} />
            <span>12 videos</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 172, 193, 0.1)', border: '1px solid rgba(0, 172, 193, 0.2)', color: '#00acc1' }}>
            <Presentation size={10} />
            <span>8 slides</span>
          </div>
        </div>

        {/* Session uptime */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[8px] tracking-wider uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.session}</span>
          <span className="text-[11px] tracking-wider font-mono" style={{ color: '#00e5ff' }}>{formatUptime(uptime)}</span>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            const colors = ['#00e5ff', '#00bcd4', '#0097a7', '#00acc1'];
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
      
      {/* Embedded Styles for Reactor */}
      <style jsx>{`
        .jarvis-reactor-iron-man {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        
        .reactor-glow-outer {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 200, 255, 0.2) 0%, transparent 70%);
          animation: reactor-outer-glow 3s ease-in-out infinite;
        }
        
        .reactor-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 12px rgba(0, 200, 255, 0.5));
        }
        
        .reactor-ring-slow {
          animation: reactor-rotate-slow 20s linear infinite;
        }
        
        .reactor-ring-reverse {
          animation: reactor-rotate-reverse 15s linear infinite;
        }
        
        .reactor-ring-fast {
          animation: reactor-rotate-fast 10s linear infinite;
        }
        
        .reactor-pulse-ring {
          animation: reactor-pulse-ring 2s ease-in-out infinite;
        }
        
        .reactor-core-glow {
          animation: reactor-core-glow 2s ease-in-out infinite;
        }
        
        .reactor-core-pulse {
          animation: reactor-core-pulse 1.5s ease-in-out infinite;
        }
        
        .reactor-particle-1 {
          animation: reactor-rotate-fast 6s linear infinite;
        }
        
        .reactor-particle-2 {
          animation: reactor-rotate-reverse 8s linear infinite;
        }
        
        .reactor-particle-3 {
          animation: reactor-rotate-fast 10s linear infinite;
        }
        
        @keyframes reactor-outer-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        
        @keyframes reactor-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes reactor-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes reactor-rotate-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes reactor-pulse-ring {
          0%, 100% { opacity: 0.6; stroke-width: 2.5; }
          50% { opacity: 1; stroke-width: 3.5; }
        }
        
        @keyframes reactor-core-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes reactor-core-pulse {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}
