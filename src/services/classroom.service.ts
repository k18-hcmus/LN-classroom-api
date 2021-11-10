import { ClassroomModel } from '@models/classroom.model'
import Classroom from '@schemas/classroom.schema'

export const getAll = async () => {
    return await Classroom.find().exec()
}

export const createClassroom = async (classroom: ClassroomModel) => {
    return await new Classroom(classroom).save()
}


