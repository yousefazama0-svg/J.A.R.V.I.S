'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  Download,
  Copy,
  Trash2,
  Loader2,
  Wand2,
  Maximize2,
  X,
  RotateCcw,
  Wand,
  ImagePlus,
  FileImage,
  Palette,
  Layers,
  Sun,
  Contrast,
  Droplets,
  Focus,
} from 'lucide-react';

interface GeneratedImage {
  id: number;
  prompt: string;
  image: string;
  size: string;
  style: string;
  timestamp: string;
  isEnhanced?: boolean;
}

type ImageSize =
  | '1024x1024'
  | '1344x768'
  | '768x1344'
  | '1152x864'
  | '864x1152'
  | '1440x720'
  | '720x1440'
  | '1920x1080'
  | '1080x1920'
  | '1536x1024'
  | '1024x1536'
  | '1792x1024'
  | '1024x1792';

type ImageStyle =
  | 'Realistic'
  | 'Artistic'
  | 'Cinematic'
  | 'Anime'
  | '3D Render'
  | 'Watercolor'
  | 'Oil Painting'
  | 'Digital Art'
  | 'Sketch'
  | 'Pixel Art'
  | 'Photorealistic'
  | 'Fantasy'
  | 'Sci-Fi'
  | 'Horror'
  | 'Romance'
  | 'Noir'
  | 'Vintage'
  | 'Modern'
  | 'Abstract'
  | 'Surrealism'
  | 'Impressionism'
  | 'Pop Art'
  | 'Minimalist'
  | 'Gothic'
  | 'Steampunk'
  | 'Cyberpunk'
  | 'Retro'
  | 'Neon'
  | 'Pastel'
  | 'Monochrome'
  | 'HDR'
  | 'Panorama';

type ImageMode = 'generate' | 'enhance';

const SIZE_OPTIONS: { value: ImageSize; label: string; icon: string }[] = [
  { value: '1024x1024', label: '1:1 Square', icon: '◻' },
  { value: '1344x768', label: '16:9 Wide', icon: '▭' },
  { value: '768x1344', label: '9:16 Tall', icon: '▭' },
  { value: '1152x864', label: '4:3 Standard', icon: '▰' },
  { value: '864x1152', label: '3:4 Portrait', icon: '▰' },
  { value: '1440x720', label: '2:1 Ultra Wide', icon: '▬' },
  { value: '720x1440', label: '1:2 Ultra Tall', icon: '▬' },
  { value: '1920x1080', label: 'Full HD 16:9', icon: '🖥' },
  { value: '1080x1920', label: 'HD Portrait', icon: '📱' },
  { value: '1536x1024', label: '3:2 Classic', icon: '▮' },
  { value: '1024x1536', label: '2:3 Classic', icon: '▮' },
  { value: '1792x1024', label: '7:4 Cinematic', icon: '🎬' },
  { value: '1024x1792', label: '4:7 Poster', icon: '🖼' },
];

const STYLE_CATEGORIES = {
  'Photography': ['Realistic', 'Photorealistic', 'HDR', 'Panorama', 'Cinematic', 'Noir', 'Vintage', 'Modern'],
  'Art Styles': ['Artistic', 'Watercolor', 'Oil Painting', 'Impressionism', 'Surrealism', 'Abstract', 'Pop Art', 'Minimalist'],
  'Digital': ['Digital Art', 'Anime', '3D Render', 'Pixel Art', 'Cyberpunk', 'Steampunk', 'Neon', 'Retro'],
  'Themes': ['Fantasy', 'Sci-Fi', 'Horror', 'Romance', 'Gothic', 'Pastel', 'Monochrome'],
  'Other': ['Sketch', 'Portrait', 'Landscape', 'Macro'],
};

const ALL_STYLES: ImageStyle[] = Object.values(STYLE_CATEGORIES).flat() as ImageStyle[];

// Enhancement options
interface EnhancementOptions {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  denoise: number;
}

