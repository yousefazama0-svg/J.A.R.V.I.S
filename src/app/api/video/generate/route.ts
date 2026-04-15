import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

interface GenerateRequest {
  prompt: string;
  style: string;
  duration: number;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, style, duration = 5 } = body;

    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const zai = await getZAI();

    // Use ZAI Video Generation
    const videoResponse = await zai.video.generate({
      prompt: `${prompt}, ${style} style`,
      duration,
    });

    if (videoResponse.taskId) {
      return new Response(JSON.stringify({ 
        videoId: videoResponse.taskId,
        status: "processing",
        prompt,
        style,
        duration
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ 
      error: "Failed to start video generation" 
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[Video Generate] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate video";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
