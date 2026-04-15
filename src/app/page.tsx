'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  MessageSquare,
  Camera,
  Video,
  Mic,
  Presentation,
  Images,
  Settings,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

// Import all view components
import ChatView from '@/components/jarvis/ChatView';
import PhotoView from '@/components/jarvis/PhotoView';
import VideoView from '@/components/jarvis/VideoView';
import VoiceView from '@/components/jarvis/VoiceView';
import SlidesView from '@/components/jarvis/SlidesView';
import GalleryView from '@/components/jarvis/GalleryView';
import SettingsView from '@/components/jarvis/SettingsView';
import BackgroundEffects from '@/components/jarvis/BackgroundEffects';
import ReactorCore from '@/components/jarvis/ReactorCore';

type Tab = 'chat' | 'photo' | 'video' | 'voice' | 'slides' | 'gallery' | 'settings';
type Language = 'en' | 'ar';

// Translation system
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    aiChat: 'AI Chat',
    photoStudio: 'Photo Studio',
    videoEngine: 'Video Engine',
    voiceAssistant: 'Voice Assistant',
    slidesBuilder: 'Slides Builder',
    mediaGallery: 'Media Gallery',
    settings: 'Settings',

    // Chat
    messages: 'messages',
    live: 'LIVE',
    exportChat: 'Export Chat',
    clearChat: 'Clear Chat',
    welcomeToJarvis: 'Welcome to JARVIS',
    welcomeSub: 'Your AI-powered creative assistant',
    generateImage: 'Generate Image',
    createVideo: 'Create Video',
    buildSlides: 'Build Slides',
    explainCode: 'Explain Code',
    placeholder: 'Ask JARVIS anything...',
    you: 'YOU',
    jarvis: 'JARVIS',
    thinking: 'thinking',
    commandsImage: 'Generate AI images',
    commandsVideo: 'Create AI videos',
    commandsSlides: 'Build presentations',

    // Photo
    aiImageGeneration: 'AI Image Generation',
    prompt: 'Prompt',
    size: 'Size',
    style: 'Style',
    generate: 'Generate',
    generating: 'Generating...',
    recentPrompts: 'Recent Prompts',
    generated: 'Generated',
    noImagesYet: 'No images yet',
    noImagesSub: 'Generate your first image to get started',
    generateMode: 'Generate',
    enhanceMode: 'Enhance',
    enhanceImage: 'Enhance Image',
    enhanceImageSub: 'Upload an image to enhance quality, fix issues, and upscale',
    uploadImage: 'Upload Image',
    selectImageToEnhance: 'Select image to enhance',
    quality: 'Quality',
    sharpness: 'Sharpness',
    denoise: 'Denoise',
    colorCorrection: 'Color Correction',
    upscaling: 'Upscaling',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    ultra: 'Ultra',
    enhance: 'Enhance',
    enhancing: 'Enhancing...',
    downloadAll: 'Download',
    png: 'PNG',
    jpg: 'JPG',
    webp: 'WEBP',

    // Video
    aiVideoGeneration: 'AI Video Generation',
    duration: 'Duration',
    generateVideo: 'Generate Video',
    generatingVideo: 'Generating Video...',
    noVideosYet: 'No videos yet',
    noVideosSub: 'Create your first video to get started',
    enhanceVideo: 'Enhance Video',
    enhanceVideoSub: 'Upload a video to enhance quality and resolution',
    uploadVideo: 'Upload Video',
    processing: 'Processing...',
    mayTakeMinutes: 'This may take several minutes...',
    fps: 'FPS',
    resolution: 'Resolution',
    speed: 'Speed',
    stabilize: 'Stabilize',
    colorGrade: 'Color Grade',
    mp4: 'MP4',
    webm: 'WEBM',
    avi: 'AVI',
    mov: 'MOV',

    // Voice
    naturalLanguageSpeech: 'Natural Language Speech',
    ready: 'READY',
    listening: 'LISTENING',
    voiceError: 'ERROR',
    tapToStart: 'Tap to start speaking',
    listeningForVoice: 'Listening for voice input...',
    processingRequest: 'Processing your request...',
    jarvisSpeaking: 'JARVIS is speaking...',
    voiceErrorOccurred: 'An error occurred. Tap to try again.',
    transcription: 'Transcription',
    typeInstead: 'Type Instead',
    hideTextInput: 'Hide Text Input',
    typeMessage: 'Type your message...',
    conversationHistory: 'Conversation History',
    uploadAudio: 'Upload Audio',
    selectVoice: 'Voice',
    volume: 'Volume',

    // Slides
    aiPresentationCreator: 'AI Presentation Creator',
    topic: 'Topic',
    slides: 'Slides',
    buildPresentation: 'Build Presentation',
    buildingPresentation: 'Building Presentation...',
    noPresentationsYet: 'No presentations yet',
    noPresentationsSub: 'Create your first presentation to get started',
    preview: 'Preview',
    export: 'Export',
    copyAll: 'Copy All',
    copied: 'Copied!',
    speakerNotes: 'Speaker Notes',
    slidesGenerated: 'Slides Generated',

    // Gallery
    itemsTotal: 'items total',
    newest: 'Newest',
    oldest: 'Oldest',
    searchPrompt: 'Search by prompt...',
    selected: 'selected',
    deleteSelected: 'Delete Selected',
    yourGalleryEmpty: 'Your gallery is empty',
    yourGallerySub: 'Generated content will appear here',
    noImagesSub: 'Create images to see them here',
    noVideosSub: 'Create videos to see them here',
    noPresentationsSub: 'Create presentations to see them here',
    download: 'Download',
    delete: 'Delete',

    // Settings
    systemConfig: 'System Config',
    jarvisConfigurationPanel: 'JARVIS Configuration Panel',
    profile: 'Profile',
    aiConfiguration: 'AI Configuration',
    voiceConfiguration: 'Voice Configuration',
    mediaDefaults: 'Media Defaults',
    display: 'Display',
    systemInfo: 'System Info',
    dataManagement: 'Data Management',
    aboutJarvis: 'About JARVIS',
    aboutJarvisText: 'JARVIS Pro Max is your intelligent AI assistant with powerful capabilities for image generation, video creation, voice interaction, and presentation building. Powered by advanced AI models for the best creative experience.',
    poweredByZAI: 'Powered by Z.AI',
    version: 'Version',
    sdkStatus: 'SDK Status',
    connected: 'Connected',
    storageUsed: 'Storage Used',
    defaultLanguage: 'Default Language',
    english: 'English',
    arabic: 'Arabic',
    responseStyle: 'Response Style',
    concise: 'Concise',
    detailed: 'Detailed',
    creative: 'Creative',
    autoSpeakResponses: 'Auto-speak Responses',
    imageQuality: 'Image Quality',
    standard: 'Standard',
    hd: 'HD',
    defaultImageSize: 'Default Image Size',
    defaultVideoDuration: 'Default Video Duration',
    particleEffects: 'Particle Effects',
    animations: 'Animations',
    compactMode: 'Compact Mode',
    darkMode: 'Dark Mode',
    clearGallery: 'Clear Gallery',
    exportSettings: 'Export Settings',
    resetAll: 'Reset All',
    online: 'Online',
    busy: 'Busy',
    away: 'Away',
    image: 'Image',
    video: 'Video',
  },
  ar: {
    // Navigation
    aiChat: 'المحادثة الذكية',
    photoStudio: 'استوديو الصور',
    videoEngine: 'محرك الفيديو',
    voiceAssistant: 'المساعد الصوتي',
    slidesBuilder: 'منشئ العروض',
    mediaGallery: 'معرض الوسائط',
    settings: 'الإعدادات',

    // Chat
    messages: 'رسائل',
    live: 'مباشر',
    exportChat: 'تصدير المحادثة',
    clearChat: 'مسح المحادثة',
    welcomeToJarvis: 'مرحباً بك في JARVIS',
    welcomeSub: 'مساعدك الإبداعي المدعوم بالذكاء الاصطناعي',
    generateImage: 'إنشاء صورة',
    createVideo: 'إنشاء فيديو',
    buildSlides: 'بناء عرض تقديمي',
    explainCode: 'شرح الكود',
    placeholder: 'اسأل JARVIS أي شيء...',
    you: 'أنت',
    jarvis: 'JARVIS',
    thinking: 'يفكر',
    commandsImage: 'إنشاء صور بالذكاء الاصطناعي',
    commandsVideo: 'إنشاء فيديوهات بالذكاء الاصطناعي',
    commandsSlides: 'بناء عروض تقديمية',

    // Photo
    aiImageGeneration: 'إنشاء الصور بالذكاء الاصطناعي',
    prompt: 'الوصف',
    size: 'الحجم',
    style: 'النمط',
    generate: 'إنشاء',
    generating: 'جارٍ الإنشاء...',
    recentPrompts: 'الأوامر السابقة',
    generated: 'تم الإنشاء',
    noImagesYet: 'لا توجد صور بعد',
    noImagesSub: 'أنشئ صورتك الأولى للبدء',
    generateMode: 'إنشاء',
    enhanceMode: 'تحسين',
    enhanceImage: 'تحسين الصورة',
    enhanceImageSub: 'ارفع صورة لتحسين جودتها وإصلاح المشاكل وتكبيرها',
    uploadImage: 'رفع صورة',
    selectImageToEnhance: 'اختر صورة لتحسينها',
    quality: 'الجودة',
    sharpness: 'الحدة',
    denoise: 'إزالة الضوضاء',
    colorCorrection: 'تصحيح الألوان',
    upscaling: 'تكبير',
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    ultra: 'فائق',
    enhance: 'تحسين',
    enhancing: 'جارٍ التحسين...',
    downloadAll: 'تحميل',
    png: 'PNG',
    jpg: 'JPG',
    webp: 'WEBP',

    // Video
    aiVideoGeneration: 'إنشاء الفيديو بالذكاء الاصطناعي',
    duration: 'المدة',
    generateVideo: 'إنشاء فيديو',
    generatingVideo: 'جارٍ إنشاء الفيديو...',
    noVideosYet: 'لا توجد فيديوهات بعد',
    noVideosSub: 'أنشئ فيديوك الأول للبدء',
    enhanceVideo: 'تحسين الفيديو',
    enhanceVideoSub: 'ارفع فيديو لتحسين جودته ودقته',
    uploadVideo: 'رفع فيديو',
    processing: 'جارٍ المعالجة...',
    mayTakeMinutes: 'قد يستغرق هذا عدة دقائق...',
    fps: 'إطارات/ثانية',
    resolution: 'الدقة',
    speed: 'السرعة',
    stabilize: 'تثبيت',
    colorGrade: 'تصحيح الألوان',
    mp4: 'MP4',
    webm: 'WEBM',
    avi: 'AVI',
    mov: 'MOV',

    // Voice
    naturalLanguageSpeech: 'الكلام باللغة الطبيعية',
    ready: 'جاهز',
    listening: 'يستمع',
    voiceError: 'خطأ',
    tapToStart: 'اضغط للبدء في التحدث',
    listeningForVoice: 'يستمع للمدخلات الصوتية...',
    processingRequest: 'يعالج طلبك...',
    jarvisSpeaking: 'JARVIS يتحدث...',
    voiceErrorOccurred: 'حدث خطأ. اضغط للمحاولة مرة أخرى.',
    transcription: 'النص',
    typeInstead: 'اكتب بدلاً من ذلك',
    hideTextInput: 'إخفاء حقل الكتابة',
    typeMessage: 'اكتب رسالتك...',
    conversationHistory: 'سجل المحادثة',
    uploadAudio: 'رفع صوت',
    selectVoice: 'الصوت',
    volume: 'مستوى الصوت',

    // Slides
    aiPresentationCreator: 'منشئ العروض التقديمية',
    topic: 'الموضوع',
    slides: 'الشرائح',
    buildPresentation: 'بناء العرض',
    buildingPresentation: 'جارٍ بناء العرض...',
    noPresentationsYet: 'لا توجد عروض بعد',
    noPresentationsSub: 'أنشئ عرضك الأول للبدء',
    preview: 'معاينة',
    export: 'تصدير',
    copyAll: 'نسخ الكل',
    copied: 'تم النسخ!',
    speakerNotes: 'ملاحظات المتحدث',
    slidesGenerated: 'شرائح تم إنشاؤها',

    // Gallery
    itemsTotal: 'عنصر',
    newest: 'الأحدث',
    oldest: 'الأقدم',
    searchPrompt: 'ابحث بالوصف...',
    selected: 'محدد',
    deleteSelected: 'حذف المحدد',
    yourGalleryEmpty: 'معرضك فارغ',
    yourGallerySub: 'المحتوى المنشأ سيظهر هنا',
    noImagesSub: 'أنشئ صوراً لرؤيتها هنا',
    noVideosSub: 'أنشئ فيديوهات لرؤيتها هنا',
    noPresentationsSub: 'أنشئ عروضاً لرؤيتها هنا',
    download: 'تحميل',
    delete: 'حذف',

    // Settings
    systemConfig: 'إعدادات النظام',
    jarvisConfigurationPanel: 'لوحة إعدادات JARVIS',
    profile: 'الملف الشخصي',
    aiConfiguration: 'إعدادات الذكاء الاصطناعي',
    voiceConfiguration: 'إعدادات الصوت',
    mediaDefaults: 'الإعدادات الافتراضية',
    display: 'العرض',
    systemInfo: 'معلومات النظام',
    dataManagement: 'إدارة البيانات',
    aboutJarvis: 'حول JARVIS',
    aboutJarvisText: 'JARVIS Pro Max هو مساعدك الذكي مع قدرات قوية لإنشاء الصور والفيديوهات والتفاعل الصوتي وبناء العروض التقديمية. مدعوم بنماذج ذكاء اصطناعي متقدمة لأفضل تجربة إبداعية.',
    poweredByZAI: 'مدعوم من Z.AI',
    version: 'الإصدار',
    sdkStatus: 'حالة SDK',
    connected: 'متصل',
    storageUsed: 'التخزين المستخدم',
    defaultLanguage: 'اللغة الافتراضية',
    english: 'الإنجليزية',
    arabic: 'العربية',
    responseStyle: 'أسلوب الرد',
    concise: 'موجز',
    detailed: 'مفصل',
    creative: 'إبداعي',
    autoSpeakResponses: 'النطق التلقائي للردود',
    imageQuality: 'جودة الصورة',
    standard: 'قياسي',
    hd: 'عالي الدقة',
    defaultImageSize: 'حجم الصورة الافتراضي',
    defaultVideoDuration: 'مدة الفيديو الافتراضية',
    particleEffects: 'تأثيرات الجسيمات',
    animations: 'الرسوم المتحركة',
    compactMode: 'الوضع المدمج',
    darkMode: 'الوضع الداكن',
    clearGallery: 'مسح المعرض',
    exportSettings: 'تصدير الإعدادات',
    resetAll: 'إعادة تعيين الكل',
    online: 'متصل',
    busy: 'مشغول',
    away: 'بعيد',
    image: 'صورة',
    video: 'فيديو',
  },
};

