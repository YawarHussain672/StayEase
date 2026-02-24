import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { withAuth } from "@/lib/auth";

// PUT /api/bookings/[id]/cancel - Cancel booking
export const PUT = withAuth(async (req: NextRequest, context: any, user: any) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
        }

        if (booking.user.toString() !== user._id.toString() && user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        if (booking.status === "cancelled") {
            return NextResponse.json({ success: false, error: "Booking already cancelled" }, { status: 400 });
        }

        booking.status = "cancelled";
        await booking.save();

        // Restore available beds
        await Room.findByIdAndUpdate(booking.room, { $inc: { availableBeds: 1 } });

        return NextResponse.json({ success: true, booking });
    } catch (error: any) {
        console.error("Cancel Booking Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
});
