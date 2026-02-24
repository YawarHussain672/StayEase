import { NextResponse, NextRequest } from "next/server";
import Review from "@/models/Review";
import connectDB from "@/lib/db";
import { authenticate, withAuth } from "@/lib/auth";

// POST /api/reviews - Create review
export async function POST(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const body = await req.json();
        body.user = user.id;

        const existing = await Review.findOne({ user: user.id, property: body.property });
        if (existing) {
            return NextResponse.json(
                { success: false, error: "You have already reviewed this property" },
                { status: 400 }
            );
        }

        const review = await Review.create(body);
        const populated = await Review.findById(review._id).populate("user", "name avatar");

        return NextResponse.json({ success: true, review: populated }, { status: 201 });
    } catch (error: any) {
        console.error("Create Review Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}

// GET /api/reviews - Get all reviews (admin)
export const GET = withAuth(async (req: NextRequest) => {
    try {
        await connectDB();
        const url = new URL(req.url);

        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const flagged = url.searchParams.get("flagged");

        const query: any = {};
        if (flagged) query.flagged = flagged === "true";

        const [reviews, total] = await Promise.all([
            Review.find(query)
                .populate("user", "name email")
                .populate("property", "name")
                .skip((page - 1) * limit)
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
        console.error("Get All Reviews Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}, ["admin"]);
