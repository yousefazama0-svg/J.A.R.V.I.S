'use client';

import React, { useState, useEffect, useSyncExternalStore, useMemo } from 'react';
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

// Pre-calculated positions for outer ring (8 nodes at radius 98)
const OUTER_NODES = [
  { cx: 208, cy: 110 }, { cx: 179, cy: 179 }, { cx: 110, cy: 208 }, { cx: 41, cy: 179 },
  { cx: 12, cy: 110 }, { cx: 41, cy: 41 }, { cx: 110, cy: 12 }, { cx: 179, cy: 41 },
];

// Pre-calculated positions for mid ring (6 nodes at radius 78)
const MID_NODES = [
  { cx: 188, cy: 110 }, { cx: 149, cy: 149 }, { cx: 110, cy: 188 }, { cx: 71, cy: 149 },
  { cx: 32, cy: 110 }, { cx: 71, cy: 71 },
];

// Pre-calculated positions for inner ring (12 dots at radius 58)
const INNER_DOTS = [
  { cx: 168, cy: 110 }, { cx: 139, cy: 139 }, { cx: 110, cy: 168 }, { cx: 81, cy: 139 },
  { cx: 52, cy: 110 }, { cx: 81, cy: 81 }, { cx: 110, cy: 52 }, { cx: 139, cy: 81 },
  { cx: 154, cy: 125 }, { cx: 125, cy: 154 }, { cx: 95, cy: 154 }, { cx: 66, cy: 125 },
];

// Pre-calculated positions for fourth ring (18 dots at radius 42)
const TINY_DOTS = [
  { cx: 152, cy: 110 }, { cx: 143, cy: 135 }, { cx: 125, cy: 152 }, { cx: 95, cy: 152 },
  { cx: 77, cy: 135 }, { cx: 68, cy: 110 }, { cx: 77, cy: 85 }, { cx: 95, cy: 68 },
  { cx: 125, cy: 68 }, { cx: 143, cy: 85 }, { cx: 155, cy: 120 }, { cx: 135, cy: 148 },
  { cx: 110, cy: 152 }, { cx: 85, cy: 148 }, { cx: 65, cy: 120 }, { cx: 65, cy: 100 },
  { cx: 85, cy: 72 }, { cx: 110, cy: 68 },
];

// Pre-calculated hexagon points
const HEX_POINTS = "110,82 128,93 128,117 110,128 92,117 92,93";

// Empty subscription for client-side detection
const emptySubscribe = () => () => {};

