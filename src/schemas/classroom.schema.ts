import mongoose, { Schema } from "mongoose";
import { ClassroomModel } from "@models/classroom.model";

const ClassroomSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        ownerId: { type: mongoose.Types.ObjectId, required: true },
        teachersId: { type: [mongoose.Types.ObjectId], required: true },
        studentsId: { type: [mongoose.Types.ObjectId], required: true },
        description: { type: String },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<ClassroomModel>('classrooms', ClassroomSchema)