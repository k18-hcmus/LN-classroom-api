import { PostModel } from "../models/post.model";
import mongoose, { Schema } from "mongoose";
import gradeStructureDetailSchema from "./grade-structure-detail.schema";

const PostSchema: Schema = new Schema({
  idHomework: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: gradeStructureDetailSchema,
  },
  idStudent: { type: String, required: true },
  comments: { type: [Object] },
  pointReview: { type: Number, required: true },
  currentPoint: { type: Number, required: true },
  finalizedPoint: { type: Number, default: 0 },
  isFinalized: { type: Boolean, default: false },
  explain: { type: String, required: true },
  title: { type: String, required: true },
});

export default mongoose.model<PostModel>("post", PostSchema);
