import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";

const userSocketMap = new Map();

const setupSocket = (io) => {
    const disconnect = (socket) => {
        console.log(`Client disconnected:${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socket.id === socketId) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createdMessage = await Message.create(message);
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email name image")
            .populate("recipient", "id email name image");

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    };

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;

        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: Date.now(),
            fileUrl,
        });

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email name image")
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });

        const channel = await Channel.findById(channelId)
            .populate("members")
            .populate("admin");
        const finalData = { ...messageData._doc, channelId: channel._id };

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit(
                        "recieveChannelMessage",
                        finalData
                    );
                }
            });
            const adminSocketId = userSocketMap.get(
                channel.admin._id.toString()
            );
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieveChannelMessage", finalData);
            }
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (!userId) {
            console.log("User ID not provided during connection");
            return;
        }

        userSocketMap.set(userId, socket.id);

        console.log(
            `User connected: UserId:${userId} with SocketId:${socket.id}`
        );

        //=========Send Messages================
        socket.on("sendMessage", (message) => sendMessage(message));
        socket.on("sendChannelMessage", (message) =>
            sendChannelMessage(message)
        );

        // =========Disconnection===============
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
