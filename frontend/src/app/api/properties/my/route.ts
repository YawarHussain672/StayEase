import { NextResponse, NextRequest } from "next/server";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/properties/my - Get owner's properties
export async function GET(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const properties = await Property.find({ owner: user.id })
            .populate("rooms")
            .sort("-createdAt");

        return NextResponse.json({ success: true, properties });
    } catch (error: any) {
        console.error("Get My Properties Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
