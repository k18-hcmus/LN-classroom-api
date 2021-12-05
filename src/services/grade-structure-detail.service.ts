import gradeStructureDetailSchema from "@schemas/grade-structure-detail.schema";

export const createStructureDetail = async (payload: any) => {
    return await new gradeStructureDetailSchema(payload).save()
}

export const deleteStructureDetail = async (payload: string) => {
    return await gradeStructureDetailSchema.deleteOne({_id:payload})
}

export const updateStructureDetail = async (gradeId:string,payload:any)=>{
    return await gradeStructureDetailSchema.findOneAndUpdate({_id:gradeId},{title:payload.title,description:payload.description,point:payload.pont})
}