import mongoose from "mongoose";
import { NotificationModel } from "./notification.model";

export type UserModel = mongoose.Document & {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  provider: string;
  studentId?: string;
  hasInputStudentId: boolean;
  status?: string;
  role?: string;
  notifications?: NotificationModel[];
};

export interface UserDocument extends UserModel {
  comparePassword: (password: string) => boolean;
}
