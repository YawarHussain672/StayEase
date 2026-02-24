import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { authenticate, withAuth } from "@/lib/auth";

// POST /api/bookings - Create booking
export async function POST(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const body = await req.json();
        const { propertyId, roomId, checkIn, checkOut, guests, specialRequests } = body;

        const room = await Room.findById(roomId);
        if (!room || room.availableBeds < 1) {
            return NextResponse.json({ success: false, error: "Room not available" }, { status: 400 });
        }

        // Calculate amount
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        if (days < 1) {
            return NextResponse.json({ success: false, error: "Invalid date range" }, { status: 400 });
        }

        const subtotal = room.price.daily * days;
        const tax = Math.round(subtotal * 0.12); // 12% GST
        const total = subtotal + tax;

        const booking = await Booking.create({
            user: user.id,
            property: propertyId,
            room: roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            specialRequests,
            amount: { subtotal, tax, total },
        });

        // Decrease available beds
        await Room.findByIdAndUpdate(roomId, { $inc: { availableBeds: -1 } });

        // Update property availability
        const rooms = await Room.find({ property: propertyId });
        await Property.findByIdAndUpdate(propertyId, {
            availableRooms: rooms.filter((r) => r.availableBeds > 0).length,
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate("property", "name location images")
            .populate("room", "name type price")
            .populate("user", "name email");

        return NextResponse.json({ success: true, booking: populatedBooking }, { status: 201 });
    } catch (error: any) {
        console.error("Create Booking Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}

// GET /api/bookings - Get all bookings (admin)
export const GET = withAuth(async (req: NextRequest, params: any, user: any) => {
    try {
        await connectDB();
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const query: any = {};
        if (url.searchParams.get("status")) query.status = url.searchParams.get("status");

        const [bookings, total] = await Promise.all([
            Booking.find(query)
                .populate("property", "name location")
                .populate("user", "name email")
                .populate("room", "name type")
                .skip(skip)
                .limit(limit)
                .sort("-createdAt"),
            Booking.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            bookings,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Get All Bookings Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}, ["admin"]);
