import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { searchContacts } from "../controllers/ContactController.js";

const ContactRouter = express.Router();

ContactRouter.post("/search", verifyToken, searchContacts);

export default ContactRouter;
