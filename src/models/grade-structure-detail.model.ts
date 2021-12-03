import mongoose from "mongoose"

export type GradeStructureDetailModel = mongoose.Document & {
    gradeStructureId: string,
    structId: mongoose.Types.ObjectId,
    title: string,
    description: string,
    point: number
}