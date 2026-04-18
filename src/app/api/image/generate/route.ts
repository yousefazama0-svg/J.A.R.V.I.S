import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

// Set max duration for this API route
export const maxDuration = 300; // 5 minutes

interface GenerateRequest {
  prompt: string;
  style: string;
  size: string;
  language?: string;
}

// Map sizes to supported formats
const SIZE_MAP: Record<string, string> = {
  '1024x1024': '1024x1024',
  '1344x768': '1344x768',
  '768x1344': '768x1344',
  '1152x864': '1152x864',
  '864x1152': '864x1152',
  '1440x720': '1344x768',
  '720x1440': '768x1344',
  '1920x1080': '1344x768',
  '1080x1920': '768x1344',
  '1536x1024': '1024x1024',
  '1024x1536': '1024x1024',
  '1792x1024': '1344x768',
  '1024x1792': '768x1344',
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, style, size: requestedSize } = body;

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const zai = await getZAI();
    const size = SIZE_MAP[requestedSize] || '1024x1024';

    // Enhanced prompt for better quality
    const enhancedPrompt = `${prompt}, ${style?.toLowerCase() || 'realistic'} style, ultra high quality, highly detailed, professional photography, sharp focus, beautiful lighting`;

    console.log("[Image Generate] Starting generation for:", prompt.substring(0, 50));

    const imageResponse = await zai.images.generations.create({
      prompt: enhancedPrompt,
      size: size as any,
    });

    const imageData = imageResponse.data?.[0];
    const base64Image = imageData?.base64;
    
    if (base64Image) {
      console.log("[Image Generate] Successfully generated image");
      return new Response(JSON.stringify({ 
        image: base64Image,
        prompt,
        style: style || 'Realistic',
        size: requestedSize || '1024x1024'
      }), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    console.error("[Image Generate] No image data in response");
    return new Response(JSON.stringify({ 
      error: "Failed to generate image - no data returned" 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("[Image Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate image";
    return new Response(JSON.stringify({ error: message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
