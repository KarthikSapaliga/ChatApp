import createError from "../utils/createError.js";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";
import mongoose from "mongoose";

export const searchContacts = async (req, res, next) => {
    try {
        const { searchQuery } = req.body;
        console.log("controller triggered for searchQuery: ", searchQuery);
        if (!searchQuery) {
            return next(createError(404, "Search Query is required"));
        }

        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                {
                    $or: [
                        { name: { $regex: searchQuery, $options: "i" } },
                        { email: { $regex: searchQuery, $options: "i" } },
                    ],
                },
            ],
        }).select("-password");

        console.log("contacts");
        console.log(contacts);

        res.status(200).json(contacts);
    } catch (error) {
        console.log(error.message);
        return next(createError(500, "Internal server error"));
    }
};

export const getContacts = async (req, res, next) => {
    console.log(">> get contacts list");

    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                    lastMessageText: {
                        $first: {
                            $cond: {
                                if: { $eq: ["$messageType", "text"] },
                                then: "$content",
                                else: "[File]",
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    lastMessageText: 1,
                    email: "$contactInfo.email",
                    name: "$contactInfo.name",
                    image: "$contactInfo.image",
                },
            },
            {
                $sort: {
                    lastMessageTime: -1,
                },
            },
        ]);

        console.log("contacts");
        console.log(contacts);

        res.status(200).json(contacts);
    } catch (error) {
        console.log(error.message);
        return next(createError(500, "Internal server error"));
    }
};
