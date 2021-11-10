import * as classroomService from "@services/classroom.service";
import { Request, Response } from "express";
import { ClassroomModel } from "@models/classroom.model";


export const getAllClassroom = async (req: Request, res: Response) => {
    const classroom = await classroomService.getAll()
    res.json(classroom)
}

export const createClassroom = async (req: Request, res: Response) => {
    const classroom = req.body as unknown as ClassroomModel
    const result = await classroomService.createClassroom({
        name: classroom.name,
        ownerId: classroom.ownerId,
        schoolYear: classroom.schoolYear,
        teachersId: [classroom.ownerId],
        studentsId: [],
        description: classroom.description
    } as unknown as ClassroomModel)
    res.json(result)
}