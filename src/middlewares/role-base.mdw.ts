import { UserModel } from "@models/user.model"
import { Role } from "@services/role.service"
import { UNAUTHORIZE_MESSAGE } from '@shared/constants'
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { get } from 'lodash'
import * as classroomService from "@services/classroom.service"
import * as roleService from "@services/role.service"


const checkPermission = (role: Role) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classId = get(req.body, 'classId') || get(req.query, 'classId')
            if (classId) {
                const classroom = await classroomService.getClassroomById(classId)
                if (classroom) {
                    const user = req.user as UserModel
                    const isPermissionValid = roleService.isRoleSastified(role, user._id, classroom)
                    if (isPermissionValid) {
                        return next()
                    }
                    return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
                }
                return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
            }
            return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);

        } catch (err) {
            console.error(err)
            return res.status(StatusCodes.UNAUTHORIZED).send(UNAUTHORIZE_MESSAGE);
        }
    }



export default checkPermission;