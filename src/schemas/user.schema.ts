import mongoose, { Schema } from "mongoose";
import { UserDocument, UserModel } from "@models/user.model";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import isInt from "validator/lib/isInt";
import bcrypt from "bcryptjs";
import { USER_ROLE, USER_STATUS } from "@shared/constants";

export const passwordValidation = (password: string) => {
  return isLength(password, { min: 6 });
};

const usernameValidation = (username: string) => {
  return isLength(username, { min: 6 });
};

export const isStudentId = (stringToValidate: string) => {
  if (isInt(stringToValidate) && stringToValidate.length === 8) return true;
  return false;
};

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true },
      validate: [isEmail, "Invalid email!"],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: {
      type: String,
      required: true,
      index: { unique: true },
      validate: [
        usernameValidation,
        "Username must have at least 6 characters!",
      ],
    },
    password: {
      type: String,
      required: true,
      validate: [
        passwordValidation,
        "Password must have at least 6 characters!",
      ],
    },
    provider: { type: String, default: "local" },
    studentId: {
      type: String,
      validate: [isStudentId, "Student Id can only contain 8 digits!"],
    },
    hasInputStudentId: { type: Boolean, default: false },
    status: {
      type: String,
      default: USER_STATUS.UNACTIVATED,
    },
    role: {
      type: String,
      default: USER_ROLE.MEMBER,
    },
    notifications: {
      type: [Object],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = function (
  this: UserModel,
  password: string
) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model<UserDocument>("users", UserSchema);
