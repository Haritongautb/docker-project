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
    }
}, {
    timestamps: true
}
);

export default mongoose.model("Post", PostSchema);