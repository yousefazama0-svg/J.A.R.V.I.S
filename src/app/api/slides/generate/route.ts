import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface Slide {
  title: string;
  content: string;
  layout: string;
  notes: string;
}

const LAYOUTS = ['title-slide', 'content', 'two-column', 'image', 'quote', 'blank'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, slideCount = 8, style = 'professional', language = 'en' } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Build system prompt for presentation generation
    const systemPrompt = language === 'ar' 
      ? `أنت خبير في إنشاء العروض التقديمية الاحترافية. قم بإنشاء عرض تقديمي عن الموضوع المحدد. يجب أن تكون الإجابة بتنسيق JSON فقط بدون أي نص إضافي. كل شريحة يجب أن تحتوي على عنوان (title) ومحتوى (content) وتخطيط (layout) وملاحظات المتحدث (notes). الأنماط المتاحة: ${LAYOUTS.join(', ')}.`
      : `You are an expert presentation creator. Create a professional presentation about the given topic. Respond with valid JSON only, no additional text. Each slide must have title, content, layout, and notes fields. Available layouts: ${LAYOUTS.join(', ')}. Style: ${style}.`;

    const userPrompt = language === 'ar'
      ? `أنشئ عرضًا تقديميًا من ${slideCount} شريحة عن: ${topic}. أعد الإجابة كمصفوفة JSON تسمى slides. كل كائن شريحة يجب أن يحتوي على: title (عنوان قصير)، content (نقاط المحتوى مفصولة بأسطر جديدة)، layout (نوع التخطيط)، notes (ملاحظات المتحدث).`
      : `Create a ${slideCount}-slide presentation about: ${topic}. Return as JSON array named "slides". Each slide object should have: title (short heading), content (bullet points separated by newlines), layout (one of: ${LAYOUTS.join(', ')}), notes (speaker notes for the presenter). Style: ${style}.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const responseText = completion.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    let slides: Slide[] = [];
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        slides = JSON.parse(jsonMatch[0]);
      } else {
        const jsonObjectMatch = responseText.match(/\{[\s\S]*"slides"[\s\S]*\}/);
        if (jsonObjectMatch) {
          const parsed = JSON.parse(jsonObjectMatch[0]);
          slides = parsed.slides || [];
        }
      }
    } catch {
      // If parsing fails, create default slides
      slides = generateDefaultSlides(topic, slideCount, language);
    }

    // Validate and fix slides
    slides = slides.slice(0, slideCount).map((slide, index) => ({
      title: slide.title || (language === 'ar' ? `شريحة ${index + 1}` : `Slide ${index + 1}`),
      content: slide.content || (language === 'ar' ? 'محتوى الشريحة' : 'Slide content'),
      layout: LAYOUTS.includes(slide.layout) ? slide.layout : (index === 0 ? 'title-slide' : 'content'),
      notes: slide.notes || '',
    }));

    // Ensure we have the requested number of slides
    while (slides.length < slideCount) {
      const index = slides.length;
      slides.push({
        title: language === 'ar' ? `شريحة ${index + 1}` : `Slide ${index + 1}`,
        content: language === 'ar' ? 'محتوى إضافي' : 'Additional content',
        layout: 'content',
        notes: '',
      });
    }

    return NextResponse.json({
      success: true,
      slides: slides,
      topic: topic,
      style: style,
      slideCount: slides.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Slides Generate] Error:', error);
    const message = error instanceof Error ? error.message : 'Presentation generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateDefaultSlides(topic: string, count: number, language: string): Slide[] {
  const isArabic = language === 'ar';
  const slides: Slide[] = [
    {
      title: topic,
      content: isArabic ? `مرحباً بكم في عرض ${topic}` : `Welcome to the ${topic} presentation`,
      layout: 'title-slide',
      notes: isArabic ? 'مقدمة العرض' : 'Introduction to the presentation',
    },
    {
      title: isArabic ? 'نظرة عامة' : 'Overview',
      content: isArabic 
        ? '• مقدمة\n• النقاط الرئيسية\n• التفاصيل\n• الخلاصة'
        : '• Introduction\n• Key Points\n• Details\n• Conclusion',
      layout: 'content',
      notes: isArabic ? 'نظرة عامة على محتوى العرض' : 'Overview of presentation content',
    },
    {
      title: isArabic ? 'النقاط الرئيسية' : 'Key Points',
      content: isArabic 
        ? '• النقطة الأولى\n• النقطة الثانية\n• النقطة الثالثة'
        : '• First key point\n• Second key point\n• Third key point',
      layout: 'two-column',
      notes: isArabic ? 'مناقشة النقاط الرئيسية' : 'Discuss the key points',
    },
    {
      title: isArabic ? 'التفاصيل' : 'Details',
      content: isArabic 
        ? 'المزيد من المعلومات التفصيلية حول الموضوع'
        : 'More detailed information about the topic',
      layout: 'content',
      notes: isArabic ? 'شرح التفاصيل' : 'Explain the details',
    },
    {
      title: isArabic ? 'الخلاصة' : 'Conclusion',
      content: isArabic 
        ? 'شكراً لاهتمامكم\nهل لديكم أسئلة؟'
        : 'Thank you for your attention\nQuestions?',
      layout: 'title-slide',
      notes: isArabic ? 'اختتام العرض' : 'Wrap up the presentation',
    },
  ];

  // Add more slides if needed
  while (slides.length < count) {
    slides.push({
      title: isArabic ? `شريحة إضافية ${slides.length}` : `Additional Slide ${slides.length}`,
      content: isArabic ? 'محتوى الشريحة' : 'Slide content',
      layout: 'content',
      notes: '',
    });
  }

  return slides.slice(0, count);
}
