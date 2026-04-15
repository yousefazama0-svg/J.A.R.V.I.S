import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return new Response(JSON.stringify({ error: "videoId is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const zai = await getZAI();

    // Check video status
    const statusResponse = await zai.video.getStatus({
      taskId: videoId,
    });

    return new Response(JSON.stringify({ 
      videoId,
      status: statusResponse.status,
      progress: statusResponse.progress || 0,
      videoUrl: statusResponse.videoUrl,
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[Video Status] Error:", error);
    return new Response(JSON.stringify({ 
      videoId,
      status: "error",
      error: error instanceof Error ? error.message : "Failed to check status"
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
