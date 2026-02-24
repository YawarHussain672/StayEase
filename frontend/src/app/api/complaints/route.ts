import { NextResponse, NextRequest } from "next/server";
import Complaint from "@/models/Complaint";
import connectDB from "@/lib/db";
import { authenticate, withAuth } from "@/lib/auth";

// POST /api/complaints - Create complaint
export async function POST(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const body = await req.json();
        body.user = user.id;

        const complaint = await Complaint.create(body);

        return NextResponse.json({ success: true, complaint }, { status: 201 });
    } catch (error: any) {
        console.error("Create Complaint Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}

// GET /api/complaints - Get all complaints (admin)
export const GET = withAuth(async (req: NextRequest) => {
    try {
        await connectDB();
        const url = new URL(req.url);

        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const query: any = {};
        if (url.searchParams.get("status")) query.status = url.searchParams.get("status");
        if (url.searchParams.get("priority")) query.priority = url.searchParams.get("priority");

        const [complaints, total] = await Promise.all([
            Complaint.find(query)
                .populate("user", "name email")
                .populate("property", "name")
                .skip(skip)
                .limit(limit)
                .sort("-createdAt"),
            Complaint.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            complaints,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Get All Complaints Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}, ["admin"]);
