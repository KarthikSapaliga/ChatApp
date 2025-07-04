import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.QuickChatAccessToken;
    if (!token) {
        return res.status(401).send("Authentication failed");
    }
    jwt.verify(token, process.env.JWT_TOKEN, (err, payload) => {
        if (err) return res.status(403).send("Token is not valid");
        req.userId = payload.userId;
        next();
    });
};
