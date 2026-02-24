import { NextResponse, NextRequest } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import User from "@/models/User";
import Complaint from "@/models/Complaint";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/dashboard/stats
export async function GET(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();

        if (user.role === "admin") {
            const [totalUsers, totalProperties, totalBookings, totalRevenue] = await Promise.all([
                User.countDocuments(),
                Property.countDocuments(),
                Booking.countDocuments(),
                Booking.aggregate([
                    { $match: { "payment.status": "completed" } },
                    { $group: { _id: null, total: { $sum: "$amount.total" } } },
                ]),
            ]);

            return NextResponse.json({
                success: true,
                stats: {
                    totalUsers,
                    totalProperties,
                    totalBookings,
                    totalRevenue: totalRevenue[0]?.total || 0,
                },
            });
        }

        // Owner stats
        const ownerProperties = await Property.find({ owner: user.id }).select("_id");
        const propertyIds = ownerProperties.map((p) => p._id);

        const [totalBookings, totalRevenue, activeComplaints, avgRating] = await Promise.all([
            Booking.countDocuments({ property: { $in: propertyIds } }),
            Booking.aggregate([
                { $match: { property: { $in: propertyIds }, "payment.status": "completed" } },
                { $group: { _id: null, total: { $sum: "$amount.total" } } },
            ]),
            Complaint.countDocuments({
                property: { $in: propertyIds },
                status: { $in: ["open", "in-progress"] },
            }),
            Property.aggregate([
                { $match: { _id: { $in: propertyIds } } },
                { $group: { _id: null, avg: { $avg: "$avgRating" } } },
            ]),
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                totalProperties: ownerProperties.length,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                activeComplaints,
                avgRating: avgRating[0]?.avg || 0,
            },
        });
    } catch (error: any) {
        console.error("Get Dashboard Stats Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
