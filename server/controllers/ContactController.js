import createError from "../utils/createError.js";
import User from "../models/UserModel.js";

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
