import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/dashboard/revenue
export async function GET(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const url = new URL(req.url);
        const months = parseInt(url.searchParams.get("months") || "6");

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const matchQuery: any = { "payment.status": "completed", createdAt: { $gte: startDate } };

        if (user.role === "owner") {
            const properties = await Property.find({ owner: user.id }).select("_id");
            matchQuery.property = { $in: properties.map((p) => p._id) };
        }

        const revenue = await Booking.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    revenue: { $sum: "$amount.total" },
                    bookings: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return NextResponse.json({ success: true, revenue });
    } catch (error: any) {
        console.error("Get Revenue Analytics Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
