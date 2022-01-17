import mongoose from "mongoose";
import { Comment } from "./comment.model";

export type PostModel = mongoose.Document & {
  idHomework: string;
  idStudent: string;
  comments: Comment[];
  pointReview: number;
  explain: string;
  currentPoint: number;
  title: string;
  finalizedPoint?: number;
  isFinalized: boolean;
};
