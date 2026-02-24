import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/db";

// Helper to authenticate a Next.js API Request
export async function authenticate(req: NextRequest) {
    await connectDB();

    let token;
    const authHeader = req.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return { user: null, error: "Not authorized, no token provided", status: 401 };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return { user: null, error: "Not authorized, user not found", status: 401 };
        }

        return { user, error: null, status: 200 };
    } catch (error: any) {
        return { user: null, error: `Not authorized, token failed: ${error.message}`, status: 401 };
    }
}

// Wrapper for route handlers requiring authentication
export function withAuth(
    handler: (req: NextRequest, context: any, user: any) => Promise<NextResponse>,
    allowedRoles?: string[]
) {
    return async (req: NextRequest, context: any) => {
        const { user, error, status } = await authenticate(req);

        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return NextResponse.json(
                { success: false, error: `Role '${user.role}' is not authorized` },
                { status: 403 }
            );
        }

        return handler(req, context, user);
    };
}
