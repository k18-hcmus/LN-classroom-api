import { ClassroomModel } from "@models/classroom.model";
import { NotificationModel } from "@models/notification.model";
import { PostModel } from "@models/post.model";
import { UserModel } from "@models/user.model";
import userSchema from "@schemas/user.schema";
import { stringToObjectId } from "@shared/functions";
import { v4 as uuidv4 } from "uuid";

export const createCommentPayload = (
  firstName: string,
  lastName: string,
  postName: string,
  className: string
) => {
  let result = `<b>${firstName} ${lastName}</b>`;
  result += ` has comment on `;
  result += `<b>${postName}</b> of <b>${className}</b>`;
  return result;
};

export const createPostPayload = (
  firstName: string,
  lastName: string,
  postName: string,
  className: string
) => {
  let result = `<b>${firstName} ${lastName}</b>`;
  result += ` has create a review called `;
  result += `<b>${postName}</b> of <b>${className}</b>`;
  return result;
};

export const createFinalizeReviewPayload = (
  firstName: string,
  lastName: string,
  postName: string,
  className: string
) => {
  let result = `<b>${firstName} ${lastName}</b>`;
  result += ` has finalized the point review on `;
  result += `<b>${postName}</b> of <b>${className}</b>`;
  return result;
};

export const createFinalizePayload = (
  homeworkTitle: string,
  className: string
) => {
  let result = `<b>${homeworkTitle}</b>`;
  result += ` of <b>${className}</b>`;
  result += ` has been finalized `;
  return result;
};

export const createCommentNotification = (
  user: UserModel,
  post: PostModel,
  classroom: ClassroomModel
) => {
  return {
    id: uuidv4(),
    userId: user._id,
    payload: createCommentPayload(
      user.firstName,
      user.lastName,
      post.title,
      classroom.name
    ),
    path: `/classrooms/${classroom._id}/posts/${post._id}`,
    hasSeen: false,
  } as NotificationModel;
};

export const createFinalizeNotification = (
  user: UserModel,
  homeworkTitle: string,
  classroom: ClassroomModel
) => {
  return {
    id: uuidv4(),
    userId: user._id,
    payload: createFinalizePayload(homeworkTitle, classroom.name),
    path: `/classrooms/${classroom._id}`,
    hasSeen: false,
  } as NotificationModel;
};

export const createPostNotification = (
  user: UserModel,
  classroom: ClassroomModel,
  post: PostModel
) => {
  return {
    id: uuidv4(),
    userId: user._id,
    payload: createPostPayload(
      user.firstName,
      user.lastName,
      post.title,
      classroom.name
    ),
    path: `/classrooms/${classroom._id}/posts/${post._id}`,
    hasSeen: false,
  } as NotificationModel;
};

export const createFinalizeReviewNotification = (
  user: UserModel,
  classroom: ClassroomModel,
  post: PostModel
) => {
  return {
    id: uuidv4(),
    userId: user._id,
    payload: createFinalizeReviewPayload(
      user.firstName,
      user.lastName,
      post.title,
      classroom.name
    ),
    path: `/classrooms/${classroom._id}/posts/${post._id}`,
    hasSeen: false,
  } as NotificationModel;
};

export const createNotifications = (
  notification: NotificationModel,
  receiversId: string[]
) => {
  return userSchema
    .updateMany(
      { _id: { $in: receiversId } },
      { $push: { notifications: notification } }
    )
    .exec();
};

export const markSeenNotification = (userId: string, notiId: string) => {
  return userSchema
    .findByIdAndUpdate(
      userId,
      { $set: { "notifications.$[elem].hasSeen": true } },
      { arrayFilters: [{ "elem.id": notiId }] }
    )
    .exec();
};
