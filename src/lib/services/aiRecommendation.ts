import OpenAI from "openai";
import Property from "@/models/Property";
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

export async function getRecommendations(userId: string, preferences: any = {}, limit = 6) {
    try {
        await connectDB();

        // Build preference-based query
        const query: any = { active: true, verified: true };

        if (preferences.city) query["location.city"] = { $regex: preferences.city, $options: "i" };
        if (preferences.gender) query.gender = preferences.gender;
        if (preferences.budget?.max)
            query["pricing.startingFrom"] = { $lte: preferences.budget.max };
        if (preferences.amenities?.length) query.amenities = { $in: preferences.amenities };

        // Get matching properties sorted by rating
        let properties = await Property.find(query)
            .sort("-avgRating -totalReviews")
            .limit(limit * 2);

        // If not enough results, broaden search
        if (properties.length < limit) {
            const broadQuery: any = { active: true };
            if (preferences.city)
                broadQuery["location.city"] = { $regex: preferences.city, $options: "i" };
            properties = await Property.find(broadQuery).sort("-avgRating").limit(limit);
        }

        // Use AI to rank and explain recommendations
        if (properties.length > 0 && process.env.OPENROUTER_API_KEY) {
            const propertyList = properties.map((p) => ({
                id: p._id,
                name: p.name,
                type: p.type,
                city: p.location.city,
                price: p.pricing.startingFrom,
                rating: p.avgRating,
                amenities: p.amenities.join(", "),
                gender: p.gender,
            }));

            try {
                const client = getOpenAIClient();
                const response = await client.chat.completions.create({
                    model: "google/gemini-2.0-flash-001",
                    messages: [
                        {
                            role: "system",
                            content: `You are a property recommendation AI. Given user preferences and a list of properties,
              rank them and provide a brief reason for each recommendation.
              Return JSON: { rankings: [{id, reason}] } for the top ${limit} properties.
              Return ONLY valid JSON.`,
                        },
                        {
                            role: "user",
                            content: `Preferences: ${JSON.stringify(
                                preferences
                            )}\nProperties: ${JSON.stringify(propertyList)}`,
                        },
                    ],
                    max_tokens: 300,
                    temperature: 0.5,
                });

                const rawContent = response.choices[0].message.content || "{}";
                const jsonMatch = rawContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || rawContent.match(/(\{[\s\S]*\})/);
                const aiResult = JSON.parse(jsonMatch ? jsonMatch[1] : rawContent);

                if (aiResult.rankings) {
                    const rankedIds = aiResult.rankings.map((r: any) => r.id.toString());
                    const reasonMap: any = {};
                    aiResult.rankings.forEach((r: any) => {
                        reasonMap[r.id] = r.reason;
                    });

                    // Re-order properties based on AI ranking
                    const rankedProperties = rankedIds
                        .map((id: string) => {
                            const prop = properties.find((p) => p._id.toString() === id);
                            if (prop) {
                                return { ...prop.toObject(), aiReason: reasonMap[id] };
                            }
                            return null;
                        })
                        .filter(Boolean)
                        .slice(0, limit);

                    return { success: true, properties: rankedProperties };
                }
            } catch (aiError) {
                console.error("AI Recommendation specific error fallback", aiError);
                // Fallback to rating-based
            }
        }

        return { success: true, properties: properties.slice(0, limit) };
    } catch (error: any) {
        console.error("AI Recommendation Error:", error.message);
        return { success: false, properties: [] };
    }
}
