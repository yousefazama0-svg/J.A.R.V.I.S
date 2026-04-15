'use client';

import React, { useState, useCallback } from 'react';
import {
  Settings,
  User,
  Globe,
  Monitor,
  Trash2,
  Download,
  RotateCcw,
  Info,
  Shield,
  Cpu,
  HardDrive,
  Sparkles,
  Volume2,
  Camera,
  Video,
  Mic,
  Moon,
  Sun,
  Zap,
} from 'lucide-react';

interface JarvisSettings {
  username: string;
  status: 'Online' | 'Busy' | 'Away';
  language: 'en' | 'ar';
  responseStyle: 'Concise' | 'Detailed' | 'Creative';
  autoSpeak: boolean;
  imageQuality: 'standard' | 'hd';
  particleEffects: boolean;
  animations: boolean;
  compactMode: boolean;
  voiceSpeed: number;
  voiceVolume: number;
  selectedVoice: string;
  defaultImageSize: string;
  defaultVideoDuration: string;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: JarvisSettings = {
  username: 'User',
  status: 'Online',
  language: 'en',
  responseStyle: 'Concise',
  autoSpeak: false,
  imageQuality: 'hd',
  particleEffects: true,
  animations: true,
  compactMode: false,
  voiceSpeed: 1.0,
  voiceVolume: 0.8,
  selectedVoice: 'tongtong',
  defaultImageSize: '1024x1024',
  defaultVideoDuration: '10s',
  darkMode: true,
};

const STATUS_COLORS: Record<string, string> = { Online: '#10b981', Busy: '#ef4444', Away: '#f59e0b' };

function getStorageSize(): string {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) { const val = localStorage.getItem(key); if (val) total += key.length + val.length; }
    }
    if (total < 1024) return `${total} B`;
    if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
    return `${(total / (1024 * 1024)).toFixed(1)} MB`;
  } catch { return 'Unknown'; }
}

function loadSettings(): JarvisSettings {
  try { const raw = localStorage.getItem('jarvis-settings'); if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }; } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function ToggleSwitch({ value, onChange, color = '#00e5ff' }: { value: boolean; onChange: (val: boolean) => void; color?: string }) {
  return (
    <button onClick={() => onChange(!value)} className="relative w-9 h-5 rounded-full transition-all duration-300 shrink-0"
      style={{ background: value ? color + '30' : 'rgba(14, 26, 58, 0.8)', border: `1px solid ${value ? color + '50' : '#0e1a3a'}`, boxShadow: value ? `0 0 8px ${color}20` : 'none' }}>
      <div className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-300"
        style={{ left: value ? '17px' : '2px', background: value ? color : '#90a8cc', boxShadow: value ? `0 0 6px ${color}60` : 'none' }} />
    </button>
  );
}

function SettingsSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="jarvis-hud-card p-4 jarvis-animate-fade-in">
      <div className="flex items-center gap-2 mb-3">{icon}<span className="text-[9px] tracking-[0.12em] uppercase font-bold" style={{ color: '#d0e4f8' }}>{title}</span></div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px]" style={{ color: '#90a8cc' }}>{label}</span>
      {children}
    </div>
  );
}

function SettingsActionButton({ icon: Icon, label, color = '#ef4444', onClick }: { icon: React.ElementType; label: string; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] transition-all w-full justify-center"
      style={{ background: `${color}08`, border: `1px solid ${color}15`, color }}>
      <Icon size={11} />{label}
    </button>
  );
}

