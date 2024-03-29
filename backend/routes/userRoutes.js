import express from "express";
import { signUpUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router()

router.post("/signup", signUpUser)

router.post("/login", loginUser)

router.post("/logout", logoutUser)

router.post("/followUnfollow/:id", protectRoute, followUnfollowUser)

router.post("/update/:id", protectRoute, updateUser)

router.post("/getUserProfile/:username", getUserProfile)

export default router;