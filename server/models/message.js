import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true, // Ensure sender is required
        },
        message: {
            type: String,
            trim: true,
            required: true, // Ensure message is required
        },
        chat: {
            type: mongoose.Types.ObjectId,
            ref: "Chat",
            required: true, // Ensure chat reference is required
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Message", messageSchema);
