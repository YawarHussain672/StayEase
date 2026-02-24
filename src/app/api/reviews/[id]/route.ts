import { NextResponse, NextRequest } from "next/server";
import Review from "@/models/Review";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// DELETE /api/reviews/[id] - Delete review
export async function DELETE(req: NextRequest, context: any) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const { id } = await context.params;
        const review = await Review.findById(id);

        if (!review) {
            return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
        }

        if (review.user.toString() !== user.id && user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        await review.deleteOne();
        return NextResponse.json({ success: true, message: "Review deleted" });
    } catch (error: any) {
        console.error("Delete Review Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
