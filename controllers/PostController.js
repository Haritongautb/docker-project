import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 }).populate({
            "path": 'user',
            "select": "_id email fullName"
        }).exec();

        return res.json(posts);
    } catch (error) {
        return res.status(500).json({
            message: "Couldn't find posts"
        })
    }
}

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            user: req.body.userID,
            category: req.body.category
        });

        const post = await doc.save();

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create an post"
        })
    }
}

export const getOnePost = async (req, res) => {
    try {
        const updatedDoc = await PostModel.findByIdAndUpdate(
            {
                _id: req.params.id
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                new: true
            }
        )
            .populate("user")
            .exec();

        if (!updatedDoc) {
            return res.status(404).json({
                message: "Couldn't find post"
            });
        };

        return res.json(updatedDoc);

    } catch (error) {
        return res.status(500).json({
            message: "Couldn't find post"
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        const updatedDoc = await PostModel.findByIdAndUpdate(
            {
                _id: req.params.id
            },
            {
                title: req.body.title,
                text: req.body.text,
                date: new Date(),
                category: req.body.category,
                user: req.body.userID
            },
            {
                new: true
            }
        );

        if (!updatedDoc) {
            return res.status(404).json({
                message: "Couldn't find post"
            });
        };

        return res.json({
            ...updatedDoc._doc,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Couldn't find post"
        })
    }
};


export const deletePost = async (req, res) => {
    try {

        const deletedDoc = await PostModel.findByIdAndDelete(req.params.id);

        if (!deletedDoc) {
            return res.status(404).json({
                message: "Couldn't find post"
            });
        };

        return res.json({
            ...deletedDoc._doc,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "Couldn't find post"
        })
    }
};

export const toggleReaction = async (req, res) => {
    const postId = req.params.id;
    const reactionType = req.params.reaction;
    const userId = req.body.userID;
    try {
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const isUserReaction = post[`${reactionType}dBy`].includes(userId);

        if (isUserReaction) {
            post[`${reactionType}s`] -= 1;
            post[`${reactionType}dBy`] = post[`${reactionType}dBy`].filter(id => id.toString() !== userId);
        } else {
            console.log("else");
            post[`${reactionType}s`] += 1;
            post[`${reactionType}dBy`].push(userId);
        }

        await post.save();

        return res.json(post);
    } catch (error) {
        return res.status(500).json({ message: `Error ${reactionType}ing the post` });
    }
};
