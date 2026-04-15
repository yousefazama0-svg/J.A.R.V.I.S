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

// Tab configuration with icons and colors
const TAB_CONFIG: { id: TabId; icon: React.ElementType; color: string }[] = [
  { id: 'home', icon: Home, color: '#00e5ff' },
  { id: 'chat', icon: MessageSquare, color: '#00e5ff' },
  { id: 'photo', icon: Camera, color: '#7c5cff' },
  { id: 'video', icon: Video, color: '#f59e0b' },
  { id: 'voice', icon: Mic, color: '#0088cc' },
  { id: 'slides', icon: Presentation, color: '#10b981' },
  { id: 'gallery', icon: Images, color: '#a855f7' },
  { id: 'settings', icon: Settings, color: '#90a8cc' },
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

  const getTabConfig = (id: TabId) => TAB_CONFIG.find(t => t.id === id) || TAB_CONFIG[0];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 h-[72px] flex items-center px-2 safe-area-bottom"
      style={{ 
        background: 'linear-gradient(180deg, rgba(6, 10, 20, 0.95) 0%, rgba(6, 10, 20, 0.98) 100%)', 
        borderTop: '1px solid rgba(0, 229, 255, 0.1)', 
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex items-center justify-around w-full max-w-lg mx-auto">
        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const config = getTabConfig(tab.id);
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-12 h-16 gap-1 transition-all group"
            >
              {/* Active background glow */}
              {isActive && (
                <div 
                  className="absolute inset-0 rounded-2xl transition-opacity"
                  style={{
                    background: `linear-gradient(180deg, ${config.color}15, transparent)`,
                    boxShadow: `inset 0 1px 0 ${config.color}20`,
                  }}
                />
              )}
              
              {/* Top indicator */}
              <div 
                className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full transition-all"
                style={{
                  background: isActive ? `linear-gradient(90deg, transparent, ${config.color}, transparent)` : 'transparent',
                  boxShadow: isActive ? `0 0 12px ${config.color}50` : 'none',
                  opacity: isActive ? 1 : 0,
                }}
              />
              
              {/* Icon */}
              <div 
                className="relative z-10 flex items-center justify-center w-8 h-8 rounded-xl transition-all"
                style={{
                  background: isActive ? `${config.color}15` : 'transparent',
                  border: isActive ? `1px solid ${config.color}25` : '1px solid transparent',
                  boxShadow: isActive ? `0 0 16px ${config.color}20` : 'none',
                }}
              >
                <Icon 
                  size={18} 
                  style={{ 
                    color: isActive ? config.color : 'rgba(144, 168, 204, 0.6)',
                    transition: 'color 0.3s',
                  }} 
                />
              </div>
              
              {/* Label */}
              <span 
                className="relative z-10 text-[8px] tracking-wider uppercase font-medium transition-all"
                style={{ 
                  color: isActive ? config.color : 'rgba(144, 168, 204, 0.5)',
                }}
              >
                {getLabel(tab.id)}
              </span>
              
              {/* Hover effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `${config.color}08`,
                }}
              />
            </button>
          );
        })}
      </div>
      
      {/* Bottom safe area for iOS */}
      <style jsx global>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
    </nav>
  );
}
