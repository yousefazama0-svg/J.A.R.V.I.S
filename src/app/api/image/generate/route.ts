import { NextRequest } from "next/server";

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

    // Map aspect ratios to dimensions
    const sizeMap: Record<string, { width: number; height: number }> = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1344, height: 768 },
      '9:16': { width: 768, height: 1344 },
      '4:3': { width: 1152, height: 864 },
      '3:4': { width: 864, height: 1152 },
    };

    const { width, height } = sizeMap[aspectRatio] || { width: 1024, height: 1024 };

    // Build the full prompt
    const fullPrompt = `${prompt}, ${style} style, high quality, detailed, professional`;
    
    // Using Pollinations.ai - Free image generation, no API key needed!
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true`;

    // For the response, we'll return the URL directly
    // The client will fetch and display it
    return new Response(JSON.stringify({ 
      image: imageUrl,
      prompt,
      style,
      size: `${width}x${height}`,
      provider: "Pollinations.ai"
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error) {
    console.error("[Image Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate image";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
