import mongoose, { Schema } from "mongoose";
import { ClassroomModel } from "@models/classroom.model";

const ClassroomSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
<<<<<<< HEAD
        ownerId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
        schoolYear: { type: String, required: true },
        teachersId: { type: [{ type: mongoose.Types.ObjectId, ref: 'users' }], required: true },
        studentsId: { type: [{ type: mongoose.Types.ObjectId, ref: 'users' }], required: true },
=======
        ownerId: { type: mongoose.Types.ObjectId, required: true },
        schoolYear: { type: String, required: true },
        teachersId: { type: [mongoose.Types.ObjectId], required: true },
        studentsId: { type: [mongoose.Types.ObjectId], required: true },
>>>>>>> 5c3d53f7580cb87d3ca0d7036430e4f227a921d5
        description: { type: String },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<ClassroomModel>('classrooms', ClassroomSchema)