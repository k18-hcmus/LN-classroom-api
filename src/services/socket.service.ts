import { ClassroomModel } from "@models/classroom.model";
import { NotificationModel } from "@models/notification.model";
import { PostModel } from "@models/post.model";
import { UserModel } from "@models/user.model";
import http from "http";
import { Server } from "socket.io";
import {
  createCommentNotification,
  createNotifications,
  createFinalizeNotification,
  markSeenNotification,
  createPostNotification,
  createFinalizeReviewNotification,
} from "./notification.service";

interface ServerToClientEvents {
  pushNotification: (notification: NotificationModel) => void;
}

interface ClientToServerEvents {
  newUser: (userId: string) => void;
  sendCommentNotification: (
    payload: {
      user: UserModel;
      post: PostModel;
      classroom: ClassroomModel;
    },
    receivers: string[]
  ) => void;
  sendFinalizeNotification: (
    payload: {
      user: UserModel;
      homeworkTitle: string;
      classroom: ClassroomModel;
    },
    receivers: string[]
  ) => void;
  sendFinalizeReviewNotification: (
    payload: {
      user: UserModel;
      classroom: ClassroomModel;
      post: PostModel;
    },
    receivers: string[]
  ) => void;
  sendPostNotification: (
    payload: {
      user: UserModel;
      classroom: ClassroomModel;
      post: PostModel;
    },
    receivers: string[]
  ) => void;
  markSeen: (userId: string, notificationId: string) => void;
}

interface InterServerEvents {
  noop: () => void;
}

interface SocketData {
  userId: string;
}

let onlineUsers: { userId: string; socketId: string }[] = [];

const addNewUser = (userId: string, socketId: string) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getSocketReceivers = (userIds: string[]) => {
  return onlineUsers
    .filter((user) => userIds.includes(user.userId))
    .map((user) => user.socketId);
};

export const createSocketService = (server: http.Server) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    allowRequest: (req, callback) => {
      callback(null, true);
    },
  });

  io.on("connection", (socket) => {
    socket.on("newUser", (userId) => {
      addNewUser(userId, socket.id);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });

    socket.on("markSeen", (userId, notificationId) => {
      markSeenNotification(userId, notificationId);
    });

    socket.on(
      "sendCommentNotification",
      async ({ post, user, classroom }, receivers) => {
        const notification = createCommentNotification(user, post, classroom);
        await createNotifications(notification, receivers);
        const socketsReceivers = getSocketReceivers(receivers);
        io.to(socketsReceivers).emit("pushNotification", notification);
      }
    );

    socket.on(
      "sendFinalizeNotification",
      async ({ homeworkTitle, user, classroom }, receivers) => {
        const notification = createFinalizeNotification(
          user,
          homeworkTitle,
          classroom
        );
        await createNotifications(notification, receivers);
        const socketsReceivers = getSocketReceivers(receivers);
        io.to(socketsReceivers).emit("pushNotification", notification);
      }
    );

    socket.on(
      "sendPostNotification",
      async ({ post, user, classroom }, receivers) => {
        const notification = createPostNotification(user, classroom, post);
        await createNotifications(notification, receivers);
        const socketsReceivers = getSocketReceivers(receivers);
        io.to(socketsReceivers).emit("pushNotification", notification);
      }
    );

    socket.on(
      "sendFinalizeReviewNotification",
      async ({ post, user, classroom }, receivers) => {
        const notification = createFinalizeReviewNotification(
          user,
          classroom,
          post
        );
        await createNotifications(notification, receivers);
        const socketsReceivers = getSocketReceivers(receivers);
        io.to(socketsReceivers).emit("pushNotification", notification);
      }
    );
  });
};
