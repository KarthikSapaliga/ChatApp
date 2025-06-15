import Message from "../models/MessageModel.js";
import createError from "../utils/createError.js";

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
        // console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        if (!req.file) {
            return next(createError(400, "File is required"));
        }

        // const { recipientId } = req.body;
        // const senderId = req.userId;

        // if (!recipientId || !senderId) {
        //     return next(createError(400, "Sender and recipient are required"));
        // }

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
            req.file.filename
        }`;

        // const message = new Message({
        //     sender: senderId,
        //     recipient: recipientId,
        //     messageType: "file",
        //     fileUrl,
        // });

        // await message.save();

        console.log({ fileUrl });

        return res.status(200).json({ fileUrl });
    } catch (error) {
        return next(createError(500, "Internal server error"));
    }
};
