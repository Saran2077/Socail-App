import express from "express"
import 'dotenv/config'
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

connectDB();

const app = express()
const PORT = process.env.PORT

app.use(express.json()) // To parse JSON data in req.body
app.use(express.urlencoded({ extended: true })) // To parse the form data
app.use(cookieParser())

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.listen(PORT, () => console.log(`Server is Running at ${PORT}`))