import Classroom from '@schemas/classroom.schema'
import mongoose from 'mongoose'

export const getAll = async () => {
    return await Classroom.find().exec()
}

export const createClassroom = async (name: string, ownerId: string, description: string | undefined) => {
    const classroom = new Classroom({
        _id: new mongoose.Types.ObjectId(),
        teachersId: [ownerId],
        description: description,
        name, ownerId,
    })
    return await classroom.save()
}


