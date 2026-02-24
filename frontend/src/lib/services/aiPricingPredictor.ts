import OpenAI from "openai";
import Booking from "@/models/Booking";
import connectDB from "@/lib/db";

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

export async function predictDemand(propertyId: string, city: string) {
    try {
        await connectDB();

        // Get historical booking data
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const matchStage: any = {
            createdAt: { $gte: sixMonthsAgo },
        };

        // Dynamic property filtering or generic platform-wide depending on context
        if (propertyId) {
            matchStage.property = propertyId;
        } else {
            matchStage.property = { $exists: true };
        }

        const bookingHistory = await Booking.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    bookings: { $sum: 1 },
                    revenue: { $sum: "$amount.total" },
                    avgAmount: { $avg: "$amount.total" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const client = getOpenAIClient();
        const response = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                {
                    role: "system",
                    content: `You are a demand prediction AI for a hostel/PG platform in India.
Based on historical booking data and knowledge of Indian travel patterns, predict:
- Expected occupancy for next 3 months (percentage)
- Suggested pricing adjustment (percentage change)
- Peak demand periods
- Recommendations

Consider: college admissions (June-July), festival seasons, exam periods, 
corporate relocations, and weather patterns.
Return a JSON object with: predictions (array of {month, occupancy, pricingSuggestion}), 
peakPeriods (array of strings), and recommendations (array of strings).
Return ONLY valid JSON.`,
                },
                {
                    role: "user",
                    content: `City: ${city || "General"}\nHistorical Data: ${JSON.stringify(
                        bookingHistory
                    )}`,
                },
            ],
            max_tokens: 500,
            temperature: 0.5,
        });

        // Parse result safely
        const rawContent = response.choices[0].message.content || "{}";
        // Attempt to clean markdown wrapper if present (```json ... ```)
        const jsonMatch = rawContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || rawContent.match(/(\{[\s\S]*\})/);
        const parsedJson = JSON.parse(jsonMatch ? jsonMatch[1] : rawContent);

        return {
            success: true,
            prediction: parsedJson,
            historical: bookingHistory,
        };
    } catch (error: any) {
        console.error("AI Pricing Prediction Error:", error.message);
        return {
            success: false,
            prediction: {
                predictions: [
                    { month: "Next Month", occupancy: 70, pricingSuggestion: "+5%" },
                    { month: "Month +2", occupancy: 75, pricingSuggestion: "+8%" },
                    { month: "Month +3", occupancy: 65, pricingSuggestion: "0%" },
                ],
                peakPeriods: ["June-July (College Admissions)", "October-November (Festivals)"],
                recommendations: ["Consider early-bird discounts", "Bundle meal plans during peak"],
            },
        };
    }
}
