import express from "express";
import { signUpUser, loginUser, logoutUser, followUnfollowUser, getUserById, updateUser, getUserProfile } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router()

router.post("/signup", signUpUser)

router.post("/login", loginUser)

router.post("/logout", logoutUser)

router.post("/followUnfollow/:id", protectRoute, followUnfollowUser)

router.put("/update/:id", protectRoute, updateUser)

router.get("/getUserProfile/:username", getUserProfile)

router.get("/getUser/:id", getUserById)

export default router;