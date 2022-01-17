import { ClassroomModel } from "@models/classroom.model";
import { GradeStructureDetailModel } from "@models/grade-structure-detail.model";
import { GradeStructureModel } from "@models/grade-structure.model";
import { UserModel } from "@models/user.model";
import * as classroomService from "@services/classroom.service";
import * as gradeStructureDetailService from "@services/grade-structure-detail.service";
import * as gradeStructureService from "@services/grade-structures.service";
import * as gradeBoardService from "@services/grade-board.service";
import { getUserRoleInClass } from "@services/role.service";
import {
  DEFAULT_URL,
  INVITATION_EMAIL_ERROR,
  SUCCESSFULLY_MESSAGE,
  UNEXPECTED_ERROR,
} from "@shared/constants";
import { stringToBoolean } from "@shared/functions";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import { GradeBoardModel } from "@models/grade-board.model";
import { PostModel } from "@models/post.model";

export const getAllClassroom = async (req: Request, res: Response) => {
  const classrooms = await classroomService.getAll();
  res.json(classrooms);
};

export const getAllClassroomByUserId = async (req: Request, res: Response) => {
  const { _id } = req.body.user as unknown as UserModel;
  const classrooms = await classroomService.getAllByUserIdAndRole(_id);
  res.json(classrooms);
};

export const getClassroom = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const result = await classroomService.getClassroomInfoById(classroom._id);
  res.json(result);
};

export const createClassroom = async (req: Request, res: Response) => {
  const classroom = req.body as unknown as ClassroomModel;
  const result = await classroomService.createClassroom({
    name: classroom.name,
    owner: classroom.owner,
    schoolYear: classroom.schoolYear,
    teachers: [classroom.owner],
    students: [],
    description: classroom.description,
  } as unknown as ClassroomModel);

  res.json(result);
};

interface InviteToClassromParams {
  isStudent: boolean;
  classroomName: string;
  email: string;
}

export const inviteToClassromByEmail = async (req: Request, res: Response) => {
  const payload = req.body as unknown as InviteToClassromParams;
  const classroom = req.body.classroom;
  const url = req.get("origin") || DEFAULT_URL;
  const result = await classroomService.inviteToClassromByEmail(
    { ...payload, classId: classroom.id },
    url
  );
  res.json({ isSent: result });
};

export const getInviteLink = (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const { isStudent } = req.query as unknown as { isStudent: string };
  const url = req.get("origin") || DEFAULT_URL;
  const inviteLink = classroomService.createInviteLink(
    url,
    classroom.id,
    stringToBoolean(isStudent)
  );
  res.json(inviteLink);
};

export const joinClassByLink = async (req: Request, res: Response) => {
  const { token } = req.body as unknown as { token: string };
  const result = classroomService.verifyInviteToken(token);
  if (result) {
    const user = req.body.user as UserModel;
    const { classId, isStudent } = result;
    const classroom = await classroomService.getClassroomById(classId);
    const newClass = await classroomService.addNewUserToClassroom(
      user._id,
      classroom!,
      isStudent
    );
    if (newClass) {
      return res.json({ id: newClass._id });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: INVITATION_EMAIL_ERROR });
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: INVITATION_EMAIL_ERROR });
};

