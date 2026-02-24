import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
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
        title: {
            type: String,
            required: [true, "Complaint title is required"],
            trim: true,
            maxlength: 150,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: 1000,
        },
        category: {
            type: String,
            enum: [
                "maintenance",
                "cleanliness",
                "noise",
                "security",
                "billing",
                "staff",
                "food",
                "other",
            ],
            default: "other",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["open", "in-progress", "resolved", "closed"],
            default: "open",
        },
        aiClassification: {
            suggestedCategory: String,
            suggestedPriority: String,
            sentimentScore: Number,
            confidence: Number,
        },
        resolution: {
            text: String,
            resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            resolvedAt: Date,
        },
        images: [String],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
