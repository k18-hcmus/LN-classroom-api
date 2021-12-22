import { ClassroomModel } from "@models/classroom.model";
import { UserModel } from "@models/user.model";

declare module "express" {
  export interface Request {
    body: {
      user: UserModel;
      classroom: ClassroomModel;
    };
  }
}
