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
  Globe,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';

// Import all view components
import HomeView from '@/components/jarvis/HomeView';
import ChatView from '@/components/jarvis/ChatView';
import PhotoView from '@/components/jarvis/PhotoView';
import VideoView from '@/components/jarvis/VideoView';
import VoiceView from '@/components/jarvis/VoiceView';
import SlidesView from '@/components/jarvis/SlidesView';
import GalleryView from '@/components/jarvis/GalleryView';
import SettingsView from '@/components/jarvis/SettingsView';
import BackgroundEffects from '@/components/jarvis/BackgroundEffects';
import BottomNav, { TabId } from '@/components/jarvis/BottomNav';
import ArcReactorLogo from '@/components/jarvis/ArcReactorLogo';
import LoginView from '@/components/jarvis/LoginView';

type Tab = TabId;
type Language = 'en' | 'ar';

interface UserProfile {
  name: string;
  email: string;
}

// Translation system
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: 'Home',
    chat: 'Chat',
    photo: 'Photo',
    video: 'Video',
    voice: 'Voice',
    slides: 'Slides',
    gallery: 'Gallery',
    settings: 'Settings',
    aiChat: 'AI Chat',
    photoStudio: 'Photo Studio',
    videoEngine: 'Video Engine',
    voiceAssistant: 'Voice',
    slidesBuilder: 'Slides',
    mediaGallery: 'Gallery',

    // Header
    system: 'System',
    online: 'Online',
    live: 'LIVE',
    
    // Auth
    welcomeBack: 'Welcome Back',
    loginToContinue: 'Sign in to continue to JARVIS',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    name: 'Name',
    createAccount: 'Create Account',
    orContinueAs: 'or continue as',
    guest: 'Guest',
    loggingIn: 'Signing in...',
    loginSuccess: 'Login successful!',
    loginError: 'Invalid credentials. Please try again.',
    forgotPassword: 'Forgot password?',
    
    // Home
    welcomeToJarvis: 'Welcome to JARVIS',
    welcomeSub: 'Your AI-powered creative assistant',
    quickActions: 'Quick Actions',
    systemStatus: 'System Status',
    capabilities: 'Capabilities',
    
    // Chat
    messages: 'messages',
    exportChat: 'Export Chat',
    clearChat: 'Clear Chat',
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
    busy: 'Busy',
    away: 'Away',
    image: 'Image',
    video: 'Video',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    chat: 'محادثة',
    photo: 'صور',
    video: 'فيديو',
    voice: 'صوت',
    slides: 'عروض',
    gallery: 'معرض',
    settings: 'إعدادات',
    aiChat: 'المحادثة',
    photoStudio: 'الصور',
    videoEngine: 'الفيديو',
    voiceAssistant: 'الصوت',
    slidesBuilder: 'العروض',
    mediaGallery: 'المعرض',

    // Header
    system: 'النظام',
    online: 'متصل',
    live: 'مباشر',
    
    // Auth
    welcomeBack: 'مرحباً بعودتك',
    loginToContinue: 'سجل الدخول للمتابعة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'لديك حساب بالفعل؟',
    name: 'الاسم',
    createAccount: 'إنشاء حساب',
    orContinueAs: 'أو المتابعة كـ',
    guest: 'زائر',
    loggingIn: 'جارٍ تسجيل الدخول...',
    loginSuccess: 'تم تسجيل الدخول بنجاح!',
    loginError: 'بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.',
    forgotPassword: 'نسيت كلمة المرور؟',
    
    // Home
    welcomeToJarvis: 'مرحباً بك في JARVIS',
    welcomeSub: 'مساعدك الإبداعي المدعوم بالذكاء الاصطناعي',
    quickActions: 'إجراءات سريعة',
    systemStatus: 'حالة النظام',
    capabilities: 'القدرات',
    
    // Chat
    messages: 'رسائل',
    exportChat: 'تصدير المحادثة',
    clearChat: 'مسح المحادثة',
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
    busy: 'مشغول',
    away: 'بعيد',
    image: 'صورة',
    video: 'فيديو',
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [prevTab, setPrevTab] = useState<Tab>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Initialize language from localStorage
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      const saved = localStorage.getItem('jarvis-language');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch { /* ignore */ }
    return 'en';
  });
  
  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('jarvis-user');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [navigationData, setNavigationData] = useState<{ prompt?: string; topic?: string } | undefined>();

  const t = TRANSLATIONS[language];

  // Save language preference
  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('jarvis-language', lang);
    } catch { /* ignore */ }
  }, []);

  // Handle login
  const handleLogin = useCallback((profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem('jarvis-user', JSON.stringify(profile));
    } catch { /* ignore */ }
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    setUser(null);
    setShowUserMenu(false);
    try {
      localStorage.removeItem('jarvis-user');
    } catch { /* ignore */ }
  }, []);

  // Handle navigation with data
  const handleNavigate = useCallback((tab: string, data?: { prompt?: string; topic?: string }) => {
    setPrevTab(activeTab);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveTab(tab as Tab);
      setNavigationData(data);
      setIsTransitioning(false);
    }, 150);
  }, [activeTab]);

  // Handle tab change with animation
  const handleTabChange = useCallback((tab: Tab) => {
    if (tab === activeTab) return;
    setPrevTab(activeTab);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150);
  }, [activeTab]);

  // Clear navigation data after use
  useEffect(() => {
    if (navigationData) {
      const timer = setTimeout(() => setNavigationData(undefined), 500);
      return () => clearTimeout(timer);
    }
  }, [navigationData]);

  // Render current view
  const renderView = () => {
    const viewClass = `flex-1 flex flex-col ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} transition-all duration-300 ease-out`;

    switch (activeTab) {
      case 'home':
        return (
          <div className={viewClass}>
            <HomeView
              onNavigate={handleNavigate}
              translations={{
                welcomeToJarvis: t.welcomeToJarvis,
                welcomeSub: t.welcomeSub,
                aiChat: t.aiChat,
                photoStudio: t.photoStudio,
                videoEngine: t.videoEngine,
                voiceAssistant: t.voiceAssistant,
                slidesBuilder: t.slidesBuilder,
                mediaGallery: t.mediaGallery,
                settings: t.settings,
                quickActions: t.quickActions,
                systemStatus: t.systemStatus,
                online: t.online,
                capabilities: t.capabilities,
              }}
              language={language}
            />
          </div>
        );
      case 'chat':
        return (
          <div className={viewClass}>
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
          </div>
        );
      case 'photo':
        return (
          <div className={viewClass}>
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
          </div>
        );
      case 'video':
        return (
          <div className={viewClass}>
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
          </div>
        );
      case 'voice':
        return (
          <div className={viewClass}>
            <VoiceView
              translations={{
                voiceAssistant: t.voiceAssistant,
                naturalLanguageSpeech: t.naturalLanguageSpeech,
                live: t.live,
                ready: t.ready,
                listening: t.listening,
                thinking: t.thinking,
                speaking: t.jarvisSpeaking,
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
          </div>
        );
      case 'slides':
        return (
          <div className={viewClass}>
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
          </div>
        );
      case 'gallery':
        return (
          <div className={viewClass}>
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
          </div>
        );
      case 'settings':
        return (
          <div className={viewClass}>
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--jarvis-bg)' }}>
      {/* Background Effects */}
      <BackgroundEffects />
      
      {/* Top Bar */}
      <header 
        className="fixed top-0 left-0 right-0 z-40 h-[52px] flex items-center justify-between px-4"
        style={{ 
          background: 'rgba(6, 10, 20, 0.95)', 
          borderBottom: '1px solid rgba(0, 229, 255, 0.1)', 
          backdropFilter: 'blur(24px)' 
        }}
      >
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <ArcReactorLogo size={32} />
          <div>
            <span className="jarvis-text-shimmer text-sm font-black tracking-[0.15em]">J.A.R.V.I.S</span>
            <p className="text-[7px] tracking-widest uppercase hidden sm:block" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>
              {language === 'ar' ? 'نظام ذكاء اصطناعي' : 'AI System'}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => handleLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-[#0e1a3a]/50"
            style={{ border: '1px solid rgba(0, 229, 255, 0.1)' }}
          >
            <Globe size={14} style={{ color: '#00e5ff' }} />
            <span className="text-[10px] tracking-widest uppercase font-medium" style={{ color: '#90a8cc' }}>
              {language === 'en' ? 'EN' : 'AR'}
            </span>
          </button>

          {/* User Menu or Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:bg-[#0e1a3a]/50"
                style={{ border: '1px solid rgba(0, 229, 255, 0.1)' }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00e5ff20, #7c5cff20)', border: '1px solid rgba(0, 229, 255, 0.2)' }}
                >
                  <User size={12} style={{ color: '#00e5ff' }} />
                </div>
                <span className="text-[10px] tracking-wider font-medium hidden sm:block" style={{ color: '#d0e4f8' }}>
                  {user.name}
                </span>
              </button>
              
              {/* Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute top-full right-0 mt-2 w-48 rounded-xl overflow-hidden jarvis-animate-fade-in"
                  style={{ background: '#080e1e', border: '1px solid #0e1a3a', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}
                >
                  <div className="p-3" style={{ borderBottom: '1px solid #0e1a3a' }}>
                    <p className="text-[11px] font-medium" style={{ color: '#d0e4f8' }}>{user.name}</p>
                    <p className="text-[9px]" style={{ color: 'rgba(144, 168, 204, 0.5)' }}>{user.email}</p>
                  </div>
                  <button
                    onClick={() => { handleNavigate('settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-[#0e1a3a]/50"
                  >
                    <Settings size={14} style={{ color: '#90a8cc' }} />
                    <span className="text-[11px]" style={{ color: '#90a8cc' }}>{t.settings}</span>
                    <ChevronRight size={12} className="ml-auto" style={{ color: 'rgba(144, 168, 204, 0.3)' }} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-[#0e1a3a]/50"
                    style={{ borderTop: '1px solid #0e1a3a' }}
                  >
                    <LogOut size={14} style={{ color: '#ef4444' }} />
                    <span className="text-[11px]" style={{ color: '#ef4444' }}>
                      {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all"
              style={{ 
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(124, 92, 255, 0.15))', 
                border: '1px solid rgba(0, 229, 255, 0.2)' 
              }}
            >
              <User size={14} style={{ color: '#00e5ff' }} />
              <span className="text-[10px] tracking-wider font-medium" style={{ color: '#00e5ff' }}>
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-[52px] pb-[72px] relative z-10">
        {renderView()}
      </div>

      {/* Bottom Navigation - For ALL devices */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        translations={{
          home: t.home,
          chat: t.chat,
          voice: t.voice,
          photo: t.photo,
          video: t.video,
          slides: t.slides,
          gallery: t.gallery,
          settings: t.settings,
        }}
      />

      {/* Login Modal */}
      <LoginView
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        language={language}
        translations={{
          welcomeBack: t.welcomeBack,
          loginToContinue: t.loginToContinue,
          email: t.email,
          password: t.password,
          signIn: t.signIn,
          signUp: t.signUp,
          noAccount: t.noAccount,
          hasAccount: t.hasAccount,
          name: t.name,
          createAccount: t.createAccount,
          orContinueAs: t.orContinueAs,
          guest: t.guest,
          loggingIn: t.loggingIn,
          loginSuccess: t.loginSuccess,
          loginError: t.loginError,
          forgotPassword: t.forgotPassword,
        }}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
}
