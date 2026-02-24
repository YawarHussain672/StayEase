import OpenAI from "openai";

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

export async function classifyComplaint(title: string, description: string) {
    try {
        const client = getOpenAIClient();
        const response = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                {
                    role: "system",
                    content: `You are a complaint classification system for a hostel/PG platform.
Analyze the complaint and return a JSON object with:
- category: one of [maintenance, cleanliness, noise, security, billing, staff, food, other]
- priority: one of [low, medium, high, urgent]
- sentimentScore: number from -1 (very negative) to 1 (positive)
- confidence: number from 0 to 1

Consider:
- Safety/security → urgent
- Billing overcharges → high
- Cleanliness → medium to high
- Minor inconveniences → low
Return ONLY valid JSON.`,
                },
                {
                    role: "user",
                    content: `Title: ${title}\nDescription: ${description}`,
                },
            ],
            max_tokens: 150,
            temperature: 0.3,
        });

        const result = JSON.parse(response.choices[0].message.content || "{}");
        return {
            success: true,
            classification: {
                suggestedCategory: result.category || "other",
                suggestedPriority: result.priority || "medium",
                sentimentScore: result.sentimentScore || 0,
                confidence: result.confidence || 0.5,
            },
        };
    } catch (error: any) {
        console.error("AI Classification Error:", error.message);
        return {
            success: false,
            classification: {
                suggestedCategory: "other",
                suggestedPriority: "medium",
                sentimentScore: 0,
                confidence: 0.5,
            },
        };
    }
}
