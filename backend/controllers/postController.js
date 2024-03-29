import Post from "../modals/postModel.js"

const createPost = async(req, res) => {
    const id = req.user._id;
    try {
        const { text, img } = req.body;
        if(!text) {
            return res.status(401).json({ message: "Text is required" })
        }
        const newPost = new Post({
            postedBy: id,
            text: text,
        })
        if(img) {
            newPost.img = img;
        }
        await newPost.save();

        res.status(200).json({ message: "Successfully posted" })
        
        
    } catch (error) {
        res.status(404).json({ message: error.message });
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

export { createPost, getPost, deletePost }