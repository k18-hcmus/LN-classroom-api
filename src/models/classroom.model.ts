import mongoose from "mongoose";

export type ClassroomModel = mongoose.Document & {
  name: string;
  owner: mongoose.ObjectId;
  schoolYear: string;
  teachers: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
  classCode: string;
  gradeStructure?: mongoose.Types.ObjectId;
  description?: string;
};
