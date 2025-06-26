import express from "express";
import http from "http";
import { Server } from "socket.io";

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import setupSocket from "./socket.js";
import connectToDB from "./utils/connectToDB.js";

import AuthRouter from "./routes/AuthRouter.js";
import ContactRouter from "./routes/ContactRouter.js";
import MessageRouter from "./routes/MessageRoute.js";
import ChannelRouter from "./routes/ChannelRouter.js";

dotenv.config();
const PORT = process.env.PORT || 3001;
const ORIGIN = process.env.ORIGIN;

const CORS_OPTIONS = {
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: CORS_OPTIONS });

app.use(cors(CORS_OPTIONS));
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", AuthRouter);
app.use("/api/contacts", ContactRouter);
app.use("/api/messages", MessageRouter);
app.use("/api/channels", ChannelRouter);

app.get("/", (req, res) => {
    res.send(`
        <div style="text-align:center; margin-top:20px;">
            <h1>Server is running.</h1>
        </div>
    `);
});

// Global Error Handler
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 505;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({ message });
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

await connectToDB();
setupSocket(io);
