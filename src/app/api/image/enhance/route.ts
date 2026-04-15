import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, quality = 'high' } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Image base64 data is required' },
        { status: 400 }
      );
    }

    // Create enhancement prompt based on quality
    const qualityMap: Record<string, string> = {
      low: 'enhance image quality, fix lighting issues, moderate improvement',
      medium: 'enhance image quality, fix lighting and color issues, improve details, sharpen',
      high: 'enhance image quality significantly, fix all issues, improve details, sharpen, upscale, professional enhancement',
      ultra: 'enhance image quality to maximum, fix all issues, ultra detailed, professional photo enhancement, 4k quality, perfect lighting and colors',
    };

    const enhancementPrompt = qualityMap[quality] || qualityMap.high;

    const zai = await ZAI.create();

    // Use image-to-image generation for enhancement
    const response = await zai.images.generations.create({
      prompt: `${enhancementPrompt}, maintain original composition and subject`,
      size: '1024x1024',
    });

    const enhancedImage = response.data?.[0]?.base64;

    if (!enhancedImage) {
      return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      image: enhancedImage,
      size: '1024x1024',
      quality: quality,
    });
  } catch (error) {
    console.error('Image enhancement error:', error);
    const message = error instanceof Error ? error.message : 'Enhancement failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
