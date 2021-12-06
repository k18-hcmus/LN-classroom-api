import { GradeStructureModel } from "@models/grade-structure.model";
import gradeStructureSchema from "@schemas/grade-structure.schema";

export const getGradeStructure = async (id: string | undefined) => {
    return gradeStructureSchema.findById(id).populate('gradeStructuresDetails').exec()
}

export const createGradeStructure = async (payload: any) => {
    return await new gradeStructureSchema(payload).save()
}

export const addNewGradeStructureDetail = async (id: string | undefined, opt: string) => {
    return await gradeStructureSchema.findByIdAndUpdate(id, { "$push": { gradeStructuresDetails: opt } }, {
        new: true
    }).exec()
}

export const updateGradeStructure = async (gradeStructure: GradeStructureModel) => {
    return await gradeStructureSchema.findByIdAndUpdate(gradeStructure._id, gradeStructure, {
        new: true
    }).exec()
}

export const deleteGradeStructureDetail = async (gradeId: string, gradeDetailId: string) => {
    const gradeStructures = await gradeStructureSchema.findById(gradeId).exec();
    if (gradeStructures) {
        const gradeStructuresDetails = gradeStructures.gradeStructuresDetails
        const newGradeStruct = gradeStructuresDetails!.filter(grades => grades.toString() !== gradeDetailId)
        return await gradeStructureSchema.findByIdAndUpdate(gradeId, { gradeStructuresDetails: newGradeStruct }, {
            new: true
        }).exec()
    }
}