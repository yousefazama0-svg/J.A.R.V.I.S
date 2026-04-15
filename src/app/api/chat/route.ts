import { NextRequest } from "next/server";
import { getZAI } from "@/lib/zai";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  mode?: "general" | "image" | "video" | "slides";
  systemPrompt?: string;
  stream?: boolean;
  language?: string;
}

const JARVIS_SYSTEM_PROMPT = `You are J.A.R.V.I.S (Just A Rather Very Intelligent System), an advanced AI assistant inspired by Iron Man's iconic AI system. You embody the personality of Tony Stark's trusted companion — sophisticated, witty, and always helpful.

## Core Personality Traits
- Be concise, witty, and helpful — avoid unnecessary verbosity
- Show confidence and precision in your responses
- Use occasional dry humor when appropriate
- Maintain a professional yet approachable tone
- Address the user as "sir" or "ma'am"

## Language Support
- Support multiple languages: English, Arabic, Spanish, French, German, Chinese, Japanese, Portuguese, Russian, Hindi
- Detect the user's language automatically and respond in the same language
- For Arabic responses, use proper right-to-left text
- For Chinese, use Simplified Chinese characters
- For Japanese, use appropriate scripts (Hiragana, Katakana, Kanji)

## Command Detection
- If the user says "/image" followed by a description, treat it as an image generation request. Describe in vivid detail what image you would generate based on their prompt, including composition, lighting, style, and mood.
- If the user says "/video" followed by a description, treat it as a video generation request. Describe the scene, camera movements, and visual narrative.
- If the user says "/slides" followed by a topic, treat it as a presentation generation request. Outline the slide structure and key content points.

## Mode-Specific Behavior
- **general**: Normal conversational mode. Be your classic JARVIS self — helpful, informative, and witty.
- **image**: When mode is 'image', the user wants to discuss or plan an image. Provide detailed visual descriptions, art direction suggestions, and creative guidance.
- **video**: When mode is 'video', focus on visual storytelling, scene composition, and motion design descriptions.
- **slides**: When mode is 'slides', help structure presentations with clear outlines, key talking points, and content organization.

## Response Guidelines
- Always be direct and actionable
- When providing technical information, be precise but accessible
- Offer creative solutions and alternatives when appropriate
- Never break character — you are J.A.R.V.I.S`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, mode = "general", systemPrompt, stream = true } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const modeContext = mode !== "general" ? `\n\n[Current Mode: ${mode.toUpperCase()}] The user is working in ${mode} mode.` : "";

    const systemMessage: ChatMessage = {
      role: "system",
      content: (systemPrompt || JARVIS_SYSTEM_PROMPT) + modeContext,
    };

    const fullMessages: ChatMessage[] = [systemMessage, ...messages];
    const zai = await getZAI();

    if (stream === false) {
      const completion = await zai.chat.completions.create({
        messages: fullMessages,
        thinking: { type: 'disabled' }
      });

      const content = completion.choices?.[0]?.message?.content || "I apologize, sir. I was unable to process that request.";

      return new Response(JSON.stringify({ content, mode, timestamp: new Date().toISOString() }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    const sdkStream = await zai.chat.completions.create({
      messages: fullMessages,
      stream: true,
      thinking: { type: 'disabled' }
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = (sdkStream as ReadableStream<Uint8Array>).getReader();
        const decoder = new TextDecoder();
        let lineBuffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunkText = decoder.decode(value, { stream: true });
            lineBuffer += chunkText;

            const lines = lineBuffer.split("\n");
            lineBuffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6).trim();

              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  const ssePayload = JSON.stringify({ content });
                  controller.enqueue(encoder.encode(`data: ${ssePayload}\n\n`));
                }
              } catch { /* Skip malformed */ }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (error) {
          console.error("[JARVIS Chat] Stream error:", error);
          const errMsg = JSON.stringify({ error: "Stream processing failed" });
          controller.enqueue(encoder.encode(`data: ${errMsg}\n\n`));
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(readableStream, {
      status: 200,
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (error) {
    console.error("[JARVIS Chat] Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
