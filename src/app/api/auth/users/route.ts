import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import User from "@/models/User";

// Only admins can get the list of users
export const GET = withAuth(async (req: NextRequest, params: any, user: any) => {
    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const role = url.searchParams.get("role");
        const search = url.searchParams.get("search");

        const skip = (page - 1) * limit;

        const query: any = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const [users, total] = await Promise.all([
            User.find(query).skip(skip).limit(limit).sort("-createdAt"),
            User.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error("Get Users Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}, ["admin"]); // Require admin role
