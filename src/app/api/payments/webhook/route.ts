import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import Booking from "@/models/Booking";
import connectDB from "@/lib/db";

// POST /api/payments/webhook
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Webhooks often need the raw body for signature verification
        const rawBody = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json({ success: false, error: "Missing signature or secret" }, { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(rawBody)
            .digest("hex");

        if (signature !== expectedSignature) {
            return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
        }

        const body = JSON.parse(rawBody);
        const event = body.event;
        const payment = body.payload?.payment?.entity;

        if (event === "payment.captured" && payment) {
            await Booking.findOneAndUpdate(
                { "payment.razorpayOrderId": payment.order_id },
                {
                    status: "confirmed",
                    "payment.status": "completed",
                    "payment.razorpayPaymentId": payment.id,
                    "payment.paidAt": new Date(),
                }
            );
        }

        if (event === "payment.failed" && payment) {
            await Booking.findOneAndUpdate(
                { "payment.razorpayOrderId": payment.order_id },
                { "payment.status": "failed" }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
