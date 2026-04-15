import ZAI from 'z-ai-web-dev-sdk';

// Initialize ZAI SDK singleton
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

export async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Export for convenience
export default ZAI;
