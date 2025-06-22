import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessageController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const uploads = multer({ storage });

const MessageRouter = express.Router();

MessageRouter.post("/get-messages", verifyToken, getMessages);
MessageRouter.post(
    "/upload-file",
    verifyToken,
    uploads.single("file"),
    uploadFile
);

export default MessageRouter;
