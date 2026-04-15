'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Presentation,
  Loader2,
  Download,
  Copy,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  FileText,
  LayoutDashboard,
  Type,
  Columns2,
  ImageIcon,
  Quote,
  Minus,
  Check,
} from 'lucide-react';

interface Slide {
  title: string;
  content: string;
  layout: string;
  notes: string;
}

const SLIDE_COUNT_OPTIONS = [5, 8, 10, 12, 15, 20, 25, 30];
type SlideStyle = 'Professional' | 'Creative' | 'Minimal' | 'Bold' | 'Academic' | 'Corporate' | 'Startup' | 'Educational';

const STYLE_OPTIONS: SlideStyle[] = ['Professional', 'Creative', 'Minimal', 'Bold', 'Academic', 'Corporate', 'Startup', 'Educational'];

const LAYOUT_ICONS: Record<string, React.ReactNode> = {
  'title-slide': <Type size={12} />,
  content: <FileText size={12} />,
  'two-column': <Columns2 size={12} />,
  image: <ImageIcon size={12} />,
  quote: <Quote size={12} />,
  blank: <Minus size={12} />,
};

function formatSlideNumber(num: number, total: number): string {
  return `${String(num).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

interface SlidesViewProps {
  initialTopic?: string;
  translations: {
    slidesBuilder: string;
    aiPresentationCreator: string;
    live: string;
    topic: string;
    slides: string;
    style: string;
    buildPresentation: string;
    buildingPresentation: string;
    generated: string;
    noPresentationsYet: string;
    noPresentationsSub: string;
    preview: string;
    export: string;
    copyAll: string;
    copied: string;
    speakerNotes: string;
    slidesGenerated: string;
  };
  language: 'en' | 'ar';
}

export default function SlidesView({ initialTopic, translations, language }: SlidesViewProps) {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(8);
  const [style, setStyle] = useState<SlideStyle>('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSlide, setCopiedSlide] = useState<number | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  const generateSlides = useCallback(async () => {
    const trimmed = topic.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setSlides([]);
    setCurrentSlide(0);

    try {
      const res = await fetch('/api/slides/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmed, slideCount, style: style.toLowerCase(), language }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Generation failed');

      if (data.slides && Array.isArray(data.slides)) setSlides(data.slides);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Generation failed';
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  }, [topic, slideCount, style, isGenerating, language]);

  const exportAsText = useCallback(() => {
    if (slides.length === 0) return;
    let text = `Presentation: ${topic}\nStyle: ${style} | Slides: ${slides.length}\n${'='.repeat(60)}\n\n`;
    slides.forEach((s, i) => {
      text += `--- Slide ${i + 1} [${s.layout}] ---\n`;
      text += `${s.title}\n\n${s.content}\n`;
      if (s.notes) text += `\n[Speaker Notes]: ${s.notes}\n`;
      text += '\n';
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jarvis-slides-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [slides, topic, style]);

  const exportAsJSON = useCallback(() => {
    if (slides.length === 0) return;
    const data = { topic, style, slideCount: slides.length, slides, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jarvis-slides-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [slides, topic, style]);

  const copyAll = useCallback(() => {
    if (slides.length === 0) return;
    let text = '';
    slides.forEach((s, i) => { text += `Slide ${i + 1}: ${s.title}\n${s.content}\n\n`; });
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  }, [slides]);

  const copySlide = useCallback((index: number) => {
    const s = slides[index];
    if (!s) return;
    const text = `${s.title}\n${s.content}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSlide(index);
      setTimeout(() => setCopiedSlide(null), 2000);
    });
  }, [slides]);

  const goToSlide = useCallback((idx: number) => {
    if (idx >= 0 && idx < slides.length) setCurrentSlide(idx);
  }, [slides.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') generateSlides();
  };

  const renderSkeleton = () => (
    <div className="space-y-3 jarvis-animate-fade-in">
      {[0, 1, 2].map(i => (
        <div key={i} className="jarvis-hud-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-16 h-3 rounded jarvis-shimmer" style={{ background: '#060a14' }} />
            <div className="w-8 h-3 rounded jarvis-shimmer" style={{ background: '#060a14' }} />
          </div>
          <div className="w-3/4 h-4 rounded jarvis-shimmer mb-2" style={{ background: '#060a14' }} />
          <div className="w-full h-3 rounded jarvis-shimmer mb-1.5" style={{ background: '#060a14' }} />
          <div className="w-5/6 h-3 rounded jarvis-shimmer mb-1.5" style={{ background: '#060a14' }} />
          <div className="w-2/3 h-3 rounded jarvis-shimmer" style={{ background: '#060a14' }} />
        </div>
      ))}
    </div>
  );

  const renderSlideCard = (slide: Slide, index: number) => (
    <div key={index} className="jarvis-hud-card p-4 jarvis-animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            {formatSlideNumber(index + 1, slides.length)}
          </span>
          <span className="text-[8px] flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'rgba(144, 168, 204, 0.06)', color: '#90a8cc' }}>
            {LAYOUT_ICONS[slide.layout] || <LayoutDashboard size={12} />}
            {slide.layout}
          </span>
        </div>
        <button onClick={() => copySlide(index)} className="p-1 rounded-md transition-colors hover:bg-[#0e1a3a]" title="Copy content">
          {copiedSlide === index ? <Check size={11} style={{ color: '#10b981' }} /> : <Copy size={11} style={{ color: '#90a8cc' }} />}
        </button>
      </div>
      <h3 className="text-[13px] font-bold mb-2 leading-snug" style={{ color: '#d0e4f8' }}>{slide.title}</h3>
      <div className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: '#90a8cc' }}>{slide.content}</div>
      {slide.notes && (
        <div className="mt-3">
          <button onClick={() => setExpandedNotes(expandedNotes === index ? null : index)} className="flex items-center gap-1 text-[9px] tracking-wider uppercase transition-colors" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
            <ChevronRight size={10} style={{ transform: expandedNotes === index ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            {translations.speakerNotes}
          </button>
          {expandedNotes === index && (
            <p className="text-[9px] mt-1.5 pl-4 leading-relaxed" style={{ color: 'rgba(144, 168, 204, 0.35)' }}>{slide.notes}</p>
          )}
        </div>
      )}
    </div>
  );

  const renderPreview = () => {
    const slide = slides[currentSlide];
    if (!slide) return null;

    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#060a14' }}>
        <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
          <div className="flex items-center gap-2">
            <Presentation size={14} style={{ color: '#f59e0b' }} />
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>{topic}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono" style={{ color: '#f59e0b' }}>{formatSlideNumber(currentSlide + 1, slides.length)}</span>
            <button onClick={() => setIsPreviewMode(false)} className="p-1.5 rounded-lg" style={{ background: 'rgba(8, 14, 30, 0.8)', border: '1px solid #0e1a3a' }}>
              <X size={14} style={{ color: '#90a8cc' }} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl aspect-[16/9] flex flex-col items-center justify-center p-8 jarvis-hud-card" style={{ borderRadius: '16px' }}>
            <div className="jarvis-scan-line" />
            <span className="text-[9px] font-mono mb-4 px-2 py-0.5 rounded" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>{slide.layout}</span>
            <h2 className="text-lg md:text-2xl font-bold text-center mb-4" style={{ color: '#d0e4f8' }}>{slide.title}</h2>
            <div className="text-[11px] md:text-sm text-center leading-relaxed whitespace-pre-line" style={{ color: '#90a8cc' }}>{slide.content}</div>
            {slide.notes && <p className="text-[8px] mt-6 max-w-md text-center" style={{ color: 'rgba(144, 168, 204, 0.25)' }}>{slide.notes}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #0e1a3a' }}>
          <button onClick={() => goToSlide(currentSlide - 1)} disabled={currentSlide === 0} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] transition-all"
            style={{ background: currentSlide > 0 ? 'rgba(245, 158, 11, 0.1)' : 'transparent', border: `1px solid ${currentSlide > 0 ? 'rgba(245, 158, 11, 0.2)' : 'transparent'}`, color: currentSlide > 0 ? '#f59e0b' : '#90a8cc', opacity: currentSlide > 0 ? 1 : 0.3, cursor: currentSlide > 0 ? 'pointer' : 'not-allowed' }}>
            <ChevronLeft size={12} /> Previous
          </button>
          <div className="flex items-center gap-1">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goToSlide(i)} className="rounded-full transition-all"
                style={{ width: i === currentSlide ? '16px' : '6px', height: '6px', background: i === currentSlide ? '#f59e0b' : 'rgba(144, 168, 204, 0.2)', boxShadow: i === currentSlide ? '0 0 6px rgba(245, 158, 11, 0.4)' : 'none' }} />
            ))}
          </div>
          <button onClick={() => goToSlide(currentSlide + 1)} disabled={currentSlide === slides.length - 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] transition-all"
            style={{ background: currentSlide < slides.length - 1 ? 'rgba(245, 158, 11, 0.1)' : 'transparent', border: `1px solid ${currentSlide < slides.length - 1 ? 'rgba(245, 158, 11, 0.2)' : 'transparent'}`, color: currentSlide < slides.length - 1 ? '#f59e0b' : '#90a8cc', opacity: currentSlide < slides.length - 1 ? 1 : 0.3, cursor: currentSlide < slides.length - 1 ? 'pointer' : 'not-allowed' }}>
            Next <ChevronRight size={12} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #f59e0b20, #f59e0b10)', border: '1px solid #f59e0b30' }}>
            <Presentation size={14} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>{translations.slidesBuilder}</span>
            <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>{translations.aiPresentationCreator}</p>
          </div>
        </div>
        <div className="jarvis-live">
          <div className="jarvis-live-dot" style={{ background: '#f59e0b', boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)' }} />
          <span style={{ color: '#f59e0b' }}>{translations.live}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ paddingBottom: '20px' }}>
        <div className="jarvis-hud-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={11} style={{ color: '#f59e0b' }} />
            <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.topic}</span>
          </div>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={language === 'ar' ? 'ما هو موضوع العرض التقديمي؟' : 'What should the presentation be about?'}
            className="w-full bg-transparent text-[12px] outline-none placeholder-[#90a8cc]/30 mb-3"
            style={{ color: '#d0e4f8', fontFamily: 'inherit', direction: language === 'ar' ? 'rtl' : 'ltr' }} />

          {/* Slide count */}
          <div className="flex items-start gap-2 mb-2.5">
            <span className="text-[9px] tracking-[0.12em] uppercase shrink-0 pt-1" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.slides}</span>
            <div className="flex flex-wrap gap-1.5">
              {SLIDE_COUNT_OPTIONS.map(c => (
                <button key={c} onClick={() => setSlideCount(c)} className="px-2.5 py-1 rounded-md text-[9px] transition-all"
                  style={{ background: slideCount === c ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.04)', border: `1px solid ${slideCount === c ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.1)'}`, color: slideCount === c ? '#f59e0b' : '#90a8cc' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="flex items-start gap-2 mb-3">
            <span className="text-[9px] tracking-[0.12em] uppercase shrink-0 pt-1" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.style}</span>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_OPTIONS.map(s => (
                <button key={s} onClick={() => setStyle(s)} className="px-3 py-1 rounded-md text-[9px] transition-all"
                  style={{ background: style === s ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.04)', border: `1px solid ${style === s ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.1)'}`, color: style === s ? '#f59e0b' : '#90a8cc' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generateSlides} disabled={!topic.trim() || isGenerating}
            className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            style={{ background: topic.trim() && !isGenerating ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(245, 158, 11, 0.06)', border: `1px solid ${topic.trim() && !isGenerating ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.1)'}`, color: topic.trim() && !isGenerating ? '#060a14' : '#90a8cc', opacity: topic.trim() && !isGenerating ? 1 : 0.5, cursor: topic.trim() && !isGenerating ? 'pointer' : 'not-allowed', boxShadow: topic.trim() && !isGenerating ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none' }}>
            {isGenerating ? (<><Loader2 size={13} className="animate-spin" />{translations.buildingPresentation}</>) : (<><Sparkles size={13} />{translations.buildPresentation}</>)}
          </button>
        </div>

        {error && (
          <div className="jarvis-hud-card p-3 flex items-center gap-2" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <X size={12} style={{ color: '#ef4444' }} />
            <span className="text-[10px]" style={{ color: '#ef4444' }}>{error}</span>
          </div>
        )}
        {isGenerating && renderSkeleton()}

        {slides.length > 0 && !isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f59e0b', boxShadow: '0 0 4px rgba(245, 158, 11, 0.4)' }} />
                <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{translations.slidesGenerated} {slides.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setIsPreviewMode(true)} className="jarvis-cmd-chip flex items-center gap-1"><Maximize2 size={10} />{translations.preview}</button>
                <button onClick={exportAsText} className="jarvis-cmd-chip flex items-center gap-1"><Download size={10} />TXT</button>
                <button onClick={exportAsJSON} className="jarvis-cmd-chip flex items-center gap-1"><Download size={10} />JSON</button>
                <button onClick={copyAll} className="jarvis-cmd-chip flex items-center gap-1">{copiedAll ? <span style={{ color: '#10b981' }}>{translations.copied}</span> : (<><Copy size={10} />{translations.copyAll}</>)}</button>
              </div>
            </div>
            {slides.map((slide, i) => renderSlideCard(slide, i))}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => goToSlide(currentSlide - 1)} disabled={currentSlide === 0} className="p-1.5 rounded-lg transition-all"
                style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.1)', opacity: currentSlide > 0 ? 1 : 0.3, cursor: currentSlide > 0 ? 'pointer' : 'not-allowed' }}>
                <ChevronLeft size={14} style={{ color: '#f59e0b' }} />
              </button>
              <span className="text-[10px] font-mono" style={{ color: '#f59e0b' }}>{formatSlideNumber(currentSlide + 1, slides.length)}</span>
              <button onClick={() => goToSlide(currentSlide + 1)} disabled={currentSlide === slides.length - 1} className="p-1.5 rounded-lg transition-all"
                style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.1)', opacity: currentSlide < slides.length - 1 ? 1 : 0.3, cursor: currentSlide < slides.length - 1 ? 'pointer' : 'not-allowed' }}>
                <ChevronRight size={14} style={{ color: '#f59e0b' }} />
              </button>
            </div>
          </div>
        )}

        {slides.length === 0 && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 jarvis-animate-fade-in">
            <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <Presentation size={22} style={{ color: '#90a8cc' }} />
            </div>
            <p className="text-[11px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>{translations.noPresentationsYet}</p>
            <p className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.25)' }}>{translations.noPresentationsSub}</p>
          </div>
        )}
      </div>

      {isPreviewMode && renderPreview()}
    </div>
  );
}
