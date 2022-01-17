import mongoose from "mongoose";

export type NotificationModel = mongoose.Document & {
  id: string;
  userId: mongoose.Types.ObjectId;
  payload: string;
  hasSeen: boolean;
  path: string;
};
