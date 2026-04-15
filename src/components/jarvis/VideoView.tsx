'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Video,
  Loader2,
  Download,
  Trash2,
  Film,
  Clapperboard,
  Clock,
  Sparkles,
  X,
  Play,
  Wand2,
  Upload,
  Gauge,
  Layers,
  Sun,
  Palette,
} from 'lucide-react';

interface VideoItem {
  id: string;
  prompt: string;
  videoUrl: string;
  duration: string;
  style: string;
  timestamp: number;
  isEnhanced?: boolean;
}

type Duration = '5s' | '10s' | '30s' | '60s' | '120s' | '300s' | '600s' | '900s';
type VideoQuality = 'speed' | 'balanced' | 'quality';
type FPS = '24' | '30' | '60';
type VideoMode = 'generate' | 'enhance';

const DURATION_OPTIONS: Duration[] = ['5s', '10s', '30s', '60s', '120s', '300s', '600s', '900s'];
const QUALITY_OPTIONS: VideoQuality[] = ['speed', 'balanced', 'quality'];
const FPS_OPTIONS: FPS[] = ['24', '30', '60'];

const DURATION_LABELS: Record<Duration, string> = {
  '5s': '5 sec',
  '10s': '10 sec',
  '30s': '30 sec',
  '60s': '1 min',
  '120s': '2 min',
  '300s': '5 min',
  '600s': '10 min',
  '900s': '15 min',
};

const QUALITY_LABELS: Record<VideoQuality, string> = {
  'speed': '⚡ Fast',
  'balanced': '⚖️ Balanced',
  'quality': '✨ High Quality',
};

// Extended style categories
const STYLE_CATEGORIES = {
  'Cinematic': ['Cinematic', 'Noir', 'Vintage', 'Documentary', 'Indie Film', 'Blockbuster', 'Art House'],
  'Animation': ['Animation', '3D Animation', 'Anime', 'Cartoon', 'Stop Motion', 'Claymation', 'Pixel Animation'],
  'Reality': ['Realistic', 'Nature', 'Urban', 'Lifestyle', 'Travel', 'Sports', 'Fitness'],
  'Creative': ['Abstract', 'Motion Graphics', 'Surreal', 'Experimental', 'Glitch Art', 'Vaporwave'],
  'Genre': ['Sci-Fi', 'Fantasy', 'Horror', 'Comedy', 'Action', 'Romance', 'Thriller'],
  'Special': ['Slow Motion', 'Timelapse', 'Music Video', 'Commercial', 'Social Media', 'TikTok Style'],
};

const ALL_STYLES = Object.values(STYLE_CATEGORIES).flat();

// Resolution presets
const RESOLUTION_OPTIONS = [
  { value: '720p', label: '720p HD' },
  { value: '1080p', label: '1080p Full HD' },
  { value: '4k', label: '4K Ultra HD' },
];

interface VideoViewProps {
  initialPrompt?: string;
  translations: {
    videoEngine: string;
    aiVideoGeneration: string;
    live: string;
    prompt: string;
    duration: string;
    style: string;
    generateVideo: string;
    generatingVideo: string;
    generated: string;
    noVideosYet: string;
    noVideosSub: string;
    generateMode: string;
    enhanceMode: string;
    enhanceVideo: string;
    enhanceVideoSub: string;
    uploadVideo: string;
    quality: string;
    low: string;
    medium: string;
    high: string;
    ultra: string;
    enhance: string;
    enhancing: string;
    downloadAll: string;
    mp4: string;
    webm: string;
    avi: string;
    mov: string;
    processing: string;
    mayTakeMinutes: string;
    fps: string;
    resolution: string;
    speed: string;
    stabilize: string;
    colorGrade: string;
  };
  language: 'en' | 'ar';
}

