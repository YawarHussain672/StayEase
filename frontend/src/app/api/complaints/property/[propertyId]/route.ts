import { NextResponse, NextRequest } from "next/server";
import Complaint from "@/models/Complaint";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/complaints/property/[propertyId] - Get property complaints (owner)
export async function GET(req: NextRequest, context: any) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const { propertyId } = await context.params;
        const property = await Property.findById(propertyId);

        if (!property) {
            return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
        }

        if (property.owner.toString() !== user.id && user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        const complaints = await Complaint.find({ property: propertyId })
            .populate("user", "name email phone")
            .sort("-createdAt");

        return NextResponse.json({ success: true, complaints });
    } catch (error: any) {
        console.error("Get Property Complaints Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
