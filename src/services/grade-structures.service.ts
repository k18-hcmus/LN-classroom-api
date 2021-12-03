import gradeStructureSchema from "@schemas/grade-structure.schema";

export const getClassroomGradeStructure = async (classId: string) => {
    return gradeStructureSchema.findOne({classId}).populate('gradeStructuresDetails').exec()
}