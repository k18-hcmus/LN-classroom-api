import { UserModel } from "@models/user.model"
import * as classroomService from "@services/classroom.service"
import * as roleService from "@services/role.service"
import { Role } from "@services/role.service"
import { UNEXPECTED_ERROR } from '@shared/constants'
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { get } from 'lodash'


const checkPermission = (role: Role) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classId = get(req.params, 'classId')
            if (classId) {
                const classroom = await classroomService.getClassroomById(classId)
                if (classroom) {
                    const user = req.user as UserModel
                    const isPermissionValid = roleService.isRoleSastified(role, user._id, classroom)
                    if (isPermissionValid) {
                        req.body.classroom = classroom
                        return next()
                    }
                    return res.status(StatusCodes.BAD_REQUEST).send(UNEXPECTED_ERROR);
                }
                return res.status(StatusCodes.BAD_REQUEST).send(UNEXPECTED_ERROR);
            }
            return res.status(StatusCodes.BAD_REQUEST).send(UNEXPECTED_ERROR);

        } catch (err) {
            console.error(err)
            return res.status(StatusCodes.BAD_REQUEST).send(UNEXPECTED_ERROR);
        }
    }



export default checkPermission;