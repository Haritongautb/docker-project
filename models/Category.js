import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
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
    viewsCount: {
        type: Number,
        default: 0
    }
})

export default mongoose.model("Category", CategorySchema);