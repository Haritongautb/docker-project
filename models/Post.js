import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        required: true,
        type: String
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    disLikes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    disLikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
}
);

export default mongoose.model("Post", PostSchema);