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

export async function moderateReview(reviewText: string, rating: number) {
    try {
        const client = getOpenAIClient();
        const response = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                {
                    role: "system",
                    content: `You are a review moderation system for a hostel/PG platform.
Analyze the review and return a JSON object with:
- isFake: boolean (true if review seems fake/spam/bot-generated)
- isAbusive: boolean (true if contains hate speech, profanity, or abuse)
- sentimentScore: number from -1 to 1
- sentimentLabel: one of [positive, negative, neutral]
- shouldFlag: boolean (true if review should be flagged for manual review)
- flagReason: string (reason for flagging, empty if not flagged)
- confidence: number from 0 to 1

Look for: suspicious patterns, irrelevant content, excessive praise/hate without substance, 
promotional content, personal attacks, and rating-text mismatch.
Return ONLY valid JSON.`,
                },
                {
                    role: "user",
                    content: `Rating: ${rating}/5\nReview: ${reviewText}`,
                },
            ],
            max_tokens: 200,
            temperature: 0.3,
        });

        const rawContent = response.choices[0].message.content || "{}";
        const jsonMatch = rawContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || rawContent.match(/(\{[\s\S]*\})/);
        const moderation = JSON.parse(jsonMatch ? jsonMatch[1] : rawContent);

        return {
            success: true,
            moderation,
        };
    } catch (error: any) {
        console.error("AI Review Moderation Error:", error.message);
        return {
            success: false,
            moderation: {
                isFake: false,
                isAbusive: false,
                sentimentScore: 0,
                sentimentLabel: "neutral",
                shouldFlag: false,
                flagReason: "",
                confidence: 0.5,
            },
        };
    }
}
