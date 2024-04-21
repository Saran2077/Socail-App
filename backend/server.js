import express from "express"
import 'dotenv/config'
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import messagesRoutes from "./routes/messagesRoutes.js"
import {v2 as cloudinary} from 'cloudinary';

connectDB();

const app = express()
const PORT = process.env.PORT

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

app.use(express.json({ limit: "50mb" })) // To parse JSON data in req.body
app.use(express.urlencoded({ extended: true })) // To parse the form data
app.use(cookieParser())

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messagesRoutes)

app.listen(PORT, () => console.log(`Server is Running at ${PORT}`))