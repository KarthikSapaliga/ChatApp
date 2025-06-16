import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import {
    searchContacts,
    getContacts,
    getAllContacts,
} from "../controllers/ContactController.js";

const ContactRouter = express.Router();

ContactRouter.post("/search", verifyToken, searchContacts);
ContactRouter.get("/get-contacts", verifyToken, getContacts);
ContactRouter.get("/get-all-contacts", verifyToken, getAllContacts);

export default ContactRouter;
