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

        res.status(200).json({ message: "Successfully posted", post: newPost })
        
        
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
            return res.status(404).json({ error: "Post not found" })
        }
        res.status(200).json(post)
    }
    catch (error) {
        res.status(401).json({ error: error.message });
        console.log(`Error: ${error.message}`)
    }
}

const deletePost = async(req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById({_id: postId});

        if(!post) {
            return res.status(404).json({ message: "Post Not Found" })
        }

        if(req.user._id.valueOf() != post.postedBy.valueOf()) {
            return res.status(401).json({ message: "Unauthorized to delete post" })
        }

        if(post.img) {
            let imgId = post.img.split("/").slice(-1)[0].split(".")[0]
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(post._id.valueOf());



        res.status(200).json({ message: "Post Deleted" })
    }
    catch (error) {
        res.status(401).json({ message: error.message });
        console.log(`Error in delete post: ${error.message}`)
    }
}

const likeUnlikePost = async(req, res) => {
    try {
        const postId = req.params.postId 
        const user = req.user 
        const post = await Post.findById(postId)
        if(!post) {
            res.status(404).json({ error: "Post not found" })
        }
        const isLiked = post.likes.filter((like) => like.userId.valueOf() == user._id);
        if(isLiked.length > 0) {
            post.likes = post.likes.filter((id) => id.userId.valueOf() != user._id.valueOf())
            await post.save()
            return res.status(200).json({ message: "Successfully Unliked"})
        }
        console.log(user._id.valueOf(), user._id)
        const like = {
            userId: user._id.valueOf(),
            username:user.username,
            userProfilePic:user.profilePic
        }
        post.likes.push(like)
        await post.save()
        res.status(200).json({ message: "Successfully liked", like})
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in LikePost: ${error.message}`)
    }
}

const replyPost = async(req, res) => {
    try {
        const { postId } = req.params;
        const user = req.user
        const { text } = req.body 

        const post = await Post.findById(postId)

        if(!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if(!text) {
            return res.status(404).json({ error: "Fill all fields" })
        }
        const reply = {
            userId: user._id,
            text:text,
            username:user.username,
            userProfilePic:user.profilePic
        }
        post.replies.push(reply)
        await post.save()

        res.status(200).json({ message: "Reply succesfully posted" , reply})

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