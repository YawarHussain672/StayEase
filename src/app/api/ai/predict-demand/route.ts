import { NextResponse, NextRequest } from "next/server";
import { predictDemand } from "@/lib/services/aiPricingPredictor";

// GET /api/ai/predict-demand
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const propertyId = url.searchParams.get("propertyId") || "";
        const city = url.searchParams.get("city") || "";

        const result = await predictDemand(propertyId, city);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Predict Demand Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
