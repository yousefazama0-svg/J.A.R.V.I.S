'use client';

import React, { useState, useCallback } from 'react';
import {
  Globe,
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Loader2,
  Volume2,
  Trash2,
  History,
} from 'lucide-react';

interface TranslationHistory {
  id: number;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
];

interface TranslatorViewProps {
  translations: {
    title: string;
    subtitle: string;
    sourceLanguage: string;
    targetLanguage: string;
    enterText: string;
    translation: string;
    translate: string;
    translating: string;
    swapLanguages: string;
    copy: string;
    listen: string;
    clear: string;
    history: string;
    detected: string;
  };
  language: 'en' | 'ar';
}

export default function TranslatorView({ translations, language }: TranslatorViewProps) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ar');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState<'source' | 'target' | null>(null);
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

  const translateText = useCallback(async () => {
    if (!sourceText.trim() || isTranslating) return;

    setIsTranslating(true);
    setDetectedLang(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Translate the following text from ${sourceLang === 'auto' ? 'detect language' : sourceLang} to ${targetLang}. Only provide the translation, nothing else:\n\n"${sourceText}"`
          }],
          language: targetLang === 'ar' ? 'ar' : 'en'
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let translation = '';
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
              translation += parsed.content;
            }
          } catch { /* skip */ }
        }
      }

      setTranslatedText(translation.trim());

      // Add to history
      const historyItem: TranslationHistory = {
        id: Date.now(),
        sourceText: sourceText.trim(),
        translatedText: translation.trim(),
        sourceLang,
        targetLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 10));

    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText(language === 'ar' ? 'حدث خطأ في الترجمة' : 'Translation error occurred');
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, sourceLang, targetLang, isTranslating, language]);

  const swapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  }, [sourceLang, targetLang, sourceText, translatedText]);

  const copyToClipboard = useCallback((text: string, type: 'source' | 'target') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const speakText = useCallback((text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }, []);

  const loadFromHistory = useCallback((item: TranslationHistory) => {
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setShowHistory(false);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #10b98120, #10b98110)', border: '1px solid #10b98130' }}>
            <Globe size={14} style={{ color: '#10b981' }} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>
              {translations.title}
            </span>
            <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg transition-all"
              style={{
                background: showHistory ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: `1px solid ${showHistory ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}`,
              }}
            >
              <History size={12} style={{ color: showHistory ? '#10b981' : '#90a8cc' }} />
            </button>
          )}
          <div className="jarvis-live">
            <div className="jarvis-live-dot" style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
            <span style={{ color: '#10b981' }}>Ready</span>
          </div>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && history.length > 0 && (
        <div className="px-4 py-3 jarvis-animate-fade-in" style={{ borderBottom: '1px solid #0e1a3a', background: 'rgba(0, 8, 20, 0.5)' }}>
          <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
            {translations.history}
          </span>
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {history.map(item => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item)}
                className="w-full p-2 rounded-lg text-left transition-all"
                style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.1)' }}
              >
                <p className="text-[10px] truncate" style={{ color: '#90a8cc' }}>{item.sourceText}</p>
                <p className="text-[9px] truncate" style={{ color: '#10b981' }}>{item.translatedText}</p>
                <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>{item.timestamp}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-[10px] outline-none"
            style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid #0e1a3a', color: '#d0e4f8' }}
          >
            <option value="auto">{language === 'ar' ? '🔍 كشف تلقائي' : '🔍 Auto Detect'}</option>
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
            ))}
          </select>

          <button
            onClick={swapLanguages}
            className="p-2 rounded-lg transition-all"
            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
            title={translations.swapLanguages}
          >
            <ArrowRightLeft size={14} style={{ color: '#10b981' }} />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-[10px] outline-none"
            style={{ background: 'rgba(0, 0, 0, 0.2)', border: '1px solid #0e1a3a', color: '#d0e4f8' }}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
            ))}
          </select>
        </div>

        {/* Source Text */}
        <div className="jarvis-hud-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.sourceLanguage}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => sourceText && speakText(sourceText, sourceLang)}
                disabled={!sourceText}
                className="p-1 rounded transition-all"
                style={{ opacity: sourceText ? 1 : 0.3 }}
              >
                <Volume2 size={10} style={{ color: '#90a8cc' }} />
              </button>
              <button
                onClick={() => copyToClipboard(sourceText, 'source')}
                disabled={!sourceText}
                className="p-1 rounded transition-all"
                style={{ opacity: sourceText ? 1 : 0.3 }}
              >
                {copied === 'source' ? <Check size={10} style={{ color: '#10b981' }} /> : <Copy size={10} style={{ color: '#90a8cc' }} />}
              </button>
              <button
                onClick={() => { setSourceText(''); setTranslatedText(''); }}
                disabled={!sourceText}
                className="p-1 rounded transition-all"
                style={{ opacity: sourceText ? 1 : 0.3 }}
              >
                <Trash2 size={10} style={{ color: '#ef4444' }} />
              </button>
            </div>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={translations.enterText}
            rows={4}
            className="w-full bg-transparent text-[12px] outline-none resize-none leading-relaxed"
            style={{ color: '#d0e4f8', fontFamily: 'inherit', direction: language === 'ar' ? 'rtl' : 'ltr' }}
          />
          {detectedLang && (
            <p className="text-[9px] mt-2" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.detected}: {LANGUAGES.find(l => l.code === detectedLang)?.name}
            </p>
          )}
        </div>

        {/* Translate Button */}
        <button
          onClick={translateText}
          disabled={!sourceText.trim() || isTranslating}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: sourceText.trim() && !isTranslating
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'rgba(16, 185, 129, 0.06)',
            border: `1px solid ${sourceText.trim() && !isTranslating ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.1)'}`,
            color: sourceText.trim() && !isTranslating ? '#ffffff' : '#90a8cc',
            opacity: sourceText.trim() ? 1 : 0.5,
          }}
        >
          {isTranslating ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              {translations.translating}
            </>
          ) : (
            <>
              <Languages size={13} />
              {translations.translate}
            </>
          )}
        </button>

        {/* Translated Text */}
        {(translatedText || isTranslating) && (
          <div className="jarvis-hud-card p-4 jarvis-animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: '#10b981' }}>
                {translations.targetLanguage}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => translatedText && speakText(translatedText, targetLang)}
                  disabled={!translatedText}
                  className="p-1 rounded transition-all"
                  style={{ opacity: translatedText ? 1 : 0.3 }}
                >
                  <Volume2 size={10} style={{ color: '#10b981' }} />
                </button>
                <button
                  onClick={() => copyToClipboard(translatedText, 'target')}
                  disabled={!translatedText}
                  className="p-1 rounded transition-all"
                  style={{ opacity: translatedText ? 1 : 0.3 }}
                >
                  {copied === 'target' ? <Check size={10} style={{ color: '#10b981' }} /> : <Copy size={10} style={{ color: '#10b981' }} />}
                </button>
              </div>
            </div>
            {isTranslating ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 size={14} className="animate-spin" style={{ color: '#10b981' }} />
                <span className="text-[11px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.translating}...
                </span>
              </div>
            ) : (
              <p className="text-[12px] leading-relaxed whitespace-pre-wrap" style={{ color: '#d0e4f8', direction: targetLang === 'ar' ? 'rtl' : 'ltr' }}>
                {translatedText}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
