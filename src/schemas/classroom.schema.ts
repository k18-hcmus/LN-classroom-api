import mongoose, { Schema } from "mongoose";
import { ClassroomModel } from "@models/classroom.model";

const ClassroomSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    schoolYear: { type: String, required: true },
    teachers: {
      type: [{ type: mongoose.Types.ObjectId, ref: "users" }],
      required: true,
    },
    students: {
      type: [{ type: mongoose.Types.ObjectId, ref: "users" }],
      required: true,
    },
    classCode: { type: String, required: true, index: { unique: true } },
    description: { type: String },
    gradeStructure: {
      type: mongoose.Types.ObjectId,
      ref: "grade-structures",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ClassroomModel>("classrooms", ClassroomSchema);
