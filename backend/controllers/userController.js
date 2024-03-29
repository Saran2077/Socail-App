import mongoose from 'mongoose';
import User from '../modals/userModel.js'
import bcrypt  from "bcryptjs"
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js"

const signUpUser = async(req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({$or:[{email}, {username}]});
        if (user) {
            return res.status(400).json({ message: "User already exists"})
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
                email: newUser.email
            })
        }
        else {
            res.status(400).json({message: "Invalid user data"})
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
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
            generateTokenAndSetCookie(userData._id, res)
            res.status(200).json({
                id: userData._id,
                name: userData.name,
                username: userData.username,
                email: userData.email
            })
        }
        else {
            res.status(400).json({message: "Invalid username or password"})
        }
    }
    catch (error) {
        console.log(`Error: ${error.message}`)
    }
}

const logoutUser = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:1})
        res.status(200).json({ message: "Logout Successfully" })
    }
    catch (error) {
        console.log(`Error: ${error.message}`)
    }

}

const followUnfollowUser = async(req, res) => {
    try {
        const { id } = req.params;
        const currentUser = await User.findById(req.user._id);
        const userToModify = await User.findById(id);

        if(id==req.user._id) {
            return res.status(400).json({ message: "You cannot follow yourself"})
        }  

        if(!currentUser || !userToModify) {
            return res.status(401).json({ message: "User not Found" })
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow by removing the user from the following array 
            currentUser.following = currentUser.following.filter((userId) => userId != id)
            await currentUser.save();

            userToModify.followers = userToModify.followers.filter((userId) => userId != currentUser._id)
            await userToModify.save();
            res.status(200).json({ message: "Success unfollowed"})
        }
        else {
            currentUser.following.push(id)
            await currentUser.save();

            userToModify.followers.push(currentUser._id)
            await userToModify.save();

            res.status(200).json({ message: "Success followed"})
        }
         
    }
    catch (error) {
        console.log(`Error: ${error.message}`)
    }
}

const updateUser = async(req, res) => {
    const { name, email, username, password, profilePic, bio } = req.body;
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(401).json({ message: "User not found" })
        }

        if(userId != req.params.id) {
            return res.status(400).json({ message: "You cannot update the profile of another user"})
        }
        if(password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword
        }
        user.name = name || user.name
        user.email = email || user.email
        user.username = username || user.username
        user.profilePic = profilePic || user.profilePic
        user.bio = bio || user.bio
        await user.save()

        res.status(200).json({ message: "Profile Updated Successfully" })

    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(`Error: ${error.message}`)
    }
}

const getUserProfile = async(req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password")
        if(!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in getUserProfile: ${error.message}`)
    }
}


export{ signUpUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile };