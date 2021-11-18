import * as classroomService from "@services/classroom.service";
import { Request, Response } from "express";
import { ClassroomModel } from "@models/classroom.model";
import { StatusCodes } from "http-status-codes";
import { INVITATION_EMAIL_ERROR } from "@shared/constants";
import { UserModel } from "@models/user.model";
import { stringToBoolean } from "@shared/functions";

export const getAllClassroom = async (req: Request, res: Response) => {
    const classroom = await classroomService.getAll()
    res.json(classroom)
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
    res.json(result)
}

interface InviteToClassromParams {
    isStudent: boolean,
    classId: string,
    classroomName: string,
    email: string
}

export const inviteToClassromByEmail = async (req: Request, res: Response) => {
    const payload = req.body as unknown as InviteToClassromParams
    const result = await classroomService.inviteToClassromByEmail(payload)
    res.json({ isSent: result })
}

export const getInviteLink = (req: Request, res: Response) => {
    const { classId, isStudent } = req.query as unknown as { classId: string, isStudent: string }
    const inviteLink = classroomService.createInviteLink(classId, stringToBoolean(isStudent))
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