import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        checkIn: {
            type: Date,
            required: [true, "Check-in date is required"],
        },
        checkOut: {
            type: Date,
            required: [true, "Check-out date is required"],
        },
        guests: {
            type: Number,
            default: 1,
            min: 1,
        },
        amount: {
            subtotal: { type: Number, required: true },
            tax: { type: Number, default: 0 },
            discount: { type: Number, default: 0 },
            total: { type: Number, required: true },
        },
        payment: {
            method: { type: String, enum: ["razorpay", "cash", "bank-transfer"] },
            status: {
                type: String,
                enum: ["pending", "completed", "failed", "refunded"],
                default: "pending",
            },
            razorpayOrderId: String,
            razorpayPaymentId: String,
            razorpaySignature: String,
            paidAt: Date,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "checked-in", "checked-out", "cancelled"],
            default: "pending",
        },
        specialRequests: {
            type: String,
            maxlength: 500,
        },
        invoiceNumber: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

// Generate invoice number
bookingSchema.pre("save", async function () {
    if (!this.invoiceNumber) {
        this.invoiceNumber =
            "SE-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            Math.random().toString(36).substring(2, 6).toUpperCase();
    }
});

// Validate dates
bookingSchema.pre("validate", async function () {
    if (this.checkOut <= this.checkIn) {
        this.invalidate("checkOut", "Check-out date must be after check-in date");
    }
});

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
