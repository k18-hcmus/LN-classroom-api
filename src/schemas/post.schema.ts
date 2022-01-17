import { PostModel } from "../models/post.model"
import mongoose, { Schema } from "mongoose";

const PostSchema: Schema = new Schema(
    {
        idHomework: { type: String, required: true },
        idStudent: { type: String, required: true },
        comments: { type: [Object] },
        pointReview: { type: Number, required: true },
        explain: { type: String, required: true },
        title: { type: String, required: true },
    }
)

export default mongoose.model<PostModel>(
    "post",
    PostSchema
)