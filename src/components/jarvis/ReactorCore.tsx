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
 * Iron Man Arc Reactor Core - Ultimate Edition
 * A breathtaking arc reactor with cinematic dynamic animations
 */
export default function ReactorCore({ translations, language }: ReactorCoreProps) {
  // Use useSyncExternalStore to detect client-side rendering
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
    { label: 'توليد AI', color: '#00f5ff' },
    { label: 'مساعد صوتي', color: '#00d4e8' },
    { label: 'إجراءات ذكية', color: '#00b8d4' },
    { label: 'تحميل الكل', color: '#0098b8' },
  ] : [
    { label: 'AI Generation', color: '#00f5ff' },
    { label: 'Voice Assistant', color: '#00d4e8' },
    { label: 'Smart Actions', color: '#00b8d4' },
    { label: 'Download All', color: '#0098b8' },
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
      <div className="jarvis-hud-card p-4 md:p-6 w-full max-w-[440px] jarvis-animate-slide-up jarvis-delay-300">
        {/* Top data flow line */}
        <div className="jarvis-data-flow mb-4 rounded-full" />

        {/* Iron Man Arc Reactor - Ultimate Edition */}
        <div className="ironman-reactor my-6">
          {/* Outer Plasma Glow */}
          <div className="reactor-plasma-outer" />
          
          {/* Main Reactor SVG */}
          <svg viewBox="0 0 220 220" className="reactor-svg-main">
            <defs>
              <radialGradient id="coreGradUltimate" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="15%" stopColor="#e8ffff" />
                <stop offset="30%" stopColor="#00f5ff" />
                <stop offset="50%" stopColor="#00d8e8" />
                <stop offset="70%" stopColor="#00b8d0" />
                <stop offset="100%" stopColor="#0088a0" />
              </radialGradient>
              <radialGradient id="coreGlowUltimate" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="30%" stopColor="rgba(0,245,255,0.6)" />
                <stop offset="60%" stopColor="rgba(0,200,220,0.3)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id="segmentGradUltimate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5ff" />
                <stop offset="50%" stopColor="#00d8e8" />
                <stop offset="100%" stopColor="#00b8d0" />
              </linearGradient>
              <filter id="glowUltimate" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="strongGlowUltimate" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Outer Ring - 10 Segments */}
            <g className="reactor-ring-outer" style={{ transformOrigin: '110px 110px' }}>
              {[...Array(10)].map((_, i) => (
                <path
                  key={`outer-${i}`}
                  d="M 110 8 L 114 22 L 106 22 Z"
                  fill="url(#segmentGradUltimate)"
                  transform={`rotate(${i * 36}, 110, 110)`}
                  filter="url(#glowUltimate)"
                  style={{ opacity: 0.85 }}
                />
              ))}
            </g>
            
            {/* Second Ring - Counter Rotating */}
            <g className="reactor-ring-mid" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="110" r="80" fill="none" stroke="rgba(0,200,255,0.25)" strokeWidth="1.5" />
              {[...Array(10)].map((_, i) => (
                <path
                  key={`mid-${i}`}
                  d="M 110 30 L 113 40 L 107 40 Z"
                  fill="rgba(0, 245, 255, 0.9)"
                  transform={`rotate(${i * 36 + 18}, 110, 110)`}
                  filter="url(#glowUltimate)"
                />
              ))}
            </g>
            
            {/* Third Ring - Fast */}
            <g className="reactor-ring-inner" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="110" r="60" fill="none" stroke="rgba(0,210,255,0.35)" strokeWidth="2" filter="url(#glowUltimate)" />
              {[...Array(10)].map((_, i) => (
                <path
                  key={`inner-${i}`}
                  d="M 110 50 L 112 57 L 108 57 Z"
                  fill="rgba(0, 255, 255, 0.95)"
                  transform={`rotate(${i * 36}, 110, 110)`}
                  filter="url(#glowUltimate)"
                />
              ))}
            </g>
            
            {/* Fourth Ring - Counter Fast */}
            <g className="reactor-ring-fourth" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="110" r="44" fill="none" stroke="rgba(0,230,255,0.45)" strokeWidth="2" filter="url(#glowUltimate)" />
              {[...Array(20)].map((_, i) => (
                <path
                  key={`seg-${i}`}
                  d="M 110 66 L 111 70 L 109 70 Z"
                  fill="rgba(0, 255, 255, 0.9)"
                  transform={`rotate(${i * 18}, 110, 110)`}
                  filter="url(#glowUltimate)"
                />
              ))}
            </g>
            
            {/* Core Frame Ring */}
            <circle 
              cx="110" 
              cy="110" 
              r="32" 
              fill="none" 
              stroke="rgba(0,245,255,0.6)" 
              strokeWidth="2.5" 
              className="reactor-core-frame"
              filter="url(#glowUltimate)" 
            />
            
            {/* Core Outer Glow */}
            <circle cx="110" cy="110" r="26" fill="url(#coreGlowUltimate)" className="reactor-core-glow-anim" />
            
            {/* Main Core */}
            <circle 
              cx="110" 
              cy="110" 
              r="20" 
              fill="url(#coreGradUltimate)" 
              filter="url(#strongGlowUltimate)" 
              className="reactor-core-pulse-anim"
            />
            
            {/* Core Inner Ring */}
            <circle 
              cx="110" 
              cy="110" 
              r="12" 
              fill="none" 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="1"
              className="reactor-core-inner-ring"
            />
            
            {/* Core Center */}
            <circle cx="110" cy="110" r="8" fill="#ffffff" filter="url(#strongGlowUltimate)" />
            
            {/* Core Highlight */}
            <circle cx="107" cy="107" r="3" fill="rgba(255,255,255,0.95)" style={{ filter: 'blur(0.5px)' }} />
            
            {/* Orbiting Particles */}
            <g className="reactor-particle-1" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="10" r="2.5" fill="#ffffff" filter="url(#strongGlowUltimate)" />
            </g>
            <g className="reactor-particle-2" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="210" cy="110" r="2" fill="#ffffff" filter="url(#strongGlowUltimate)" />
            </g>
            <g className="reactor-particle-3" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="210" r="2" fill="#ffffff" filter="url(#strongGlowUltimate)" />
            </g>
            <g className="reactor-particle-4" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="10" cy="110" r="1.5" fill="#ffffff" filter="url(#strongGlowUltimate)" />
            </g>
          </svg>
        </div>

        {/* Rotating status text */}
        <div className="flex justify-center -mt-2 mb-4">
          <div className="relative w-[280px] h-[20px] overflow-hidden">
            <div className="jarvis-rotating-text flex items-center justify-center text-[7px] tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ color: 'rgba(0, 200, 255, 0.5)' }}>
              <span>ARC REACTOR • ONLINE • POWER STABLE • STARK INDUSTRIES • ARC REACTOR • ONLINE • POWER STABLE • STARK INDUSTRIES •</span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <div className="jarvis-badge" style={{ background: 'rgba(0, 245, 255, 0.1)', border: '1px solid rgba(0, 245, 255, 0.2)', color: '#00f5ff' }}>
            <MessageSquare size={10} />
            <span>24 msgs</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 216, 232, 0.1)', border: '1px solid rgba(0, 216, 232, 0.2)', color: '#00d8e8' }}>
            <Camera size={10} />
            <span>128 images</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 184, 212, 0.1)', border: '1px solid rgba(0, 184, 212, 0.2)', color: '#00b8d4' }}>
            <Video size={10} />
            <span>12 videos</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 152, 184, 0.1)', border: '1px solid rgba(0, 152, 184, 0.2)', color: '#0098b8' }}>
            <Presentation size={10} />
            <span>8 slides</span>
          </div>
        </div>

        {/* Session uptime */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[8px] tracking-wider uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.session}</span>
          <span className="text-[11px] tracking-wider font-mono" style={{ color: '#00f5ff' }}>{formatUptime(uptime)}</span>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            const colors = ['#00f5ff', '#00d8e8', '#00b8d4', '#0098b8'];
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
              <div className="w-2 h-2 rounded-full" style={{ background: cap.color, boxShadow: `0 0 8px ${cap.color}70` }} />
              <span style={{ color: '#d0e4f8' }}>{cap.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom data flow line */}
        <div className="jarvis-data-flow mt-4 rounded-full" />
      </div>
      
      {/* Embedded Styles for Reactor */}
      <style jsx>{`
        .ironman-reactor {
          position: relative;
          width: 220px;
          height: 220px;
          margin: 0 auto;
        }
        
        .reactor-plasma-outer {
          position: absolute;
          inset: -15px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 220, 255, 0.2) 0%, transparent 70%);
          animation: reactor-plasma-glow 3s ease-in-out infinite;
          filter: blur(8px);
        }
        
        .reactor-svg-main {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 15px rgba(0, 220, 255, 0.5));
        }
        
        .reactor-ring-outer {
          animation: reactor-spin-slow 18s linear infinite;
        }
        
        .reactor-ring-mid {
          animation: reactor-spin-reverse 14s linear infinite;
        }
        
        .reactor-ring-inner {
          animation: reactor-spin-fast 10s linear infinite;
        }
        
        .reactor-ring-fourth {
          animation: reactor-spin-reverse-fast 7s linear infinite;
        }
        
        .reactor-core-frame {
          animation: reactor-core-frame-pulse 1.8s ease-in-out infinite;
        }
        
        .reactor-core-glow-anim {
          animation: reactor-core-glow 2s ease-in-out infinite;
        }
        
        .reactor-core-pulse-anim {
          animation: reactor-core-pulse 1.5s ease-in-out infinite;
        }
        
        .reactor-core-inner-ring {
          animation: reactor-inner-ring-pulse 1.2s ease-in-out infinite;
        }
        
        .reactor-particle-1 {
          animation: reactor-spin-fast 5s linear infinite;
        }
        
        .reactor-particle-2 {
          animation: reactor-spin-reverse 7s linear infinite;
        }
        
        .reactor-particle-3 {
          animation: reactor-spin-fast 9s linear infinite;
        }
        
        .reactor-particle-4 {
          animation: reactor-spin-reverse 11s linear infinite;
        }
        
        @keyframes reactor-plasma-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes reactor-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes reactor-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes reactor-spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes reactor-spin-reverse-fast {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes reactor-core-frame-pulse {
          0%, 100% { opacity: 0.6; stroke-width: 2.5; }
          50% { opacity: 1; stroke-width: 3.5; }
        }
        
        @keyframes reactor-core-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        
        @keyframes reactor-core-pulse {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes reactor-inner-ring-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
