import { UserDocument, UserModel } from "@models/user.model";

declare module 'express' {
    export interface Request {
        body: {
            user: UserModel,
            role: string;
        };
    }
}
