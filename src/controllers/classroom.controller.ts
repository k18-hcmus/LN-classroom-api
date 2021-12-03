import * as classroomService from "@services/classroom.service";
import * as gradeStructureService from "@services/grade-structures.service";
import { Request, Response } from "express";
import { ClassroomModel } from "@models/classroom.model";
import { StatusCodes } from "http-status-codes";
import { INVITATION_EMAIL_ERROR, UNEXPECTED_ERROR } from "@shared/constants";
import { UserModel } from "@models/user.model";
import { stringToBoolean } from "@shared/functions";
import { mapRoleToClassrooms, Role } from "@services/role.service";
import { get } from "lodash";

export const getAllClassroomByUserId = async (req: Request, res: Response) => {
    const { _id } = req.user as unknown as UserModel
    const classrooms = await classroomService.getClassroomByUserId(_id)
    const result = {} as { enrolledClassrooms: any, teachingClassrooms: any }
    result.enrolledClassrooms = mapRoleToClassrooms(_id, classrooms.enrolledClassrooms)
    result.teachingClassrooms = mapRoleToClassrooms(_id, classrooms.teachingClassrooms)
    res.json(result)
}

export const createClassroom = async (req: Request, res: Response) => {
    const classroom = req.body as unknown as ClassroomModel
    const result = await classroomService.createClassroom({
        name: classroom.name,
        ownerId: classroom.ownerId,
        schoolYear: classroom.schoolYear,
        teachersId: [classroom.ownerId],
        studentsId: [],
        description: classroom.description
    } as unknown as ClassroomModel)

    res.json({ ...result, role: Role.OWNER })
}

interface InviteToClassromParams {
    isStudent: boolean,
    classroomName: string,
    email: string
}

export const inviteToClassromByEmail = async (req: Request, res: Response) => {
    const payload = req.body as unknown as InviteToClassromParams
    const classroom = req.body.classroom
    const result = await classroomService.inviteToClassromByEmail({ ...payload, classId: classroom.id })
    res.json({ isSent: result })
}

export const getInviteLink = (req: Request, res: Response) => {
    const classroom = req.body.classroom
    const { isStudent } = req.query as unknown as { isStudent: string }
    const inviteLink = classroomService.createInviteLink(classroom.id, stringToBoolean(isStudent))
    res.json(inviteLink)
}

export const joinClassByLink = async (req: Request, res: Response) => {
    const { token } = req.body as unknown as { token: string }
    const result = classroomService.verifyInviteToken(token)
    if (result) {
        const user = req.user as UserModel
        const { classId, isStudent } = result;
        const newClass = await classroomService.addNewUserToClassroom(user._id, classId, isStudent)
        if (newClass) {
            return res.json({ id: newClass._id })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({ message: INVITATION_EMAIL_ERROR })
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: INVITATION_EMAIL_ERROR })
}

export const resetClassCode = async (req: Request, res: Response) => {
    const classroom = req.body.classroom
    const result = await classroomService.resetClasscode(classroom)
    if (result) {
        return res.json(result)
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR })
}

export const joinClassroomByClassCode = async (req: Request, res: Response) => {
    const { classCode } = req.body as unknown as { classCode: string }
    const user = req.user as UserModel
    const classroom = await classroomService.getClassroomByClassCode(classCode)
    if (classroom) {
        const isUserInClassrom = classroomService.isUserInClassrom(user._id, classroom)
        if (!isUserInClassrom) {
            const result = await classroomService.addNewUserToClassroom(user._id, classroom._id, true)
            return res.json({ ...result, role: Role.STUDENT })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR })
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR })
}

export const removeFromClassroom = async (req: Request, res: Response) => {
    const { userId } = req.params
    const { isStudent } = req.body as unknown as { isStudent: boolean }
    const classroom = req.body.classroom
    const result = await classroomService.removeFromClassroom(classroom, userId, isStudent)
    if (result) {
        return res.json({ studentsId: result.studentsId, teachersId: result.teachersId })
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR })
}

export const getGradeStructure = async (req: Request, res: Response) => {
    const classroom = req.body.classroom
    const result = await gradeStructureService.getClassroomGradeStructure(classroom.id)
    return res.json(get(result, 'gradeStructuresDetails', []))
}