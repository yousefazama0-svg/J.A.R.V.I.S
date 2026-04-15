import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

interface Slide {
  title: string;
  content: string;
  layout: string;
  notes: string;
}

interface GenerateRequest {
  topic: string;
  slideCount: number;
  style: string;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { topic, slideCount, style, language } = body;

    if (!topic?.trim()) {
      return new Response(JSON.stringify({ error: "Topic is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const zai = await getZAI();

    const systemPrompt = `You are an expert presentation designer. Create engaging, well-structured slides.
Return ONLY valid JSON array of slides, no markdown formatting.`;

    const userPrompt = language === 'ar' 
      ? `أنشئ عرض تقديمي عن "${topic}" يتكون من ${slideCount} شريحة بأسلوب ${style}.

أعد فقط مصفوفة JSON بهذا التنسيق بالضبط:
[
  {
    "title": "عنوان الشريحة",
    "content": "محتوى الشريحة (يمكن استخدام \\n للأسطر الجديدة)",
    "layout": "title-slide | content | two-column | image | quote | blank",
    "notes": "ملاحظات المحاضر"
  }
]

الشريحة الأولى يجب أن تكون title-slide. استخدم المحتوى باللغة العربية.`
      : `Create a presentation about "${topic}" with ${slideCount} slides in ${style} style.

Return ONLY a JSON array in this exact format:
[
  {
    "title": "Slide title",
    "content": "Slide content (use \\n for line breaks)",
    "layout": "title-slide | content | two-column | image | quote | blank",
    "notes": "Speaker notes"
  }
]

First slide should be title-slide. Make it engaging and professional.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    });

    const responseText = completion.choices?.[0]?.message?.content || "[]";
    
    // Extract JSON from response
    let slides: Slide[] = [];
    try {
      slides = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        slides = JSON.parse(jsonMatch[1]);
      } else {
        const arrayMatch = responseText.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          slides = JSON.parse(arrayMatch[0]);
        }
      }
    }

    if (!Array.isArray(slides) || slides.length === 0) {
      throw new Error("Failed to generate valid slides");
    }

    return new Response(JSON.stringify({ slides }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[Slides Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate slides";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
