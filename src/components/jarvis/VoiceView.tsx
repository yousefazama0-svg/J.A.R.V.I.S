'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Loader2, Volume2, Type, Globe, Upload, Play, Pause, Square, X,
  Settings2, Sliders, Headphones, User, Sparkles, RefreshCw, Check
} from 'lucide-react';

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface ConversationEntry {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

// Extended voice options
interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  language: string;
}

// Voice categories for better organization
const VOICE_CATEGORIES = {
  jarvis: 'JARVIS AI',
  premium: 'Premium Voices',
  english: 'English Voices',
  arabic: 'أصوات عربية',
  specialized: 'Specialized',
};

const VOICE_OPTIONS: VoiceOption[] = [
  // 🔥 JARVIS Official Voice - The real AI assistant voice
  { id: 'jarvis', name: 'JARVIS', gender: 'male', language: 'en' },
  { id: 'jarvis-deep', name: 'JARVIS Deep', gender: 'male', language: 'en' },
  { id: 'jarvis-calm', name: 'JARVIS Calm', gender: 'male', language: 'en' },
  { id: 'jarvis-pro', name: 'JARVIS Pro', gender: 'male', language: 'en' },
  
  // Premium voices
  { id: 'tongtong', name: 'TongTong', gender: 'neutral', language: 'multi' },
  { id: 'alloy', name: 'Alloy', gender: 'neutral', language: 'en' },
  { id: 'echo', name: 'Echo', gender: 'male', language: 'en' },
  { id: 'fable', name: 'Fable', gender: 'neutral', language: 'en' },
  { id: 'onyx', name: 'Onyx', gender: 'male', language: 'en' },
  { id: 'nova', name: 'Nova', gender: 'female', language: 'en' },
  { id: 'shimmer', name: 'Shimmer', gender: 'female', language: 'en' },
  
  // Extended English voices
  { id: 'adam', name: 'Adam', gender: 'male', language: 'en' },
  { id: 'bella', name: 'Bella', gender: 'female', language: 'en' },
  { id: 'charlie', name: 'Charlie', gender: 'male', language: 'en' },
  { id: 'david', name: 'David', gender: 'male', language: 'en' },
  { id: 'emma', name: 'Emma', gender: 'female', language: 'en' },
  { id: 'frank', name: 'Frank', gender: 'male', language: 'en' },
  { id: 'grace', name: 'Grace', gender: 'female', language: 'en' },
  { id: 'henry', name: 'Henry', gender: 'male', language: 'en' },
  { id: 'iris', name: 'Iris', gender: 'female', language: 'en' },
  { id: 'jack', name: 'Jack', gender: 'male', language: 'en' },
  { id: 'kate', name: 'Kate', gender: 'female', language: 'en' },
  { id: 'liam', name: 'Liam', gender: 'male', language: 'en' },
  { id: 'mia', name: 'Mia', gender: 'female', language: 'en' },
  { id: 'noah', name: 'Noah', gender: 'male', language: 'en' },
  { id: 'olivia', name: 'Olivia', gender: 'female', language: 'en' },
  { id: 'peter', name: 'Peter', gender: 'male', language: 'en' },
  
  // Arabic voices
  { id: 'ar-male-1', name: 'أحمد', gender: 'male', language: 'ar' },
  { id: 'ar-male-2', name: 'عمر', gender: 'male', language: 'ar' },
  { id: 'ar-male-3', name: 'خالد', gender: 'male', language: 'ar' },
  { id: 'ar-male-4', name: 'يوسف', gender: 'male', language: 'ar' },
  { id: 'ar-female-1', name: 'فاطمة', gender: 'female', language: 'ar' },
  { id: 'ar-female-2', name: 'ليلى', gender: 'female', language: 'ar' },
  { id: 'ar-female-3', name: 'نور', gender: 'female', language: 'ar' },
  { id: 'ar-female-4', name: 'سارة', gender: 'female', language: 'ar' },
  
  // Specialized voices
  { id: 'en-male-deep', name: 'Deep Voice', gender: 'male', language: 'en' },
  { id: 'en-male-casual', name: 'Casual Male', gender: 'male', language: 'en' },
  { id: 'en-male-news', name: 'News Anchor', gender: 'male', language: 'en' },
  { id: 'en-male-narrator', name: 'Narrator', gender: 'male', language: 'en' },
  { id: 'en-female-soft', name: 'Soft Voice', gender: 'female', language: 'en' },
  { id: 'en-female-professional', name: 'Professional', gender: 'female', language: 'en' },
  { id: 'en-female-friendly', name: 'Friendly', gender: 'female', language: 'en' },
  { id: 'en-female-young', name: 'Young Female', gender: 'female', language: 'en' },
  
  // Celebrity-style voices
  { id: 'celebrity-1', name: 'Classic AI', gender: 'male', language: 'en' },
  { id: 'celebrity-2', name: 'Modern AI', gender: 'neutral', language: 'en' },
  { id: 'celebrity-3', name: 'Sci-Fi AI', gender: 'neutral', language: 'en' },
];

