'use client';

import React from 'react';
import { MessageSquare, Mic, Camera, Video, Presentation, Images, Settings, Wand2 } from 'lucide-react';

interface ModuleCardsProps {
  onNavigate: (tab: string) => void;
  translations: {
    aiChat: string;
    intelligentConversations: string;
    voice: string;
    speechInterface: string;
    photo: string;
    imageGeneration: string;
    video: string;
    videoCreation: string;
    slides: string;
    presentations: string;
    gallery: string;
    mediaLibrary: string;
    settings: string;
    configuration: string;
    imageEnhance: string;
    imageRestoration: string;
  };
}

const modules = [
  { id: 'chat', labelKey: 'aiChat', subKey: 'intelligentConversations', icon: MessageSquare, color: '#00e5ff', status: 'ACTIVE' },
  { id: 'voice', labelKey: 'voice', subKey: 'speechInterface', icon: Mic, color: '#0088cc', status: 'READY' },
  { id: 'photo', labelKey: 'photo', subKey: 'imageGeneration', icon: Camera, color: '#00e5ff', status: '128 ITEMS' },
  { id: 'video', labelKey: 'video', subKey: 'videoCreation', icon: Video, color: '#7c5cff', status: '12 ITEMS' },
  { id: 'slides', labelKey: 'slides', subKey: 'presentations', icon: Presentation, color: '#f59e0b', status: '8 ITEMS' },
  { id: 'gallery', labelKey: 'gallery', subKey: 'mediaLibrary', icon: Images, color: '#10b981', status: 'ACTIVE' },
  { id: 'settings', labelKey: 'settings', subKey: 'configuration', icon: Settings, color: '#90a8cc', status: 'CONFIG' },
];

export default function ModuleCards({ onNavigate, translations }: ModuleCardsProps) {
  return (
    <>
      {/* Image Enhancement Feature Card */}
      <div
        className="jarvis-mod-card jarvis-animate-slide-up mb-4"
        style={{ animationDelay: '350ms' }}
        onClick={() => onNavigate('photo')}
      >
        <div className="jarvis-corner-tl" style={{ borderColor: '#a855f7' }} />
        <div className="jarvis-corner-tr" style={{ borderColor: '#a855f7' }} />
        <div className="jarvis-corner-bl" style={{ borderColor: '#a855f7' }} />
        <div className="jarvis-corner-br" style={{ borderColor: '#a855f7' }} />
        <div className="jarvis-scan-line" style={{ background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)' }} />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg"
            style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <Wand2 size={18} style={{ color: '#a855f7' }} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>
              {translations.imageEnhance}
            </p>
            <p className="text-[8px] tracking-wider mt-0.5" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.imageRestoration}
            </p>
          </div>
          <div className="jarvis-badge" style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            NEW
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {modules.map((mod, idx) => {
          const Icon = mod.icon;
          const label = translations[mod.labelKey as keyof typeof translations] || mod.labelKey;
          const sub = translations[mod.subKey as keyof typeof translations] || mod.subKey;
          return (
            <div
              key={mod.id}
              className="jarvis-mod-card jarvis-animate-slide-up"
              style={{ animationDelay: `${400 + idx * 80}ms` }}
              onClick={() => onNavigate(mod.id)}
            >
              <div className="jarvis-corner-tl" style={{ borderColor: mod.color }} />
              <div className="jarvis-corner-tr" style={{ borderColor: mod.color }} />
              <div className="jarvis-corner-bl" style={{ borderColor: mod.color }} />
              <div className="jarvis-corner-br" style={{ borderColor: mod.color }} />
              <div className="jarvis-scan-line" />

              <div className="flex flex-col items-center text-center gap-2 relative z-10">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ background: `${mod.color}10`, border: `1px solid ${mod.color}20` }}>
                  <Icon size={18} style={{ color: mod.color }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>
                    {label}
                  </p>
                  <p className="text-[8px] tracking-wider mt-0.5" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                    {sub}
                  </p>
                  <p className="text-[7px] tracking-widest uppercase mt-1" style={{ color: mod.color }}>
                    {mod.status}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
