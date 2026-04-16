'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Images,
  Video,
  Presentation,
  Search,
  Trash2,
  Download,
  Play,
  X,
  Copy,
  Eye,
  CheckSquare,
  Square,
  ArrowUpDown,
  ImageIcon,
  Film,
  FileText,
  Wand2,
} from 'lucide-react';

interface GalleryItem {
  type: 'image' | 'video' | 'slides';
  id: string;
  prompt?: string;
  topic?: string;
  image?: string;
  videoUrl?: string;
  slides?: { title: string; content: string; layout: string; notes: string }[];
  slideCount?: number;
  size?: string;
  duration?: string;
  style?: string;
  timestamp: number;
  isEnhanced?: boolean;
}

type FilterTab = 'all' | 'image' | 'video' | 'slides';
type SortOrder = 'newest' | 'oldest';

const FILTER_TABS: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Images size={10} /> },
  { id: 'image', label: 'Images', icon: <ImageIcon size={10} /> },
  { id: 'video', label: 'Videos', icon: <Film size={10} /> },
  { id: 'slides', label: 'Slides', icon: <FileText size={10} /> },
];

interface GalleryViewProps {
  translations: {
    mediaGallery: string;
    itemsTotal: string;
    newest: string;
    oldest: string;
    searchPrompt: string;
    selected: string;
    deleteSelected: string;
    yourGalleryEmpty: string;
    yourGallerySub: string;
    noImagesYet: string;
    noImagesSub: string;
    noVideosYet: string;
    noVideosSub: string;
    noPresentationsYet: string;
    noPresentationsSub: string;
    download: string;
    delete: string;
    png: string;
    jpg: string;
    webp: string;
    mp4: string;
    webm: string;
    mov: string;
  };
  language: 'en' | 'ar';
}

