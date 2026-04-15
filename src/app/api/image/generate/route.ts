import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size = '1024x1024', style = 'realistic' } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Build enhanced prompt with style
    const styleMap: Record<string, string> = {
      realistic: 'photorealistic, highly detailed, professional photography',
      artistic: 'artistic, creative, expressive, fine art style',
      cinematic: 'cinematic, dramatic lighting, movie scene, epic composition',
      anime: 'anime style, manga art, vibrant colors, Japanese animation',
      '3d render': '3D render, CGI, octane render, unreal engine, highly detailed',
      watercolor: 'watercolor painting, soft colors, artistic, fluid',
      'oil painting': 'oil painting, classical art, rich colors, textured brushstrokes',
      'digital art': 'digital art, modern illustration, vibrant, detailed',
      sketch: 'pencil sketch, hand drawn, artistic, detailed linework',
      'pixel art': 'pixel art, retro game style, 8-bit, nostalgic',
    };

    const styleEnhancement = styleMap[style.toLowerCase()] || styleMap.realistic;
    const enhancedPrompt = `${prompt}, ${styleEnhancement}, high quality, detailed`;

    const zai = await ZAI.create();

    const response = await zai.images.generations.create({
      prompt: enhancedPrompt,
      size: size,
    });

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Invalid response from image generation API');
    }

    const imageBase64 = response.data[0].base64;

    return NextResponse.json({
      success: true,
      image: imageBase64,
      prompt: prompt,
      size: size,
      style: style,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Image Generate] Error:', error);
    const message = error instanceof Error ? error.message : 'Image generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
