import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarURL: String,
    role: {
        enum: ['admin', 'owner', 'user'],
        type: String,
        default: 'user'
    },
    subscribed: {
        type: Boolean,
        default: false
    },
    receipts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Receipt"
        }
    ]
}, {
    timestamps: true
});


export default mongoose.model("User", UserSchema);