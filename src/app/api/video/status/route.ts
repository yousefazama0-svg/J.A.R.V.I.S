import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId || typeof taskId !== 'string') {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const result = await zai.async.result.query(taskId);

    const response: Record<string, unknown> = {
      taskId: taskId,
      status: result.task_status,
    };

    if (result.task_status === 'SUCCESS') {
      const videoUrl = result.video_result?.[0]?.url ||
                      (result as Record<string, unknown>).video_url ||
                      (result as Record<string, unknown>).url ||
                      (result as Record<string, unknown>).video;
      
      response.videoUrl = videoUrl;
      response.duration = '10s';
      response.format = 'mp4';
    } else if (result.task_status === 'FAIL') {
      response.error = 'Video generation failed';
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Video status check error:', error);
    const message = error instanceof Error ? error.message : 'Status check failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
