import mongoose from "mongoose"

export type GradeStructureModel = mongoose.Document & {
    classId: mongoose.Types.ObjectId,
    gradeStructuresDetails: mongoose.Types.ObjectId[]
}