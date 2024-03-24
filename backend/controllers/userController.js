import User from '../modals/userModel.js'
import bcrypt  from "bcryptjs"

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

export default signUpUser;