import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import Room from "@/models/Room";
import connectDB from "@/lib/db";
import { withAuth } from "@/lib/auth";

// GET /api/bookings/[id] - Get single booking
export const GET = withAuth(async (req: NextRequest, context: any, user: any) => {
    try {
        await connectDB();
        const { id } = await context.params;
        const booking = await Booking.findById(id)
            .populate("property", "name location images owner")
            .populate("room", "name type price amenities")
            .populate("user", "name email phone");

        if (!booking) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
        }

        // Check ownership
        const userId = user._id.toString();
        const bookingUserId = booking.user._id.toString();

        if (bookingUserId !== userId && user.role !== "admin") {
            const property = await Property.findById(booking.property._id);
            if (!property || property.owner.toString() !== userId) {
                return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
            }
        }

        return NextResponse.json({ success: true, booking });
    } catch (error: any) {
        console.error("Get Booking Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
});
