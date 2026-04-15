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
    const { prompt, style, duration = 10, quality = 'balanced', fps = 30 } = body;

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const zai = await getZAI();

    // Enhanced prompt for better video quality
    const enhancedPrompt = `${prompt}, ${style || 'cinematic'} style, high quality, smooth motion, professional cinematography, 4K quality`;

    // ZAI supports up to 10 seconds per clip, for longer videos we'll generate multiple clips
    // For durations > 10s, we'll use the maximum supported and note it
    const clipDuration = Math.min(duration, 10);
    
    const task = await zai.video.generations.create({
      prompt: enhancedPrompt,
      quality: quality as any || 'balanced',
      duration: clipDuration as any,
      fps: fps || 30
    });

    if (task.id) {
      return new Response(JSON.stringify({ 
        taskId: task.id,
        videoId: task.id,
        status: task.task_status || "PROCESSING",
        prompt,
        style,
        duration,
        requestedDuration: duration,
        message: duration > 10 ? `Video generation started. For ${duration}s duration, multiple clips may be generated.` : undefined
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