// Voice preset configurations
const VOICE_PRESETS = [
  { id: 'default', name: 'Default', speed: 1.0, pitch: 1.0 },
  { id: 'fast', name: 'Fast', speed: 1.5, pitch: 1.0 },
  { id: 'slow', name: 'Slow', speed: 0.75, pitch: 1.0 },
  { id: 'deep', name: 'Deep', speed: 0.9, pitch: 0.8 },
  { id: 'high', name: 'High', speed: 1.0, pitch: 1.2 },
  { id: 'excited', name: 'Excited', speed: 1.25, pitch: 1.15 },
  { id: 'calm', name: 'Calm', speed: 0.85, pitch: 0.95 },
  { id: 'professional', name: 'Professional', speed: 1.0, pitch: 1.0 },
];

interface VoiceViewProps {
  translations: {
    voiceAssistant: string;
    naturalLanguageSpeech: string;
    live: string;
    ready: string;
    listening: string;
    thinking: string;
    speaking: string;
    voiceError: string;
    tapToStart: string;
    listeningForVoice: string;
    processingRequest: string;
    jarvisSpeaking: string;
    voiceErrorOccurred: string;
    transcription: string;
    typeInstead: string;
    hideTextInput: string;
    typeMessage: string;
    conversationHistory: string;
    uploadAudio: string;
    selectVoice: string;
    speed: string;
    volume: string;
  };
  language: 'en' | 'ar';
}

