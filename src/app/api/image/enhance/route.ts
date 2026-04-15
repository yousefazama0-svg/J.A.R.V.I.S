import { NextRequest } from "next/server";
import groq, { GROQ_MODELS } from "@/lib/groq";

interface EnhanceRequest {
  prompt: string;
  style: string;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhanceRequest = await request.json();
    const { prompt, style, language } = body;

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Use Groq to enhance the prompt
    const systemPrompt = `You are an expert at enhancing image prompts for AI image generation.
Given a basic prompt, enhance it with details about:
- Composition and framing
- Lighting and atmosphere
- Style and artistic elements
- Color palette
- Mood and emotion

Return ONLY the enhanced prompt, nothing else.`;

    const userPrompt = language === 'ar'
      ? `حسّن هذا الوصف لإنشاء صورة بأسلوب ${style}: "${prompt}"`
      : `Enhance this prompt for ${style} style image generation: "${prompt}"`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODELS.fast,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const enhancedPrompt = completion.choices?.[0]?.message?.content || prompt;

    return new Response(JSON.stringify({ 
      original: prompt,
      enhanced: enhancedPrompt,
      style 
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[Image Enhance] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to enhance prompt";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
