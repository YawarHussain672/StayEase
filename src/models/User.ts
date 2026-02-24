import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
            maxlength: [50, "Name cannot be more than 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "owner", "admin"],
            default: "user",
        },
        phone: {
            type: String,
            match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
        },
        avatar: {
            type: String,
            default: "",
        },
        preferences: {
            city: String,
            budget: { min: Number, max: Number },
            amenities: [String],
            gender: { type: String, enum: ["male", "female", "coed", ""] },
        },
        savedProperties: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Property",
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before save
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id.toString(), role: this.role },
        process.env.JWT_SECRET as string,
        {
            expiresIn: (process.env.JWT_EXPIRE || "7d") as any,
        }
    );
};

// Next.js hot reload safe export
export default mongoose.models.User || mongoose.model("User", userSchema);
