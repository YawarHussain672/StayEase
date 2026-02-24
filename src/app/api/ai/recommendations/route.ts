import { NextResponse, NextRequest } from "next/server";
import { getRecommendations } from "@/lib/services/aiRecommendation";
import { authenticate } from "@/lib/auth";

// GET /api/ai/recommendations
export async function GET(req: NextRequest) {
    try {
        const { user } = await authenticate(req);

        const url = new URL(req.url);

        const preferences: any = user?.preferences || {};
        const cityParam = url.searchParams.get("city");
        const budgetParam = url.searchParams.get("budget");

        if (cityParam) preferences.city = cityParam;
        if (budgetParam) preferences.budget = { max: parseInt(budgetParam) };

        const result = await getRecommendations(user?.id, preferences);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Recommendations Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
