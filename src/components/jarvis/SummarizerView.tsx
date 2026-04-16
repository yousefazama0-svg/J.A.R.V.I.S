'use client';

import React, { useState, useCallback } from 'react';
import {
  FileText,
  Scissors,
  Copy,
  Check,
  Loader2,
  Trash2,
  Download,
  Settings2,
  FileDown,
} from 'lucide-react';

type SummaryLength = 'short' | 'medium' | 'long';
type SummaryStyle = 'bullet' | 'paragraph' | 'key-points';

const LENGTH_OPTIONS: { value: SummaryLength; label: string; desc: string }[] = [
  { value: 'short', label: 'Short', desc: '1-2 sentences' },
  { value: 'medium', label: 'Medium', desc: '3-5 sentences' },
  { value: 'long', label: 'Detailed', desc: 'Full summary' },
];

const STYLE_OPTIONS: { value: SummaryStyle; label: string }[] = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'bullet', label: 'Bullet Points' },
  { value: 'key-points', label: 'Key Points' },
];

interface SummarizerViewProps {
  translations: {
    title: string;
    subtitle: string;
    enterText: string;
    summary: string;
    summarize: string;
    summarizing: string;
    length: string;
    style: string;
    copy: string;
    clear: string;
    download: string;
    originalText: string;
    summarizedText: string;
    characters: string;
    words: string;
    reduction: string;
  };
  language: 'en' | 'ar';
}

