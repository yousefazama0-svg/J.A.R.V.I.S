import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return new Response(JSON.stringify({ error: "videoId is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Placeholder response - video APIs would return actual status
  return new Response(JSON.stringify({ 
    videoId,
    status: "completed",
    progress: 100,
    note: "Video status requires a video API connection"
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}
