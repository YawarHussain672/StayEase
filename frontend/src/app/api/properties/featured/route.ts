import { NextResponse, NextRequest } from "next/server";
import Property from "@/models/Property";
import connectDB from "@/lib/db";

// GET /api/properties/featured - Get featured/popular properties for homepage
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const featured = await Property.find({ active: true, verified: true, featured: true })
            .limit(8)
            .sort("-avgRating");

        const popular = await Property.find({ active: true, verified: true })
            .limit(8)
            .sort("-totalReviews");

        const cities = await Property.aggregate([
            { $match: { active: true } },
            {
                $group: {
                    _id: "$location.city",
                    count: { $sum: 1 },
                    avgPrice: { $avg: "$pricing.startingFrom" },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 8 },
        ]);

        return NextResponse.json({ success: true, featured, popular, cities });
    } catch (error: any) {
        console.error("Get Featured Properties Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
