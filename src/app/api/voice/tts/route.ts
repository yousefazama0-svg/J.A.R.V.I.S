import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice = 'tongtong', speed = 1.0 } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate and constrain speed to API limits (0.5 - 2.0)
    const constrainedSpeed = Math.max(0.5, Math.min(2.0, parseFloat(speed) || 1.0));

    // Limit text length to 1024 characters (API limit)
    const truncatedText = text.slice(0, 1000);

    const zai = await ZAI.create();

    const response = await zai.audio.tts.create({
      input: truncatedText,
      voice: voice,
      speed: constrainedSpeed,
      response_format: 'wav',
      stream: false,
    });

    // Get array buffer from Response object
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[TTS] Error:', error);
    const message = error instanceof Error ? error.message : 'Text-to-speech conversion failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
