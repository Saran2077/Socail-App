import mongoose from 'mongoose';
import User from '../modals/userModel.js'
import bcrypt  from "bcryptjs"
import Post from '../modals/postModel.js'
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js"
import {v2 as cloudinary} from "cloudinary"

const signUpUser = async(req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({$or:[{email}, {username}]});
        if (user) {
            return res.status(400).json({ error: "User already exists"})
        }
        // Hash the password before saving to database
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword
        })

        await newUser.save()

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            res.status(201).json({
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                profilePic: newUser.profilePic,
                bio: newUser.bio,
                email: newUser.email,
                following: newUser.following,
                followers: newUser.followers,
            })
        }
        else {
            res.status(400).json({error: "Invalid user data"})
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in signUpUser: ${error.message}`)
    }
}

const loginUser = async(req, res) => {
    try {
        const {username, password} = req.body
        const salt = await bcrypt.genSalt(10)
        const userData = await User.findOne({username: username})
        const hashedPassword = await bcrypt.compare(password, userData?.password || "");
        if (hashedPassword) {
            console.log(username, password)
            generateTokenAndSetCookie(userData._id, res)
            res.status(200).json({
                id: userData._id,
                name: userData.name,
                username: userData.username,
                profilePic: userData.profilePic,
                bio: userData.bio,
                email: userData.email,
                following: userData.following,
                followers: userData.followers,
            })
        }
        else {
            res.status(400).json({error: "Invalid username or password"})
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error: ${error.message}`)
    }
}

const logoutUser = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:1})
        res.status(200).json({ message: "Logout Successfully" })
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error: ${error.message}`)
    }

}

const followUnfollowUser = async(req, res) => {
    try {
        const { id } = req.params;
        const currentUser = await User.findById(req.user._id);
        const userToModify = await User.findById(id);

        if(id==req.user._id) {
            return res.status(400).json({ error: "You cannot follow yourself"})
        }  

        if(!currentUser || !userToModify) {
            return res.status(401).json({ error: "User not Found" })
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow by removing the user from the following array 
            currentUser.following = currentUser.following.filter((userId) => userId != id)
            await currentUser.save();

            userToModify.followers = userToModify.followers.filter((userId) => userId != currentUser._id)
            await userToModify.save();
            res.status(200).json({ message: "Successfully unfollowed"})
        }
        else {
            currentUser.following.push(id)
            await currentUser.save();

            userToModify.followers.push(currentUser._id)
            await userToModify.save();

            res.status(200).json({ message: "Successfully followed"})
        }
         
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error: ${error.message}`)
    }
}

const updateUser = async(req, res) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(401).json({ error: "User not found" })
        }

        if(userId != req.params.id) {
            return res.status(400).json({ error: "You cannot update the profile of another user"})
        }
        if(password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword
        }
        if(profilePic) {
            if(user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }
            const uploaderImage = await cloudinary.uploader.upload(profilePic);
            profilePic = uploaderImage.secure_url
        }
        user.name = name || user.name
        user.email = email || user.email
        user.username = username || user.username
        user.profilePic = profilePic || user.profilePic
        user.bio = bio || user.bio
        await user.save()

        await Post.updateMany(
            {"replies.userId":userId},
            {
                $set: {
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.profilePic
                }
            },
            {
                arrayFilters:[{"reply.userId": userId}]
            }
        )
        await Post.updateMany(
            {"likes.userId":userId},
            {
                $set: {
                    "likes.$[like].username": user.username,
                    "likes.$[like].userProfilePic": user.profilePic
                }
            },
            {
                arrayFilters:[{"like.userId": userId}]
            }
        )

        res.status(200).json({
            id: user._id,
            name: user.name,
            username: user.username,
            profilePic: user.profilePic,
            bio: user.bio,
            email: user.email,
            following: user.following,
            followers: user.followers,
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error: ${error.message}`)
    }
}

const getUserProfile = async(req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password")
        if(!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in getUserProfile: ${error.message}`)
    }
}

const getUserById = async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password")
        if(!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in getUserProfile: ${error.message}`)
    }
}

const searchUserByUsername = async(req, res) => {
    try {
        const { username } = req.body
        const users = await User.find({username: { $regex: new RegExp(username, 'i') }})
        if (!users) {
            res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


export{ signUpUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile, getUserById, searchUserByUsername };