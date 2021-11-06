import mongoose, { Schema } from "mongoose";
import { UserModel } from "@models/user.model";

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true }
    }
)

export default mongoose.model<UserModel>('users', UserSchema)