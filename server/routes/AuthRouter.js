import express from "express";
import multer from "multer";
import path from "path";

import {
    login,
    register,
    logout,
    getUserInfo,
    updateProfile,
    addProfileImage,
    removeProfileImage,
} from "../controllers/AuthController.js";

import { verifyToken } from "../middleware/AuthMiddleware.js";

const AuthRouter = express.Router();

const storage = multer.memoryStorage();

const uploads = multer({ storage });

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
AuthRouter.get("/user-info", verifyToken, getUserInfo);
AuthRouter.post("/update-profile", verifyToken, updateProfile);
AuthRouter.post(
    "/update-profile-image",
    verifyToken,
    uploads.single("profileImage"),
    addProfileImage
);
AuthRouter.delete("/update-profile-image", verifyToken, removeProfileImage);

export default AuthRouter;
