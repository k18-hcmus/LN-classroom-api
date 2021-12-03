import { GradeStructureDetailModel } from "@models/grade-structure-detail.model";
import mongoose, { Schema } from "mongoose";

const GradeStructureDetailSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        point: { type: Number, required: true },
        gradeStructureId: { type: mongoose.Types.ObjectId, ref: 'grade-structures', required: true },

    },
    {
        timestamps: true
    }
)

export default mongoose.model<GradeStructureDetailModel>('grade-structure-details', GradeStructureDetailSchema)