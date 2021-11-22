import { ClassroomModel } from "@models/classroom.model"
import * as classroomService from "@services/classroom.service"

export enum Role {
    OWNER = 'owner',
    STUDENT = 'student',
    TEACHER = 'teacher',
    ANY = 'any',
    UPPER_ROLE = 'upper_role'
}

export const isRoleSastified = (role: Role, userId: string, classroom: ClassroomModel) => {
    switch (role) {
        case Role.ANY:
            return classroomService.isUserInClassrom(userId, classroom)
        case Role.UPPER_ROLE:
            return (classroomService.isUserTeacher(userId, classroom) || classroomService.isUserOwner(userId, classroom))
        case Role.OWNER:
            return classroomService.isUserOwner(userId, classroom)
        case Role.TEACHER:
            return classroomService.isUserTeacher(userId, classroom)
        case Role.STUDENT:
            return classroomService.isUserStudent(userId, classroom)

    }
}

export const getUserRoleInClass = (userId: string, classroom: ClassroomModel) => {
    if (classroomService.isUserOwner(userId, classroom))
        return Role.OWNER
    if (classroomService.isUserTeacher(userId, classroom))
        return Role.TEACHER
    if (classroomService.isUserStudent(userId, classroom))
        return Role.STUDENT

}

export const mapRoleToClassrooms = (userId: string, classrooms: ClassroomModel[]) => {
    const result = classrooms.map(classroom => {
        return { ...classroom.toObject(), role: getUserRoleInClass(userId, classroom) }
    })

    return result
}