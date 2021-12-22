import { GradeStructureModel } from "@models/grade-structure.model";
import mongoose, { Schema } from "mongoose";
import gradeStructureDetailSchema from "./grade-structure-detail.schema";
import { isStudentId } from "./user.schema";

const GradeStructureSchema: Schema = new Schema(
  {
    studentId: {
      type: String,
      validate: [isStudentId, "Student Id can only contain 8 digits!"],
      index: { unique: true },
      require: true,
    },
    classId: { type: mongoose.Types.ObjectId, ref: "classrooms" },
    fullName: { type: String, require: true },
    grade: [
      {
        _id: false,
        gradeStructureDetail: {
          type: mongoose.Types.ObjectId,
          ref: gradeStructureDetailSchema,
        },
        point: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<GradeStructureModel>(
  "grade-boards",
  GradeStructureSchema
);
