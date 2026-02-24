import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import Room from "@/models/Room";
import connectDB from "@/lib/db";
import { withAuth } from "@/lib/auth";

// GET /api/bookings/property/[propertyId] - Get property bookings (owner)
export const GET = withAuth(async (req: NextRequest, context: any, user: any) => {
    try {
        await connectDB();
        const { propertyId } = await context.params;
        const property = await Property.findById(propertyId);
        if (!property) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        const userId = user._id.toString();

        if (property.owner.toString() !== userId && user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        const bookings = await Booking.find({ property: propertyId })
            .populate("user", "name email phone")
            .populate("room", "name type")
            .sort("-createdAt");

        return NextResponse.json({ success: true, bookings });
    } catch (error: any) {
        console.error("Get Property Bookings Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
});
