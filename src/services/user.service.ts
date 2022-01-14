import { UserModel } from "@models/user.model";
import User from "@schemas/user.schema";
import {
  EMAIL_EXISTED_ERROR,
  JWT_SECRET,
  MAIL_VERIFICATION_SUBJECT,
  USERNAME_EXISTED_ERROR,
  USER_ROLE,
  VIEWS,
} from "@shared/constants";
import { prepareHtmlContent, sendMailWithHtml } from "@utils/mailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secretOrKey = process.env.JWT_SECRET_KEY || JWT_SECRET;

export const getAllMember = async () => {
  return await User.find({ role: USER_ROLE.MEMBER }).exec();
};

export const getAllAdmin = async () => {
  return await User.find({ role: USER_ROLE.ADMIN }).exec();
};

export const getUserById = async (id: string) => {
  return await User.findById(id).exec();
};

export const encryptPassword = (password: string) => {
  return bcrypt.hashSync(password);
};

export const createUser = async (user: UserModel) => {
  user.password = encryptPassword(user.password);
  return await new User(user).save();
};

export const updateUser = async (userId: string, opts: any) => {
  return await User.findByIdAndUpdate(userId, opts, {
    new: true,
  }).exec();
};

export const validateNewUser = async (user: UserModel) => {
  const result = { email: "", username: "" };
  const email = await User.findOne({ email: user.email }).exec();
  const username = await User.findOne({ username: user.username }).exec();
  if (email || username) {
    email && (result.email = EMAIL_EXISTED_ERROR);
    username && (result.username = USERNAME_EXISTED_ERROR);
    return result;
  }
  return null;
};

export const isStudentIdInvalid = async (
  user: UserModel,
  studentId: string
) => {
  const result = await User.findOne({ studentId: studentId }).exec();
  if (result) {
    return (
      result._id.toString() === user.id &&
      result.studentId === studentId &&
      result.hasInputStudentId
    );
  }
  return !user.hasInputStudentId;
};

export const isStudentIdInvalidForAdminChange = async (studentId: string) => {
  const result = await User.findOne({ studentId: studentId }).exec();
  return result ? true : false;
};

export const comparePassword = (user: UserModel, password: string) => {
  return bcrypt.compareSync(password, user.password);
};

export const getStudentByStudentId = async (studentId: string) => {
  const result = await User.findOne({ studentId: studentId }).exec();
  if (result) {
    return result;
  }
  return null;
};

export const createConfirmLink = (url: string, email: string) => {
  const token = jwt.sign({ email }, secretOrKey);

  return `${url}/confirm?token=${token}`;
};

export const sendAccountVerification = async (email: string, url: string) => {
  try {
    const inviteLink = createConfirmLink(url, email);
    const html = prepareHtmlContent(VIEWS.CONFIRM_EMAIl, { inviteLink });
    await sendMailWithHtml(MAIL_VERIFICATION_SUBJECT, email, html);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
