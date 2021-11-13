import mongoose from "mongoose"

export type RefreshTokenModel = mongoose.Document & {
    token: string,
    userId: string
}