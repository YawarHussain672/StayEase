import { NextResponse, NextRequest } from "next/server";
import { classifyComplaint } from "@/lib/services/aiComplaintClassifier";
import connectDB from "@/lib/db";

// POST /api/ai/classify-complaint
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { title, description } = body;

        const result = await classifyComplaint(title, description);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Classify Complaint Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
