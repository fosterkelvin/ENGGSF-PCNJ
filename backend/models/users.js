import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: false,
        default: null,
    },
    role: {
        type: String,
        required: true,
        default: "employee",
    },
})

const UserModel = mongoose.model("User", userSchema);

export { UserModel as Users}