import { GradeStructureModel } from "@models/grade-structure.model";
import mongoose, { Schema } from "mongoose";
import gradeStructureDetailSchema from "@schemas/grade-structure-detail.schema";

const GradeStructureSchema: Schema = new Schema(
  {
    gradeStructuresDetails: {
      type: [
        { type: mongoose.Types.ObjectId, ref: gradeStructureDetailSchema },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<GradeStructureModel>(
  "grade-structures",
  GradeStructureSchema
);
