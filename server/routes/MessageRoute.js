import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessageController.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() + 1e9);
        const newFileName =
            file.fieldname +
            uniqueSuffix +
            "-" +
            path.basename(file.originalname);

        cb(null, newFileName);
    },
});
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
