import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

interface GenerateRequest {
  prompt: string;
  style: string;
  duration: number;
  quality?: string;
  fps?: number;
  language?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, style, duration = 5, quality = 'speed', fps = 30 } = body;

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const zai = await getZAI();

    // Enhanced prompt for better video quality
    const enhancedPrompt = `${prompt}, ${style || 'cinematic'} style, high quality, smooth motion, professional cinematography`;

    // ZAI supports only 5 or 10 seconds
    const clipDuration = duration <= 5 ? 5 : 10;
    
    // Quality must be 'speed' or 'quality'
    const videoQuality = quality === 'quality' ? 'quality' : 'speed';
    
    // FPS must be 30 or 60
    const videoFps = fps === 60 ? 60 : 30;

    const task = await zai.video.generations.create({
      prompt: enhancedPrompt,
      quality: videoQuality as 'speed' | 'quality',
      duration: clipDuration as 5 | 10,
      fps: videoFps as 30 | 60
    });

    if (task.id) {
      return new Response(JSON.stringify({ 
        taskId: task.id,
        videoId: task.id,
        status: task.task_status || "PROCESSING",
        prompt,
        style,
        duration: clipDuration,
        quality: videoQuality
      }), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ 
      error: "Failed to start video generation" 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("[Video Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate video";
    return new Response(JSON.stringify({ error: message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