// Speech recognition types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export default function VoiceView({ translations, language }: VoiceViewProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  
  // Voice settings
  const [selectedVoice, setSelectedVoice] = useState<string>('jarvis');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  
  // Voice cloning
  const [uploadedVoiceSample, setUploadedVoiceSample] = useState<string | null>(null);
  const [clonedVoiceName, setClonedVoiceName] = useState('');
  const [isCloningVoice, setIsCloningVoice] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);
  
  // UI states
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null);
  const [isPlayingUploaded, setIsPlayingUploaded] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceFilter, setVoiceFilter] = useState<'all' | 'male' | 'female' | 'ar' | 'en'>('all');
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const uploadedAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceSampleInputRef = useRef<HTMLInputElement>(null);

  // Check speech recognition support
  useEffect(() => {
    const hasSupport = typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );
    setIsSupported(hasSupport);
  }, []);

  // Audio level simulation
  useEffect(() => {
    if (voiceState === 'listening' || voiceState === 'speaking') {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [voiceState]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (uploadedAudioRef.current) {
        uploadedAudioRef.current.pause();
        uploadedAudioRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

    let finalTranscript = '';

    recognition.onstart = () => {
      setVoiceState('listening');
      setInterimTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalTranscript.trim());
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
        setVoiceState('error');
        setTimeout(() => setVoiceState('idle'), 2000);
      }
    };

    recognition.onend = () => {
      if (voiceState === 'listening') {
        const fullText = finalTranscript.trim();
        if (fullText) {
          processVoiceInput(fullText);
        } else {
          setVoiceState('idle');
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, voiceState, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (voiceState === 'listening') {
      stopListening();
      const fullText = (transcript + ' ' + interimTranscript).trim();
      if (fullText) {
        processVoiceInput(fullText);
      } else {
        setVoiceState('idle');
      }
    } else if (voiceState === 'idle' || voiceState === 'error') {
      setTranscript('');
      setInterimTranscript('');
      startListening();
    }
  }, [voiceState, transcript, interimTranscript, stopListening, startListening]);

  const processVoiceInput = useCallback(async (text: string) => {
    setVoiceState('thinking');
    setInterimTranscript('');

    const userEntry: ConversationEntry = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConversation(prev => [...prev.slice(-4), userEntry]);

    try {
      const history = conversation.slice(-4).map(m => ({
        role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }));

      const abortController = new AbortController();
      abortRef.current = abortController;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: text }], language }),
        signal: abortController.signal,
      });

      if (!res.ok) throw new Error('Chat request failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let aiResponse = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              aiResponse += parsed.content;
            }
          } catch { /* skip */ }
        }
      }

      const aiEntry: ConversationEntry = {
        id: Date.now() + 1,
        role: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversation(prev => [...prev, aiEntry]);

      if (aiResponse) {
        await speakText(aiResponse);
      } else {
        setVoiceState('idle');
      }
    } catch {
      setVoiceState('idle');
    } finally {
      setTranscript('');
    }
  }, [conversation, language]);

  const speakText = useCallback(async (text: string) => {
    try {
      setVoiceState('speaking');

      // Use clone API if we have a voice sample
      const apiEndpoint = uploadedVoiceSample ? '/api/voice/clone' : '/api/voice/tts';
      
      const requestBody = uploadedVoiceSample ? {
        text: text.slice(0, 500),
        audioData: uploadedVoiceSample,
        voiceId: selectedVoice,
        speed: voiceSpeed,
        pitch: voicePitch,
      } : {
        text: text.slice(0, 500),
        voice: selectedVoice,
        speed: voiceSpeed,
        pitch: voicePitch,
      };

      const ttsRes = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (ttsRes.ok) {
        const blob = await ttsRes.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.volume = voiceVolume;

        audio.onended = () => {
          setVoiceState('idle');
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setVoiceState('idle');
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };

        audio.play().catch(() => setVoiceState('idle'));
      } else {
        setVoiceState('idle');
      }
    } catch {
      setVoiceState('idle');
    }
  }, [selectedVoice, voiceSpeed, voicePitch, voiceVolume, uploadedVoiceSample]);

  const handleManualSend = useCallback(async () => {
    if (!manualInput.trim()) return;
    const text = manualInput.trim();
    setManualInput('');
    setShowTextInput(false);
    await processVoiceInput(text);
  }, [manualInput, processVoiceInput]);

  const handleAudioUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const audioUrl = event.target?.result as string;
      setUploadedAudio(audioUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  // Voice cloning handlers
  const handleVoiceSampleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCloningVoice(true);
    setCloneSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // Remove the data:audio/xxx;base64, prefix
      const base64Data = base64.split(',')[1];
      setUploadedVoiceSample(base64Data);
      setClonedVoiceName(file.name.replace(/\.[^/.]+$/, ''));
      setIsCloningVoice(false);
      setCloneSuccess(true);
      setTimeout(() => setCloneSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = VOICE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setVoiceSpeed(preset.speed);
      setVoicePitch(preset.pitch);
    }
  }, []);

  const playUploadedAudio = useCallback(() => {
    if (!uploadedAudio) return;
    
    const audio = new Audio(uploadedAudio);
    uploadedAudioRef.current = audio;
    audio.volume = voiceVolume;

    audio.onended = () => {
      setIsPlayingUploaded(false);
      uploadedAudioRef.current = null;
    };

    audio.play();
    setIsPlayingUploaded(true);
  }, [uploadedAudio, voiceVolume]);

  const stopUploadedAudio = useCallback(() => {
    if (uploadedAudioRef.current) {
      uploadedAudioRef.current.pause();
      uploadedAudioRef.current = null;
    }
    setIsPlayingUploaded(false);
  }, []);

  // Filter voices based on selected filter
  const filteredVoices = VOICE_OPTIONS.filter(voice => {
    if (voiceFilter === 'all') return true;
    if (voiceFilter === 'ar') return voice.language === 'ar' || voice.language === 'multi';
    if (voiceFilter === 'en') return voice.language === 'en' || voice.language === 'multi';
    return voice.gender === voiceFilter;
  });

  const stateConfig: Record<VoiceState, { label: string; color: string; glow: string }> = {
    idle: { label: translations.ready, color: '#90a8cc', glow: 'rgba(144, 168, 204, 0.2)' },
    listening: { label: translations.listening, color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.4)' },
    thinking: { label: translations.thinking, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    speaking: { label: translations.speaking, color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
    error: { label: translations.voiceError, color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  };

  const current = stateConfig[voiceState];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #0088cc20, #0088cc10)', border: '1px solid #0088cc30' }}>
            <Mic size={14} style={{ color: '#0088cc' }} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>
              {translations.voiceAssistant}
            </span>
            <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.naturalLanguageSpeech}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Settings button */}
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: showVoiceSettings ? 'rgba(0, 136, 204, 0.1)' : 'transparent',
              border: `1px solid ${showVoiceSettings ? 'rgba(0, 136, 204, 0.2)' : 'transparent'}`,
            }}
          >
            <Settings2 size={12} style={{ color: showVoiceSettings ? '#0088cc' : '#90a8cc' }} />
          </button>
          <div className="jarvis-live">
            <div className="jarvis-live-dot" style={{ background: current.color, boxShadow: `0 0 8px ${current.glow}` }} />
            <span>{current.label}</span>
          </div>
        </div>
      </div>

      {/* Voice Settings Panel */}
      {showVoiceSettings && (
        <div className="px-4 py-3 jarvis-animate-fade-in" style={{ borderBottom: '1px solid #0e1a3a', background: 'rgba(0, 8, 20, 0.5)' }}>
          {/* Voice Cloning Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={10} style={{ color: '#a855f7' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {language === 'ar' ? 'استنساخ الصوت' : 'Voice Cloning'}
              </span>
            </div>
            
            <input type="file" ref={voiceSampleInputRef} accept="audio/*" onChange={handleVoiceSampleUpload} className="hidden" />
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => voiceSampleInputRef.current?.click()}
                disabled={isCloningVoice}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] transition-all"
                style={{ 
                  background: cloneSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(168, 85, 247, 0.06)', 
                  border: `1px solid ${cloneSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.12)'}`, 
                  color: cloneSuccess ? '#10b981' : '#a855f7' 
                }}
              >
                {isCloningVoice ? (
                  <>
                    <Loader2 size={10} className="animate-spin" />
                    {language === 'ar' ? 'جارٍ المعالجة...' : 'Processing...'}
                  </>
                ) : cloneSuccess ? (
                  <>
                    <Check size={10} />
                    {language === 'ar' ? 'تم استنساخ الصوت!' : 'Voice Cloned!'}
                  </>
                ) : (
                  <>
                    <Upload size={10} />
                    {language === 'ar' ? 'رفع عينة صوتية' : 'Upload Voice Sample'}
                  </>
                )}
              </button>
              
              {uploadedVoiceSample && (
                <button
                  onClick={() => {
                    setUploadedVoiceSample(null);
                    setClonedVoiceName('');
                  }}
                  className="p-1.5 rounded-lg"
                  style={{ border: '1px solid #0e1a3a' }}
                >
                  <X size={10} style={{ color: '#ef4444' }} />
                </button>
              )}
            </div>
            
            {clonedVoiceName && (
              <p className="text-[9px] mt-1.5" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                {language === 'ar' ? 'الصوت المستنسخ:' : 'Cloned voice:'} {clonedVoiceName}
              </p>
            )}
          </div>

          {/* Voice Selection */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Headphones size={10} style={{ color: '#00e5ff' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.selectVoice}
              </span>
            </div>
            
            {/* Voice filter tabs */}
            <div className="flex gap-1 mb-2">
              {(['all', 'male', 'female', 'ar', 'en'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setVoiceFilter(filter)}
                  className="px-2 py-0.5 rounded text-[8px] transition-all"
                  style={{
                    background: voiceFilter === filter ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                    border: `1px solid ${voiceFilter === filter ? 'rgba(0, 229, 255, 0.2)' : 'transparent'}`,
                    color: voiceFilter === filter ? '#00e5ff' : '#90a8cc',
                  }}
                >
                  {filter === 'all' ? (language === 'ar' ? 'الكل' : 'All') : 
                   filter === 'ar' ? 'عربي' : 
                   filter === 'en' ? 'English' : 
                   filter === 'male' ? (language === 'ar' ? 'ذكر' : 'Male') : 
                   (language === 'ar' ? 'أنثى' : 'Female')}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-1 max-h-[120px] overflow-y-auto">
              {filteredVoices.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className="px-2 py-1.5 rounded-lg text-[9px] text-left transition-all"
                  style={{
                    background: selectedVoice === voice.id ? 'rgba(0, 229, 255, 0.12)' : 'rgba(0, 229, 255, 0.03)',
                    border: `1px solid ${selectedVoice === voice.id ? 'rgba(0, 229, 255, 0.25)' : 'rgba(0, 229, 255, 0.08)'}`,
                    color: selectedVoice === voice.id ? '#00e5ff' : '#90a8cc',
                  }}
                >
                  <div className="flex items-center gap-1">
                    {voice.gender === 'male' ? <User size={8} /> : voice.gender === 'female' ? <User size={8} style={{ color: '#f472b6' }} /> : null}
                    <span>{voice.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Presets */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={10} style={{ color: '#f59e0b' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {language === 'ar' ? 'إعدادات مسبقة' : 'Presets'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {VOICE_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className="px-2 py-1 rounded text-[8px] transition-all"
                  style={{
                    background: voiceSpeed === preset.speed && voicePitch === preset.pitch 
                      ? 'rgba(245, 158, 11, 0.15)' 
                      : 'rgba(245, 158, 11, 0.04)',
                    border: `1px solid ${voiceSpeed === preset.speed && voicePitch === preset.pitch 
                      ? 'rgba(245, 158, 11, 0.3)' 
                      : 'rgba(245, 158, 11, 0.1)'}`,
                    color: voiceSpeed === preset.speed && voicePitch === preset.pitch ? '#f59e0b' : '#90a8cc',
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Speed & Pitch Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.speed}</span>
                <span className="text-[9px] font-mono" style={{ color: '#00e5ff' }}>{voiceSpeed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="4"
                step="0.05"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #00e5ff ${((voiceSpeed - 0.25) / 3.75) * 100}%, #0e1a3a ${((voiceSpeed - 0.25) / 3.75) * 100}%)` }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {language === 'ar' ? 'النبرة' : 'Pitch'}
                </span>
                <span className="text-[9px] font-mono" style={{ color: '#a855f7' }}>{voicePitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                value={voicePitch}
                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #a855f7 ${((voicePitch - 0.5) / 1.5) * 100}%, #0e1a3a ${((voicePitch - 0.5) / 1.5) * 100}%)` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 py-6">
        {/* Waveform visualization */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-[3px] h-12">
            {Array.from({ length: 20 }).map((_, i) => {
              const baseHeight = 4;
              const maxAdditionalHeight = audioLevel * 32;
              return (
                <div
                  key={i}
                  className="rounded-full transition-all duration-100"
                  style={{
                    width: '3px',
                    height: voiceState === 'idle' ? baseHeight : baseHeight + maxAdditionalHeight * (0.5 + 0.5 * Math.sin(i * 0.5)),
                    background: current.color,
                    opacity: voiceState === 'idle' ? 0.2 : 0.4 + (i / 20) * 0.6,
                    boxShadow: voiceState !== 'idle' ? `0 0 4px ${current.color}40` : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Microphone button */}
        <div className="relative mb-6">
          <div
            className="absolute inset-[-16px] rounded-full"
            style={{
              border: `2px solid ${current.color}20`,
              boxShadow: `0 0 30px ${current.glow}, inset 0 0 20px ${current.glow}`,
              animation: voiceState === 'listening' ? 'jarvis-mic-pulse 2s ease-in-out infinite' : voiceState === 'speaking' ? 'jarvis-mic-pulse 1.5s ease-in-out infinite' : 'none',
            }}
          />

          <button
            onClick={toggleListening}
            className="relative w-20 h-20 flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              background: voiceState === 'idle' ? 'linear-gradient(135deg, #080e1e, #0a1020)' : `linear-gradient(135deg, ${current.color}15, ${current.color}08)`,
              border: `2px solid ${voiceState === 'idle' ? '#0e1a3a' : current.color}40`,
              cursor: 'pointer',
            }}
          >
            {voiceState === 'thinking' ? (
              <Loader2 size={28} className="animate-spin" style={{ color: current.color }} />
            ) : voiceState === 'speaking' ? (
              <Volume2 size={28} style={{ color: current.color }} />
            ) : voiceState === 'listening' ? (
              <Mic size={28} style={{ color: current.color }} />
            ) : (
              <MicOff size={28} style={{ color: '#90a8cc' }} />
            )}

            {voiceState === 'listening' && (
              <>
                <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${current.color}30`, animation: 'jarvis-mic-ring 2s ease-out infinite' }} />
                <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${current.color}20`, animation: 'jarvis-mic-ring 2s ease-out infinite 0.5s' }} />
              </>
            )}
          </button>
        </div>

        {/* Status text */}
        <p className="text-[11px] mb-2 tracking-wider" style={{ color: current.color }}>
          {voiceState === 'idle' && translations.tapToStart}
          {voiceState === 'listening' && translations.listeningForVoice}
          {voiceState === 'thinking' && translations.processingRequest}
          {voiceState === 'speaking' && translations.jarvisSpeaking}
          {voiceState === 'error' && translations.voiceErrorOccurred}
        </p>

        {/* Real-time transcription */}
        {(transcript || interimTranscript) && (
          <div className="w-full max-w-lg mb-6 p-3 rounded-xl text-center jarvis-animate-fade-in"
            style={{ background: 'rgba(0, 229, 255, 0.04)', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
            <p className="text-[10px] mb-1 tracking-wider uppercase" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.transcription}
            </p>
            <p className="text-[13px]" style={{ color: '#d0e4f8', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
              {transcript}
              <span style={{ color: 'rgba(0, 229, 255, 0.5)' }}>{interimTranscript}</span>
            </p>
          </div>
        )}

        {!isSupported && (
          <div className="w-full max-w-lg mb-6 p-3 rounded-xl text-center"
            style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <p className="text-[10px]" style={{ color: '#ef4444' }}>
              Speech recognition not supported in this browser. Use the text input below.
            </p>
          </div>
        )}

        {/* Audio upload */}
        <input type="file" ref={fileInputRef} accept="audio/*" onChange={handleAudioUpload} className="hidden" />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-[10px] transition-all"
          style={{ background: 'rgba(0, 136, 204, 0.06)', border: '1px solid rgba(0, 136, 204, 0.12)', color: '#0088cc' }}
        >
          <Upload size={11} />
          {translations.uploadAudio}
        </button>

        {uploadedAudio && (
          <div className="flex items-center gap-2 mb-4">
            {isPlayingUploaded ? (
              <button onClick={stopUploadedAudio} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px]"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                <Square size={10} /> Stop
              </button>
            ) : (
              <button onClick={playUploadedAudio} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px]"
                style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)', color: '#00e5ff' }}>
                <Play size={10} /> Play
              </button>
            )}
            <button onClick={() => setUploadedAudio(null)} className="p-1.5 rounded-lg" style={{ border: '1px solid #0e1a3a' }}>
              <X size={10} style={{ color: '#90a8cc' }} />
            </button>
          </div>
        )}

        {/* Text input toggle */}
        <button
          onClick={() => setShowTextInput(!showTextInput)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-[10px] transition-all"
          style={{
            background: showTextInput ? 'rgba(0, 229, 255, 0.1)' : 'rgba(0, 229, 255, 0.04)',
            border: `1px solid ${showTextInput ? 'rgba(0, 229, 255, 0.2)' : 'rgba(0, 229, 255, 0.08)'}`,
            color: '#90a8cc',
          }}
        >
          <Type size={11} />
          {showTextInput ? translations.hideTextInput : translations.typeInstead}
        </button>

        {/* Manual text input */}
        {showTextInput && (
          <div className="w-full max-w-lg mb-6 jarvis-chat-input flex items-center gap-2 p-2 jarvis-animate-fade-in">
            <input
              type="text"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualSend()}
              placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : translations.typeMessage}
              className="flex-1 bg-transparent text-[12px] outline-none placeholder-[#90a8cc]/30"
              style={{ color: '#d0e4f8', direction: language === 'ar' ? 'rtl' : 'ltr', fontFamily: 'inherit' }}
              disabled={voiceState === 'thinking' || voiceState === 'speaking'}
            />
            <button
              onClick={handleManualSend}
              disabled={!manualInput.trim() || voiceState === 'thinking' || voiceState === 'speaking'}
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all"
              style={{
                background: manualInput.trim() ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                border: `1px solid ${manualInput.trim() ? 'rgba(0, 229, 255, 0.3)' : '#0e1a3a'}`,
                opacity: manualInput.trim() ? 1 : 0.4,
              }}
            >
              <Send size={14} style={{ color: '#00e5ff' }} />
            </button>
          </div>
        )}

        {/* Conversation history */}
        {conversation.length > 0 && (
          <div className="w-full max-w-lg mt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#0088cc', boxShadow: '0 0 4px rgba(0, 136, 204, 0.4)' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.conversationHistory}
              </span>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto">
              {conversation.map(entry => (
                <div key={entry.id} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'} jarvis-animate-fade-in`}>
                  <div className={entry.role === 'user' ? 'jarvis-msg-user' : 'jarvis-msg-ai'} style={{ maxWidth: '85%' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] tracking-[0.12em] uppercase" style={{ color: entry.role === 'user' ? '#7c5cff' : '#00e5ff' }}>
                        {entry.role === 'user' ? 'YOU' : 'JARVIS'}
                      </span>
                      <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>
                        {entry.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: '#d0e4f8', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                      {entry.content.length > 200 ? entry.content.slice(0, 200) + '...' : entry.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
