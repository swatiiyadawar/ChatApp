import express from "express";
import { login, logout, signup,updateProfile,checkAuth,getProfile } from "../contorllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router=express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute, updateProfile);
router.get('/get-profile', getProfile); // i have done this change
router.get("/check",protectRoute,checkAuth);

export default router;
