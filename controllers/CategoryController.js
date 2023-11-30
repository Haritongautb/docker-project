import PostModel from "../models/Post.js";
import CategoryModel from "../models/Category.js";


export const createCategories = async (req, res) => {
    try {
        const categories = {};
        const allPosts = await PostModel.find();
        await CategoryModel.deleteMany({});

        allPosts.map(post => {
            const { category, viewsCount, likes, disLikes } = post;
            if (!categories.hasOwnProperty(category)) {
                return categories[category] = {
                    viewsCount,
                    likes,
                    disLikes
                };
            };

            categories[category].viewsCount += viewsCount;
            categories[category].likes += likes;
            categories[category].disLikes += disLikes;
        });

        for (const [key, value] of Object.entries(categories)) {
            const doc = new CategoryModel({
                category: key,
                likes: value.likes,
                disLikes: value.disLikes,
                viewsCount: value.viewsCount
            });

            await doc.save();
        }

        const newCategories = await CategoryModel.find();
        return res.json(newCategories);
    } catch (error) {
        return res.status(500).json({
            message: "Something is wrong"
        })
    }
}

export const deleteAll = async (req, res) => {
    try {
        await CategoryModel.deleteMany({});
        return res.json({
            message: "All posts have been deleted"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something is wrong"
        })
    }
}