import gradeStructureSchema from "@schemas/grade-structure.schema";

export const getClassroomGradeStructure = async (classId: string) => {
    return gradeStructureSchema.findOne({ classId }).populate('gradeStructuresDetails').exec()
}

export const createGradeStructure = async (payload: any) => {
    return await new gradeStructureSchema(payload).save()
}

export const updateGradeStructure = async (classId: string, opt: string) => {
    return await gradeStructureSchema.findOneAndUpdate({ classId }, { "$push": { gradeStructuresDetails: opt } }, {
        new: true
    }).exec()
}

export const deleteGradeStructure = async (classId: string, gradeId: string) => {
    const gradeStructuresDetails = await gradeStructureSchema.findOne({ classId }).exec();
    const gradeStruct = gradeStructuresDetails!.gradeStructuresDetails
    const newGradeStruct = gradeStruct!.filter(grades => grades.id.toString() !== gradeId)
    return await gradeStructureSchema.findOneAndUpdate({ classId }, { gradeStructuresDetails: newGradeStruct }, {
        new: true
    }).exec()
}