// Navigation tabs configuration
const NAV_TABS: { id: Tab; icon: React.ElementType; color: string }[] = [
  { id: 'chat', icon: MessageSquare, color: '#00e5ff' },
  { id: 'photo', icon: Camera, color: '#00e5ff' },
  { id: 'video', icon: Video, color: '#7c5cff' },
  { id: 'voice', icon: Mic, color: '#0088cc' },
  { id: 'slides', icon: Presentation, color: '#f59e0b' },
  { id: 'gallery', icon: Images, color: '#10b981' },
  { id: 'settings', icon: Settings, color: '#90a8cc' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  // Initialize language from localStorage on first render
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      const saved = localStorage.getItem('jarvis-language');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch { /* ignore */ }
    return 'en';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationData, setNavigationData] = useState<{ prompt?: string; topic?: string } | undefined>();

  const t = TRANSLATIONS[language];

  // Save language preference
  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('jarvis-language', lang);
    } catch { /* ignore */ }
  }, []);

  // Handle navigation with data
  const handleNavigate = useCallback((tab: string, data?: { prompt?: string; topic?: string }) => {
    setActiveTab(tab as Tab);
    setNavigationData(data);
    setIsMobileMenuOpen(false);
  }, []);

  // Clear navigation data after use
  useEffect(() => {
    if (navigationData) {
      const timer = setTimeout(() => setNavigationData(undefined), 500);
      return () => clearTimeout(timer);
    }
  }, [navigationData]);

  // Render current view
  const renderView = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatView
            onNavigate={handleNavigate}
            translations={{
              aiChat: t.aiChat,
              messages: t.messages,
              live: t.live,
              exportChat: t.exportChat,
              clearChat: t.clearChat,
              welcomeToJarvis: t.welcomeToJarvis,
              welcomeSub: t.welcomeSub,
              generateImage: t.generateImage,
              createVideo: t.createVideo,
              buildSlides: t.buildSlides,
              explainCode: t.explainCode,
              placeholder: t.placeholder,
              you: t.you,
              jarvis: t.jarvis,
              thinking: t.thinking,
              commands: { image: t.commandsImage, video: t.commandsVideo, slides: t.commandsSlides },
            }}
            language={language}
          />
        );
      case 'photo':
        return (
          <PhotoView
            initialPrompt={navigationData?.prompt}
            translations={{
              photoStudio: t.photoStudio,
              aiImageGeneration: t.aiImageGeneration,
              live: t.live,
              prompt: t.prompt,
              size: t.size,
              style: t.style,
              generate: t.generate,
              generating: t.generating,
              recentPrompts: t.recentPrompts,
              generated: t.generated,
              noImagesYet: t.noImagesYet,
              noImagesSub: t.noImagesSub,
              generateMode: t.generateMode,
              enhanceMode: t.enhanceMode,
              enhanceImage: t.enhanceImage,
              enhanceImageSub: t.enhanceImageSub,
              uploadImage: t.uploadImage,
              selectImageToEnhance: t.selectImageToEnhance,
              quality: t.quality,
              sharpness: t.sharpness,
              denoise: t.denoise,
              colorCorrection: t.colorCorrection,
              upscaling: t.upscaling,
              low: t.low,
              medium: t.medium,
              high: t.high,
              ultra: t.ultra,
              enhance: t.enhance,
              enhancing: t.enhancing,
              downloadAll: t.downloadAll,
              png: t.png,
              jpg: t.jpg,
              webp: t.webp,
            }}
            language={language}
          />
        );
      case 'video':
        return (
          <VideoView
            initialPrompt={navigationData?.prompt}
            translations={{
              videoEngine: t.videoEngine,
              aiVideoGeneration: t.aiVideoGeneration,
              live: t.live,
              prompt: t.prompt,
              duration: t.duration,
              style: t.style,
              generateVideo: t.generateVideo,
              generatingVideo: t.generatingVideo,
              generated: t.generated,
              noVideosYet: t.noVideosYet,
              noVideosSub: t.noVideosSub,
              generateMode: t.generateMode,
              enhanceMode: t.enhanceMode,
              enhanceVideo: t.enhanceVideo,
              enhanceVideoSub: t.enhanceVideoSub,
              uploadVideo: t.uploadVideo,
              quality: t.quality,
              low: t.low,
              medium: t.medium,
              high: t.high,
              ultra: t.ultra,
              enhance: t.enhance,
              enhancing: t.enhancing,
              downloadAll: t.downloadAll,
              mp4: t.mp4,
              webm: t.webm,
              avi: t.avi,
              mov: t.mov,
              processing: t.processing,
              mayTakeMinutes: t.mayTakeMinutes,
              fps: t.fps,
              resolution: t.resolution,
              speed: t.speed,
              stabilize: t.stabilize,
              colorGrade: t.colorGrade,
            }}
            language={language}
          />
        );
      case 'voice':
        return (
          <VoiceView
            translations={{
              voiceAssistant: t.voiceAssistant,
              naturalLanguageSpeech: t.naturalLanguageSpeech,
              live: t.live,
              ready: t.ready,
              listening: t.listening,
              thinking: t.thinking,
              speaking: t.speaking,
              voiceError: t.voiceError,
              tapToStart: t.tapToStart,
              listeningForVoice: t.listeningForVoice,
              processingRequest: t.processingRequest,
              jarvisSpeaking: t.jarvisSpeaking,
              voiceErrorOccurred: t.voiceErrorOccurred,
              transcription: t.transcription,
              typeInstead: t.typeInstead,
              hideTextInput: t.hideTextInput,
              typeMessage: t.typeMessage,
              conversationHistory: t.conversationHistory,
              uploadAudio: t.uploadAudio,
              selectVoice: t.selectVoice,
              speed: t.speed,
              volume: t.volume,
            }}
            language={language}
          />
        );
      case 'slides':
        return (
          <SlidesView
            initialTopic={navigationData?.topic}
            translations={{
              slidesBuilder: t.slidesBuilder,
              aiPresentationCreator: t.aiPresentationCreator,
              live: t.live,
              topic: t.topic,
              slides: t.slides,
              style: t.style,
              buildPresentation: t.buildPresentation,
              buildingPresentation: t.buildingPresentation,
              generated: t.generated,
              noPresentationsYet: t.noPresentationsYet,
              noPresentationsSub: t.noPresentationsSub,
              preview: t.preview,
              export: t.export,
              copyAll: t.copyAll,
              copied: t.copied,
              speakerNotes: t.speakerNotes,
              slidesGenerated: t.slidesGenerated,
            }}
            language={language}
          />
        );
      case 'gallery':
        return (
          <GalleryView
            translations={{
              mediaGallery: t.mediaGallery,
              itemsTotal: t.itemsTotal,
              newest: t.newest,
              oldest: t.oldest,
              searchPrompt: t.searchPrompt,
              selected: t.selected,
              deleteSelected: t.deleteSelected,
              yourGalleryEmpty: t.yourGalleryEmpty,
              yourGallerySub: t.yourGallerySub,
              noImagesYet: t.noImagesYet,
              noImagesSub: t.noImagesSub,
              noVideosYet: t.noVideosYet,
              noVideosSub: t.noVideosSub,
              noPresentationsYet: t.noPresentationsYet,
              noPresentationsSub: t.noPresentationsSub,
              download: t.download,
              delete: t.delete,
              png: t.png,
              jpg: t.jpg,
              webp: t.webp,
              mp4: t.mp4,
              webm: t.webm,
              mov: t.mov,
            }}
            language={language}
          />
        );
      case 'settings':
        return (
          <SettingsView
            translations={{
              systemConfig: t.systemConfig,
              jarvisConfigurationPanel: t.jarvisConfigurationPanel,
              profile: t.profile,
              aiConfiguration: t.aiConfiguration,
              voiceConfiguration: t.voiceConfiguration,
              mediaDefaults: t.mediaDefaults,
              display: t.display,
              systemInfo: t.systemInfo,
              dataManagement: t.dataManagement,
              aboutJarvis: t.aboutJarvis,
              aboutJarvisText: t.aboutJarvisText,
              poweredByZAI: t.poweredByZAI,
              version: t.version,
              sdkStatus: t.sdkStatus,
              connected: t.connected,
              storageUsed: t.storageUsed,
              defaultLanguage: t.defaultLanguage,
              english: t.english,
              arabic: t.arabic,
              responseStyle: t.responseStyle,
              concise: t.concise,
              detailed: t.detailed,
              creative: t.creative,
              autoSpeakResponses: t.autoSpeakResponses,
              imageQuality: t.imageQuality,
              standard: t.standard,
              hd: t.hd,
              defaultImageSize: t.defaultImageSize,
              defaultVideoDuration: t.defaultVideoDuration,
              speed: t.speed,
              volume: t.volume,
              selectVoice: t.selectVoice,
              image: t.image,
              video: t.video,
              particleEffects: t.particleEffects,
              animations: t.animations,
              compactMode: t.compactMode,
              darkMode: t.darkMode,
              clearChat: t.clearChat,
              clearGallery: t.clearGallery,
              exportSettings: t.exportSettings,
              resetAll: t.resetAll,
              online: t.online,
              busy: t.busy,
              away: t.away,
            }}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--jarvis-bg)' }}>
      {/* Background Effects */}
      <BackgroundEffects />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 flex-col items-center py-4 z-30" style={{ background: 'rgba(8, 14, 30, 0.95)', borderRight: '1px solid #0e1a3a' }}>
        {/* Logo */}
        <div className="mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #00e5ff20, #7c5cff20)', border: '1px solid #00e5ff30' }}>
            <Sparkles size={20} style={{ color: '#00e5ff' }} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {NAV_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  background: isActive ? `${tab.color}15` : 'transparent',
                  border: `1px solid ${isActive ? `${tab.color}30` : 'transparent'}`,
                  boxShadow: isActive ? `0 0 15px ${tab.color}20` : 'none',
                }}
                title={t[tab.id === 'chat' ? 'aiChat' : tab.id === 'photo' ? 'photoStudio' : tab.id === 'video' ? 'videoEngine' : tab.id === 'voice' ? 'voiceAssistant' : tab.id === 'slides' ? 'slidesBuilder' : tab.id === 'gallery' ? 'mediaGallery' : 'settings']}
              >
                <Icon size={18} style={{ color: isActive ? tab.color : '#90a8cc' }} />
              </button>
            );
          })}
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => handleLanguageChange(language === 'en' ? 'ar' : 'en')}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 mb-2"
          style={{ background: 'rgba(0, 229, 255, 0.06)', border: '1px solid rgba(0, 229, 255, 0.12)' }}
          title={language === 'en' ? 'العربية' : 'English'}
        >
          <span className="text-[10px] font-bold" style={{ color: '#00e5ff' }}>
            {language === 'en' ? 'AR' : 'EN'}
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-16 flex flex-col relative z-10">
        {/* Mobile Top Bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-30" style={{ background: 'rgba(8, 14, 30, 0.95)', borderBottom: '1px solid #0e1a3a', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #00e5ff20, #7c5cff20)', border: '1px solid #00e5ff30' }}>
              <Sparkles size={16} style={{ color: '#00e5ff' }} />
            </div>
            <span className="text-[12px] font-bold tracking-widest uppercase jarvis-text-shimmer">JARVIS</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLanguageChange(language === 'en' ? 'ar' : 'en')}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              style={{ background: 'rgba(0, 229, 255, 0.06)', border: '1px solid rgba(0, 229, 255, 0.12)' }}
            >
              <span className="text-[9px] font-bold" style={{ color: '#00e5ff' }}>
                {language === 'en' ? 'AR' : 'EN'}
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              style={{ background: 'rgba(0, 229, 255, 0.06)', border: '1px solid rgba(0, 229, 255, 0.12)' }}
            >
              {isMobileMenuOpen ? <X size={18} style={{ color: '#00e5ff' }} /> : <Menu size={18} style={{ color: '#00e5ff' }} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-[52px] left-0 right-0 z-30 p-3 jarvis-animate-fade-in" style={{ background: 'rgba(8, 14, 30, 0.98)', borderBottom: '1px solid #0e1a3a', backdropFilter: 'blur(20px)' }}>
            <div className="grid grid-cols-4 gap-2">
              {NAV_TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                    style={{
                      background: isActive ? `${tab.color}10` : 'transparent',
                      border: `1px solid ${isActive ? `${tab.color}25` : 'transparent'}`,
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? tab.color : '#90a8cc' }} />
                    <span className="text-[8px] uppercase tracking-wider" style={{ color: isActive ? tab.color : '#90a8cc' }}>
                      {tab.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* View Content */}
        <div className="flex-1 flex flex-col mt-[52px] md:mt-0">
          {renderView()}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 z-30 jarvis-bottom-nav" style={{ background: 'rgba(8, 14, 30, 0.95)', borderTop: '1px solid #0e1a3a', backdropFilter: 'blur(20px)' }}>
        {NAV_TABS.slice(0, 5).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all"
              style={{ background: isActive ? `${tab.color}08` : 'transparent' }}
            >
              <Icon size={20} style={{ color: isActive ? tab.color : '#90a8cc' }} />
              <span className="text-[8px] uppercase tracking-wider" style={{ color: isActive ? tab.color : '#90a8cc' }}>
                {tab.id === 'chat' ? 'Chat' : tab.id === 'photo' ? 'Photo' : tab.id === 'video' ? 'Video' : tab.id === 'voice' ? 'Voice' : 'Slides'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
