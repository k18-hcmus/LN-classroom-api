import { ClassroomModel } from "@models/classroom.model";
import { PostModel } from "@models/post.model";
import ClassroomSchema from "@schemas/classroom.schema";
import {
  INVITATION_EMAIL_EXPIRED,
  INVITATION_EMAIL_SUBJECT,
  JWT_SECRET,
  VIEWS,
} from "@shared/constants";
import { stringToObjectId } from "@shared/functions";
import { prepareHtmlContent, sendMailWithHtml } from "@utils/mailer";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import randomstring from "randomstring";
import PostSchema from "@schemas/post.schema";

const secretOrKey = process.env.JWT_SECRET_KEY || JWT_SECRET;

export const getAll = async () => {
  try {
    return ClassroomSchema.find({})
      .populate("owner")
      .populate("teachers")
      .populate("students")
      .populate("gradeStructure")
      .populate({
        path: "gradeStructure",
        populate: {
          path: "gradeStructuresDetails",
          model: "grade-structure-details",
        },
      })
      .exec();
  } catch (err) {
    console.log(err);
  }
};

const getClassroomsByUserId = async (filter: any) => {
  try {
    return ClassroomSchema.find(filter)
      .populate("owner")
      .populate("teachers")
      .populate("students")
      .populate("gradeStructure")
      .populate({
        path: "gradeStructure",
        populate: {
          path: "gradeStructuresDetails",
          model: "grade-structure-details",
        },
      })
      .exec();
  } catch (err) {
    console.log(err);
  }
};

export const getClassroomInfoById = async (classId: string) => {
  return await ClassroomSchema.findById(classId)
    .populate("owner")
    .populate("teachers")
    .populate("students")
    .populate("gradeStructure")
    .populate({
      path: "gradeStructure",
      populate: {
        path: "gradeStructuresDetails",
        model: "grade-structure-details",
      },
    })
    .exec();
};

export const getAllByUserIdAndRole = async (userId: string) => {
  const id = stringToObjectId(userId);
  const enrolledClassrooms = await getClassroomsByUserId({ students: id });
  const teachingClassrooms = await getClassroomsByUserId({ teachers: id });

  return {
    enrolledClassrooms,
    teachingClassrooms,
  };
};

export const removeFromClassroom = async (
  classroom: ClassroomModel,
  userId: string,
  isStudent: boolean
) => {
  if (classroom) {
    if (isUserOwner(userId, classroom)) {
      return null;
    }
    if (isStudent) {
      classroom.students = classroom.students.filter(
        (ids) => ids.toString() !== userId
      );
    } else {
      classroom.teachers = classroom.teachers.filter(
        (ids) => ids.toString() !== userId
      );
    }
    return await classroom.save();
  }
  return null;
};

const createClassCode = async () => {
  let result;
  let classCode;
  do {
    classCode = randomstring.generate(8);
    result = await ClassroomSchema.findOne({ classCode });
  } while (result);
  return classCode;
};

export const createClassroom = async (classroom: ClassroomModel) => {
  classroom.classCode = await createClassCode();
  return await new ClassroomSchema(classroom).save();
};

export const updateClassroom = async (classroom: ClassroomModel) => {
  return await ClassroomSchema.findByIdAndUpdate(classroom._id, classroom);
};
interface InviteToClassromParams {
  isStudent: boolean;
  classId: string;
  classroomName: string;
  email: string;
}

export const inviteToClassromByEmail = async (
  payload: InviteToClassromParams,
  url: string
) => {
  try {
    const { isStudent, classId, classroomName, email } = payload;
    const inviteLink = createInviteLink(url, classId, isStudent);
    const data = {
      classroomName,
      role: isStudent ? "Student" : "Teacher",
      inviteLink,
    };
    const html = prepareHtmlContent(VIEWS.INVITATION, data);
    await sendMailWithHtml(INVITATION_EMAIL_SUBJECT, email, html);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const createInviteLink = (
  url: string,
  classId: string,
  isStudent: boolean
) => {
  const token = jwt.sign({ classId, isStudent }, secretOrKey, {
    expiresIn: INVITATION_EMAIL_EXPIRED,
  });

  return `${url}/invite/${token}`;
};

export const verifyInviteToken = (token: string) => {
  try {
    const decodeData = jwt.verify(token, secretOrKey);
    const classId = get(decodeData, "classId");
    const isStudent = get(decodeData, "isStudent");
    return { classId, isStudent };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getClassroomById = async (classId: string) => {
  return ClassroomSchema.findById(classId).exec();
};

export const getClassroomByClassCode = async (classCode: string) => {
  return ClassroomSchema.findOne({ classCode }).exec();
};

export const resetClasscode = async (classroom: ClassroomModel) => {
  const classCode = await createClassCode();
  if (classroom) {
    classroom.classCode = classCode;
    return await classroom.save();
  }
  return null;
};

export const addNewUserToClassroom = async (
  userId: string,
  classroom: ClassroomModel,
  isStudent: boolean
) => {
  if (classroom) {
    if (isUserInClassrom(userId, classroom)) {
      return null;
    }
    const id = stringToObjectId(userId);

    if (isStudent) {
      classroom.students.push(id);
    } else {
      classroom.teachers.push(id);
    }
    return await classroom.save();
  }
  return null;
};

export const isUserInClassrom = (userId: string, classroom: ClassroomModel) => {
  return (
    isUserOwner(userId, classroom) ||
    isUserStudent(userId, classroom) ||
    isUserTeacher(userId, classroom)
  );
};

export const isUserStudent = (userId: string, classroom: ClassroomModel) => {
  return classroom.students.some(
    (studentId) => studentId.toString() === userId.toString()
  );
};

export const isUserTeacher = (userId: string, classroom: ClassroomModel) => {
  return classroom.teachers.some(
    (teacherId) => teacherId.toString() === userId.toString()
  );
};

export const isUserOwner = (userId: string, classroom: ClassroomModel) => {
  return classroom.owner.toString() === userId.toString();
};

export const addPost = async (payload: PostModel) => {
  return await new PostSchema(payload).save();
};

export const getPostByStudentId = async (idStudent: string) => {
  return await PostSchema.find({ idStudent }).populate("idHomework").exec();
};

export const getPostById = async (id: string) => {
  return await PostSchema.findById(id).populate("idHomework").exec();
};

export const getPosts = async () => {
  return await PostSchema.find({}).populate("idHomework").exec();
};

export const addCommentPost = async (
  id: string,
  idPerson: string,
  content: string
) => {
  return PostSchema.findByIdAndUpdate(
    id,
    { $push: { comments: { idPerson, content } } },
    {
      new: true,
    }
  ).exec();
};

export const finalizedPost = async (id: string, finalizedPoint: number) => {
  return PostSchema.findByIdAndUpdate(
    id,
    { finalizedPoint, isFinalized: true },
    {
      new: true,
    }
  ).exec();
};
