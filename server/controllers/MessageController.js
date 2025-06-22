import Message from "../models/MessageModel.js";
import createError from "../utils/createError.js";
import { imagekit } from "../config/imagekit.js";
import path from "path";

export const getMessages = async (req, res, next) => {
    console.log(">> get the messages");

    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            return next(createError(400, "Both users id required"));
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });

        return res.status(200).json({ messages });
    } catch (error) {
        return next(createError(500, "Internal server error"));
    }
};

export const uploadFile = async (req, res, next) => {
    console.log(">> upload file");
    try {
        console.log("req.file:", req.file);

        if (!req.file) {
            return next(createError(400, "File is required"));
        }

        const uniqueSuffix = Date.now() + Math.round(Math.random() + 1e9);
        const newFileName =
            req.file.fieldname +
            uniqueSuffix +
            "-" +
            path.basename(req.file.originalname);

        console.log("uploading: ", newFileName);
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: newFileName,
            folder: "/chat-uploads",
        });

        console.log({ uploadResponse });

        return res.status(200).json({ fileUrl: uploadResponse.url });
    } catch (error) {
        return next(createError(500, "Internal server error"));
    }
};
