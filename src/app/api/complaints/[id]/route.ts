import { NextResponse, NextRequest } from "next/server";
import Complaint from "@/models/Complaint";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// PUT /api/complaints/[id] - Update complaint status
export async function PUT(req: NextRequest, context: any) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        // Ensure only owners or admins can update complaint status
        if (user.role !== "owner" && user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        await connectDB();
        const body = await req.json();
        const { status: complaintStatus, resolution } = body;

        const updateData: any = { status: complaintStatus };

        if (complaintStatus === "resolved" && resolution) {
            updateData.resolution = {
                text: resolution,
                resolvedBy: user.id,
                resolvedAt: new Date(),
            };
        }

        const { id } = await context.params;

        const complaint = await Complaint.findByIdAndUpdate(id, updateData, { new: true })
            .populate("user", "name email");

        if (!complaint) {
            return NextResponse.json({ success: false, error: "Complaint not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, complaint });
    } catch (error: any) {
        console.error("Update Complaint Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
