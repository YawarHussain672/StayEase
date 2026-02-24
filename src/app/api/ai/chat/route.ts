import { NextResponse, NextRequest } from "next/server";
import { chat } from "@/lib/services/aiChatbot";
import connectDB from "@/lib/db";

// POST /api/ai/chat
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { messages, context } = body;

        const result = await chat(messages, context);

        if (!result.success) {
            return NextResponse.json({ success: false, error: "AI Chat Failed" }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
