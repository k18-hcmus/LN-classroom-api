import { GradeBoardModel } from "@models/grade-board.model";
import gradeBoardSchema from "@schemas/grade-board.schema";
import { stringToObjectId } from "@shared/functions";

export const appendStudentList = (data: GradeBoardModel[], classId: string) => {
    return gradeBoardSchema.bulkWrite(
        data.map((datum) => ({
            updateOne: {
                filter: { studentId: datum.studentId, classId },
                update: { $set: datum },
                upsert: true
            }
        })), { ordered: false })
}

const getQueries = (data: any[], classId: string, gradeDetailId: string) => {
    const result: any[] = []
    for (const datum of data) {
        result.push(
            {
                updateOne: {
                    filter: {
                        studentId: datum.studentId, classId,
                        "grade.gradeStructureDetail": { $ne: stringToObjectId(gradeDetailId) }
                    },
                    update: { $addToSet: { grade: { gradeStructureDetail: stringToObjectId(gradeDetailId), point: parseFloat(datum.point) } } },
                }
            })
        result.push({
            updateOne: {
                filter: { studentId: datum.studentId, classId },
                update: { $set: { "grade.$[elem]": { gradeStructureDetail: stringToObjectId(gradeDetailId), point: parseFloat(datum.point) } } },
                arrayFilters: [{ "elem.gradeStructureDetail": stringToObjectId(gradeDetailId), }],
            }
        })
    }

    return result
}

export const updateGradeList = (data: any[], classId: string, gradeDetailId: string) => {
    return gradeBoardSchema.bulkWrite(getQueries(data, classId, gradeDetailId))
}

export const getGradeBoard = (classId: string) => {
    return gradeBoardSchema.find({ classId }).lean().exec()
}

export const getStudentGradeBoard = (studentId: string, classId: string) => {
    return gradeBoardSchema.findOne({ studentId, classId }).lean().exec()
}

export const updateStudentPoint = (classId: string, studentId: string, gradeDetailId: string, point: number) => {
    return gradeBoardSchema.updateOne({ classId, studentId, "grade.gradeStructureDetail": stringToObjectId(gradeDetailId) },
        { $set: { "grade.$[elem].point": point } },
        { arrayFilters: [{ "elem.gradeStructureDetail": stringToObjectId(gradeDetailId) }] }).lean().exec()
}