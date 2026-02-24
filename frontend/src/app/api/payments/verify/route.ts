import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import Booking from "@/models/Booking";
import connectDB from "@/lib/db";

// POST /api/payments/verify
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, isMock } = body;

        if (
            isMock ||
            !process.env.RAZORPAY_KEY_SECRET ||
            process.env.RAZORPAY_KEY_SECRET === "your_razorpay_key_secret"
        ) {
            console.log(`[DEBUG] Verifying Mock Payment for booking ${bookingId}`);
            // Bypass signature verification for mock
        } else {
            const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(signatureBody.toString())
                .digest("hex");

            const isAuthentic = expectedSignature === razorpay_signature;

            if (!isAuthentic) {
                return NextResponse.json(
                    { success: false, error: "Payment verification failed" },
                    { status: 400 }
                );
            }
        }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                status: "confirmed",
                "payment.status": "completed",
                "payment.razorpayPaymentId": razorpay_payment_id,
                "payment.razorpaySignature": razorpay_signature,
                "payment.paidAt": new Date(),
            },
            { new: true }
        )
            .populate("property", "name location images")
            .populate("room", "name type price");

        return NextResponse.json({ success: true, booking });
    } catch (error: any) {
        console.error("Verify Payment Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
