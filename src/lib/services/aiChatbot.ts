import OpenAI from "openai";

// Next.js API Routes don't run a long-lived server, so we initialize the client when needed.
let openai: OpenAI | null = null;

function getOpenAIClient() {
    if (!openai) {
        openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });
    }
    return openai;
}

const SYSTEM_PROMPT = `You are StayEase AI Assistant, a helpful chatbot for a hostel and PG booking platform. 
You help users with:
- Finding hostels, PGs, and budget hotels
- Booking guidance and policies
- FAQs about amenities, pricing, and availability
- Suggesting properties based on preferences
- Complaint and maintenance requests guidance

Be friendly, concise, and helpful. If asked about specific property availability or pricing, 
mention that exact details can be found on the property page. For complaints,
guide them to the complaint form. Keep responses under 150 words.`;

export async function chat(messages: any[], context: any = {}) {
    try {
        const client = getOpenAIClient();
        const systemMessages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

        if (context.city) {
            systemMessages.push({
                role: "system",
                content: `The user is looking in ${context.city}. We have properties available in major Indian cities.`,
            });
        }

        const response = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [...systemMessages, ...messages.slice(-10)],
            max_tokens: 300,
            temperature: 0.7,
        });

        return {
            success: true,
            message: response.choices[0].message.content,
        };
    } catch (error: any) {
        console.error("AI Chatbot Error:", error.message);
        return {
            success: true, // We return true but with a fallback message so the UI doesn't break
            message: "I'm having trouble connecting right now. Please try again in a moment, or reach out to our support team.",
        };
    }
}