interface SettingsViewProps {
  translations: {
    systemConfig: string;
    jarvisConfigurationPanel: string;
    profile: string;
    aiConfiguration: string;
    voiceConfiguration: string;
    mediaDefaults: string;
    display: string;
    systemInfo: string;
    dataManagement: string;
    aboutJarvis: string;
    aboutJarvisText: string;
    poweredByZAI: string;
    version: string;
    sdkStatus: string;
    connected: string;
    storageUsed: string;
    defaultLanguage: string;
    english: string;
    arabic: string;
    responseStyle: string;
    concise: string;
    detailed: string;
    creative: string;
    autoSpeakResponses: string;
    imageQuality: string;
    standard: string;
    hd: string;
    defaultImageSize: string;
    defaultVideoDuration: string;
    speed: string;
    volume: string;
    selectVoice: string;
    image: string;
    video: string;
    particleEffects: string;
    animations: string;
    compactMode: string;
    darkMode: string;
    clearChat: string;
    clearGallery: string;
    exportSettings: string;
    resetAll: string;
    online: string;
    busy: string;
    away: string;
  };
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

export default function SettingsView({ translations, language, onLanguageChange }: SettingsViewProps) {
  const [settings, setSettings] = useState<JarvisSettings>(loadSettings);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [storageSize, setStorageSize] = useState(getStorageSize);

  const saveSettings = useCallback((updated: JarvisSettings) => {
    setSettings(updated);
    try { localStorage.setItem('jarvis-settings', JSON.stringify(updated)); } catch { /* ignore */ }
  }, []);

  const refreshStorageSize = useCallback(() => { setStorageSize(getStorageSize()); }, []);

  const updateSetting = useCallback(<K extends keyof JarvisSettings>(key: K, value: JarvisSettings[K]) => {
    const updated = { ...settings, [key]: value };
    saveSettings(updated);
    if (key === 'language') onLanguageChange(value as 'en' | 'ar');
    setTimeout(refreshStorageSize, 100);
  }, [settings, saveSettings, refreshStorageSize, onLanguageChange]);

  const handleNameSave = useCallback(() => {
    if (nameInput.trim()) updateSetting('username', nameInput.trim());
    setIsEditingName(false);
  }, [nameInput, updateSetting]);

  const startEditName = useCallback(() => { setNameInput(settings.username); setIsEditingName(true); }, [settings.username]);

  const clearChatHistory = useCallback(() => { try { localStorage.removeItem('jarvis-chat-history'); refreshStorageSize(); } catch { /* ignore */ } }, [refreshStorageSize]);
  const clearGallery = useCallback(() => { try { localStorage.removeItem('jarvis-gallery'); refreshStorageSize(); } catch { /* ignore */ } }, [refreshStorageSize]);

  const exportSettings = useCallback(() => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jarvis-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [settings]);

  const resetAllSettings = useCallback(() => { saveSettings(DEFAULT_SETTINGS); clearChatHistory(); clearGallery(); onLanguageChange('en'); }, [saveSettings, clearChatHistory, clearGallery, onLanguageChange]);

  const initials = settings.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #90a8cc20, #90a8cc10)', border: '1px solid #90a8cc30' }}>
            <Settings size={14} style={{ color: '#90a8cc' }} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>{translations.systemConfig}</span>
            <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>{translations.jarvisConfigurationPanel}</p>
          </div>
        </div>
        <span className="text-[8px] font-mono" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>v3.0</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ paddingBottom: '20px' }}>
        {/* Profile Section */}
        <SettingsSection title={translations.profile} icon={<User size={11} style={{ color: '#00e5ff' }} />}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-full text-[16px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #00e5ff, #7c5cff)', color: '#060a14', boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} onBlur={handleNameSave}
                  onKeyDown={e => { if (e.key === 'Enter') handleNameSave(); if (e.key === 'Escape') setIsEditingName(false); }}
                  autoFocus className="w-full bg-transparent text-[13px] font-bold outline-none"
                  style={{ color: '#d0e4f8', border: '1px solid #00e5ff40', borderRadius: '4px', padding: '2px 6px', fontFamily: 'inherit' }} />
              ) : (
                <button onClick={startEditName} className="text-[13px] font-bold text-left" style={{ color: '#d0e4f8' }}>{settings.username}</button>
              )}
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[settings.status], boxShadow: `0 0 6px ${STATUS_COLORS[settings.status]}60` }} />
                <span className="text-[9px]" style={{ color: STATUS_COLORS[settings.status] }}>{settings.status}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 pt-1">
            {(['Online', 'Busy', 'Away'] as const).map(s => (
              <button key={s} onClick={() => updateSetting('status', s)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] transition-all flex-1 justify-center"
                style={{ background: settings.status === s ? `${STATUS_COLORS[s]}15` : 'rgba(14, 26, 58, 0.5)', border: `1px solid ${settings.status === s ? `${STATUS_COLORS[s]}30` : '#0e1a3a'}`, color: settings.status === s ? STATUS_COLORS[s] : '#90a8cc' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[s] }} />{translations[s.toLowerCase() as 'online' | 'busy' | 'away']}
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* AI Settings */}
        <SettingsSection title={translations.aiConfiguration} icon={<Cpu size={11} style={{ color: '#7c5cff' }} />}>
          <SettingRow label={translations.defaultLanguage}>
            <div className="flex gap-1">
              {(['en', 'ar'] as const).map(l => (
                <button key={l} onClick={() => updateSetting('language', l)} className="px-3 py-1 rounded-md text-[10px] transition-all flex items-center gap-1.5"
                  style={{ background: settings.language === l ? 'rgba(124, 92, 255, 0.15)' : 'rgba(14, 26, 58, 0.5)', border: `1px solid ${settings.language === l ? 'rgba(124, 92, 255, 0.35)' : '#0e1a3a'}`, color: settings.language === l ? '#7c5cff' : '#90a8cc' }}>
                  <Globe size={10} />{l === 'en' ? translations.english : translations.arabic}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label={translations.responseStyle}>
            <div className="flex gap-1">
              {(['Concise', 'Detailed', 'Creative'] as const).map(s => (
                <button key={s} onClick={() => updateSetting('responseStyle', s)} className="px-2.5 py-1 rounded-md text-[9px] transition-all"
                  style={{ background: settings.responseStyle === s ? 'rgba(124, 92, 255, 0.15)' : 'rgba(14, 26, 58, 0.5)', border: `1px solid ${settings.responseStyle === s ? 'rgba(124, 92, 255, 0.35)' : '#0e1a3a'}`, color: settings.responseStyle === s ? '#7c5cff' : '#90a8cc' }}>
                  {translations[s.toLowerCase() as 'concise' | 'detailed' | 'creative']}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label={translations.autoSpeakResponses}>
            <ToggleSwitch value={settings.autoSpeak} onChange={val => updateSetting('autoSpeak', val)} color="#7c5cff" />
          </SettingRow>
          <SettingRow label={translations.imageQuality}>
            <div className="flex gap-1">
              {(['standard', 'hd'] as const).map(q => (
                <button key={q} onClick={() => updateSetting('imageQuality', q)} className="px-3 py-1 rounded-md text-[10px] transition-all uppercase"
                  style={{ background: settings.imageQuality === q ? 'rgba(124, 92, 255, 0.15)' : 'rgba(14, 26, 58, 0.5)', border: `1px solid ${settings.imageQuality === q ? 'rgba(124, 92, 255, 0.35)' : '#0e1a3a'}`, color: settings.imageQuality === q ? '#7c5cff' : '#90a8cc' }}>
                  {q === 'hd' ? translations.hd : translations.standard}
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingsSection>

        {/* Voice Settings */}
        <SettingsSection title={translations.voiceConfiguration} icon={<Volume2 size={11} style={{ color: '#0088cc' }} />}>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px]" style={{ color: '#90a8cc' }}>{translations.speed}</span>
              <span className="text-[10px] font-mono" style={{ color: '#0088cc' }}>{settings.voiceSpeed.toFixed(1)}x</span>
            </div>
            <div className="relative w-full">
              <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(0, 136, 204, 0.1)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${(settings.voiceSpeed / 2) * 100}%`, background: '#0088cc', boxShadow: '0 0 6px rgba(0, 136, 204, 0.4)' }} />
              </div>
              <input type="range" min="0.5" max="2" step="0.1" value={settings.voiceSpeed} onChange={e => updateSetting('voiceSpeed', parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px]" style={{ color: '#90a8cc' }}>{translations.volume}</span>
              <span className="text-[10px] font-mono" style={{ color: '#0088cc' }}>{Math.round(settings.voiceVolume * 100)}%</span>
            </div>
            <div className="relative w-full">
              <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(0, 136, 204, 0.1)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${settings.voiceVolume * 100}%`, background: '#0088cc', boxShadow: '0 0 6px rgba(0, 136, 204, 0.4)' }} />
              </div>
              <input type="range" min="0" max="1" step="0.1" value={settings.voiceVolume} onChange={e => updateSetting('voiceVolume', parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>
        </SettingsSection>

        {/* Media Defaults */}
        <SettingsSection title={translations.mediaDefaults} icon={<Camera size={11} style={{ color: '#f59e0b' }} />}>
          <SettingRow label={translations.defaultImageSize}>
            <div className="flex gap-1">
              {['1024x1024', '1344x768', '768x1344'].map(s => (
                <button key={s} onClick={() => updateSetting('defaultImageSize', s)} className="px-2 py-1 rounded-md text-[8px] transition-all"
                  style={{ background: settings.defaultImageSize === s ? 'rgba(245, 158, 11, 0.15)' : 'rgba(14, 26, 58, 0.5)', border: `1px solid ${settings.defaultImageSize === s ? 'rgba(245, 158, 11, 0.35)' : '#0e1a3a'}`, color: settings.defaultImageSize === s ? '#f59e0b' : '#90a8cc' }}>
                  {s}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow label={translations.defaultVideoDuration}>
            <div className="flex gap-1">
              {['10s', '60s', '300s'].map(d => (
                <button key={d} onClick={() => updateSetting('defaultVideoDuration', d)} className="px-3 py-1 rounded-md text-[10px] transition-all"
                  style={{ background: settings.defaultVideoDuration === d ? 'rgba(245, 158, 11, 0.15)' : 'rgba(14, 26, 58, 0.5)', border: `1px solid ${settings.defaultVideoDuration === d ? 'rgba(245, 158, 11, 0.35)' : '#0e1a3a'}`, color: settings.defaultVideoDuration === d ? '#f59e0b' : '#90a8cc' }}>
                  {d === '10s' ? '10s' : d === '60s' ? '1m' : '5m'}
                </button>
              ))}
            </div>
          </SettingRow>
        </SettingsSection>

        {/* Display Settings */}
        <SettingsSection title={translations.display} icon={<Monitor size={11} style={{ color: '#10b981' }} />}>
          <SettingRow label={translations.particleEffects}>
            <ToggleSwitch value={settings.particleEffects} onChange={val => updateSetting('particleEffects', val)} color="#10b981" />
          </SettingRow>
          <SettingRow label={translations.animations}>
            <ToggleSwitch value={settings.animations} onChange={val => updateSetting('animations', val)} color="#10b981" />
          </SettingRow>
          <SettingRow label={translations.compactMode}>
            <ToggleSwitch value={settings.compactMode} onChange={val => updateSetting('compactMode', val)} color="#10b981" />
          </SettingRow>
        </SettingsSection>

        {/* System Info */}
        <SettingsSection title={translations.systemInfo} icon={<Info size={11} style={{ color: '#f59e0b' }} />}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: '#90a8cc' }}>{translations.version}</span>
              <span className="text-[10px] font-mono" style={{ color: '#d0e4f8' }}>JARVIS Pro Max v3.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: '#90a8cc' }}>{translations.sdkStatus}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 4px rgba(16, 185, 129, 0.5)' }} />
                <span className="text-[10px]" style={{ color: '#10b981' }}>{translations.connected}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: '#90a8cc' }}>{translations.storageUsed}</span>
              <span className="text-[10px] font-mono" style={{ color: '#d0e4f8' }}>{storageSize}</span>
            </div>
          </div>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection title={translations.dataManagement} icon={<HardDrive size={11} style={{ color: '#ef4444' }} />}>
          <div className="grid grid-cols-2 gap-2">
            <SettingsActionButton icon={Trash2} label={translations.clearChat} onClick={clearChatHistory} />
            <SettingsActionButton icon={Trash2} label={translations.clearGallery} onClick={clearGallery} />
            <SettingsActionButton icon={Download} label={translations.exportSettings} color="#00e5ff" onClick={exportSettings} />
            <SettingsActionButton icon={RotateCcw} label={translations.resetAll} color="#f59e0b" onClick={resetAllSettings} />
          </div>
        </SettingsSection>

        {/* About */}
        <div className="jarvis-hud-card p-4 jarvis-animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={11} style={{ color: '#00e5ff' }} />
            <span className="text-[9px] tracking-[0.12em] uppercase font-bold" style={{ color: '#d0e4f8' }}>{translations.aboutJarvis}</span>
          </div>
          <p className="text-[10px] leading-relaxed mb-3" style={{ color: '#90a8cc' }}>{translations.aboutJarvisText}</p>
          <div className="jarvis-glow-line mb-3" />
          <div className="flex items-center justify-center gap-2">
            <Shield size={10} style={{ color: '#7c5cff' }} />
            <span className="text-[9px] font-mono" style={{ color: '#7c5cff' }}>{translations.poweredByZAI}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
