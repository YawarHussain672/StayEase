import { NextResponse, NextRequest } from "next/server";
import Review from "@/models/Review";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// PUT /api/reviews/[id]/flag - Flag/unflag review (admin)
export async function PUT(req: NextRequest, context: any) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        if (user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        await connectDB();
        const body = await req.json();

        const { id } = await context.params;

        const review = await Review.findByIdAndUpdate(
            id,
            {
                flagged: body.flagged,
                flagReason: body.reason || "",
            },
            { new: true }
        );

        if (!review) {
            return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, review });
    } catch (error: any) {
        console.error("Flag Review Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
