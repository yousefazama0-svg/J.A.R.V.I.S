'use client';

import React from 'react';
import { Mic, Globe, Wifi } from 'lucide-react';

interface TopBarProps {
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
  translations: {
    voice: string;
    online: string;
    live: string;
    system: string;
  };
}

export default function TopBar({ language, onLanguageChange, translations }: TopBarProps) {
  return (
    <>
      {/* Desktop Top Bar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-[52px] items-center justify-between px-6"
        style={{ background: 'rgba(6, 10, 20, 0.95)', borderBottom: '1px solid #0e1a3a', backdropFilter: 'blur(24px)' }}>
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(0, 229, 255, 0.2)', borderTopColor: 'transparent', animation: 'jarvis-rotate 3s linear infinite' }} />
            <div className="absolute inset-[3px] rounded-full" style={{ border: '1px solid rgba(0, 229, 255, 0.3)', borderBottomColor: 'transparent', animation: 'jarvis-rotate-reverse 2s linear infinite' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#00f0ff', boxShadow: '0 0 8px rgba(0, 240, 255, 0.5)' }} />
          </div>
          <span className="jarvis-text-shimmer text-sm font-black tracking-[0.15em]">J.A.R.V.I.S</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:bg-[#0e1a3a]/50"
            style={{ border: '1px solid #0e1a3a' }}
          >
            <Globe size={14} style={{ color: '#00e5ff' }} />
            <span className="text-[10px] tracking-widest uppercase" style={{ color: '#90a8cc' }}>
              {language === 'en' ? 'EN' : 'AR'}
            </span>
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:bg-[#0e1a3a]/50"
            style={{ border: '1px solid #0e1a3a' }}>
            <Mic size={14} style={{ color: '#00e5ff' }} />
            <span className="text-[10px] tracking-widest uppercase" style={{ color: '#90a8cc' }}>{translations.voice}</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ border: '1px solid #0e1a3a' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
            <span className="text-[10px] tracking-widest uppercase" style={{ color: '#10b981' }}>{translations.online}</span>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="flex md:hidden fixed top-0 left-0 right-0 z-40 h-[56px] items-center justify-between px-4"
        style={{ background: 'rgba(6, 10, 20, 0.95)', borderBottom: '1px solid #0e1a3a', backdropFilter: 'blur(24px)' }}>
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(0, 229, 255, 0.2)', borderTopColor: 'transparent', animation: 'jarvis-rotate 3s linear infinite' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#00f0ff', boxShadow: '0 0 8px rgba(0, 240, 255, 0.5)' }} />
          </div>
          <div>
            <span className="jarvis-text-shimmer text-sm font-black tracking-[0.15em]">J.A.R.V.I.S</span>
            <p className="text-[7px] tracking-widest" style={{ color: '#90a8cc' }}>{translations.system}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ border: '1px solid #0e1a3a' }}
          >
            <Globe size={14} style={{ color: '#00e5ff' }} />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ border: '1px solid #0e1a3a' }}>
            <Mic size={14} style={{ color: '#00e5ff' }} />
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ border: '1px solid #0e1a3a' }}>
            <Wifi size={10} style={{ color: '#10b981' }} />
            <span className="text-[9px] tracking-widest uppercase" style={{ color: '#10b981' }}>{translations.live}</span>
          </div>
        </div>
      </header>
    </>
  );
}