export const resetClassCode = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const result = await classroomService.resetClasscode(classroom);
  if (result) {
    return res.json(result);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const joinClassroomByClassCode = async (req: Request, res: Response) => {
  const { classCode } = req.body as unknown as { classCode: string };
  const user = req.body.user as UserModel;
  const classroom = await classroomService.getClassroomByClassCode(classCode);
  if (classroom) {
    const isUserInClassrom = classroomService.isUserInClassrom(
      user._id,
      classroom
    );
    if (!isUserInClassrom) {
      const result = await classroomService.addNewUserToClassroom(
        user._id,
        classroom,
        true
      );
      return res.json(result);
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: UNEXPECTED_ERROR });
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const removeFromClassroom = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { isStudent } = req.body as unknown as { isStudent: boolean };
  const classroom = req.body.classroom;
  const result = await classroomService.removeFromClassroom(
    classroom,
    userId,
    isStudent
  );
  if (result) {
    return res.json({ students: result.students, teachers: result.teachers });
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const getRole = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const user = req.body.user;
  const result = await getUserRoleInClass(user._id, classroom);
  return res.json(result);
};

export const getGradeStructure = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const result = await gradeStructureService.getGradeStructure(classroom.id);
  return res.json(get(result, "gradeStructuresDetails", []));
};

export const addGradeStructure = async (req: Request, res: Response) => {
  const gradeStructDetail = req.body as unknown as GradeStructureDetailModel;
  const classroom = req.body.classroom as ClassroomModel;
  let gradeStructureId = classroom.gradeStructure?.toString();
  const gradeStructure = await gradeStructureService.getGradeStructure(
    gradeStructureId
  );
  if (!gradeStructure) {
    const newGradeStructure = await gradeStructureService.createGradeStructure({
      gradeStructuresDetails: [],
    });
    classroom.gradeStructure = newGradeStructure.id;
    gradeStructureId = newGradeStructure.id;
    await classroomService.updateClassroom(classroom);
  }

  const payload = {
    title: gradeStructDetail.title,
    description: gradeStructDetail.description,
    point: gradeStructDetail.point,
  };
  const gradeDetail = await gradeStructureDetailService.createStructureDetail(
    payload
  );
  await gradeStructureService.addNewGradeStructureDetail(
    gradeStructureId,
    gradeDetail._id
  );

  res.json(gradeDetail);
};

export const removeGradeStructureDetail = async (
  req: Request,
  res: Response
) => {
  const gradeDetailId = req.params.gradeDetailId;
  const gradeStructureId = req.body.classroom.gradeStructure!.toString();
  await gradeStructureService.deleteGradeStructureDetail(
    gradeStructureId,
    gradeDetailId
  );
  await gradeStructureDetailService.deleteStructureDetail(gradeDetailId);
  return res.json({ message: SUCCESSFULLY_MESSAGE });
};

export const updateGradeStructureDetail = async (
  req: Request,
  res: Response
) => {
  const gradeDetailId = req.params.gradeDetailId;
  const gradeStructDetailToUpdate =
    req.body as unknown as GradeStructureDetailModel;
  const result = await gradeStructureDetailService.updateStructureDetail(
    gradeDetailId,
    gradeStructDetailToUpdate
  );
  return res.json(result);
};

export const updateGradeStructure = async (req: Request, res: Response) => {
  const gradeStructureToUpdate = req.body as unknown as GradeStructureModel;
  const result = await gradeStructureService.updateGradeStructure(
    gradeStructureToUpdate
  );
  return res.json(result);
};

export const appendListStudent = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const { data } = req.body as unknown as { data: GradeBoardModel[] };
  const result = await gradeBoardService.appendStudentList(data, classroom.id);
  if (result) {
    return res.json(result);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const getGradeBoard = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const result = await gradeBoardService.getGradeBoard(classroom.id);
  if (result) {
    return res.json(result);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const getStudentGradeBoard = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const studentId = req.params.studentId;
  const result = await gradeBoardService.getStudentGradeBoard(
    studentId,
    classroom.id
  );
  if (result) {
    return res.json(result);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

interface GradeListPayload {
  point: number;
  studentId: string;
}

export const updateGradeList = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const gradeDetailId = req.params.gradeDetailId;

  const { data } = req.body as unknown as { data: GradeListPayload[] };
  const result = await gradeBoardService.updateGradeList(
    data,
    classroom.id,
    gradeDetailId
  );
  if (result) {
    return res.json(result);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const updateStudentPoint = async (req: Request, res: Response) => {
  const classroom = req.body.classroom;
  const gradeDetailId = req.params.gradeDetailId;

  const { data } = req.body as unknown as {
    data: { point: number; studentId: string };
  };
  const result = await gradeBoardService.updateStudentPoint(
    classroom.id,
    data.studentId,
    gradeDetailId,
    data.point
  );
  if (result) {
    return res.json(result);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const addPointReview = async (req: Request, res: Response) => {
  const { data } = req.body as unknown as { data: PostModel };
  data.comments = [];
  const result = await classroomService.addPost(data);
  res.json(result);
};

export const getPostsByIdStudent = async (req: Request, res: Response) => {
  const idStudent = req.params.idStudent;
  const result = await classroomService.getPostByStudentId(idStudent);
  res.json(result);
};

export const getReviewPostById = async (req: Request, res: Response) => {
  const idPost = req.params.idPost;
  console.log(idPost);
  const result = await classroomService.getPostById(idPost);
  res.json(result);
};

export const getPostByClassId = async (req: Request, res: Response) => {
  const classId = req.params.classId;
  const classroom = await classroomService.getClassroomById(classId);
  const idGradeStructure = classroom!.gradeStructure;
  if (idGradeStructure) {
    const homeworks = await gradeStructureService.getGradeStructure(
      idGradeStructure!.toString()
    );
    const idHomeworks = homeworks!.gradeStructuresDetails.map((homework) =>
      homework._id.toString()
    );
    const posts = await classroomService.getPosts();
    const teacherPosts = posts.filter((post) =>
      idHomeworks.includes(post.idHomework)
    );
    return res.json(teacherPosts);
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message: UNEXPECTED_ERROR });
};

export const addCommentByPostId = async (req: Request, res: Response) => {
  const { idPost, idPerson, content } = req.body as unknown as {
    idPost: string;
    idPerson: string;
    content: string;
  };
  const result = await classroomService.addCommentPost(
    idPost,
    idPerson,
    content
  );
  res.json(result);
};

export const finalizedPost = async (req: Request, res: Response) => {
  const idPost = req.params.idPost;
  const { point } = req.body as unknown as { point: number };
  const result = await classroomService.finalizedPost(idPost, point);
  res.json(result);
};
