import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Please provide email and password" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await (user as any).matchPassword(password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = (user as any).getSignedJwtToken();

        return NextResponse.json(
            {
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                },
            }
        );
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}
