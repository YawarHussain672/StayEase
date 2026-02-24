import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/dashboard/bookings-analytics
export async function GET(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const matchQuery: any = {};
        if (user.role === "owner") {
            const properties = await Property.find({ owner: user.id }).select("_id");
            matchQuery.property = { $in: properties.map((p) => p._id) };
        }

        const statusBreakdown = await Booking.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const recentBookings = await Booking.find(matchQuery)
            .populate("user", "name email")
            .populate("property", "name")
            .populate("room", "name type")
            .sort("-createdAt")
            .limit(10);

        return NextResponse.json({ success: true, statusBreakdown, recentBookings });
    } catch (error: any) {
        console.error("Get Booking Analytics Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
