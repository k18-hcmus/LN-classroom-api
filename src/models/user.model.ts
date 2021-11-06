import mongoose from "mongoose"

export type UserModel = mongoose.Document & {
    name: string;
}