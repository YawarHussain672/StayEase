import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        name: {
            type: String,
            required: [true, "Room name is required"],
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["single", "double", "triple", "dormitory", "deluxe", "suite"],
        },
        price: {
            daily: { type: Number, required: true },
            weekly: { type: Number },
            monthly: { type: Number },
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        amenities: [String],
        images: [String],
        totalBeds: {
            type: Number,
            required: true,
            min: 1,
        },
        availableBeds: {
            type: Number,
            required: true,
            min: 0,
        },
        ac: {
            type: Boolean,
            default: false,
        },
        attached_bathroom: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
