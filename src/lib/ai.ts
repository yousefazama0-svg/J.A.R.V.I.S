// AI Configuration - Uses environment variables
// Set your API keys in Vercel Dashboard > Settings > Environment Variables

const GROQ_API_KEY = process.env.GROQ_API_KEY;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

interface StreamChatOptions extends ChatCompletionOptions {
  onToken: (token: string) => void;
}

// Check if API key is configured
export function isAIConfigured(): boolean {
  return !!GROQ_API_KEY;
}

// Groq API Chat Completion
export async function groqChatCompletion(options: ChatCompletionOptions): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured. Please add it in Vercel Environment Variables.");
  }

  const { messages, temperature = 0.7, maxTokens = 2048 } = options;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// Groq API Streaming Chat
export async function groqStreamChat(options: StreamChatOptions): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured. Please add it in Vercel Environment Variables.");
  }

  const { messages, temperature = 0.7, maxTokens = 2048, onToken } = options;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || "";
          if (content) {
            fullContent += content;
            onToken(content);
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }

  return fullContent;
}

// Image Generation using Pollinations.ai (Free, no API key needed)
export async function generateImage(prompt: string, style?: string): Promise<string> {
  const fullPrompt = style ? `${prompt}, ${style} style` : prompt;
  const encodedPrompt = encodeURIComponent(fullPrompt);
  
  // Using Pollinations.ai - Free image generation
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
  
  return imageUrl;
}

// TTS using Web Speech API (client-side) or free services
export async function generateSpeech(text: string): Promise<ArrayBuffer | null> {
  // For production, use a TTS service
  // This is a placeholder - implement with your preferred TTS provider
  return null;
}

export default {
  isAIConfigured,
  groqChatCompletion,
  groqStreamChat,
  generateImage,
  generateSpeech,
};
