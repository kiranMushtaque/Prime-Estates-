import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION =
  'You are the concierge for Meridian Estates in the fictional city Azure Bay. Answer briefly and politely about the featured villa, neighborhoods and booking a viewing. Never invent real places.';

// Curated fallback responses for Azure Bay knowledge if API is unreachable
const FALLBACK_KNOWLEDGE: Record<string, string> = {
  villa:
    'The Cliffside Villa is our featured masterpiece situated in Coral Ridge, Azure Bay. Listed at PKR 28.5 Crore, it spans 4,800 sq ft (1 Kanal) with 5 en-suite bedrooms, an 18m cantilevered infinity pool, basalt fire pit, and uninterrupted ocean horizons.',
  neighborhood:
    'Azure Bay is divided into three celebrated coastal enclaves: Coral Ridge (dramatic sunset bluffs & ultra-prime villas), Marina Crest (waterfront high-rises & yacht berths), and Palm Heights (verdant tree-lined avenues & family estates).',
  viewing:
    'Private viewings can be scheduled directly via our confidential booking desk on this page, or by connecting with our senior partners via WhatsApp at +92 300 0000000. Diplomatic confidentiality is assured.',
  price:
    'The Cliffside Villa is offered for private acquisition at PKR 28.5 Crore. Other residences in Azure Bay range from PKR 14.8 Crore for marina sky penthouses to PKR 45 Crore for private bluff estates.'
};

export async function askConcierge(userMessage: string, history: { role: 'user' | 'model'; text: string }[] = []): Promise<string> {
  const apiKey =
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    '';

  // 1. If API key is available, call Gemini API via @google/genai SDK
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Convert history for Gemini
      const contents = [
        ...history.map((h) => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        {
          role: 'user' as const,
          parts: [{ text: userMessage }]
        }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 250
        }
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, switching to graceful concierge fallback:', err);
    }
  }

  // 2. Try proxy /api/chat if running in a server environment
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, history })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch {
    // Continue to graceful fallback
  }

  // 3. Graceful fallback for offline mode or missing credentials
  const lower = userMessage.toLowerCase();
  if (lower.includes('villa') || lower.includes('cliffside') || lower.includes('home') || lower.includes('bed')) {
    return FALLBACK_KNOWLEDGE.villa;
  }
  if (lower.includes('neighborhood') || lower.includes('enclave') || lower.includes('area') || lower.includes('coral') || lower.includes('marina')) {
    return FALLBACK_KNOWLEDGE.neighborhood;
  }
  if (lower.includes('viewing') || lower.includes('book') || lower.includes('schedule') || lower.includes('tour') || lower.includes('contact')) {
    return FALLBACK_KNOWLEDGE.viewing;
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('crore') || lower.includes('pkr')) {
    return FALLBACK_KNOWLEDGE.price;
  }

  return (
    'Welcome to Meridian Estates, Azure Bay. I am at your service to discuss The Cliffside Villa (PKR 28.5 Crore), our premier enclaves in Coral Ridge and Marina Crest, or arrange a discrete private viewing.'
  );
}
