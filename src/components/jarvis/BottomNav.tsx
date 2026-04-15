'use client';

import React from 'react';
import { Home, MessageSquare, Mic, Camera, Video, Presentation, Images, Settings } from 'lucide-react';

export type TabId = 'home' | 'chat' | 'voice' | 'photo' | 'video' | 'slides' | 'gallery' | 'settings';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  translations: {
    home: string;
    chat: string;
    voice: string;
    photo: string;
    video: string;
    slides: string;
    gallery: string;
    settings: string;
  };
}

const tabs: { id: TabId; icon: React.ElementType }[] = [
  { id: 'home', icon: Home },
  { id: 'chat', icon: MessageSquare },
  { id: 'voice', icon: Mic },
  { id: 'photo', icon: Camera },
  { id: 'video', icon: Video },
  { id: 'slides', icon: Presentation },
  { id: 'gallery', icon: Images },
  { id: 'settings', icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange, translations }: BottomNavProps) {
  const getLabel = (id: TabId): string => {
    const labels: Record<TabId, string> = {
      home: translations.home,
      chat: translations.chat,
      voice: translations.voice,
      photo: translations.photo,
      video: translations.video,
      slides: translations.slides,
      gallery: translations.gallery,
      settings: translations.settings,
    };
    return labels[id];
  };

  return (
    <nav className="jarvis-bottom-nav fixed bottom-0 left-0 right-0 z-40 h-[52px] flex items-center justify-around px-1"
      style={{ background: 'rgba(6, 10, 20, 0.95)', borderTop: '1px solid #0e1a3a', backdropFilter: 'blur(24px)' }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all"
          >
            {/* Active indicator glow line */}
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, #00f0ff, #7c5cff, transparent)', borderRadius: '0 0 4px 4px', boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)' }} />
            )}
            <Icon size={16} style={{ color: isActive ? '#00e5ff' : '#90a8cc', transition: 'color 0.3s' }} />
            <span className="text-[8px] tracking-wider uppercase"
              style={{ color: isActive ? '#00e5ff' : '#90a8cc', transition: 'color 0.3s', fontSize: '7px' }}>
              {getLabel(tab.id)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
