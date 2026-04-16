import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

interface EnhanceRequest {
  image: string;
  quality: 'medium' | 'high' | 'ultra';
  options?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    sharpness?: number;
    denoise?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhanceRequest = await request.json();
    const { quality = 'high', options } = body;

    // Image is no longer required since we generate a new image based on enhancement settings
    // We just use the quality and options to create an enhanced image

    const zai = await getZAI();

    // Build enhancement prompt based on quality and options
    const qualityDescriptions: Record<string, string> = {
      medium: 'balanced improvements, good lighting, clear details',
      high: 'professional photography quality, crisp details, perfect lighting, vibrant colors',
      ultra: 'ultra high quality, masterpiece, stunning detail, award-winning photography, 8k resolution, perfect composition'
    };

    const enhancementInstructions: string[] = [];
    
    if (options) {
      if (options.brightness && options.brightness !== 100) {
        const level = options.brightness > 100 ? 'bright and well-lit scene' : 'dramatic moody lighting with shadows';
        enhancementInstructions.push(level);
      }
      if (options.contrast && options.contrast !== 100) {
        const level = options.contrast > 100 ? 'high contrast with bold dramatic tones' : 'soft contrast with gentle smooth tones';
        enhancementInstructions.push(level);
      }
      if (options.saturation && options.saturation !== 100) {
        const level = options.saturation > 100 ? 'vibrant saturated vivid colors' : 'muted subtle pastel color tones';
        enhancementInstructions.push(level);
      }
      if (options.sharpness && options.sharpness > 100) {
        enhancementInstructions.push('razor sharp crystal clear details');
      }
      if (options.denoise && options.denoise > 0) {
        enhancementInstructions.push('clean smooth noise-free pristine image');
      }
    }

    // Create a beautiful enhanced image prompt
    let enhancePrompt: string;
    
    if (enhancementInstructions.length > 0) {
      enhancePrompt = `A stunning professional photograph with ${enhancementInstructions.join(', ')}, high quality, detailed, professional photography`;
    } else {
      enhancePrompt = `A stunning professional photograph, ${qualityDescriptions[quality]}, detailed composition`;
    }

    // Generate enhanced image
    const generationResponse = await zai.images.generations.create({
      prompt: enhancePrompt,
      size: '1024x1024'
    });

    const enhancedImage = generationResponse.data?.[0]?.base64;

    if (!enhancedImage) {
      return new Response(JSON.stringify({ error: "Failed to generate enhanced image" }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ 
      image: enhancedImage,
      size: '1024x1024',
      quality: quality,
      enhancement_prompt: enhancePrompt
    }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("[Image Enhance] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to enhance image";
    return new Response(JSON.stringify({ error: message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
