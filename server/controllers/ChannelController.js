import createError from "../utils/createError.js";
import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import mongoose from "mongoose";

export const createChannel = async (req, res, next) => {
    console.log(">> create channel");
    try {
        const { name, members } = req.body;
        const userId = req.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return next(createError(400, "Admin not found"));
        }

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return next(createError(400, "Some Members are not valid Users"));
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();
        return res.status(201).json({ channel: newChannel });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal Server Error"));
    }
};

export const getUserChannels = async (req, res, next) => {
    console.log(">> get user channels");
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        });

        return res.status(201).json({ channels });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal Server Error"));
    }
};

export const getChannelMessages = async (req, res, next) => {
    console.log(">> get channel messages");
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate:{
                path:"sender",
                select: "_id name email image",
            }
        });

        if (!channel) {
            return next(createError(404, "Channel Not Found"));
        }

        return res.status(200).json({ messages:channel.messages });
    } catch (error) {
        console.log(error);
        return next(createError(500, "Internal Server Error"));
    }
};