export default function GalleryView({ translations, language }: GalleryViewProps) {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    try {
      const raw = localStorage.getItem('jarvis-gallery');
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return [];
  });
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOrder>('newest');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (filter !== 'all') result = result.filter(item => item.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(item => (item.prompt && item.prompt.toLowerCase().includes(q)) || (item.topic && item.topic.toLowerCase().includes(q)));
    }
    result.sort((a, b) => sort === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    return result;
  }, [items, filter, search, sort]);

  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = { all: items.length, image: 0, video: 0, slides: 0 };
    items.forEach(item => { counts[item.type]++; });
    return counts;
  }, [items]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const syncToStorage = useCallback((updatedItems: GalleryItem[]) => {
    try { localStorage.setItem('jarvis-gallery', JSON.stringify(updatedItems)); } catch { /* ignore */ }
  }, []);

  const deleteSelected = useCallback(() => {
    setItems(prev => {
      const filtered = prev.filter(item => !selectedItems.has(item.id));
      syncToStorage(filtered);
      return filtered;
    });
    setSelectedItems(new Set());
  }, [selectedItems, syncToStorage]);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      syncToStorage(filtered);
      return filtered;
    });
    if (lightboxItem?.id === id) setLightboxItem(null);
  }, [lightboxItem, syncToStorage]);

  const downloadImage = useCallback((item: GalleryItem, format: 'png' | 'jpg' | 'webp' = 'png') => {
    if (!item.image) return;
    try {
      // Get raw base64 data (remove prefix if exists)
      let base64Data = item.image;
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      let mimeType = 'image/png';
      let extension = 'png';
      if (format === 'jpg') { mimeType = 'image/jpeg'; extension = 'jpg'; }
      else if (format === 'webp') { mimeType = 'image/webp'; extension = 'webp'; }
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jarvis-image-${item.id}.${extension}`;
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
        const base64Data = item.image?.includes(',') ? item.image : `data:image/png;base64,${item.image}`;
        link.href = base64Data;
        link.download = `jarvis-image-${item.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowDownloadDropdown(null);
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
      }
    }
  }, []);

  const downloadVideo = useCallback((item: GalleryItem, format: 'mp4' | 'webm' | 'mov' = 'mp4') => {
    if (!item.videoUrl) return;
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

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const emptyMessages: Record<FilterTab, { title: string; sub: string }> = {
    all: { title: translations.yourGalleryEmpty, sub: translations.yourGallerySub },
    image: { title: translations.noImagesYet, sub: translations.noImagesSub },
    video: { title: translations.noVideosYet, sub: translations.noVideosSub },
    slides: { title: translations.noPresentationsYet, sub: translations.noPresentationsSub },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #0e1a3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #10b98120, #10b98110)', border: '1px solid #10b98130' }}>
            <Images size={14} style={{ color: '#10b981' }} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#d0e4f8' }}>{translations.mediaGallery}</span>
            <p className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>{items.length} {translations.itemsTotal}</p>
          </div>
        </div>
        <button onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')} className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] transition-all"
          style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
          <ArrowUpDown size={10} />
          {sort === 'newest' ? translations.newest : translations.oldest}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ paddingBottom: '20px' }}>
        {/* Filter tabs */}
        <div className="flex gap-1.5">
          {FILTER_TABS.map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] transition-all"
              style={{ background: filter === tab.id ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.03)', border: `1px solid ${filter === tab.id ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.06)'}`, color: filter === tab.id ? '#10b981' : '#90a8cc' }}>
              {tab.icon}
              {tab.label}
              <span className="text-[8px] opacity-60">({tabCounts[tab.id]})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={12} style={{ color: 'rgba(144, 168, 204, 0.3)', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={translations.searchPrompt}
            className="w-full pl-7 pr-3 py-2 rounded-lg text-[11px] outline-none"
            style={{ background: '#080e1e', border: '1px solid #0e1a3a', color: '#d0e4f8', fontFamily: 'inherit', direction: language === 'ar' ? 'rtl' : 'ltr' }} />
        </div>

        {/* Bulk actions */}
        {selectedItems.size > 0 && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg jarvis-animate-fade-in"
            style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <span className="text-[10px]" style={{ color: '#ef4444' }}>{selectedItems.size} {translations.selected}</span>
            <button onClick={deleteSelected} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <Trash2 size={10} />{translations.deleteSelected}
            </button>
          </div>
        )}

        {/* Gallery grid */}
        {filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map(item => (
              <div key={item.id} className="jarvis-mod-card p-0 overflow-hidden group jarvis-animate-fade-in">
                <div className="relative aspect-video cursor-pointer overflow-hidden" onClick={() => setLightboxItem(item)} style={{ background: '#060a14' }}>
                  {item.type === 'image' && item.image && (
                    <img 
                      src={item.image.includes('data:image') ? item.image : `data:image/png;base64,${item.image}`} 
                      alt={item.prompt || ''} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Image load error');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {item.type === 'video' && (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #060a14, #0e1a3a)' }}>
                      <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: 'rgba(124, 92, 255, 0.2)', border: '1px solid rgba(124, 92, 255, 0.3)' }}>
                        <Play size={18} style={{ color: '#7c5cff', marginLeft: '2px' }} />
                      </div>
                    </div>
                  )}
                  {item.type === 'slides' && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3" style={{ background: 'linear-gradient(135deg, #060a14, #1a0f06)' }}>
                      <Presentation size={20} style={{ color: '#f59e0b', marginBottom: '6px' }} />
                      <p className="text-[9px] text-center truncate w-full" style={{ color: '#90a8cc' }}>{item.topic || 'Presentation'}</p>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[7px] font-bold tracking-widest uppercase"
                    style={{ background: 'rgba(6, 10, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.15)', color: item.type === 'image' ? '#00e5ff' : item.type === 'video' ? '#7c5cff' : '#f59e0b' }}>
                    {item.type}
                    {item.isEnhanced && <Wand2 size={8} className="inline ml-1" style={{ color: '#a855f7' }} />}
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleSelect(item.id); }} className="absolute top-2 right-2 p-0.5 rounded transition-all"
                    style={{ background: selectedItems.has(item.id) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 10, 20, 0.6)' }}>
                    {selectedItems.has(item.id) ? <CheckSquare size={12} style={{ color: '#10b981' }} /> : <Square size={12} style={{ color: 'rgba(144, 168, 204, 0.4)' }} />}
                  </button>
                </div>

                <div className="p-2.5">
                  <p className="text-[10px] mb-1 leading-relaxed truncate" style={{ color: '#90a8cc' }} title={item.prompt || item.topic || ''}>
                    {item.prompt || item.topic || 'Untitled'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>{formatDate(item.timestamp)}</span>
                      {item.size && <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.25)' }}>{item.size}</span>}
                      {item.duration && <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.25)' }}>{item.duration}</span>}
                      {item.slideCount && <span className="text-[8px]" style={{ color: 'rgba(144, 168, 204, 0.25)' }}>{item.slideCount} slides</span>}
                    </div>
                    <div className="flex items-center gap-0.5 relative">
                      <button onClick={() => setLightboxItem(item)} className="p-1 rounded transition-colors hover:bg-[#0e1a3a]" title="View"><Eye size={10} style={{ color: '#90a8cc' }} /></button>
                      {(item.type === 'image' || item.type === 'video') && (
                        <button onClick={() => setShowDownloadDropdown(showDownloadDropdown === item.id ? null : item.id)} className="p-1 rounded transition-colors hover:bg-[#0e1a3a]" title={translations.download}>
                          <Download size={10} style={{ color: '#90a8cc' }} />
                        </button>
                      )}
                      {showDownloadDropdown === item.id && (
                        <div className="jarvis-dropdown">
                          {item.type === 'image' && (
                            <>
                              <div className="jarvis-dropdown-item" onClick={() => downloadImage(item, 'png')}><ImageIcon size={10} /> {translations.png}</div>
                              <div className="jarvis-dropdown-item" onClick={() => downloadImage(item, 'jpg')}><ImageIcon size={10} /> {translations.jpg}</div>
                              <div className="jarvis-dropdown-item" onClick={() => downloadImage(item, 'webp')}><ImageIcon size={10} /> {translations.webp}</div>
                            </>
                          )}
                          {item.type === 'video' && (
                            <>
                              <div className="jarvis-dropdown-item" onClick={() => downloadVideo(item, 'mp4')}><Film size={10} /> {translations.mp4}</div>
                              <div className="jarvis-dropdown-item" onClick={() => downloadVideo(item, 'webm')}><Film size={10} /> {translations.webm}</div>
                              <div className="jarvis-dropdown-item" onClick={() => downloadVideo(item, 'mov')}><Film size={10} /> {translations.mov}</div>
                            </>
                          )}
                        </div>
                      )}
                      <button onClick={() => deleteItem(item.id)} className="p-1 rounded transition-colors hover:bg-[#0e1a3a]" title={translations.delete}><Trash2 size={10} style={{ color: '#ef4444' }} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 jarvis-animate-fade-in">
            <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <Images size={22} style={{ color: '#90a8cc' }} />
            </div>
            <p className="text-[11px]" style={{ color: 'rgba(144, 168, 204, 0.4)' }}>{emptyMessages[filter].title}</p>
            <p className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.25)' }}>{emptyMessages[filter].sub}</p>
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(6, 10, 20, 0.95)', backdropFilter: 'blur(20px)' }} onClick={() => setLightboxItem(null)}>
          <button className="absolute top-4 right-4 p-2 rounded-lg" style={{ background: 'rgba(8, 14, 30, 0.8)', border: '1px solid #0e1a3a' }} onClick={() => setLightboxItem(null)}>
            <X size={16} style={{ color: '#90a8cc' }} />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3 overflow-y-auto" onClick={e => e.stopPropagation()}>
            {lightboxItem.type === 'image' && lightboxItem.image && (
              <>
                <img 
                  src={lightboxItem.image.includes('data:image') ? lightboxItem.image : `data:image/png;base64,${lightboxItem.image}`} 
                  alt={lightboxItem.prompt || ''} 
                  className="max-w-full max-h-[70vh] rounded-xl object-contain" 
                  style={{ border: '1px solid #0e1a3a' }}
                  onError={(e) => {
                    console.error('Lightbox image load error');
                  }}
                />
                <p className="text-[10px] text-center max-w-lg" style={{ color: '#90a8cc' }}>{lightboxItem.prompt}</p>
              </>
            )}
            {lightboxItem.type === 'video' && lightboxItem.videoUrl && (
              <>
                <video src={lightboxItem.videoUrl} controls autoPlay className="max-w-full max-h-[70vh] rounded-xl" style={{ border: '1px solid #0e1a3a', boxShadow: '0 0 30px rgba(124, 92, 255, 0.1)' }} />
                <p className="text-[10px] text-center max-w-lg" style={{ color: '#90a8cc' }}>{lightboxItem.prompt}</p>
              </>
            )}
            {lightboxItem.type === 'slides' && lightboxItem.slides && (
              <div className="w-full max-w-2xl space-y-3 py-2">
                <h3 className="text-[13px] font-bold text-center mb-4" style={{ color: '#d0e4f8' }}>{lightboxItem.topic || 'Presentation'}</h3>
                {lightboxItem.slides.map((slide, i) => (
                  <div key={i} className="jarvis-hud-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        {String(i + 1).padStart(2, '0')} / {String(lightboxItem.slides!.length).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(144, 168, 204, 0.06)', color: '#90a8cc' }}>{slide.layout}</span>
                    </div>
                    <h4 className="text-[12px] font-bold mb-1.5" style={{ color: '#d0e4f8' }}>{slide.title}</h4>
                    <div className="text-[10px] leading-relaxed whitespace-pre-line" style={{ color: '#90a8cc' }}>{slide.content}</div>
                    {slide.notes && <p className="text-[8px] mt-2" style={{ color: 'rgba(144, 168, 204, 0.3)' }}>Notes: {slide.notes}</p>}
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              {(lightboxItem.type === 'image' || lightboxItem.type === 'video') && (
                <button
                  onClick={() => {
                    if (lightboxItem.type === 'image') {
                      downloadImage(lightboxItem);
                    } else {
                      downloadVideo(lightboxItem);
                    }
                  }}
                  className="jarvis-chip"
                >
                  <Download size={12} style={{ color: '#00e5ff' }} />
                  {translations.download}
                </button>
              )}
              <button onClick={() => { deleteItem(lightboxItem.id); }} className="jarvis-chip" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <Trash2 size={12} style={{ color: '#ef4444' }} />{translations.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
