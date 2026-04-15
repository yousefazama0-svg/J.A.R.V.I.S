import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

interface GenerateRequest {
  prompt: string;
  style: string;
  aspectRatio: string;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, style, aspectRatio } = body;

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const zai = await getZAI();

    // Map aspect ratios to supported sizes
    const sizeMap: Record<string, string> = {
      '1:1': '1024x1024',
      '16:9': '1344x768',
      '9:16': '768x1344',
      '4:3': '1152x864',
      '3:4': '864x1152',
    };

    const size = sizeMap[aspectRatio] || '1024x1024';

    // Use ZAI Image Generation
    const imageResponse = await zai.images.generations.create({
      prompt: `${prompt}, ${style} style, high quality, detailed`,
      size: size as any,
    });

    const imageData = imageResponse.data?.[0];
    
    if (imageData?.base64) {
      return new Response(JSON.stringify({ 
        image: `data:image/png;base64,${imageData.base64}`,
        prompt,
        style,
        size
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ 
      error: "Failed to generate image" 
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[Image Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate image";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
