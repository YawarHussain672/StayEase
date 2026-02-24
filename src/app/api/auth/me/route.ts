import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req, params, user) => {
    try {
        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error("GetMe Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server Error" },
            { status: 500 }
        );
    }
});
