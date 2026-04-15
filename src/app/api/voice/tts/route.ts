import { NextRequest } from "next/server";

interface TTSRequest {
  text: string;
  voice?: string;
  speed?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: TTSRequest = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // TTS requires a TTS service. Options include:
    // - ElevenLabs
    // - OpenAI TTS
    // - Google Cloud TTS
    // - Amazon Polly
    
    // Return guidance for now
    return new Response(JSON.stringify({ 
      error: "TTS service not configured. Please add a TTS API key (ElevenLabs, OpenAI, etc.) in Vercel Environment Variables.",
      text: text.slice(0, 100),
      providers: ["ElevenLabs", "OpenAI TTS", "Google Cloud TTS", "Amazon Polly"]
    }), { 
      status: 501, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("[TTS] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate audio";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
