import Message from "./models/MessageModel.js";

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
        console.log("_________________________________________________");
        console.log("🟢[server] Message: ");
        console.log(message);

        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createdMessage = await Message.create(message);
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email name image")
            .populate("recipient", "id email name image");

        console.log("👉 messageData:");
        console.log(messageData);
        console.log("_________________________________________________");

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
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
            `User connected: UserId:${userId} with SockerId:${socket.id}`
        );

        //=========Send Messages================
        socket.on("sendMessage", (message) => sendMessage(message));

        // =========Disconnection===============
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
