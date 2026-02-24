import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import Room from "@/models/Room";
import connectDB from "@/lib/db";
import { withAuth } from "@/lib/auth";

// PUT /api/bookings/[id]/status - Update booking status (owner/admin)
export const PUT = withAuth(async (req: NextRequest, context: any, user: any) => {
    try {
        await connectDB();
        const body = await req.json();
        const { status: bookingStatus } = body;
        const { id } = await context.params;

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status: bookingStatus },
            { new: true, runValidators: true }
        )
            .populate("property", "name")
            .populate("user", "name email");

        if (!booking) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, booking });
    } catch (error: any) {
        console.error("Update Booking Status Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}, ["owner", "admin"]);
