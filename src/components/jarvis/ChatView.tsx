'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Upload, Image, Video, Presentation, Code2, Copy, Check, StopCircle, Trash2, Download, RotateCcw } from 'lucide-react';
import ArcReactorLogo from './ArcReactorLogo';

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  loading?: boolean;
  timestamp?: string;
}

const STORAGE_KEY = 'jarvis-chat-history';

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveMessages(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch { /* ignore */ }
}

interface ChatViewProps {
  onNavigate?: (tab: string, data?: { prompt?: string; topic?: string }) => void;
  translations: {
    aiChat: string;
    messages: string;
    live: string;
    exportChat: string;
    clearChat: string;
    welcomeToJarvis: string;
    welcomeSub: string;
    generateImage: string;
    createVideo: string;
    buildSlides: string;
    explainCode: string;
    placeholder: string;
    you: string;
    jarvis: string;
    thinking: string;
    commands: { image: string; video: string; slides: string };
  };
  language: 'en' | 'ar';
}

export default function ChatView({ onNavigate, translations, language }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeMode, setActiveMode] = useState<'general' | 'image' | 'video' | 'slides'>('general');
  const [showActions, setShowActions] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // Detect command mode from input
  useEffect(() => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed.startsWith('/image')) setActiveMode('image');
    else if (trimmed.startsWith('/video')) setActiveMode('video');
    else if (trimmed.startsWith('/slides')) setActiveMode('slides');
    else setActiveMode('general');
  }, [input]);

  const copyToClipboard = useCallback(async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* fallback */ }
  }, []);

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
    setMessages(prev =>
      prev.map(m => m.loading ? { ...m, loading: false } : m)
    );
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    saveMessages([]);
  }, []);

  const exportChat = useCallback(() => {
    if (messages.length === 0) return;
    let text = 'JARVIS Chat Export\n';
    text += `${'='.repeat(50)}\n`;
    text += `Date: ${new Date().toLocaleString()}\n`;
    text += `Messages: ${messages.length}\n`;
    text += `${'='.repeat(50)}\n\n`;

    messages.forEach((msg) => {
      const role = msg.role === 'user' ? 'YOU' : 'JARVIS';
      const time = msg.timestamp || '';
      text += `[${time}] ${role}:\n${msg.content}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jarvis-chat-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [messages]);

  const sendToApi = useCallback(async (userContent: string, existingMessages: Message[]) => {
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: 'ai',
      content: '',
      loading: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...existingMessages, aiMsg];
    setMessages(newMessages);
    setIsStreaming(true);

    // Build message history for API
    const history = [...existingMessages].map(m => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.content,
    }));

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, language }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errData.error || 'Request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data: ')) continue;

          const data = trimmedLine.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              accumulated += parsed.content;
              const currentAccumulated = accumulated;
              setMessages(prev =>
                prev.map(m =>
                  m.id === aiMsg.id
                    ? { ...m, content: currentAccumulated, loading: false }
                    : m
                )
              );
            }
          } catch { /* Skip malformed */ }
        }
      }

      // Final save with complete AI message
      setMessages(prev => {
        const final = prev.map(m => m.loading ? { ...m, loading: false } : m);
        saveMessages(final);
        return final;
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled
        setMessages(prev => {
          const final = prev.map(m => m.loading ? { ...m, loading: false } : m);
          saveMessages(final);
          return final;
        });
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
        setMessages(prev => {
          const final = prev.map(m =>
            m.id === aiMsg.id
              ? { ...m, content: `⚠️ ${errorMsg}`, loading: false }
              : m
          );
          saveMessages(final);
          return final;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [language]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    // Check for slash commands that navigate to other views
    const lowerTrimmed = trimmed.toLowerCase();

    if (lowerTrimmed.startsWith('/image ')) {
      const prompt = trimmed.slice(7).trim();
      if (prompt && onNavigate) {
        onNavigate('photo', { prompt });
        setInput('');
        setActiveMode('general');
        return;
      }
    }

    if (lowerTrimmed.startsWith('/video ')) {
      const prompt = trimmed.slice(7).trim();
      if (prompt && onNavigate) {
        onNavigate('video', { prompt });
        setInput('');
        setActiveMode('general');
        return;
      }
    }

    if (lowerTrimmed.startsWith('/slides ')) {
      const topic = trimmed.slice(8).trim();
      if (topic && onNavigate) {
        onNavigate('slides', { topic });
        setInput('');
        setActiveMode('general');
        return;
      }
    }

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveMessages(newMessages);
    setInput('');
    setActiveMode('general');

    await sendToApi(trimmed, newMessages);
  }, [input, messages, isStreaming, onNavigate, sendToApi]);

  const handleSuggestion = useCallback(async (label: string, type?: 'image' | 'video' | 'slides') => {
    if (type && onNavigate) {
      onNavigate(type, { prompt: label, topic: label });
      return;
    }

    // Send as a regular chat message
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveMessages(newMessages);

    await sendToApi(label, newMessages);
  }, [messages, onNavigate, sendToApi]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { label: translations.generateImage, icon: Image, color: '#00e5ff', type: 'image' as const },
    { label: translations.createVideo, icon: Video, color: '#7c5cff', type: 'video' as const },
    { label: translations.buildSlides, icon: Presentation, color: '#f59e0b', type: 'slides' as const },
    { label: translations.explainCode, icon: Code2, color: '#10b981', type: undefined },
  ];

  const commands = [
    { label: '/image', desc: translations.commands.image },
    { label: '/video', desc: translations.commands.video },
    { label: '/slides', desc: translations.commands.slides },
  ];

  const modeLabels: Record<string, { text: string; color: string }> = {
    image: { text: 'IMAGE MODE', color: '#00e5ff' },
    video: { text: 'VIDEO MODE', color: '#7c5cff' },
    slides: { text: 'SLIDES MODE', color: '#f59e0b' },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <ArcReactorLogo size={32} />
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>
              {translations.aiChat}
            </span>
            {messages.length > 0 && (
              <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.35)' }}>
                {messages.length} {translations.messages}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Actions button */}
          <button
            onClick={() => setShowActions(!showActions)}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
            style={{
              background: showActions ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
              border: `1px solid ${showActions ? 'rgba(0, 229, 255, 0.2)' : 'transparent'}`,
            }}
          >
            <RotateCcw size={12} style={{ color: '#90a8cc' }} />
          </button>

          {activeMode !== 'general' && modeLabels[activeMode] && (
            <div
              className="jarvis-badge"
              style={{
                background: `${modeLabels[activeMode].color}15`,
                border: `1px solid ${modeLabels[activeMode].color}30`,
                color: modeLabels[activeMode].color,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: modeLabels[activeMode].color,
                  boxShadow: `0 0 6px ${modeLabels[activeMode].color}60`,
                }}
              />
              {modeLabels[activeMode].text}
            </div>
          )}
          <div className="jarvis-live">
            <div className="jarvis-live-dot" />
            <span>{translations.live}</span>
          </div>
        </div>
      </div>

      {/* Actions dropdown */}
      {showActions && (
        <div
          className="absolute right-4 top-[104px] z-30 jarvis-hud-card p-2 jarvis-animate-fade-in"
          style={{ minWidth: '160px' }}
        >
          <button
            onClick={() => { exportChat(); setShowActions(false); }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[10px] transition-all text-left"
            style={{ color: '#90a8cc' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0, 229, 255, 0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Download size={11} style={{ color: '#00e5ff' }} />
            {translations.exportChat}
          </button>
          <button
            onClick={() => { clearChat(); setShowActions(false); }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[10px] transition-all text-left"
            style={{ color: '#ef4444' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Trash2 size={11} />
            {translations.clearChat}
          </button>
        </div>
      )}

      {/* Messages area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ paddingBottom: '140px' }}
      >
        {/* Empty state */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full gap-5 jarvis-animate-fade-in">
            {/* JARVIS Icon */}
            <div className="relative">
              <ArcReactorLogo size={64} />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1px solid rgba(0, 229, 255, 0.1)',
                  animation: 'jarvis-pulse-glow 3s ease-in-out infinite',
                }}
              />
            </div>

            {/* Welcome text */}
            <div className="text-center">
              <p className="text-[13px] mb-1.5" style={{ color: '#d0e4f8' }}>
                {translations.welcomeToJarvis}
              </p>
              <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.welcomeSub}
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {suggestions.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={i}
                    className="jarvis-chip jarvis-animate-slide-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                    onClick={() => handleSuggestion(s.label, s.type)}
                  >
                    <Icon size={12} style={{ color: s.color }} />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex mb-3 jarvis-animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`relative max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'jarvis-msg-user' : 'jarvis-msg-ai'}`}>
              {/* Message label */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[8px] tracking-[0.12em] uppercase"
                  style={{ color: msg.role === 'user' ? '#7c5cff' : '#00e5ff' }}
                >
                  {msg.role === 'user' ? translations.you : translations.jarvis}
                </span>
                {msg.timestamp && (
                  <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>
                    {msg.timestamp}
                  </span>
                )}
              </div>

              {/* Message content */}
              <p
                className="text-[12px] leading-relaxed whitespace-pre-wrap break-words"
                style={{ color: '#d0e4f8' }}
              >
                {msg.content}
                {msg.loading && !msg.content && (
                  <span className="inline-flex items-center gap-1 ml-1">
                    <span style={{ color: '#00e5ff' }}>{translations.thinking}</span>
                    <span className="inline-flex gap-0.5">
                      <span className="w-1 h-1 rounded-full" style={{ background: '#00e5ff', animation: 'jarvis-blink 1.4s infinite 0ms' }} />
                      <span className="w-1 h-1 rounded-full" style={{ background: '#00e5ff', animation: 'jarvis-blink 1.4s infinite 200ms' }} />
                      <span className="w-1 h-1 rounded-full" style={{ background: '#00e5ff', animation: 'jarvis-blink 1.4s infinite 400ms' }} />
                    </span>
                  </span>
                )}
              </p>

              {/* Copy button on AI messages */}
              {msg.role === 'ai' && msg.content && !msg.loading && (
                <div
                  className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover-show"
                  style={{
                    background: 'rgba(8, 14, 30, 0.9)',
                    border: '1px solid #0e1a3a',
                    borderRadius: '6px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0'; }}
                >
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="flex items-center justify-center w-6 h-6 rounded-md"
                    title="Copy"
                  >
                    {copiedId === msg.id ? (
                      <Check size={10} style={{ color: '#10b981' }} />
                    ) : (
                      <Copy size={10} style={{ color: '#90a8cc' }} />
                    )}
                  </button>
                </div>
              )}

              {/* Streaming cursor */}
              {msg.loading && msg.content && (
                <span style={{ color: '#00e5ff' }} className="jarvis-cursor-blink" />
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="fixed bottom-[52px] left-0 right-0 p-3 z-20"
        style={{
          background: 'rgba(6, 10, 20, 0.95)',
          borderTop: '1px solid #0e1a3a',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Command chips */}
        <div className="flex gap-2 mb-2">
          {commands.map((cmd, i) => (
            <button
              key={i}
              className="jarvis-cmd-chip"
              onClick={() => {
                setInput(cmd.label + ' ');
                textareaRef.current?.focus();
              }}
            >
              {cmd.label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="jarvis-chat-input flex items-end gap-2 p-2">
          {/* Upload button (decorative) */}
          <button className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors hover:bg-[#0e1a3a]">
            <Upload size={14} style={{ color: '#90a8cc' }} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={translations.placeholder}
            rows={1}
            className="flex-1 bg-transparent text-[12px] outline-none placeholder-[#90a8cc]/40 resize-none leading-relaxed"
            style={{ color: '#d0e4f8', maxHeight: '120px', fontFamily: 'inherit', direction: language === 'ar' ? 'rtl' : 'ltr' }}
          />

          {/* Stop / Send button */}
          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all active:scale-95"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <StopCircle size={14} style={{ color: '#ef4444' }} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all active:scale-95"
              style={{
                background: input.trim() ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                border: `1px solid ${input.trim() ? 'rgba(0, 229, 255, 0.3)' : '#0e1a3a'}`,
                opacity: input.trim() ? 1 : 0.4,
              }}
            >
              <Send size={14} style={{ color: '#00e5ff' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
