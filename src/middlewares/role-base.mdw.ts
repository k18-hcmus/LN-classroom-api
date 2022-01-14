import { UserModel } from "@models/user.model";
import * as classroomService from "@services/classroom.service";
import * as roleService from "@services/role.service";
import { Role } from "@services/role.service";
import { UNEXPECTED_ERROR, USER_ROLE } from "@shared/constants";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const checkPermission =
  (role: Role, allowAdmin = true) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classId = req.params.classId;
      if (classId) {
        const classroom = await classroomService.getClassroomById(classId);
        if (classroom) {
          const user = req.body.user as UserModel;
          const isAdminAllow = allowAdmin && user.role === USER_ROLE.ADMIN;
          const isPermissionValid =
            isAdminAllow ||
            roleService.isRoleSastified(role, user._id, classroom);
          if (isPermissionValid) {
            req.body.classroom = classroom;
            return next();
          }
          return res.status(StatusCodes.FORBIDDEN).send(UNEXPECTED_ERROR);
        }
        return res.status(StatusCodes.FORBIDDEN).send(UNEXPECTED_ERROR);
      }
      return res.status(StatusCodes.FORBIDDEN).send(UNEXPECTED_ERROR);
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.FORBIDDEN).send(UNEXPECTED_ERROR);
    }
  };

export default checkPermission;
