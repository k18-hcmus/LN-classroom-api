import mongoose from "mongoose"

export type GradeStructureModel = mongoose.Document & {
    gradeStructuresDetails: mongoose.Types.ObjectId[]
}