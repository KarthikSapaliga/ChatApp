import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import {
    createChannel,
    getUserChannels,
    getChannelMessages,
} from "../controllers/ChannelController.js";

const ChannelRouter = express.Router();

ChannelRouter.post("/create-channel", verifyToken, createChannel);
ChannelRouter.get("/get-user-channel", verifyToken, getUserChannels);
ChannelRouter.get(
    "/get-channel-messages/:channelId",
    verifyToken,
    getChannelMessages
);

export default ChannelRouter;
