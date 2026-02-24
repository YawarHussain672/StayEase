import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import Room from "@/models/Room";
import connectDB from "@/lib/db";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req: NextRequest, context: any, user: any) => {
    try {
        await connectDB();
        const bookings = await Booking.find({ user: user._id })
            .populate("property", "name location images")
            .populate("room", "name type price")
            .sort("-createdAt");

        return NextResponse.json({ success: true, bookings });
    } catch (error: any) {
        console.error("Get My Bookings Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Server Error" }, { status: 500 });
    }
});
