import ZAI from 'z-ai-web-dev-sdk';

// ZAI API Key from environment variable
const ZAI_API_KEY = process.env.ZAI_API_KEY;

// Initialize ZAI SDK singleton
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

export async function getZAI() {
  if (!zaiInstance) {
    // If API key is provided, use it (for production/Vercel)
    // Otherwise, SDK will use default auth (for Sandbox)
    zaiInstance = await ZAI.create(ZAI_API_KEY ? { apiKey: ZAI_API_KEY } : undefined);
  }
  return zaiInstance;
}

// Check if ZAI is configured
export function isZAIConfigured(): boolean {
  return true; // ZAI works in Sandbox without key, and with key in production
}

// Export for convenience
export default ZAI;
