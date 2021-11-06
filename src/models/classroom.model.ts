import mongoose from "mongoose"

export type ClassroomModel = mongoose.Document & {
    name: string,
    ownerId: string,
    teachersId: string[],
    studentsId: string[],
    description?: string,
}