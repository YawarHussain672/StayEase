import { NextResponse, NextRequest } from "next/server";
import Complaint from "@/models/Complaint";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/complaints/my - Get user's complaints
export async function GET(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const complaints = await Complaint.find({ user: user.id })
            .populate("property", "name location")
            .sort("-createdAt");

        return NextResponse.json({ success: true, complaints });
    } catch (error: any) {
        console.error("Get My Complaints Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
