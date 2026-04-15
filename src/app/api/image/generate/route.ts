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

    // Use ZAI Image Generation
    const imageResponse = await zai.image.generate({
      prompt: `${prompt}, ${style} style`,
      size: aspectRatio === '16:9' ? '1024x576' : aspectRatio === '1:1' ? '1024x1024' : '576x1024',
    });

    const imageData = imageResponse.data?.[0];
    
    if (imageData?.url) {
      // Fetch the image and convert to base64
      const imageFetch = await fetch(imageData.url);
      const imageBuffer = await imageFetch.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      
      return new Response(JSON.stringify({ 
        image: `data:image/png;base64,${base64}`,
        prompt,
        style
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // Fallback if no URL
    return new Response(JSON.stringify({ 
      error: "Failed to generate image",
      prompt,
      style
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[Image Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate image";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
