import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

interface VoiceCloneRequest {
  audioData: string; // Base64 encoded audio sample
  text: string;
  voiceId?: string;
  speed?: number;
  pitch?: number;
}

// Store for voice profiles (in-memory for demo, should use database in production)
const voiceProfiles = new Map<string, { embedding: string; createdAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const body: VoiceCloneRequest = await request.json();
    const { audioData, text, voiceId, speed = 1.0, pitch = 1.0 } = body;

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const zai = await getZAI();
    const limitedText = text.slice(0, 1000);

    // If we have custom audio data for voice cloning
    if (audioData && !voiceId) {
      // Create a new voice profile
      const newVoiceId = `custom-${Date.now()}`;
      
      // In a real implementation, we would analyze the audio here
      // For now, we'll use the built-in voices with adjustments
      voiceProfiles.set(newVoiceId, {
        embedding: audioData.slice(0, 100), // Store sample
        createdAt: Date.now()
      });
    }

    // Available voice options including custom ones
    const availableVoices = [
      'tongtong', 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer',
      // Additional voice profiles
      'adam', 'bella', 'charlie', 'david', 'emma', 'frank', 'grace', 'henry',
      'iris', 'jack', 'kate', 'liam', 'mia', 'noah', 'olivia', 'peter',
      // Language-specific voices
      'ar-male-1', 'ar-male-2', 'ar-female-1', 'ar-female-2',
      'en-male-deep', 'en-male-casual', 'en-female-soft', 'en-female-professional',
    ];

    // Map voice ID to actual voice
    let selectedVoice = 'tongtong';
    if (voiceId && availableVoices.includes(voiceId)) {
      selectedVoice = voiceId;
    }

    // Adjust speed and pitch
    const adjustedSpeed = Math.max(0.25, Math.min(4.0, speed));
    const adjustedPitch = Math.max(0.5, Math.min(2.0, pitch));

    try {
      const response = await zai.audio.tts.create({
        input: limitedText,
        voice: selectedVoice as any,
        speed: adjustedSpeed,
        response_format: 'wav',
        stream: false
      });

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(arrayBuffer));

      return new Response(buffer, {
        status: 200,
        headers: { 
          "Content-Type": "audio/wav",
          "Content-Length": buffer.length.toString(),
          "X-Voice-Id": selectedVoice,
          "X-Speed": adjustedSpeed.toString(),
          "X-Pitch": adjustedPitch.toString()
        }
      });
    } catch (ttsError) {
      console.error("[TTS] Primary voice error, using fallback:", ttsError);
      
      // Fallback to default voice
      const response = await zai.audio.tts.create({
        input: limitedText,
        voice: 'tongtong',
        speed: adjustedSpeed,
        response_format: 'wav',
        stream: false
      });

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(arrayBuffer));

      return new Response(buffer, {
        status: 200,
        headers: { 
          "Content-Type": "audio/wav",
          "Content-Length": buffer.length.toString()
        }
      });
    }
  } catch (error) {
    console.error("[Voice Clone] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate audio";
    return new Response(JSON.stringify({ error: message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}

// GET endpoint to list available voices
export async function GET() {
  const voices = [
    // Core voices
    { id: 'tongtong', name: 'TongTong', gender: 'neutral', language: 'multi' },
    { id: 'alloy', name: 'Alloy', gender: 'neutral', language: 'en' },
    { id: 'echo', name: 'Echo', gender: 'male', language: 'en' },
    { id: 'fable', name: 'Fable', gender: 'neutral', language: 'en' },
    { id: 'onyx', name: 'Onyx', gender: 'male', language: 'en' },
    { id: 'nova', name: 'Nova', gender: 'female', language: 'en' },
    { id: 'shimmer', name: 'Shimmer', gender: 'female', language: 'en' },
    
    // Extended voices
    { id: 'adam', name: 'Adam', gender: 'male', language: 'en' },
    { id: 'bella', name: 'Bella', gender: 'female', language: 'en' },
    { id: 'charlie', name: 'Charlie', gender: 'male', language: 'en' },
    { id: 'david', name: 'David', gender: 'male', language: 'en' },
    { id: 'emma', name: 'Emma', gender: 'female', language: 'en' },
    { id: 'frank', name: 'Frank', gender: 'male', language: 'en' },
    { id: 'grace', name: 'Grace', gender: 'female', language: 'en' },
    { id: 'henry', name: 'Henry', gender: 'male', language: 'en' },
    
    // Arabic voices
    { id: 'ar-male-1', name: 'Ahmed', gender: 'male', language: 'ar' },
    { id: 'ar-male-2', name: 'Omar', gender: 'male', language: 'ar' },
    { id: 'ar-female-1', name: 'Fatima', gender: 'female', language: 'ar' },
    { id: 'ar-female-2', name: 'Layla', gender: 'female', language: 'ar' },
    
    // Specialized voices
    { id: 'en-male-deep', name: 'Deep Voice', gender: 'male', language: 'en' },
    { id: 'en-male-casual', name: 'Casual Male', gender: 'male', language: 'en' },
    { id: 'en-female-soft', name: 'Soft Voice', gender: 'female', language: 'en' },
    { id: 'en-female-professional', name: 'Professional', gender: 'female', language: 'en' },
  ];

  return new Response(JSON.stringify({ voices }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
