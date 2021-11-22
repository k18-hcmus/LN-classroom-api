import mongoose from "mongoose"

export type ClassroomModel = mongoose.Document & {
    name: string,
    ownerId: mongoose.ObjectId,
    schoolYear: string,
    teachersId: mongoose.Types.ObjectId[],
    studentsId: mongoose.Types.ObjectId[],
    classCode: string,
    description?: string,
}