import * as classroomService from "@services/classroom.service";
import { Request, Response } from "express";
import { ClassroomModel } from "@models/classroom.model";


export const getAllClassroom = async (req: Request, res: Response) => {
    const classroom = await classroomService.getAll()
    res.json(classroom)
}

export const createClassroom = async (req: Request, res: Response) => {
    const { name, ownerId, description } = req.body as unknown as ClassroomModel
    const result = await classroomService.createClassroom(name, ownerId, description)
    res.json(result)
}