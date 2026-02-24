import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";
import Booking from "@/models/Booking";
import connectDB from "@/lib/db";
import { authenticate } from "@/lib/auth";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "mock_key",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret",
});

// POST /api/payments/create-order
export async function POST(req: NextRequest) {
    try {
        const { user, error, status } = await authenticate(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error }, { status });
        }

        await connectDB();
        const body = await req.json();
        const { bookingId } = body;

        console.log(`[DEBUG] createOrder for Booking ID: ${bookingId}`);
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
        }

        if (booking.user.toString() !== user.id) {
            return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }

        const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.startsWith("your_");

        if (isMock) {
            console.log(`[DEBUG] Payment Mock Mode Active for booking ${bookingId}`);
            const mockOrder = {
                id: `order_mock_${Date.now()}`,
                amount: booking.amount.total * 100,
                currency: "INR",
                receipt: booking.invoiceNumber || `REC-${Date.now()}`,
                isMock: true,
            };

            booking.payment.razorpayOrderId = mockOrder.id;
            booking.payment.method = "razorpay";
            await booking.save();

            return NextResponse.json({
                success: true,
                order: mockOrder,
                isMock: true,
                key: "mock_key",
            });
        }

        const options = {
            amount: booking.amount.total * 100, // Razorpay expects paise
            currency: "INR",
            receipt: booking.invoiceNumber,
            notes: {
                bookingId: booking._id.toString(),
                userId: user.id,
            },
        };

        const order = await razorpay.orders.create(options);

        booking.payment.razorpayOrderId = order.id;
        booking.payment.method = "razorpay";
        await booking.save();

        return NextResponse.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error("[DEBUG] !! createOrder Razorpay Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}