export default function VideoView({ initialPrompt, translations, language }: VideoViewProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<Duration>('10s');
  const [style, setStyle] = useState<string>('Cinematic');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof STYLE_CATEGORIES>('Cinematic');
  const [quality, setQuality] = useState<VideoQuality>('balanced');
  const [fps, setFps] = useState<FPS>('30');
  const [resolution, setResolution] = useState('1080p');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [videoMode, setVideoMode] = useState<VideoMode>('generate');
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [enhanceQuality, setEnhanceQuality] = useState<'medium' | 'high' | 'ultra'>('high');
  const [showDownloadDropdown, setShowDownloadDropdown] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle initial prompt from chat
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [initialPrompt]);

  // Load videos from localStorage
  useEffect(() => {
    try {
      const gallery = JSON.parse(localStorage.getItem('jarvis-gallery') || '[]');
      const videoItems = gallery
        .filter((item: { type: string }) => item.type === 'video')
        .map((item: { id: string; prompt: string; videoUrl: string; duration: string; style: string; timestamp: number; isEnhanced?: boolean }) => ({
          id: item.id,
          prompt: item.prompt || '',
          videoUrl: item.videoUrl || '',
          duration: item.duration || '10s',
          style: item.style || 'Cinematic',
          timestamp: item.timestamp || Date.now(),
          isEnhanced: item.isEnhanced || false,
        }))
        .reverse();
      setVideos(videoItems);
    } catch { /* ignore */ }
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Auto-resize textarea
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const saveToGallery = useCallback((item: VideoItem) => {
    try {
      const gallery = JSON.parse(localStorage.getItem('jarvis-gallery') || '[]');
      gallery.unshift({
        type: 'video',
        id: item.id,
        prompt: item.prompt,
        videoUrl: item.videoUrl,
        duration: item.duration,
        style: item.style,
        timestamp: item.timestamp,
        isEnhanced: item.isEnhanced,
      });
      localStorage.setItem('jarvis-gallery', JSON.stringify(gallery));
    } catch { /* ignore */ }
  }, []);

  const generateVideo = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);
    setProgress(0);
    setProgressLabel(translations.processing);
    setError(null);
    startTimeRef.current = Date.now();

    // Progress timer - faster for speed quality
    const durationInSeconds = parseInt(duration.replace('s', ''));
    const baseTime = quality === 'speed' ? 60000 : quality === 'quality' ? 400000 : 200000;
    const progressMultiplier = baseTime * (durationInSeconds / 10); // Scale with duration
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(95, Math.floor((elapsed / progressMultiplier) * 100));
      setProgress(pct);
      if (pct < 25) setProgressLabel(language === 'ar' ? 'جارٍ الإنشاء... 0%' : 'Generating... 0%');
      else if (pct < 50) setProgressLabel(language === 'ar' ? 'جارٍ الإنشاء... 25%' : 'Generating... 25%');
      else if (pct < 75) setProgressLabel(language === 'ar' ? 'جارٍ الإنشاء... 50%' : 'Generating... 50%');
      else if (pct < 90) setProgressLabel(language === 'ar' ? 'جارٍ الإنشاء... 75%' : 'Generating... 75%');
      else setProgressLabel(language === 'ar' ? 'جارٍ الإنشاء... 90%' : 'Generating... 90%');
    }, quality === 'speed' ? 500 : 2000);

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: trimmed, 
          duration: durationInSeconds, 
          style: style.toLowerCase(),
          quality,
          fps: parseInt(fps)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      const { taskId } = data;
      setProgressLabel(translations.processing);

      // Poll for status
      const poll = async () => {
        try {
          const statusRes = await fetch('/api/video/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId }),
          });

          const statusData = await statusRes.json();
          const { status, videoUrl } = statusData;

          if (status === 'completed' && videoUrl) {
            clearInterval(progressInterval);
            if (pollingRef.current) clearInterval(pollingRef.current);

            setProgress(100);
            setProgressLabel('Complete!');

            const newItem: VideoItem = {
              id: taskId,
              prompt: trimmed,
              videoUrl,
              duration,
              style,
              timestamp: Date.now(),
            };

            setVideos(prev => [newItem, ...prev]);
            saveToGallery(newItem);

            setTimeout(() => {
              setIsGenerating(false);
              setProgress(0);
              setProgressLabel('');
            }, 600);
          } else if (status === 'failed') {
            clearInterval(progressInterval);
            if (pollingRef.current) clearInterval(pollingRef.current);
            setError('Video generation failed. Please try again.');
            setIsGenerating(false);
            setProgress(0);
          }
        } catch {
          // Network error on poll, keep trying
        }
      };

      pollingRef.current = setInterval(poll, 3000);
      poll();
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg = err instanceof Error ? err.message : 'Generation failed';
      setError(msg);
      setIsGenerating(false);
      setProgress(0);
    }
  }, [prompt, duration, style, quality, fps, isGenerating, saveToGallery, translations.processing, language]);

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUploadedVideo(url);
  }, []);

  const enhanceVideo = useCallback(async () => {
    if (!uploadedVideo || isGenerating) return;

    setIsGenerating(true);
    setProgress(0);
    setProgressLabel(translations.enhancing);
    setError(null);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(95, prev + 5));
    }, 1000);

    try {
      const res = await fetch('/api/video/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: uploadedVideo,
          quality: enhanceQuality,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Enhancement failed');
      }

      if (data.videoUrl) {
        clearInterval(progressInterval);
        setProgress(100);
        setProgressLabel('Complete!');

        const newItem: VideoItem = {
          id: `enhance-${Date.now()}`,
          prompt: 'Enhanced Video',
          videoUrl: data.videoUrl,
          duration: data.duration || '10s',
          style: 'Enhanced',
          timestamp: Date.now(),
          isEnhanced: true,
        };

        setVideos(prev => [newItem, ...prev]);
        saveToGallery(newItem);

        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
          setProgressLabel('');
          setUploadedVideo(null);
        }, 600);
      }
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg = err instanceof Error ? err.message : 'Enhancement failed';
      setError(msg);
      setIsGenerating(false);
      setProgress(0);
    }
  }, [uploadedVideo, enhanceQuality, isGenerating, saveToGallery, translations.enhancing]);

  const deleteVideo = useCallback((id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    try {
      const gallery = JSON.parse(localStorage.getItem('jarvis-gallery') || '[]');
      const filtered = gallery.filter((item: { type: string; id: string }) =>
        !(item.type === 'video' && item.id === id)
      );
      localStorage.setItem('jarvis-gallery', JSON.stringify(filtered));
    } catch { /* ignore */ }
  }, []);

  const downloadVideo = useCallback((item: VideoItem, format: 'mp4' | 'webm' | 'avi' | 'mov' = 'mp4') => {
    try {
      const link = document.createElement('a');
      link.href = item.videoUrl;
      link.download = `jarvis-video-${item.id}.${format}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowDownloadDropdown(null);
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid #0e1a3a' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #7c5cff20, #7c5cff10)',
              border: '1px solid #7c5cff30',
            }}
          >
            <Video size={14} style={{ color: '#7c5cff' }} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>
              {translations.videoEngine}
            </span>
            <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.aiVideoGeneration}
            </p>
          </div>
        </div>
        <div className="jarvis-live">
          <div className="jarvis-live-dot" style={{ background: '#7c5cff', boxShadow: '0 0 8px rgba(124, 92, 255, 0.5)' }} />
          <span style={{ color: '#7c5cff' }}>{translations.live}</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 px-4 pt-3">
        <button
          onClick={() => setVideoMode('generate')}
          className="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: videoMode === 'generate' ? 'rgba(124, 92, 255, 0.15)' : 'rgba(124, 92, 255, 0.04)',
            border: `1px solid ${videoMode === 'generate' ? 'rgba(124, 92, 255, 0.3)' : 'rgba(124, 92, 255, 0.1)'}`,
            color: videoMode === 'generate' ? '#7c5cff' : '#90a8cc',
          }}
        >
          <Film size={12} />
          {translations.generateMode}
        </button>
        <button
          onClick={() => setVideoMode('enhance')}
          className="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: videoMode === 'enhance' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.04)',
            border: `1px solid ${videoMode === 'enhance' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.1)'}`,
            color: videoMode === 'enhance' ? '#a855f7' : '#90a8cc',
          }}
        >
          <Wand2 size={12} />
          {translations.enhanceMode}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ paddingBottom: '20px' }}>
        {/* Generate Mode */}
        {videoMode === 'generate' && (
          <div className="jarvis-hud-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clapperboard size={11} style={{ color: '#7c5cff' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.prompt}
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handlePromptChange}
              placeholder={language === 'ar' ? 'صف مشهد الفيديو الذي تريد إنشاءه...' : 'Describe the video scene you want to create...'}
              rows={3}
              className="w-full bg-transparent text-[12px] outline-none placeholder-[#90a8cc]/30 resize-none leading-relaxed mb-3"
              style={{ color: '#d0e4f8', fontFamily: 'inherit', maxHeight: '120px', direction: language === 'ar' ? 'rtl' : 'ltr' }}
            />

            {/* Duration selector */}
            <div className="flex items-start gap-2 mb-2.5">
              <Clock size={10} style={{ color: 'rgba(144, 168, 204, 0.5)', marginTop: '4px' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase shrink-0 pt-1" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.duration}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DURATION_OPTIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className="px-2 py-1 rounded-md text-[9px] transition-all"
                    style={{
                      background: duration === d ? 'rgba(124, 92, 255, 0.15)' : 'rgba(124, 92, 255, 0.04)',
                      border: `1px solid ${duration === d ? 'rgba(124, 92, 255, 0.35)' : 'rgba(124, 92, 255, 0.1)'}`,
                      color: duration === d ? '#7c5cff' : '#90a8cc',
                    }}
                  >
                    {DURATION_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality selector */}
            <div className="flex items-start gap-2 mb-2.5">
              <Gauge size={10} style={{ color: 'rgba(144, 168, 204, 0.5)', marginTop: '4px' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase shrink-0 pt-1" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {language === 'ar' ? 'الجودة' : 'Quality'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUALITY_OPTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className="px-2 py-1 rounded-md text-[9px] transition-all"
                    style={{
                      background: quality === q ? 'rgba(124, 92, 255, 0.15)' : 'rgba(124, 92, 255, 0.04)',
                      border: `1px solid ${quality === q ? 'rgba(124, 92, 255, 0.35)' : 'rgba(124, 92, 255, 0.1)'}`,
                      color: quality === q ? '#7c5cff' : '#90a8cc',
                    }}
                  >
                    {QUALITY_LABELS[q]}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Categories */}
            <div className="mb-2.5">
              <div className="flex items-center gap-2 mb-2">
                <Palette size={10} style={{ color: '#a855f7' }} />
                <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {language === 'ar' ? 'الفئات' : 'Categories'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(STYLE_CATEGORIES) as Array<keyof typeof STYLE_CATEGORIES>).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-2 py-1 rounded-md text-[9px] transition-all"
                    style={{
                      background: selectedCategory === cat ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.04)',
                      border: `1px solid ${selectedCategory === cat ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.1)'}`,
                      color: selectedCategory === cat ? '#a855f7' : '#90a8cc',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Style selector */}
            <div className="flex items-start gap-2 mb-3">
              <Film size={10} style={{ color: 'rgba(144, 168, 204, 0.5)', marginTop: '4px' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase shrink-0 pt-1" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.style}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_CATEGORIES[selectedCategory].map(s => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className="px-2 py-1 rounded-md text-[9px] transition-all"
                    style={{
                      background: style === s ? 'rgba(124, 92, 255, 0.15)' : 'rgba(124, 92, 255, 0.04)',
                      border: `1px solid ${style === s ? 'rgba(124, 92, 255, 0.35)' : 'rgba(124, 92, 255, 0.1)'}`,
                      color: style === s ? '#7c5cff' : '#90a8cc',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center gap-2 mb-3 text-[9px] transition-all"
              style={{ color: '#90a8cc' }}
            >
              <Layers size={10} />
              {language === 'ar' ? 'خيارات متقدمة' : 'Advanced Options'}
              <span style={{ transform: showAdvancedOptions ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {/* Advanced Options */}
            {showAdvancedOptions && (
              <div className="grid grid-cols-2 gap-3 mb-3 p-3 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                {/* FPS */}
                <div>
                  <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                    {translations.fps}
                  </span>
                  <div className="flex gap-1.5">
                    {FPS_OPTIONS.map(f => (
                      <button
                        key={f}
                        onClick={() => setFps(f as FPS)}
                        className="px-2 py-1 rounded-md text-[9px] transition-all"
                        style={{
                          background: fps === f ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 229, 255, 0.04)',
                          border: `1px solid ${fps === f ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 229, 255, 0.1)'}`,
                          color: fps === f ? '#00e5ff' : '#90a8cc',
                        }}
                      >
                        {f} FPS
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                    {translations.resolution}
                  </span>
                  <div className="flex gap-1.5">
                    {RESOLUTION_OPTIONS.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setResolution(r.value)}
                        className="px-2 py-1 rounded-md text-[9px] transition-all"
                        style={{
                          background: resolution === r.value ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.04)',
                          border: `1px solid ${resolution === r.value ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.1)'}`,
                          color: resolution === r.value ? '#10b981' : '#90a8cc',
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={generateVideo}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              style={{
                background: prompt.trim() && !isGenerating
                  ? 'linear-gradient(135deg, #7c5cff, #a855f7)'
                  : 'rgba(124, 92, 255, 0.06)',
                border: `1px solid ${
                  prompt.trim() && !isGenerating
                    ? 'rgba(124, 92, 255, 0.5)'
                    : 'rgba(124, 92, 255, 0.1)'
                }`,
                color: prompt.trim() && !isGenerating ? '#ffffff' : '#90a8cc',
                opacity: prompt.trim() && !isGenerating ? 1 : 0.5,
                cursor: prompt.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                boxShadow: prompt.trim() && !isGenerating
                  ? '0 0 20px rgba(124, 92, 255, 0.3)'
                  : 'none',
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  {translations.generatingVideo}
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  {translations.generateVideo}
                </>
              )}
            </button>
          </div>
        )}

        {/* Enhance Mode */}
        {videoMode === 'enhance' && (
          <div className="jarvis-hud-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 size={11} style={{ color: '#a855f7' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.enhanceVideo}
              </span>
            </div>

            <p className="text-[10px] mb-3" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.enhanceVideoSub}
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />

            {uploadedVideo ? (
              <div className="relative mb-3">
                <video
                  src={uploadedVideo}
                  controls
                  className="w-full max-h-[200px] rounded-lg"
                  style={{ border: '1px solid #0e1a3a' }}
                />
                <button
                  onClick={() => setUploadedVideo(null)}
                  className="absolute top-2 right-2 p-1 rounded-lg"
                  style={{ background: 'rgba(8, 14, 30, 0.9)', border: '1px solid #0e1a3a' }}
                >
                  <X size={12} style={{ color: '#90a8cc' }} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all"
                style={{ borderColor: 'rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.02)' }}
              >
                <Upload size={24} style={{ color: '#a855f7' }} />
                <span className="text-[10px]" style={{ color: '#90a8cc' }}>{translations.uploadVideo}</span>
              </button>
            )}

            {uploadedVideo && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                    {translations.quality}
                  </span>
                  <div className="flex gap-1.5">
                    {(['medium', 'high', 'ultra'] as const).map(q => (
                      <button
                        key={q}
                        onClick={() => setEnhanceQuality(q)}
                        className="px-3 py-1 rounded-md text-[9px] transition-all"
                        style={{
                          background: enhanceQuality === q ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.04)',
                          border: `1px solid ${enhanceQuality === q ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.1)'}`,
                          color: enhanceQuality === q ? '#a855f7' : '#90a8cc',
                        }}
                      >
                        {q === 'medium' ? translations.medium : q === 'high' ? translations.high : translations.ultra}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={enhanceVideo}
                  disabled={isGenerating}
                  className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                  style={{
                    background: isGenerating ? 'rgba(168, 85, 247, 0.1)' : 'linear-gradient(135deg, #a855f7, #7c5cff)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#ffffff',
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      {translations.enhancing}
                    </>
                  ) : (
                    <>
                      <Wand2 size={13} />
                      {translations.enhance}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="jarvis-hud-card p-3 flex items-center gap-2"
            style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <X size={12} style={{ color: '#ef4444' }} />
            <span className="text-[10px]" style={{ color: '#ef4444' }}>{error}</span>
          </div>
        )}

        {/* Loading shimmer / progress */}
        {isGenerating && (
          <div className="jarvis-hud-card p-4 jarvis-animate-fade-in">
            <div className="flex flex-col items-center gap-3">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-wider uppercase" style={{ color: '#7c5cff' }}>
                    {progressLabel}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: '#7c5cff' }}>
                    {progress}%
                  </span>
                </div>
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(124, 92, 255, 0.1)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #7c5cff, #a855f7)',
                      boxShadow: '0 0 8px rgba(124, 92, 255, 0.5)',
                    }}
                  />
                </div>
              </div>
              <div
                className="w-full aspect-video rounded-lg jarvis-shimmer"
                style={{ background: '#060a14', border: '1px solid #0e1a3a', maxHeight: '200px' }}
              />
              <p className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                {translations.mayTakeMinutes}
              </p>
            </div>
          </div>
        )}

        {/* Video history */}
        {videos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#7c5cff', boxShadow: '0 0 4px rgba(124, 92, 255, 0.4)' }}
              />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.generated} ({videos.length})
              </span>
            </div>

            <div className="space-y-3">
              {videos.map(video => (
                <div
                  key={video.id}
                  className="jarvis-hud-card p-0 overflow-hidden jarvis-animate-fade-in"
                >
                  <div
                    className="relative rounded-t-2xl overflow-hidden"
                    style={{
                      border: '1px solid #0e1a3a',
                      boxShadow: '0 0 20px rgba(124, 92, 255, 0.08)',
                    }}
                  >
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full aspect-video"
                      style={{ background: '#060a14' }}
                    />
                  </div>

                  <div className="p-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[10px] leading-relaxed truncate"
                        style={{ color: '#90a8cc' }}
                        title={video.prompt}
                      >
                        {video.prompt}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(124, 92, 255, 0.1)', color: '#7c5cff' }}>
                          {video.style}
                        </span>
                        <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>
                          {DURATION_LABELS[video.duration as Duration] || video.duration}
                        </span>
                        <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>
                          {new Date(video.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 relative">
                      <button
                        onClick={() => setShowDownloadDropdown(showDownloadDropdown === video.id ? null : video.id)}
                        className="p-1.5 rounded-md transition-colors hover:bg-[#0e1a3a]"
                        title={translations.downloadAll}
                      >
                        <Download size={12} style={{ color: '#7c5cff' }} />
                      </button>
                      {showDownloadDropdown === video.id && (
                        <div className="jarvis-dropdown">
                          <div className="jarvis-dropdown-item" onClick={() => downloadVideo(video, 'mp4')}>
                            {translations.mp4}
                          </div>
                          <div className="jarvis-dropdown-item" onClick={() => downloadVideo(video, 'webm')}>
                            {translations.webm}
                          </div>
                          <div className="jarvis-dropdown-item" onClick={() => downloadVideo(video, 'mov')}>
                            {translations.mov}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="p-1.5 rounded-md transition-colors hover:bg-[#0e1a3a]"
                        title="Delete"
                      >
                        <Trash2 size={12} style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {videos.length === 0 && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 jarvis-animate-fade-in">
            <div
              className="w-14 h-14 flex items-center justify-center rounded-full"
              style={{
                background: 'rgba(124, 92, 255, 0.06)',
                border: '1px solid rgba(124, 92, 255, 0.1)',
              }}
            >
              <Video size={22} style={{ color: '#90a8cc' }} />
            </div>
            <p className="text-[11px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.noVideosYet}
            </p>
            <p className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.25)' }}>
              {translations.noVideosSub}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
