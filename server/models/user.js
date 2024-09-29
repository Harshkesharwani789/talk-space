import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide a Username"],
        trim: true,
        minlength: 4,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Please Provide a valid Email",
        },
    },
    password: {
        type: String,
        required: [true, "Please Provide Password"],
        minlength: 8,
        trim: true,
    },
});

export default mongoose.model("User", userSchema);

    