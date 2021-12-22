import mongoose from "mongoose";

export type GradeBoardModel = mongoose.Document & {
  studentId: string;
  classId: mongoose.Types.ObjectId;
  fullName: string;
  grade?: {
    gradeStructureDetail: mongoose.Types.ObjectId;
    point: number;
  }[];
};
