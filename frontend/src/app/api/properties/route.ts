import { NextResponse, NextRequest } from "next/server";
import Property from "@/models/Property";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

// GET /api/properties - Get all properties with filters
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const url = new URL(req.url);

        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "12");
        const skip = (page - 1) * limit;

        const query: any = { active: true };

        // Filters
        if (url.searchParams.get("city"))
            query["location.city"] = { $regex: url.searchParams.get("city"), $options: "i" };
        if (url.searchParams.get("type")) query.type = url.searchParams.get("type");
        if (url.searchParams.get("gender")) query.gender = url.searchParams.get("gender");
        if (url.searchParams.get("verified"))
            query.verified = url.searchParams.get("verified") === "true";

        const minPrice = url.searchParams.get("minPrice");
        const maxPrice = url.searchParams.get("maxPrice");

        if (minPrice || maxPrice) {
            query["pricing.startingFrom"] = {};
            if (minPrice) query["pricing.startingFrom"].$gte = parseInt(minPrice);
            if (maxPrice) query["pricing.startingFrom"].$lte = parseInt(maxPrice);
        }

        const amenities = url.searchParams.get("amenities");
        if (amenities) {
            const amenitiesList = amenities.split(",");
            query.amenities = { $all: amenitiesList };
        }

        const search = url.searchParams.get("search");
        if (search) {
            query.$text = { $search: search };
        }

        // Sort
        let sort = "-createdAt";
        const sortParam = url.searchParams.get("sort");
        if (sortParam === "price-low") sort = "pricing.startingFrom";
        if (sortParam === "price-high") sort = "-pricing.startingFrom";
        if (sortParam === "rating") sort = "-avgRating";
        if (sortParam === "popular") sort = "-totalReviews";

        const [properties, total] = await Promise.all([
            Property.find(query).populate("owner", "name email").skip(skip).limit(limit).sort(sort),
            Property.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            properties,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Get Properties Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}

// POST /api/properties - Create a property
export async function POST(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        // Allow owners and admins to create properties
        if (user.role !== "owner" && user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        await connectDB();
        const body = await req.json();

        // Attach user ID as owner
        body.owner = user.id;

        const property = await Property.create(body);

        return NextResponse.json({ success: true, property }, { status: 201 });
    } catch (error: any) {
        console.error("Create Property Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
