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

    const zai = await getZAI();

    // Use ZAI TTS
    const ttsResponse = await zai.tts.generate({
      text: text.slice(0, 1000), // Limit text length
      voice: voice as any,
      speed,
    });

    if (ttsResponse.audio) {
      // The audio is already base64 encoded
      const audioData = ttsResponse.audio;
      
      return new Response(Buffer.from(audioData, 'base64'), {
        status: 200,
        headers: { 
          "Content-Type": "audio/wav",
        }
      });
    }

    return new Response(JSON.stringify({ error: "Failed to generate audio" }), { status: 500, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[TTS] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate audio";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