interface PhotoViewProps {
  initialPrompt?: string;
  translations: {
    photoStudio: string;
    aiImageGeneration: string;
    live: string;
    prompt: string;
    size: string;
    style: string;
    generate: string;
    generating: string;
    recentPrompts: string;
    generated: string;
    noImagesYet: string;
    noImagesSub: string;
    generateMode: string;
    enhanceMode: string;
    enhanceImage: string;
    enhanceImageSub: string;
    uploadImage: string;
    selectImageToEnhance: string;
    quality: string;
    sharpness: string;
    denoise: string;
    colorCorrection: string;
    upscaling: string;
    low: string;
    medium: string;
    high: string;
    ultra: string;
    enhance: string;
    enhancing: string;
    downloadAll: string;
    png: string;
    jpg: string;
    webp: string;
  };
  language: 'en' | 'ar';
}

export default function PhotoView({ initialPrompt, translations, language }: PhotoViewProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState<ImageSize>('1024x1024');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('Realistic');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof STYLE_CATEGORIES>('Photography');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GeneratedImage | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>('generate');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhanceQuality, setEnhanceQuality] = useState<'medium' | 'high' | 'ultra'>('high');
  const [showDownloadDropdown, setShowDownloadDropdown] = useState<number | null>(null);
  const [enhancementOptions, setEnhancementOptions] = useState<EnhancementOptions>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 100,
    denoise: 0,
  });
  const [showAdvancedEnhance, setShowAdvancedEnhance] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images from localStorage
  useEffect(() => {
    try {
      const gallery = JSON.parse(localStorage.getItem('jarvis-gallery') || '[]');
      const imageItems = gallery
        .filter((item: { type: string }) => item.type === 'image')
        .map((item: { id: string; prompt: string; image: string; size: string; style: string; timestamp: number; isEnhanced?: boolean }) => ({
          id: parseInt(item.id, 10) || Date.now(),
          prompt: item.prompt || '',
          image: item.image || '',
          size: item.size || '1024x1024',
          style: item.style || 'Realistic',
          timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEnhanced: item.isEnhanced || false,
        }))
        .reverse();
      setImages(imageItems);
    } catch { /* ignore */ }
  }, []);

  // Handle initial prompt from chat
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [initialPrompt]);

  // Auto-resize textarea
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
    }
  };

  const generateImage = useCallback(async (genPrompt?: string) => {
    const finalPrompt = genPrompt || prompt.trim();
    if (!finalPrompt || isGenerating) return;

    setIsGenerating(true);

    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, size: selectedSize, style: selectedStyle }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      if (data.image) {
        const newImage: GeneratedImage = {
          id: Date.now(),
          prompt: data.prompt || finalPrompt,
          image: data.image,
          size: selectedSize,
          style: selectedStyle,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setImages(prev => [newImage, ...prev]);

        // Save to gallery localStorage
        try {
          const gallery = JSON.parse(localStorage.getItem('jarvis-gallery') || '[]');
          gallery.unshift({
            type: 'image',
            id: String(newImage.id),
            prompt: newImage.prompt,
            image: newImage.image,
            size: newImage.size,
            style: newImage.style,
            timestamp: Date.now(),
          });
          localStorage.setItem('jarvis-gallery', JSON.stringify(gallery));
        } catch { /* ignore */ }

        // Update recent prompts
        setRecentPrompts(prev => {
          const filtered = prev.filter(p => p !== finalPrompt);
          return [finalPrompt, ...filtered].slice(0, 5);
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Generation failed';
      console.error('Image generation error:', errorMsg);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedSize, selectedStyle, isGenerating]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // Remove the data:image/xxx;base64, prefix
      const base64Data = base64.split(',')[1];
      setUploadedImage(base64Data);
    };
    reader.readAsDataURL(file);
  }, []);

  const enhanceImage = useCallback(async () => {
    if (!uploadedImage || isGenerating) return;

    setIsGenerating(true);

    try {
      const res = await fetch('/api/image/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          quality: enhanceQuality,
          options: enhancementOptions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Enhancement failed');
      }

      if (data.image) {
        const newImage: GeneratedImage = {
          id: Date.now(),
          prompt: 'Enhanced Image',
          image: data.image,
          size: data.size || '1024x1024',
          style: 'Enhanced',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEnhanced: true,
        };
        setImages(prev => [newImage, ...prev]);

        try {
          const gallery = JSON.parse(localStorage.getItem('jarvis-gallery') || '[]');
          gallery.unshift({
            type: 'image',
            id: String(newImage.id),
            prompt: newImage.prompt,
            image: newImage.image,
            size: newImage.size,
            style: newImage.style,
            timestamp: Date.now(),
            isEnhanced: true,
          });
          localStorage.setItem('jarvis-gallery', JSON.stringify(gallery));
        } catch { /* ignore */ }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Enhancement failed';
      console.error('Image enhancement error:', errorMsg);
    } finally {
      setIsGenerating(false);
      setUploadedImage(null);
    }
  }, [uploadedImage, enhanceQuality, enhancementOptions, isGenerating]);

  const downloadImage = useCallback((image: GeneratedImage, format: 'png' | 'jpg' | 'webp' = 'png') => {
    try {
      // Get raw base64 data (remove prefix if exists)
      let base64Data = image.image;
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }
      
      // Create blob from base64
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      let mimeType = 'image/png';
      let extension = 'png';

      if (format === 'jpg') {
        mimeType = 'image/jpeg';
        extension = 'jpg';
      } else if (format === 'webp') {
        mimeType = 'image/webp';
        extension = 'webp';
      }

      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jarvis-image-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShowDownloadDropdown(null);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: try direct download using data URL
      try {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${image.image}`;
        link.download = `jarvis-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowDownloadDropdown(null);
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
      }
    }
  }, []);

  const copyPrompt = useCallback((text: string, id: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPrompt(id);
      setTimeout(() => setCopiedPrompt(null), 2000);
    });
  }, []);

  const deleteImage = useCallback((id: number) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (lightboxImage?.id === id) setLightboxImage(null);

    // Also remove from localStorage gallery
    try {
      const gallery = JSON.parse(localStorage.getItem('jarvis-gallery') || '[]');
      const filtered = gallery.filter((item: { type: string; id: string }) =>
        !(item.type === 'image' && String(item.id) === String(id))
      );
      localStorage.setItem('jarvis-gallery', JSON.stringify(filtered));
    } catch { /* ignore */ }
  }, [lightboxImage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

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
              background: 'linear-gradient(135deg, #00e5ff20, #00e5ff10)',
              border: '1px solid #00e5ff30',
            }}
          >
            <Camera size={14} style={{ color: '#00e5ff' }} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>
              {translations.photoStudio}
            </span>
            <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.aiImageGeneration}
            </p>
          </div>
        </div>
        <div className="jarvis-live">
          <div className="jarvis-live-dot" />
          <span>{translations.live}</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 px-4 pt-3">
        <button
          onClick={() => setImageMode('generate')}
          className="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: imageMode === 'generate' ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 229, 255, 0.04)',
            border: `1px solid ${imageMode === 'generate' ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 229, 255, 0.1)'}`,
            color: imageMode === 'generate' ? '#00e5ff' : '#90a8cc',
          }}
        >
          <Wand2 size={12} />
          {translations.generateMode}
        </button>
        <button
          onClick={() => setImageMode('enhance')}
          className="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: imageMode === 'enhance' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.04)',
            border: `1px solid ${imageMode === 'enhance' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.1)'}`,
            color: imageMode === 'enhance' ? '#a855f7' : '#90a8cc',
          }}
        >
          <Wand size={12} />
          {translations.enhanceMode}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ paddingBottom: '20px' }}>
        {/* Generate Mode */}
        {imageMode === 'generate' && (
          <div className="jarvis-hud-card p-4">
            {/* Section label */}
            <div className="flex items-center gap-2 mb-3">
              <Wand2 size={11} style={{ color: '#00e5ff' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.prompt}
              </span>
            </div>

            {/* Prompt textarea */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
              placeholder={language === 'ar' ? 'صف الصورة التي تريد إنشاءها...' : 'Describe the image you want to generate...'}
              rows={3}
              className="w-full bg-transparent text-[12px] outline-none placeholder-[#90a8cc]/30 resize-none leading-relaxed mb-3"
              style={{ color: '#d0e4f8', fontFamily: 'inherit', maxHeight: '140px', direction: language === 'ar' ? 'rtl' : 'ltr' }}
            />

            {/* Size selector */}
            <div className="flex items-start gap-2 mb-3">
              <span className="text-[9px] tracking-[0.12em] uppercase shrink-0 pt-1" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.size}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SIZE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedSize(opt.value)}
                    className="px-2 py-1 rounded-md text-[9px] transition-all active:scale-95"
                    style={{
                      background:
                        selectedSize === opt.value
                          ? 'rgba(0, 229, 255, 0.12)'
                          : 'rgba(0, 229, 255, 0.04)',
                      border: `1px solid ${
                        selectedSize === opt.value
                          ? 'rgba(0, 229, 255, 0.3)'
                          : 'rgba(0, 229, 255, 0.08)'
                      }`,
                      color: selectedSize === opt.value ? '#00e5ff' : '#90a8cc',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Categories */}
            <div className="mb-3">
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
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Layers size={10} style={{ color: '#00e5ff' }} />
                <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.style}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_CATEGORIES[selectedCategory].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStyle(s as ImageStyle)}
                    className="px-2 py-1 rounded-md text-[9px] transition-all active:scale-95"
                    style={{
                      background: selectedStyle === s ? 'rgba(0, 229, 255, 0.12)' : 'rgba(0, 229, 255, 0.04)',
                      border: `1px solid ${selectedStyle === s ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 229, 255, 0.08)'}`,
                      color: selectedStyle === s ? '#00e5ff' : '#90a8cc',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={() => generateImage()}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 active:scale-95"
              style={{
                background: prompt.trim() && !isGenerating
                  ? 'linear-gradient(135deg, #00e5ff, #7c5cff)'
                  : 'rgba(0, 229, 255, 0.06)',
                border: `1px solid ${
                  prompt.trim() && !isGenerating
                    ? 'rgba(0, 229, 255, 0.4)'
                    : 'rgba(0, 229, 255, 0.08)'
                }`,
                color: prompt.trim() && !isGenerating ? '#060a14' : '#90a8cc',
                opacity: prompt.trim() && !isGenerating ? 1 : 0.5,
                cursor: prompt.trim() && !isGenerating ? 'pointer' : 'not-allowed',
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  {translations.generating}
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  {translations.generate}
                </>
              )}
            </button>
          </div>
        )}

        {/* Enhance Mode */}
        {imageMode === 'enhance' && (
          <div className="jarvis-hud-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wand size={11} style={{ color: '#a855f7' }} />
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.enhanceImage}
              </span>
            </div>

            <p className="text-[10px] mb-3" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {translations.enhanceImageSub}
            </p>

            {/* Upload Area */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {uploadedImage ? (
              <div className="relative mb-3">
                <img
                  src={`data:image/png;base64,${uploadedImage}`}
                  alt="Uploaded"
                  className="w-full max-h-[200px] object-contain rounded-lg"
                  style={{ border: '1px solid #0e1a3a' }}
                />
                <button
                  onClick={() => setUploadedImage(null)}
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
                <ImagePlus size={24} style={{ color: '#a855f7' }} />
                <span className="text-[10px]" style={{ color: '#90a8cc' }}>{translations.uploadImage}</span>
              </button>
            )}

            {/* Quality and Enhancement options */}
            {uploadedImage && (
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

                {/* Advanced Enhancement Toggle */}
                <button
                  onClick={() => setShowAdvancedEnhance(!showAdvancedEnhance)}
                  className="flex items-center gap-2 mb-3 text-[9px] transition-all"
                  style={{ color: '#90a8cc' }}
                >
                  <Sun size={10} />
                  {language === 'ar' ? 'خيارات متقدمة' : 'Advanced Options'}
                  <span style={{ transform: showAdvancedEnhance ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </button>

                {/* Advanced Enhancement Sliders */}
                {showAdvancedEnhance && (
                  <div className="grid grid-cols-2 gap-3 mb-3 p-3 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                    {/* Brightness */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                          <Sun size={8} className="inline mr-1" />
                          {language === 'ar' ? 'السطوع' : 'Brightness'}
                        </span>
                        <span className="text-[8px] font-mono" style={{ color: '#f59e0b' }}>{enhancementOptions.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={enhancementOptions.brightness}
                        onChange={(e) => setEnhancementOptions(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{ background: '#0e1a3a' }}
                      />
                    </div>

                    {/* Contrast */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                          <Contrast size={8} className="inline mr-1" />
                          {language === 'ar' ? 'التباين' : 'Contrast'}
                        </span>
                        <span className="text-[8px] font-mono" style={{ color: '#10b981' }}>{enhancementOptions.contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={enhancementOptions.contrast}
                        onChange={(e) => setEnhancementOptions(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{ background: '#0e1a3a' }}
                      />
                    </div>

                    {/* Saturation */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                          <Droplets size={8} className="inline mr-1" />
                          {language === 'ar' ? 'التشبع' : 'Saturation'}
                        </span>
                        <span className="text-[8px] font-mono" style={{ color: '#ec4899' }}>{enhancementOptions.saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={enhancementOptions.saturation}
                        onChange={(e) => setEnhancementOptions(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{ background: '#0e1a3a' }}
                      />
                    </div>

                    {/* Sharpness */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                          <Focus size={8} className="inline mr-1" />
                          {language === 'ar' ? 'الحدة' : 'Sharpness'}
                        </span>
                        <span className="text-[8px] font-mono" style={{ color: '#00e5ff' }}>{enhancementOptions.sharpness}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={enhancementOptions.sharpness}
                        onChange={(e) => setEnhancementOptions(prev => ({ ...prev, sharpness: parseInt(e.target.value) }))}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{ background: '#0e1a3a' }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={enhanceImage}
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
                      <Wand size={13} />
                      {translations.enhance}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Loading shimmer */}
        {isGenerating && imageMode === 'generate' && (
          <div className="jarvis-hud-card p-0 overflow-hidden jarvis-animate-fade-in">
            <div
              className="w-full aspect-square max-h-[300px] flex items-center justify-center"
              style={{ background: '#060a14' }}
            >
              <div className="text-center">
                <Loader2 size={24} className="animate-spin mx-auto mb-2" style={{ color: '#00e5ff' }} />
                <p className="text-[10px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {language === 'ar' ? 'جارٍ إنشاء صورتك...' : 'Creating your image...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent prompts */}
        {recentPrompts.length > 0 && !isGenerating && imageMode === 'generate' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw size={9} style={{ color: 'rgba(144, 168, 204, 0.4)' }} />
              <span className="text-[8px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
                {translations.recentPrompts}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(p);
                    textareaRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-md text-[10px] truncate max-w-[200px] transition-all active:scale-95"
                  style={{
                    background: 'rgba(0, 229, 255, 0.04)',
                    border: '1px solid rgba(0, 229, 255, 0.08)',
                    color: '#90a8cc',
                  }}
                  title={p}
                >
                  {p.length > 30 ? p.slice(0, 30) + '...' : p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results grid */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#00e5ff', boxShadow: '0 0 4px rgba(0, 229, 255, 0.4)' }}
                />
                <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.generated} ({images.length})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {images.map(img => {
                // Handle both cases: with or without data URL prefix
                const imageSrc = img.image.includes('data:image') 
                  ? img.image 
                  : `data:image/png;base64,${img.image}`;
                
                return (
                  <div
                    key={img.id}
                    className="jarvis-mod-card p-0 overflow-hidden group jarvis-animate-fade-in"
                  >
                  {/* Image */}
                  <div
                    className="relative aspect-square cursor-pointer overflow-hidden"
                    onClick={() => setLightboxImage(img)}
                  >
                    <img
                      src={imageSrc}
                      alt={img.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Image load error');
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%230e1a3a" width="100" height="100"/><text fill="%2390a8cc" x="50" y="50" text-anchor="middle" dy=".3em" font-size="10">Error</text></svg>';
                      }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ background: 'rgba(6, 10, 20, 0.6)' }}
                    >
                      <Maximize2 size={20} style={{ color: '#00e5ff' }} />
                    </div>
                    {/* Size badge */}
                    <div
                      className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px]"
                      style={{
                        background: 'rgba(6, 10, 20, 0.8)',
                        border: '1px solid rgba(0, 229, 255, 0.15)',
                        color: '#00e5ff',
                      }}
                    >
                      {img.size}
                    </div>
                    {/* Style badge */}
                    <div
                      className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px]"
                      style={{
                        background: img.isEnhanced ? 'rgba(168, 85, 247, 0.2)' : 'rgba(6, 10, 20, 0.8)',
                        border: `1px solid ${img.isEnhanced ? 'rgba(168, 85, 247, 0.3)' : 'rgba(0, 229, 255, 0.15)'}`,
                        color: img.isEnhanced ? '#a855f7' : '#90a8cc',
                      }}
                    >
                      {img.style}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p
                      className="text-[10px] mb-2 leading-relaxed truncate"
                      style={{ color: '#90a8cc' }}
                      title={img.prompt}
                    >
                      {img.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>
                        {img.timestamp}
                      </span>
                      <div className="flex items-center gap-1 relative">
                        <button
                          onClick={() => setShowDownloadDropdown(showDownloadDropdown === img.id ? null : img.id)}
                          className="p-1 rounded-md transition-colors hover:bg-[#0e1a3a] active:scale-95"
                          title={translations.downloadAll}
                        >
                          <Download size={11} style={{ color: '#00e5ff' }} />
                        </button>
                        {showDownloadDropdown === img.id && (
                          <div className="jarvis-dropdown">
                            <div className="jarvis-dropdown-item" onClick={() => downloadImage(img, 'png')}>
                              <FileImage size={10} /> {translations.png}
                            </div>
                            <div className="jarvis-dropdown-item" onClick={() => downloadImage(img, 'jpg')}>
                              <FileImage size={10} /> {translations.jpg}
                            </div>
                            <div className="jarvis-dropdown-item" onClick={() => downloadImage(img, 'webp')}>
                              <FileImage size={10} /> {translations.webp}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => copyPrompt(img.prompt, img.id)}
                          className="p-1 rounded-md transition-colors hover:bg-[#0e1a3a] active:scale-95"
                          title="Copy prompt"
                        >
                          {copiedPrompt === img.id ? (
                            <span className="text-[8px]" style={{ color: '#10b981' }}>✓</span>
                          ) : (
                            <Copy size={11} style={{ color: '#90a8cc' }} />
                          )}
                        </button>
                        <button
                          onClick={() => deleteImage(img.id)}
                          className="p-1 rounded-md transition-colors hover:bg-[#0e1a3a] active:scale-95"
                          title="Delete"
                        >
                          <Trash2 size={11} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {images.length === 0 && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 jarvis-animate-fade-in">
            <div
              className="w-14 h-14 flex items-center justify-center rounded-full"
              style={{
                background: 'rgba(0, 229, 255, 0.04)',
                border: '1px solid rgba(0, 229, 255, 0.08)',
              }}
            >
              <Camera size={22} style={{ color: '#90a8cc' }} />
            </div>
            <p className="text-[11px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>
              {translations.noImagesYet}
            </p>
            <p className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.25)' }}>
              {translations.noImagesSub}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(6, 10, 20, 0.95)', backdropFilter: 'blur(20px)' }}
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-lg"
            style={{ background: 'rgba(8, 14, 30, 0.8)', border: '1px solid #0e1a3a' }}
            onClick={() => setLightboxImage(null)}
          >
            <X size={16} style={{ color: '#90a8cc' }} />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            <img
              src={`data:image/png;base64,${lightboxImage.image}`}
              alt={lightboxImage.prompt}
              className="max-w-full max-h-[75vh] rounded-xl object-contain"
              style={{ border: '1px solid #0e1a3a' }}
            />
            <p className="text-[10px] text-center max-w-lg" style={{ color: '#90a8cc' }}>
              {lightboxImage.prompt}
            </p>
            <div className="flex items-center gap-2">
              {(['png', 'jpg', 'webp'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => downloadImage(lightboxImage, fmt)}
                  className="jarvis-chip active:scale-95"
                >
                  <Download size={12} style={{ color: '#00e5ff' }} />
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
