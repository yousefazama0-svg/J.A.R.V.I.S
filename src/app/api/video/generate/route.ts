import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration = 10, style = 'cinematic' } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Build style-enhanced prompt
    const styleEnhancements: Record<string, string> = {
      cinematic: 'cinematic, dramatic lighting, movie quality, professional cinematography',
      animation: 'animated, fluid motion, stylized, creative animation',
      realistic: 'photorealistic, natural lighting, lifelike, documentary style',
      abstract: 'abstract, artistic, creative visuals, surreal imagery',
      '3d animation': '3D animated, CGI quality, Pixar style, smooth motion',
      'motion graphics': 'motion graphics, clean design, professional animation',
      'slow motion': 'slow motion, detailed capture, dramatic effect',
      timelapse: 'timelapse, accelerated motion, dynamic progression',
      documentary: 'documentary style, natural, authentic, informative',
      'music video': 'music video style, dynamic cuts, visually stunning, creative',
    };

    const enhancedPrompt = `${prompt}, ${styleEnhancements[style] || styleEnhancements.cinematic}`;

    // Map duration to API-supported values (5 or 10 seconds)
    // For durations > 10, we'll use 10 and note in response
    const apiDuration = duration <= 5 ? 5 : duration <= 10 ? 10 : 10;
    const actualDuration = duration > 10 ? duration : apiDuration;

    // Create video generation task
    const task = await zai.video.generations.create({
      prompt: enhancedPrompt,
      quality: 'quality',
      duration: apiDuration,
      fps: 30,
      size: '1920x1080',
    });

    return NextResponse.json({
      success: true,
      taskId: task.id,
      status: task.task_status,
      prompt: enhancedPrompt,
      requestedDuration: actualDuration,
      apiDuration: apiDuration,
      note: duration > 10 ? 'Long videos require multiple segments' : undefined,
    });
  } catch (error) {
    console.error('Video generation error:', error);
    const message = error instanceof Error ? error.message : 'Video generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
