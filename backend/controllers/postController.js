import Post from "../modals/postModel.js"
import User from "../modals/userModel.js"
import {v2 as  cloudinary}  from 'cloudinary'

const createPost = async(req, res) => {
    const id = req.user._id;
    try {
        const { text, img } = req.body;
        if(!text) {
            return res.status(401).json({ error: "Text is required" })
        }
        const newPost = new Post({
            postedBy: id,
            text: text,
        })
        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            newPost.img = uploadedResponse.secure_url;
        }
        await newPost.save();

        res.status(200).json({ message: "Successfully posted" })
        
        
    } catch (error) {
        res.status(404).json({ error: error.message });
        console.log(`Error: ${error.message}`)
    }
}

const getPost = async(req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId)
        if(!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        res.status(200).json(post)
    }
    catch (error) {
        res.status(401).json({ message: error.message });
        console.log(`Error: ${error.message}`)
    }
}

const deletePost = async(req, res) => {
    try {
        const postId = req.params.postId;
        console.log(postId)
        const post = await Post.findById({_id: postId});

        if(!post) {
            return res.status(404).json({ message: "Post Not Found" })
        }

        if(req.user._id.valueOf() != post.postedBy.valueOf()) {
            return res.status(401).json({ message: "Unauthorized to delete post" })
        }

        await Post.findByIdAndDelete(post._id.valueOf());



        res.status(200).json({ message: "Post Deleted" })
    }
    catch (error) {
        res.status(401).json({ message: error.message });
        console.log(`Error: ${error.message}`)
    }
}

const likeUnlikePost = async(req, res) => {
    try {
        const postId = req.params.postId 
        const userId = req.user._id 
        const post = await Post.findById(postId)

        if(!post) {
            res.status(404).json({ error: "Post not found" })
        }

        const isLiked = post.likes.includes(userId);

        if(isLiked) {
            post.likes = post.likes.filter((id) => id != userId.valueOf())
            await post.save()
            return res.status(200).json({ message: "Successfully Unliked"})
        }
        post.likes.push(userId)
        await post.save()
        res.status(200).json({ message: "Successfully liked"})
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in LikePost: ${error.message}`)
    }
}

const replyPost = async(req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id 
        const { text } = req.body 

        const post = await Post.findById(postId)

        if(!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if(!text) {
            return res.status(404).json({ error: "Fill all fields" })
        }
        const reply = {
            userId: userId,
            text:text,
            userProfilePic: req.user.profilePic, 
            username: req.user.username
        }
        post.replies.push(reply)
        await post.save()

        res.status(200).json({ message: "Reply succesfully posted" })

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in replyPost: ${error.message}`)
    }
}

const getFeedPosts = async(req, res) => {
    try {
        const following = req.user.following;

        const feedPosts = await Post.find({postedBy: {$in: following}}).sort({created: -1})
        res.status(200).json({feedPosts});
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUserPosts = async(req, res) => {
    try {

        const { username } = req.params 
        const id = await User.findOne({username: username})

        if (!id) {
            return res.status(404).json({ error: "User not found" })
        }

        const feedPosts = await Post.find({postedBy: id}).sort({created: -1})
        res.status(200).json({feedPosts});
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export { createPost, getPost, deletePost, likeUnlikePost, replyPost, getFeedPosts, getUserPosts }