import { ClassroomModel } from '@models/classroom.model'
import Classroom from '@schemas/classroom.schema'
import { prepareHtmlContent, sendMailWithHtml } from "@utils/mailer";
import { INVITATION_EMAIL_EXPIRED, INVITATION_EMAIL_SUBJECT, JWT_SECRET, VIEWS } from "@shared/constants";
import jwt from 'jsonwebtoken'
import { get } from 'lodash';

const secretOrKey = process.env.JWT_SECRET_KEY || JWT_SECRET


export const getAll = async () => {
    return await Classroom.find().exec()
}

export const createClassroom = async (classroom: ClassroomModel) => {
    return await new Classroom(classroom).save()
}

export const updateClassroom = async (classroom: ClassroomModel) => {
    return await Classroom.findByIdAndUpdate(classroom._id, classroom)
}
interface InviteToClassromParams {
    isStudent: boolean,
    classId: string,
    classroomName: string,
    email: string
}

export const inviteToClassromByEmail = async (payload: InviteToClassromParams) => {
    try {
        const { isStudent, classId, classroomName, email } = payload
        const inviteLink = createInviteLink(classId, isStudent);
        const data = {
            classroomName,
            role: isStudent ? 'Student' : 'Teacher',
            inviteLink
        }
        const html = prepareHtmlContent(VIEWS.INVITATION, data)
        await sendMailWithHtml(INVITATION_EMAIL_SUBJECT, email, html)
        return true
    } catch (err) {
        console.log(err);
        return false
    }

}

export const createInviteLink = (classId: string, isStudent: boolean) => {
    const token = jwt.sign({ classId, isStudent }, secretOrKey, {
        expiresIn: INVITATION_EMAIL_EXPIRED
    })
    const { CLIENT_HOST, CLIENT_PORT } = process.env

    return `${CLIENT_HOST}:${CLIENT_PORT}/invite/${token}`
}

export const verifyInviteToken = (token: string) => {
    try {
        const decodeData = jwt.verify(token, secretOrKey)
        const classId = get(decodeData, "classId")
        const isStudent = get(decodeData, "isStudent")
        return { classId, isStudent };
    } catch (err) {
        console.error(err)
        return null;
    }
}

export const getClassroomById = async (classId: string) => {
    return Classroom.findById(classId).exec()
}

export const addNewUserToClassroom = async (userId: string, classId: string, isStudent: boolean) => {
    const classroom = await getClassroomById(classId);
    if (classroom) {
        if (isUserInClassrom(userId, classroom)) {
            return null
        }
        if (isStudent) {
            classroom.studentsId.push(userId)
        } else {
            classroom.teachersId.push(userId)
        }
        return await classroom.save()
    }
    return null
}

export const isUserInClassrom = (userId: string, classroom: ClassroomModel) => {
    return classroom.ownerId.toString() === userId.toString() ||
        classroom.studentsId.some((studentId) => studentId.toString() === userId.toString()) ||
        classroom.teachersId.some((teacherId) => teacherId.toString() === userId.toString())
}