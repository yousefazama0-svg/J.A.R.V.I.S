'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Eye,
  Upload,
  Image,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Trash2,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileImage,
} from 'lucide-react';

interface AnalysisResult {
  description: string;
  objects: string[];
  colors: string[];
  mood: string;
  suggestions: string[];
}

interface ImageAnalyzerViewProps {
  translations: {
    title: string;
    subtitle: string;
    uploadImage: string;
    orPasteUrl: string;
    analyze: string;
    analyzing: string;
    analysis: string;
    description: string;
    objects: string;
    colors: string;
    mood: string;
    suggestions: string;
    copy: string;
    clear: string;
    download: string;
    dragDrop: string;
  };
  language: 'en' | 'ar';
}

export default function ImageAnalyzerView({ translations, language }: ImageAnalyzerViewProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadedImage(base64);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const analyzeImage = useCallback(async () => {
    const imageToAnalyze = uploadedImage || imageUrl;
    if (!imageToAnalyze || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      // First, get image description using VLM
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analyze this image and provide a detailed JSON response with the following structure:
{
  "description": "Detailed description of the image",
  "objects": ["list", "of", "detected", "objects"],
  "colors": ["dominant", "colors"],
  "mood": "Overall mood/atmosphere",
  "suggestions": ["improvement", "suggestions"]
}

Image: ${imageToAnalyze.slice(0, 100)}...

Provide only valid JSON, no additional text.`
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

      // Try to parse JSON from result
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setAnalysis({
            description: parsed.description || result,
            objects: parsed.objects || [],
            colors: parsed.colors || [],
            mood: parsed.mood || '',
            suggestions: parsed.suggestions || [],
          });
        } else {
          setAnalysis({
            description: result,
            objects: [],
            colors: [],
            mood: '',
            suggestions: [],
          });
        }
      } catch {
        setAnalysis({
          description: result,
          objects: [],
          colors: [],
          mood: '',
          suggestions: [],
        });
      }

    } catch (error) {
      console.error('Image analysis error:', error);
      setAnalysis({
        description: language === 'ar' ? 'حدث خطأ في تحليل الصورة' : 'Error analyzing image',
        objects: [],
        colors: [],
        mood: '',
        suggestions: [],
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedImage, imageUrl, isAnalyzing, language]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const downloadAnalysis = useCallback(() => {
    if (!analysis) return;
    
    const content = `Image Analysis Report
====================

Description:
${analysis.description}

Objects Detected:
${analysis.objects.join(', ')}

Dominant Colors:
${analysis.colors.join(', ')}

Mood/Atmosphere:
${analysis.mood}

Suggestions:
${analysis.suggestions.join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `image-analysis-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [analysis]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #8b5cf620, #8b5cf610)', border: '1px solid #8b5cf630' }}>
            <Eye size={14} style={{ color: '#8b5cf6' }} />
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
        <div className="jarvis-live">
          <div className="jarvis-live-dot" style={{ background: '#8b5cf6', boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)' }} />
          <span style={{ color: '#8b5cf6' }}>Ready</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Image Upload Area */}
        {!uploadedImage && !imageUrl && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`jarvis-hud-card p-8 cursor-pointer transition-all ${isDragging ? 'border-2 border-dashed' : ''}`}
            style={{
              borderColor: isDragging ? '#8b5cf6' : undefined,
              background: isDragging ? 'rgba(139, 92, 246, 0.1)' : undefined,
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 flex items-center justify-center rounded-full"
                style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <Upload size={24} style={{ color: '#8b5cf6' }} />
              </div>
              <p className="text-[11px] font-medium" style={{ color: '#d0e4f8' }}>
                {translations.uploadImage}
              </p>
              <p className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {translations.dragDrop}
              </p>
            </div>
          </div>
        )}

        {/* URL Input */}
        <div className="jarvis-hud-card p-3">
          <div className="flex items-center gap-2">
            <Image size={12} style={{ color: '#8b5cf6' }} />
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (e.target.value) setUploadedImage(null);
              }}
              placeholder={translations.orPasteUrl}
              className="flex-1 bg-transparent text-[11px] outline-none"
              style={{ color: '#d0e4f8' }}
            />
          </div>
        </div>

        {/* Image Preview */}
        {(uploadedImage || imageUrl) && (
          <div className="jarvis-hud-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                {language === 'ar' ? 'الصورة' : 'Image'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="p-1 rounded transition-all"
                >
                  <ZoomOut size={10} style={{ color: '#90a8cc' }} />
                </button>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                  className="p-1 rounded transition-all"
                >
                  <ZoomIn size={10} style={{ color: '#90a8cc' }} />
                </button>
                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="p-1 rounded transition-all"
                >
                  <RotateCw size={10} style={{ color: '#90a8cc' }} />
                </button>
                <button
                  onClick={() => { setUploadedImage(null); setImageUrl(''); setAnalysis(null); }}
                  className="p-1 rounded transition-all"
                >
                  <Trash2 size={10} style={{ color: '#ef4444' }} />
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
              <img
                ref={imageRef}
                src={uploadedImage || imageUrl}
                alt="Image to analyze"
                className="max-h-[250px] object-contain transition-transform"
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              />
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={analyzeImage}
          disabled={(!uploadedImage && !imageUrl) || isAnalyzing}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{
            background: (uploadedImage || imageUrl) && !isAnalyzing
              ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
              : 'rgba(139, 92, 246, 0.06)',
            border: `1px solid ${(uploadedImage || imageUrl) && !isAnalyzing ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.1)'}`,
            color: (uploadedImage || imageUrl) && !isAnalyzing ? '#ffffff' : '#90a8cc',
            opacity: (uploadedImage || imageUrl) ? 1 : 0.5,
          }}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              {translations.analyzing}
            </>
          ) : (
            <>
              <Eye size={13} />
              {translations.analyze}
            </>
          )}
        </button>

        {/* Analysis Results */}
        {(analysis || isAnalyzing) && (
          <div className="space-y-3 jarvis-animate-fade-in">
            {/* Description */}
            <div className="jarvis-hud-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: '#8b5cf6' }}>
                  {translations.description}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyToClipboard(analysis?.description || '')}
                    disabled={!analysis}
                    className="p-1 rounded transition-all"
                    style={{ opacity: analysis ? 1 : 0.3 }}
                  >
                    {copied ? <Check size={10} style={{ color: '#10b981' }} /> : <Copy size={10} style={{ color: '#8b5cf6' }} />}
                  </button>
                  <button
                    onClick={downloadAnalysis}
                    disabled={!analysis}
                    className="p-1 rounded transition-all"
                    style={{ opacity: analysis ? 1 : 0.3 }}
                  >
                    <Download size={10} style={{ color: '#8b5cf6' }} />
                  </button>
                </div>
              </div>
              {isAnalyzing ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 size={12} className="animate-spin" style={{ color: '#8b5cf6' }} />
                  <span className="text-[10px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                    {translations.analyzing}...
                  </span>
                </div>
              ) : (
                <p className="text-[11px] leading-relaxed" style={{ color: '#d0e4f8', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {analysis?.description}
                </p>
              )}
            </div>

            {/* Objects */}
            {analysis?.objects && analysis.objects.length > 0 && (
              <div className="jarvis-hud-card p-4">
                <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.objects}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.objects.map((obj, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg text-[9px]" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                      {obj}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {analysis?.colors && analysis.colors.length > 0 && (
              <div className="jarvis-hud-card p-4">
                <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.colors}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.colors.map((color, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg text-[9px] flex items-center gap-1" style={{ background: 'rgba(0, 0, 0, 0.2)', color: '#d0e4f8' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mood */}
            {analysis?.mood && (
              <div className="jarvis-hud-card p-4">
                <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.mood}
                </span>
                <p className="text-[11px]" style={{ color: '#d0e4f8' }}>{analysis.mood}</p>
              </div>
            )}

            {/* Suggestions */}
            {analysis?.suggestions && analysis.suggestions.length > 0 && (
              <div className="jarvis-hud-card p-4">
                <span className="text-[9px] tracking-[0.12em] uppercase mb-2 block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
                  {translations.suggestions}
                </span>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-[10px] flex items-start gap-2" style={{ color: '#90a8cc' }}>
                      <span style={{ color: '#8b5cf6' }}>•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