export default function SummarizerView({ translations, language }: SummarizerViewProps) {
  const [sourceText, setSourceText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>('paragraph');
  const [showSettings, setShowSettings] = useState(false);

  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const countChars = (text: string) => text.length;

  const summarizeText = useCallback(async () => {
    if (!sourceText.trim() || isSummarizing) return;

    setIsSummarizing(true);

    try {
      const styleInstruction = {
        'paragraph': 'Write as a cohesive paragraph.',
        'bullet': 'Format as bullet points with • symbols.',
        'key-points': 'Extract the key points as numbered list.',
      };

      const lengthInstruction = {
        'short': 'Keep it very brief (1-2 sentences max).',
        'medium': 'Create a moderate summary (3-5 sentences).',
        'long': 'Provide a comprehensive detailed summary.',
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Summarize the following text. ${lengthInstruction[summaryLength]} ${styleInstruction[summaryStyle]}

Text to summarize:
"""
${sourceText}
"""

Provide only the summary, nothing else.`
          }],
          language
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let result = '';
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
              result += parsed.content;
            }
          } catch { /* skip */ }
        }
      }

      setSummary(result.trim());

    } catch (error) {
      console.error('Summarization error:', error);
      setSummary(language === 'ar' ? 'حدث خطأ في التلخيص' : 'Summarization error occurred');
    } finally {
      setIsSummarizing(false);
    }
  }, [sourceText, summaryLength, summaryStyle, isSummarizing, language]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const downloadSummary = useCallback(() => {
    const content = `${language === 'ar' ? 'النص الأصلي' : 'Original Text'}:\n${sourceText}\n\n${language === 'ar' ? 'الملخص' : 'Summary'}:\n${summary}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `summary-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sourceText, summary, language]);

  const reductionPercent = sourceText && summary
    ? Math.round((1 - countWords(summary) / countWords(sourceText)) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #f59e0b20, #f59e0b10)', border: '1px solid #f59e0b30' }}>
            <Scissors size={14} style={{ color: '#f59e0b' }} />
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
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg transition-all"
            style={{
              background: showSettings ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              border: `1px solid ${showSettings ? 'rgba(245, 158, 11, 0.2)' : 'transparent'}`,
            }}
          >
            <Settings2 size={12} style={{ color: showSettings ? '#f59e0b' : '#90a8cc' }} />
          </button>
          <div className="jarvis-live">
            <div className="jarvis-live-dot" style={{ background: '#f59e0b', boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)' }} />
            <span style={{ color: '#f59e0b' }}>Ready</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 py-3 jarvis-animate-fade-in" style={{ borderBottom: '1px solid #0e1a3a', background: 'rgba(0, 8, 20, 0.5)' }}>
          {/* Length */}
          <div className="mb-3">
            <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.length}
            </span>
            <div className="flex gap-2">
              {LENGTH_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSummaryLength(opt.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-[9px] transition-all"
                  style={{
                    background: summaryLength === opt.value ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.04)',
                    border: `1px solid ${summaryLength === opt.value ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.1)'}`,
                    color: summaryLength === opt.value ? '#f59e0b' : '#90a8cc',
                  }}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[8px] opacity-60">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.style}
            </span>
            <div className="flex gap-2">
              {STYLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSummaryStyle(opt.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-[9px] transition-all"
                  style={{
                    background: summaryStyle === opt.value ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.04)',
                    border: `1px solid ${summaryStyle === opt.value ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.1)'}`,
                    color: summaryStyle === opt.value ? '#f59e0b' : '#90a8cc',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Source Text */}
        <div className="jarvis-hud-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.originalText}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                {countWords(sourceText)} {translations.words} • {countChars(sourceText)} {translations.characters}
              </span>
              <button
                onClick={() => { setSourceText(''); setSummary(''); }}
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
            rows={6}
            className="w-full bg-transparent text-[12px] outline-none resize-none leading-relaxed"
            style={{ color: '#d0e4f8', fontFamily: 'inherit', direction: language === 'ar' ? 'rtl' : 'ltr' }}
          />
        </div>

        {/* Summarize Button */}
        <button
          onClick={summarizeText}
          disabled={!sourceText.trim() || isSummarizing}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: sourceText.trim() && !isSummarizing
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : 'rgba(245, 158, 11, 0.06)',
            border: `1px solid ${sourceText.trim() && !isSummarizing ? 'rgba(245, 158, 11, 0.4)' : 'rgba(245, 158, 11, 0.1)'}`,
            color: sourceText.trim() && !isSummarizing ? '#060a14' : '#90a8cc',
            opacity: sourceText.trim() ? 1 : 0.5,
          }}
        >
          {isSummarizing ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              {translations.summarizing}
            </>
          ) : (
            <>
              <Scissors size={13} />
              {translations.summarize}
            </>
          )}
        </button>

        {/* Summary Result */}
        {(summary || isSummarizing) && (
          <div className="jarvis-hud-card p-4 jarvis-animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: '#f59e0b' }}>
                {translations.summarizedText}
              </span>
              <div className="flex items-center gap-2">
                {reductionPercent > 0 && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    -{reductionPercent}% {translations.reduction}
                  </span>
                )}
                <button
                  onClick={() => copyToClipboard(summary)}
                  disabled={!summary}
                  className="p-1 rounded transition-all"
                  style={{ opacity: summary ? 1 : 0.3 }}
                >
                  {copied ? <Check size={10} style={{ color: '#10b981' }} /> : <Copy size={10} style={{ color: '#f59e0b' }} />}
                </button>
                <button
                  onClick={downloadSummary}
                  disabled={!summary}
                  className="p-1 rounded transition-all"
                  style={{ opacity: summary ? 1 : 0.3 }}
                >
                  <Download size={10} style={{ color: '#f59e0b' }} />
                </button>
              </div>
            </div>
            {isSummarizing ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 size={14} className="animate-spin" style={{ color: '#f59e0b' }} />
                <span className="text-[11px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.summarizing}...
                </span>
              </div>
            ) : (
              <p className="text-[12px] leading-relaxed whitespace-pre-wrap" style={{ color: '#d0e4f8', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                {summary}
              </p>
            )}
            {summary && (
              <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(144, 168, 204, 0.1)' }}>
                <span className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                  {countWords(summary)} {translations.words} • {countChars(summary)} {translations.characters}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
