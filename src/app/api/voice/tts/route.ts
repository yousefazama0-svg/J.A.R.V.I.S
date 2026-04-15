import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

interface TTSRequest {
  text: string;
  voice?: string;
  speed?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: TTSRequest = await request.json();
    const { text, voice = "tongtong", speed = 1.0 } = body;

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Limit text to 1024 characters
    const limitedText = text.slice(0, 1000);

    const zai = await getZAI();

    // Use ZAI TTS
    const response = await zai.audio.tts.create({
      input: limitedText,
      voice: voice as any,
      speed: Math.max(0.5, Math.min(2.0, speed)),
      response_format: 'wav',
      stream: false
    });

    // Get array buffer from Response object
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    return new Response(buffer, {
      status: 200,
      headers: { 
        "Content-Type": "audio/wav",
        "Content-Length": buffer.length.toString()
      }
    });
  } catch (error) {
    console.error("[TTS] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate audio";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
