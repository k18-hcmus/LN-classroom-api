import mongoose from "mongoose"

export type GradeStructureDetailModel = mongoose.Document & {
    title: string,
    description: string,
    point: number
}