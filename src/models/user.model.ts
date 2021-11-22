import mongoose from "mongoose"

export type UserModel = mongoose.Document & {
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    isActive?: boolean,
    provider: string,
    studentId?: string
}

export interface UserDocument extends UserModel {
    comparePassword: (password: string) => boolean
}