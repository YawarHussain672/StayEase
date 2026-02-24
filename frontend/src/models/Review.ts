import mongoose from "mongoose";
import Property from "./Property";

const reviewSchema = new mongoose.Schema(
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
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        text: {
            type: String,
            required: [true, "Review text is required"],
            maxlength: 1000,
        },
        sentiment: {
            score: { type: Number, default: 0 }, // -1 to 1
            label: { type: String, enum: ["positive", "negative", "neutral"], default: "neutral" },
        },
        flagged: {
            type: Boolean,
            default: false,
        },
        flagReason: {
            type: String,
            default: "",
        },
        helpful: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews
reviewSchema.index({ user: 1, property: 1 }, { unique: true });

// Update property avg rating after save
reviewSchema.statics.calcAverageRating = async function (propertyId) {
    const stats = await this.aggregate([
        { $match: { property: propertyId, flagged: false } },
        {
            $group: {
                _id: "$property",
                avgRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Property.findByIdAndUpdate(propertyId, {
            avgRating: Math.round(stats[0].avgRating * 10) / 10,
            totalReviews: stats[0].totalReviews,
        });
    } else {
        await Property.findByIdAndUpdate(propertyId, { avgRating: 0, totalReviews: 0 });
    }
};

reviewSchema.post("save", function (this: any) {
    (this.constructor as any).calcAverageRating(this.property);
});

(reviewSchema as any).post("deleteOne", { document: true }, function (this: any) {
    (this.constructor as any).calcAverageRating(this.property);
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
