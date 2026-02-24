import { NextResponse, NextRequest } from "next/server";
import Property from "@/models/Property";
import Room from "@/models/Room";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

export async function POST(req: NextRequest, context: any) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const { id } = await context.params;
        const property = await Property.findById(id);

        if (!property) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        if (property.owner.toString() !== user.id && user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        const body = await req.json();
        body.property = id;

        const room = await Room.create(body);

        // Update property room counts
        const rooms = await Room.find({ property: id });
        await Property.findByIdAndUpdate(id, {
            totalRooms: rooms.length,
            availableRooms: rooms.filter((r) => r.availableBeds > 0).length,
            "pricing.startingFrom": Math.min(...rooms.map((r) => r.price.daily)),
        });

        return NextResponse.json({ success: true, room }, { status: 201 });
    } catch (error: any) {
        console.error("Add Room Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
