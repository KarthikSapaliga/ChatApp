import express from "express";
import http from "http";
import { Server } from "socket.io";

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

import AuthRouter from "./routes/AuthRouter.js";
import ContactRouter from "./routes/ContactRouter.js";

dotenv.config();
const PORT = process.env.PORT || 3001;
// const ORIGIN = process.env.ORIGIN;

const ORIGIN = [
    "http://localhost:5173", // React (Vite)
    "http://127.0.0.1:5173", // Sometimes this is used
    "http://localhost:3000", // In case you test from another dev tool
    "http://localhost:5500", // If using Live Server
    "http://localhost:4000", // Postman sends requests from here logically
];

const CORS_OPTIONS = {
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: CORS_OPTIONS });

app.use(cors(CORS_OPTIONS));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", AuthRouter);
app.use("/api/contacts", ContactRouter);

app.get("/", (req, res) => {
    res.send("root route");
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
