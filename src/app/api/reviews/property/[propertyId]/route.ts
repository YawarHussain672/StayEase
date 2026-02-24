import { NextResponse, NextRequest } from "next/server";
import Review from "@/models/Review";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/reviews/property/[propertyId] - Get reviews for a property
export async function GET(req: NextRequest, context: any) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const { propertyId } = await context.params;
        const query = { property: propertyId, flagged: false };
        const [reviews, total] = await Promise.all([
            Review.find(query)
                .populate("user", "name avatar")
                .skip(skip)
                .limit(limit)
                .sort("-createdAt"),
            Review.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            reviews,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Get Property Reviews Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
