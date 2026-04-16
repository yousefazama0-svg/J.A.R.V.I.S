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
    const { image, quality = 'high', options } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: "Image is required" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const zai = await getZAI();

    // Build enhancement prompt based on quality and options
    const qualityDescriptions = {
      medium: 'moderately enhanced, balanced improvements, good lighting',
      high: 'highly enhanced, professional photography quality, crisp details, perfect lighting',
      ultra: 'ultra high quality, masterpiece, stunning detail, award-winning photography, 8k resolution'
    };

    const enhancementInstructions: string[] = [];
    
    if (options) {
      if (options.brightness && options.brightness !== 100) {
        const level = options.brightness > 100 ? 'brighter lighting, well-lit' : 'dramatic moody lighting, shadows';
        enhancementInstructions.push(level);
      }
      if (options.contrast && options.contrast !== 100) {
        const level = options.contrast > 100 ? 'high contrast, bold tones, dramatic' : 'soft contrast, gentle tones, smooth';
        enhancementInstructions.push(level);
      }
      if (options.saturation && options.saturation !== 100) {
        const level = options.saturation > 100 ? 'vibrant saturated colors, vivid' : 'muted subtle colors, pastel tones';
        enhancementInstructions.push(level);
      }
      if (options.sharpness && options.sharpness > 100) {
        enhancementInstructions.push('razor sharp details, crystal clear');
      }
      if (options.denoise && options.denoise > 0) {
        enhancementInstructions.push('clean, smooth, noise-free, pristine');
      }
    }

    const enhancementText = enhancementInstructions.length > 0 
      ? enhancementInstructions.join(', ')
      : qualityDescriptions[quality];

    // Use VLM to describe the image first - handle potential errors
    let imageDescription = 'A beautiful image';
    
    try {
      // Ensure the image URL is properly formatted
      const imageUrl = image.startsWith('data:image') 
        ? image 
        : `data:image/png;base64,${image}`;
      
      const descriptionResponse = await zai.chat.completions.createVision({
        messages: [
          { 
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Describe this image briefly for AI image enhancement. Focus on: subject, scene, colors, and mood. Keep it under 100 words." 
              },
              { 
                type: "image_url", 
                image_url: { url: imageUrl } 
              }
            ]
          }
        ],
        thinking: { type: 'disabled' }
      });

      imageDescription = descriptionResponse.choices?.[0]?.message?.content || imageDescription;
    } catch (vlmError) {
      console.error("[Image Enhance] VLM error, using fallback:", vlmError);
      // Continue with generic description if VLM fails
      imageDescription = 'A professionally captured photograph';
    }

    // Generate enhanced image based on the description
    const enhancePrompt = `${imageDescription}, ${enhancementText}, professional photography, high quality, detailed`;

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
      original_description: imageDescription,
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
