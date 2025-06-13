import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/UserModel.js";
import connectToDB from "../utils/connectToDB.js";
import createError from "../utils/createError.js";

dotenv.config();
const JWT_TOKEN = process.env.JWT_TOKEN;
const NODE_ENV = process.env.NODE_ENV;

const MAX_AGE = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, JWT_TOKEN, { expiresIn: MAX_AGE });
};

export const register = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data?.email || !data?.password) {
            return next(createError(400, "Email or Password is missing!"));
        }

        await connectToDB();
        const alreadyRegistered = await User.exists({ email: data.email });
        if (alreadyRegistered) {
            return next(createError(409, "User Already Exists!"));
        }

        const newUser = new User({
            email: data.email,
            password: data.password,
        });
        await newUser.save();

        const isProduction = NODE_ENV === "production";
        res.cookie(
            "QuickChatAccessToken",
            createToken(data.email, newUser.id),
            {
                maxAge: MAX_AGE,
                secure: isProduction,
                sameSite: isProduction ? "None" : "Lax",
                httpOnly: true,
            }
        );

        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            image: newUser.image,
            profileSetup: newUser.profileSetup,
        });
    } catch (error) {
        return next(createError(500, "Internal Server Error"));
    }
};

export const login = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data?.email || !data?.password) {
            return next(createError(400, "Email or Password is missing!"));
        }

        await connectToDB();
        const user = await User.findOne({ email: data.email });
        if (!user) {
            return next(createError(401, "Invalid Email or Password"));
        }

        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            return next(createError(401, "Invalid Email or Password"));
        }

        const isProduction = NODE_ENV === "production";
        res.cookie("QuickChatAccessToken", createToken(data.email, user.id), {
            maxAge: MAX_AGE,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            httpOnly: true,
        });

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            profileSetup: user.profileSetup,
        });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal Server Error"));
    }
};

export const logout = async (req, res, next) => {
    const isProduction = NODE_ENV === "production";
    res.clearCookie("QuickChatAccessToken", {
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        httpOnly: true,
    });
    res.status(200).json("Logged out Successfully!");
};

export const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            profileSetup: user.profileSetup,
        });
    } catch (error) {
        console.log(error.message);
        return next(createError(500, "Internal Server Error"));
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { name } = req.body;

        if (!name) {
            return res.status(400).send("Name is required");
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                name: name,
                profileSetup: true,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            profileSetup: user.profileSetup,
        });
    } catch (error) {
        console.log(error.message);
        return next(createError(500, "Internal Server Error"));
    }
};

export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file || !req.file.filename) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const { userId } = req;
        const { image } = req.file?.filename;

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
            req.file.filename
        }`;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                image: imageUrl,
            },
            { new: true }
        );

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            image: imageUrl,
            profileSetup: user.profileSetup,
        });
    } catch (error) {
        console.log(error.message);
        return next(createError(500, "Internal Server Error"));
    }
};

export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;

        const user = await User.findByIdAndUpdate(
            userId,
            { image: "" },
            { new: true }
        );

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            profileSetup: user.profileSetup,
        });
    } catch (error) {
        console.log(error.message);
        return next(createError(500, "Internal Server Error"));
    }
};
