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

    // Check video status using async result query
    const result = await zai.async.result.query(videoId);

    // Extract video URL from multiple possible fields
    const videoUrl = result.video_result?.[0]?.url ||
                    result.video_url ||
                    result.url ||
                    result.video;

    return new Response(JSON.stringify({ 
      videoId,
      status: result.task_status,
      progress: result.task_status === 'SUCCESS' ? 100 : result.task_status === 'FAIL' ? 0 : 50,
      videoUrl: videoUrl || null,
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
