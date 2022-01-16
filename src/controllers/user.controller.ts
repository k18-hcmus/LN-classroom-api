import { UserModel } from "@models/user.model";
import * as userService from "@services/user.service";
import {
  INVALID_BAN,
  STUDENT_ID_EXISTED_ERROR,
  UNEXPECTED_ERROR,
  UPDATE_USER_FAILED,
  USER_ROLE,
  USER_STATUS,
} from "@shared/constants";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get, isEmpty } from "lodash";

interface UpdateProfileParams {
  firstName: string;
  lastName: string;
  studentId: string;
}

export const getAll = async (req: Request, res: Response) => {
  if (req.query.role === USER_ROLE.MEMBER) {
    const result = await userService.getAllMember();
    return res.json(result);
  }
  if (req.query.role === USER_ROLE.ADMIN) {
    const result = await userService.getAllAdmin();
    return res.json(result);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { firstName, lastName, studentId } =
    req.body as unknown as UpdateProfileParams;
  const user = req.body.user as UserModel;
  const isStudentIdInvalid = await userService.isStudentIdInvalid(
    user,
    studentId
  );
  if (!isStudentIdInvalid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: STUDENT_ID_EXISTED_ERROR });
  }
  const result = await userService.updateUser(user._id, {
    firstName,
    lastName,
    studentId,
    hasInputStudentId: true,
  });
  if (result) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...response } = result.toObject();
    return res.json(response);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UPDATE_USER_FAILED });
};

export const changePassword = async (req: Request, res: Response) => {
  const { newPassword, oldPassword } = req.body as unknown as {
    newPassword: string;
    oldPassword: string;
  };
  const user = req.body.user as UserModel;
  const isPasswordValid = userService.comparePassword(user, oldPassword);
  if (isPasswordValid) {
    const result = await userService.changePassword(user._id, newPassword);
    return res.json(result);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UPDATE_USER_FAILED });
};

export const getUserById = async (req: Request, res: Response) => {
  const id = get(req.params, "id");
  const user = await userService.getUserById(id);
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...response } = user.toObject();
    return res.json(response);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const getUserByStudentId = async (req: Request, res: Response) => {
  const studentId = get(req.params, "studentId");
  const student = await userService.getStudentByStudentId(studentId);
  if (student) {
    return res.json(student);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const banUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const targetUser = await userService.getUserById(id);
  if (targetUser) {
    if (targetUser.status === USER_STATUS.UNACTIVATED) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: INVALID_BAN });
    }
    const result = await userService.updateUser(targetUser._id, {
      status:
        targetUser.status === USER_STATUS.BANNED
          ? USER_STATUS.ACTIVATED
          : USER_STATUS.BANNED,
    });
    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...response } = result.toObject();
      return res.json(response);
    }
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UPDATE_USER_FAILED });
};

export const changeStudentId = async (req: Request, res: Response) => {
  const id = req.params.id;
  const targetUser = await userService.getUserById(id);
  if (targetUser) {
    const { studentId } = req.body as unknown as { studentId: string };

    if (targetUser.studentId === studentId) {
      return res.json(targetUser);
    }

    const isStudentIdInvalid =
      await userService.isStudentIdInvalidForAdminChange(studentId);
    if (isStudentIdInvalid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: STUDENT_ID_EXISTED_ERROR });
    }
    const result = await userService.updateUser(targetUser._id, {
      studentId,
      hasInputStudentId: !isEmpty(studentId),
    });
    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...response } = result.toObject();
      return res.json(response);
    }
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UPDATE_USER_FAILED });
};

export const createAdminUser = async (req: Request, res: Response) => {
  const registerUser = req.body as unknown as UserModel;
  const validationResult = await userService.validateNewUser(registerUser);
  if (validationResult) {
    return res.status(StatusCodes.BAD_REQUEST).json(validationResult);
  }
  const result = await userService.createUser({
    firstName: registerUser.firstName,
    lastName: registerUser.lastName,
    username: registerUser.username,
    email: registerUser.email,
    password: registerUser.password,
    status: USER_STATUS.ACTIVATED,
    role: USER_ROLE.ADMIN,
  } as UserModel);
  res.json({ _id: result._id });
};