/**
 * JARVIS Arc Reactor Core - Advanced Tech Edition
 * A stunning arc reactor with cinematic dynamic animations
 * No triangles - only circular tech-inspired design
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
  
  // Memoize arc paths
  const outerArcs = useMemo(() =>
    [...Array(8)].map((_, i) => {
      const startAngle = (i * 45 - 10) * Math.PI / 180;
      const endAngle = (i * 45 + 10) * Math.PI / 180;
      const r = 98;
      const cx = Math.round(110 + r * Math.cos(startAngle));
      const cy = Math.round(110 + r * Math.sin(startAngle));
      const ex = Math.round(110 + r * Math.cos(endAngle));
      const ey = Math.round(110 + r * Math.sin(endAngle));
      return { d: `M ${cx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}` };
    }), []
  );
  
  const midArcs = useMemo(() =>
    [...Array(6)].map((_, i) => {
      const startAngle = (i * 60 + 15) * Math.PI / 180;
      const endAngle = (i * 60 + 45) * Math.PI / 180;
      const r = 78;
      const cx = Math.round(110 + r * Math.cos(startAngle));
      const cy = Math.round(110 + r * Math.sin(startAngle));
      const ex = Math.round(110 + r * Math.cos(endAngle));
      const ey = Math.round(110 + r * Math.sin(endAngle));
      return { d: `M ${cx} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}` };
    }), []
  );

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
    { label: 'توليد AI', color: '#00ffff' },
    { label: 'مساعد صوتي', color: '#00e5ff' },
    { label: 'إجراءات ذكية', color: '#00bcd4' },
    { label: 'تحميل الكل', color: '#0097a7' },
  ] : [
    { label: 'AI Generation', color: '#00ffff' },
    { label: 'Voice Assistant', color: '#00e5ff' },
    { label: 'Smart Actions', color: '#00bcd4' },
    { label: 'Download All', color: '#0097a7' },
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

        {/* JARVIS Arc Reactor - Tech Edition */}
        <div className="jarvis-tech-reactor my-6">
          {/* Plasma Glow */}
          <div className="reactor-plasma" />
          
          {/* Main Reactor SVG */}
          <svg viewBox="0 0 220 220" className="reactor-svg-tech">
            <defs>
              <radialGradient id="techCoreGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="15%" stopColor="#e8ffff" />
                <stop offset="30%" stopColor="#00ffff" />
                <stop offset="50%" stopColor="#00e5ff" />
                <stop offset="70%" stopColor="#00bcd4" />
                <stop offset="100%" stopColor="#0097a7" />
              </radialGradient>
              <radialGradient id="techGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                <stop offset="30%" stopColor="rgba(0,255,255,0.7)" />
                <stop offset="60%" stopColor="rgba(0,230,255,0.35)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id="techRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="50%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#00bcd4" />
              </linearGradient>
              <filter id="techGlow" x="-70%" y="-70%" width="240%" height="240%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="techStrongGlow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Outer Ring - Energy Nodes */}
            <g className="tech-ring-outer" style={{ transformOrigin: '110px 110px' }}>
              {OUTER_NODES.map((node, i) => (
                <React.Fragment key={`outer-${i}`}>
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="4"
                    fill="none"
                    stroke="url(#techRingGrad)"
                    strokeWidth="1.5"
                    filter="url(#techGlow)"
                  />
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="1.5"
                    fill="rgba(0, 255, 255, 0.9)"
                    filter="url(#techGlow)"
                  />
                </React.Fragment>
              ))}
              {outerArcs.map((arc, i) => (
                <path
                  key={`outer-arc-${i}`}
                  d={arc.d}
                  fill="none"
                  stroke="rgba(0, 240, 255, 0.5)"
                  strokeWidth="1"
                  filter="url(#techGlow)"
                />
              ))}
            </g>
            
            {/* Second Ring - Counter */}
            <g className="tech-ring-mid" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="110" r="78" fill="none" stroke="rgba(0, 230, 255, 0.2)" strokeWidth="1.5" />
              {MID_NODES.map((node, i) => (
                <React.Fragment key={`mid-${i}`}>
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="5"
                    fill="none"
                    stroke="url(#techRingGrad)"
                    strokeWidth="1.5"
                    filter="url(#techGlow)"
                  />
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="2"
                    fill="rgba(0, 255, 255, 0.85)"
                    filter="url(#techGlow)"
                  />
                </React.Fragment>
              ))}
              {midArcs.map((arc, i) => (
                <path
                  key={`mid-arc-${i}`}
                  d={arc.d}
                  fill="none"
                  stroke="rgba(0, 255, 255, 0.6)"
                  strokeWidth="2"
                  filter="url(#techGlow)"
                />
              ))}
            </g>
            
            {/* Third Ring - Fast */}
            <g className="tech-ring-inner" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="110" r="58" fill="none" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="2" filter="url(#techGlow)" />
              {INNER_DOTS.map((dot, i) => (
                <circle
                  key={`inner-dot-${i}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="2"
                  fill="rgba(0, 255, 255, 0.9)"
                  filter="url(#techGlow)"
                />
              ))}
            </g>
            
            {/* Fourth Ring - Counter Fast */}
            <g className="tech-ring-fourth" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="110" r="42" fill="none" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" filter="url(#techGlow)" />
              {TINY_DOTS.map((dot, i) => (
                <circle
                  key={`tiny-${i}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="1.5"
                  fill="rgba(0, 255, 255, 0.95)"
                  filter="url(#techGlow)"
                />
              ))}
            </g>
            
            {/* Hexagonal Core Frame */}
            <g className="tech-hex-frame" style={{ transformOrigin: '110px 110px' }}>
              <polygon
                points={HEX_POINTS}
                fill="none"
                stroke="rgba(0, 255, 255, 0.6)"
                strokeWidth="2"
                filter="url(#techGlow)"
              />
            </g>
            
            {/* Core Glow */}
            <circle cx="110" cy="110" r="22" fill="url(#techGlowGrad)" className="tech-core-glow" />
            
            {/* Main Core */}
            <circle cx="110" cy="110" r="16" fill="url(#techCoreGrad)" filter="url(#techStrongGlow)" className="tech-core-pulse" />
            
            {/* Core Inner Ring */}
            <circle cx="110" cy="110" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="tech-inner-ring" />
            
            {/* Core Center */}
            <circle cx="110" cy="110" r="6" fill="#ffffff" filter="url(#techStrongGlow)" />
            
            {/* Core Highlight */}
            <circle cx="107" cy="107" r="2.5" fill="rgba(255,255,255,0.95)" style={{ filter: 'blur(0.5px)' }} />
            
            {/* Orbiting Particles */}
            <g className="tech-particle-1" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="12" r="2.5" fill="#ffffff" filter="url(#techStrongGlow)" />
            </g>
            <g className="tech-particle-2" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="208" cy="110" r="2" fill="#ffffff" filter="url(#techStrongGlow)" />
            </g>
            <g className="tech-particle-3" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="110" cy="208" r="2" fill="#ffffff" filter="url(#techStrongGlow)" />
            </g>
            <g className="tech-particle-4" style={{ transformOrigin: '110px 110px' }}>
              <circle cx="12" cy="110" r="1.5" fill="#ffffff" filter="url(#techStrongGlow)" />
            </g>
          </svg>
        </div>

        {/* Rotating status text */}
        <div className="flex justify-center -mt-2 mb-4">
          <div className="relative w-[280px] h-[20px] overflow-hidden">
            <div className="jarvis-rotating-text flex items-center justify-center text-[7px] tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ color: 'rgba(0, 230, 255, 0.5)' }}>
              <span>ARC REACTOR • ONLINE • POWER STABLE • STARK INDUSTRIES • ARC REACTOR • ONLINE • POWER STABLE • STARK INDUSTRIES •</span>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <div className="jarvis-badge" style={{ background: 'rgba(0, 255, 255, 0.1)', border: '1px solid rgba(0, 255, 255, 0.2)', color: '#00ffff' }}>
            <MessageSquare size={10} />
            <span>24 msgs</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)', color: '#00e5ff' }}>
            <Camera size={10} />
            <span>128 images</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 188, 212, 0.1)', border: '1px solid rgba(0, 188, 212, 0.2)', color: '#00bcd4' }}>
            <Video size={10} />
            <span>12 videos</span>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(0, 151, 167, 0.1)', border: '1px solid rgba(0, 151, 167, 0.2)', color: '#0097a7' }}>
            <Presentation size={10} />
            <span>8 slides</span>
          </div>
        </div>

        {/* Session uptime */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[8px] tracking-wider uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.session}</span>
          <span className="text-[11px] tracking-wider font-mono" style={{ color: '#00ffff' }}>{formatUptime(uptime)}</span>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            const colors = ['#00ffff', '#00e5ff', '#00bcd4', '#0097a7'];
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
        .jarvis-tech-reactor {
          position: relative;
          width: 220px;
          height: 220px;
          margin: 0 auto;
        }
        
        .reactor-plasma {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, transparent 70%);
          animation: tech-plasma 3s ease-in-out infinite;
          filter: blur(10px);
        }
        
        .reactor-svg-tech {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 18px rgba(0, 240, 255, 0.5));
        }
        
        .tech-ring-outer {
          animation: tech-rotate-slow 18s linear infinite;
        }
        
        .tech-ring-mid {
          animation: tech-rotate-reverse 14s linear infinite;
        }
        
        .tech-ring-inner {
          animation: tech-rotate-fast 10s linear infinite;
        }
        
        .tech-ring-fourth {
          animation: tech-rotate-reverse-fast 7s linear infinite;
        }
        
        .tech-hex-frame {
          animation: tech-rotate-reverse 5s linear infinite;
        }
        
        .tech-core-glow {
          animation: tech-core-glow 2s ease-in-out infinite;
        }
        
        .tech-core-pulse {
          animation: tech-core-pulse 1.5s ease-in-out infinite;
        }
        
        .tech-inner-ring {
          animation: tech-inner-ring 1.2s ease-in-out infinite;
        }
        
        .tech-particle-1 {
          animation: tech-rotate-fast 5s linear infinite;
        }
        
        .tech-particle-2 {
          animation: tech-rotate-reverse 7s linear infinite;
        }
        
        .tech-particle-3 {
          animation: tech-rotate-fast 9s linear infinite;
        }
        
        .tech-particle-4 {
          animation: tech-rotate-reverse 11s linear infinite;
        }
        
        @keyframes tech-plasma {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        
        @keyframes tech-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes tech-rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes tech-rotate-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes tech-rotate-reverse-fast {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes tech-core-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        
        @keyframes tech-core-pulse {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        
        @keyframes tech-inner-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}
