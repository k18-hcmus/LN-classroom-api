import { GradeStructureModel } from "@models/grade-structure.model";
import mongoose, { Schema } from "mongoose";
import gradeStructureDetailSchema from "@schemas/grade-structure-detail.schema";

const GradeStructureSchema: Schema = new Schema(
    {
        classId: { type: mongoose.Types.ObjectId, ref: 'classrooms', required: true },
        gradeStructuresDetails: { type: [{ type: mongoose.Types.ObjectId, ref: gradeStructureDetailSchema }], required: true },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<GradeStructureModel>('grade-structures', GradeStructureSchema)