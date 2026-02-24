import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Property name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        type: {
            type: String,
            required: true,
            enum: ["hostel", "pg", "budget-hotel", "co-living"],
        },
        gender: {
            type: String,
            enum: ["male", "female", "coed"],
            default: "coed",
        },
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true, index: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
            nearbyPlaces: [String],
        },
        images: [
            {
                url: { type: String, required: true },
                caption: { type: String, default: "" },
                category: {
                    type: String,
                    enum: ["room", "washroom", "common-area", "exterior", "neighborhood"],
                    default: "room",
                },
            },
        ],
        amenities: [
            {
                type: String,
                enum: [
                    "wifi",
                    "ac",
                    "parking",
                    "laundry",
                    "meals",
                    "gym",
                    "cctv",
                    "power-backup",
                    "water-purifier",
                    "tv",
                    "fridge",
                    "geyser",
                    "study-room",
                    "recreation",
                    "housekeeping",
                    "security",
                ],
            },
        ],
        rules: [String],
        pricing: {
            startingFrom: { type: Number, required: true },
            securityDeposit: { type: Number, default: 0 },
            mealPlan: {
                available: { type: Boolean, default: false },
                price: { type: Number, default: 0 },
            },
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        avgRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        totalRooms: {
            type: Number,
            default: 0,
        },
        availableRooms: {
            type: Number,
            default: 0,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        featured: {
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
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Generate slug from name
propertySchema.pre("save", async function () {
    if (this.isModified("name")) {
        this.slug =
            this.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") +
            "-" +
            Date.now().toString(36);
    }
});

// Virtual for rooms
propertySchema.virtual("rooms", {
    ref: "Room",
    localField: "_id",
    foreignField: "property",
    justOne: false,
});

// Index for geo queries and text search
propertySchema.index({ "location.city": 1, "pricing.startingFrom": 1 });
propertySchema.index({ name: "text", description: "text", "location.city": "text" });

export default mongoose.models.Property || mongoose.model("Property", propertySchema);
