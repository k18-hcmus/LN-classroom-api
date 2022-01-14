import mongoose from "mongoose";

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
};

export interface UserDocument extends UserModel {
  comparePassword: (password: string) => boolean;
}
