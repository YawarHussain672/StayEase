import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, email, password, role, phone } = body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "Email already registered" },
                { status: 400 }
            );
        }

        const user = await User.create({ name, email, password, role: role || "user", phone });

        // This invokes schema method
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
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}
