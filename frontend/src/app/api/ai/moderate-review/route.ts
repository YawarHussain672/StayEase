import { NextResponse, NextRequest } from "next/server";
import { moderateReview } from "@/lib/services/aiReviewModerator";
import connectDB from "@/lib/db";

// POST /api/ai/moderate-review
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { text, rating } = body;

        const result = await moderateReview(text, rating);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Moderate Review Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
