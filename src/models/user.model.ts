import mongoose from "mongoose"

export type UserModel = mongoose.Document & {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    isActive?: boolean
}