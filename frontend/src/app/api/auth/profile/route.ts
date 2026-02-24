import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import User from "@/models/User";

export const PUT = withAuth(async (req: NextRequest, params: any, user: any) => {
    try {
        const body = await req.json();
        const { name, phone, avatar, preferences } = body;

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { name, phone, avatar, preferences },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error: any) {
        console.error("Update Profile Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server Error" },
            { status: 500 }
        );
    }
});
