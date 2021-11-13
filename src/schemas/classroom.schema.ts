import mongoose, { Schema } from "mongoose";
import { ClassroomModel } from "@models/classroom.model";

const ClassroomSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        ownerId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
        schoolYear: { type: String, required: true },
        teachersId: { type: [{ type: mongoose.Types.ObjectId, ref: 'users' }], required: true },
        studentsId: { type: [{ type: mongoose.Types.ObjectId, ref: 'users' }], required: true },
        description: { type: String },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<ClassroomModel>('classrooms', ClassroomSchema)