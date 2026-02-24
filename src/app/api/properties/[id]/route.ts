import { NextResponse, NextRequest } from "next/server";
import Property from "@/models/Property";
import Room from "@/models/Room";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/properties/[id] - Get single property
export async function GET(req: NextRequest, context: any) {
    try {
        await connectDB();
        const { id } = await context.params;
        const property = await Property.findById(id)
            .populate("owner", "name email phone")
            .populate("rooms");

        if (!property) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, property });
    } catch (error: any) {
        console.error("Get Property Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}

// PUT /api/properties/[id] - Update property
export async function PUT(req: NextRequest, context: any) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const { id } = await context.params;
        let property = await Property.findById(id);

        if (!property) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        if (property.owner.toString() !== user.id && user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        const body = await req.json();
        property = await Property.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        return NextResponse.json({ success: true, property });
    } catch (error: any) {
        console.error("Update Property Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(req: NextRequest, context: any) {
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

        await Room.deleteMany({ property: id });
        await property.deleteOne();

        return NextResponse.json({ success: true, message: "Property deleted" });
    } catch (error: any) {
        console.error("Delete Property Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
