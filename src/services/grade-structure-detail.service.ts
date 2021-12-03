import gradeStructureDetailSchema from "@schemas/grade-structure-detail.schema";

export const createStructureDetail = async (payload: any) => {
    return new gradeStructureDetailSchema(payload).save()
}